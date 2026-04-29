# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

**TestPath** (`ctfl-app`) — Next.js 16 PWA in pt-BR for QA certification prep, starting with **CTFL v4.0 (ISTQB)**. Live at `testpath.online`. Trilhas, simulados gerados por IA, fila de revisão adaptativa, push + e-mail personalizados.

## Commands

```bash
npm run dev      # next dev (Turbopack)
npm run build    # next build
npm run start    # next start
npm run lint     # eslint (flat config, eslint-config-next)
node scripts/gerar-og.mjs       # regenerate public/og-image.svg
node scripts/converter-og.mjs   # convert SVG → og-image.png (uses sharp)
```

No test runner is configured. Path alias `@/*` → `./src/*`.

## Stack notes

- **Next 16.2.4 + React 19.2.4** — App Router only. AGENTS.md mandates reading `node_modules/next/dist/docs/` before writing Next.js code (APIs differ from training data).
- **Tailwind v4** via `@tailwindcss/postcss`. Most pages also use heavy inline styles (dark theme: `#0a0a0f` bg, `#c9a84c` gold accent) — match that pattern when editing existing pages.
- **TypeScript strict**.
- The `<head>` in `src/app/layout.tsx` ships **critical CSS for the responsive nav** inline via `dangerouslySetInnerHTML`. Don't move those nav classes (`.nav-link`, `.nav-mobile`, `.nav-desktop`, `.nav-mobile-only`) into globals.css without testing — they were inlined to fix a responsive flash regression.

## Architecture

### LLM provider

**Production routes use Groq (`llama-3.3-70b-versatile`)** via `groq-sdk` — see `src/app/api/simulado/route.ts`, `src/app/api/simulado-final/route.ts`, `src/app/api/push/notificar/route.ts`. `/api/conteudo/route.ts` doesn't call any LLM — it returns canned content from `src/data/conteudo-topicos.ts`. There is no Anthropic or Google AI integration in the live code path; `ANTHROPIC_API_KEY` and `GOOGLE_AI_API_KEY` env vars (if still in `.env.local`) are unused.

### Data flow — simulados

- `src/app/api/simulado` POST: looks up questions in the Supabase `banco_questoes` table by `topico_id` + `dificuldade`, ordered by `vezes_usada` ASC. If short, generates with Groq and inserts. Distribution per `nivel`: iniciante 2/1/1/0, basico 1/2/1/0, intermediario 1/1/1/1 (facil/medio/dificil/muito_dificil).
- `modo === "revisao"`: pulls from `fila_revisao` joined with `banco_questoes`, only `resolvida=false`, ordered by `tentativas` DESC.
- PATCH manages `fila_revisao`: on acerto, marks resolvida + kicks off background generation of a replacement; on erro, upserts/increments tentativas.
- Three Supabase **RPCs** are called and tolerated to fail silently (`try { … } catch {}`): `incrementar_uso_questoes`, `incrementar_acerto_questao`, `incrementar_erro_questao`.

### Supabase tables (canonical names — pt-BR)

`usuario_certificacoes`, `profiles`, `preferencias_notificacao`, `push_subscriptions`, `banco_questoes`, `fila_revisao`. Auth uses `supabase.auth` (email + password, with confirmation flow under `/confirmar-email`, `/esqueci-senha`, `/redefinir-senha`).

Two Supabase clients exist:
- `src/lib/supabase.ts` — anon key, client-side imports via `@/lib/supabase`.
- API routes that need privileged access (push subscription writes, auth.admin.getUserById in notifier) instantiate inline with `SUPABASE_SERVICE_ROLE_KEY`. Use that pattern for any admin work; don't expose the service role to the browser.

### PWA + push notifications

- Service worker at `public/sw.js` (registered by `src/components/PWAInstaller.tsx`). Network-first for documents, cache-first for assets, `/offline` fallback. APIs and Supabase/Groq/Google domains are bypassed.
- `manifest.json` and icons live under `public/`.
- Push uses **web-push + VAPID**. Subscriptions land in `push_subscriptions` keyed on `(user_id, endpoint)`.
- `/api/push/notificar` is a **cron-only endpoint**. It checks `x-cron-token` header against `CRON_SECRET`. It iterates users who didn't study today, computes a context (`prova_hoje`, `ausencia_3dias`, `streak_risco`, etc.), generates push + email copy with Groq, sends push via web-push, sends email via **Resend** (HTML template embedded in the route). 410/404 responses from web-push deactivate the subscription. Silence rules: 4 dias sem estudar → 7 dias de silêncio total → depois lembrete semanal.

### Conteúdo CTFL

- `src/data/mapa-capitulos.ts` — 6 capítulos × tópicos com metadados (xp, peso, semana).
- `src/data/conteudo-topicos.ts` — narrativas + cards canned por tópico (servido por `/api/conteudo`).
- `src/data/capitulo1.ts` — conteúdo expandido do cap. 1.
- `src/app/api/simulado/route.ts` carrega seu próprio `mapaTopicos` inline (cópia mais enxuta de `mapa-capitulos`). Se editar conceitos/títulos, atualize os dois para evitar drift.

## Routing map (pt-BR slugs)

`/` (landing) · `/login` · `/cadastro` · `/confirmar-email` · `/esqueci-senha` · `/redefinir-senha` · `/dashboard` · `/inicio/ctfl` · `/aprender` · `/capitulo/[capitulo]` · `/capitulo/[capitulo]/topico/[id]` · `/simulado-final` · `/perfil` · `/cancelar-notificacoes` · `/offline`.

`[capitulo]` é o número do capítulo (1–6); a rota valida via `mapaCaptulos[N]` e chama `notFound()` para inválidos.

## Required env vars (`.env.local`)

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GROQ_API_KEY`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_EMAIL`, `RESEND_API_KEY`, `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL`.

## Working language

UI strings, comments, table/column names, slugs, and AI prompts are all in **Portuguese (pt-BR)**. Match that when adding new content/routes/columns.
