export interface VirusTotalResult {
  positives: number;
  total: number;
  permalink: string | null;
}

export async function scanUrlVirusTotal(url: string): Promise<VirusTotalResult | null> {
  const key = process.env.VIRUSTOTAL_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(
      `https://www.virustotal.com/api/v3/urls/${Buffer.from(url).toString("base64url")}`,
      { headers: { "x-apikey": key }, next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const stats = data?.data?.attributes?.last_analysis_stats;
    if (!stats) return null;
    const positives =
      (stats.malicious ?? 0) + (stats.suspicious ?? 0);
    const total = Object.values(stats as Record<string, number>).reduce(
      (a, b) => a + b,
      0,
    );
    return {
      positives,
      total,
      permalink: data?.data?.links?.self ?? null,
    };
  } catch {
    return null;
  }
}
