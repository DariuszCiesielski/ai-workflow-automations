# Architektura — Wzorzec Agregacji Wieloźródłowej

## Główny wzorzec

Wszystkie workflow'y w tym repozytorium opierają się na tym samym wzorcu:

```
[Źródło 1] ──┐                    ┌── [Akcja A: Zapis do DB]
[Źródło 2] ──┼→ [Normalizator] → [AI Scorer] → [Router] ──┼── [Akcja B: Alert]
[Źródło 3] ──┘                    └── [Akcja C: Raport]
```

### Warstwy

1. **Źródła** — skąd przychodzą dane (YouTube API, RSS, webhooks, scraping)
2. **Normalizator** — sprowadza dane z różnych źródeł do wspólnego formatu
3. **AI Scorer** — ocenia treść i klasyfikuje (score, tagi, podsumowanie)
4. **Router** — decyduje co zrobić na podstawie wyniku (alert vs archiwum vs ignoruj)
5. **Akcje** — konkretne działania (zapis do DB, wysyłka e-mail, alert Telegram)

## Deduplikacja

Każdy element ma `external_id` (np. YouTube video ID, URL artykułu). Przed przetworzeniem sprawdzamy czy ID już istnieje w store. Zapobiega to wielokrotnemu przetwarzaniu tego samego elementu.

Implementacja: [`lib/dedup.ts`](../lib/dedup.ts)

## Scoring AI

Centralny komponent — ocenia treść na skali 1-10 z uzasadnieniem. Konfigurowalny prompt pozwala dostosować kryteria do różnych use case'ów.

Implementacja: [`lib/ai-scorer.ts`](../lib/ai-scorer.ts)

## Persystencja

Dwie opcje:
- **Pliki** — proste, lokalne (FileDedupStore)
- **Baza danych** — Supabase/PostgreSQL dla produkcji

## Uruchamianie

- **Cron** — regularne skanowanie (np. co godzinę)
- **Webhook** — reakcja na zdarzenia w czasie rzeczywistym
- **Ręcznie** — jednorazowe uruchomienie z CLI
