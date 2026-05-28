import OpenAI from "openai";

let client: OpenAI | null = null;

export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function getOpenAIModel(): string {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
}

export function getOpenAIClient(): OpenAI | null {
  if (!isOpenAIConfigured()) return null;
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

export async function chatCompletion(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  options?: { json?: boolean; maxTokens?: number; temperature?: number },
): Promise<string> {
  const openai = getOpenAIClient();
  if (!openai) {
    throw new Error("OPENAI_NOT_CONFIGURED");
  }

  const res = await openai.chat.completions.create({
    model: getOpenAIModel(),
    messages,
    temperature: options?.temperature ?? 0.2,
    max_tokens: options?.maxTokens ?? 1200,
    ...(options?.json ? { response_format: { type: "json_object" as const } } : {}),
  });

  const text = res.choices[0]?.message?.content;
  if (!text) throw new Error("Empty OpenAI response");
  return text;
}
