import type { NextConfig } from "next";
import path from "path";

// Pin workspace root to this app (avoids picking C:\Users\Administrator\package-lock.json)
const renderBackend = process.env.RENDER_BACKEND_URL?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async rewrites() {
    if (!renderBackend) return [];
    const apiRoutes = [
      "scan",
      "scans",
      "ocr",
      "url",
      "chat",
      "ai",
      "dashboard",
      "admin",
      "reports",
      "stripe/webhook",
      "v1",
      "integrations",
      "health",
    ];
    return apiRoutes.flatMap((segment) => [
      {
        source: `/api/${segment}`,
        destination: `${renderBackend}/api/${segment}`,
      },
      {
        source: `/api/${segment}/:path*`,
        destination: `${renderBackend}/api/${segment}/:path*`,
      },
    ]);
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        { key: "X-App", value: "ScamShield-AI" },
        // HSTS - enforce HTTPS (production)
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains; preload",
        },
        // CSP - prevent XSS attacks
        {
          key: "Content-Security-Policy",
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
        },
      ],
    },
  ],
};

export default nextConfig;