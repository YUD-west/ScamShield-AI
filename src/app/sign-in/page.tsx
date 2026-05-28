import { Suspense } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { AnimatedBackground } from "@/components/layout/animated-background";

export default function SignInPage() {
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center p-6">
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-md space-y-8">
        <Link href="/" className="flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-lg shadow-cyan-500/25">
            <Shield className="h-6 w-6 text-slate-950" />
          </div>
          <span className="text-2xl font-bold">
            ScamShield <span className="text-cyan-400">AI</span>
          </span>
        </Link>

        <Card className="glass-strong border-cyan-500/25 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your security command center</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<p className="text-center text-sm text-muted-foreground">Loading…</p>}>
              <SignInForm googleEnabled={googleEnabled} />
            </Suspense>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          By signing in you agree to our{" "}
          <Link href="/terms" className="text-cyan-400 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-cyan-400 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
