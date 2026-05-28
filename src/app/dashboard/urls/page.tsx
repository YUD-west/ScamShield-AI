"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import type { UrlIntelligence } from "@/types/analysis";
import { apiUrl } from "@/lib/api-url";

export default function UrlsPage() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<UrlIntelligence | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(apiUrl("/api/url"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "URL analysis failed");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">URL & Domain Intelligence</h1>
      <Card className="glass">
        <CardContent className="flex gap-3 pt-6">
          <input
            className="flex-1 rounded-lg border border-input bg-background px-4 py-2 font-mono text-sm"
            placeholder="https://suspicious-link.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void analyze()}
          />
          <Button variant="cyber" onClick={() => void analyze()} disabled={loading || !url.trim()}>
            {loading ? "Analyzing…" : "Analyze URL"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-300">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {result && !("error" in result) && (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Domain", result.domain],
            ["Reputation", `${result.reputation_score}/100`],
            ["SSL Valid", result.ssl_valid ? "Yes" : "No"],
            ["Typosquatting", result.typosquatting ? "Detected" : "No"],
            ["Blacklisted", result.blacklisted ? "Yes" : "No"],
            ["Domain age", result.domain_age_days ? `${result.domain_age_days} days` : "Unknown"],
          ].map(([k, v]) => (
            <Card key={k} className="glass">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">{k}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono">{v}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
