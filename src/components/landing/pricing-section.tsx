"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiUrl } from "@/lib/api-url";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    features: ["10 scans/day", "Heuristic + RAG AI", "Community access"],
    cta: "Get started",
    href: "/dashboard",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    popular: true,
    features: ["Unlimited scans", "Advanced AI reasoning", "PDF reports", "URL intelligence", "Priority agents"],
    cta: "Upgrade to Pro",
    stripe: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    features: ["API access (v1)", "Bulk scanning", "Telegram bot", "SSO & SLA", "Audit logs"],
    cta: "Contact sales",
    stripe: true,
    plan: "enterprise",
  },
];

export function PricingSection() {
  const [loading, setLoading] = useState<string | null>(null);

  async function checkout(plan: string) {
    setLoading(plan);
    try {
      const res = await fetch(apiUrl("/api/stripe/checkout"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error ?? "Checkout unavailable — sign in and configure Stripe.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <section id="pricing" className="border-t border-border/50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-12 text-center text-3xl font-bold">Pricing</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`glass rounded-2xl p-8 ${p.popular ? "border-cyan-500/40 ring-1 ring-cyan-500/30" : ""}`}
            >
              {p.popular && (
                <span className="mb-4 inline-block rounded-full bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300">
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-bold">{p.name}</h3>
              <p className="mt-2 font-mono text-4xl">{p.price}</p>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0 text-emerald-400" /> {f}
                  </li>
                ))}
              </ul>
              {p.stripe ? (
                <Button
                  className="mt-8 w-full"
                  variant={p.popular ? "cyber" : "outline"}
                  disabled={!!loading}
                  onClick={() => checkout(p.plan ?? "pro")}
                >
                  {loading === (p.plan ?? "pro") ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    p.cta
                  )}
                </Button>
              ) : (
                <Button className="mt-8 w-full" variant="outline" asChild>
                  <Link href={p.href!}>{p.cta}</Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
