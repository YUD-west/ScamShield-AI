"use client";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SmartNotifications } from "@/components/dashboard/smart-notifications";
import { useSession } from "next-auth/react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border/50 bg-background/80 px-4 sm:px-8 backdrop-blur-xl">
          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search scans, threats…"
              className="border-border/50 bg-card/50 pl-10"
            />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <SmartNotifications />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{session?.user?.name ?? "User"}</p>
              <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 text-sm font-bold text-slate-950">
              {(session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? "U").toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 scrollbar-thin">{children}</main>
      </div>
    </div>
  );
}
