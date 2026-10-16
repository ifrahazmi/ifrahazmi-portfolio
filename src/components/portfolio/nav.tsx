"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems, profile } from "./data";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(navItems[0].id);
  const progressRef = useRef<HTMLDivElement>(null);

  // Scroll progress bar + lifted header state.
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight || 1;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${Math.min(1, doc.scrollTop / max)})`;
      }
      setScrolled(doc.scrollTop > 28);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-60 h-[2px] bg-transparent">
        <div
          ref={progressRef}
          className="h-full origin-left scale-x-0 bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400"
        />
      </div>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "border-b border-slate-800/60 bg-[#05070f]/80 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="group flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/25 transition-transform duration-300 group-hover:scale-105">
              {profile.initials}
            </span>
            <span className="font-display text-sm font-semibold tracking-tight text-slate-100">
              {profile.name}
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm transition-colors duration-300",
                  active === item.id ? "text-white" : "text-slate-400 hover:text-slate-100",
                )}
              >
                {active === item.id && (
                  <span className="absolute inset-0 rounded-full border border-sky-400/25 bg-sky-400/10" />
                )}
                <span className="relative">{item.label}</span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={profile.resume}
              download
              className="hidden items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 ring-1 ring-slate-700/70 transition-all duration-300 hover:bg-sky-500/15 hover:ring-sky-400/50 sm:inline-flex"
            >
              <Download className="h-4 w-4" />
              Résumé
            </a>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-slate-200 ring-1 ring-slate-700/70 transition-colors hover:text-white md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="border-t border-slate-800/60 bg-[#05070f]/95 px-5 pt-2 pb-5 backdrop-blur-xl md:hidden">
            <div className="flex flex-col">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={profile.resume}
                download
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-sky-500/15 px-3 py-3 text-sm font-medium text-sky-200"
              >
                <Download className="h-4 w-4" />
                Download résumé
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
