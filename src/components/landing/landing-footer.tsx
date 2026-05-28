import Link from "next/link";
import { Shield } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <Shield className="h-6 w-6 text-cyan-400" />
              ScamShield AI
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Autonomous cybersecurity platform for scam detection, phishing prevention, and
              threat intelligence — built for teams and individuals.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-cyan-400">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-cyan-400">Pricing</Link></li>
              <li><Link href="/sign-up" className="hover:text-cyan-400">Get started</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-cyan-400">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-cyan-400">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} ScamShield AI. All rights reserved.</p>
          <p className="text-xs">Protecting users from social engineering worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
