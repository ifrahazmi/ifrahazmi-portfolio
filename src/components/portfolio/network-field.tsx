"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
  phase: number;
};

/** A light packet travelling from one node to a neighbouring one. */
type Pulse = {
  from: number;
  to: number;
  t: number;
  speed: number;
  hue: number;
};

/** Links are drawn between nodes closer than this. */
const LINK_DISTANCE = 152;
/** Nodes inside this radius lean toward the cursor. */
const POINTER_RADIUS = 230;

function makeNode(width: number, height: number): Node {
  const roll = Math.random();
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.24,
    vy: (Math.random() - 0.5) * 0.24,
    r: 0.7 + Math.random() * 1.5,
    hue: roll < 0.12 ? 300 : roll < 0.46 ? 224 : 194,
    phase: Math.random() * Math.PI * 2,
  };
}

/**
 * Full-page canvas field: drifting nodes, proximity links and a soft gravity
 * well around the cursor. Renders a single still frame when the visitor asks
 * for reduced motion, and never allocates gradients inside the link loop.
 */
export function NetworkField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    let width = 0;
    let height = 0;
    let linkDistance = LINK_DISTANCE;
    let nodes: Node[] = [];
    let frame = 0;
    let last = 0;
    let pulses: Pulse[] = [];
    let nextPulse = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const seed = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(96, Math.max(26, (width * height) / 21000)));
      linkDistance = width < 640 ? 118 : LINK_DISTANCE;
      nodes = Array.from({ length: count }, () => makeNode(width, height));
      pulses = [];
      nextPulse = 0;
    };

    /**
     * Links are batched into a handful of colour/alpha buckets so the frame
     * costs ~6 draw calls instead of one stroke per connection.
     */
    const drawLinks = () => {
      const buckets = new Map<string, Path2D>();
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);
          if (distance > linkDistance) continue;
          const hue = Math.round((a.hue + b.hue) / 2 / 40) * 40;
          const alpha = Math.round((1 - distance / linkDistance) * 4) / 4;
          if (alpha <= 0) continue;
          const key = `${hue}:${alpha}`;
          let path = buckets.get(key);
          if (!path) {
            path = new Path2D();
            buckets.set(key, path);
          }
          path.moveTo(a.x, a.y);
          path.lineTo(b.x, b.y);
        }
      }

      ctx.lineWidth = 1;
      buckets.forEach((path, key) => {
        const [hue, alpha] = key.split(":");
        ctx.strokeStyle = `hsla(${hue}, 88%, 68%, ${Number(alpha) * 0.3})`;
        ctx.stroke(path);
      });
    };

    const spawnPulse = () => {
      if (nodes.length < 4 || pulses.length > 9) return;
      const from = Math.floor(Math.random() * nodes.length);
      const a = nodes[from];
      for (let attempt = 0; attempt < 14; attempt += 1) {
        const to = Math.floor(Math.random() * nodes.length);
        if (to === from) continue;
        const b = nodes[to];
        if (Math.hypot(a.x - b.x, a.y - b.y) > linkDistance) continue;
        pulses.push({
          from,
          to,
          t: 0,
          speed: 0.0011 + Math.random() * 0.0007,
          hue: Math.random() < 0.3 ? 300 : 194,
        });
        return;
      }
    };

    /** Light packets sliding along live edges, each with a short trail. */
    const drawPulses = (delta: number) => {
      if (!reduceMotion) {
        pulses = pulses.filter((pulse) => {
          pulse.t += delta * pulse.speed;
          return pulse.t < 1;
        });
      }

      for (const pulse of pulses) {
        const a = nodes[pulse.from];
        const b = nodes[pulse.to];
        for (let trail = 3; trail >= 0; trail -= 1) {
          const t = pulse.t - trail * 0.035;
          if (t < 0 || t > 1) continue;
          const x = a.x + (b.x - a.x) * t;
          const y = a.y + (b.y - a.y) * t;
          ctx.fillStyle = `hsla(${pulse.hue}, 96%, 78%, ${trail === 0 ? 0.95 : 0.32 - trail * 0.07})`;
          ctx.beginPath();
          ctx.arc(x, y, trail === 0 ? 1.9 : 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const drawPointer = () => {
      if (!pointer.active) return;

      ctx.beginPath();
      for (const node of nodes) {
        const dx = node.x - pointer.x;
        const dy = node.y - pointer.y;
        if (Math.hypot(dx, dy) > POINTER_RADIUS) continue;
        ctx.moveTo(pointer.x, pointer.y);
        ctx.lineTo(node.x, node.y);
      }
      ctx.strokeStyle = "hsla(196, 96%, 74%, 0.22)";
      ctx.stroke();

      const halo = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 190);
      halo.addColorStop(0, "hsla(199, 95%, 62%, 0.1)");
      halo.addColorStop(0.45, "hsla(224, 92%, 62%, 0.045)");
      halo.addColorStop(1, "hsla(224, 92%, 62%, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 190, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawNodes = (time: number) => {
      for (const node of nodes) {
        const twinkle = 0.55 + 0.45 * Math.sin(time * 0.0011 + node.phase);
        ctx.fillStyle = `hsla(${node.hue}, 96%, 72%, ${0.16 * twinkle})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r * 3.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `hsla(${node.hue}, 97%, 84%, ${0.5 + 0.4 * twinkle})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const draw = (time: number, delta: number) => {
      ctx.clearRect(0, 0, width, height);

      if (!reduceMotion) {
        for (const node of nodes) {
          node.x += node.vx * delta * 0.06;
          node.y += node.vy * delta * 0.06;

          if (pointer.active) {
            const dx = pointer.x - node.x;
            const dy = pointer.y - node.y;
            const distance = Math.hypot(dx, dy);
            if (distance < POINTER_RADIUS && distance > 1) {
              const pull = (1 - distance / POINTER_RADIUS) * 0.03 * delta * 0.06;
              node.x += (dx / distance) * pull;
              node.y += (dy / distance) * pull;
            }
          }

          if (node.x < -20) node.x = width + 20;
          if (node.x > width + 20) node.x = -20;
          if (node.y < -20) node.y = height + 20;
          if (node.y > height + 20) node.y = -20;
        }
      }

      if (!reduceMotion && time > nextPulse) {
        nextPulse = time + 460 + Math.random() * 520;
        spawnPulse();
      }

      drawLinks();
      drawPulses(delta);
      drawPointer();
      drawNodes(time);
    };

    const step = (time: number) => {
      const delta = Math.min(48, time - last || 16);
      last = time;
      draw(time, delta);
      frame = requestAnimationFrame(step);
    };

    const onMove = (event: MouseEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const onLeave = () => {
      pointer.active = false;
    };

    seed();
    draw(0, 0);

    if (!reduceMotion) {
      frame = requestAnimationFrame(step);
      if (!coarsePointer) {
        window.addEventListener("mousemove", onMove, { passive: true });
        window.addEventListener("mouseout", onLeave, { passive: true });
      }
    }

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        seed();
        if (reduceMotion) draw(0, 0);
      }, 180);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
    />
  );
}
