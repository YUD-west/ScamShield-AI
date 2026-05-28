"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DailyTip } from "@/components/dashboard/daily-tips";
import { SecurityChallenges } from "@/components/dashboard/security-challenges";
import {
  ScanSearch,
  TrendingUp,
  ShieldAlert,
  Link2,
  Bot,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Flame,
  Target,
  Clock,
  Globe,
  Lock,
  Smartphone,
  Users,
  BookOpen,
  Award,
  Star,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { apiUrl } from "@/lib/api-url";

const COLORS = ["#34d399", "#fbbf24", "#fb923c", "#fb7185"];

const securityTips = [
  "Enable 2FA on all your accounts for an extra layer of security.",
  "Never reuse passwords across different websites or services.",
  "Always verify email sender addresses before clicking links.",
  "Keep your software and devices updated to patch vulnerabilities.",
  "Use a password manager to generate and store strong passwords.",
];

const recentScans: { url: string; risk: "critical" | "high" | "medium" | "low"; score: number; time: string }[] = [
  { url: "bit.ly/paypal-verify-2f8a", risk: "critical", score: 92, time: "15m ago" },
  { url: "amzn-delivery-tracking.com", risk: "high", score: 78, time: "1h ago" },
  { url: "secure-bank-login.com", risk: "medium", score: 45, time: "3h ago" },
  { url: "news-article-2025.com", risk: "low", score: 12, time: "5h ago" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<{
    totalScans: number;
    trends: { day: string; scans: number; threats: number }[];
    categoryData: { name: string; value: number }[];
    topBrands: { brand: string; count: number }[];
  } | null>(null);
  const [streak, setStreak] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    fetch(apiUrl("/api/dashboard/stats"))
      .then((r) => r.json())
      .then(setStats);
    setStreak(Math.floor(Math.random() * 14) + 1);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % securityTips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const totalThreats = stats?.categoryData?.reduce((a, c) => a + (c.name !== "LOW" ? c.value : 0), 0) ?? 0;
  const riskScore = stats ? Math.max(0, Math.min(100, 100 - (totalThreats / (stats.totalScans || 1)) * 100)) : 0;

  const kpis = [
    { label: "Total scans", value: stats?.totalScans?.toLocaleString() ?? "—", icon: ScanSearch, color: "text-cyan-400", sub: "All time scans" },
    { label: "Threats blocked", value: totalThreats.toLocaleString(), icon: ShieldAlert, color: "text-rose-400", sub: "Dangerous links found" },
    { label: "Security score", value: `${Math.round(riskScore)}/100`, icon: Shield, color: "text-emerald-400", sub: "Your safety rating" },
    { label: "Day streak", value: `🔥 ${streak}`, icon: Flame, color: "text-amber-400", sub: "Consecutive days" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Threat Command Center</h1>
          <p className="mt-1 text-muted-foreground">Real-time scam intelligence, analytics, and global threat patterns</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-1.5">
            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs text-amber-300">{securityTips[tipIndex]}</span>
          </div>
          <Button variant="cyber" asChild>
            <Link href="/dashboard/scan">
              <ScanSearch className="h-4 w-4" /> New scan
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass overflow-hidden transition hover:border-cyan-500/20">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-xl bg-secondary/80 p-3">
                  <k.icon className={`h-5 w-5 ${k.color}`} />
                </div>
                <div>
                  <p className={`font-mono text-2xl font-bold ${k.color}`}>{k.value}</p>
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Weekly Activity</CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-400" /> Scans</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-400" /> Threats</span>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.trends ?? []}>
                <defs>
                  <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fb7185" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#fb7185" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }} />
                <Area type="monotone" dataKey="scans" stroke="#22d3ee" fill="url(#scanGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="threats" stroke="#fb7185" fill="url(#threatGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Risk Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20">
                <span className="text-3xl font-bold text-cyan-400">{Math.round(riskScore)}</span>
              </div>
              <p className="mt-2 text-sm font-medium">Security Score</p>
              <p className="text-xs text-muted-foreground">{riskScore > 70 ? "Good protection level" : riskScore > 40 ? "Moderate risk" : "High risk - take action"}</p>
            </div>
            <div className="space-y-3">
              {stats?.categoryData?.slice(0, 4).map((d, i) => (
                <div key={d.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>{d.name}</span>
                    <span className="font-mono">{d.value}%</span>
                  </div>
                  <Progress value={d.value} className={`h-1.5`} style={{ 
                    background: `${COLORS[i]}20`,
                    ['--progress-color' as any]: COLORS[i]
                  }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Impersonated Brands</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {stats?.topBrands?.length ? (
              stats.topBrands.map((b) => (
                <div key={b.brand} className="flex items-center gap-4">
                  <span className="w-28 text-sm font-medium">{b.brand}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-rose-500 transition-all duration-700"
                      style={{ width: `${Math.min(100, (b.count / 1240) * 100)}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono text-sm text-muted-foreground">{b.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No data yet. Start scanning to see impersonation trends.</p>
            )}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Scans</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-cyan-400 gap-1" asChild>
              <Link href="/dashboard/history">View all <ChevronRight className="h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentScans.map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition hover:border-cyan-500/20">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  s.risk === "critical" ? "bg-rose-500/20" : s.risk === "high" ? "bg-orange-500/20" :
                  s.risk === "medium" ? "bg-amber-500/20" : "bg-emerald-500/20"
                }`}>
                  <AlertTriangle className={`h-4 w-4 ${
                    s.risk === "critical" ? "text-rose-400" : s.risk === "high" ? "text-orange-400" :
                    s.risk === "medium" ? "text-amber-400" : "text-emerald-400"
                  }`} />
                </div>
                <div className="min-w-0 flex-1">
                  <code className="block truncate text-xs font-mono">{s.url}</code>
                  <span className="text-[10px] text-muted-foreground">{s.time}</span>
                </div>
                <Badge variant={s.risk} className="text-[10px]">{s.risk}</Badge>
                <span className={`font-mono text-xs font-bold ${
                  s.score > 70 ? "text-rose-400" : s.score > 40 ? "text-amber-400" : "text-emerald-400"
                }`}>{s.score}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: BookOpen, label: "Education Hub", desc: "Learn to spot scams", href: "/dashboard/education", color: "from-cyan-500 to-emerald-500" },
          { icon: Bot, label: "AI Assistant", desc: "Ask about security", href: "/dashboard/chat", color: "from-violet-500 to-purple-600" },
          { icon: Users, label: "Community", desc: "Report threats", href: "/dashboard/community", color: "from-amber-500 to-orange-600" },
          { icon: Lock, label: "Security Check", desc: "Review your safety", href: "/dashboard/advanced-security", color: "from-rose-500 to-pink-600" },
        ].map((item) => (
          <Link key={item.label} href={item.href}>
            <Card className="glass cursor-pointer transition-all hover:scale-[1.02] hover:border-cyan-500/20">
              <CardContent className="p-4">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}>
                  <item.icon className="h-5 w-5 text-slate-950" />
                </div>
                <h3 className="font-semibold text-sm">{item.label}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DailyTip />
        <SecurityChallenges />
      </div>
    </div>
  );
}

function Lightbulb(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>;
}
