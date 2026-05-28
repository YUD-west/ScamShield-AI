"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tips = [
  { tip: "Enable two-factor authentication on every account that supports it. It blocks 99.9% of automated attacks.", category: "Authentication" },
  { tip: "Never use the same password across multiple sites. Use a password manager to generate unique passwords.", category: "Passwords" },
  { tip: "Hover over links before clicking to preview the real URL. Scammers disguise malicious links with text.", category: "Phishing" },
  { tip: "Legitimate companies never ask for your password, PIN, or 2FA code via email, text, or phone.", category: "Social Engineering" },
  { tip: "Keep your software, browser, and operating system updated. Patches fix security vulnerabilities.", category: "Updates" },
  { tip: "Free Wi-Fi networks can intercept your data. Always use a VPN on public networks.", category: "Networks" },
  { tip: "Review app permissions regularly. Many apps request access to data they don't need.", category: "Privacy" },
  { tip: "Be skeptical of urgent messages demanding immediate action. Scammers create false urgency.", category: "Scam Awareness" },
  { tip: "Crypto investment schemes promising guaranteed returns are almost always scams.", category: "Crypto" },
  { tip: "Back up your important data regularly. Ransomware attacks can lock you out of your files.", category: "Backup" },
  { tip: "Check your bank statements regularly for unauthorized transactions, no matter how small.", category: "Banking" },
  { tip: "AI voice scams are rising. Set a family code word to verify emergency calls.", category: "AI Safety" },
];

export function DailyTip() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % tips.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  useEffect(() => {
    const interval = setInterval(goNext, 15000);
    return () => clearInterval(interval);
  }, []);

  const tip = tips[index];

  return (
    <Card className="glass overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
            </div>
            <span className="text-xs font-semibold">Daily Security Tip</span>
          </div>
          <Badge variant="outline" className="text-[9px] border-cyan-500/20 text-cyan-400">
            <Sparkles className="h-3 w-3 mr-0.5" /> Tip {index + 1}/{tips.length}
          </Badge>
        </div>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ opacity: 0, x: direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm leading-relaxed">{tip.tip}</p>
            <div className="flex items-center justify-between mt-3">
              <Badge variant="outline" className="text-[9px] border-amber-500/20 text-amber-400">{tip.category}</Badge>
              <div className="flex gap-1">
                <button onClick={goPrev} className="flex h-6 w-6 items-center justify-center rounded-md border border-border/50 text-muted-foreground hover:text-foreground transition">
                  <ChevronLeft className="h-3 w-3" />
                </button>
                <button onClick={goNext} className="flex h-6 w-6 items-center justify-center rounded-md border border-border/50 text-muted-foreground hover:text-foreground transition">
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}


