<p align="center">
  <strong>Automatyzacje AI — gotowe workflow</strong><br/>
  Gotowe do użycia automatyzacje AI: monitoring YouTube, pipeline treści, śledzenie leadów i konkurencji.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Język-Polski-red" alt="Polski" />
  <img src="https://img.shields.io/badge/Licencja-MIT-green" alt="MIT" />
  <img src="https://img.shields.io/badge/Workflow-3-blue" alt="3 workflow" />
  <img src="https://img.shields.io/badge/Runtime-TypeScript-orange" alt="TypeScript" />
</p>

## Dlaczego to ważne

| Fakt | Kontekst |
|------|----------|
| Automatyzacje AI oszczędzają **15–30h tygodniowo** | Na monitoringu, raportach i rutynowych zadaniach |
| ROI w **2–4 tygodnie** | Koszt wdrożenia zwraca się błyskawicznie |
| **1 workflow zastępuje 2–3 narzędzia SaaS** | Mniej subskrypcji, więcej kontroli |

Każdy workflow działa samodzielnie, bez framework lock-in — czysty TypeScript, łatwy do integracji z dowolnym projektem.

## Co zawiera

### Workflow

| Workflow | Status | Opis |
|----------|--------|------|
| [YouTube Content Intel](workflows/youtube-content-intel/) | Produkcja | Transkrypcja YouTube → scoring AI → business intelligence |
| [Auto Follow-Up](workflows/auto-follow-up/) | Szablon | Automatyczne sekwencje follow-up email |
| [Competitor Monitor](workflows/competitor-monitor/) | Szablon | Śledzenie zmian u konkurencji z alertami |

### Kluczowe komponenty

**YouTube Transcript Fetcher** — 4-warstwowy system pobierania transkrypcji:
- Warstwa 1: InnerTube Web API (za darmo, bez klucza)
- Warstwa 2: InnerTube Android API (za darmo, bez klucza)
- Warstwa 3: Parsowanie HTML strony (za darmo, bez klucza)
- Warstwa 4: Supadata API (płatny fallback, opcjonalny)

**AI Content Scorer** — konfigurowalny pipeline scoringu:
- Podsumowanie, ocena 1–10, uzasadnienie, tagi
- Prompt zoptymalizowany pod polską grupę docelową

### Architektura

Wszystkie workflow działają wg tego samego wzorca:

```
[Źródło A] ──┐
[Źródło B] ──┼→ [Normalizer] → [AI Scorer] → [Akcja]
[Źródło C] ──┘
```

→ [Szczegóły architektury](docs/architecture.md) | [Jak zacząć](docs/getting-started.md)

### Szybki start

```bash
git clone https://github.com/DariuszCiesielski/ai-workflow-automations.git
cd ai-workflow-automations
npm install
cp workflows/youtube-content-intel/.env.example .env
npx tsx workflows/youtube-content-intel/youtube-transcript.ts
```

## Dla kogo

- ✅ Przedsiębiorcy, którzy chcą zautomatyzować monitoring treści i konkurencji
- ✅ Marketerzy szukający gotowych pipeline'ów do content intelligence
- ✅ Programiści budujący własne automatyzacje na bazie sprawdzonych wzorców
- ✅ Zespoły, które płacą za 5 narzędzi SaaS, a mogłyby mieć 1 workflow

## Chcesz to wdrożyć?

Wiedza jest darmowa. Wdrożenie wymaga narzędzi.

👉 **[AI w Biznesie](https://aiwbiznesie.online)** — blog, case studies, narzędzia AI dla firm

👉 **[Umów rozmowę](https://aiwbiznesie.online/kontakt/)** — pomogę zbudować automatyzacje AI dopasowane do Twojej firmy

## Licencja

MIT

<p align="center"><sub>Zbudowane przez <a href="https://aiwbiznesie.online">AI w Biznesie</a></sub></p>
