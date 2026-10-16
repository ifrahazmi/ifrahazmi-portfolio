"use client";

import { ArrowUp } from "lucide-react";
import { profile } from "./data";

/** Inline X mark — Font Awesome 6.4 in this project predates the X logo. */
function XMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socials = [
  { href: profile.links.linkedin, icon: "fa-brands fa-linkedin-in", label: "LinkedIn" },
  { href: profile.links.github, icon: "fa-brands fa-github", label: "GitHub" },
  { href: profile.links.x, icon: null, label: "X" },
  { href: profile.links.site, icon: "fa-solid fa-globe", label: "Website" },
  { href: profile.links.facebook, icon: "fa-brands fa-facebook-f", label: "Facebook" },
  { href: profile.links.instagram, icon: "fa-brands fa-instagram", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="relative mt-10 border-t border-slate-800/70 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              title={social.label}
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-800 bg-slate-950/50 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/50 hover:text-sky-300 hover:shadow-lg hover:shadow-sky-500/20"
            >
              {social.icon ? (
                <i className={social.icon} aria-hidden />
              ) : (
                <XMark className="h-3.5 w-3.5" />
              )}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="font-display text-sm text-slate-300">
            {profile.name} · <span className="text-slate-500">{profile.role}</span>
          </p>
          <p className="font-mono-ui text-[0.7rem] tracking-wide text-slate-600">
            © {new Date().getFullYear()} — built with Next.js, Tailwind CSS & a lot of Wireshark
          </p>
        </div>

        <a
          href="#top"
          className="group inline-flex items-center gap-2 rounded-full border border-slate-800 px-4 py-2 text-xs text-slate-400 transition-all duration-300 hover:border-sky-400/40 hover:text-sky-300"
        >
          <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          Back to top
        </a>
      </div>
    </footer>
  );
}
