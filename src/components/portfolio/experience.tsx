"use client";

import type { CSSProperties } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { experiences, type ExperienceRole } from "./data";
import { FeatureIcon } from "./icons";
import { Reveal, SectionHeading, SpotlightCard } from "./motion";

/** Bullet list used for role highlights and client-project detail. */
function Bullets({ points, className }: { points: string[]; className?: string }) {
  return (
    <ul className={className ?? "mt-3 space-y-1.5"}>
      {points.map((point, index) => (
        <li
          key={point}
          style={{ "--i": index } as CSSProperties}
          className="stagger-li flex gap-2.5 text-[0.82rem] leading-relaxed text-slate-400"
        >
          <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-sky-400/70" />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

/** Splits "Jan 2026 — Present" into its two halves. */
function periodParts(period: string) {
  const [start, end] = period.split("—").map((part) => part.trim());
  return { start, end: end ?? "" };
}

/**
 * The date anchor of a timeline entry: a bright pill that stays readable on the
 * dark surface at every breakpoint, with the current role called out in emerald.
 */
function PeriodBadge({ role }: { role: ExperienceRole }) {
  const { start, end } = periodParts(role.period);
  return (
    <span
      className={cn(
        "font-mono-ui inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.7rem] font-medium tracking-[0.1em] whitespace-nowrap uppercase backdrop-blur",
        role.current
          ? "border-emerald-400/35 bg-emerald-400/12 text-emerald-100 shadow-[0_0_26px_-10px_rgba(52,211,153,0.9)]"
          : "border-sky-400/30 bg-sky-400/10 text-sky-100 shadow-[0_0_26px_-14px_rgba(56,189,248,0.9)]",
      )}
    >
      <CalendarDays className="h-3.5 w-3.5 shrink-0 opacity-80" />
      <span>{start}</span>
      <span aria-hidden className="text-slate-500">
        —
      </span>
      <span className={role.current ? "text-emerald-300" : "text-sky-300"}>{end}</span>
      {role.current && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
      )}
    </span>
  );
}

/** Gradient date mark — the visual date on the opposite side of the rail. */
function YearMark({
  role,
  align = "left",
  className,
}: {
  role: ExperienceRole;
  align?: "left" | "right";
  className?: string;
}) {
  const { start } = periodParts(role.period);
  return (
    <div className={cn(align === "right" && "text-right", className)}>
      <p className="timeline-year font-display text-xl font-bold tracking-tight sm:text-2xl">{start}</p>
      <div
        className={cn(
          "mt-2 h-px w-12 bg-gradient-to-r from-sky-400/70 to-transparent",
          align === "right" && "ml-auto bg-gradient-to-l from-sky-400/70 to-transparent",
        )}
      />
      {role.location ? (
        <p
          className={cn(
            "font-mono-ui mt-2 inline-flex items-center gap-1.5 text-[0.68rem] tracking-[0.18em] text-slate-400 uppercase",
            align === "right" && "justify-end",
          )}
        >
          <MapPin className="h-3 w-3 text-sky-400/70" />
          {role.location}
        </p>
      ) : null}
    </div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Journey"
            title="Five years of instruments, protocols and test rigs"
            description="From clinical calibration benches to SCPI-controlled pressure controllers and industrial OT security — each step sharpened how I validate hardware."
          />
        </Reveal>

        <div className="relative">
          {/* Rail */}
          <div className="rail-flow absolute top-2 bottom-2 left-[15px] w-px md:left-1/2 md:-translate-x-1/2" />

          <ol className="space-y-12">
            {experiences.map((item, index) => {
              // Roles with named client projects carry far too much detail for a half-width column,
              // so they break out to full width and read as the featured entry.
              const wide = Boolean(item.projects?.length);
              const isRight = !wide && index % 2 === 1;

              const card = (
                <SpotlightCard className="group ml-10 overflow-hidden p-6 md:ml-0">
                  <span aria-hidden className="shine-bar" />

                  {wide ? (
                    <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
                      <div className="flex items-center gap-3">
                        <span className="tile-float grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-400/12 text-sky-300 ring-1 ring-sky-400/20">
                          <FeatureIcon name={item.icon} className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="font-display text-base font-semibold text-white sm:text-lg">
                            {item.role}
                          </h3>
                          <p className="text-xs text-slate-400 sm:text-sm">{item.company}</p>
                          {item.client && (
                            <p className="font-mono-ui mt-0.5 text-[0.64rem] tracking-[0.12em] text-sky-300/80 uppercase">
                              {item.client}
                            </p>
                          )}
                        </div>
                      </div>

                      <PeriodBadge role={item} />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="tile-float grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-400/12 text-sky-300 ring-1 ring-sky-400/20">
                          <FeatureIcon name={item.icon} className="h-4 w-4" />
                        </span>
                        <div>
                          <h3 className="font-display text-base font-semibold text-white sm:text-lg">
                            {item.role}
                          </h3>
                          <p className="text-xs text-slate-400 sm:text-sm">{item.company}</p>
                          {item.client && (
                            <p className="font-mono-ui mt-0.5 text-[0.64rem] tracking-[0.12em] text-sky-300/80 uppercase">
                              {item.client}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4">
                        <PeriodBadge role={item} />
                      </div>
                    </>
                  )}

                  <p className="mt-4 text-sm leading-relaxed text-slate-400">{item.summary}</p>

                  {item.highlights?.length ? <Bullets points={item.highlights} /> : null}

                  {item.projects?.map((project) => (
                    <div
                      key={project.label}
                      className="mt-5 rounded-xl border border-slate-800/70 bg-slate-950/40 p-4 transition-colors duration-500 hover:border-sky-400/25 sm:p-5"
                    >
                      <p className="font-mono-ui text-[0.64rem] leading-relaxed tracking-[0.14em] text-sky-300/90 uppercase">
                        {project.label}
                      </p>
                      <Bullets points={project.points} />
                    </div>
                  ))}

                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((tag, tagIndex) => (
                      <span
                        key={tag}
                        style={{ "--i": tagIndex + 3 } as CSSProperties}
                        className="stagger-li rounded-full border border-slate-700/60 bg-slate-900/40 px-3 py-1 text-[0.68rem] text-slate-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              );

              return (
                <li key={`${item.company}-${item.period}`} className="relative">
                  {wide ? (
                    <Reveal from="scale">{card}</Reveal>
                  ) : (
                    <div
                      className={`grid items-start gap-6 md:grid-cols-2 ${
                        isRight ? "md:[&>*:first-child]:order-2" : ""
                      }`}
                    >
                      <Reveal
                        from={isRight ? "right" : "left"}
                        className={isRight ? "md:pl-14" : "md:pr-14"}
                      >
                        {card}
                      </Reveal>                        <Reveal
                        from={isRight ? "left" : "right"}
                        delay={120}
                        className={isRight ? "hidden md:block md:pr-14" : "hidden md:block md:pl-14"}
                      >
                        <YearMark role={item} align={isRight ? "right" : "left"} />
                      </Reveal>
                    </div>
                  )}

                  {/* Node — sits on the rail, which passes behind the featured card */}
                  <div className="absolute top-8 left-[15px] md:left-1/2 md:-translate-x-1/2">
                    <span className="relative block h-3.5 w-3.5">
                      {item.current && <span className="node-pulse absolute inset-0 rounded-full" />}
                      <span className="relative block h-3.5 w-3.5 rounded-full border-2 border-[#05070f] bg-gradient-to-br from-sky-300 to-indigo-400 shadow-[0_0_18px_rgba(56,189,248,0.7)]" />
                    </span>
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
