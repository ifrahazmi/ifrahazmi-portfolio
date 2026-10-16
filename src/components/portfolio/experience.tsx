"use client";

import { experiences } from "./data";
import { FeatureIcon } from "./icons";
import { Reveal, SectionHeading, SpotlightCard } from "./motion";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Journey"
            title="A track record in wireless and embedded QA"
            description="From clinical calibration benches to protocol-level automation — each step sharpened how I validate hardware."
          />
        </Reveal>

        <div className="relative">
          {/* Rail */}
          <div className="absolute top-2 bottom-2 left-[15px] w-px bg-gradient-to-b from-sky-400/60 via-indigo-500/30 to-transparent md:left-1/2 md:-translate-x-1/2" />

          <ol className="space-y-10">
            {experiences.map((item, index) => {
              const isRight = index % 2 === 1;
              return (
                <li key={`${item.role}-${item.period}`} className="relative">
                  <div
                    className={`grid items-start gap-6 md:grid-cols-2 ${
                      isRight ? "md:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <Reveal delay={index * 80} className={isRight ? "md:pl-14" : "md:pr-14"}>
                      <SpotlightCard className="ml-10 p-6 md:ml-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-400/12 text-sky-300 ring-1 ring-sky-400/20">
                              <FeatureIcon name={item.icon} className="h-4 w-4" />
                            </span>
                            <div>
                              <h3 className="font-display text-base font-semibold text-white sm:text-lg">
                                {item.role}
                              </h3>
                              <p className="text-xs text-slate-400 sm:text-sm">{item.company}</p>
                            </div>
                          </div>
                          {item.current && (
                            <span className="shrink-0 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[0.62rem] font-medium tracking-wide text-emerald-300 uppercase">
                              Now
                            </span>
                          )}
                        </div>

                        <p className="font-mono-ui mt-4 text-[0.7rem] tracking-[0.16em] text-sky-300/90 uppercase">
                          {item.period}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.summary}</p>

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

                    {/* Node */}
                    <div className="absolute top-8 left-[15px] md:left-1/2 md:-translate-x-1/2">
                      <span className="relative block h-3.5 w-3.5">
                        {item.current && <span className="node-pulse absolute inset-0 rounded-full" />}
                        <span className="relative block h-3.5 w-3.5 rounded-full border-2 border-[#05070f] bg-gradient-to-br from-sky-300 to-indigo-400 shadow-[0_0_18px_rgba(56,189,248,0.7)]" />
                      </span>
                    </div>

                    <div className={isRight ? "hidden md:block md:pr-14 md:text-right" : "hidden md:block md:pl-14"}>
                      <Reveal delay={index * 80 + 60}>
                        <p className="font-display text-2xl font-bold text-slate-800/90">
                          {item.period.split("—")[0].trim()}
                        </p>
                      </Reveal>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
