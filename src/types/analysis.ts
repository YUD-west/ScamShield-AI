export type RiskLevel = "low" | "medium" | "high" | "critical";

export type ScamType =
  | "phishing"
  | "credential_harvesting"
  | "crypto_scam"
  | "romance_scam"
  | "job_scam"
  | "giveaway_scam"
  | "impersonation"
  | "otp_theft"
  | "tech_support"
  | "unknown";

export interface AnalysisOutput {
  scam_probability: number;
  risk_level: RiskLevel;
  scam_type: ScamType;
  detected_tactics: string[];
  detected_attack_vectors: string[];
  suspicious_keywords: string[];
  malicious_links: string[];
  impersonated_brand: string | null;
  emotional_manipulation: {
    fear: number;
    urgency: number;
    greed: number;
    authority: number;
  };
  urgency_score: number;
  ai_summary: string;
  recommended_actions: string[];
  confidence_score: number;
  attack_category: string;
  reasoning_trace?: string[];
  agent_outputs?: Record<string, unknown>;
  heatmap_words?: { word: string; weight: number }[];
  rag_context_used?: string[];
  scanId?: string | null;
}

export interface ScanProgressEvent {
  agent: string;
  status: "running" | "done" | "error";
  message: string;
  progress: number;
}

export interface UrlIntelligence {
  url: string;
  domain: string;
  domain_age_days: number | null;
  ssl_valid: boolean;
  blacklisted: boolean;
  typosquatting: boolean;
  redirect_chain: string[];
  suspicious_keywords: string[];
  reputation_score: number;
  geo_location: string | null;
  whois_summary: string;
  virus_total_positives?: number;
  safe_browsing_threat?: boolean;
}
