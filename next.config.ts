import type { NextConfig } from "next";

/**
 * Deliberately framework-standard: no custom webpack overrides, no ignored
 * type or lint errors. This is the exact shape Vercel builds, so a green
 * `npm run build` locally means a green Vercel build.
 *
 * `server.ts` (Socket.IO echo server) is a local-only convenience and is not
 * part of this build — see README > "Deploying to Vercel".
 */
const nextConfig: NextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  // The dev-mode badge would otherwise sit on top of screenshots and the hero.
  devIndicators: false,
};

export default nextConfig;
