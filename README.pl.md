🇬🇧 [English](README.md) | 🇵🇱 [Polski](README.pl.md)

![Last updated](https://img.shields.io/badge/Last%20updated-April%202026-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Contributions welcome](https://img.shields.io/badge/Contributions-welcome-brightgreen.svg)

# Automatyzacje Workflow AI

> Gotowe do użycia automatyzacje workflow AI — inteligencja z YouTube, pipeline contentowy, monitoring leadów.

## Główny workflow: YouTube Content Intelligence

Kompletny pipeline do monitorowania kanałów YouTube i oceny trafności treści dla Twojego biznesu. Zawiera **4-poziomowy pobieracz transkrypcji**, który działa bez żadnych kluczy API (płatny fallback opcjonalny).

## Workflow'y

| Workflow | Status | Opis |
|----------|--------|------|
| [YouTube Content Intel](workflows/youtube-content-intel/) | Produkcyjny | Transkrypcja YouTube → scoring AI → inteligencja biznesowa |
| [Auto Follow-Up](workflows/auto-follow-up/) | Szablon | Automatyczne sekwencje follow-up e-mail |
| [Competitor Monitor](workflows/competitor-monitor/) | Szablon | Śledzenie zmian u konkurencji z alertami |

## Szybki start

```bash
git clone https://github.com/DariuszCiesielski/ai-workflow-automations.git
cd ai-workflow-automations

# Zainstaluj zależności
npm install

# Skopiuj szablon zmiennych środowiskowych
cp workflows/youtube-content-intel/.env.example .env

# Edytuj .env — wstaw swoje klucze API
# Uruchom pipeline inteligencji YouTube
npx tsx workflows/youtube-content-intel/youtube-transcript.ts
```

## Architektura

Wszystkie workflow'y wykorzystują ten sam wzorzec agregacji wieloźródłowej:

```
[Źródło A] ──┐
[Źródło B] ──┼→ [Normalizator] → [Scoring AI] → [Akcja]
[Źródło C] ──┘
```

Szczegóły: [docs/architecture.md](docs/architecture.md)

## Kluczowe komponenty

### Pobieracz transkrypcji YouTube (`youtube-transcript.ts`)
- **Poziom 1**: InnerTube Web API (darmowe, bez klucza)
- **Poziom 2**: InnerTube Android API (darmowe, bez klucza)
- **Poziom 3**: Parsowanie HTML strony (darmowe, bez klucza)
- **Poziom 4**: Supadata API (płatny fallback, opcjonalny)

### Scoring treści AI (`content-scorer.ts`)
- Konfigurowalny pipeline scoringowy (OpenAI lub Anthropic)
- Zwraca: podsumowanie, ocenę (1-10), uzasadnienie, tagi
- Prompt zoptymalizowany dla polskiej grupy docelowej (właściciele firm)

### Biblioteki współdzielone
- [`lib/ai-scorer.ts`](lib/ai-scorer.ts) — Uniwersalny scoring AI
- [`lib/dedup.ts`](lib/dedup.ts) — Deduplikacja z wzorcem external_id

## Powiązane repozytoria

- [ai-content-marketing](https://github.com/DariuszCiesielski/ai-content-marketing/blob/main/README.pl.md) — procesy redakcyjne i workflow repurposingu treści
- [supabase-wzorce](https://github.com/DariuszCiesielski/supabase-wzorce/blob/main/README.pl.md) — bezpieczne wzorce danych i backendu dla aplikacji workflow
- [agent-orchestration-patterns](https://github.com/DariuszCiesielski/agent-orchestration-patterns/blob/main/README.pl.md) — wzorce koordynacji dla bardziej zaawansowanych systemów automatyzacji

## Bądź w kontakcie

- **Newsletter**: [AI w Biznesie](https://aiwbiznesie.pl)
- **LinkedIn**: [Dariusz Ciesielski](https://www.linkedin.com/in/dariuszciesielski/)
- **Więcej repozytoriów**: [DariuszCiesielski na GitHub](https://github.com/DariuszCiesielski)

## Licencja

Licencja MIT — szczegóły w pliku [LICENSE](LICENSE).
