export const config = {
  app: {
    name: "ScamShield AI",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3011",
    port: Number(process.env.PORT) || 3011,
  },
  plans: {
    free: { dailyScans: 10, features: ["basic_scan", "heuristic_ai"] },
    pro: { dailyScans: -1, features: ["unlimited_scan", "openai", "pdf", "url_intel"] },
    enterprise: { dailyScans: -1, features: ["api", "bulk", "priority"] },
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    prices: {
      pro: process.env.STRIPE_PRICE_PRO ?? "",
      enterprise: process.env.STRIPE_PRICE_ENTERPRISE ?? "",
    },
  },
  ai: {
    openaiKey: process.env.OPENAI_API_KEY,
  },
  threatIntel: {
    virusTotalKey: process.env.VIRUSTOTAL_API_KEY,
    safeBrowsingKey: process.env.GOOGLE_SAFE_BROWSING_KEY,
  },
} as const;
