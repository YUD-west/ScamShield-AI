"use client";

import { motion } from "framer-motion";
import { Bot, Link2, Camera, LayoutDashboard, GraduationCap, Users } from "lucide-react";

const features = [
  { icon: Bot, title: "Multi-agent AI engine", desc: "Six autonomous agents orchestrate deep threat analysis in parallel." },
  { icon: Link2, title: "URL intelligence", desc: "WHOIS, SSL, typosquatting detection, and global reputation scoring." },
  { icon: Camera, title: "Screenshot OCR", desc: "Upload images — extract text and analyze scams instantly." },
  { icon: LayoutDashboard, title: "Command center", desc: "Live analytics, risk charts, and impersonation trend tracking." },
  { icon: GraduationCap, title: "Security education", desc: "Interactive training to recognize phishing and social engineering." },
  { icon: Users, title: "Threat community", desc: "Collaborative intelligence from verified security reports." },
];

export function FeaturesGrid() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 text-center"
      >
        <h2 className="text-3xl font-bold md:text-4xl">Enterprise-grade protection</h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Everything security teams need to detect, investigate, and prevent scams at scale.
        </p>
      </motion.div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass group rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10"
          >
            <div className="mb-4 inline-flex rounded-xl bg-cyan-500/10 p-3 transition group-hover:bg-cyan-500/20">
              <f.icon className="h-7 w-7 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
