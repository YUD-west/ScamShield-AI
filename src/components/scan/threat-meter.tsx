"use client";

import { motion } from "framer-motion";
import { cn, riskColor } from "@/lib/utils";
import type { RiskLevel } from "@/types/analysis";

export function ThreatMeter({ probability, riskLevel }: { probability: number; riskLevel: RiskLevel }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (probability / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
        <motion.circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className={cn(
            riskLevel === "critical" && "stroke-rose-500",
            riskLevel === "high" && "stroke-orange-500",
            riskLevel === "medium" && "stroke-amber-500",
            riskLevel === "low" && "stroke-emerald-500",
          )}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("font-mono text-4xl font-bold", riskColor(riskLevel))}
        >
          {Math.round(probability)}%
        </motion.span>
        <span className="text-xs uppercase tracking-widest text-muted-foreground">threat</span>
      </div>
    </div>
  );
}
