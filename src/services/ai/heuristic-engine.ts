import type { AnalysisOutput, RiskLevel, ScamType } from "@/types/analysis";

const PATTERNS: {
  regex: RegExp;
  tactic: string;
  keywords: string[];
  score: number;
  category: string;
}[] = [
  {
    regex: /urgent|immediately|act now|within \d+ hours?|expires? (today|soon)/i,
    tactic: "Urgency manipulation",
    keywords: ["urgent", "immediately"],
    score: 15,
    category: "phishing",
  },
  {
    regex: /click (here|below|link)|verify (your|account)|confirm your (identity|account)/i,
    tactic: "Credential harvesting",
    keywords: ["verify", "click here"],
    score: 22,
    category: "phishing",
  },
  {
    regex: /bitcoin|crypto|usdt|wire transfer|gift card|western union|seed phrase/i,
    tactic: "Financial scam",
    keywords: ["bitcoin", "gift card"],
    score: 28,
    category: "crypto_scam",
  },
  {
    regex: /you('ve| have) won|lottery|prize|congratulations|free (iphone|money)/i,
    tactic: "Prize / giveaway scam",
    keywords: ["won", "prize"],
    score: 22,
    category: "giveaway_scam",
  },
  {
    regex: /work from home|earn \$?\d+k|job offer|hiring immediately/i,
    tactic: "Fake job scam",
    keywords: ["work from home"],
    score: 20,
    category: "job_scam",
  },
  {
    regex: /dear (customer|user|sir|madam)|valued customer/i,
    tactic: "Generic mass message",
    keywords: ["dear customer"],
    score: 8,
    category: "impersonation",
  },
  {
    regex: /otp|verification code|password|ssn|bank account/i,
    tactic: "OTP / credential theft",
    keywords: ["otp", "verification code"],
    score: 26,
    category: "otp_theft",
  },
  {
    regex: /telegram|whatsapp|signal me|text me on/i,
    tactic: "Off-platform pivot",
    keywords: ["telegram", "whatsapp"],
    score: 12,
    category: "social_engineering",
  },
  {
    regex: /romance|lonely|send photos|meet me/i,
    tactic: "Romance scam indicators",
    keywords: ["romance"],
    score: 18,
    category: "romance_scam",
  },
];

function levelFromScore(score: number): RiskLevel {
  if (score >= 75) return "critical";
  if (score >= 50) return "high";
  if (score >= 25) return "medium";
  return "low";
}

function extractUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s]+|bit\.ly\/[^\s]+|t\.co\/[^\s]+/gi);
  return matches ?? [];
}

export function runHeuristicAnalysis(content: string): AnalysisOutput {
  const trimmed = content.trim();
  const tactics: string[] = [];
  const keywords = new Set<string>();
  let score = 0;
  let category = "unknown";

  for (const p of PATTERNS) {
    if (p.regex.test(trimmed)) {
      tactics.push(p.tactic);
      p.keywords.forEach((k) => keywords.add(k));
      score += p.score;
      category = p.category;
    }
  }

  const links = extractUrls(trimmed);
  if (links.length) {
    score += 12;
    tactics.push("Suspicious links detected");
  }

  const capsRatio = (trimmed.match(/[A-Z]/g)?.length ?? 0) / Math.max(trimmed.length, 1);
  const urgencyBoost = capsRatio > 0.35 ? 10 : 0;
  score += urgencyBoost;

  const probability = Math.min(98, Math.max(3, score));
  const risk = levelFromScore(probability);

  const fear = /suspend|block|legal|arrest|fine|penalty/i.test(trimmed) ? 0.8 : 0.2;
  const urgency = /urgent|now|today|expires|24 hours/i.test(trimmed) ? 0.9 : 0.3;
  const greed = /won|free|profit|investment|double/i.test(trimmed) ? 0.85 : 0.2;
  const authority = /irs|bank|paypal|amazon|microsoft|support team/i.test(trimmed) ? 0.75 : 0.2;

  const words = trimmed.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
  const heatmap = [...keywords].map((word) => ({
    word,
    weight: 0.5 + Math.random() * 0.5,
  }));

  const verdicts: Record<RiskLevel, string> = {
    low: "Low scam likelihood. No major threat patterns detected.",
    medium: "Moderate risk. Some social engineering indicators present.",
    high: "High risk. Multiple scam patterns and manipulation tactics detected.",
    critical: "Critical threat. Do not click links or share credentials.",
  };

  const scamTypeMap: Record<string, ScamType> = {
    phishing: "phishing",
    crypto_scam: "crypto_scam",
    job_scam: "job_scam",
    giveaway_scam: "giveaway_scam",
    impersonation: "impersonation",
    otp_theft: "otp_theft",
    social_engineering: "phishing",
    romance_scam: "romance_scam",
  };

  return {
    scam_probability: probability,
    risk_level: risk,
    scam_type: scamTypeMap[category] ?? "unknown",
    detected_tactics: [...new Set(tactics)],
    detected_attack_vectors: [...new Set(tactics)],
    suspicious_keywords: [...keywords],
    malicious_links: links,
    impersonated_brand: detectBrand(trimmed),
    emotional_manipulation: { fear, urgency, greed, authority },
    urgency_score: Math.round(urgency * 100),
    ai_summary: verdicts[risk],
    recommended_actions: getActions(risk, links.length > 0),
    confidence_score: Math.min(0.95, 0.55 + tactics.length * 0.08),
    attack_category: category,
    reasoning_trace: [
      "Heuristic NLP classifier executed",
      `Matched ${tactics.length} threat pattern(s)`,
      links.length ? `Extracted ${links.length} URL(s)` : "No URLs found",
    ],
    heatmap_words: heatmap.length ? heatmap : words.slice(0, 8).map((w) => ({ word: w, weight: 0.4 })),
  };
}

function detectBrand(text: string): string | null {
  const brands = ["PayPal", "Amazon", "Apple", "Microsoft", "Google", "Meta", "IRS", "Bank"];
  for (const b of brands) {
    if (new RegExp(b, "i").test(text)) return b;
  }
  return null;
}

function getActions(risk: RiskLevel, hasLinks: boolean): string[] {
  const base = [
    "Do not share passwords, OTPs, or payment details",
    "Verify sender through official channels",
  ];
  if (hasLinks) base.unshift("Do not click embedded links — type URLs manually");
  if (risk === "critical" || risk === "high") {
    base.push("Report to your platform's abuse team");
    base.push("Block the sender immediately");
  }
  return base;
}
