export function sanitizeText(input: string, maxLength = 50_000): string {
  return input
    .slice(0, maxLength)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("invalid");
    return parsed.toString();
  } catch {
    throw new Error("Invalid URL");
  }
}
