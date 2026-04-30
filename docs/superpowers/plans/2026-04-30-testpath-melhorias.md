# TestPath Melhorias — XP/Streak, Desbloqueio 65%, Card LinkedIn, AdSense

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir XP/streak para gravar em `usuario_certificacoes`, bloquear capítulos até aprovação com ≥65%, gerar card de conquista para LinkedIn, e integrar Google AdSense.

**Architecture:** Todas as mudanças de dado ficam em `TopicoGenerico.tsx` (único ponto de gravação de progresso). O card LinkedIn usa `next/og` com uma página de conquista server-rendered para OG scraping. AdSense usa um componente `<AdBanner>` com `next/script` global.

**Tech Stack:** Next.js 16 App Router, Supabase JS, `next/og` (ImageResponse), `next/script`

---

## Mapa de arquivos

| Ação | Arquivo |
|------|---------|
| Modificar | `src/components/TopicoGenerico.tsx` — salvarResultado, inicializar, nav, modal |
| Criar | `src/app/api/og/capitulo/[n]/route.tsx` — imagem OG 1200×630 |
| Criar | `src/app/conquista/capitulo/[n]/page.tsx` — página com OG meta para LinkedIn scraping |
| Criar | `src/components/AdBanner.tsx` — wrapper reutilizável do AdSense |
| Modificar | `src/app/layout.tsx` — Script global do AdSense |
| Modificar | `src/app/page.tsx` — AdBanner na landing |
| Modificar | `src/app/dashboard/page.tsx` — AdBanner entre stats e trilha |
| Modificar | `src/app/capitulo/[capitulo]/page.tsx` — AdBanner no rodapé |
| Modificar | `src/app/perfil/page.tsx` — AdBanner no rodapé |

---

## Task 1: XP/streak → usuario_certificacoes + desbloqueio 65%

**Files:**
- Modify: `src/components/TopicoGenerico.tsx`

Esta task reescreve `salvarResultado` (linhas ~175-200) para:
1. Gravar `concluido = pct >= 65` (não sempre `true`)
2. Adicionar `certificacao_id: "ctfl"` ao upsert de `progresso_topicos`
3. Ler/atualizar XP e streak em `usuario_certificacoes` (não mais em `profiles`)
4. Detectar quando o capítulo inteiro foi aprovado e incrementar `semana_atual`

Também atualiza `inicializar` para carregar `pontos` de `usuario_certificacoes`, e corrige o header do nav que exibia `perfil.pontos`.

---

- [ ] **Step 1: Adicionar novos estados em TopicoGenerico**

No bloco de `useState` (logo após `const [temRevisao, setTemRevisao] = useState(0);`, linha ~81), adicionar:

```tsx
const [xpAtual, setXpAtual] = useState(0);
const [capituloCompleto, setCapituloCompleto] = useState(false);
const [certStreak, setCertStreak] = useState(0);
```

- [ ] **Step 2: Carregar xpAtual em inicializar**

Na função `inicializar`, após a query de `profiles` (linha ~89), adicionar:

```tsx
const { data: ucData } = await supabase
  .from("usuario_certificacoes")
  .select("pontos")
  .eq("user_id", user.id)
  .eq("certificacao_id", "ctfl")
  .single();
if (ucData) setXpAtual(ucData.pontos || 0);
```

- [ ] **Step 3: Corrigir o header do nav**

Na linha ~220, mudar `{perfil.pontos} XP` para `{xpAtual} XP`:

```tsx
// ANTES
{perfil && <span style={{ fontSize: "12px", color: "#6b7280" }}>{perfil.nome?.split(" ")[0]} · ⭐ {perfil.pontos} XP</span>}

// DEPOIS
{perfil && <span style={{ fontSize: "12px", color: "#6b7280" }}>{perfil.nome?.split(" ")[0]} · ⭐ {xpAtual} XP</span>}
```

- [ ] **Step 4: Reescrever salvarResultado**

Substituir o bloco inteiro da função `salvarResultado` (linhas ~170-205) por:

```tsx
const salvarResultado = async (todasRespostas: number[]) => {
  if (!userId || questoes.length === 0) return;
  const stats = calcularEstatisticas(questoes, todasRespostas);
  const foiAprovado = stats.pct >= 65;

  // Preserva concluído anterior se o usuário já tinha aprovado
  const { data: existente } = await supabase
    .from("progresso_topicos")
    .select("concluido")
    .eq("user_id", userId)
    .eq("topico_id", id)
    .maybeSingle();

  await supabase.from("progresso_topicos").upsert({
    user_id: userId,
    capitulo: numeroCapitulo,
    topico_id: id,
    certificacao_id: "ctfl",
    acertos: stats.acertos,
    total: stats.total,
    xp_ganho: stats.xpGanho,
    concluido: foiAprovado || existente?.concluido === true,
    atualizado_em: new Date().toISOString(),
  });

  const registros = stats.resultado.map(r => ({
    user_id: userId, topico_id: id, conceito: r.conceito,
    acertou: r.acertou, dificuldade: r.dificuldade, criado_em: new Date().toISOString(),
  }));
  if (registros.length > 0) {
    await supabase.from("historico_conceitos").insert(registros);
  }

  const { data: uc } = await supabase
    .from("usuario_certificacoes")
    .select("pontos, streak, maior_streak, ultimo_estudo, semana_atual")
    .eq("user_id", userId)
    .eq("certificacao_id", "ctfl")
    .single();

  if (uc) {
    const hoje = new Date().toISOString().split("T")[0];
    const ontem = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    let novoStreak = uc.streak || 0;
    if (uc.ultimo_estudo !== hoje) {
      novoStreak = uc.ultimo_estudo === ontem ? novoStreak + 1 : 1;
    }

    const novoPontos = (uc.pontos || 0) + stats.xpGanho;
    const updates: Record<string, unknown> = {
      pontos: novoPontos,
      streak: novoStreak,
      maior_streak: Math.max(novoStreak, uc.maior_streak || 0),
      ultimo_estudo: hoje,
    };

    if (foiAprovado) {
      const totalDoCapitulo = capitulo?.topicos.length || 0;
      const { count } = await supabase
        .from("progresso_topicos")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("certificacao_id", "ctfl")
        .eq("capitulo", numeroCapitulo)
        .eq("concluido", true);

      if ((count || 0) >= totalDoCapitulo && (uc.semana_atual || 1) <= numeroCapitulo) {
        updates.semana_atual = numeroCapitulo + 1;
        setCertStreak(novoStreak);
        setCapituloCompleto(true);
      }
    }

    await supabase
      .from("usuario_certificacoes")
      .update(updates)
      .eq("user_id", userId)
      .eq("certificacao_id", "ctfl");

    setXpAtual(novoPontos);
  }
};
```

- [ ] **Step 5: Verificar build TypeScript**

```bash
npm run build
```

Esperado: zero erros TypeScript. Se houver erro de tipo no `updates`, verificar que `Record<string, unknown>` aceita os campos.

- [ ] **Step 6: Testar manualmente**

```bash
npm run dev
```

1. Fazer login e completar um tópico com ≥65% de acerto
2. Ir ao dashboard → verificar que XP aumentou
3. Completar um tópico com <65% → verificar que o tópico NÃO aparece como concluído no dashboard
4. Inspecionar no Supabase: `usuario_certificacoes.pontos` deve estar atualizado; `profiles.pontos` não muda mais

- [ ] **Step 7: Commit**

```bash
git add src/components/TopicoGenerico.tsx
git commit -m "fix: XP e streak em usuario_certificacoes, desbloqueio 65%"
```

---

## Task 2: OG Image API Route

**Files:**
- Criar: `src/app/api/og/capitulo/[n]/route.tsx`

Endpoint que retorna uma imagem PNG 1200×630 representando a conquista do capítulo. Usa `next/og` (incluído no Next.js, sem pacote extra).

---

- [ ] **Step 1: Criar o arquivo da rota**

Criar `src/app/api/og/capitulo/[n]/route.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import mapaCaptulos from "@/data/mapa-capitulos";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ n: string }> }
) {
  const { n } = await params;
  const numCap = parseInt(n);
  const cap = mapaCaptulos[numCap];
  if (!cap) return new Response("Not found", { status: 404 });

  const { searchParams } = request.nextUrl;
  const xp = searchParams.get("xp") || "0";
  const streak = parseInt(searchParams.get("streak") || "0");
  const totalCaps = Object.keys(mapaCaptulos).length;
  const progressoPct = Math.round((numCap / totalCaps) * 100);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0b0f1a",
          display: "flex",
          flexDirection: "column",
          padding: "60px",
          fontFamily: "sans-serif",
          border: "2px solid #1f2937",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "56px" }}>
          <span style={{ fontSize: "34px", fontWeight: "bold", color: "#d4af37" }}>TestPath</span>
          <span style={{ fontSize: "18px", background: "rgba(212,175,55,0.12)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.4)", padding: "6px 18px", borderRadius: "99px" }}>
            CTFL v4.0
          </span>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: "22px", color: "#6b7280", marginBottom: "14px" }}>
            Concluí o Capítulo {n}
          </div>
          <div style={{ fontSize: "50px", fontWeight: "bold", color: "#f9fafb", lineHeight: 1.15, marginBottom: "44px" }}>
            {cap.titulo}
          </div>

          {/* Barra de progresso */}
          <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "44px" }}>
            <div style={{ flex: 1, height: "12px", background: "#1f2937", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ width: `${progressoPct}%`, height: "12px", background: "#3b82f6", borderRadius: "99px" }} />
            </div>
            <span style={{ fontSize: "20px", color: "#9ca3af", whiteSpace: "nowrap" }}>
              {n} / {totalCaps} caps
            </span>
          </div>

          {/* XP e streak */}
          <div style={{ display: "flex", gap: "28px" }}>
            <span style={{ fontSize: "24px", color: "#d4af37" }}>⭐ {xp} XP</span>
            {streak > 0 && (
              <span style={{ fontSize: "24px", color: "#d4af37" }}>
                🔥 {streak} dia{streak > 1 ? "s" : ""} seguido{streak > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span style={{ fontSize: "20px", color: "#374151" }}>testpath.online</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

Esperado: zero erros.

- [ ] **Step 3: Testar a imagem manualmente**

```bash
npm run dev
```

Abrir no browser: `http://localhost:3000/api/og/capitulo/1?xp=200&streak=3`

Esperado: imagem PNG com fundo escuro, "Concluí o Capítulo 1", "Fundamentos de Teste", barra de progresso, "⭐ 200 XP", "🔥 3 dias seguidos".

- [ ] **Step 4: Commit**

```bash
git add src/app/api/og/capitulo/
git commit -m "feat: rota OG image para card de conquista por capítulo"
```

---

## Task 3: Página de conquista para LinkedIn scraping

**Files:**
- Criar: `src/app/conquista/capitulo/[n]/page.tsx`

O LinkedIn faz scraping de HTML para ler `og:image`. Precisamos de uma página com os meta tags corretos. Esta página também serve como tela de conquista que o usuário vê antes de voltar à trilha.

---

- [ ] **Step 1: Criar a página**

Criar `src/app/conquista/capitulo/[n]/page.tsx`:

```tsx
import type { Metadata } from "next";
import mapaCaptulos from "@/data/mapa-capitulos";

type Props = {
  params: Promise<{ n: string }>;
  searchParams: Promise<{ xp?: string; streak?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { n } = await params;
  const { xp = "0", streak = "0" } = await searchParams;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://testpath.online";
  const cap = mapaCaptulos[parseInt(n)];
  const titulo = cap ? `Concluí o Cap. ${n} — ${cap.titulo}` : `Capítulo ${n} concluído`;
  const ogImage = `${siteUrl}/api/og/capitulo/${n}?xp=${xp}&streak=${streak}`;

  return {
    title: `${titulo} | TestPath`,
    description: `Capítulo ${n} do CTFL v4.0 concluído. ${xp} XP acumulados. Estudando com TestPath.`,
    openGraph: {
      title: titulo,
      description: `Estudando para o CTFL v4.0 com TestPath. ${xp} XP acumulados.`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: titulo }],
      type: "website",
      siteName: "TestPath",
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      images: [ogImage],
    },
  };
}

export default async function ConquistaPage({ params, searchParams }: Props) {
  const { n } = await params;
  const { xp = "0", streak = "0" } = await searchParams;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://testpath.online";
  const cap = mapaCaptulos[parseInt(n)];
  const ogImage = `${siteUrl}/api/og/capitulo/${n}?xp=${xp}&streak=${streak}`;

  return (
    <main
      style={{
        background: "#0b0f1a",
        minHeight: "100vh",
        color: "#e5e7eb",
        fontFamily: "sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "1.5rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "4rem" }}>🏆</div>
      <h1 style={{ fontFamily: "Georgia, serif", fontWeight: "normal", fontSize: "2rem", color: "#e5e7eb", margin: 0 }}>
        Capítulo {n} concluído!
      </h1>
      {cap && (
        <p style={{ color: "#9ca3af", margin: 0, fontSize: "16px" }}>{cap.titulo}</p>
      )}
      <img
        src={ogImage}
        alt="Card de conquista"
        style={{ width: "100%", maxWidth: "560px", borderRadius: "12px", border: "1px solid #1f2937" }}
      />
      <a
        href="/dashboard"
        style={{
          background: "#3b82f6",
          color: "#fff",
          padding: "12px 32px",
          borderRadius: "10px",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "15px",
        }}
      >
        Continuar trilha →
      </a>
    </main>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

Esperado: zero erros.

- [ ] **Step 3: Testar a página manualmente**

```bash
npm run dev
```

Abrir: `http://localhost:3000/conquista/capitulo/1?xp=200&streak=3`

Esperado: página com trofeu, "Capítulo 1 concluído!", "Fundamentos de Teste", preview da imagem OG, botão "Continuar trilha →".

Verificar OG tags: abrir DevTools → Elements → `<head>` → confirmar `og:image` aponta para `/api/og/capitulo/1?xp=200&streak=3`.

- [ ] **Step 4: Commit**

```bash
git add src/app/conquista/
git commit -m "feat: página de conquista com OG meta tags para compartilhamento no LinkedIn"
```

---

## Task 4: Modal de compartilhamento no TopicoGenerico

**Files:**
- Modify: `src/components/TopicoGenerico.tsx`

Quando `capituloCompleto` é `true` (detectado em `salvarResultado` na Task 1), exibir um modal de compartilhamento na tela de conclusão.

---

- [ ] **Step 1: Adicionar o modal ao render de conclusão**

No final de `TopicoGenerico.tsx`, logo antes do `return` da tela de conclusão (linha ~449, dentro do `return (<main ...>`), adicionar o modal como overlay:

```tsx
{capituloCompleto && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.75)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
    }}
  >
    <div
      style={{
        background: "#111827",
        border: "1px solid #1f2937",
        borderRadius: "16px",
        padding: "2rem",
        maxWidth: "480px",
        width: "100%",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎓</div>
      <h2
        style={{
          fontFamily: "Georgia, serif",
          fontWeight: "normal",
          color: "#e5e7eb",
          margin: "0 0 0.5rem",
        }}
      >
        Capítulo {numeroCapitulo} completo!
      </h2>
      <p style={{ color: "#9ca3af", fontSize: "14px", margin: "0 0 1.5rem" }}>
        Todos os tópicos aprovados com ≥65%. Compartilhe sua conquista!
      </p>
      <img
        src={`/api/og/capitulo/${numeroCapitulo}?xp=${xpAtual}&streak=${certStreak}`}
        alt="Card de conquista"
        style={{
          width: "100%",
          borderRadius: "8px",
          marginBottom: "1.5rem",
          border: "1px solid #1f2937",
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <button
          onClick={() =>
            window.open(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                `${process.env.NEXT_PUBLIC_SITE_URL || "https://testpath.online"}/conquista/capitulo/${numeroCapitulo}?xp=${xpAtual}&streak=${certStreak}`
              )}`
            )
          }
          style={{
            background: "#0077b5",
            border: "none",
            borderRadius: "10px",
            padding: "12px 24px",
            color: "#fff",
            fontSize: "15px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Compartilhar no LinkedIn
        </button>
        <button
          onClick={async () => {
            const resp = await fetch(
              `/api/og/capitulo/${numeroCapitulo}?xp=${xpAtual}&streak=${certStreak}`
            );
            const blob = await resp.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `testpath-cap${numeroCapitulo}.png`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          style={{
            background: "transparent",
            border: "1px solid #374151",
            borderRadius: "10px",
            padding: "11px 24px",
            color: "#9ca3af",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Baixar imagem
        </button>
        <button
          onClick={() => setCapituloCompleto(false)}
          style={{
            background: "transparent",
            border: "none",
            color: "#6b7280",
            fontSize: "13px",
            cursor: "pointer",
            padding: "8px",
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
)}
```

O local exato de inserção é dentro do `return` da tela de conclusão, logo após a tag `<main style={s.main}><div style={s.inner}>`. O modal usa `position: fixed` então aparece sobre todo o conteúdo.

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

- [ ] **Step 3: Testar o modal**

```bash
npm run dev
```

1. Completar o último tópico de um capítulo com ≥65%
2. Verificar que o modal aparece com o card de conquista
3. Clicar "Compartilhar no LinkedIn" — deve abrir nova aba com o share dialog do LinkedIn
4. Clicar "Baixar imagem" — deve fazer download do PNG
5. Clicar "Fechar" — modal fecha, tela de conclusão aparece normalmente

- [ ] **Step 4: Commit**

```bash
git add src/components/TopicoGenerico.tsx
git commit -m "feat: modal de compartilhamento LinkedIn ao completar capítulo"
```

---

## Task 5: Google AdSense — componente, script e placement

**Files:**
- Criar: `src/components/AdBanner.tsx`
- Modificar: `src/app/layout.tsx`
- Modificar: `src/app/page.tsx`
- Modificar: `src/app/dashboard/page.tsx`
- Modificar: `src/app/capitulo/[capitulo]/page.tsx`
- Modificar: `src/components/TopicoGenerico.tsx` (etapa simulado)
- Modificar: `src/app/perfil/page.tsx`

**Pré-requisito (usuário):** ter uma conta Google AdSense com o site `testpath.online` aprovado. O publisher ID (`ca-pub-XXXXXXXXXX`) e ao menos um Ad Slot ID são necessários antes de ativar. Enquanto não configurados, o componente retorna `null` silenciosamente.

---

- [ ] **Step 1: Criar o componente AdBanner**

Criar `src/components/AdBanner.tsx`:

```tsx
"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type AdBannerProps = {
  slotId: string;
  format?: "auto" | "horizontal" | "rectangle";
};

export default function AdBanner({ slotId, format = "auto" }: AdBannerProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle ainda não carregado
    }
  }, []);

  if (!process.env.NEXT_PUBLIC_ADSENSE_ID) return null;

  return (
    <div style={{ overflow: "hidden", margin: "1rem 0" }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
        suppressHydrationWarning
      />
    </div>
  );
}
```

- [ ] **Step 2: Adicionar Script global ao layout**

Em `src/app/layout.tsx`, adicionar import de `Script` no topo:

```tsx
import Script from "next/script";
```

No `<body>`, adicionar antes de `{children}`:

```tsx
{process.env.NEXT_PUBLIC_ADSENSE_ID && (
  <Script
    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
    crossOrigin="anonymous"
    strategy="afterInteractive"
  />
)}
```

O body completo deve ficar:

```tsx
<body className="min-h-full flex flex-col">
  {process.env.NEXT_PUBLIC_ADSENSE_ID && (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )}
  {children}
  <BFCacheReload />
  <PWAInstaller />
</body>
```

- [ ] **Step 3: Adicionar AdBanner na landing page**

Em `src/app/page.tsx`, adicionar import:

```tsx
import AdBanner from "@/components/AdBanner";
```

Localizar a seção hero (o primeiro grande bloco de conteúdo). Adicionar logo após o encerramento do bloco hero e antes das features/seções seguintes:

```tsx
<AdBanner slotId="SLOT_ID_HORIZONTAL" format="horizontal" />
```

*(substituir `SLOT_ID_HORIZONTAL` pelo Ad Slot ID real do AdSense ao ativar)*

- [ ] **Step 4: Adicionar AdBanner no dashboard**

Em `src/app/dashboard/page.tsx`, adicionar import:

```tsx
import AdBanner from "@/components/AdBanner";
```

Localizar a div das tabs (onde alterna entre "trilha" e "capitulos", logo antes do conteúdo da tab). Adicionar após o bloco de stats (os 4 cards de XP/streak/progresso/dias restantes) e antes do seletor de tabs:

```tsx
<AdBanner slotId="SLOT_ID_HORIZONTAL" format="horizontal" />
```

- [ ] **Step 5: Adicionar AdBanner na página de capítulo**

Em `src/app/capitulo/[capitulo]/page.tsx`, adicionar import:

```tsx
import AdBanner from "@/components/AdBanner";
```

Antes do `return` final, verificar onde o componente `CapituloPage` é renderizado. Adicionar após o `<CapituloPage>` (ou dentro dele no rodapé se for mais adequado):

```tsx
<AdBanner slotId="SLOT_ID_HORIZONTAL" format="horizontal" />
```

- [ ] **Step 6: Adicionar AdBanner no TopicoGenerico (entre conteúdo e simulado)**

Em `src/components/TopicoGenerico.tsx`, adicionar import:

```tsx
import AdBanner from "@/components/AdBanner";
```

Dentro do bloco `if (etapa === "simulado")`, logo após `{renderNav()}` e antes do bloco de questões, adicionar:

```tsx
<AdBanner slotId="SLOT_ID_RECTANGLE" format="rectangle" />
```

- [ ] **Step 7: Adicionar AdBanner no perfil**

Em `src/app/perfil/page.tsx`, adicionar import:

```tsx
import AdBanner from "@/components/AdBanner";
```

Antes do botão de logout (ou no final do conteúdo principal):

```tsx
<AdBanner slotId="SLOT_ID_RECTANGLE" format="rectangle" />
```

- [ ] **Step 8: Adicionar variável de ambiente**

Em `.env.local`, adicionar (com o publisher ID real):

```
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXXX
```

Enquanto não tiver o ID aprovado, deixar comentado ou vazio — o componente retorna `null` sem `NEXT_PUBLIC_ADSENSE_ID`.

No Vercel (em produção), adicionar a mesma variável via `vercel env add NEXT_PUBLIC_ADSENSE_ID`.

- [ ] **Step 9: Verificar build**

```bash
npm run build
```

Esperado: zero erros. Se aparecer erro de TypeScript no `window.adsbygoogle`, verificar que o `declare global` está correto.

- [ ] **Step 10: Testar no dev**

```bash
npm run dev
```

Com `NEXT_PUBLIC_ADSENSE_ID` não configurado: os banners não aparecem (comportamento correto).

Com um publisher ID configurado (mesmo sem aprovação): as `<ins>` aparecem no DOM, mostrando espaço vazio onde os anúncios ficarão após aprovação.

- [ ] **Step 11: Commit**

```bash
git add src/components/AdBanner.tsx src/app/layout.tsx src/app/page.tsx src/app/dashboard/page.tsx src/app/capitulo/ src/components/TopicoGenerico.tsx src/app/perfil/page.tsx
git commit -m "feat: Google AdSense — componente AdBanner e placement nas páginas"
```

---

## Verificação final

- [ ] **Build limpo:** `npm run build` sem erros ou warnings TypeScript
- [ ] **XP no dashboard:** completar tópico com ≥65%, verificar XP atualizado no dashboard
- [ ] **Desbloqueio:** completar tópico com <65%, verificar que não avança no desbloqueio
- [ ] **Card LinkedIn:** completar todos os tópicos de um capítulo com ≥65%, modal aparece, imagem preview aparece, LinkedIn share abre
- [ ] **Conquista page:** acessar `/conquista/capitulo/1?xp=200&streak=5`, verificar OG image no `<head>`
- [ ] **AdSense:** com `NEXT_PUBLIC_ADSENSE_ID` definido, `<ins class="adsbygoogle">` aparece nas páginas corretas; `/simulado-final` não tem anúncios
