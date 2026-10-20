import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Developer contact — embeddable widget",
  description:
    "A drop-in developer contact form: Shadow-DOM isolated, animated, and backed by /api/dev-contact. Embed it on any site you ship.",
  robots: { index: false, follow: false },
};

const snippet = `<!-- 1 · load the widget once -->
<script src="https://your-domain.com/embed/dev-contact.js" defer></script>

<!-- 2 · any element can open it -->
<a href="#" data-dev-contact>Designed &amp; developed by Ifrahuddin Azmi</a>

<!-- or from your own code -->
<button onclick="DevContact.open()">Start a project</button>`;

const iframeSnippet = `<!-- zero-JS embed, works in Webflow, WordPress, Notion, anywhere -->
<iframe
  src="https://your-domain.com/dev-contact?embed=1"
  title="Contact Ifrahuddin Azmi"
  style="width:100%;max-width:600px;border:0;height:900px"
  loading="lazy"></iframe>`;

const apiSnippet = `curl -X POST https://your-domain.com/api/dev-contact \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "Ada Lovelace",
    "contactMethod": "email",
    "email": "ada@example.com",
    "category": "website",
    "service": "web-app",
    "requirement": "A booking dashboard with auth and billing.",
    "budget": "\u20b91L \u2013 \u20b95L",
    "timeline": "2\u20134 weeks",
    "company": "Analytical Engines"
  }'`;

const fields = [
  { name: "name", required: true, note: "2–80 characters" },
  { name: "contactMethod", required: true, note: "email or phone" },
  { name: "email", required: false, note: "required when method is email" },
  { name: "phone", required: false, note: "required when method is phone · +91, 10 digits, starts 6–9" },
  { name: "category", required: true, note: "service category id" },
  { name: "service", required: true, note: "id from that category" },
  { name: "requirement", required: true, note: "10–5000 characters" },
  { name: "company", required: false, note: "max 120" },
  { name: "budget", required: false, note: "one of five options · asked after a service is picked" },
  { name: "timeline", required: false, note: "one of four options · asked after a service is picked" },
  { name: "link", required: false, note: "http(s) URL" },
  {
    name: "attachment",
    required: false,
    note: "PDF, image, Word/Excel, TXT or ZIP · max 2.5 MB",
  },
  { name: "source", required: false, note: "page the form was shown on" },
];

export default async function DevContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const embed = params.embed === "1" || params.embed === "true";

  if (embed) {
    return (
      <main className="min-h-screen bg-[#04060d] px-4 py-6 sm:py-10">
        <div id="dev-contact-widget" />
        <Script
          src="/embed/dev-contact.js"
          strategy="afterInteractive"
          data-mode="inline"
          data-target="#dev-contact-widget"
        />
      </main>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#04060d]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(900px 480px at 8% -8%, rgba(56,189,248,.14), transparent 68%), radial-gradient(760px 520px at 96% 106%, rgba(168,85,247,.16), transparent 70%)",
        }}
      />

      <main className="relative mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase transition-colors hover:text-slate-100"
          >
            <span aria-hidden>←</span> Ifrahuddin Azmi
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/[0.07] px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-emerald-300 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live · embeddable
          </span>
        </header>

        <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.03em] text-slate-50 sm:text-5xl">
          A developer contact form you can drop on{" "}
          <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
            any site
          </span>
          .
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Shadow-DOM isolated, so the host page&apos;s CSS can&apos;t touch it. Visitors pick a
          service — which unlocks the budget and timeline questions — attach a reference file if
          they have one, and every submission lands in my inbox as a designed brief with a
          one-click reply.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
          <section aria-labelledby="preview-heading" className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2
                id="preview-heading"
                className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase"
              >
                Live preview
              </h2>
              <button
                type="button"
                data-dev-contact="dev-contact demo"
                className="rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-[11px] font-semibold text-slate-300 transition-colors hover:border-sky-400/50 hover:text-white"
              >
                Open as modal ↗
              </button>
            </div>
            <div id="dev-contact-widget" />
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              This card is the same component that opens from a credit link — try{" "}
              <button
                type="button"
                data-dev-contact="credit link"
                className="font-semibold text-sky-400 underline decoration-sky-400/30 underline-offset-4 transition-colors hover:text-sky-300"
              >
                Designed &amp; developed by Ifrahuddin Azmi
              </button>
              .
            </p>
          </section>

          <section aria-labelledby="usage-heading" className="min-w-0 space-y-5">
            <div>
              <h2
                id="usage-heading"
                className="mb-3 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase"
              >
                1 · Script embed
              </h2>
              <pre className="overflow-x-auto rounded-xl border border-slate-800/90 bg-[#070b14] p-4 text-[11.5px] leading-relaxed text-slate-300">
                <code>{snippet}</code>
              </pre>
            </div>

            <div>
              <h2 className="mb-3 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                2 · Iframe embed
              </h2>
              <pre className="overflow-x-auto rounded-xl border border-slate-800/90 bg-[#070b14] p-4 text-[11.5px] leading-relaxed text-slate-300">
                <code>{iframeSnippet}</code>
              </pre>
            </div>

            <div>
              <h2 className="mb-3 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                3 · Call the API directly
              </h2>
              <pre className="overflow-x-auto rounded-xl border border-slate-800/90 bg-[#070b14] p-4 text-[11.5px] leading-relaxed text-slate-300">
                <code>{apiSnippet}</code>
              </pre>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Returns <code className="text-slate-300">{"{ ok, delivered, id }"}</code> on success,
                field errors as <code className="text-slate-300">422</code>, and CORS headers for
                every allowed origin. Phone-only requests omit <code className="text-slate-300">email</code>.
                The full service catalog is listed in the docs.
              </p>
            </div>
          </section>
        </div>

        <section className="mt-14" aria-labelledby="fields-heading">
          <h2
            id="fields-heading"
            className="mb-4 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase"
          >
            Accepted fields
          </h2>
          <div className="overflow-hidden rounded-xl border border-slate-800/90">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-slate-900/60 text-[10px] tracking-[0.14em] text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Field</th>
                  <th className="px-4 py-3 font-semibold">Required</th>
                  <th className="px-4 py-3 font-semibold">Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {fields.map((field) => (
                  <tr key={field.name} className="bg-[#070b14]/60">
                    <td className="px-4 py-2.5 font-mono text-[11.5px] text-sky-300">{field.name}</td>
                    <td className="px-4 py-2.5 text-slate-400">{field.required ? "yes" : "optional"}</td>
                    <td className="px-4 py-2.5 text-slate-500">{field.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            Full setup, theming, CORS and Vercel instructions live in{" "}
            <span className="font-mono text-[11.5px] text-slate-300">docs/developer-contact-form.md</span>.
          </p>
        </section>
      </main>

      <Script
        src="/embed/dev-contact.js"
        strategy="afterInteractive"
        data-mode="inline"
        data-target="#dev-contact-widget"
        data-source="dev-contact demo"
      />
    </div>
  );
}
