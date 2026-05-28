"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Shield,
  LayoutDashboard,
  ScanSearch,
  Link2,
  GraduationCap,
  Users,
  MessageSquare,
  Settings,
  ShieldAlert,
  History,
  LogOut,
  ChevronRight,
  LifeBuoy,
  Puzzle,
  Radar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const links = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/scan", icon: ScanSearch, label: "Threat Scanner" },
  { href: "/dashboard/history", icon: History, label: "Scan History" },
  { href: "/dashboard/urls", icon: Link2, label: "URL Intel" },
  { href: "/dashboard/chat", icon: MessageSquare, label: "AI Assistant" },
  { href: "/dashboard/education", icon: GraduationCap, label: "Education" },
  { href: "/dashboard/community", icon: Users, label: "Community" },
  { href: "/dashboard/emergency", icon: LifeBuoy, label: "Emergency Guide" },
  { href: "/dashboard/extension", icon: Puzzle, label: "Browser Extension" },
  { href: "/dashboard/advanced-security", icon: Radar, label: "Advanced Security" },
  { href: "/dashboard/admin", icon: ShieldAlert, label: "Admin", adminOnly: true },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const visibleLinks = links.filter((l) => !l.adminOnly || isAdmin);

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border/50 bg-gradient-to-b from-card/80 to-background/90 backdrop-blur-xl">
      <Link
        href="/dashboard"
        className="flex items-center gap-3 border-b border-border/50 p-6 transition hover:bg-cyan-500/5"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-lg shadow-cyan-500/20">
          <Shield className="h-5 w-5 text-slate-950" />
        </div>
        <div>
          <span className="font-bold">ScamShield</span>
          <Badge variant="outline" className="ml-1 border-cyan-500/30 px-1.5 py-0 text-[10px] text-cyan-400">
            AI
          </Badge>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin">
        {visibleLinks.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                active
                  ? "bg-gradient-to-r from-cyan-500/20 to-emerald-500/10 text-cyan-300 shadow-inner"
                  : "text-muted-foreground hover:bg-accent/80 hover:text-foreground",
              )}
            >
              <l.icon className={cn("h-4 w-4", active && "text-cyan-400")} />
              <span className="flex-1">{l.label}</span>
              {active && <ChevronRight className="h-3 w-3 text-cyan-500/60" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/50 p-4">
        <div className="mb-3 rounded-xl bg-secondary/50 p-3">
          <p className="truncate text-sm font-medium">{session?.user?.name}</p>
          <p className="truncate text-xs text-muted-foreground">{session?.user?.email}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 border-border/60"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
