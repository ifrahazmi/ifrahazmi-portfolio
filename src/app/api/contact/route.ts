import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/mailer";

// Node.js runtime is required: nodemailer needs real TCP/TLS sockets, which the
// Edge runtime does not expose. Vercel keeps this route serverless automatically.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// SMTP handshake + delivery rarely exceeds a couple of seconds; the headroom
// covers a slow handshake without leaving the request hanging.
export const maxDuration = 30;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 4;
// Module-scope state lives inside one serverless instance, so on Vercel this is
// a warm-instance speed bump rather than a global quota. The honeypot and the
// validation below are what actually keep the inbox clean.
const hits = new Map<string, number[]>();

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

  return { allowed: recent.length <= MAX_PER_WINDOW, retryAfter: Math.ceil(WINDOW_MS / 1000) };
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function normalisePage(raw: unknown) {
  if (typeof raw !== "string" || !raw) return undefined;
  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

type Errors = Record<string, string>;

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many messages sent. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: bots fill every field. Pretend it worked.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true, delivered: true });
  }

  const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const errors: Errors = {};

  if (name.length < 2) errors.name = "Please share your name.";
  if (name.length > 80) errors.name = "That name is too long.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 160) {
    errors.email = "Please use a valid email address.";
  }
  if (message.length < 10) errors.message = "Add a little more detail (10+ characters).";
  if (message.length > 5000) errors.message = "Please keep it under 5000 characters.";

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", errors }, { status: 422 });
  }

  try {
    const { messageId } = await sendContactEmail({
      name,
      email,
      message,
      pageUrl: normalisePage(body.pageUrl),
      referrer: typeof body.referrer === "string" ? body.referrer.slice(0, 500) : undefined,
      userAgent: request.headers.get("user-agent") ?? undefined,
      ip,
      submittedAt: new Date(),
    });

    return NextResponse.json({ ok: true, delivered: true, id: messageId });
  } catch (error) {
    const code = (error as { code?: string }).code ?? "UNKNOWN";
    console.error(`[contact] delivery failed (${code}):`, (error as Error).message);
    return NextResponse.json(
      {
        ok: false,
        error:
          code === "EAUTH"
            ? "The mail server rejected the credentials. Please email me directly instead."
            : "The message could not be sent right now. Please email me directly instead.",
      },
      { status: 502 },
    );
  }
}
