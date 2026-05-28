"use client";

import Link from "next/link";
import { Shield, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { AiStatusBadge } from "@/components/landing/ai-status-badge";

export function LandingNav() {
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const loggedIn = status === "authenticated";

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Shield className="h-6 w-6 text-cyan-400" />
          ScamShield <span className="text-cyan-400">AI</span>
        </Link>
        <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="#scanner" className="hover:text-cyan-300">
            Scanner
          </Link>
          <Link href="#features" className="hover:text-cyan-300">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-cyan-300">
            Pricing
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <AiStatusBadge />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition dark:rotate-0 dark:scale-100" />
          </Button>
          {loggedIn ? (
            <Button variant="cyber" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button variant="cyber" asChild>
                <Link href="/sign-up">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
