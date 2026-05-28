"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, ExternalLink, Clock, TrendingUp, Shield, Lock } from "lucide-react";

const news = [
  { title: "New AI Voice Cloning Scam Targets Elderly", source: "CyberScoop", time: "2h ago", category: "AI Safety", url: "#" },
  { title: "QR Code Phishing Attacks Up 400% in 2025", source: "BleepingComputer", time: "5h ago", category: "Phishing", url: "#" },
  { title: "Major Banking Trojan Discovered in Google Play", source: "The Hacker News", time: "8h ago", category: "Malware", url: "#" },
  { title: "Deepfake Fraud: $25M Stolen Using AI Impersonation", source: "Reuters", time: "12h ago", category: "Deepfake", url: "#" },
  { title: "New Ransomware Group Targeting Healthcare", source: "ZDNet", time: "1d ago", category: "Ransomware", url: "#" },
  { title: "Zero-Day Exploit Found in Popular VPN Service", source: "Wired", time: "1d ago", category: "Vulnerability", url: "#" },
  { title: "Fake LinkedIn Recruiters Spreading Infostealer", source: "KrebsOnSecurity", time: "2d ago", category: "Social Engineering", url: "#" },
  { title: "Crypto Wallet Drainers Using Fake Chrome Extensions", source: "CoinDesk", time: "2d ago", category: "Crypto", url: "#" },
];

export function NewsFeed() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs text-cyan-300">
            <Newspaper className="h-3.5 w-3.5" /> Cybersecurity news
          </div>
          <h2 className="text-3xl font-bold md:text-4xl">Latest Threat Intelligence</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Curated cybersecurity news from trusted sources
          </p>
        </motion.div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {news.map((item, i) => (
            <motion.a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass group block rounded-xl p-4 transition hover:border-cyan-500/30"
            >
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline" className="text-[9px] border-cyan-500/20 text-cyan-400">{item.category}</Badge>
                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
              </div>
              <p className="text-sm font-medium leading-snug line-clamp-2">{item.title}</p>
              <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
                <span className="truncate">{item.source}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {item.time}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
