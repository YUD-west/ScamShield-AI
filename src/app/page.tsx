import { ScanWorkspace } from "@/components/scan/scan-workspace";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/landing-hero";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { TrustBadges } from "@/components/landing/trust-badges";
import { LiveThreatFeed } from "@/components/landing/live-threat-feed";
import { CyberAlerts } from "@/components/landing/cyber-alerts";
import { NewsFeed } from "@/components/landing/news-feed";
import { PricingSection } from "@/components/landing/pricing-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { AnimatedBackground } from "@/components/layout/animated-background";
import { Brain, Shield, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <LandingNav />

      <main>
        <LandingHero />

        <TrustBadges />

        <section id="scanner" className="mx-auto max-w-6xl px-6 pb-24">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Try the threat scanner</h2>
            <p className="mt-2 text-muted-foreground">
              Paste any suspicious message — see multi-agent analysis in real time
            </p>
          </div>
          <ScanWorkspace compact />
        </section>

        <section id="features" className="border-y border-border/40 bg-card/20 py-28">
          <FeaturesGrid />
        </section>

        <section id="how" className="mx-auto max-w-6xl px-6 py-28">
          <h2 className="mb-4 text-center text-3xl font-bold">How ScamShield works</h2>
          <p className="mx-auto mb-14 max-w-lg text-center text-muted-foreground">
            Three steps from suspicious content to actionable intelligence
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Brain, step: "01", title: "Ingest threat data", desc: "SMS, email, DMs, URLs, or screenshot OCR." },
              { icon: Zap, step: "02", title: "AI agents analyze", desc: "Six specialized agents score risk and tactics." },
              { icon: Shield, step: "03", title: "Act with confidence", desc: "PDF reports, history, and clear next steps." },
            ].map((s) => (
              <div
                key={s.step}
                className="glass group relative overflow-hidden rounded-2xl p-8 transition duration-300 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <span className="font-mono text-4xl font-bold text-cyan-500/20">{s.step}</span>
                <s.icon className="mb-4 mt-2 h-10 w-10 text-cyan-400 transition group-hover:scale-110" />
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <LiveThreatFeed />

        <CyberAlerts />

        <NewsFeed />

        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CtaSection />
        <LandingFooter />
      </main>
    </div>
  );
}
