"use client";

import { skillGroups } from "./data";
import { SkillIcon } from "./icons";
import { Reveal, SectionHeading, SpotlightCard } from "./motion";

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Technical arsenal"
            title="Tools I reach for daily"
            description="Nine areas that cover the full loop: write the harness, capture the traffic, break the firmware, report the evidence."
          />
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, index) => (
            <Reveal key={group.title} delay={(index % 3) * 90}>
              <SpotlightCard className="group h-full p-6">
                <div
                  className={`mb-5 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${group.accent} text-sky-200 ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <SkillIcon icon={group.icon} className="h-5 w-5 text-lg" />
                </div>
                <h3 className="font-display text-base font-semibold text-white">{group.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{group.body}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {group.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-slate-700/50 bg-slate-900/50 px-2 py-0.5 text-[0.66rem] text-slate-400 transition-colors duration-300 group-hover:border-sky-400/25 group-hover:text-slate-300"
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
