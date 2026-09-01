/**
 * The app's base path on GitHub Pages (e.g. "/claude-website-learning"),
 * empty in local dev. Set from next.config.mjs into NEXT_PUBLIC_BASE_PATH so
 * it's available on both server and client.
 *
 * next/link and the router already prefix this automatically — this helper
 * is only needed for raw URLs we build ourselves (audio file src attributes,
 * anything not going through next/link).
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function withBasePath(pathname: string): string {
  return `${BASE_PATH}${pathname}`;
}
