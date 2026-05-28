"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "2.4M+", label: "Threats analyzed" },
  { value: "99.2%", label: "Detection accuracy" },
  { value: "<2s", label: "Avg response time" },
  { value: "150+", label: "Countries protected" },
];

export function StatsBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-md md:grid-cols-4 md:gap-4"
    >
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <p className="font-mono text-2xl font-bold text-cyan-400 md:text-3xl">{s.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </motion.div>
  );
}
