import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "ScamShield caught a CEO impersonation attempt before our finance team wired funds. The multi-agent breakdown made the board meeting easy.",
    name: "Sarah Chen",
    role: "CISO, NovaPay Financial",
  },
  {
    quote:
      "We integrated the v1 API into our internal Slack bot. Sub-second heuristics plus OpenAI reasoning on Pro tier is exactly what we needed.",
    name: "Marcus Webb",
    role: "Head of Security, CloudRoute",
  },
  {
    quote:
      "Investor demo ready in minutes. The dashboard, PDF reports, and live SSE agent pipeline feel like a Series A product.",
    name: "Elena Rodriguez",
    role: "Founder, ShieldStack",
  },
];

export function TestimonialsSection() {
  return (
    <section className="border-t border-border/50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-4 text-center text-3xl font-bold">Trusted by security teams</h2>
        <p className="mb-12 text-center text-muted-foreground">
          Built for SOC analysts, fintech compliance, and consumer protection
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-8">
              <Quote className="mb-4 h-8 w-8 text-cyan-500/50" />
              <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 border-t border-border/50 pt-4">
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
