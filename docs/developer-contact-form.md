# Developer contact form

A standalone, embeddable "let's build something" form. Visitors pick a service
(website, app, microservices, design, marketing, deployment…) and choose how to
be reached — email or a +91 callback — and every brief arrives in your inbox as
a designed email with a one-click reply.

- **Widget:** `/embed/dev-contact.js` — dependency-free, Shadow-DOM isolated, animated.
- **Backend:** `/api/dev-contact` — validation, CORS, honeypot, per-IP rate limit, SMTP.
- **Preview:** `/dev-contact` (standalone page) and `/dev-contact?embed=1` (iframe view).

Because the widget renders inside a shadow root, the host site's CSS cannot leak
in and the widget's CSS cannot leak out. There is no React, jQuery, or font
dependency — one `<script>` tag.

```
client site (any stack)
  └─ <script src="https://your-domain.com/embed/dev-contact.js">
        └─ modal UI (shadow DOM)  ──POST JSON──▶  /api/dev-contact
                                                    ├─ validate + honeypot
                                                    ├─ rate limit (per IP)
                                                    └─ SMTP → inbox (Reply-To visitor)
```

## Files

| Path                                | Purpose                                           |
| ----------------------------------- | ------------------------------------------------- |
| `public/embed/dev-contact.js`       | The embeddable widget (no build step)             |
| `src/app/api/dev-contact/route.ts`  | Public JSON API + CORS                            |
| `src/lib/developer-inquiry.ts`      | Email template and shared option lists            |
| `src/lib/mailer.ts`                 | `sendDeveloperInquiry()` over Zoho SMTP           |
| `src/app/dev-contact/page.tsx`      | Standalone page and iframe target                 |
| `docs/developer-contact-form.md`    | This document                                     |

---

## 1. Use it

### Credit link (the usual case)

Add this where you sign the work:

```html
<a href="#" data-dev-contact>Designed &amp; developed by Ifrahuddin Azmi</a>

<!-- load the script once, anywhere on the page -->
<script src="https://your-domain.com/embed/dev-contact.js" defer></script>
```

Clicking the link opens the animated modal. No other wiring. Any number of
`data-dev-contact` elements on the page work; the attribute value is recorded as
the submission's source label.

### JS API

```html
<button id="hire">Start a project</button>
<script src="https://your-domain.com/embed/dev-contact.js" defer></script>
<script>
  document.getElementById("hire").addEventListener("click", function () {
    DevContact.open({ source: "pricing page" });
  });
</script>
```

| Export                     | Does                                              |
| -------------------------- | ------------------------------------------------- |
| `DevContact.open(opts)`    | Opens the modal. `opts.source` labels the request. |
| `DevContact.close()`       | Closes the modal.                                  |
| `DevContact.mount(target)` | Renders the form inline into an element.           |
| `DevContact.configure(o)`  | Overrides `endpoint`, `source`, etc. at runtime.   |
| `DevContact.version`       | `"1.0.0"`                                          |

Events: a `dev-contact:success` CustomEvent fires on `document` with
`{ name, email }` in `detail`, and in an iframe the widget posts
`{ type: "dev-contact:success" }` to the parent window.

### Iframe (no JavaScript at all)

```html
<iframe
  src="https://your-domain.com/dev-contact?embed=1"
  title="Contact Ifrahuddin Azmi"
  style="width:100%;max-width:600px;border:0;height:720px"
  loading="lazy"></iframe>
```

Auto-resize the iframe as the success panel appears:

```html
<script>
  window.addEventListener("message", function (event) {
    if (event.data && event.data.type === "dev-contact:height") {
      var frame = document.querySelector('iframe[src*="dev-contact"]');
      if (frame) frame.style.height = event.data.height + "px";
    }
  });
</script>
```

### Widget options (`data-*` on the script tag)

| Attribute        | Default                        | Meaning                                     |
| ---------------- | ------------------------------ | ------------------------------------------- |
| `data-endpoint`  | `<script-origin>/api/dev-contact` | Where to POST. Omit when self-hosting.   |
| `data-name`      | `Ifrahuddin Azmi`              | Name in the header and email                |
| `data-role`      | `Automation Test Engineer`     | Subtitle under the name                     |
| `data-email`     | `info@hikmahsphere.site`       | Address shown in the success panel          |
| `data-source`    | current page URL               | Fallback source label for submissions       |
| `data-accent`    | `#38bdf8`                      | Accent used by the gradient and focus ring  |
| `data-mode`      | `modal`                        | `inline` renders into `data-target` instead |
| `data-target`    | `[data-dev-contact-inline]`    | Inline mount selector                       |
| `data-auto-open` | off                            | Open the modal on load                      |

On this deployment the endpoint is derived from the script's own origin, so a
client site needs only the `<script src>` line — no endpoint configuration.
If you host the widget somewhere other than the API, set `data-endpoint`
explicitly.

---

## 2. API contract

`POST /api/dev-contact` · `Content-Type: application/json`

```json
{
  "name": "Ada Lovelace",
  "contactMethod": "email",
  "email": "ada@example.com",
  "category": "website",
  "service": "web-app",
  "requirement": "A booking dashboard with auth and billing.",
  "company": "Analytical Engines",
  "budget": "₹1L – ₹5L",
  "timeline": "2–4 weeks",
  "link": "https://analytical.example",
  "source": "https://client-site.com",
  "botcheck": ""
}
```

A callback request replaces `email` with a mobile number:

```json
{
  "name": "Ada Lovelace",
  "contactMethod": "phone",
  "phone": "9876543210",
  "category": "website",
  "service": "web-app",
  "requirement": "A booking dashboard with auth and billing."
}
```

| Field           | Required  | Rule                                                     |
| --------------- | --------- | -------------------------------------------------------- |
| `name`          | yes       | 2–80 characters, whitespace collapsed                    |
| `contactMethod` | yes       | `email` or `phone`                                       |
| `email`         | conditional | required when `contactMethod` is `email`; validated if sent with a phone request |
| `phone`         | conditional | required when `contactMethod` is `phone`; `+91` is implied, 10 digits starting 6–9 |
| `category`      | yes       | id from the service catalog below                        |
| `service`       | yes       | id that belongs to that category                         |
| `requirement`   | yes       | 10–5000 characters (`message` accepted as alias)         |
| `company`       | no        | max 120                                                  |
| `budget`        | no        | `Under ₹25k`, `₹25k – ₹1L`, `₹1L – ₹5L`, `₹5L+`, `Not sure yet` |
| `timeline`      | no        | `ASAP`, `2–4 weeks`, `1–3 months`, `Flexible`             |
| `link`          | no        | absolute `http(s)` URL                                   |
| `source`        | no        | page the form was shown on (URL or bare hostname)        |
| `pageUrl`       | no        | fallback for `source`                                    |
| `botcheck`      | no        | honeypot; any value ⇒ `200` and no mail is sent          |

Unknown budget/timeline values are dropped rather than rejected, so an older
widget can keep posting to a newer API. Unknown **categories or services are
rejected** with `422` — they decide what the notification email says.

Phone numbers are normalised: `9876543210`, `+919876543210`, `09876543210` and
`98765 43210` all become `9876543210`. Anything shorter, longer, or starting
with 0–5 is rejected. A phone-only request carries no `Reply-To`; the email's
button becomes a `tel:` link instead.

### Service catalog

| Category id | Label              | Service ids |
| ----------- | ------------------ | ----------- |
| `general`   | General inquiry    | `question`, `hiring`, `partnership`, `other-general` |
| `website`   | Website & web app  | `business-website`, `web-app`, `ecommerce`, `redesign` |
| `mobile`    | Mobile app         | `android`, `ios`, `cross-platform` |
| `software`  | Software & APIs    | `microservices`, `saas`, `automation`, `ai-integration` |
| `design`    | Design & branding  | `ui-ux`, `logo-brand`, `design-system` |
| `marketing` | Growth & marketing | `seo`, `ads`, `content` |
| `cloud`     | Cloud & deployment | `deploy-devops`, `domain-email`, `audit` |
| `other`     | Something else     | `custom` |

The catalog lives in `src/lib/service-catalog.ts`; the widget carries a mirrored
copy because it ships as a standalone script. Labels are cosmetic, ids are the
contract — changing an id on one side without the other causes a `422`.

### Responses

| Status | Body                                        | When                          |
| ------ | ------------------------------------------- | ----------------------------- |
| `200`  | `{ "ok": true, "delivered": true, "id": "…" }` | Mail accepted by SMTP      |
| `400`  | `{ "ok": false, "error": "Invalid request body." }` | Not valid JSON         |
| `403`  | `{ "ok": false, "error": "This origin is not allowed…" }` | Origin outside allowlist |
| `422`  | `{ "ok": false, "error": "…", "errors": { "email": "…" } }` | Validation failed |
| `429`  | `{ "ok": false, "error": "Too many messages…" }` | More than 5 per IP / 10 min |
| `502`  | `{ "ok": false, "error": "The brief could not be sent…" }` | SMTP failure       |

`OPTIONS` answers preflight with `204` and the same CORS headers.

### CORS

By default the API accepts **any** origin (`*`), because the widget is designed
to live on client sites. Lock it down with:

```bash
CONTACT_ALLOWED_ORIGINS=https://client-one.com,https://client-two.com
```

Comma-separated, exact origins (scheme + host + optional port). `*` keeps it
open. Wildcards are not supported. Requests from other origins receive `403`.

Email delivery still goes to `SMTP_TO`; the visitor's address is only used as
`Reply-To`, so the endpoint cannot be used to relay arbitrary mail.

---

## 3. Environment variables

Same SMTP block as the rest of the site (see `.env.example`):

```bash
SMTP_HOST=smtp.zoho.in
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@hikmahsphere.site
SMTP_PASS=your-zoho-app-password
SMTP_FROM="HikmahSphere <info@hikmahsphere.site>"
SMTP_TO=info@hikmahsphere.site

# optional
CONTACT_ALLOWED_ORIGINS=*
```

`SMTP_PASS` is a Zoho **app password**, not the account password, and Zoho
requires "Less secure app access"/app passwords to be enabled for the mailbox.

---

## 4. Deploy on Vercel

The project is already Vercel-native (`vercel.json`, `npm ci`, `next build`,
`bom1` region). The widget is a static asset in `public/embed`, and the API is a
Node.js serverless function, so nothing else is required.

### Option A — one command from this repo

```bash
npm run deploy
```

It reads `.env.local`, pushes all seven `SMTP_*` variables to production,
preview and development, then builds and deploys to production. Variants:

```bash
npm run deploy:preview   # preview URL only
npm run deploy -- --skip-env
npm run env:push         # variables only
```

### Option B — Vercel dashboard

1. **Add New → Project**, import the Git repository.
2. Framework preset: **Next.js** (auto-detected). Build command `npm run build`.
3. **Settings → Environment Variables**, add the seven `SMTP_*` names for
   Production (and Preview if you want previews to send mail). Add
   `CONTACT_ALLOWED_ORIGINS` only if you want to restrict who may post.
4. **Deploy.** HTTPS is provisioned on the `*.vercel.app` URL automatically.

### Option C — Vercel CLI

```bash
npx vercel link
npx vercel env add SMTP_HOST production
# …repeat for each variable, or use npm run env:push
npx vercel --prod
```

### After deploying

1. Open `https://your-domain/dev-contact` and submit the live form.
2. Confirm the notification arrives and **Reply** addresses the visitor.
3. Use the deployed script URL on a client site:
   ```html
   <script src="https://your-domain.com/embed/dev-contact.js" defer></script>
   ```
4. Send one test request from the client's domain to confirm CORS (see the
   `curl` example on `/dev-contact`).

Serverless notes: the function runs on Node.js (nodemailer needs real sockets),
`maxDuration` is 30 s, and connection pooling is disabled when `VERCEL` is set.
The rate limiter is per warm instance, so a determined attacker spread across
instances can exceed it — the honeypot and validation are the real filters.

---

## 5. Reuse it in another project

Copy four things into any Next.js App Router project:

```
public/embed/dev-contact.js
src/lib/developer-inquiry.ts
src/lib/mailer.ts            (or only sendDeveloperInquiry + getTransporter)
src/app/api/dev-contact/route.ts
```

Then `npm install nodemailer` and set the `SMTP_*` variables. The route declares
`runtime = "nodejs"`; do not move it to Edge.

If you only need the form and not the inbox, point `data-endpoint` at any HTTPS
endpoint that accepts the JSON above — the widget has no knowledge of SMTP.

---

## 6. Test it locally

```bash
cp .env.example .env.local     # fill in SMTP_* (never commit this file)
npm run dev                    # http://localhost:3000/dev-contact
```

API checks:

```bash
# validation error
curl -i -X POST http://localhost:3000/api/dev-contact \
  -H 'Content-Type: application/json' -d '{"name":"A"}'
# expect 422 with errors.name / errors.email / errors.category

# honeypot: accepted, no mail sent
curl -i -X POST http://localhost:3000/api/dev-contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Bot","email":"bot@example.com","requirement":"spam spam spam","botcheck":"x"}'
# expect 200 { ok: true, delivered: true }

# real send (email)
curl -i -X POST http://localhost:3000/api/dev-contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada","contactMethod":"email","email":"ada@example.com","category":"website","service":"web-app","requirement":"Testing the developer contact form end to end."}'

# real send (phone callback)
curl -i -X POST http://localhost:3000/api/dev-contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada","contactMethod":"phone","phone":"9876543210","category":"cloud","service":"deploy-devops","requirement":"Deploying a Next.js app to Vercel next week."}'
```

The rate limiter keeps its counters in memory; restart `npm run dev` to clear
them while testing.

---

## 7. Troubleshooting

| Symptom                          | Likely cause / fix                                             |
| -------------------------------- | -------------------------------------------------------------- |
| Modal doesn't open               | Script blocked, or the trigger isn't `[data-dev-contact]`      |
| Form looks unstyled              | Host CSS cannot affect shadow DOM — check the script loaded    |
| `403` in the console             | Origin not in `CONTACT_ALLOWED_ORIGINS`                        |
| `502` and `EAUTH` in function logs | Wrong Zoho user/app password, or app passwords disabled      |
| `502` timeout                    | Wrong `SMTP_HOST` for your Zoho data centre, or port 25 blocked (use 465/587) |
| `429`                            | 5 submissions from one IP in 10 minutes                        |
| Email arrives but looks plain    | The client blocks HTML — the plain-text part is intentional    |
| "Enter a valid 10-digit mobile number" | Indian mobiles start 6–9 and need exactly ten digits; `+91` is added automatically |
| `422` on `category` / `service`  | The widget and API catalogs drifted — check the ids in `src/lib/service-catalog.ts` |
| Mail lands in spam               | Publish SPF/DKIM for the sending domain (Zoho → DNS)            |

Widget not appearing on a client's site at all: confirm the `<script>` is
reachable (view source, fetch the URL) and that the site doesn't strip `<script>`
tags — e.g. some CMS "safe HTML" fields; use the iframe embed there instead.
