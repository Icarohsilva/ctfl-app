# TestPath — Melhorias: XP/Streak, Desbloqueio, Card LinkedIn, AdSense

**Data:** 2026-04-30  
**Escopo:** 4 melhorias independentes no app TestPath (Next.js 16 / Supabase / Groq)

---

## 1. XP e Streak na tabela correta

### Problema

`TopicoGenerico.tsx:salvarResultado` grava XP (`pontos`), `streak`, `maior_streak` e `ultimo_estudo` na tabela `profiles`. O dashboard lê essas mesmas colunas de `usuario_certificacoes`. Os dados divergem: XP ganho em tópicos nunca aparece no dashboard.

### Decisão

Migrar a escrita para `usuario_certificacoes`. A tabela já possui todas as colunas necessárias (`pontos`, `streak`, `maior_streak`, `ultimo_estudo`). As colunas espelho em `profiles` ficam obsoletas mas não serão dropadas via código.

### Mudanças necessárias

**`src/components/TopicoGenerico.tsx` — função `salvarResultado`:**

1. Substituir o bloco que lê/atualiza `profiles` por:
   ```
   SELECT pontos, streak, maior_streak, ultimo_estudo
   FROM usuario_certificacoes
   WHERE user_id = userId AND certificacao_id = 'ctfl'
   ```
2. Calcular novo streak:
   - `hoje === ultimo_estudo` → streak não muda (já estudou hoje)
   - `ontem === ultimo_estudo` → `streak + 1`
   - caso contrário → `streak = 1`
3. Atualizar `usuario_certificacoes` com `pontos + xpGanho`, novo `streak`, `maior_streak`, `ultimo_estudo = hoje`.

**`src/components/TopicoGenerico.tsx` — header do componente:**

- A linha que exibe `perfil.pontos` no header (`⭐ {perfil.pontos} XP`) deve ser trocada por `cert.pontos` lido de `usuario_certificacoes`. O estado `perfil` pode manter apenas `nome` e `foto_url`.

**Arquivos afetados:** `src/components/TopicoGenerico.tsx` (único arquivo).

---

## 2. Desbloqueio progressivo de capítulos (≥ 65%)

### Problema

`salvarResultado` sempre grava `concluido: true` em `progresso_topicos` independente da nota. O dashboard conta tópicos `concluido=true` para calcular o unlock — então capítulos ficam "concluídos" mesmo com 0% de aproveitamento.

### Decisão

`concluido: true` só é gravado se `stats.pct >= 65`. Não é necessária nova coluna — `acertos` e `total` já existem na tabela e permitem recalcular se necessário.

### Regra de unlock no dashboard

A lógica de unlock na aba "Capítulos" já está correta (linha 387):

```ts
const desbloqueado = c.num === 1 ||
  progresso.find(x => x.capitulo === c.num - 1)?.concluidos === totalTopicosPorCap[c.num - 1];
```

Com a correção no `salvarResultado`, `concluidos` passará a contar apenas tópicos aprovados, e o unlock se tornará correto automaticamente.

A aba "Trilha" usa `semana_atual` de `usuario_certificacoes`. Esse campo deve ser atualizado junto com o XP: quando todos os tópicos do capítulo `N` estiverem concluídos (≥65%), incrementar `semana_atual` para `N+1` em `usuario_certificacoes`.

### Mudanças necessárias

**`src/components/TopicoGenerico.tsx` — função `salvarResultado`:**

1. Mudar `concluido: true` para `concluido: stats.pct >= 65` no upsert de `progresso_topicos`.
2. Adicionar `certificacao_id: 'ctfl'` ao upsert de `progresso_topicos` (campo ausente atualmente — o dashboard filtra por ele, então as rows existentes sem esse campo não apareceriam no filtro. O upsert corrigido resolve para novas rows; rows legadas sem `certificacao_id` são tratadas como sem certificação).
3. Após salvar, verificar se todos os tópicos do capítulo atual estão concluídos:
   ```
   SELECT COUNT(*) FROM progresso_topicos
   WHERE user_id = userId AND certificacao_id = 'ctfl'
     AND capitulo = numeroCapitulo AND concluido = true
   ```
   Se `count === totalTopicosPorCap[numeroCapitulo]` e `semana_atual <= numeroCapitulo`, atualizar `semana_atual = numeroCapitulo + 1` em `usuario_certificacoes`.

**Arquivos afetados:** `src/components/TopicoGenerico.tsx` (único arquivo, junto com item 1).

---

## 3. Card de progresso para LinkedIn

### Objetivo

Ao concluir um capítulo com ≥65% em todos os tópicos, exibir um modal com uma imagem pronta para compartilhar no LinkedIn. Principal motor de aquisição orgânica.

### Abordagem

API route com `next/og` (`ImageResponse`) em `/api/og/capitulo/[n]/route.tsx`. A imagem é gerada server-side, cacheada e acessível via URL pública — o LinkedIn faz scraping da imagem no compartilhamento.

### Design do card (1200×630px)

```
┌─────────────────────────────────────────────────────┐
│  [logo TestPath]  TestPath                 CTFL v4.0│
│                                                      │
│  Concluí o Capítulo 1                               │
│  Fundamentos de Teste de Software                   │
│                                                      │
│  ████████████░░░░░░  1 / 6 capítulos               │
│                                                      │
│  ⭐ 240 XP  ·  🔥 5 dias seguidos                   │
│                                                      │
│                              testpath.online        │
└─────────────────────────────────────────────────────┘
```

- Fundo `#0b0f1a`, borda sutil `#1f2937`
- Logo + "TestPath" em gradiente dourado `#d4af37→#f5d76e`
- Badge "CTFL v4.0" em dourado
- Headline em branco 48px bold
- Subtítulo (título do capítulo) em `#9ca3af` 28px
- Barra de progresso azul `#3b82f6`
- XP e streak em dourado
- CTA `testpath.online` em `#6b7280` canto inferior direito

### Query params da rota

`/api/og/capitulo/[n]?xp=240&streak=5`

XP e streak são passados como query params (não há autenticação na rota OG — a imagem é pública e cacheada).

### Página de conquista para OG scraping

O LinkedIn `share-offsite` recebe uma URL de página HTML e faz scraping dos `og:image` meta tags — não funciona apontando direto para o endpoint de imagem. Por isso, criar uma página leve:

`src/app/conquista/capitulo/[n]/page.tsx`

Essa página só precisa de:
- `generateMetadata` com `og:image` apontando para `/api/og/capitulo/[n]?xp=...&streak=...`
- Um redirect imediato para `/dashboard` via `redirect()` do Next.js (ou exibir uma tela de conquista simples antes do botão de voltar)

Os parâmetros `xp` e `streak` são passados como query params na URL de conquista: `/conquista/capitulo/1?xp=240&streak=5`. São dados públicos e representam um snapshot do momento da conclusão.

### Modal de compartilhamento

Ao detectar capítulo concluído (todos tópicos ≥65%), `TopicoGenerico` exibe modal com:
- Preview da imagem OG (`<img src="/api/og/capitulo/N?xp=X&streak=S">`)
- Botão "Compartilhar no LinkedIn" → `window.open('https://www.linkedin.com/sharing/share-offsite/?url=https://testpath.online/conquista/capitulo/N?xp=X&streak=S')`
- Botão "Baixar imagem" → fetch + download do PNG do endpoint OG
- Botão "Fechar"

### Dependências

`next/og` já vem com Next.js 16 — sem novo pacote. A fonte padrão do Satori (sem-serif) é suficiente.

### Arquivos novos/modificados

- `src/app/api/og/capitulo/[n]/route.tsx` — ImageResponse (endpoint de imagem)
- `src/app/conquista/capitulo/[n]/page.tsx` — página de conquista com OG meta tags (para LinkedIn scraping)
- `src/components/TopicoGenerico.tsx` — modal de compartilhamento após conclusão de capítulo

---

## 4. Google AdSense

### Objetivo

Monetizar via anúncios display em todas as páginas exceto o simulado em andamento (`/simulado-final` enquanto o usuário está respondendo questões).

### Abordagem

`next/script` com `strategy="afterInteractive"` no `layout.tsx` + componente `<AdBanner>` reutilizável.

### Configuração necessária (não no código)

O usuário precisa:
1. Conta Google AdSense aprovada em `testpath.online`
2. Publisher ID: `ca-pub-XXXXXXXXXXXXXXXXX` (vai para env var `NEXT_PUBLIC_ADSENSE_ID`)
3. Ao menos um Ad Slot ID por formato (banner 728×90, retângulo 300×250)

### Script global

Em `src/app/layout.tsx`, adicionar após o `<body>`:

```tsx
<Script
  src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

### Componente `<AdBanner>`

`src/components/AdBanner.tsx` — wrapper de `<ins class="adsbygoogle">` com `useEffect` para chamar `(adsbygoogle = window.adsbygoogle || []).push({})`. Aceita props `slotId` e `format` (`"auto"` | `"horizontal"` | `"rectangle"`).

O componente deve ser `"use client"` e incluir `suppressHydrationWarning` para evitar mismatch.

### Placement

| Página | Posição | Formato |
|--------|---------|---------|
| `/` (landing) | Entre seção hero e features | Horizontal |
| `/dashboard` | Abaixo das stats, acima da trilha | Horizontal |
| `/capitulo/[n]` | Rodapé da página | Horizontal |
| `/capitulo/[n]/topico/[id]` | Entre cards de conteúdo e simulado | Rectangle |
| `/perfil` | Lateral / rodapé | Rectangle |
| `/simulado-final` | **Nenhum** — não colocar anúncios |

### Arquivos novos/modificados

- `src/components/AdBanner.tsx` — componente reutilizável
- `src/app/layout.tsx` — script AdSense global
- Pages listadas na tabela acima — inserção do `<AdBanner>`

---

## Ordem de implementação recomendada

1. **Items 1 + 2** juntos — ambos em `TopicoGenerico.tsx`, uma única sessão de edição
2. **Item 3** — card LinkedIn, nova API route + modal
3. **Item 4** — AdSense, depende de conta aprovada (pode estar em paralelo)

---

## Fora do escopo

- Item 4 original (vídeo IA + publicação automática) — projeto separado, semanas de trabalho
- Migração/drop das colunas `pontos/streak/maior_streak` em `profiles` — DDL manual no Supabase se desejado
- Autenticação na rota OG (a imagem é pública por design)
