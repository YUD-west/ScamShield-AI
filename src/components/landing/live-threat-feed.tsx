"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, AlertTriangle, Shield, Zap, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Threat {
  id: number;
  type: string;
  location: string;
  target: string;
  risk: "critical" | "high" | "medium";
  time: string;
}

const threats: Threat[] = [
  { id: 1, type: "Phishing", location: "US", target: "PayPal", risk: "critical", time: "Just now" },
  { id: 2, type: "Crypto Scam", location: "Russia", target: "Bitcoin Wallet", risk: "high", time: "12s ago" },
  { id: 3, type: "Banking Fraud", location: "UK", target: "HSBC", risk: "critical", time: "23s ago" },
  { id: 4, type: "Impersonation", location: "Germany", target: "Amazon", risk: "high", time: "35s ago" },
  { id: 5, type: "QR Phishing", location: "Singapore", target: "Parking App", risk: "medium", time: "47s ago" },
  { id: 6, type: "Job Scam", location: "India", target: "LinkedIn", risk: "high", time: "52s ago" },
  { id: 7, type: "Giveaway", location: "Brazil", target: "Netflix", risk: "medium", time: "1m ago" },
  { id: 8, type: "Vishing", location: "Canada", target: "Chase Bank", risk: "critical", time: "1m ago" },
];

const heatmapDots = [
  { x: 15, y: 20, size: 3, intensity: 0.9 },
  { x: 50, y: 30, size: 2.5, intensity: 0.7 },
  { x: 80, y: 25, size: 2, intensity: 0.6 },
  { x: 30, y: 60, size: 2.5, intensity: 0.8 },
  { x: 65, y: 55, size: 2, intensity: 0.5 },
  { x: 75, y: 45, size: 1.5, intensity: 0.4 },
  { x: 40, y: 40, size: 3, intensity: 0.9 },
  { x: 20, y: 70, size: 1.5, intensity: 0.3 },
  { x: 90, y: 50, size: 2, intensity: 0.6 },
  { x: 55, y: 65, size: 2.5, intensity: 0.7 },
  { x: 10, y: 45, size: 1.5, intensity: 0.4 },
  { x: 45, y: 15, size: 2, intensity: 0.5 },
];

export function LiveThreatFeed() {
  const [liveThreats, setLiveThreats] = useState<Threat[]>(threats.slice(0, 4));

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveThreats((prev) => {
        const next = [...prev];
        next.pop();
        const newThreat = threats[Math.floor(Math.random() * threats.length)];
        next.unshift({ ...newThreat, id: Date.now(), time: "Just now" });
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Global Threat Map</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Real-time intelligence from our global threat detection network
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 p-1">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(34,211,238,0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(52,211,153,0.2) 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, rgba(251,191,36,0.15) 0%, transparent 50%)`
            }} />
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
            {heatmapDots.map((dot, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                animate={{
                  scale: [1, 1.5 + dot.intensity * 0.5, 1],
                  opacity: [dot.intensity * 0.3, dot.intensity * 0.8, dot.intensity * 0.3],
                }}
                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: `${dot.size * 4}px`,
                    height: `${dot.size * 4}px`,
                    background: `radial-gradient(circle, rgba(34,211,238,${dot.intensity}), rgba(34,211,238,0))`,
                    boxShadow: `0 0 ${20 * dot.intensity}px rgba(34,211,238,${dot.intensity * 0.3})`,
                  }}
                />
              </motion.div>
            ))}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> 42 active threats detected</span>
              <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Live Threat Feed</h3>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 gap-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Live
            </Badge>
          </div>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {liveThreats.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: 20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 p-3"
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    t.risk === "critical" ? "bg-rose-500/20" : "bg-amber-500/20"
                  }`}>
                    <AlertTriangle className={`h-4 w-4 ${t.risk === "critical" ? "text-rose-400" : "text-amber-400"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{t.target}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{t.type}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {t.location}</span>
                    </div>
                  </div>
                  <Badge variant={t.risk} className="text-[10px]">{t.risk}</Badge>
                  <span className="text-[10px] text-muted-foreground shrink-0">{t.time}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
