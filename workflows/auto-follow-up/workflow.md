# Auto Follow-Up — Przewodnik Implementacji

## Architektura

```
[Trigger: nowy lead] → [Scheduler] → [Delay 2d] → [AI: personalizuj] → [Wyślij e-mail]
                                    → [Delay 5d] → [AI: personalizuj] → [Wyślij e-mail]
                                    → [Delay 10d] → [AI: personalizuj] → [Wyślij e-mail]
```

## Krok 1: Trigger

Źródła nowych leadów:
- Webhook z formularza (Typeform, Google Forms, własny)
- Nowy rekord w CRM / Supabase
- Nowy subskrybent Mailchimp / ConvertKit

## Krok 2: Sekwencja z opóźnieniami

### Opcja A: Cron + baza danych
```
Tabela: follow_up_queue
- lead_id
- email
- step (1, 2, 3)
- scheduled_at
- sent_at (null = do wysłania)
```

Cron co godzinę sprawdza `scheduled_at <= now() AND sent_at IS NULL`.

### Opcja B: Make.com / N8N
Użyj wbudowanych modułów delay/wait. Prostsze, ale mniej kontroli.

## Krok 3: Personalizacja AI

Przed wysłaniem każdego e-maila, AI personalizuje treść:

```typescript
const personalizedEmail = await scoreContent(
  `Lead: ${lead.name}, branża: ${lead.industry}, problem: ${lead.painPoint}`,
  {
    provider: "anthropic",
    systemPrompt: "Napisz krótki, personalny e-mail follow-up...",
  }
);
```

## Krok 4: Wysyłka

Rekomendowane narzędzia:
- **Resend** — prostota, dobre API, darmowy tier
- **Postmark** — najlepsza deliverability
- **SendGrid** — duży wolumen

## Metryki do śledzenia

| Metryka | Cel |
|---------|-----|
| Open rate | >40% (sekwencja personalizowana) |
| Reply rate | >10% |
| Bounce rate | <2% |
| Unsubscribe | <1% per krok |

## Zasady

- Zawsze sprawdzaj czy lead nie odpisał/zrezygnował przed kolejnym krokiem
- Nie wysyłaj w weekendy (chyba że B2C)
- Personalizacja > szablony — AI generuje warianty, nie kopiuje szablon
- Ogranicz do 3-4 follow-upów — więcej to spam
