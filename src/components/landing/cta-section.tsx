"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="gradient-border overflow-hidden rounded-3xl"
      >
        <div className="relative bg-gradient-to-br from-cyan-950/80 via-card to-emerald-950/40 px-8 py-16 text-center md:px-16">
          <div className="pointer-events-none absolute inset-0 shine opacity-30" />
          <h2 className="relative text-3xl font-bold md:text-4xl">
            Ready to secure your organization?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-muted-foreground">
            Join security teams using ScamShield AI to detect threats before they cause damage.
          </p>
          <Button variant="cyber" size="lg" className="relative mt-8 h-12 px-10" asChild>
            <Link href="/sign-up">
              Create free account <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
