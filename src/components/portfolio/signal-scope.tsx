"use client";

import { useEffect, useRef } from "react";
import { Activity } from "lucide-react";

type Trace = {
  channel: string;
  label: string;
  color: string;
  amplitude: number;
  frequency: number;
  speed: number;
  noise: number;
  lane: number;
  weight: number;
};

const TRACES: Trace[] = [
  {
    channel: "CH1",
    label: "SCPI",
    color: "#38bdf8",
    amplitude: 0.5,
    frequency: 0.018,
    speed: 1.15,
    noise: 0.7,
    lane: -0.16,
    weight: 1.7,
  },
  {
    channel: "CH2",
    label: "BLE",
    color: "#818cf8",
    amplitude: 0.3,
    frequency: 0.032,
    speed: 1.7,
    noise: 0.5,
    lane: 0.02,
    weight: 1.4,
  },
  {
    channel: "CH3",
    label: "OT",
    color: "#e879f9",
    amplitude: 0.16,
    frequency: 0.055,
    speed: 0.8,
    noise: 0.9,
    lane: 0.2,
    weight: 1.2,
  },
];

/**
 * Oscilloscope-style monitor: three scrolling traces on a gridded panel with
 * a travelling acquisition head. Paused into a still frame for reduced motion.
 */
export function SignalScope() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let underglow: CanvasGradient | null = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (!width || !height) return;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      underglow = ctx.createLinearGradient(0, 0, 0, height);
      underglow.addColorStop(0, "rgba(56, 189, 248, 0.16)");
      underglow.addColorStop(0.55, "rgba(56, 189, 248, 0.03)");
      underglow.addColorStop(1, "rgba(56, 189, 248, 0)");
    };

    const drawGrid = () => {
      const step = width < 640 ? 34 : 46;
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(148, 163, 184, 0.08)";
      ctx.beginPath();
      for (let x = step; x < width; x += step) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
      }
      for (let y = step; y < height; y += step) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
      }
      ctx.stroke();

      ctx.strokeStyle = "rgba(148, 163, 184, 0.16)";
      ctx.beginPath();
      ctx.moveTo(0, height / 2 + 0.5);
      ctx.lineTo(width, height / 2 + 0.5);
      ctx.stroke();
    };

    const draw = (time: number) => {
      if (!width || !height) return;
      ctx.clearRect(0, 0, width, height);
      drawGrid();

      const center = height / 2;
      const headX = ((time * 0.075) % (width + 260)) - 130;

      TRACES.forEach((trace, index) => {
        const amplitude = height * trace.amplitude * 0.5;
        const lane = center + height * trace.lane;
        const phase = (time * 0.001) * trace.speed;

        ctx.beginPath();
        for (let x = 0; x <= width; x += 2) {
          const wave =
            Math.sin(x * trace.frequency + phase) * 0.68 +
            Math.sin(x * trace.frequency * 2.6 - phase * 1.4) * 0.24 +
            Math.sin(x * trace.frequency * 0.35 + phase * 0.6) * 0.34;
          const transient = index === 0 ? Math.exp(-Math.pow((x - headX) / 20, 2)) * 0.5 : 0;
          const grain = (Math.random() - 0.5) * trace.noise;
          const raw = lane + wave * amplitude + transient * amplitude * 0.8 + grain;
          // Channel 3 is sampled as discrete packets, so quantise it into steps.
          const y = index === 2 ? Math.round(raw / 4) * 4 : raw;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        if (index === 0 && underglow) {
          ctx.save();
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.fillStyle = underglow;
          ctx.fill();
          ctx.restore();
        }

        ctx.save();
        ctx.strokeStyle = trace.color;
        ctx.globalAlpha = 0.92;
        ctx.lineWidth = trace.weight;
        ctx.lineJoin = "round";
        ctx.shadowColor = trace.color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
      });

      const sweep = ctx.createLinearGradient(headX - 32, 0, headX + 32, 0);
      sweep.addColorStop(0, "rgba(56, 189, 248, 0)");
      sweep.addColorStop(0.5, "rgba(125, 211, 252, 0.1)");
      sweep.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = sweep;
      ctx.fillRect(headX - 32, 0, 64, height);
    };

    const step = (time: number) => {
      last = time;
      draw(time);
      frame = requestAnimationFrame(step);
    };

    resize();
    draw(0);
    if (!reduceMotion) frame = requestAnimationFrame(step);

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (reduceMotion) draw(0);
      }, 160);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      className="surface edge-glow-anim relative overflow-hidden rounded-2xl"
      style={{ backgroundColor: "rgba(6, 10, 20, 0.85)" }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/5 px-4 py-2.5">
        <span className="font-mono-ui flex items-center gap-2 text-[0.6rem] tracking-[0.24em] text-slate-400 uppercase">
          <Activity className="h-3.5 w-3.5 text-sky-300" />
          Signal monitor
        </span>
        <span className="font-mono-ui hidden text-[0.55rem] tracking-[0.2em] text-slate-500 uppercase sm:inline">
          instrument → framework → evidence
        </span>
        <span className="font-mono-ui inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[0.55rem] tracking-[0.18em] text-emerald-300 uppercase">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Live
        </span>
      </div>
      <div className="relative h-[124px] sm:h-[156px]">
        <canvas ref={canvasRef} aria-hidden className="h-full w-full" />
      </div>
      <div className="font-mono-ui flex items-center justify-between gap-3 border-t border-white/5 px-4 py-2 text-[0.55rem] tracking-[0.16em] text-slate-500 uppercase">
        <span className="flex items-center gap-3">
          {TRACES.map((trace) => (
            <span key={trace.channel} className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: trace.color, boxShadow: `0 0 8px ${trace.color}` }} />
              <span className="text-slate-300">{trace.channel}</span>
              <span className="hidden sm:inline">{trace.label}</span>
            </span>
          ))}
        </span>
        <span className="whitespace-nowrap">1.2 kSa/s · 0 error</span>
      </div>
    </div>
  );
}
