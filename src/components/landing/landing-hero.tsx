"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsBar } from "@/components/landing/stats-bar";

export function LandingHero() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-28 text-center md:pt-36">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-5 py-2 text-sm text-cyan-300 shadow-lg shadow-cyan-500/10"
      >
        <Sparkles className="h-4 w-4" />
        Enterprise AI threat intelligence platform
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-glow text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
      >
        Stop scams{" "}
        <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
          before they strike
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl"
      >
        ScamShield AI detects phishing, social engineering, and fraudulent messages in seconds —
        powered by autonomous agents and real-time threat intelligence.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-12 flex flex-wrap items-center justify-center gap-4"
      >
        <Button variant="cyber" size="lg" className="h-12 px-8 text-base shadow-lg shadow-cyan-500/25" asChild>
          <Link href="/sign-up">
            Start free trial <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="h-12 border-cyan-500/30 px-8" asChild>
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground"
      >
        {[
          { icon: Shield, text: "SOC-grade analysis" },
          { icon: Zap, text: "Sub-2s response" },
          { icon: Sparkles, text: "No API key required" },
        ].map((item) => (
          <span key={item.text} className="flex items-center gap-2">
            <item.icon className="h-3.5 w-3.5 text-cyan-500" />
            {item.text}
          </span>
        ))}
      </motion.div>

      <StatsBar />
    </section>
  );
}
