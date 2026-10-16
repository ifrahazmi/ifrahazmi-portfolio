"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Check, Copy, Github, Linkedin, Mail, MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { profile } from "./data";
import { Reveal, SectionHeading } from "./motion";

type FormState = { name: string; email: string; message: string };
type FormErrors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = { name: "", email: "", message: "" };

export function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [copied, setCopied] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = "Please tell me your name";
    if (!form.email.trim()) next.email = "An email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "That email looks off";
    if (!form.message.trim()) next.message = "Add a short message";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n—\n${form.name}\n${form.email}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;

    toast({
      title: "Opening your email app…",
      description: `Your message is pre-filled and ready to send to ${profile.email}.`,
    });
    setForm(emptyForm);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast({ title: "Copy failed", description: `Email me directly at ${profile.email}.` });
    }
  };

  const fieldClasses = (invalid?: string) =>
    `w-full rounded-xl border bg-slate-950/50 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 transition-all duration-300 focus:outline-none focus:ring-2 ${
      invalid
        ? "border-rose-500/60 focus:ring-rose-500/40"
        : "border-slate-700/70 focus:border-sky-400/60 focus:ring-sky-500/25"
    }`;

  return (
    <section id="contact" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Get in touch"
            title="Let's build something measurable"
            description="Open to embedded QA, automation engineering and test-infrastructure roles — or a quick chat about a tricky protocol."
          />
        </Reveal>

        <Reveal delay={120}>
          <div className="edge-glow surface grid overflow-hidden rounded-3xl lg:grid-cols-[0.95fr_1.05fr]">
            {/* Details */}
            <div className="border-b border-slate-800/70 p-8 sm:p-10 lg:border-r lg:border-b-0">
              <h3 className="font-display text-xl font-semibold text-white">Direct lines</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Fastest route is email — I usually reply within a day. Everything else is one tap away.
              </p>

              <div className="mt-8 space-y-3">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 text-left transition-all duration-300 hover:border-sky-400/40 hover:bg-slate-900/60"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-400/12 text-sky-300 ring-1 ring-sky-400/20">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.68rem] tracking-[0.16em] text-slate-500 uppercase">Email</span>
                    <span className="block truncate text-sm text-slate-200">{profile.email}</span>
                  </span>
                  <span className="text-slate-500 transition-colors group-hover:text-sky-300">
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </span>
                </button>

                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 transition-all duration-300 hover:border-sky-400/40 hover:bg-slate-900/60"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-400/12 text-indigo-300 ring-1 ring-indigo-400/20">
                    <Linkedin className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[0.68rem] tracking-[0.16em] text-slate-500 uppercase">LinkedIn</span>
                    <span className="block text-sm text-slate-200">ifrahuddin-azmi</span>
                  </span>
                </a>

                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 transition-all duration-300 hover:border-sky-400/40 hover:bg-slate-900/60"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-fuchsia-400/12 text-fuchsia-300 ring-1 ring-fuchsia-400/20">
                    <Github className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[0.68rem] tracking-[0.16em] text-slate-500 uppercase">GitHub</span>
                    <span className="block text-sm text-slate-200">ifrahazmi</span>
                  </span>
                </a>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/12 text-emerald-300 ring-1 ring-emerald-400/20">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[0.68rem] tracking-[0.16em] text-slate-500 uppercase">Based in</span>
                    <span className="block text-sm text-slate-200">{profile.location} · remote-friendly</span>
                  </span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-xs text-emerald-200/90">Currently open to new opportunities</span>
              </div>
            </div>

            {/* Form */}
            <div className="p-8 sm:p-10">
              <h3 className="font-display text-xl font-semibold text-white">Send a message</h3>
              <p className="mt-3 text-sm text-slate-400">
                Fill this in and your mail client opens with everything pre-filled — no inbox left behind.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
                <div>
                  <label htmlFor="name" className="mb-2 block text-xs font-medium tracking-wide text-slate-400">
                    Your name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ada Lovelace"
                    aria-invalid={Boolean(errors.name)}
                    className={fieldClasses(errors.name)}
                  />
                  {errors.name && <p className="mt-2 text-xs text-rose-400">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-xs font-medium tracking-wide text-slate-400">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    aria-invalid={Boolean(errors.email)}
                    className={fieldClasses(errors.email)}
                  />
                  {errors.email && <p className="mt-2 text-xs text-rose-400">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-xs font-medium tracking-wide text-slate-400">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about the role, the hardware or the problem."
                    aria-invalid={Boolean(errors.message)}
                    className={`${fieldClasses(errors.message)} resize-none`}
                  />
                  {errors.message && <p className="mt-2 text-xs text-rose-400">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/40"
                >
                  <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  Send message
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
