import type { NextResponse } from "next/server";

const AUTH_COOKIE_NAMES = [
  "authjs.session-token",
  "next-auth.session-token",
  "__Secure-authjs.session-token",
  "__Host-authjs.csrf-token",
  "next-auth.csrf-token",
  "authjs.csrf-token",
  "__Secure-next-auth.session-token",
];

/** Remove stale session cookies (e.g. after AUTH_SECRET change). */
export function clearAuthCookies(response: NextResponse): NextResponse {
  for (const name of AUTH_COOKIE_NAMES) {
    response.cookies.set(name, "", { maxAge: 0, path: "/" });
  }
  return response;
}
