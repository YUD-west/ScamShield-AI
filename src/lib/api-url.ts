/**
 * API base URL for client-side fetches.
 * - Local / single-host deploy: empty → same-origin `/api/...`
 * - Vercel frontend + Render backend: set NEXT_PUBLIC_API_URL to Render URL
 */
export function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${normalized}` : normalized;
}
