/**
 * Services offered by the developer contact widget.
 *
 * The widget keeps a mirrored copy in `public/embed/dev-contact.js` because it
 * ships as a standalone script with no build step. Keep the ids in sync:
 * changing a label here is safe, changing an id here means changing the widget
 * too (otherwise the API rejects that submission with a 422).
 */

export type ServiceOption = { id: string; label: string };

export type ServiceCategory = {
  id: string;
  label: string;
  /** Placeholder for the free-text brief, tailored to the category. */
  hint: string;
  services: ServiceOption[];
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "general",
    label: "General inquiry",
    hint: "What would you like to ask? A sentence is enough.",
    services: [
      { id: "question", label: "Just a question" },
      { id: "hiring", label: "Full-time / hiring" },
      { id: "partnership", label: "Collaboration or partnership" },
      { id: "other-general", label: "Something else" },
    ],
  },
  {
    id: "website",
    label: "Website & web app",
    hint: "What should the site do? Pages, goals, references — anything helps.",
    services: [
      { id: "business-website", label: "Business website" },
      { id: "web-app", label: "Web app / dashboard" },
      { id: "ecommerce", label: "Online store" },
      { id: "redesign", label: "Website redesign" },
    ],
  },
  {
    id: "mobile",
    label: "Mobile app",
    hint: "Tell me about the app: platform, core screens, who uses it.",
    services: [
      { id: "android", label: "Android app" },
      { id: "ios", label: "iOS app" },
      { id: "cross-platform", label: "Cross-platform app" },
    ],
  },
  {
    id: "software",
    label: "Software & APIs",
    hint: "Describe the system, the integrations and what must be automated.",
    services: [
      { id: "microservices", label: "Microservices / backend API" },
      { id: "saas", label: "SaaS product build" },
      { id: "automation", label: "Automation / internal tools" },
      { id: "ai-integration", label: "AI integration / agents" },
    ],
  },
  {
    id: "design",
    label: "Design & branding",
    hint: "What are we designing, and what should it feel like?",
    services: [
      { id: "ui-ux", label: "UI/UX design" },
      { id: "logo-brand", label: "Logo & brand identity" },
      { id: "design-system", label: "Design system" },
    ],
  },
  {
    id: "marketing",
    label: "Growth & marketing",
    hint: "What are you promoting, and what does success look like?",
    services: [
      { id: "seo", label: "SEO" },
      { id: "ads", label: "Digital marketing / ads" },
      { id: "content", label: "Content & copywriting" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & deployment",
    hint: "What is running today, and where should it end up — Vercel, AWS, VPS?",
    services: [
      { id: "deploy-devops", label: "App deployment / DevOps" },
      { id: "domain-email", label: "Domain, DNS & business email" },
      { id: "audit", label: "Performance & security audit" },
    ],
  },
  {
    id: "other",
    label: "Something else",
    hint: "Tell me what you have in mind — I read every message.",
    services: [{ id: "custom", label: "Custom project" }],
  },
];

export const BUDGET_OPTIONS = [
  "Under ₹25k",
  "₹25k – ₹1L",
  "₹1L – ₹5L",
  "₹5L+",
  "Not sure yet",
] as const;

export const TIMELINE_OPTIONS = [
  "ASAP",
  "2–4 weeks",
  "1–3 months",
  "Flexible",
] as const;

export const CONTACT_METHODS = ["email", "phone"] as const;

export type ContactMethod = (typeof CONTACT_METHODS)[number];

/** Resolves both labels for the notification email, or null if invalid. */
export function findService(categoryId: string, serviceId: string) {
  const category = SERVICE_CATEGORIES.find((entry) => entry.id === categoryId);
  if (!category) return null;
  const service = category.services.find((entry) => entry.id === serviceId);
  if (!service) return null;
  return { category: category.label, service: service.label, hint: category.hint };
}

/**
 * Normalises an Indian mobile number to ten digits. Accepts `+91`, `91`,
 * spaces, dashes and parentheses; returns null when it is not a valid Indian
 * mobile (ten digits, starting 6–9).
 */
export function normalisePhone(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export const formatPhone = (digits: string) =>
  `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
