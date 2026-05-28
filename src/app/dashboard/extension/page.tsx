"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Puzzle,
  Shield,
  Zap,
  Bell,
  Lock,
  Eye,
  Globe,
  Download,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Smartphone,
  Monitor,
  Chrome,
  Github,
  ArrowRight,
  Sparkles,
  Star,
} from "lucide-react";

const features = [
  { icon: Shield, title: "Auto-detect Phishing", desc: "Real-time analysis of every site you visit. Blocks known phishing and scam pages before they load." },
  { icon: AlertTriangle, title: "Danger Warnings", desc: "Full-page red warning screen on dangerous sites with clear explanation of threats detected." },
  { icon: Zap, title: "Instant Analysis", desc: "AI scans pages in under 500ms. No noticeable slowdown in your browsing experience." },
  { icon: Eye, title: "Link Preview", desc: "Hover over any link to see a safety rating and destination preview before clicking." },
  { icon: Lock, title: "Password Protection", desc: "Warns you if you're entering credentials on a lookalike or suspicious domain." },
  { icon: Bell, title: "Smart Alerts", desc: "Customizable notifications about newly discovered threats and compromised sites." },
];

const browsers = [
  { name: "Chrome", icon: Chrome, users: "2.5M+", status: "Available" },
  { name: "Firefox", icon: Globe, users: "500K+", status: "Coming Soon" },
  { name: "Edge", icon: Globe, users: "300K+", status: "Coming Soon" },
  { name: "Safari", icon: Globe, users: "200K+", status: "In Development" },
];

export default function ExtensionPage() {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-emerald-500/5 to-slate-900 p-8">
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-16 -translate-y-16 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
              <Sparkles className="h-3 w-3" /> Coming to your browser
            </div>
            <h1 className="text-3xl font-bold lg:text-4xl">ScamShield Browser Extension</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Real-time phishing protection that works silently in the background. Get alerted the moment you visit a dangerous site.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="cyber" size="lg" className="gap-2 shadow-lg shadow-cyan-500/20">
                <Download className="h-5 w-5" /> Add to Chrome
              </Button>
              <Button variant="outline" size="lg" className="gap-2 border-cyan-500/30">
                <Bell className="h-5 w-5" /> Notify me
              </Button>
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-400" /> 4.9/5 rating</span>
              <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-emerald-400" /> 500K+ users</span>
              <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-cyan-400" /> Free to use</span>
            </div>
          </div>
          <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 p-4 shadow-2xl shadow-cyan-500/10">
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-inner">
              <Puzzle className="h-16 w-16 text-slate-950" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="glass h-full transition-all hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5">
              <CardContent className="p-5">
                <div className="mb-3 inline-flex rounded-xl bg-cyan-500/10 p-3">
                  <f.icon className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="glass overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" /> How It Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: "01", title: "Install Extension", desc: "Add ScamShield to your browser with one click. Works on Chrome, Firefox, Edge, and Safari.", icon: Download },
              { step: "02", title: "Browse Normally", desc: "Extension runs silently in background. Scans every page you visit using local + cloud AI.", icon: Globe },
              { step: "03", title: "Get Protected", desc: "Receive instant warnings on dangerous sites. Green icon = safe, Red = block, Yellow = caution.", icon: Shield },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/10">
                  <s.icon className="h-6 w-6 text-cyan-400" />
                </div>
                <span className="font-mono text-xs text-cyan-500/60">{s.step}</span>
                <h3 className="mt-1 font-semibold">{s.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" /> Available Browsers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {browsers.map((b) => (
              <div key={b.name} className="flex items-center gap-4 rounded-xl border border-border/50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <b.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.users} users</p>
                </div>
                <Badge variant={b.status === "Available" ? "outline" : "secondary"} className={
                  b.status === "Available" ? "border-emerald-500/30 text-emerald-400" : ""
                }>
                  {b.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" /> Privacy First
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <p className="text-sm font-medium">No browsing history stored</p>
                <p className="text-xs text-muted-foreground">All analysis happens in real-time. We never log your browsing history.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <p className="text-sm font-medium">Open source code</p>
                <p className="text-xs text-muted-foreground">Full source code available on GitHub for transparency and community review.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <div>
                <p className="text-sm font-medium">Minimal permissions</p>
                <p className="text-xs text-muted-foreground">Only requests permission to read page URLs — never page content or personal data.</p>
              </div>
            </div>
            <Button variant="outline" className="mt-2 w-full gap-2 border-border/50">
              <Github className="h-4 w-4" /> View on GitHub <ExternalLink className="h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
