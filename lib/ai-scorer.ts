/**
 * Generic AI Scoring Utility
 *
 * A reusable scoring function that works with any text content.
 * Configurable AI provider (OpenAI or Anthropic), model, and scoring prompt.
 *
 * @module ai-scorer
 */

export interface ScoreResult {
  summary: string;
  score: number;
  scoreReason: string;
  tags: string[];
  provider: string;
  model: string;
  durationMs: number;
}

export interface ScorerOptions {
  /** AI provider: "openai" or "anthropic" */
  provider?: "openai" | "anthropic";
  /** Model name */
  model?: string;
  /** Maximum output tokens */
  maxTokens?: number;
  /** System prompt for the scorer */
  systemPrompt?: string;
  /** Maximum input length (chars) — truncates longer content */
  maxInputLength?: number;
}

const DEFAULT_SYSTEM_PROMPT = `Oceń podaną treść. Odpowiedz w JSON:
{
  "summary": "2-3 zdania podsumowania",
  "score": <1-10>,
  "scoreReason": "uzasadnienie oceny",
  "tags": ["tag1", "tag2"]
}`;

/**
 * Score any text content using AI.
 *
 * @param content - Text to analyze and score
 * @param options - Configuration (provider, model, prompt)
 * @returns ScoreResult with summary, score, reasoning, tags, and metadata
 */
export async function aiScore(
  content: string,
  options: ScorerOptions = {}
): Promise<ScoreResult> {
  const provider = options.provider ?? "anthropic";
  const maxInputLength = options.maxInputLength ?? 12000;
  const truncatedContent = content.slice(0, maxInputLength);
  const systemPrompt = options.systemPrompt ?? DEFAULT_SYSTEM_PROMPT;

  const start = Date.now();
  let rawResponse: string;

  if (provider === "openai") {
    const model = options.model ?? "gpt-4o";
    rawResponse = await callOpenAI(
      truncatedContent,
      systemPrompt,
      model,
      options.maxTokens ?? 1024
    );
  } else {
    const model = options.model ?? "claude-sonnet-4-20250514";
    rawResponse = await callAnthropic(
      truncatedContent,
      systemPrompt,
      model,
      options.maxTokens ?? 1024
    );
  }

  const parsed = safeParseJSON(rawResponse);

  const summary = typeof parsed.summary === "string" ? parsed.summary : "Brak podsumowania";
  const score = typeof parsed.score === "number" ? parsed.score : 3;
  const scoreReason = typeof parsed.scoreReason === "string" ? parsed.scoreReason : "Brak uzasadnienia";
  const tags = Array.isArray(parsed.tags)
    ? parsed.tags.filter((t): t is string => typeof t === "string")
    : [];

  return {
    summary,
    score: Math.min(10, Math.max(1, Math.round(score))),
    scoreReason,
    tags,
    provider,
    model:
      provider === "openai"
        ? options.model ?? "gpt-4o"
        : options.model ?? "claude-sonnet-4-20250514",
    durationMs: Date.now() - start,
  };
}

async function callOpenAI(
  content: string,
  systemPrompt: string,
  model: string,
  maxTokens: number
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content },
      ],
    }),
  });

  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0]?.message?.content ?? "{}";
}

async function callAnthropic(
  content: string,
  systemPrompt: string,
  model: string,
  maxTokens: number
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content }],
    }),
  });

  if (!res.ok)
    throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as {
    content: { type: string; text: string }[];
  };
  return data.content.find((b) => b.type === "text")?.text ?? "{}";
}

function safeParseJSON(raw: string): Record<string, unknown> {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return {};
  try {
    return JSON.parse(match[0]);
  } catch {
    return {};
  }
}
