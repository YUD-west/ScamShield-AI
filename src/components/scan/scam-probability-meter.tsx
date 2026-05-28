"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertTriangle, Shield, CheckCircle2, Zap } from "lucide-react";

interface Props {
  probability: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
}

export function ScamProbabilityMeter({ probability, size = "md", showLabel = true, animated = true }: Props) {
  const safeProbability = Math.max(0, Math.min(100, probability));
  const isDangerous = safeProbability > 60;
  const isSuspicious = safeProbability > 30 && safeProbability <= 60;
  const isSafe = safeProbability <= 30;

  const meterColor = isDangerous ? "from-rose-500 to-pink-600" : isSuspicious ? "from-amber-500 to-orange-600" : "from-emerald-500 to-cyan-500";
  const glowColor = isDangerous ? "rgba(244,63,94,0.3)" : isSuspicious ? "rgba(245,158,11,0.3)" : "rgba(52,211,153,0.3)";
  const label = isDangerous ? "Dangerous" : isSuspicious ? "Suspicious" : "Safe";
  const Icon = isDangerous ? AlertTriangle : isSuspicious ? Zap : CheckCircle2;

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3.5",
  };

  const fontSizes = {
    sm: "text-lg",
    md: "text-3xl",
    lg: "text-5xl",
  };

  return (
    <div className="space-y-2">
      <div className="relative overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={animated ? { width: 0 } : undefined}
          animate={{ width: `${safeProbability}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full bg-gradient-to-r", meterColor)}
          style={{ boxShadow: `0 0 12px ${glowColor}` }}
        />
      </div>
      {showLabel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={cn("h-4 w-4", isDangerous ? "text-rose-400" : isSuspicious ? "text-amber-400" : "text-emerald-400")} />
            <span className={cn("font-bold", fontSizes[size], isDangerous ? "text-rose-400" : isSuspicious ? "text-amber-400" : "text-emerald-400")}>
              {safeProbability}%
            </span>
            <span className="text-xs text-muted-foreground">Scam Probability</span>
          </div>
          <span className={cn(
            "rounded-full px-2.5 py-0.5 text-[10px] font-semibold border",
            isDangerous ? "bg-rose-500/10 text-rose-400 border-rose-500/30" :
            isSuspicious ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
            "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          )}>
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
