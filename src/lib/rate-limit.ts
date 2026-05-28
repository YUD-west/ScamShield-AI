import { cacheGet, cacheSet } from "./redis";

const memoryStore = new Map<string, { count: number; reset: number }>();

export async function rateLimit(
  identifier: string,
  max = Number(process.env.RATE_LIMIT_MAX) || 100,
  windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
): Promise<{ success: boolean; remaining: number }> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();

  const cached = await cacheGet<{ count: number; reset: number }>(key);
  if (cached && cached.reset > now) {
    if (cached.count >= max) return { success: false, remaining: 0 };
    await cacheSet(key, { count: cached.count + 1, reset: cached.reset }, Math.ceil((cached.reset - now) / 1000));
    return { success: true, remaining: max - cached.count - 1 };
  }

  const mem = memoryStore.get(key);
  if (mem && mem.reset > now) {
    if (mem.count >= max) return { success: false, remaining: 0 };
    mem.count += 1;
    return { success: true, remaining: max - mem.count };
  }

  const reset = now + windowMs;
  memoryStore.set(key, { count: 1, reset });
  await cacheSet(key, { count: 1, reset }, Math.ceil(windowMs / 1000));
  return { success: true, remaining: max - 1 };
}
