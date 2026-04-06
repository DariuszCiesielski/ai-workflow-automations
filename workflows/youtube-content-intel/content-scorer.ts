/**
 * AI Content Scoring Pipeline
 *
 * Takes a transcript (or any text content) and returns a structured
 * analysis with score, summary, reasoning, and tags.
 *
 * Supports both OpenAI and Anthropic APIs (configurable via env).
 *
 * Prompt is optimized for Polish business audience — scores content
 * by relevance for Polish business owners interested in AI, automation,
 * and digital transformation.
 *
 * Usage:
 *   # With OpenAI:
 *   OPENAI_API_KEY=your_key AI_PROVIDER=openai npx tsx content-scorer.ts
 *
 *   # With Anthropic:
 *   ANTHROPIC_API_KEY=your_key AI_PROVIDER=anthropic npx tsx content-scorer.ts
 *
 * @module content-scorer
 */

import type { ContentScore, AIProvider, ScoringConfig } from "./types";

// --- Default Configuration ---

const SCORING_SYSTEM_PROMPT = `Jesteś ekspertem od oceny treści biznesowych. Twoja grupa docelowa to polscy właściciele małych i średnich firm zainteresowani:
- Sztuczną inteligencją w biznesie (automatyzacja, AI agenci, chatboty)
- Automatyzacją procesów (workflow, no-code, integracje)
- Marketingiem cyfrowym (SEO, content marketing, social media)
- Sprzedażą online (e-commerce, lead generation, CRM)
- Produktywnością i zarządzaniem firmą

Oceń podaną treść pod kątem PRZYDATNOŚCI dla tej grupy docelowej.

ZASADY OCENIANIA:
- Domyślna ocena to 3 (większość treści jest przeciętna)
- Ocena 7+ wymaga konkretnych, actionable wskazówek lub unikalne dane
- Ocena 9-10 to wyjątkowa treść z natychmiastową wartością biznesową
- Ocena 1-2 to treść całkowicie nieistotna lub spam
- Znane narzędzia open-source bez kontekstu biznesowego → max 4
- Czysto techniczny tutorial bez zastosowania biznesowego → max 5
- Case study z polskiego rynku → bonus +1
- Konkretne liczby (ROI, konwersje, przychody) → bonus +1

Odpowiedz WYŁĄCZNIE w formacie JSON (bez markdown, bez komentarzy):
{
  "summary": "2-3 zdania podsumowujące treść po polsku",
  "score": <liczba 1-10>,
  "scoreReason": "1-2 zdania wyjaśniające ocenę po polsku",
  "tags": ["tag1", "tag2", "tag3"]
}

Tagi powinny być po polsku, np.: "automatyzacja", "AI agenci", "marketing", "sprzedaż", "produktywność", "e-commerce", "case-study", "tutorial", "narzędzia".`;

// --- OpenAI Provider ---

async function scoreWithOpenAI(
  content: string,
  model: string,
  maxTokens: number,
  systemPrompt: string
): Promise<ContentScore> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
        {
          role: "user",
          content: `Oceń tę treść:\n\n${content.slice(0, 12000)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorBody}`);
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };

  const raw = data.choices[0]?.message?.content ?? "{}";
  return parseScoreResponse(raw);
}

// --- Anthropic Provider ---

async function scoreWithAnthropic(
  content: string,
  model: string,
  maxTokens: number,
  systemPrompt: string
): Promise<ContentScore> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
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
      messages: [
        {
          role: "user",
          content: `Oceń tę treść:\n\n${content.slice(0, 12000)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errorBody}`);
  }

  const data = (await response.json()) as {
    content: { type: string; text: string }[];
  };

  const raw =
    data.content.find((b) => b.type === "text")?.text ?? "{}";
  return parseScoreResponse(raw);
}

// --- Response Parser ---

function parseScoreResponse(raw: string): ContentScore {
  // Try to extract JSON from the response (handles markdown code blocks)
  let jsonStr = raw.trim();
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonStr = jsonMatch[0];
  }

  try {
    const parsed = JSON.parse(jsonStr) as Partial<ContentScore>;

    // Validate and sanitize
    const score = Math.min(10, Math.max(1, Math.round(parsed.score ?? 3)));

    return {
      summary: parsed.summary ?? "Brak podsumowania",
      score,
      scoreReason: parsed.scoreReason ?? "Brak uzasadnienia",
      tags: Array.isArray(parsed.tags)
        ? parsed.tags.filter((t): t is string => typeof t === "string")
        : [],
    };
  } catch {
    return {
      summary: "Nie udało się przeanalizować treści",
      score: 3,
      scoreReason: "Błąd parsowania odpowiedzi AI",
      tags: ["błąd"],
    };
  }
}

// --- Main Scoring Function ---

const DEFAULT_CONFIGS: Record<AIProvider, Omit<ScoringConfig, "systemPrompt">> =
  {
    openai: {
      provider: "openai",
      model: "gpt-4o",
      maxTokens: 1024,
    },
    anthropic: {
      provider: "anthropic",
      model: "claude-sonnet-4-20250514",
      maxTokens: 1024,
    },
  };

/**
 * Score content using AI.
 *
 * @param content - Text content to score (transcript, article, etc.)
 * @param config - Optional scoring configuration (provider, model, etc.)
 * @returns ContentScore with summary, score (1-10), reasoning, and tags
 *
 * @example
 * ```typescript
 * const score = await scoreContent("Full transcript text here...");
 * console.log(score.score);       // 7
 * console.log(score.summary);     // "Artykuł o zastosowaniach AI..."
 * console.log(score.scoreReason); // "Konkretne case study z polskiego rynku..."
 * console.log(score.tags);        // ["AI agenci", "automatyzacja", "case-study"]
 * ```
 */
export async function scoreContent(
  content: string,
  config?: Partial<ScoringConfig>
): Promise<ContentScore> {
  const provider: AIProvider =
    config?.provider ??
    (process.env.AI_PROVIDER as AIProvider) ??
    "anthropic";

  const defaults = DEFAULT_CONFIGS[provider];
  const model = config?.model ?? defaults.model;
  const maxTokens = config?.maxTokens ?? defaults.maxTokens;
  const systemPrompt = config?.systemPrompt ?? SCORING_SYSTEM_PROMPT;

  console.log(`[Scorer] Using ${provider} (${model})`);

  const start = Date.now();
  let result: ContentScore;

  if (provider === "openai") {
    result = await scoreWithOpenAI(content, model, maxTokens, systemPrompt);
  } else {
    result = await scoreWithAnthropic(content, model, maxTokens, systemPrompt);
  }

  console.log(
    `[Scorer] Score: ${result.score}/10 (${Date.now() - start}ms)`
  );

  return result;
}

// --- CLI Entry Point ---

async function main(): Promise<void> {
  const sampleContent = `
    W tym odcinku pokażę jak zbudowałem system automatyzacji marketingu
    dla mojej firmy. Używam AI agentów do analizy treści konkurencji,
    automatycznego generowania postów na social media i monitorowania
    wyników. Dzięki temu zaoszczędziłem 15 godzin tygodniowo i zwiększyłem
    ruch na stronie o 40% w ciągu 3 miesięcy. Pokażę dokładnie jakich
    narzędzi używam: Claude do analizy, Make.com do automatyzacji i
    Buffer do publikacji. Całkowity koszt: około 200 zł miesięcznie.
  `;

  const result = await scoreContent(sampleContent);

  console.log("\n=== Content Score ===");
  console.log(`Summary: ${result.summary}`);
  console.log(`Score: ${result.score}/10`);
  console.log(`Reason: ${result.scoreReason}`);
  console.log(`Tags: ${result.tags.join(", ")}`);
}

main().catch(console.error);
