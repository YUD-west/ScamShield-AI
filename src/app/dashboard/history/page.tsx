"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiUrl } from "@/lib/api-url";
import {
  History,
  Search,
  Download,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ArrowUpDown,
  Clock,
  ExternalLink,
  ChevronRight,
  Trash2,
} from "lucide-react";

interface ScanRow {
  id: string;
  scamProbability: number;
  riskLevel: string;
  confidence: number;
  createdAt: string;
  input: string;
}

export default function HistoryPage() {
  const [scans, setScans] = useState<ScanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest">("newest");

  useEffect(() => {
    fetch(apiUrl("/api/scans?limit=50"))
      .then((r) => r.json())
      .then((d) => setScans(d.scans ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = scans
    .filter((s) => s.input.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortOrder === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return b.scamProbability - a.scamProbability;
    });

  const stats = {
    total: scans.length,
    threats: scans.filter((s) => s.scamProbability > 50).length,
    avgScore: scans.length ? Math.round(scans.reduce((a, s) => a + s.scamProbability, 0) / scans.length) : 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Scan History</h1>
          <p className="mt-1 text-muted-foreground">Your complete threat analysis archive</p>
        </div>
        <Button variant="cyber" asChild>
          <Link href="/dashboard/scan">New scan</Link>
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Scans", value: stats.total, icon: History, color: "text-cyan-400" },
          { label: "Threats Found", value: stats.threats, icon: AlertTriangle, color: "text-rose-400" },
          { label: "Avg Risk Score", value: `${stats.avgScore}%`, icon: Shield, color: "text-amber-400" },
        ].map((s) => (
          <Card key={s.label} className="glass">
            <CardContent className="flex items-center gap-3 p-4">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <div>
                <p className="font-mono text-lg font-bold">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search scanned URLs or messages..."
            className="pl-10 border-border/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(["newest", "oldest", "highest"] as const).map((order) => (
            <button
              key={order}
              onClick={() => setSortOrder(order)}
              className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs transition ${
                sortOrder === order
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                  : "border-border/50 text-muted-foreground hover:border-cyan-500/20"
              }`}
            >
              <ArrowUpDown className="h-3 w-3" />
              {order}
            </button>
          ))}
        </div>
      </div>

      <Card className="glass">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center p-12 text-center">
              <History className="h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">
                {search ? "No scans match your search." : "No scans yet. Run an analysis to build your history."}
              </p>
              {!search && (
                <Button variant="cyber" className="mt-4" asChild>
                  <Link href="/dashboard/scan">Start your first scan</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filtered.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex flex-col gap-3 p-4 transition hover:bg-accent/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      s.scamProbability > 70 ? "bg-rose-500/20" : s.scamProbability > 40 ? "bg-amber-500/20" : "bg-emerald-500/20"
                    }`}>
                      {s.scamProbability > 50 ? (
                        <AlertTriangle className={`h-4 w-4 ${s.scamProbability > 70 ? "text-rose-400" : "text-amber-400"}`} />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <code className="block truncate text-sm font-mono">{s.input}</code>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(s.createdAt).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Confidence: {Math.round(s.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`font-mono text-lg font-bold ${
                        s.scamProbability > 70 ? "text-rose-400" : s.scamProbability > 40 ? "text-amber-400" : "text-emerald-400"
                      }`}>
                        {Math.round(s.scamProbability)}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">Risk</p>
                    </div>
                    <Badge variant={s.riskLevel.toLowerCase() as "critical"} className="text-[10px]">{s.riskLevel}</Badge>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-border/50">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-border/50" asChild>
                        <a href={apiUrl(`/api/reports/${s.id}/pdf`)} download>
                          <Download className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
