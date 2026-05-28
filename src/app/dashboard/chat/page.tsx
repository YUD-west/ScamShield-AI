"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiUrl } from "@/lib/api-url";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Shield,
  AlertTriangle,
  Info,
  Copy,
  ThumbsUp,
  RefreshCw,
  MessageSquare,
  BookOpen,
  Lock,
  Globe,
  Wallet,
  Smartphone,
  AlertCircle,
} from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const quickActions = [
  { icon: Shield, label: "Spot phishing", prompt: "How do I spot a phishing email? List the top 5 signs." },
  { icon: Lock, label: "Password tips", prompt: "Give me 5 tips for creating strong passwords." },
  { icon: Wallet, label: "Crypto scams", prompt: "How do crypto scams work and how can I avoid them?" },
  { icon: Smartphone, label: "SMS scams", prompt: "What are common SMS scam tactics I should watch out for?" },
  { icon: Globe, label: "Social media", prompt: "How can I stay safe from scams on social media?" },
  { icon: BookOpen, label: "Learn more", prompt: "What are the most common types of online scams in 2025?" },
];

const securityTips = [
  "Never share your 2FA codes with anyone, even if they claim to be from support.",
  "Legitimate companies will never ask for your password via email or phone.",
  "Always verify URLs before clicking — hover to see the real destination.",
  "Enable multi-factor authentication on all your important accounts.",
  "If an offer seems too good to be true, it almost always is a scam.",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "I'm ScamShield AI — your personal cybersecurity assistant. I can help you spot scams, secure your accounts, and stay safe online. Ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [engine, setEngine] = useState("ScamShield AI");
  const [tipIndex, setTipIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(apiUrl("/api/ai/status"))
      .then((r) => r.json())
      .then((d) => setEngine(d.engine === "openai" ? "GPT-4 + ScamShield" : "ScamShield AI"))
      .catch(() => setEngine("ScamShield AI"));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % securityTips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  async function send(prompt?: string) {
    const text = (prompt ?? input).trim();
    if (!text || loading) return;

    const userMsg: Msg = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(apiUrl("/api/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Chat failed");
      setMessages((m) => [...m, { role: "assistant", content: data.content }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chat unavailable. Using offline mode.");
      setMessages((m) => [...m, {
        role: "assistant",
        content: "I'm in offline mode right now. Here's a tip: **Never share personal information** with unsolicited callers or email senders. Always verify through official channels. What would you like to learn about?"
      }]);
    } finally {
      setLoading(false);
    }
  }

  function copyMessage(content: string) {
    navigator.clipboard.writeText(content);
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-lg shadow-cyan-500/20">
            <Bot className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Security Assistant</h1>
            <p className="text-xs text-muted-foreground">Powered by {engine}</p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Online
        </Badge>
      </div>

      <div className="mb-3 flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-2 text-xs text-cyan-300">
        <Info className="h-3.5 w-3.5 shrink-0" />
        <span className="animate-fadeIn">{securityTips[tipIndex]}</span>
      </div>

      <Card className="glass flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={`${i}-${m.role}-${m.content.length}`}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`mb-4 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`group flex max-w-[85%] gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    m.role === "user"
                      ? "bg-gradient-to-br from-violet-500 to-purple-600"
                      : "bg-gradient-to-br from-cyan-500 to-emerald-500"
                  } shadow-lg`}>
                    {m.role === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Shield className="h-4 w-4 text-slate-950" />
                    )}
                  </div>
                  <div>
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 text-cyan-50"
                        : "bg-secondary/80 text-foreground border border-white/[0.06]"
                    }`}>
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    </div>
                    {m.role === "assistant" && (
                      <div className="mt-1 flex items-center gap-2 px-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => copyMessage(m.content)}
                          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-cyan-400"
                        >
                          <Copy className="h-3 w-3" /> Copy
                        </button>
                        <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-emerald-400">
                          <ThumbsUp className="h-3 w-3" /> Helpful
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-start gap-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-lg">
                <Shield className="h-4 w-4 text-slate-950" />
              </div>
              <div className="rounded-2xl bg-secondary/80 px-4 py-3 text-sm border border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-xs text-muted-foreground">Analyzing...</span>
                </div>
              </div>
            </motion.div>
          )}

          {messages.length === 1 && (
            <div className="mt-6">
              <p className="mb-3 text-xs font-medium text-muted-foreground">QUICK ACTIONS</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => send(action.prompt)}
                    className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-secondary/50 px-3 py-2 text-xs text-muted-foreground transition-all hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-300"
                  >
                    <action.icon className="h-3.5 w-3.5" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 border-t border-border/50 p-4">
          <input
            ref={inputRef}
            className="flex-1 rounded-xl border border-border/50 bg-background/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask about scams, phishing, or paste a suspicious message..."
            disabled={loading}
          />
          <Button
            variant="cyber"
            size="icon"
            className="h-10 w-10 shrink-0"
            onClick={() => send()}
            disabled={loading || !input.trim()}
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </Card>
    </div>
  );
}
