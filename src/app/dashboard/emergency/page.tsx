"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Phone,
  CreditCard,
  Lock,
  Globe,
  ShieldAlert,
  ExternalLink,
  ChevronRight,
  ClipboardList,
  Banknote,
  Key,
  Users,
  Smartphone,
  ArrowRight,
  Download,
  Printer,
  Share2,
} from "lucide-react";

const steps = [
  {
    id: "stay-calm",
    title: "Stay Calm & Act Fast",
    icon: Shield,
    urgent: true,
    items: [
      "Don't panic — scammers rely on fear. Take a deep breath.",
      "Stop all communication with the scammer immediately.",
      "Do NOT send any more money or share additional information.",
      "Document everything: save screenshots, emails, and messages.",
      "Note down all relevant details: names, phone numbers, account numbers, transaction IDs.",
    ],
  },
  {
    id: "secure-accounts",
    title: "Secure Your Accounts",
    icon: Lock,
    urgent: true,
    items: [
      "Change passwords for ALL affected accounts immediately.",
      "Enable two-factor authentication (2FA) on every account.",
      "Check for any unauthorized changes to account details.",
      "Review recent login activity for suspicious access.",
      "Log out of all devices and sessions.",
    ],
  },
  {
    id: "contact-bank",
    title: "Freeze Banking & Cards",
    icon: Banknote,
    urgent: true,
    items: [
      "Call your bank's fraud department IMMEDIATELY (24/7 hotline).",
      "Request a freeze on all affected accounts and cards.",
      "Ask about reversing unauthorized transactions (chargebacks).",
      "Order new debit/credit cards with new numbers.",
      "Set up transaction alerts for future monitoring.",
    ],
  },
  {
    id: "report-scam",
    title: "Report the Scam",
    icon: ShieldAlert,
    items: [
      "Report to your local police department or cyber crime unit.",
      "File a report with the FTC (ftc.gov/complaint) if in the US.",
      "Report phishing to Anti-Phishing Working Group (reportphishing@apwg.org).",
      "Report crypto scams to the platform used for transfer.",
      "Report fake social media profiles to the platform.",
      "Submit a report to ScamShield Community for others to see.",
    ],
  },
  {
    id: "credit-freeze",
    title: "Freeze Your Credit",
    icon: ClipboardList,
    items: [
      "Contact all three major credit bureaus: Equifax, Experian, TransUnion.",
      "Request a free credit freeze (it's free and doesn't affect your score).",
      "Review your credit reports for unauthorized accounts.",
      "Set up fraud alerts on your credit files.",
      "Consider a credit monitoring service.",
    ],
  },
  {
    id: "password-reset",
    title: "Password Reset All Accounts",
    icon: Key,
    items: [
      "Start with your email — if they control your email, they control everything.",
      "Reset password for: Email, Banking, Social Media, Shopping, Work accounts.",
      "Use a password manager to generate strong, unique passwords.",
      "NEVER reuse passwords across accounts.",
      "Set up recovery options: phone numbers, backup emails.",
    ],
  },
  {
    id: "monitor-activity",
    title: "Monitor for Follow-up Scams",
    icon: Users,
    items: [
      "Scammers often sell victim data to other criminals — expect follow-ups.",
      "Be extra cautious of 'recovery' scammers promising to get your money back.",
      "Watch for targeted phishing emails referencing your situation.",
      "Monitor all accounts for suspicious activity for the next 6 months.",
      "Inform family members so they don't fall for related scams.",
    ],
  },
  {
    id: "emotional-support",
    title: "Take Care of Yourself",
    icon: Smartphone,
    items: [
      "Getting scammed is NOT your fault. Scammers are professional manipulators.",
      "Talk to someone you trust about what happened.",
      "Consider speaking with a counselor if you're feeling distressed.",
      "Join online support groups for scam victims.",
      "Use this experience to help educate others — you're not alone.",
    ],
  },
];

const resourceLinks = [
  { name: "FTC Complaint Assistant", url: "https://ftc.gov/complaint" },
  { name: "FBI IC3 (Cyber Crime)", url: "https://ic3.gov" },
  { name: "Equifax Fraud Alert", url: "https://equifax.com" },
  { name: "Experian Fraud Alert", url: "https://experian.com" },
  { name: "TransUnion Fraud Alert", url: "https://transunion.com" },
  { name: "IdentityTheft.gov", url: "https://identitytheft.gov" },
];

export default function EmergencyPage() {
  const [expandedStep, setExpandedStep] = useState<string | null>("stay-calm");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  function toggleStep(id: string) {
    setExpandedStep((prev) => (prev === id ? null : id));
  }

  function markComplete(id: string) {
    setCompletedSteps((prev) => prev.includes(id) ? prev : [...prev, id]);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/20 to-orange-500/10 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500/20">
            <AlertTriangle className="h-6 w-6 text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-rose-100">Emergency Scam Recovery Guide</h1>
            <p className="mt-1 text-rose-200/80">
              If you've been scammed, follow these steps immediately. Every second counts.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="border-rose-500/30 text-rose-300 bg-rose-500/10">URGENT: Act now</Badge>
              <Badge variant="outline" className="border-amber-500/30 text-amber-300 bg-amber-500/10">
                {completedSteps.length}/{steps.length} steps done
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {steps.map((step, i) => {
            const isExpanded = expandedStep === step.id;
            const isComplete = completedSteps.includes(step.id);
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className={`glass cursor-pointer transition-all hover:border-cyan-500/20 ${
                    isComplete ? "border-emerald-500/30" : ""
                  } ${step.urgent && !isComplete ? "border-rose-500/20" : ""}`}
                  onClick={() => toggleStep(step.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-800 to-slate-700 font-mono text-sm font-bold text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className={`rounded-xl p-2 ${
                        isComplete ? "bg-emerald-500/20" : step.urgent ? "bg-rose-500/10" : "bg-cyan-500/10"
                      }`}>
                        <step.icon className={`h-5 w-5 ${
                          isComplete ? "text-emerald-400" : step.urgent ? "text-rose-400" : "text-cyan-400"
                        }`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{step.title}</h3>
                          {step.urgent && (
                            <Badge variant="outline" className="border-rose-500/30 text-[10px] text-rose-400">Urgent</Badge>
                          )}
                          {isComplete && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          )}
                        </div>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-3 overflow-hidden"
                            >
                              <ul className="space-y-2">
                                {step.items.map((item, j) => (
                                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-cyan-500" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3 gap-1 border-emerald-500/20 text-emerald-400"
                                onClick={(e) => { e.stopPropagation(); markComplete(step.id); }}
                                disabled={isComplete}
                              >
                                {isComplete ? (
                                  <><CheckCircle2 className="h-4 w-4" /> Completed</>
                                ) : (
                                  <><CheckCircle2 className="h-4 w-4" /> Mark as Done</>
                                )}
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {!isExpanded && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {step.items[0].substring(0, 60)}...
                          </p>
                        )}
                      </div>
                      <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ExternalLink className="h-4 w-4" /> Official Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resourceLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm text-muted-foreground transition hover:border-cyan-500/20 hover:text-cyan-300"
                >
                  <Globe className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1">{link.name}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              ))}
            </CardContent>
          </Card>

          <Card className="glass border-rose-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-rose-300">
                <Phone className="h-4 w-4" /> Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-rose-300">FTC Fraud Hotline:</span> 1-877-FTC-HELP</p>
              <p><span className="text-rose-300">FBI IC3:</span> ic3.gov</p>
              <p><span className="text-rose-300">IdentityTheft.gov:</span> 1-877-438-4338</p>
              <p><span className="text-rose-300">Your Bank:</span> Call 24/7 fraud line on back of card</p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Download className="h-4 w-4" /> Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2 border-border/50">
                <Printer className="h-4 w-4" /> Print Checklist
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 border-border/50">
                <Share2 className="h-4 w-4" /> Share Guide
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 border-border/50">
                <ClipboardList className="h-4 w-4" /> Save Progress
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
