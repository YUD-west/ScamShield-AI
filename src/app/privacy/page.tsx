import Link from "next/link";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 font-bold">
          <Shield className="h-5 w-5 text-cyan-400" /> ScamShield AI
        </Link>
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="prose prose-invert mt-8 max-w-none space-y-4 text-muted-foreground">
          <p>
            ScamShield AI processes message content you submit for threat analysis. We do not sell
            personal data. Scan data is stored securely when you use an authenticated account.
          </p>
          <p>
            Contact: security@scamshield.ai for data requests or deletion.
          </p>
        </div>
      </div>
    </div>
  );
}
