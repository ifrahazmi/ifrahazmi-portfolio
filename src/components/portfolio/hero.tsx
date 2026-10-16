"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Download, Linkedin, Mail, MapPin, Send, Sparkles } from "lucide-react";
import { marqueeItems, profile } from "./data";
import { Reveal } from "./motion";

/**
 * Types and erases the rotating specialisation line.
 * Runs as one continuous cycle so the line is never blank for more than a frame.
 */
function RotatingRole() {
  const [text, setText] = useState<string>(profile.roles[0]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const roles = profile.roles;
    let role = 0;
    let index = roles[0].length;
    let phase: "hold" | "erase" | "type" = "hold";
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      if (phase === "hold") {
        phase = "erase";
        timer = setTimeout(step, 24);
        return;
      }

      if (phase === "erase") {
        index = Math.max(index - 1, 0);
        setText(roles[role].slice(0, index));
        if (index === 0) {
          role = (role + 1) % roles.length;
          phase = "type";
          timer = setTimeout(step, 45);
          return;
        }
        timer = setTimeout(step, 18);
        return;
      }

      const next = roles[role];
      index += 1;
      setText(next.slice(0, index));
      if (index >= next.length) {
        phase = "hold";
        timer = setTimeout(step, 2300);
        return;
      }
      timer = setTimeout(step, 52);
    };

    timer = setTimeout(step, 2300);
    return () => clearTimeout(timer);
  }, []);

  return <span className="caret text-sky-300">{text}</span>;
}

/** Portrait slot: uses /profile.jpg when present, otherwise a designed monogram. */
function Portrait() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [photoOk, setPhotoOk] = useState(true);

  // A 404 can fire before hydration attaches onError, so double-check on mount.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setPhotoOk(false);
  }, []);

  return (
    <div className="relative mx-auto flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80 lg:h-[22rem] lg:w-[22rem]">
      <div className="absolute inset-6 rounded-full bg-gradient-to-br from-sky-500/30 via-indigo-500/20 to-fuchsia-500/25 blur-3xl" />
      <div className="conic-ring absolute inset-0 rounded-full opacity-80" />
      <div className="absolute inset-[3px] overflow-hidden rounded-full bg-[#070b17]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.28),transparent_60%)]" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-display bg-gradient-to-br from-sky-200 via-sky-400 to-indigo-400 bg-clip-text text-6xl font-bold text-transparent sm:text-7xl">
            {profile.initials}
          </span>
        </div>
        {photoOk && (
          <img
            ref={imgRef}
            src={profile.photo}
            alt={profile.name}
            onError={() => setPhotoOk(false)}
            className="relative h-full w-full object-cover"
          />
        )}
      </div>

      <div className="surface-strong float-slow absolute -right-2 bottom-6 flex items-center gap-3 rounded-2xl px-4 py-3 sm:-right-6">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-400/15 text-sky-300">
          <Sparkles className="h-4 w-4" />
        </span>
        <span className="text-left">
          <span className="block text-[0.65rem] tracking-[0.18em] text-slate-400 uppercase">Currently</span>
          <span className="block text-xs font-semibold text-slate-100">{profile.company}</span>
        </span>
      </div>

      <div className="surface-strong float-slower absolute top-4 -left-2 rounded-2xl px-3 py-2 sm:-left-6">
        <span className="font-mono-ui text-[0.7rem] text-slate-300">
          <span className="text-sky-300">4+</span> yrs · BLE / Wi-Fi
        </span>
      </div>
    </div>
  );
}

/** Infinite tech stack marquee. */
export function TechMarquee() {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="mask-fade-x relative overflow-hidden border-y border-slate-800/60 bg-white/[0.015] py-4">
      <div className="marquee-track gap-10">
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-10">
            <span className="font-mono-ui text-xs tracking-[0.2em] text-slate-500 uppercase transition-colors hover:text-sky-300">
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-sky-400/40" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative pt-28 pb-6 sm:pt-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Open to new opportunities
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display mt-6 text-4xl leading-[1.05] font-bold sm:text-6xl lg:text-[4.25rem]">
              <span className="text-gradient text-gradient-sheen">{profile.name}</span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="font-mono-ui mt-5 flex min-h-[1.6rem] items-center text-sm tracking-wide text-slate-300 sm:text-base">
              <RotatingRole />
            </p>
          </Reveal>

          <Reveal delay={200}>
            <p className="font-display mt-6 max-w-xl text-lg leading-snug text-slate-200 sm:text-xl">
              {profile.headline}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">{profile.summary}</p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/40"
              >
                <Send className="h-4 w-4" />
                Let&apos;s talk
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-6 py-3 text-sm font-medium text-slate-100 ring-1 ring-slate-700/70 backdrop-blur transition-all duration-300 hover:bg-white/10 hover:ring-slate-500"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
              <a
                href={profile.resume}
                download
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-slate-300 ring-1 ring-slate-800 transition-all duration-300 hover:text-white hover:ring-sky-400/50"
              >
                <Download className="h-4 w-4" />
                Résumé
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location}
              </span>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-sky-300"
              >
                <Mail className="h-3.5 w-3.5" />
                {profile.email}
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <Portrait />
        </Reveal>
      </div>

      <div className="mt-16">
        <TechMarquee />
      </div>
    </section>
  );
}
