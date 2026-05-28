"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiUrl } from "@/lib/api-url";
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
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  ScanSearch,
  ShieldAlert,
  Activity,
  TrendingUp,
  Globe,
  Flag,
  CheckCircle2,
  Clock,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Ban,
  RefreshCw,
  FileText,
  Key,
  Zap,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  scans24h: number;
  activeApiKeys: number;
  flaggedContent: number;
  auditLogs24h: number;
  totalScans: number;
  reportedThreats: number;
  blacklistedDomains: number;
}

const recentReports = [
  { id: 1, title: "Fake PayPal SMS Campaign", reporter: "alex@example.com", risk: "critical", status: "pending", time: "12m ago" },
  { id: 2, title: "Cryptocurrency Investment Scam", reporter: "sarah@example.com", risk: "high", status: "verified", time: "34m ago" },
  { id: 3, title: "Amazon Impersonation Email", reporter: "mike@example.com", risk: "high", status: "pending", time: "1h ago" },
  { id: 4, title: "Fake LinkedIn Recruiter", reporter: "jane@example.com", risk: "medium", status: "dismissed", time: "2h ago" },
  { id: 5, title: "QR Code Parking Scam", reporter: "tom@example.com", risk: "high", status: "verified", time: "3h ago" },
  { id: 6, title: "WhatsApp Giveaway Scam", reporter: "lisa@example.com", risk: "medium", status: "pending", time: "4h ago" },
];

const weeklyData = [
  { day: "Mon", scans: 1240, threats: 380, users: 45 },
  { day: "Tue", scans: 1350, threats: 420, users: 52 },
  { day: "Wed", scans: 1120, threats: 310, users: 38 },
  { day: "Thu", scans: 1480, threats: 490, users: 61 },
  { day: "Fri", scans: 1320, threats: 410, users: 48 },
  { day: "Sat", scans: 980, threats: 280, users: 32 },
  { day: "Sun", scans: 860, threats: 220, users: 28 },
];

const riskData = [
  { name: "Safe", value: 45 },
  { name: "Suspicious", value: 25 },
  { name: "Malicious", value: 18 },
  { name: "Critical", value: 12 },
];

const COLORS = ["#34d399", "#fbbf24", "#fb923c", "#fb7185"];

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    fetch(apiUrl("/api/admin/stats"))
      .then((r) => r.json())
      .then(setStats).catch(() => undefined);
  }, []);

  const kpiCards = [
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "text-cyan-400", change: "+12%", trend: "up" },
    { label: "Scans (24h)", value: stats?.scans24h ?? 0, icon: ScanSearch, color: "text-emerald-400", change: "+8%", trend: "up" },
    { label: "Flagged Content", value: stats?.flaggedContent ?? 0, icon: Flag, color: "text-rose-400", change: "-3%", trend: "down" },
    { label: "Active API Keys", value: stats?.activeApiKeys ?? 0, icon: Key, color: "text-violet-400", change: "+5%", trend: "up" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Console</h1>
          <p className="mt-1 text-muted-foreground">Platform monitoring, threat management, and analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 gap-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Live
          </Badge>
          <Button variant="outline" size="sm" className="gap-2 border-border/50">
            <RefreshCw className="h-3 w-3" /> Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((k) => (
          <Card key={k.label} className="glass overflow-hidden transition hover:border-cyan-500/20">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="rounded-xl bg-secondary/80 p-2.5">
                  <k.icon className={`h-5 w-5 ${k.color}`} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs ${
                  k.trend === "up" ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {k.trend === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {k.change}
                </span>
              </div>
              <p className="mt-3 font-mono text-2xl font-bold">{k.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Weekly Activity</CardTitle>
            <div className="flex gap-1">
              {["7d", "30d", "90d"].map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`rounded-md px-2 py-1 text-xs transition ${
                    timeRange === r ? "bg-cyan-500/20 text-cyan-300" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }} />
                <Bar dataKey="scans" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                <Bar dataKey="threats" fill="#fb7185" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Threat Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={2}>
                  {riskData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex justify-center gap-4 text-xs">
              {riskData.map((d, i) => (
                <span key={d.name} className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  {d.name} {d.value}%
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Threat Reports</CardTitle>
            <Badge variant="outline" className="border-cyan-500/30">{recentReports.length} pending</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentReports.map((r) => (
                <div key={r.id} className="flex items-center gap-4 rounded-lg border border-border/50 p-3 transition hover:border-cyan-500/20">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    r.risk === "critical" ? "bg-rose-500/20" : r.risk === "high" ? "bg-orange-500/20" : "bg-amber-500/20"
                  }`}>
                    <AlertTriangle className={`h-4 w-4 ${
                      r.risk === "critical" ? "text-rose-400" : r.risk === "high" ? "text-orange-400" : "text-amber-400"
                    }`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.reporter} — {r.time}</p>
                  </div>
                  <Badge variant={r.risk as any} className="text-[10px]">{r.risk}</Badge>
                  <Badge variant="outline" className={`text-[10px] ${
                    r.status === "verified" ? "border-emerald-500/30 text-emerald-400" :
                    r.status === "dismissed" ? "border-slate-500/30 text-slate-400" :
                    "border-amber-500/30 text-amber-400"
                  }`}>{r.status}</Badge>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Manage Users", icon: Users, desc: "View and manage user accounts" },
              { label: "Blacklist Manager", icon: Ban, desc: "Manage blocked domains" },
              { label: "System Logs", icon: FileText, desc: "View audit trail" },
              { label: "API Monitoring", icon: Activity, desc: "Check API health" },
              { label: "Flagged Content", icon: Flag, desc: "Review flagged reports" },
            ].map((action) => (
              <Button key={action.label} variant="outline" className="w-full justify-start gap-3 border-border/50 h-auto py-2.5">
                <action.icon className="h-4 w-4 text-cyan-400" />
                <div className="text-left">
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-[10px] text-muted-foreground">{action.desc}</p>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ChevronRight(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>;
}
