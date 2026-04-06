# Competitor Monitor — Przewodnik Implementacji

## Architektura

```
[Cron: codziennie 8:00] → [Scraper] → [Diff Engine] → [AI Analyzer] → [Alert]
                              ↓              ↓
                         [Snapshot DB]   [Historia zmian]
```

## Krok 1: Definicja konkurentów

```typescript
interface Competitor {
  name: string;
  website: string;
  pricingUrl?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
  };
  keywords: string[]; // słowa kluczowe do monitorowania
}
```

## Krok 2: Scraping i snapshoty

Dla każdego konkurenta:
1. Pobierz stronę główną i stronę cennika
2. Wyekstrahuj tekst (ignoruj nawigację, stopkę)
3. Zapisz snapshot do bazy z timestampem

Narzędzia:
- **Jina Reader** (`r.jina.ai/URL`) — czysty tekst ze strony
- **Firecrawl** — scraping z obsługą SPA
- **Puppeteer** — gdy potrzebujesz renderowania JS

## Krok 3: Wykrywanie zmian (Diff)

Porównaj aktualny snapshot z poprzednim:
- Tekstowy diff (zmienione akapity)
- Cennik: wyekstrahuj liczby, porównaj
- Nowe podstrony / usunięte podstrony

## Krok 4: Analiza AI

```typescript
const analysis = await scoreContent(diffText, {
  provider: "anthropic",
  systemPrompt: `Przeanalizuj zmiany na stronie konkurenta.
    Oceń:
    1. Czy zmiana dotyczy cennika? (krytyczne)
    2. Czy dodano nowy produkt/feature? (ważne)
    3. Czy zmieniono pozycjonowanie? (ważne)
    4. Czy to kosmetyczna zmiana? (ignoruj)
    Odpowiedz w JSON z polami: type, importance (1-10), summary`,
});
```

## Krok 5: Alert

Wysyłaj alert tylko gdy `importance >= 6`:

- **Telegram Bot** — natychmiastowy alert na telefon
- **E-mail digest** — podsumowanie tygodniowe
- **Slack webhook** — dla zespołu

## Częstotliwość monitoringu

| Typ strony | Częstotliwość |
|-----------|--------------|
| Cennik | Codziennie |
| Strona główna | Co 2 dni |
| Blog | Co tydzień |
| Social media | Codziennie |

## Znane ograniczenia

- Strony z ciężkim JS (SPA) wymagają headless browser
- Niektóre strony blokują scrapery — użyj proxy
- Zmiany w obrazkach nie są wykrywane (tylko tekst)
- Rate limiting — nie odpytuj zbyt często
