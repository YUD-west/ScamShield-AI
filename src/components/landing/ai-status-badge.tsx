"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { apiUrl } from "@/lib/api-url";

export function AiStatusBadge() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch(apiUrl("/api/ai/status"))
      .then((r) => r.json())
      .then((d) => setReady(d.ready === true))
      .catch(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <Sparkles className="h-3 w-3" />
      AI Live
    </span>
  );
}
