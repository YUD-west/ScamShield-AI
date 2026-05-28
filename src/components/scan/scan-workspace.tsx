"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ScanSearch, Shield, AlertCircle, Download, ImageUp } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useScanStore } from "@/stores/scan-store";
import type { AnalysisOutput } from "@/types/analysis";
import { ThreatMeter } from "@/components/scan/threat-meter";
import { apiUrl } from "@/lib/api-url";
import { cn, riskColor } from "@/lib/utils";

const DEMO = `URGENT: Your PayPal account has been limited. Click here to verify within 24 hours: http://bit.ly/secure-paypal-verify`;

async function downloadPdf(result: AnalysisOutput, input: string) {
  if (result.scanId) {
    window.open(apiUrl(`/api/reports/${result.scanId}/pdf`), "_blank");
    return;
  }
  const res = await fetch(apiUrl("/api/reports/pdf"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ result, inputPreview: input }),
  });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "scamshield-report.pdf";
  a.click();
  URL.revokeObjectURL(url);
}

export function ScanWorkspace({ compact = false }: { compact?: boolean }) {
  const { content, setContent, loading, progress, result, error, analyze, analyzeImage, reset } =
    useScanStore();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("space-y-6", compact && "max-w-4xl mx-auto")}>
      <Card className="glass-strong overflow-hidden border-cyan-500/20">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ScanSearch className="h-5 w-5 text-cyan-400" />
            AI Threat Scanner
            <Badge variant="outline" className="ml-auto text-xs font-normal">
              Multi-agent · Real-time
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="relative">
            {loading && (
              <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-xl">
                <div className="absolute left-0 right-0 h-px animate-scan-line bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
              </div>
            )}
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste SMS, email, DM, or suspicious URL…"
              rows={compact ? 4 : 6}
              disabled={loading}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="cyber" size="lg" onClick={analyze} disabled={loading || !content.trim()}>
              <ScanSearch className="h-5 w-5" />
              {loading ? "Agents analyzing…" : "Analyze Threat"}
            </Button>
            <Button variant="outline" onClick={() => setContent(DEMO)} disabled={loading}>
              Sample threat
            </Button>
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => fileRef.current?.click()}
            >
              <ImageUp className="h-4 w-4" /> Screenshot
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void analyzeImage(f);
                e.target.value = "";
              }}
            />
            {result && (
              <Button variant="ghost" onClick={reset}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <AnimatePresence>
        {loading && progress && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass rounded-2xl p-6"
          >
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="font-mono text-cyan-300">{progress.agent}</span>
              <span className="text-muted-foreground">{progress.progress}%</span>
            </div>
            <Progress value={progress.progress} />
            <p className="mt-3 text-sm text-muted-foreground">{progress.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 lg:grid-cols-2"
          >
            <Card className="glass-strong border-cyan-500/20 lg:col-span-2 overflow-hidden">
              <CardContent className="flex flex-col gap-8 pt-8 md:flex-row md:items-center md:justify-between">
                <ThreatMeter probability={result.scam_probability} riskLevel={result.risk_level} />
                <div className="flex flex-wrap gap-2 md:flex-1 md:justify-center">
                  <Badge variant={result.risk_level as "critical"} className="uppercase">
                    {result.risk_level} risk
                  </Badge>
                  <Badge variant="outline">{result.scam_type.replace(/_/g, " ")}</Badge>
                </div>
                <div className="w-full max-w-xs space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Confidence</span>
                    <span>{Math.round(result.confidence_score * 100)}%</span>
                  </div>
                  <Progress value={result.confidence_score * 100} />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => downloadPdf(result, content)}
                  >
                    <Download className="h-4 w-4" /> PDF Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-base">AI explanation</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{result.ai_summary}</CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-base">Attack vectors</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {(result.detected_attack_vectors ?? result.detected_tactics).map((t) => (
                  <Badge key={t} variant="outline">
                    {t}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            <Card className="glass lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  Recommended actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2 md:grid-cols-2">
                  {result.recommended_actions.map((a) => (
                    <li key={a} className="flex gap-2 text-sm text-emerald-300/90">
                      <span className="text-cyan-500">→</span> {a}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {result.heatmap_words && result.heatmap_words.length > 0 && (
              <Card className="glass lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Suspicious keyword heatmap</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {result.heatmap_words.map(({ word, weight }) => (
                    <span
                      key={word}
                      className="rounded-lg px-3 py-1 font-mono"
                      style={{
                        background: `rgba(34,211,238,${weight * 0.35})`,
                        fontSize: `${0.75 + weight * 0.45}rem`,
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
