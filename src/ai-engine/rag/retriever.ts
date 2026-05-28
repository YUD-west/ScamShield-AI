import { SCAM_KNOWLEDGE, type KnowledgeChunk } from "./knowledge-base";

function scoreChunk(chunk: KnowledgeChunk, query: string): number {
  const q = query.toLowerCase();
  let score = 0;
  for (const kw of chunk.keywords) {
    if (q.includes(kw.toLowerCase())) score += 2;
  }
  for (const word of chunk.content.toLowerCase().split(/\W+/)) {
    if (word.length > 4 && q.includes(word)) score += 0.5;
  }
  return score;
}

/** Lightweight RAG retriever — swap with vector DB (pgvector/Pinecone) in production */
export function retrieveContext(query: string, topK = 3): KnowledgeChunk[] {
  return [...SCAM_KNOWLEDGE]
    .map((c) => ({ chunk: c, score: scoreChunk(c, query) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((x) => x.chunk);
}

export function formatRagContext(chunks: KnowledgeChunk[]): string[] {
  return chunks.map((c) => `[${c.category}] ${c.title}: ${c.content}`);
}
