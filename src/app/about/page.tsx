"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { AnimatedBackground } from "@/components/layout/animated-background";
import { Shield, Zap, Users, Globe, Lock, Award, TrendingUp, Heart, ArrowRight, CheckCircle2 } from "lucide-react";

const team = [
  { name: "Dr. Sarah Chen", role: "CEO & Founder", desc: "Cybersecurity researcher with 15+ years in threat intelligence" },
  { name: "Marcus Johnson", role: "CTO", desc: "Former Google Security, AI/ML specialist" },
  { name: "Priya Patel", role: "Head of AI", desc: "PhD in Machine Learning, ex-OpenAI researcher" },
  { name: "Alex Rivera", role: "Lead Engineer", desc: "Full-stack security architect, OWASP contributor" },
];

const timeline = [
  { year: "2023", event: "ScamShield founded to combat rising online fraud" },
  { year: "2024 Q1", event: "Multi-agent AI engine developed and patented" },
  { year: "2024 Q3", event: "Launched public beta with 10K+ users" },
  { year: "2025 Q1", event: "Enterprise version with SOC integration" },
  { year: "2025 Q3", event: "Browser extension released, 500K+ users" },
  { year: "2026", event: "Global threat intelligence network spanning 50+ countries" },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <LandingNav />

      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-28 text-center md:pt-36">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-5 py-2 text-sm text-cyan-300">
            <Shield className="h-4 w-4" /> Our mission
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-glow text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            Making the internet{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
              safe for everyone
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            We're a team of cybersecurity experts, AI researchers, and engineers on a mission to protect people from online scams, phishing, and digital fraud.
          </motion.p>
        </section>

        <section className="border-y border-border/40 bg-card/20 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { icon: Shield, value: "500K+", label: "Users Protected" },
                { icon: Zap, value: "2M+", label: "Threats Neutralized" },
                { icon: Globe, value: "50+", label: "Countries Covered" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <s.icon className="mx-auto h-8 w-8 text-cyan-400" />
                  <p className="mt-3 text-4xl font-bold text-cyan-300">{s.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="mb-4 text-center text-3xl font-bold">Our Story</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            ScamShield was born from a simple observation: online scams were getting smarter, but most people didn't have the tools to fight back.
          </p>
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-cyan-500/40 via-emerald-500/20 to-transparent" />
            <div className="space-y-8 pl-12">
              {timeline.map((t, i) => (
                <motion.div key={t.year} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative">
                  <div className="absolute -left-[34px] flex h-7 w-7 items-center justify-center rounded-full border-2 border-cyan-500/50 bg-background">
                    <div className="h-2 w-2 rounded-full bg-cyan-400" />
                  </div>
                  <span className="font-mono text-sm text-cyan-400">{t.year}</span>
                  <p className="mt-1 text-foreground">{t.event}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/40 bg-card/20 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-12 text-center text-3xl font-bold">Our Team</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {team.map((t, i) => (
                <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Card className="glass text-center">
                    <CardContent className="p-6">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20">
                        <Shield className="h-7 w-7 text-cyan-400" />
                      </div>
                      <h3 className="font-semibold">{t.name}</h3>
                      <p className="text-xs text-cyan-400 mt-1">{t.role}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{t.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">Our Values</h2>
              <p className="mt-2 text-muted-foreground">What drives us every day</p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: Lock, title: "Privacy First", desc: "Your data belongs to you. We never store or share personal information." },
                  { icon: Shield, title: "Transparency", desc: "Open about our methods, algorithms, and threat detection processes." },
                  { icon: Award, title: "Excellence", desc: "99.7% detection accuracy backed by continuous AI research." },
                  { icon: Heart, title: "Accessibility", desc: "Premium security tools free for everyone. Safety shouldn't be a luxury." },
                ].map((v) => (
                  <div key={v.title} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
                      <v.icon className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-medium">{v.title}</p>
                      <p className="text-sm text-muted-foreground">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Card className="glass">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold">Join Our Mission</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We're looking for passionate people to help us build a safer internet. 
                  Whether you're a security researcher, engineer, or designer — we'd love to hear from you.
                </p>
                <div className="mt-6 space-y-3">
                  {["Senior AI Engineer", "Threat Intelligence Analyst", "Frontend Security Engineer", "Product Designer"].map((role) => (
                    <div key={role} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                      <span className="text-sm">{role}</span>
                      <Button variant="ghost" size="sm" className="text-xs text-cyan-400">
                        Apply <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-r from-cyan-500/10 via-emerald-500/5 to-transparent py-20">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-bold">Ready to stay safe?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join 500,000+ users who trust ScamShield to protect them from online threats.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="cyber" size="lg" className="shadow-lg shadow-cyan-500/25" asChild>
                <Link href="/sign-up">Get Started Free <ArrowRight className="h-5 w-5" /></Link>
              </Button>
              <Button variant="outline" size="lg" className="border-cyan-500/30" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
