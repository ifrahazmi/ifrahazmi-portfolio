/**
 * Email template for portfolio contact-form notifications.
 *
 * Table-based layout with inline styles so it survives Gmail, Outlook and
 * Apple Mail. No external images: the brand mark is a styled table cell, so
 * the mail looks identical with images blocked.
 */

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
  pageUrl?: string;
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
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const escapeAttr = (value: string) => escapeHtml(value).replace(/\r?\n/g, " ");

/** Formats the timestamp in IST, where the owner reads his mail. */
export const formatStamp = (date: Date) =>
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

const sourceSummary = (payload: ContactMessage) => {
  const url = payload.pageUrl ?? "";
  if (!url) return "Portfolio site";
  try {
    const parsed = new URL(url);
    return `${parsed.pathname || "/"}${parsed.hash || ""}`;
  } catch {
    return url;
  }
};

const shortReferrer = (referrer?: string) => {
  if (!referrer) return "Direct visit";
  try {
    const url = new URL(referrer);
    return `${url.hostname}${url.pathname === "/" ? "" : url.pathname}`;
  } catch {
    return referrer;
  }
};

const metaRow = (label: string, value: string) => `
              <tr>
                <td style="padding:9px 0;border-bottom:1px solid ${PALETTE.border};font:600 11px/1.4 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:${PALETTE.faint};vertical-align:top;width:38%;">${escapeHtml(label)}</td>
                <td style="padding:9px 0;border-bottom:1px solid ${PALETTE.border};font:400 13px/1.55 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:${PALETTE.text};vertical-align:top;word-break:break-word;">${value}</td>
              </tr>`;

export function buildContactEmail(payload: ContactMessage) {
  const stamp = formatStamp(payload.submittedAt);
  const firstName = payload.name.trim().split(/\s+/)[0] || payload.name;
  const subject = `${payload.name} sent you a message · portfolio`;
  const replySubject = `Re: your message to Ifrahuddin Azmi`;
  const messageHtml = escapeHtml(payload.message).replace(/\r?\n/g, "<br />");
  const messageText = payload.message.trim();

  const meta = [
    metaRow("Source", `<span style="color:${PALETTE.sky};">${escapeHtml(sourceSummary(payload))}</span>`),
    metaRow("Referrer", escapeHtml(shortReferrer(payload.referrer))),
    metaRow("Device", escapeHtml(deviceSummary(payload.userAgent))),
    metaRow("Received", escapeHtml(stamp)),
    metaRow("IP address", escapeHtml(payload.ip || "unknown")),
  ].join("");

  const html = `<!DOCTYPE html>
<html lang="en" style="color-scheme:dark;">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${PALETTE.outer};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    New enquiry from ${escapeHtml(payload.name)} &lt;${escapeHtml(payload.email)}&gt; — ${escapeHtml(stamp)}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PALETTE.outer};">
    <tr>
      <td align="center" style="padding:34px 14px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:${PALETTE.card};border:1px solid ${PALETTE.border};border-radius:18px;overflow:hidden;">

          <!-- accent bar -->
          <tr>
            <td style="height:5px;line-height:5px;font-size:0;background:${PALETTE.sky};background-image:linear-gradient(90deg,${PALETTE.sky} 0%,${PALETTE.indigo} 55%,#e879f9 100%);">&nbsp;</td>
          </tr>

          <!-- header -->
          <tr>
            <td style="padding:26px 28px 22px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="46" valign="top">
                    <div style="width:42px;height:42px;border-radius:12px;background:${PALETTE.sky};background-image:linear-gradient(135deg,${PALETTE.sky},#6366f1);font:700 15px/42px -apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:#04060d;text-align:center;letter-spacing:.02em;">IA</div>
                  </td>
                  <td valign="middle" style="padding-left:14px;">
                    <div style="font:600 11px/1.4 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:${PALETTE.sky};">Portfolio contact</div>
                    <div style="font:700 20px/1.3 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:#ffffff;margin-top:3px;">New enquiry received</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- intro -->
          <tr>
            <td style="padding:0 28px 22px;">
              <p style="margin:0;font:400 14px/1.7 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:${PALETTE.muted};">
                Hi Ifrahuddin — someone filled in the contact form on your portfolio. Reply straight to this email and it goes back to <strong style="color:${PALETTE.text};">${escapeHtml(payload.name)}</strong> at <a href="mailto:${escapeAttr(payload.email)}" style="color:${PALETTE.sky};text-decoration:none;">${escapeHtml(payload.email)}</a>.
              </p>
            </td>
          </tr>

          <!-- sender card -->
          <tr>
            <td style="padding:0 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PALETTE.panel};border:1px solid ${PALETTE.border};border-radius:14px;">
                <tr>
                  <td style="padding:20px 22px;">
                    <div style="font:700 17px/1.35 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:#ffffff;">${escapeHtml(payload.name)}</div>
                    <div style="font:400 13px/1.6 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:${PALETTE.muted};margin-top:3px;">
                      <a href="mailto:${escapeAttr(payload.email)}" style="color:${PALETTE.sky};text-decoration:none;">${escapeHtml(payload.email)}</a>
                    </div>
                    <div style="margin-top:16px;">
                      <a href="mailto:${escapeAttr(payload.email)}?subject=${encodeURIComponent(replySubject)}"
                         style="display:inline-block;background:${PALETTE.sky};background-image:linear-gradient(135deg,${PALETTE.sky},#6366f1);color:#04060d;font:700 13px/1 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;text-decoration:none;padding:12px 20px;border-radius:10px;">
                        Reply to ${escapeHtml(firstName)}
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- message -->
          <tr>
            <td style="padding:22px 28px 0;">
              <div style="font:600 11px/1.4 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:${PALETTE.faint};margin-bottom:10px;">Message</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width:3px;background:${PALETTE.sky};border-radius:3px;font-size:0;line-height:0;">&nbsp;</td>
                  <td style="padding:2px 0 2px 16px;font:400 15px/1.75 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:${PALETTE.text};">${messageHtml}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- metadata -->
          <tr>
            <td style="padding:26px 28px 4px;">
              <div style="font:600 11px/1.4 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:${PALETTE.faint};margin-bottom:6px;">Where it came from</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${meta}
              </table>
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td style="padding:20px 28px 26px;">
              <div style="border-top:1px solid ${PALETTE.border};padding-top:16px;font:400 12px/1.65 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:${PALETTE.faint};">
                Delivered automatically from the contact form at
                <a href="https://hikmahsphere.site" style="color:${PALETTE.muted};text-decoration:none;">hikmahsphere.site</a>.
                Hitting reply addresses ${escapeHtml(payload.name)} directly.
              </div>
            </td>
          </tr>
        </table>

        <div style="max-width:600px;padding:16px 6px 0;font:400 11px/1.6 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:#3f4d66;text-align:center;">
          If this message looks like spam, ignore it — nothing was stored.
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `NEW PORTFOLIO ENQUIRY`,
    ``,
    `From:    ${payload.name} <${payload.email}>`,
    `Source:  ${sourceSummary(payload)}`,
    `Referrer:${shortReferrer(payload.referrer)}`,
    `Device:  ${deviceSummary(payload.userAgent)}`,
    `Received:${stamp}`,
    ``,
    `Message`,
    `-------`,
    messageText,
    ``,
    `Reply directly to ${payload.email} to answer.`,
  ].join("\n");

  return { subject, html, text };
}
