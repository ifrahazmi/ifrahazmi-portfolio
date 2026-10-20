/**
 * Developer-inquiry ("Let's build something") notification template.
 *
 * This is the mail that arrives when somebody uses the embeddable contact
 * widget on a client site. It is intentionally separate from the portfolio
 * contact template: a project brief carries a service, optional budget and
 * timeline, and the visitor's preferred way to be reached.
 */

import { formatPhone } from "./service-catalog";

export type DeveloperInquiry = {
  name: string;
  /** Present when the visitor chose email, or when they added it anyway. */
  email?: string;
  /** Ten digits, Indian mobile. Present when they chose a phone callback. */
  phone?: string;
  contactMethod: "email" | "phone";
  category: string;
  service: string;
  requirement: string;
  company?: string;
  budget?: string;
  timeline?: string;
  link?: string;
  /** Page the widget was embedded on (for credit links, the client's site). */
  source?: string;
  referrer?: string;
  userAgent?: string;
  ip?: string;
  submittedAt: Date;
};

const PALETTE = {
  outer: "#04060d",
  card: "#0b1220",
  panel: "#111a2e",
  border: "#1e2a44",
  text: "#e8eef9",
  muted: "#8fa1bf",
  faint: "#64748b",
  sky: "#38bdf8",
  indigo: "#818cf8",
  violet: "#c084fc",
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const escapeAttr = (value: string) => escapeHtml(value).replace(/\r?\n/g, " ");

export const formatInquiryStamp = (date: Date) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);

const deviceSummary = (userAgent?: string) => {
  if (!userAgent) return "Unknown device";
  const ua = userAgent.toLowerCase();
  const platform = /iphone|ipad|ipod/.test(ua)
    ? "iOS"
    : /android/.test(ua)
      ? "Android"
      : /mac os x/.test(ua)
        ? "macOS"
        : /windows/.test(ua)
          ? "Windows"
          : /linux/.test(ua)
            ? "Linux"
            : "Unknown OS";
  const browser = /edg\//.test(ua)
    ? "Edge"
    : /opr\/|opera/.test(ua)
      ? "Opera"
      : /chrome\//.test(ua)
        ? "Chrome"
        : /safari\//.test(ua)
          ? "Safari"
          : /firefox\//.test(ua)
            ? "Firefox"
            : "Unknown browser";
  const mobile = /mobile|android|iphone/.test(ua) ? " · mobile" : "";
  return `${browser} on ${platform}${mobile}`;
};

/** Human-friendly host for a URL, falling back to the raw string. */
const hostOf = (raw?: string) => {
  if (!raw) return "";
  try {
    return new URL(raw).hostname.replace(/^www\./, "");
  } catch {
    return raw;
  }
};

const pill = (label: string, color: string) => `
  <span style="display:inline-block;margin:0 8px 8px 0;padding:6px 12px;border:1px solid ${color}55;border-radius:999px;background:${color}14;font:600 11px/1.2 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;letter-spacing:.04em;color:${color};">${escapeHtml(label)}</span>`;

const metaRow = (label: string, value: string) => `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid ${PALETTE.border};font:600 10px/1.4 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:${PALETTE.faint};vertical-align:top;width:34%;">${escapeHtml(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid ${PALETTE.border};font:400 13px/1.55 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:${PALETTE.text};vertical-align:top;word-break:break-word;">${value}</td>
  </tr>`;

export function buildDeveloperInquiryEmail(payload: DeveloperInquiry) {
  const stamp = formatInquiryStamp(payload.submittedAt);
  const firstName = payload.name.trim().split(/\s+/)[0] || payload.name;
  const subject = `Project brief · ${payload.name} — ${payload.service}`;
  const requirementHtml = escapeHtml(payload.requirement).replace(/\r?\n/g, "<br />");
  const requirementText = payload.requirement.trim();
  const sourceHost = hostOf(payload.source);
  const sourceLabel = sourceHost || "Direct / embed";
  const phone = payload.phone ? formatPhone(payload.phone) : "";
  const prefersPhone = payload.contactMethod === "phone";

  const replyHref = prefersPhone
    ? `tel:+91${escapeAttr(payload.phone ?? "")}`
    : `mailto:${escapeAttr(payload.email ?? "")}?subject=${encodeURIComponent(
        "Re: your project brief to Ifrahuddin Azmi",
      )}`;
  const replyLabel = prefersPhone ? `Call ${firstName}` : `Reply to ${firstName}`;
  const contactValue = prefersPhone
    ? `<a href="${replyHref}" style="color:${PALETTE.sky};text-decoration:none;">${escapeHtml(phone)}</a>`
    : `<a href="${replyHref}" style="color:${PALETTE.sky};text-decoration:none;">${escapeHtml(
        payload.email ?? "",
      )}</a>`;

  const contextRows = [
    payload.company ? metaRow("Company", escapeHtml(payload.company)) : "",
    payload.link
      ? metaRow(
          "Reference",
          `<a href="${escapeAttr(payload.link)}" style="color:${PALETTE.sky};text-decoration:none;">${escapeHtml(payload.link)}</a>`,
        )
      : "",
    metaRow(
      "Service",
      `${escapeHtml(payload.category)} · <strong style="color:${PALETTE.text};">${escapeHtml(payload.service)}</strong>`,
    ),
    metaRow(`Preferred: ${prefersPhone ? "Mobile" : "Email"}`, contactValue),
    metaRow(
      "Sent from",
      `<span style="color:${PALETTE.violet};">${escapeHtml(sourceLabel)}</span>`,
    ),
    metaRow("Received", escapeHtml(stamp)),
    metaRow("Device", escapeHtml(deviceSummary(payload.userAgent))),
    metaRow("IP address", escapeHtml(payload.ip || "unknown")),
  ]
    .filter(Boolean)
    .join("");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${PALETTE.outer};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(payload.service)} enquiry from ${escapeHtml(payload.name)}${payload.budget ? ` · ${escapeHtml(payload.budget)}` : ""}${payload.timeline ? ` · ${escapeHtml(payload.timeline)}` : ""}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PALETTE.outer};padding:28px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;background:${PALETTE.card};border:1px solid ${PALETTE.border};border-radius:18px;overflow:hidden;">
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,${PALETTE.sky},${PALETTE.indigo},${PALETTE.violet});background-color:${PALETTE.sky};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:26px 28px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="46" valign="middle">
                    <div style="width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,${PALETTE.sky},${PALETTE.indigo} 55%,${PALETTE.violet});color:#04060d;font:800 15px/42px -apple-system,'Segoe UI',Roboto,Arial,sans-serif;text-align:center;letter-spacing:.02em;">IA</div>
                  </td>
                  <td valign="middle" style="padding-left:12px;">
                    <div style="font:700 13px/1.4 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:${PALETTE.text};letter-spacing:.02em;">Ifrahuddin Azmi</div>
                    <div style="font:500 10px/1.5 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:${PALETTE.faint};letter-spacing:.16em;text-transform:uppercase;">Developer inquiry · contact widget</div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display:inline-block;padding:5px 10px;border:1px solid #34d39944;border-radius:999px;background:#34d39912;font:700 10px/1.2 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#34d399;">New lead</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 0;">
              <h1 style="margin:0;font:700 25px/1.28 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:${PALETTE.text};letter-spacing:-.02em;">${escapeHtml(payload.name)} wants ${escapeHtml(payload.service.toLowerCase())}.</h1>
              <p style="margin:8px 0 0;font:400 13px/1.6 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:${PALETTE.muted};">Submitted through the embeddable contact form on <strong style="color:${PALETTE.text};font-weight:600;">${escapeHtml(sourceLabel)}</strong>. ${
                prefersPhone
                  ? "They asked to be reached on the phone."
                  : "Hitting reply goes straight back to them."
              }</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 0;">
              ${pill(payload.service, PALETTE.sky)}
              ${payload.budget ? pill(`Budget · ${payload.budget}`, PALETTE.indigo) : ""}
              ${payload.timeline ? pill(`Timeline · ${payload.timeline}`, PALETTE.violet) : ""}
            </td>
          </tr>
          <tr>
            <td style="padding:6px 28px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PALETTE.panel};border:1px solid ${PALETTE.border};border-radius:14px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <div style="font:700 10px/1.4 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:${PALETTE.faint};">The brief</div>
                    <div style="margin-top:9px;font:400 14px/1.7 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:${PALETTE.text};">${requirementHtml}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 28px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${contextRows}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 28px 26px;">
              <a href="${replyHref}" style="display:inline-block;padding:13px 22px;border-radius:11px;background:linear-gradient(100deg,${PALETTE.sky},${PALETTE.indigo} 60%,${PALETTE.violet});color:#04060d;font:700 13px/1 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;text-decoration:none;letter-spacing:.01em;">${escapeHtml(replyLabel)} &rarr;</a>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;border-top:1px solid ${PALETTE.border};background:#080e18;">
              <p style="margin:0;font:400 11px/1.6 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:${PALETTE.faint};">Sent automatically by the developer contact widget. ${payload.referrer ? `Referrer: ${escapeHtml(hostOf(payload.referrer) || payload.referrer)}.` : "No referrer recorded."}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `New project brief — ${payload.name}`,
    `Service: ${payload.category} · ${payload.service}`,
    payload.company ? `Company: ${payload.company}` : null,
    prefersPhone ? `Phone: ${phone} (preferred contact)` : `Email: ${payload.email}`,
    !prefersPhone && payload.phone ? `Phone: ${phone}` : null,
    payload.budget ? `Budget: ${payload.budget}` : null,
    payload.timeline ? `Timeline: ${payload.timeline}` : null,
    payload.link ? `Reference: ${payload.link}` : null,
    "",
    "The brief:",
    requirementText,
    "",
    `Sent from: ${sourceLabel}`,
    `Received: ${stamp}`,
    `Device: ${deviceSummary(payload.userAgent)}`,
    `IP: ${payload.ip || "unknown"}`,
    "",
    prefersPhone ? `Call directly: ${phone}` : `Reply directly: ${payload.email}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { subject, html, text };
}
