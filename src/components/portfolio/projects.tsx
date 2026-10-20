"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { projects } from "./data";
import { FeatureIcon } from "./icons";
import { Reveal, SectionHeading, SpotlightCard } from "./motion";

const kindStyles: Record<string, string> = {
  Independent: "border-fuchsia-400/25 bg-fuchsia-400/10 text-fuchsia-300",
  Work: "border-sky-400/25 bg-sky-400/10 text-sky-300",
};

export function Projects() {
  // Self-built projects first — they carry the most signal about how I work unsupervised.
  const ordered = [...projects].sort((a, b) =>
    a.kind === b.kind ? 0 : a.kind === "Independent" ? -1 : 1,
  );

  return (
    <section id="projects" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Selected work"
            title="Frameworks, dashboards and agents I built"
            description="Two production automation platforms from client work, and two independent builds where the AI and the infrastructure are entirely my own."
          />
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-2">
          {ordered.map((project, index) => (
            <Reveal
              key={project.title}
              from={index % 2 === 0 ? "left" : "right"}
              delay={80}
              className="h-full"
            >
              <SpotlightCard
                className={cn(
                  "group h-full overflow-hidden p-6 sm:p-7",
                  project.kind === "Independent" ? "edge-glow-anim" : "edge-glow",
                )}
              >
                <span aria-hidden className="shine-bar" />
                <div className="flex items-start justify-between gap-4">
                  <span className="tile-float grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-400/25 to-indigo-500/10 text-sky-200 ring-1 ring-white/10">
                    <FeatureIcon name={project.icon} className="h-5 w-5" />
                  </span>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.6rem] font-medium tracking-[0.14em] uppercase ${
                      kindStyles[project.kind] ?? kindStyles.Work
                    }`}
                  >
                    {project.kind}
                  </span>
                </div>

                <h3 className="font-display mt-5 text-lg font-semibold text-white">{project.title}</h3>
                <p className="font-mono-ui mt-1.5 text-[0.66rem] tracking-[0.12em] text-slate-500 uppercase">
                  {project.subtitle}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">{project.blurb}</p>

                <ul className="mt-4 space-y-1.5">
                  {project.points.map((point, pointIndex) => (
                    <li
                      key={point}
                      style={{ "--i": pointIndex } as CSSProperties}
                      className="stagger-li flex gap-2.5 text-[0.82rem] leading-relaxed text-slate-400"
                    >
                      <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-sky-400/70" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tag}
                      style={{ "--i": tagIndex + 5 } as CSSProperties}
                      className="stagger-li rounded-full border border-slate-700/60 bg-slate-900/40 px-3 py-1 text-[0.68rem] text-slate-400 transition-colors duration-300 group-hover:border-sky-400/30 group-hover:text-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
