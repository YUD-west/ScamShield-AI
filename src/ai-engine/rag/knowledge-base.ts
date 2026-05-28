/** Scam knowledge base for RAG retrieval (launch with curated intelligence) */
export interface KnowledgeChunk {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
}

export const SCAM_KNOWLEDGE: KnowledgeChunk[] = [
  {
    id: "phish-1",
    category: "phishing",
    title: "Credential harvesting via fake login",
    content:
      "Attackers impersonate banks or services and urge victims to click links to 'verify' accounts. Legitimate institutions never ask for passwords via SMS.",
    keywords: ["verify", "click", "login", "suspended", "account"],
  },
  {
    id: "crypto-1",
    category: "crypto_scam",
    title: "Irreversible crypto payments",
    content:
      "Scammers demand Bitcoin, USDT, or gift cards because transactions cannot be reversed. Any urgent crypto payment request is high risk.",
    keywords: ["bitcoin", "usdt", "crypto", "gift card", "wire"],
  },
  {
    id: "urgency-1",
    category: "social_engineering",
    title: "Artificial urgency",
    content:
      "Phrases like 'act now', 'within 24 hours', or 'account will be closed' create panic to bypass rational thinking.",
    keywords: ["urgent", "immediately", "24 hours", "expires", "act now"],
  },
  {
    id: "ceo-1",
    category: "impersonation",
    title: "CEO / executive impersonation",
    content:
      "Business email compromise uses fake executive requests for wire transfers or gift card purchases.",
    keywords: ["ceo", "executive", "wire transfer", "confidential"],
  },
  {
    id: "otp-1",
    category: "otp_theft",
    title: "OTP and verification code theft",
    content:
      "Never share one-time passwords. Scammers use stolen OTPs to hijack accounts in real time.",
    keywords: ["otp", "verification code", "6-digit", "code"],
  },
  {
    id: "romance-1",
    category: "romance_scam",
    title: "Romance scam progression",
    content:
      "Romance scams build trust over weeks then request money for emergencies, travel, or investments.",
    keywords: ["romance", "love", "send money", "telegram", "whatsapp"],
  },
];
