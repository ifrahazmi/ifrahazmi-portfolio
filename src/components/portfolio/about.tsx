"use client";

import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { beyondTheBench, highlights, stats } from "./data";
import { FeatureIcon } from "./icons";
import { CountUp, Reveal, SectionHeading, SpotlightCard } from "./motion";

export function Stats() {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 sm:px-8 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Reveal key={stat.label} from="scale" delay={index * 90}>
          <SpotlightCard className="group h-full overflow-hidden p-5">
            <span aria-hidden className="shine-bar" />
            <span className="tile-float grid h-9 w-9 place-items-center rounded-xl bg-sky-400/12 text-sky-300 ring-1 ring-sky-400/20">
              <FeatureIcon name={stat.icon} className="h-4 w-4" />
            </span>
            <p className="font-display mt-5 text-3xl font-bold text-white sm:text-4xl">
              <CountUp value={stat.value} suffix={stat.suffix} className="glow-pulse" />
            </p>
            <p className="mt-1 text-xs font-medium text-slate-300 sm:text-sm">{stat.label}</p>
            <p className="mt-0.5 text-[0.7rem] text-slate-500">{stat.hint}</p>
          </SpotlightCard>
        </Reveal>
      ))}
    </div>
  );
}

const workflow = [
  { step: "01", title: "Instrument first", body: "If it can be observed, it can be measured — logs, packets, registers." },
  { step: "02", title: "Automate the boring parts", body: "Flaky manual cycles become deterministic, repeatable suites." },
  { step: "03", title: "Report with evidence", body: "Failing builds ship with captures, traces and a clear next step." },
];

export function Vision() {
  return (
    <section id="about" className="scroll-mt-24 pt-24 pb-8">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Stats />

        <div className="mt-28">
          <Reveal>
            <SectionHeading
              eyebrow="Tech-driven vision"
              title="Engineering that removes the guesswork"
              description="Two things keep guiding the work: use AI to compress the boring loops, and treat embedded and industrial hardware as a system worth measuring properly."
            />
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-2">
            {highlights.map((item, index) => (
              <Reveal key={item.title} from={index % 2 === 0 ? "left" : "right"} delay={index * 110} className="h-full">
                <SpotlightCard className="group edge-glow-anim h-full overflow-hidden p-7">
                  <span aria-hidden className="shine-bar" />
                  <div className={`tile-float mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${index === 0 ? "from-sky-400/30 to-indigo-500/10" : "from-indigo-400/30 to-fuchsia-500/10"} text-sky-200 ring-1 ring-white/10`}>
                    <FeatureIcon name={item.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.body}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((tag, tagIndex) => (
                      <span
                        key={tag}
                        style={{ "--i": tagIndex + 2 } as CSSProperties}
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

          <Reveal delay={120}>
            <SpotlightCard className="mt-5 p-7">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-lg font-semibold text-white">How I run a test cycle</h3>
                <a
                  href="#experience"
                  className="hidden items-center gap-1 text-xs font-medium text-sky-300 transition-colors hover:text-sky-200 sm:inline-flex"
                >
                  See the track record
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {workflow.map((item) => (
                  <div key={item.step} className="relative border-l border-slate-700/70 pl-5">
                    <span aria-hidden className="rail-flow absolute -left-px top-0 h-full w-px" />
                    <span className="font-mono-ui text-[0.7rem] tracking-[0.2em] text-sky-400">{item.step}</span>
                    <p className="mt-2 text-sm font-semibold text-slate-100">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.body}</p>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {beyondTheBench.map((item) => (
                <SpotlightCard key={item.title} className="group h-full overflow-hidden p-7">
                  <span aria-hidden className="shine-bar" />
                  <div className="flex items-center gap-3">
                    <span className="tile-float grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-400/12 text-sky-300 ring-1 ring-sky-400/20">
                      <FeatureIcon name={item.icon} className="h-4 w-4" />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {item.items.map((entry, entryIndex) => (
                      <li
                        key={entry}
                        style={{ "--i": entryIndex } as CSSProperties}
                        className="stagger-li rounded-full border border-slate-700/60 bg-slate-900/40 px-3 py-1 text-[0.68rem] text-slate-400 transition-colors duration-300 group-hover:border-sky-400/30 group-hover:text-slate-200"
                      >
                        {entry}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
