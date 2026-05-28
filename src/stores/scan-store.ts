import { create } from "zustand";
import { apiUrl } from "@/lib/api-url";
import type { AnalysisOutput, ScanProgressEvent } from "@/types/analysis";

interface ScanState {
  content: string;
  loading: boolean;
  progress: ScanProgressEvent | null;
  result: AnalysisOutput | null;
  error: string | null;
  setContent: (content: string) => void;
  reset: () => void;
  analyze: () => Promise<void>;
  analyzeImage: (file: File) => Promise<void>;
}

export const useScanStore = create<ScanState>((set, get) => ({
  content: "",
  loading: false,
  progress: null,
  result: null,
  error: null,
  setContent: (content) => set({ content }),
  reset: () => set({ result: null, error: null, progress: null }),
  analyze: async () => {
    const { content } = get();
    if (!content.trim()) return;

    set({ loading: true, error: null, result: null, progress: null });

    try {
      const res = await fetch(apiUrl("/api/scan/stream"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        let errMsg = "Scan failed";
        try {
          const err = await res.json();
          errMsg = err.error ?? errMsg;
        } catch {
          /* ignore */
        }
        throw new Error(errMsg);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No response stream");

      let buffer = "";
      let completed = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6)) as {
              type: string;
              agent?: string;
              message?: string;
              progress?: number;
              result?: AnalysisOutput;
            };
            if (data.type === "progress") {
              set({
                progress: {
                  agent: data.agent ?? "Agent",
                  status: "running",
                  message: data.message ?? "",
                  progress: data.progress ?? 0,
                },
              });
            } else if (data.type === "complete" && data.result) {
              completed = true;
              set({ result: data.result, loading: false, progress: null });
            } else if (data.type === "error") {
              throw new Error(data.message ?? "Analysis failed");
            }
          } catch (e) {
            if (e instanceof SyntaxError) continue;
            throw e;
          }
        }
      }

      if (!completed) {
        throw new Error("Analysis ended without a result");
      }
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Analysis failed",
        loading: false,
        progress: null,
      });
    }
  },
  analyzeImage: async (file: File) => {
    set({ loading: true, error: null, result: null, progress: null });
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(apiUrl("/api/ocr"), { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "OCR failed");
      set({
        content: data.ocr_text ?? "",
        result: data as AnalysisOutput,
        loading: false,
      });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Screenshot scan failed",
        loading: false,
      });
    }
  },
}));
