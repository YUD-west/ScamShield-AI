"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, AlertTriangle, Shield, Info, X, ChevronRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "threat" | "warning" | "info" | "success";
  time: string;
  read: boolean;
  link?: string;
}

const initialNotifications: Notification[] = [
  { id: "1", title: "Suspicious URL Detected", message: "You visited a site with typosquatting patterns. This may be a phishing attempt.", type: "threat", time: "2m ago", read: false },
  { id: "2", title: "Weak Password Warning", message: "Your password for 'example@email.com' appears in known data breaches. Change it now.", type: "warning", time: "15m ago", read: false },
  { id: "3", title: "New Login Detected", message: "New sign-in from Chrome on Windows 11. Location: New York, US. Was this you?", type: "info", time: "1h ago", read: false },
  { id: "4", title: "Risk Level Update", message: "Your security score improved to 78/100. Great job completing yesterday's quiz!", type: "success", time: "3h ago", read: true },
  { id: "5", title: "Community Alert", message: "New critical scam report: QR code phishing at parking meters in San Francisco.", type: "warning", time: "5h ago", read: true },
];

const typeStyles = {
  threat: { bg: "bg-rose-500/10", border: "border-rose-500/20", icon: AlertTriangle, color: "text-rose-400" },
  warning: { bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Shield, color: "text-amber-400" },
  info: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", icon: Info, color: "text-cyan-400" },
  success: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: Shield, color: "text-emerald-400" },
};

export function SmartNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  function dismiss(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg border border-border/50 p-2 text-muted-foreground transition hover:border-cyan-500/30 hover:text-cyan-400"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-50" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 z-50 mt-2 w-[400px] overflow-hidden rounded-2xl border border-border/50 bg-card/95 shadow-2xl shadow-black/40 backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-semibold">Notifications</span>
                  {unreadCount > 0 && (
                    <Badge variant="outline" className="border-cyan-500/30 text-[10px]">{unreadCount} new</Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-cyan-400 hover:text-cyan-300 transition">
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center p-8 text-center">
                    <Bell className="h-8 w-8 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">No notifications</p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const style = typeStyles[n.type];
                    return (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "flex items-start gap-3 border-b border-border/30 px-4 py-3 transition",
                          !n.read ? "bg-cyan-500/[0.02]" : "opacity-70",
                          "hover:bg-accent/50"
                        )}
                        onClick={() => markRead(n.id)}
                      >
                        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", style.bg)}>
                          <style.icon className={cn("h-4 w-4", style.color)} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium">{n.title}</p>
                            <button
                              onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                              className="shrink-0 text-muted-foreground hover:text-foreground transition"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-muted-foreground">{n.time}</span>
                            {n.link && (
                              <button className="flex items-center gap-0.5 text-[10px] text-cyan-400 hover:text-cyan-300">
                                View details <ChevronRight className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              <div className="border-t border-border/50 px-4 py-2.5">
                <button className="flex w-full items-center justify-center gap-1 text-xs text-muted-foreground hover:text-cyan-400 transition">
                  View all notifications <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
