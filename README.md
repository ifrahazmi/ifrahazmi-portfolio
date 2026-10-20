# 🚀 Ifrahuddin Azmi – Portfolio Website

Welcome to my personal portfolio — a modern, production-ready web application built with the latest technologies to showcase my work and skills.

---

## 🛠️ Tech Stack

### ⚙ Core
- **Next.js 15** – App Router enabled
- **TypeScript 5**
- **Tailwind CSS 4**

### 🧩 UI & Styling
- **shadcn/ui** – Radix-based component library
- **Framer Motion** – Animation support
- **Lucide React** – Icon set
- **Next Themes** – Dark/light mode switching

### 📋 Forms & Validation
- **React Hook Form** – Performant forms
- **Zod** – Schema-based validation

### 🔄 State & Data Management
- **Zustand** – Lightweight state management
- **TanStack Query** – Data fetching & caching
- **Axios** – API calls

### 🔐 Backend & Auth
- **Prisma** – Type-safe ORM
- **NextAuth.js** – Authentication system

### 📊 UI Enhancements
- **Recharts** – Data visualization
- **TanStack Table** – Tables with sorting/filtering
- **DND Kit** – Drag-and-drop features
- **Sharp** – Image optimization

### 🌍 Utilities
- **Next Intl** – Internationalization
- **date-fns** – Date manipulation
- **ReactUse** – React utility hooks

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see your application running.

---

## ✉️ Contact form email (SMTP)

The contact form posts to `POST /api/contact`, which delivers the message over authenticated SMTP and replies straight to the visitor's address (`Reply-To`). Every notification is rendered from a responsive HTML template — sender card, quoted message, and a “Where it came from” block with the source path, referrer, device/browser, arrival time (IST) and IP — plus a plain-text fallback for clients that block HTML.

Create `.env.local` (already gitignored) with:

```bash
SMTP_HOST=smtp.zoho.in
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=you@example.com
SMTP_PASS=app-specific-password
SMTP_FROM="Your Name <you@example.com>"
SMTP_TO=you@example.com
```

The route validates input, caps message length, rate-limits to 4 submissions per IP per 10 minutes, silently drops honeypot hits, and returns generic errors while logging only the SMTP failure code. On Vercel the limiter lives inside one warm function instance — the honeypot and validation are what actually keep the inbox clean.

| Variable | Value used here |
| --- | --- |
| `SMTP_HOST` | `smtp.zoho.in` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | `info@hikmahsphere.site` |
| `SMTP_PASS` | Zoho app password |
| `SMTP_FROM` | `HikmahSphere <info@hikmahsphere.site>` |
| `SMTP_TO` | `info@hikmahsphere.site` |

Nothing is baked into the build — the same seven names are read at request time from the host environment.

---

## ▲ Deploying to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgitlab.com%2Fifrahazmi%2Fportfolio&env=SMTP_HOST,SMTP_PORT,SMTP_SECURE,SMTP_USER,SMTP_PASS,SMTP_FROM,SMTP_TO&envDescription=SMTP%20credentials%20used%20by%20the%20contact%20form&envLink=https%3A%2F%2Fgitlab.com%2Fifrahazmi%2Fportfolio%23%EF%B8%8F-contact-form-email-smtp)

**One command, everything configured:**

```bash
npm run deploy
```

It reads `.env.local`, verifies the Vercel CLI is logged in (`npx vercel login` once), links this folder to the `portfolio` project, pushes all seven `SMTP_*` variables to production, preview and development, then builds and deploys to production and prints the live URL. Secrets travel over stdin, never as command-line arguments, and are never echoed.

Useful variants:

```bash
npm run env:push                 # sync variables only, no deploy
npm run deploy:preview           # deploy a preview URL, leave production untouched
npm run deploy -- --skip-env     # redeploy with the variables already on Vercel
npm run deploy -- --project other-name --env-file .env.production
```

### What makes this build Vercel-native

- **`vercel.json`** pins the framework, `npm ci`, `npm run build`, and the `bom1` (Mumbai) region — next to `smtp.zoho.in` and the audience.
- **The build is just `next build`.** `next.config.ts` no longer hides type or lint errors, so a red build is a real failure locally and on Vercel.
- **Next.js is pinned to 15.5.28 (React 19.1.10).** Vercel refuses to deploy Next.js versions with open security advisories, so 15.3.5 was blocked at build time; 15.5.28 is the patched 15.x line and keeps this app on the same App Router API.
- **`POST /api/contact` is a Node.js function** (`runtime = "nodejs"`, `maxDuration = 30`). Nodemailer needs real TLS sockets, which the Edge runtime cannot provide; Vercel permits outbound 465/587 and blocks only port 25.
- **No pooled socket in serverless.** The mailer disables connection pooling when it detects Vercel/Lambda, so a frozen instance never hands out a dead TLS connection. Locally it still pools.
- **`npm run dev` is plain `next dev`** — the same code path Vercel builds. The Socket.IO echo server in `server.ts` is local-only (`npm run dev:socket`, `npm run start:socket`); Vercel does not run custom `listen()` servers.
- **SQLite/Prisma is not part of the site** — nothing in the deployed pages imports it, and a local `.db` file would not persist on Vercel.

The project is also connected to the GitLab repo, so pushing to `main` deploys production and any other branch deploys a preview — the CLI command is only needed for the first push or for env changes.

### First-deploy checklist

0. Attach your domain under **Project → Settings → Domains**. HTTPS only works once the domain is added to this project (a DNS record alone yields a certificate error).
1. Open the production URL and submit the contact form once.
2. Confirm the notification arrives in `info@hikmahsphere.site` as the designed HTML card, and that **Reply** addresses the visitor.
3. Post to `/api/contact` with an empty body — expect `422`; with the honeypot filled — expect `200` and no mail.
4. If delivery fails, check **Vercel → Deployments → Functions → /api/contact** logs: `EAUTH` means the Zoho password/username pair is wrong, a timeout means the host or port is wrong for your Zoho data centre.


## 🧩 Embeddable developer contact form

A separate, drop-in contact form for the sites you build for other people — the
"Designed & developed by Ifrahuddin Azmi" credit becomes a working lead capture
channel.

```html
<script src="https://your-domain.com/embed/dev-contact.js" defer></script>
<a href="#" data-dev-contact>Designed &amp; developed by Ifrahuddin Azmi</a>
```

Clicking the credit opens an animated Shadow-DOM modal (host CSS cannot break
it). Visitors pick a service — website, mobile app, microservices, design,
marketing, deployment and more — then choose email or a `+91` callback. Every
submission arrives as a designed brief with budget, timeline and a one-click
reply. The widget needs no framework; the API is cross-origin and lockable to
specific client domains.

- **Preview:** `/dev-contact` · **Iframe embed:** `/dev-contact?embed=1`
- **Widget:** [`public/embed/dev-contact.js`](public/embed/dev-contact.js)
- **API:** [`src/app/api/dev-contact/route.ts`](src/app/api/dev-contact/route.ts)
- **Full guide:** [`docs/developer-contact-form.md`](docs/developer-contact-form.md) — embedding, field rules, CORS, theming and Vercel steps.

Disabled by default (`CONTACT_ALLOWED_ORIGINS=*` is permissive); set an explicit
allowlist before handing the script to clients you don't control.

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
└── lib/                # Utility functions and configurations
```

## 🎨 Available Features & Components

This scaffold includes a comprehensive set of modern web development tools:

### 🧩 UI Components (shadcn/ui)
- **Layout**: Card, Separator, Aspect Ratio, Resizable Panels
- **Forms**: Input, Textarea, Select, Checkbox, Radio Group, Switch
- **Feedback**: Alert, Toast (Sonner), Progress, Skeleton
- **Navigation**: Breadcrumb, Menubar, Navigation Menu, Pagination
- **Overlay**: Dialog, Sheet, Popover, Tooltip, Hover Card
- **Data Display**: Badge, Avatar, Calendar

### 📊 Advanced Data Features
- **Tables**: Powerful data tables with sorting, filtering, pagination (TanStack Table)
- **Charts**: Beautiful visualizations with Recharts
- **Forms**: Type-safe forms with React Hook Form + Zod validation

### 🎨 Interactive Features
- **Animations**: Smooth micro-interactions with Framer Motion
- **Drag & Drop**: Modern drag-and-drop functionality with DND Kit
- **Theme Switching**: Built-in dark/light mode support

### 🔐 Backend Integration
- **Authentication**: Ready-to-use auth flows with NextAuth.js
- **Database**: Type-safe database operations with Prisma
- **API Client**: HTTP requests with Axios + TanStack Query
- **State Management**: Simple and scalable with Zustand

### 🌍 Production Features
- **Internationalization**: Multi-language support with Next Intl
- **Image Optimization**: Automatic image processing with Sharp
- **Type Safety**: End-to-end TypeScript with Zod validation
- **Essential Hooks**: 100+ useful React hooks with ReactUse for common patterns

---

Crafted with ❤️ by Ifrahuddin Azmi

