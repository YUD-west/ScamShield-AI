"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Shield,
  AlertTriangle,
  ArrowUp,
  MessageSquare,
  Flag,
  Search,
  Filter,
  TrendingUp,
  Globe,
  Clock,
  Sparkles,
  Plus,
  ChevronRight,
  Share2,
  ExternalLink,
  Copy,
  CheckCircle2,
  ThumbsUp,
} from "lucide-react";

interface Report {
  id: number;
  title: string;
  description: string;
  category: string;
  risk: "low" | "medium" | "high" | "critical";
  upvotes: number;
  comments: number;
  time: string;
  type: string;
  url: string;
  verified: boolean;
}

const initialReports: Report[] = [
  { id: 1, title: "Fake PayPal 'Payment Received' SMS with malicious bit.ly link", description: "Received SMS claiming PayPal payment of $849.99 with link to 'cancel' - link leads to credential harvesting page mimicking PayPal login.", category: "phishing", risk: "critical", upvotes: 234, comments: 45, time: "2h ago", type: "SMS Phishing", url: "bit.ly/paypal-cxn83", verified: true },
  { id: 2, title: "Romance scammer on Telegram pushing crypto investment", description: "Profile claiming to be a trader offering guaranteed 300% returns on USDT investments. Uses fake screenshots of profits.", category: "romance_scam", risk: "high", upvotes: 189, comments: 32, time: "5h ago", type: "Crypto Scam", url: "t.me/crypto_trader_pro", verified: true },
  { id: 3, title: "Amazon delivery fee phishing campaign", description: "Email claiming $3.99 delivery fee is due, with link to fake Amazon login page. Spoofed sender address.", category: "impersonation", risk: "high", upvotes: 156, comments: 28, time: "8h ago", type: "Email Phishing", url: "amzn-delivery-verify.com", verified: false },
  { id: 4, title: "Fake LinkedIn recruiter job scam", description: "Recruiter offering remote data entry job at $65/hr. Requires 'processing fee' of $49 for background check.", category: "job_scam", risk: "high", upvotes: 134, comments: 22, time: "12h ago", type: "Job Scam", url: "linkedin.com/in/fake-recruiter", verified: true },
  { id: 5, title: "WhatsApp 'free Netflix year' giveaway scam", description: "Message claiming to offer free 1-year Netflix subscription. Requires sharing with 10 contacts and clicking suspicious link.", category: "giveaway", risk: "medium", upvotes: 98, comments: 17, time: "1d ago", type: "Giveaway Scam", url: "netflix-free-year.xyz", verified: false },
  { id: 6, title: "Banking fraud call spoofing Chase support number", description: "Caller spoofing Chase customer service number, claiming unusual activity on account. Asks for full SSN and online banking credentials.", category: "banking_fraud", risk: "critical", upvotes: 278, comments: 51, time: "3h ago", type: "Vishing", url: "Caller ID: 1-800-935-9935 (spoofed)", verified: true },
  { id: 7, title: "QR code phishing at public parking meters", description: "Fake parking payment QR codes placed over legitimate ones. Directs to fake payment page that steals card details.", category: "qr_phishing", risk: "high", upvotes: 212, comments: 38, time: "6h ago", type: "QR Phishing", url: "pay-parking.online", verified: true },
  { id: 8, title: "Crypto 'giveaway' impersonating Elon Musk on YouTube", description: "Live stream on YouTube using deepfake Elon Musk video promising to double any crypto sent to a wallet address.", category: "crypto_scam", risk: "high", upvotes: 167, comments: 29, time: "10h ago", type: "Crypto Scam", url: "youtube.com/watch?v=fake-elon", verified: false },
];

const categories = [
  { id: "all", label: "All Reports", icon: Globe },
  { id: "phishing", label: "Phishing", icon: Flag },
  { id: "crypto_scam", label: "Crypto", icon: TrendingUp },
  { id: "impersonation", label: "Impersonation", icon: Users },
  { id: "job_scam", label: "Job Scams", icon: AlertTriangle },
  { id: "banking_fraud", label: "Banking", icon: Shield },
];

export default function CommunityPage() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);
  const [newReport, setNewReport] = useState({ title: "", description: "", category: "phishing", url: "" });
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredReports = reports.filter((r) => {
    const matchesFilter = filter === "all" || r.category === filter;
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.url.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: reports.length,
    critical: reports.filter((r) => r.risk === "critical").length,
    verified: reports.filter((r) => r.verified).length,
    upvotes: reports.reduce((a, r) => a + r.upvotes, 0),
  };

  function handleUpvote(id: number) {
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
  }

  function handleSubmitReport() {
    if (!newReport.title || !newReport.description) return;
    const report: Report = {
      id: reports.length + 1,
      title: newReport.title,
      description: newReport.description,
      category: newReport.category,
      risk: "medium",
      upvotes: 0,
      comments: 0,
      time: "Just now",
      type: "User Report",
      url: newReport.url,
      verified: false,
    };
    setReports((prev) => [report, ...prev]);
    setShowReportForm(false);
    setNewReport({ title: "", description: "", category: "phishing", url: "" });
  }

  function copyUrl(url: string, id: number) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Community Threat Intelligence</h1>
          <p className="mt-1 text-muted-foreground">Crowd-sourced scam reports keeping the community safe</p>
        </div>
        <Button variant="cyber" onClick={() => setShowReportForm(true)}>
          <Plus className="h-4 w-4" /> Report a Scam
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Reports", value: stats.total, icon: Flag, color: "text-cyan-400" },
          { label: "Critical Threats", value: stats.critical, icon: AlertTriangle, color: "text-rose-400" },
          { label: "Verified Reports", value: stats.verified, icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Community Upvotes", value: stats.upvotes.toLocaleString(), icon: ThumbsUp, color: "text-violet-400" },
        ].map((s) => (
          <Card key={s.label} className="glass">
            <CardContent className="flex items-center gap-3 p-4">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <div>
                <p className="font-mono text-lg font-bold">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              filter === cat.id
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "bg-secondary/50 text-muted-foreground border border-border/30 hover:border-cyan-500/20 hover:text-cyan-300"
            }`}
          >
            <cat.icon className="h-3 w-3" />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search reports or URLs..."
          className="pl-10 border-border/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <AnimatePresence>
        {showReportForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <Card className="glass border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-base">Report a Suspicious Message or Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Title (e.g., Fake Amazon delivery SMS)"
                  value={newReport.title}
                  onChange={(e) => setNewReport((p) => ({ ...p, title: e.target.value }))}
                  className="border-border/50"
                />
                <Textarea
                  placeholder="Describe the scam in detail..."
                  value={newReport.description}
                  onChange={(e) => setNewReport((p) => ({ ...p, description: e.target.value }))}
                  className="border-border/50 min-h-[100px]"
                />
                <div className="flex gap-3">
                  <Input
                    placeholder="Suspicious URL (optional)"
                    value={newReport.url}
                    onChange={(e) => setNewReport((p) => ({ ...p, url: e.target.value }))}
                    className="border-border/50 flex-1"
                  />
                  <select
                    value={newReport.category}
                    onChange={(e) => setNewReport((p) => ({ ...p, category: e.target.value }))}
                    className="rounded-lg border border-border/50 bg-background px-3 py-2 text-sm"
                  >
                    <option value="phishing">Phishing</option>
                    <option value="crypto_scam">Crypto Scam</option>
                    <option value="impersonation">Impersonation</option>
                    <option value="job_scam">Job Scam</option>
                    <option value="banking_fraud">Banking Fraud</option>
                    <option value="giveaway">Fake Giveaway</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button variant="cyber" onClick={handleSubmitReport} disabled={!newReport.title || !newReport.description}>
                    Submit Report <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={() => setShowReportForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {filteredReports.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card className="glass overflow-hidden transition-all hover:border-cyan-500/20">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <button
                    onClick={() => handleUpvote(report.id)}
                    className="flex flex-col items-center gap-0.5 rounded-lg border border-border/50 px-3 py-2 transition hover:border-cyan-500/30 hover:bg-cyan-500/5"
                  >
                    <ArrowUp className="h-4 w-4 text-cyan-400" />
                    <span className="font-mono text-xs font-bold">{report.upvotes}</span>
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{report.title}</h3>
                      {report.verified && (
                        <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-400">
                          <CheckCircle2 className="h-3 w-3 mr-0.5" /> Verified
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{report.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <Badge variant={report.risk} className="text-[10px]">{report.risk}</Badge>
                      <span className="flex items-center gap-1">
                        <Flag className="h-3 w-3" /> {report.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {report.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" /> {report.comments}
                      </span>
                    </div>
                    {report.url && (
                      <div className="mt-2 flex items-center gap-2">
                        <code className="rounded bg-rose-500/10 px-2 py-0.5 font-mono text-[11px] text-rose-300">{report.url}</code>
                        <button
                          onClick={() => copyUrl(report.url, report.id)}
                          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-cyan-400"
                        >
                          {copiedId === report.id ? (
                            <><CheckCircle2 className="h-3 w-3" /> Copied</>
                          ) : (
                            <><Copy className="h-3 w-3" /> Copy</>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
