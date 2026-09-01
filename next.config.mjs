// GitHub Pages serves project repos from https://<user>.github.io/<repo>/,
// not from the domain root, so the app needs to know its own base path.
// Derived from GITHUB_REPOSITORY (auto-provided by GitHub Actions, format
// "owner/repo") rather than hardcoded, so a repo rename doesn't break this.
// Empty locally (npm run dev / npm run build outside CI) — no basePath there.
const repoName = process.env.GITHUB_REPOSITORY?.split('/')?.[1];
const basePath = process.env.GITHUB_ACTIONS === 'true' && repoName ? `/${repoName}` : '';

// Next's automatic basePath prefixing (next/link, next/navigation, next/image)
// doesn't cover plain strings we build ourselves (e.g. <audio src="...">), so
// expose it as a public env var too — see src/lib/basePath.ts.
process.env.NEXT_PUBLIC_BASE_PATH = basePath;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export: GitHub Pages has no Node server to run `next start`.
  output: 'export',
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  // Every route folder becomes .../index.html, served by requesting the
  // folder path — the norm for static hosts, no server rewrite rules needed.
  trailingSlash: true,
  images: {
    // The Image Optimization API needs a server; not available on a static
    // export. Not using next/image today, but this keeps the door open.
    unoptimized: true,
  },
};

export default nextConfig;
