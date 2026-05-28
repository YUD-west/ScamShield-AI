"use client";

import { motion } from "framer-motion";
import { Shield, Award, Lock, CheckCircle2, Star, Zap } from "lucide-react";

const badges = [
  { icon: Shield, label: "SOC 2 Compliant", desc: "Enterprise security standards" },
  { icon: Award, label: "99.7% Accuracy", desc: "AI detection rate" },
  { icon: Lock, label: "End-to-End Encrypted", desc: "Your data stays private" },
  { icon: CheckCircle2, label: "500K+ Users", desc: "Trusted worldwide" },
  { icon: Star, label: "4.9/5 Rating", desc: "From security professionals" },
  { icon: Zap, label: "<500ms Analysis", desc: "Real-time protection" },
];

export function TrustBadges() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Trusted by Security Teams Worldwide</h2>
        </motion.div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass flex flex-col items-center rounded-xl p-5 text-center transition hover:border-cyan-500/30"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/10">
                <badge.icon className="h-6 w-6 text-cyan-400" />
              </div>
              <p className="text-sm font-semibold">{badge.label}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
