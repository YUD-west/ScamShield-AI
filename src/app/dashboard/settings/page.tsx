"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Bell,
  BellRing,
  Globe,
  Lock,
  User,
  Key,
  Smartphone,
  Monitor,
  Download,
  Moon,
  Sun,
  Languages,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Eye,
  EyeOff,
  Bot,
  Zap,
  RefreshCw,
} from "lucide-react";
import { apiUrl } from "@/lib/api-url";

interface AiStatus { engine: string; builtin: { name: string } }

export default function SettingsPage() {
  const { data: session } = useSession();
  const [ai, setAi] = useState<AiStatus | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    browser: false,
    weekly: true,
    threats: true,
    tips: false,
  });

  useEffect(() => {
    fetch(apiUrl("/api/ai/status"))
      .then((r) => r.json())
      .then(setAi).catch(() => undefined);
  }, []);

  async function upgrade() {
    setCheckoutLoading(true);
    try {
      const res = await fetch(apiUrl("/api/stripe/checkout"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error ?? "Configure Stripe to enable billing.");
    } finally { setCheckoutLoading(false); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account, security, and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" /> Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-muted-foreground">Email</label>
                  <p className="text-sm font-medium">{session?.user?.email}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Name</label>
                  <p className="text-sm font-medium">{session?.user?.name ?? "Not set"}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Role</label>
                  <p><Badge variant="outline">{session?.user?.role ?? "user"}</Badge></p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Member Since</label>
                  <p className="text-sm font-medium">January 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4" /> Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                <div className="flex items-center gap-3">
                  <Key className="h-4 w-4 text-cyan-400" />
                  <div>
                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-cyan-500/20">
                  Enable
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                <div className="flex items-center gap-3">
                  <Eye className="h-4 w-4 text-cyan-400" />
                  <div>
                    <p className="text-sm font-medium">Login Notifications</p>
                    <p className="text-xs text-muted-foreground">Get alerts on new device logins</p>
                  </div>
                </div>
                <Switch checked={notifications.email} onCheckedChange={(v) => setNotifications((p) => ({ ...p, email: v }))} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                <div className="flex items-center gap-3">
                  <Bot className="h-4 w-4 text-cyan-400" />
                  <div>
                    <p className="text-sm font-medium">Suspicious Activity Alerts</p>
                    <p className="text-xs text-muted-foreground">AI detects unusual behavior</p>
                  </div>
                </div>
                <Switch checked={notifications.threats} onCheckedChange={(v) => setNotifications((p) => ({ ...p, threats: v }))} />
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BellRing className="h-4 w-4" /> Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Email Notifications", desc: "Security alerts via email", icon: Bell, key: "email" as const },
                { label: "Push Notifications", desc: "Browser push alerts", icon: Smartphone, key: "push" as const },
                { label: "Browser Extension", desc: "In-browser security alerts", icon: Monitor, key: "browser" as const },
                { label: "Weekly Security Digest", desc: "Weekly threat summary", icon: Download, key: "weekly" as const },
                { label: "Daily Cyber Tips", desc: "Daily safety tips", icon: Zap, key: "tips" as const },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(v) => setNotifications((p) => ({ ...p, [item.key]: v }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Bot className="h-4 w-4" /> AI Engine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ai && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 gap-1">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Engine</span>
                    <span className="text-sm text-cyan-400">
                      {ai.engine === "openai" ? "GPT-4 + Built-in" : ai.builtin.name}
                    </span>
                  </div>
                  <Progress value={78} className="h-1.5 bg-emerald-500/20" />
                  <p className="text-xs text-muted-foreground">AI confidence: 78% — Model performing well</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lock className="h-4 w-4" /> Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-gradient-to-br from-cyan-500/10 to-emerald-500/5 p-4 text-center">
                <p className="text-xs text-muted-foreground">Current Plan</p>
                <p className="text-2xl font-bold text-cyan-400">Free</p>
                <p className="text-xs text-muted-foreground mt-1">10 scans/day</p>
              </div>
              <Button variant="cyber" className="w-full" onClick={() => void upgrade()} disabled={checkoutLoading}>
                {checkoutLoading ? "Loading..." : "Upgrade to Pro"}
              </Button>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Unlimited scans</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> API access</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Priority support</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-emerald-400" /> PDF reports</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-4 w-4" /> Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <span className="text-sm">Theme</span>
                </div>
                <Badge variant="outline" className="border-cyan-500/30">Dark</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  <span className="text-sm">Language</span>
                </div>
                <Badge variant="outline" className="border-cyan-500/30">English</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
