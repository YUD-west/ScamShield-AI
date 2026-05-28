import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { AUTH_SECRET } from "@/lib/auth-secret";
import { clearAuthCookies } from "@/lib/clear-auth-cookies";

const allowedOrigin =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";

function withCors(response: NextResponse, origin: string | null) {
  if (!allowedOrigin || !origin || origin !== allowedOrigin) return response;
  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin");

  if (pathname.startsWith("/api/") && request.method === "OPTIONS") {
    return withCors(new NextResponse(null, { status: 204 }), origin);
  }

  let token = null;
  try {
    token = await getToken({ req: request, secret: AUTH_SECRET });
  } catch {
    const res = clearAuthCookies(NextResponse.next());
    if (pathname.startsWith("/api/")) return withCors(res, origin);
    return res;
  }

  const isLoggedIn = !!token;

  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if ((pathname === "/sign-in" || pathname === "/sign-up") && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const response = NextResponse.next();
  if (pathname.startsWith("/api/")) {
    return withCors(response, origin);
  }
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
};
