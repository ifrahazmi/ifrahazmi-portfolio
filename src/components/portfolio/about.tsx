"use client";

import { ArrowUpRight } from "lucide-react";
import { highlights, stats } from "./data";
import { FeatureIcon } from "./icons";
import { CountUp, Reveal, SectionHeading, SpotlightCard } from "./motion";

export function Stats() {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-5 sm:px-8 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Reveal key={stat.label} delay={index * 90}>
          <SpotlightCard className="h-full p-5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-400/12 text-sky-300 ring-1 ring-sky-400/20">
              <FeatureIcon name={stat.icon} className="h-4 w-4" />
            </span>
            <p className="font-display mt-5 text-3xl font-bold text-white sm:text-4xl">
              <CountUp value={stat.value} suffix={stat.suffix} />
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
              description="Two things keep guiding the work: use AI to compress the boring loops, and treat embedded hardware as a system worth measuring properly."
            />
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-2">
            {highlights.map((item, index) => (
              <Reveal key={item.title} delay={index * 120}>
                <SpotlightCard className="edge-glow h-full p-7">
                  <div className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${index === 0 ? "from-sky-400/30 to-indigo-500/10" : "from-indigo-400/30 to-fuchsia-500/10"} text-sky-200 ring-1 ring-white/10`}>
                    <FeatureIcon name={item.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.body}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-700/60 bg-slate-900/40 px-3 py-1 text-[0.68rem] text-slate-400"
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
                    <span className="font-mono-ui absolute -left-px top-0 h-full w-px bg-gradient-to-b from-sky-400/70 to-transparent" />
                    <span className="font-mono-ui text-[0.7rem] tracking-[0.2em] text-sky-400">{item.step}</span>
                    <p className="mt-2 text-sm font-semibold text-slate-100">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.body}</p>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
