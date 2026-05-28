import type { UrlIntelligence } from "@/types/analysis";

const SUSPICIOUS_TLDS = [".xyz", ".top", ".click", ".tk", ".buzz"];
const TRUSTED_BRANDS = ["paypal", "amazon", "apple", "google", "microsoft", "facebook", "instagram"];

export async function analyzeUrl(urlString: string): Promise<UrlIntelligence> {
  let url: URL;
  try {
    url = new URL(urlString.startsWith("http") ? urlString : `https://${urlString}`);
  } catch {
    return defaultReport(urlString, "invalid");
  }

  const domain = url.hostname.replace(/^www\./, "");
  const typosquatting = detectTyposquatting(domain);
  const suspiciousKw = SUSPICIOUS_TLDS.filter((t) => domain.endsWith(t));
  const sslValid = url.protocol === "https:";
  const reputation = typosquatting ? 15 : sslValid ? 72 : 45;

  return {
    url: urlString,
    domain,
    domain_age_days: mockDomainAge(domain),
    ssl_valid: sslValid,
    blacklisted: reputation < 30,
    typosquatting,
    redirect_chain: [urlString, `https://${domain}/redirect`],
    suspicious_keywords: suspiciousKw,
    reputation_score: reputation,
    geo_location: "Unknown (configure WHOIS API)",
    whois_summary: `Domain ${domain} — ${typosquatting ? "Possible typosquatting detected" : "No obvious typosquat"}`,
  };
}

function detectTyposquatting(domain: string): boolean {
  const base = domain.split(".")[0] ?? "";
  for (const brand of TRUSTED_BRANDS) {
    if (base.includes(brand) && base !== brand && levenshtein(base, brand) <= 2) return true;
    if (/paypa1|amaz0n|g00gle|micr0soft/.test(base)) return true;
  }
  return false;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i]![0] = i;
  for (let j = 0; j <= n; j++) dp[0]![j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i]![j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1]![j - 1]!
          : 1 + Math.min(dp[i - 1]![j]!, dp[i]![j - 1]!, dp[i - 1]![j - 1]!);
    }
  }
  return dp[m]![n]!;
}

function mockDomainAge(domain: string): number {
  let h = 0;
  for (const c of domain) h = (h * 31 + c.charCodeAt(0)) % 1000;
  return h < 200 ? 14 : 400 + (h % 2000);
}

function defaultReport(url: string, domain: string): UrlIntelligence {
  return {
    url,
    domain,
    domain_age_days: null,
    ssl_valid: false,
    blacklisted: true,
    typosquatting: false,
    redirect_chain: [],
    suspicious_keywords: [],
    reputation_score: 10,
    geo_location: null,
    whois_summary: "Invalid URL",
  };
}
