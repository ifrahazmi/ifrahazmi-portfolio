import nodemailer, { type Transporter } from "nodemailer";
import { buildContactEmail, type ContactMessage } from "./email-template";
import { buildDeveloperInquiryEmail, type DeveloperInquiry } from "./developer-inquiry";

type MailerConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromAddress: string;
  to: string;
};

/**
 * Vercel functions are short-lived and may be frozen between invocations, so a
 * pooled TLS socket is a liability there: it can be handed out already dead.
 * Locally (a long-running `next dev`/`next start` process) pooling is a win.
 */
const isServerlessRuntime = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

let cached: { transporter: Transporter; config: MailerConfig } | null = null;

/** Splits `Name <address>` into its parts, tolerating a bare address. */
function parseFrom(raw: string, fallbackAddress: string) {
  const match = raw.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (match) {
    return { fromName: match[1] || "Portfolio", fromAddress: match[2].trim() };
  }
  return { fromName: "Portfolio", fromAddress: raw.trim() || fallbackAddress };
}

function readConfig(): MailerConfig {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.SMTP_TO || user;

  if (!host || !user || !pass || !to) {
    throw new MailerConfigError(
      "SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS and SMTP_TO.",
    );
  }

  const { fromName, fromAddress } = parseFrom(process.env.SMTP_FROM || user, user);
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = (process.env.SMTP_SECURE ?? "true").toLowerCase() !== "false";

  return { host, port: Number.isFinite(port) ? port : 465, secure, user, pass, fromName, fromAddress, to };
}

export class MailerConfigError extends Error {}

function getTransporter() {
  if (cached) return cached;

  const config = readConfig();
  const connection = {
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 12_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    tls: { minVersion: "TLSv1.2" as const },
  };

  // Two calls instead of a conditional `pool` flag: nodemailer's types model
  // the pooled transport with a literal `pool: true`, so each shape stays
  // exact rather than being widened to boolean.
  const transporter = isServerlessRuntime
    ? nodemailer.createTransport(connection)
    : nodemailer.createTransport({ ...connection, pool: true, maxConnections: 2, maxMessages: 50 });

  cached = { transporter, config };
  return cached;
}

export async function sendContactEmail(payload: ContactMessage) {
  const { transporter, config } = getTransporter();
  const { subject, html, text } = buildContactEmail(payload);

  const info = await transporter.sendMail({
    from: { name: config.fromName, address: config.fromAddress },
    to: config.to,
    replyTo: { name: payload.name, address: payload.email },
    subject,
    text,
    html,
    headers: {
      "X-Entity-Ref-ID": `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      "X-Auto-Response-Suppress": "All",
    },
  });

  return { messageId: info.messageId, accepted: info.accepted };
}

export async function sendDeveloperInquiry(payload: DeveloperInquiry) {
  const { transporter, config } = getTransporter();
  const { subject, html, text } = buildDeveloperInquiryEmail(payload);

  const info = await transporter.sendMail({
    from: { name: config.fromName, address: config.fromAddress },
    to: config.to,
    // A callback request may carry no email; the brief itself holds the phone.
    replyTo: payload.email
      ? { name: payload.name, address: payload.email }
      : undefined,
    subject,
    text,
    html,
    headers: {
      "X-Entity-Ref-ID": `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      "X-Auto-Response-Suppress": "All",
    },
  });

  return { messageId: info.messageId, accepted: info.accepted };
}

/** Exposed for diagnostics: verifies the SMTP handshake without sending mail. */
export async function verifyMailer() {
  const { transporter } = getTransporter();
  await transporter.verify();
}
