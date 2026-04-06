# YouTube Content Intelligence Pipeline

Pipeline do automatycznej analizy treści YouTube — pobiera transkrypcje i ocenia przydatność biznesową za pomocą AI.

## Jak działa

```
URL wideo → [Transcript Fetcher] → tekst → [AI Scorer] → ocena + podsumowanie + tagi
               4 poziomy fallback          OpenAI lub Anthropic
```

## Pobieranie transkrypcji — 4 poziomy

| Poziom | Metoda | Koszt | Kiedy działa |
|--------|--------|-------|-------------|
| 1 | InnerTube Web API | Darmowy | Większość publicznych wideo |
| 2 | InnerTube Android API | Darmowy | Omija niektóre ograniczenia geo/wiekowe |
| 3 | Parsowanie HTML strony | Darmowy | Gdy API InnerTube jest zablokowane |
| 4 | Supadata API | Płatny | Ostateczny fallback (opcjonalny) |

Poziomy 1-3 nie wymagają żadnych kluczy API.

## Scoring AI

Ocena treści na skali 1-10 pod kątem przydatności dla polskich przedsiębiorców:
- **1-2**: Treść nieistotna
- **3-4**: Ogólna, bez konkretów
- **5-6**: Przydatna, ale bez unikalne wartości
- **7-8**: Konkretne wskazówki, actionable
- **9-10**: Wyjątkowa — case study, dane, natychmiastowa wartość

## Użycie

```bash
# Tylko transkrypcja
npx tsx youtube-transcript.ts "https://youtube.com/watch?v=VIDEO_ID"

# Transkrypcja + scoring
npx tsx content-scorer.ts
```

## Zmienne środowiskowe

Skopiuj `.env.example` do `.env` i uzupełnij:

```bash
cp .env.example .env
```

Wymagane:
- `ANTHROPIC_API_KEY` lub `OPENAI_API_KEY` (do scoringu)

Opcjonalne:
- `SUPADATA_API_KEY` (płatny fallback transkrypcji)
- `AI_PROVIDER` (domyślnie: `anthropic`)
