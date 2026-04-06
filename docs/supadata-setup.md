# Konfiguracja Supadata (Opcjonalny Tier 4)

## Co to jest Supadata

[Supadata](https://supadata.ai) to płatna usługa API do pobierania transkrypcji YouTube. Używana jako **ostateczny fallback** (Tier 4) — tylko gdy darmowe metody (Tier 1-3) zawiodą.

## Kiedy potrzebujesz Supadata

W większości przypadków **NIE potrzebujesz** Supadata. Darmowe tiery (InnerTube Web, Android, HTML parsing) działają dla ~95% publicznych wideo.

Supadata jest przydatna gdy:
- Wideo ma wyłączone napisy i brak auto-generated
- YouTube blokuje InnerTube API (rzadkie, ale się zdarza)
- Przetwarzasz dużo wideo z ograniczeniami regionalnymi

## Konfiguracja

### Krok 1: Załóż konto

1. Wejdź na [supadata.ai](https://supadata.ai)
2. Załóż konto
3. Wygeneruj klucz API w dashboardzie

### Krok 2: Dodaj klucz do .env

```bash
# W pliku .env
SUPADATA_API_KEY=twój_klucz_supadata
```

### Krok 3: Gotowe

Tier 4 automatycznie aktywuje się gdy `SUPADATA_API_KEY` jest ustawiony. Jeśli zmienna nie istnieje, tier jest pomijany.

## Cennik

Sprawdź aktualny cennik na [supadata.ai](https://supadata.ai). Typowo:
- Darmowy tier: ograniczona liczba requestów/miesiąc
- Płatne plany: od kilku USD/miesiąc

## API Reference

Endpoint transkrypcji:
```
GET https://api.supadata.ai/v1/youtube/transcript?videoId={id}&lang={lang}
Headers: x-api-key: {twój_klucz}
```

Odpowiedź:
```json
{
  "content": [
    { "text": "fragment transkrypcji", "offset": 0, "duration": 5000 }
  ],
  "lang": "pl"
}
```

## Troubleshooting

| Problem | Rozwiązanie |
|---------|-------------|
| 401 Unauthorized | Sprawdź czy SUPADATA_API_KEY jest poprawny |
| 429 Rate Limited | Zmniejsz częstotliwość requestów lub upgrade planu |
| Pusty transcript | Wideo może nie mieć napisów w żadnym języku |
