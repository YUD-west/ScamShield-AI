import Link from "next/link";
import { Shield } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 font-bold">
          <Shield className="h-5 w-5 text-cyan-400" /> ScamShield AI
        </Link>
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="mt-4 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="mt-8 space-y-4 text-muted-foreground">
          <p>
            ScamShield AI provides threat analysis for informational purposes. Results are not legal
            or financial advice. You are responsible for decisions made based on our reports.
          </p>
          <p>
            Free tier includes daily scan limits. Paid plans are subject to Stripe billing terms.
          </p>
        </div>
      </div>
    </div>
  );
}
