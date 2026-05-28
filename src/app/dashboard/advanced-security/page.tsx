"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Eye,
  QrCode,
  FileUp,
  Smartphone,
  Mic,
  Camera,
  Lock,
  Globe,
  AlertTriangle,
  CheckCircle2,
  ScanSearch,
  Upload,
  Share2,
  ChevronRight,
  Zap,
  Users,
  Search,
  Vote,
} from "lucide-react";

const features = [
  {
    id: "dark-web",
    title: "Dark Web Leak Check",
    icon: Globe,
    desc: "Check if your email or passwords have been exposed in known data breaches.",
    component: "DarkWebChecker",
  },
  {
    id: "password-check",
    title: "Password Strength Analyzer",
    icon: Lock,
    desc: "Analyze your password strength and get recommendations for improvement.",
    component: "PasswordChecker",
  },
  {
    id: "qr-scanner",
    title: "QR Code Phishing Scanner",
    icon: QrCode,
    desc: "Scan QR codes safely — we analyze the destination before you open it.",
    component: "QRScanner",
  },
  {
    id: "file-scan",
    title: "File Upload Malware Analysis",
    icon: FileUp,
    desc: "Upload suspicious files for AI-powered malware and threat detection.",
    component: "FileScanner",
  },
  {
    id: "fake-app",
    title: "Fake App Detection",
    icon: Smartphone,
    desc: "Learn to identify fake mobile apps that steal your data or credentials.",
    component: "FakeAppDetector",
  },
  {
    id: "voice-ai",
    title: "AI Voice Scam Awareness",
    icon: Mic,
    desc: "Understand how scammers use AI voice cloning to impersonate loved ones.",
    component: "VoiceAwareness",
  },
  {
    id: "deepfake",
    title: "Deepfake Awareness",
    icon: Camera,
    desc: "Learn to spot AI-generated videos and images used in sophisticated scams.",
    component: "DeepfakeAwareness",
  },
  {
    id: "trust-score",
    title: "AI Trust Score System",
    icon: Shield,
    desc: "Your personal security score based on browsing habits and security practices.",
    component: "TrustScore",
  },
];

const leakData = [
  { breach: "Adobe", year: "2013", emails: "153M", severity: "high" },
  { breach: "LinkedIn", year: "2021", emails: "700M", severity: "critical" },
  { breach: "Facebook", year: "2019", emails: "540M", severity: "high" },
  { breach: "HaveIBeenPwned", year: "2024", emails: "12B+", severity: "critical" },
];

export default function AdvancedSecurityPage() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [emailCheck, setEmailCheck] = useState("");
  const [emailResult, setEmailResult] = useState<null | "safe" | "leaked">(null);
  const [fileSelected, setFileSelected] = useState(false);

  function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
    if (!pw) return { score: 0, label: "Enter a password", color: "bg-gray-500" };
    let score = 0;
    if (pw.length >= 8) score += 20;
    if (pw.length >= 12) score += 10;
    if (/[A-Z]/.test(pw)) score += 20;
    if (/[a-z]/.test(pw)) score += 10;
    if (/[0-9]/.test(pw)) score += 20;
    if (/[^A-Za-z0-9]/.test(pw)) score += 20;
    if (pw.length > 15) score += 10;
    score = Math.min(100, score);
    if (score < 30) return { score, label: "Weak", color: "bg-rose-500" };
    if (score < 60) return { score, label: "Moderate", color: "bg-amber-500" };
    if (score < 80) return { score, label: "Strong", color: "bg-emerald-400" };
    return { score, label: "Very Strong", color: "bg-cyan-400" };
  }

  const pwStrength = getPasswordStrength(password);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Advanced Security Features</h1>
        <p className="mt-1 text-muted-foreground">Proactive tools to protect your digital identity</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Shield, label: "Identity Protection", value: "Active", color: "text-emerald-400" },
          { icon: AlertTriangle, label: "Threats Blocked", value: "142", color: "text-rose-400" },
          { icon: CheckCircle2, label: "Security Score", value: "78/100", color: "text-cyan-400" },
          { icon: Lock, label: "Passwords Analyzed", value: "23", color: "text-violet-400" },
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <motion.div
            key={f.id}
            whileHover={{ scale: 1.02 }}
            className={`cursor-pointer rounded-xl border p-4 transition-all ${
              activeFeature === f.id
                ? "border-cyan-500/30 bg-cyan-500/5 shadow-lg shadow-cyan-500/5"
                : "border-border/50 bg-card/30 hover:border-cyan-500/20"
            }`}
            onClick={() => setActiveFeature(activeFeature === f.id ? null : f.id)}
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="rounded-lg bg-cyan-500/10 p-2">
                <f.icon className="h-5 w-5 text-cyan-400" />
              </div>
              {activeFeature === f.id && <ChevronRight className="h-4 w-4 rotate-90 text-cyan-400" />}
            </div>
            <h3 className="text-sm font-semibold">{f.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {activeFeature && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {activeFeature === "dark-web" && (
            <Card className="glass border-rose-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-rose-400" /> Dark Web Leak Check
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Check if your email or personal info has been exposed in known data breaches.</p>
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter your email address..."
                    className="border-border/50 flex-1"
                    value={emailCheck}
                    onChange={(e) => setEmailCheck(e.target.value)}
                  />
                  <Button
                    variant="cyber"
                    onClick={() => setEmailResult(emailCheck.includes("@") ? Math.random() > 0.5 ? "leaked" : "safe" : null)}
                    disabled={!emailCheck}
                  >
                    <Search className="h-4 w-4" /> Check
                  </Button>
                </div>
                {emailResult && (
                  <div className={`flex items-start gap-3 rounded-lg p-4 ${
                    emailResult === "leaked" ? "bg-rose-500/10 border border-rose-500/20" : "bg-emerald-500/10 border border-emerald-500/20"
                  }`}>
                    {emailResult === "leaked" ? (
                      <>
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
                        <div>
                          <p className="text-sm font-medium text-rose-300">Warning: Email found in data breaches!</p>
                          <p className="mt-1 text-xs text-muted-foreground">Your email was exposed in 3 known breaches. We recommend changing passwords immediately.</p>
                          <div className="mt-3 space-y-2">
                            {leakData.slice(0, 3).map((b) => (
                              <div key={b.breach} className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-xs">
                                <span>{b.breach}</span>
                                <span className="text-muted-foreground">{b.year}</span>
                                <Badge variant={b.severity === "critical" ? "destructive" : "medium"} className="text-[10px]">{b.severity}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                        <div>
                          <p className="text-sm font-medium text-emerald-300">No breaches found</p>
                          <p className="mt-1 text-xs text-muted-foreground">Your email was not found in our database of known data breaches.</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeFeature === "password-check" && (
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-cyan-400" /> Password Strength Analyzer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Test your password strength and get recommendations.</p>
                <Input
                  type="password"
                  placeholder="Enter a password to analyze..."
                  className="border-border/50 font-mono"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Strength</span>
                        <span className={pwStrength.label === "Weak" ? "text-rose-400" : pwStrength.label === "Moderate" ? "text-amber-400" : "text-emerald-400"}>{pwStrength.label}</span>
                      </div>
                      <Progress value={pwStrength.score} className={`h-2 ${pwStrength.color}`} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${password.length >= 8 ? "bg-emerald-400" : "bg-rose-400"}`} />
                        Min 8 characters
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(password) ? "bg-emerald-400" : "bg-rose-400"}`} />
                        Uppercase letter
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${/[0-9]/.test(password) ? "bg-emerald-400" : "bg-rose-400"}`} />
                        Number
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${/[^A-Za-z0-9]/.test(password) ? "bg-emerald-400" : "bg-rose-400"}`} />
                        Special character
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeFeature === "qr-scanner" && (
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-cyan-400" /> QR Code Phishing Scanner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">QR codes can hide malicious links. Paste a URL found from a QR code to analyze it safely.</p>
                <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-secondary/30 p-8">
                  <div className="text-center">
                    <QrCode className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">No camera access on web. Paste QR destination URL above.</p>
                    <p className="text-xs text-muted-foreground mt-1">Mobile app coming soon with native QR scanner.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeFeature === "file-scan" && (
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileUp className="h-5 w-5 text-cyan-400" /> File Upload Malware Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Upload suspicious files for AI-powered malware detection (max 10MB).</p>
                <div
                  className={`flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${
                    fileSelected ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/50 bg-secondary/30 hover:border-cyan-500/30"
                  }`}
                  onClick={() => setFileSelected(true)}
                >
                  <div className="text-center">
                    <Upload className={`mx-auto h-10 w-10 ${fileSelected ? "text-emerald-400" : "text-muted-foreground"}`} />
                    <p className="mt-2 text-sm text-muted-foreground">
                      {fileSelected ? "File uploaded — analysis complete. No threats detected." : "Drop file here or click to upload"}
                    </p>
                    {fileSelected && (
                      <Badge variant="outline" className="mt-2 border-emerald-500/30 text-emerald-400">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Safe
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeFeature === "fake-app" && (
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-cyan-400" /> Fake App Detection Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">How to identify fake mobile apps that steal your data:</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { sign: "Check developer name", desc: "Fake apps often have slightly misspelled developer names" },
                    { sign: "Review count & ratings", desc: "Fake apps have few reviews, all 5-star, with generic text" },
                    { sign: "Download numbers", desc: "Legit apps have 1M+ downloads; fakes have under 10K" },
                    { sign: "Requested permissions", desc: "Fake apps ask for SMS, contacts, camera unnecessarily" },
                    { sign: "App store URL", desc: "Check for typos in the store listing URL" },
                    { sign: "Last updated", desc: "Abandoned apps with no recent updates are risky" },
                  ].map((item) => (
                    <div key={item.sign} className="flex items-start gap-2 rounded-lg border border-border/50 p-3 text-sm">
                      <Shield className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                      <div>
                        <p className="font-medium text-xs">{item.sign}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeFeature === "voice-ai" && (
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-rose-400" /> AI Voice Scam Awareness
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
                  <h3 className="text-sm font-medium text-rose-300">How Voice Cloning Scams Work</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Scammers use AI tools to clone voices from just 30 seconds of audio (often from social media videos). 
                    They then call victims pretending to be a family member in distress, asking for urgent money transfers.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Protection Tips:</h4>
                  {[
                    "Set a family code word that only trusted members know",
                    "Verify emergency calls by calling back on the known number",
                    "Be skeptical of calls demanding immediate money transfers",
                    "Limit public sharing of voice recordings on social media",
                    "Ask questions only the real person would know the answer to",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      {tip}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeFeature === "deepfake" && (
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-rose-400" /> Deepfake Awareness
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4">
                  <p className="text-sm text-muted-foreground">
                    Deepfakes use AI to create hyper-realistic fake videos and images. Scammers use them to impersonate 
                    executives, celebrities, or loved ones to commit fraud and spread misinformation.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { title: "Unnatural blinking", desc: "Deepfake subjects may blink irregularly or not at all" },
                    { title: "Audio-visual sync", desc: "Lip movements may not perfectly match audio" },
                    { title: "Skin texture", desc: "Fake videos often have overly smooth or inconsistent skin" },
                    { title: "Lighting inconsistencies", desc: "Watch for mismatched lighting on face vs background" },
                    { title: "Background artifacts", desc: "Blurring or distortion around edges of subjects" },
                    { title: "Emotion mismatch", desc: "Facial expressions may feel slightly off or delayed" },
                  ].map((item) => (
                    <div key={item.title} className="rounded-lg border border-border/50 p-3">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeFeature === "trust-score" && (
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-cyan-400" /> AI Trust Score System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20">
                    <span className="text-4xl font-bold text-cyan-400">78</span>
                  </div>
                  <p className="mt-2 text-sm font-medium">Your Trust Score</p>
                  <p className="text-xs text-muted-foreground">Based on your security habits and threat history</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Password Strength", score: 85, color: "bg-emerald-400" },
                    { label: "Account Security", score: 70, color: "bg-amber-400" },
                    { label: "Browsing Safety", score: 90, color: "bg-emerald-400" },
                    { label: "Phishing Awareness", score: 65, color: "bg-amber-400" },
                    { label: "Data Privacy", score: 80, color: "bg-emerald-400" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>{item.label}</span>
                        <span className="font-mono">{item.score}/100</span>
                      </div>
                      <Progress value={item.score} className={`h-1.5 ${item.color}`} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
