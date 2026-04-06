# Szybki Start

## Wymagania

- Node.js 18+
- Klucz API: Anthropic lub OpenAI (do scoringu AI)

## Instalacja

```bash
git clone https://github.com/DariuszCiesielski/ai-workflow-automations.git
cd ai-workflow-automations
npm install
```

## Konfiguracja

```bash
cp workflows/youtube-content-intel/.env.example .env
```

Edytuj `.env`:
```
ANTHROPIC_API_KEY=twój_klucz_anthropic
AI_PROVIDER=anthropic
```

## Pierwszy uruchomienie

### Pobranie transkrypcji z YouTube

```bash
npx tsx workflows/youtube-content-intel/youtube-transcript.ts "https://youtube.com/watch?v=ID_WIDEO"
```

### Scoring treści

```bash
npx tsx workflows/youtube-content-intel/content-scorer.ts
```

## Struktura projektu

```
ai-workflow-automations/
├── workflows/
│   ├── youtube-content-intel/   ← Główny workflow
│   │   ├── youtube-transcript.ts  ← Pobieracz transkrypcji (4 tiers)
│   │   ├── content-scorer.ts      ← Scoring AI
│   │   ├── types.ts               ← Typy TypeScript
│   │   └── .env.example           ← Szablon zmiennych
│   ├── auto-follow-up/           ← Szablon: auto follow-up
│   └── competitor-monitor/       ← Szablon: monitoring konkurencji
├── lib/
│   ├── ai-scorer.ts              ← Uniwersalny scoring AI
│   └── dedup.ts                  ← Deduplikacja
└── docs/
    ├── architecture.md           ← Architektura
    ├── getting-started.md        ← Ten plik
    └── supadata-setup.md         ← Setup Supadata (opcjonalny)
```

## Następne kroki

1. Przetestuj pobieranie transkrypcji na kilku wideo
2. Dostosuj prompt scoringowy do swoich potrzeb (edytuj `SCORING_SYSTEM_PROMPT` w `content-scorer.ts`)
3. Podłącz do crona lub własnego systemu automatyzacji
4. Opcjonalnie: skonfiguruj [Supadata](supadata-setup.md) jako fallback transkrypcji
