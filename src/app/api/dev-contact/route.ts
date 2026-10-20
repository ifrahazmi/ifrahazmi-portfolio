import { NextResponse } from "next/server";
import { sendDeveloperInquiry } from "@/lib/mailer";
import {
  BUDGET_OPTIONS,
  TIMELINE_OPTIONS,
  findService,
  normalisePhone,
} from "@/lib/service-catalog";

/**
 * Public endpoint behind the embeddable developer contact widget.
 *
 * Unlike `/api/contact` (same-origin portfolio form), this route is meant to be
 * called from other domains — every site you ship can post here — so it owns
 * its CORS policy, its own honeypot field and accepts optional project context
 * (budget, timeline, company, reference link).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

/** Comma-separated allowlist. `*` (the default) permits any client site. */
const ALLOWED_ORIGINS = (process.env.CONTACT_ALLOWED_ORIGINS ?? "*")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const allowAllOrigins = ALLOWED_ORIGINS.includes("*");

function originAllowed(origin: string | null) {
  // Same-origin fetches and server-to-server calls may omit Origin entirely.
  if (!origin) return true;
  return allowAllOrigins || ALLOWED_ORIGINS.some((entry) => entry.toLowerCase() === origin.toLowerCase());
}

function corsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };

  // Only advertise the origin when it is actually allowed, so a browser cannot
  // read responses (including the 403 body) on behalf of a blocked site.
  if (originAllowed(origin)) {
    headers["Access-Control-Allow-Origin"] = allowAllOrigins
      ? "*"
      : origin ?? ALLOWED_ORIGINS[0] ?? "null";
  }

  return headers;
}

function reply(body: unknown, status: number, origin: string | null) {
  return NextResponse.json(body, { status, headers: corsHeaders(origin) });
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  if (!originAllowed(origin)) {
    return new NextResponse(null, { status: 403, headers: corsHeaders(origin) });
  }
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

function rateLimit(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 500) {
    for (const [entry, times] of hits) {
      if (!times.some((at) => now - at < WINDOW_MS)) hits.delete(entry);
    }
  }

  return {
    allowed: recent.length <= MAX_PER_WINDOW,
    retryAfter: Math.ceil(WINDOW_MS / 1000),
  };
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

/** Turns a page/origin value into a clean http(s) URL or undefined. */
function normaliseUrl(raw: unknown) {
  if (typeof raw !== "string" || !raw.trim()) return undefined;
  const candidate = raw.trim();
  try {
    const url = new URL(candidate);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    // Bare hostnames ("client-site.com") are accepted for the source label.
    if (/^[\w.-]+\.[a-z]{2,}$/i.test(candidate)) return `https://${candidate}`;
    return undefined;
  }
}

const clip = (raw: unknown, max: number) =>
  typeof raw === "string" ? raw.trim().slice(0, max) : "";

function pickOption(raw: unknown, options: readonly string[]) {
  const value = clip(raw, 60);
  return options.includes(value) ? value : undefined;
}

type Errors = Record<string, string>;

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!originAllowed(origin)) {
    return reply({ ok: false, error: "This origin is not allowed to send messages." }, 403, origin);
  }

  const ip = clientIp(request);
  const limit = rateLimit(ip);
  if (!limit.allowed) {
    return reply(
      { ok: false, error: "Too many messages from this network. Please try again shortly." },
      429,
      origin,
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return reply({ ok: false, error: "Invalid request body." }, 400, origin);
  }

  // Honeypot: a hidden field no human can fill. Deliberately *not* `company`,
  // which is a real optional field in this form. Pretend the send worked.
  if (typeof body.botcheck === "string" && body.botcheck.trim() !== "") {
    return reply({ ok: true, delivered: true }, 200, origin);
  }

  const name = clip(body.name, 120).replace(/\s+/g, " ");
  const email = clip(body.email, 200);
  const phone = normalisePhone(body.phone);
  const requirement = clip(
    typeof body.requirement === "string" ? body.requirement : body.message,
    5000,
  );
  const company = clip(body.company, 120) || undefined;
  const link = normaliseUrl(body.link);
  const categoryId = clip(body.category, 60);
  const serviceId = clip(body.service, 60);
  const contactMethod: "email" | "phone" =
    body.contactMethod === "phone" || (!email && body.phone) ? "phone" : "email";
  const catalogEntry = findService(categoryId, serviceId);
  const errors: Errors = {};
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 160;

  if (name.length < 2) errors.name = "Please share your name.";
  if (name.length > 80) errors.name = "That name is too long.";

  if (contactMethod === "email") {
    if (!emailValid) errors.email = "Please use a valid email address.";
  } else {
    if (!phone) errors.phone = "Enter a valid 10-digit Indian mobile number.";
    // Email is optional on a callback request, but still validated if given.
    if (email && !emailValid) errors.email = "Please use a valid email address.";
  }

  if (!categoryId) errors.category = "Choose what you need.";
  else if (!catalogEntry) errors.service = "Pick a valid service for that category.";

  if (requirement.length < 10) errors.requirement = "Tell me a little more (10+ characters).";
  if (requirement.length > 5000) errors.requirement = "Please keep it under 5000 characters.";
  if (body.link && !link) errors.link = "Use a full link starting with https://";

  if (Object.keys(errors).length || !catalogEntry) {
    return reply(
      { ok: false, error: "Please check the highlighted fields.", errors },
      422,
      origin,
    );
  }

  // Prefer the page the form was embedded on; fall back to the request origin.
  const source =
    normaliseUrl(body.source) ?? normaliseUrl(origin) ?? normaliseUrl(body.pageUrl);

  try {
    const { messageId } = await sendDeveloperInquiry({
      name,
      email: email || undefined,
      phone: phone ?? undefined,
      contactMethod,
      category: catalogEntry.category,
      service: catalogEntry.service,
      requirement,
      company,
      budget: pickOption(body.budget, BUDGET_OPTIONS),
      timeline: pickOption(body.timeline, TIMELINE_OPTIONS),
      link,
      source,
      referrer:
        clip(body.referrer, 500) || clip(request.headers.get("referer"), 500) || undefined,
      userAgent: request.headers.get("user-agent") ?? undefined,
      ip,
      submittedAt: new Date(),
    });

    return reply({ ok: true, delivered: true, id: messageId }, 200, origin);
  } catch (error) {
    const code = (error as { code?: string }).code ?? "UNKNOWN";
    console.error(`[dev-contact] delivery failed (${code}):`, (error as Error).message);
    return reply(
      {
        ok: false,
        error:
          code === "EAUTH"
            ? "The mail server rejected the credentials. Please email me directly instead."
            : "The brief could not be sent right now. Please try again, or email me directly.",
      },
      502,
      origin,
    );
  }
}
