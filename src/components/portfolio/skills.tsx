"use client";

import type { CSSProperties } from "react";
import { skillGroups } from "./data";
import { SkillIcon } from "./icons";
import { CountUp, Reveal, SectionHeading, SpotlightCard } from "./motion";

/** Direction each column of the grid drifts in from. */
const columnFrom = ["left", "up", "right"] as const;

export function Skills() {
  const toolCount = skillGroups.reduce((total, group) => total + group.stack.length, 0);

  return (
    <section id="skills" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Technical arsenal"
            title="Tools I reach for daily"
            description="The full loop, end to end: write the harness, drive the instrument, capture the traffic, break the firmware, report the evidence."
          />
        </Reveal>

        <Reveal from="scale" delay={80}>
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            <span className="font-mono-ui inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-400/8 px-4 py-2 text-[0.7rem] tracking-[0.18em] text-sky-200 uppercase">
              <CountUp value={skillGroups.length} className="glow-pulse font-display text-sm font-bold" />
              capability groups
            </span>
            <span className="font-mono-ui inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/50 px-4 py-2 text-[0.7rem] tracking-[0.18em] text-slate-300 uppercase">
              <CountUp
                value={toolCount}
                suffix="+"
                duration={1900}
                className="glow-pulse font-display text-sm font-bold text-white"
              />
              tools in rotation
            </span>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, index) => (
            <Reveal
              key={group.title}
              from={columnFrom[index % 3]}
              delay={(index % 3) * 110}
              className="h-full"
            >
              <SpotlightCard className="group h-full overflow-hidden p-6">
                <span aria-hidden className="shine-bar" />

                <div className="mb-5 flex items-start justify-between gap-3">
                  <div
                    className={`tile-float grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${group.accent} text-sky-200 ring-1 ring-white/10`}
                  >
                    <SkillIcon icon={group.icon} className="h-5 w-5 text-lg" />
                  </div>
                  <span className="font-mono-ui text-[0.68rem] font-medium tracking-[0.24em] text-slate-600 transition-colors duration-500 group-hover:text-sky-400/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="font-display text-base font-semibold text-white">{group.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{group.body}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {group.stack.map((item, itemIndex) => (
                    <span
                      key={item}
                      style={{ "--i": itemIndex } as CSSProperties}
                      className="stagger-li rounded-md border border-slate-700/50 bg-slate-900/50 px-2 py-0.5 text-[0.66rem] text-slate-400 transition-all duration-300 group-hover:border-sky-400/25 group-hover:text-slate-200"
                    >
                      {item}
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
