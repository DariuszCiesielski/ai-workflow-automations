🇬🇧 [English](README.md) | 🇵🇱 [Polski](README.pl.md)

![Last updated](https://img.shields.io/badge/Last%20updated-April%202026-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Contributions welcome](https://img.shields.io/badge/Contributions-welcome-brightgreen.svg)

# AI Workflow Automations for Content Pipelines and Business Intelligence

> Ready-to-use AI workflow automations for business intelligence, content pipelines, and lead monitoring.

## Featured Workflow: YouTube Content Intelligence

A complete pipeline for monitoring YouTube channels and scoring content relevance for your business. Includes a **4-tier transcript fetcher** that works without any API keys (paid fallback optional).

## Workflows

| Workflow | Status | Description |
|----------|--------|-------------|
| [YouTube Content Intel](workflows/youtube-content-intel/) | Production | YouTube transcript → AI scoring → business intelligence |
| [Auto Follow-Up](workflows/auto-follow-up/) | Template | Automated email follow-up sequences |
| [Competitor Monitor](workflows/competitor-monitor/) | Template | Track competitor changes and get alerts |

## Quick Start

```bash
git clone https://github.com/DariuszCiesielski/ai-workflow-automations.git
cd ai-workflow-automations

# Install dependencies
npm install

# Copy environment template
cp workflows/youtube-content-intel/.env.example .env

# Edit .env with your API keys
# Then run the YouTube intelligence pipeline
npx tsx workflows/youtube-content-intel/youtube-transcript.ts
```

## Architecture

All workflows follow the same multi-source aggregation pattern:

```
[Source A] ──┐
[Source B] ──┼→ [Normalizer] → [AI Scorer] → [Action]
[Source C] ──┘
```

See [docs/architecture.md](docs/architecture.md) for details.

## Key Components

### YouTube Transcript Fetcher (`youtube-transcript.ts`)
- **Tier 1**: InnerTube Web API (free, no key needed)
- **Tier 2**: InnerTube Android API (free, no key needed)
- **Tier 3**: HTML page parsing (free, no key needed)
- **Tier 4**: Supadata API (paid fallback, optional)

### AI Content Scorer (`content-scorer.ts`)
- Configurable scoring pipeline (OpenAI or Anthropic)
- Returns: summary, score (1-10), reasoning, tags
- Prompt optimized for Polish business audience

### Shared Libraries
- [`lib/ai-scorer.ts`](lib/ai-scorer.ts) — Generic AI scoring utility
- [`lib/dedup.ts`](lib/dedup.ts) — Deduplication using external_id pattern

## Documentation

- [Architecture Overview](docs/architecture.md)
- [Getting Started](docs/getting-started.md)
- [Supadata Setup](docs/supadata-setup.md) (optional paid transcript provider)

## Tech Stack

- **Runtime**: Node.js 18+ / TypeScript
- **AI**: OpenAI API or Anthropic API (configurable)
- **No framework lock-in** — plain TypeScript, easy to integrate

## Contributing

Contributions, corrections, and reusable workflow templates are welcome. Open an issue or PR if you want to improve a workflow or add a practical business automation example.

## Related Repositories

- [ai-content-marketing](https://github.com/DariuszCiesielski/ai-content-marketing) — editorial processes and content repurposing workflows
- [supabase-wzorce](https://github.com/DariuszCiesielski/supabase-wzorce) — secure data and backend patterns for workflow apps
- [agent-orchestration-patterns](https://github.com/DariuszCiesielski/agent-orchestration-patterns) — coordination patterns for more advanced automation systems

## Stay Connected

- **Newsletter**: [AI w Biznesie](https://aiwbiznesie.pl)
- **LinkedIn**: [Dariusz Ciesielski](https://www.linkedin.com/in/dariuszciesielski/)
- **More repositories**: [DariuszCiesielski on GitHub](https://github.com/DariuszCiesielski)

## License

MIT License — see [LICENSE](LICENSE) for details.
