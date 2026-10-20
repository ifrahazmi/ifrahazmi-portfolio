#!/usr/bin/env node
/**
 * One-command Vercel pipeline for this portfolio.
 *
 *   npm run deploy          push SMTP_* vars to Vercel, then deploy to production
 *   npm run deploy:preview  same, but deploy a preview URL instead of production
 *   npm run env:push        only sync the variables (no deploy)
 *
 * What it does:
 *   1. reads .env.local (or --env-file <path>), ignoring comments and quotes
 *   2. checks the Vercel CLI is logged in
 *   3. links this folder to the `portfolio` project if it isn't already
 *   4. pushes every SMTP_* variable to production, preview and development
 *   5. runs `vercel deploy --prod` and prints the live URL
 *
 * Flags:
 *   --project <name>   Vercel project name/id (default: portfolio)
 *   --env-file <path>  alternate env file (default: .env.local, then .env)
 *   --skip-env         skip variable sync
 *   --skip-deploy      skip the deploy step
 *   --preview          deploy a preview build instead of promoting to production
 *
 * Values are piped over stdin, never passed as command-line arguments, and are
 * never printed. Set VERCEL_TOKEN for non-interactive/CI use.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TARGETS = ["production", "preview", "development"];
const REQUIRED = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
  "SMTP_TO",
];
/** Pushed only when present in the env file. */
const OPTIONAL = ["CONTACT_ALLOWED_ORIGINS"];
/** Values that should never be readable from the dashboard. */
const SECRET_KEYS = new Set(["SMTP_PASS"]);
const DEFAULT_PROJECT = "portfolio";

const argv = process.argv.slice(2);
const flag = (name) => {
  const index = argv.indexOf(name);
  return index === -1 ? undefined : argv[index + 1];
};
const skipDeploy = argv.includes("--skip-deploy");
const skipEnv = argv.includes("--skip-env");
const previewOnly = argv.includes("--preview");
const project = flag("--project") || DEFAULT_PROJECT;
const envFile = flag("--env-file");
const token = process.env.VERCEL_TOKEN;
/** Windows needs a shell to resolve `npx`; quote args and pass one command. */
const quoteArg = (value) =>
  /^[\w@./:=+-]+$/.test(value) ? value : `"${String(value).replace(/"/g, '\\"')}"`;

function run(args, { input, label = args.join(" ") } = {}) {
  const command = ["npx", "--yes", "vercel", ...args].map(quoteArg).join(" ");
  const result = spawnSync(command, {
    cwd: ROOT,
    input,
    encoding: "utf8",
    shell: true,
    stdio: [input === undefined ? "ignore" : "pipe", "pipe", "pipe"],
  });

  if (result.error) {
    throw new Error(`${label} could not start: ${result.error.message}`);
  }
  if (result.status !== 0) {
    const detail = `${result.stdout ?? ""}\n${result.stderr ?? ""}`
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
      .slice(-5)
      .join("\n  ");
    throw new Error(`${label} failed (exit ${result.status})${detail ? `\n  ${detail}` : ""}`);
  }
  return `${result.stdout ?? ""}`.trim();
}

const withToken = (args) => (token ? [...args, "--token", token] : args);

function parseEnvFile(text) {
  const out = {};
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).replace(/^export\s+/, "").trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) out[key] = value;
  }
  return out;
}

function loadEnv() {
  const candidates = envFile ? [envFile] : [".env.local", ".env"];
  for (const candidate of candidates) {
    const path = resolve(ROOT, candidate);
    if (!existsSync(path)) continue;
    const parsed = parseEnvFile(readFileSync(path, "utf8"));
    if (Object.keys(parsed).length) {
      console.log(`[ok]   loaded ${candidate}`);
      return { file: candidate, vars: parsed };
    }
  }
  throw new Error(
    `No environment file found (looked for ${candidates.join(", ")}).\n` +
      "       Copy .env.example to .env.local and fill in the SMTP values.",
  );
}

function ensureAuth() {
  try {
    const user = run(withToken(["whoami"]), { label: "vercel whoami" });
    console.log(`[ok]   Vercel CLI authenticated as ${user.split("\n").pop()}`);
  } catch {
    throw new Error("Vercel CLI is not logged in. Run `npx vercel login`, then re-run this script.");
  }
}

function ensureLinked() {
  const linkPath = resolve(ROOT, ".vercel/project.json");
  if (existsSync(linkPath)) {
    const linked = JSON.parse(readFileSync(linkPath, "utf8"));
    console.log(`[ok]   linked to project ${linked.projectName ?? linked.projectId}`);
    return;
  }
  console.log(`[..]   linking to Vercel project "${project}"`);
  run(withToken(["link", "--yes", "--project", project]), { label: "vercel link" });
  console.log(`[ok]   linked to project "${project}"`);
}

function pushEnv(vars) {
  const missing = REQUIRED.filter((key) => !vars[key]?.trim());
  if (missing.length) {
    throw new Error(
      `Missing ${missing.join(", ")} in the env file. Add them and re-run — ` +
        "the contact form cannot send mail without them.",
    );
  }

  if (vars.SMTP_PASS === "your-zoho-app-password") {
    throw new Error("SMTP_PASS is still the placeholder from .env.example.");
  }

  const keys = [...REQUIRED, ...OPTIONAL.filter((key) => vars[key]?.trim())];

  for (const key of keys) {
    const value = vars[key];
    const add = (target, typeArgs) =>
      run(withToken(["env", "add", key, target, "--force", ...typeArgs, "--non-interactive"]), {
        label: `vercel env add ${key} ${target}`,
        input: value,
      });

    // Vercel does not let an existing variable flip between config and secret,
    // so try the sensible type first and fall back to the other one.
    const preferred = SECRET_KEYS.has(key) ? ["--sensitive"] : ["--type", "config"];
    const fallback = SECRET_KEYS.has(key) ? ["--type", "config"] : ["--sensitive"];
    let typeArgs = preferred;

    try {
      add(TARGETS[0], typeArgs);
    } catch {
      typeArgs = fallback;
      add(TARGETS[0], typeArgs);
    }

    for (const target of TARGETS.slice(1)) add(target, typeArgs);

    console.log(`[ok]   ${key} → ${TARGETS.join(", ")}`);
  }
}

function deploy() {
  const args = previewOnly ? ["deploy", "--yes"] : ["deploy", "--prod", "--yes"];
  console.log(`[..]   building and deploying ${previewOnly ? "a preview" : "to production"}`);
  const output = run(withToken(args), { label: `vercel ${args.join(" ")}` });
  const url = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^https?:\/\//.test(line))
    .pop();
  if (!url) throw new Error(`Deploy finished but no URL was reported:\n${output}`);
  return url;
}

function main() {
  console.log("\nVercel deploy — portfolio\n");
  const { vars } = skipEnv ? { vars: {} } : loadEnv();
  ensureAuth();
  ensureLinked();
  if (!skipEnv) pushEnv(vars);
  if (skipDeploy) {
    console.log("\n[ok]   environment synced. Run `npm run deploy` to ship.\n");
    return;
  }
  const url = deploy();
  console.log(`\n[ok]   ${previewOnly ? "preview" : "live"} at ${url}\n`);
}

try {
  main();
} catch (error) {
  console.error(`\n[err]  ${error.message}\n`);
  process.exit(1);
}
