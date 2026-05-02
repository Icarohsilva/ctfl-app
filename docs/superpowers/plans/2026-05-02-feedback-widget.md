# Feedback Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar botão flutuante de feedback em todas as páginas (exceto simulado) com modal de 3 categorias (opinião, sugestão de certificação, bug), salvando no Supabase e enviando e-mail via Resend.

**Architecture:** `FeedbackWidget` é um client component com botão fixo + modal autocontido. Um API route `POST /api/feedback` recebe os dados, insere na tabela `feedbacks` (Supabase anon key) e dispara e-mail via Resend. O widget é adicionado ao `layout.tsx` para aparecer em todas as páginas.

**Tech Stack:** Next.js 16 App Router, React 19, Supabase JS (anon key), Resend (fetch nativo), TypeScript strict, inline styles dark theme.

---

## Pré-requisito: Criar tabela no Supabase

Execute o SQL abaixo no **Supabase Dashboard → SQL Editor** antes de fazer o deploy:

```sql
create table feedbacks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references profiles(id) on delete set null,
  tipo        text not null check (tipo in ('opiniao', 'certificacao', 'bug')),
  dados       jsonb not null,
  criado_em   timestamptz not null default now()
);

alter table feedbacks enable row level security;
create policy "feedback_insert" on feedbacks for insert with check (true);
```

---

## Task 1: API Route `POST /api/feedback`

**Files:**
- Create: `src/app/api/feedback/route.ts`

- [ ] **Criar o arquivo da API route**

Crie `src/app/api/feedback/route.ts` com o seguinte conteúdo:

```ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const TIPOS_VALIDOS = ["opiniao", "certificacao", "bug"] as const;
type Tipo = typeof TIPOS_VALIDOS[number];

const rotuloTipo: Record<Tipo, string> = {
  opiniao: "Opinião",
  certificacao: "Sugestão de Certificação",
  bug: "Bug Reportado",
};

export async function POST(req: NextRequest) {
  let body: { tipo: string; dados: Record<string, string | number> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { tipo, dados } = body;

  if (!TIPOS_VALIDOS.includes(tipo as Tipo) || !dados || typeof dados !== "object") {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  // Identificar usuário logado (opcional)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const authHeader = req.headers.get("authorization");
  let userId: string | null = null;
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    userId = user?.id ?? null;
  }

  // Inserir no Supabase
  const { error: dbError } = await supabase.from("feedbacks").insert({
    tipo,
    dados,
    user_id: userId,
  });

  if (dbError) {
    console.error("Erro ao salvar feedback:", dbError);
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  }

  // Enviar e-mail via Resend
  const linhasDados = Object.entries(dados)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#9ca3af;font-size:13px">${k}</td><td style="padding:6px 12px;color:#e5e7eb;font-size:13px">${v}</td></tr>`)
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/></head>
<body style="background:#0b0f1a;color:#e5e7eb;font-family:sans-serif;padding:32px">
  <h2 style="color:#d4af37;margin-bottom:8px">📬 Novo Feedback — TestPath</h2>
  <p style="color:#9ca3af;font-size:14px;margin-bottom:24px">
    Tipo: <strong style="color:#3b82f6">${rotuloTipo[tipo as Tipo]}</strong>
    ${userId ? ` · user_id: <code style="color:#6b7280">${userId}</code>` : ""}
  </p>
  <table style="border-collapse:collapse;width:100%;background:#111827;border-radius:8px">
    <tbody>${linhasDados}</tbody>
  </table>
  <p style="color:#374151;font-size:12px;margin-top:24px">
    ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
  </p>
</body>
</html>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "TestPath <noreply@testpath.online>",
      to: "icaro.silva@eteg.com.br",
      subject: `[TestPath Feedback] ${rotuloTipo[tipo as Tipo]} — ${new Date().toLocaleDateString("pt-BR")}`,
      html,
    }),
  }).catch(err => console.error("Erro ao enviar e-mail:", err));

  return NextResponse.json({ ok: true });
}
```

- [ ] **Verificar build**

```bash
npm run build
```

Esperado: sem erros TypeScript. A rota deve aparecer como `ƒ /api/feedback` na lista de rotas.

- [ ] **Commit**

```bash
git add src/app/api/feedback/route.ts
git commit -m "feat: API route POST /api/feedback — Supabase + e-mail Resend"
```

---

## Task 2: Componente `FeedbackWidget`

**Files:**
- Create: `src/components/FeedbackWidget.tsx`

- [ ] **Criar o componente**

Crie `src/components/FeedbackWidget.tsx`:

```tsx
"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Tipo = "opiniao" | "certificacao" | "bug";

const categorias: { tipo: Tipo; icone: string; label: string }[] = [
  { tipo: "opiniao",       icone: "💬", label: "Opinião"              },
  { tipo: "certificacao",  icone: "🎓", label: "Sugerir certificação" },
  { tipo: "bug",           icone: "🐛", label: "Reportar bug"         },
];

const locaisBug = ["Dashboard", "Trilha/Tópico", "Simulado", "Perfil", "Outro"];

export default function FeedbackWidget() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const [tipo, setTipo] = useState<Tipo | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [hover, setHover] = useState(false);

  // Formulário opinião
  const [estrelas, setEstrelas] = useState(0);
  const [mensagem, setMensagem] = useState("");

  // Formulário certificação
  const [nomeCert, setNomeCert] = useState("");
  const [orgCert, setOrgCert] = useState("");
  const [motivoCert, setMotivoCert] = useState("");

  // Formulário bug
  const [localBug, setLocalBug] = useState("");
  const [descBug, setDescBug] = useState("");
  const [urlBug, setUrlBug] = useState("");

  if (pathname === "/simulado-final") return null;

  const resetar = () => {
    setTipo(null);
    setEstrelas(0); setMensagem("");
    setNomeCert(""); setOrgCert(""); setMotivoCert("");
    setLocalBug(""); setDescBug(""); setUrlBug("");
    setSucesso(false);
  };

  const fechar = () => { setAberto(false); resetar(); };

  const podeSalvar = () => {
    if (!tipo) return false;
    if (tipo === "opiniao") return estrelas > 0 && mensagem.length >= 10;
    if (tipo === "certificacao") return nomeCert.trim() !== "" && orgCert.trim() !== "" && motivoCert.length >= 10;
    if (tipo === "bug") return localBug !== "" && descBug.length >= 10;
    return false;
  };

  const enviar = async () => {
    if (!tipo || !podeSalvar()) return;
    setEnviando(true);

    let dados: Record<string, string | number> = {};
    if (tipo === "opiniao")      dados = { avaliacao: estrelas, mensagem };
    if (tipo === "certificacao") dados = { nome: nomeCert, organizacao: orgCert, motivo: motivoCert };
    if (tipo === "bug")          dados = { local: localBug, descricao: descBug, ...(urlBug ? { url: urlBug } : {}) };

    // Tentar obter token do usuário logado
    const { data: { session } } = await supabase.auth.getSession();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (session?.access_token) headers["Authorization"] = `Bearer ${session.access_token}`;

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers,
        body: JSON.stringify({ tipo, dados }),
      });
      if (res.ok) {
        setSucesso(true);
        setTimeout(() => fechar(), 2000);
      }
    } finally {
      setEnviando(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#0b0f1a", border: "1px solid #374151",
    borderRadius: "8px", padding: "9px 12px", color: "#e5e7eb",
    fontSize: "14px", outline: "none", boxSizing: "border-box",
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setAberto(true)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: "fixed", bottom: "24px", right: "24px", zIndex: 999,
          display: "flex", alignItems: "center", gap: "6px",
          background: "#1f2937",
          border: `1px solid ${hover ? "#3b82f6" : "#374151"}`,
          borderRadius: "99px", padding: "10px 16px",
          color: hover ? "#3b82f6" : "#9ca3af",
          fontSize: "14px", cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          transition: "border-color 0.15s, color 0.15s",
        }}
      >
        <span>💬</span>
        <span>Feedback</span>
      </button>

      {/* Overlay + Modal */}
      {aberto && (
        <div
          onClick={fechar}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: "1rem",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#111827", border: "1px solid #1f2937",
              borderRadius: "16px", padding: "1.75rem",
              width: "100%", maxWidth: "480px",
              maxHeight: "90vh", overflowY: "auto",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal" }}>
                Enviar feedback
              </h2>
              <button onClick={fechar} style={{ background: "none", border: "none", color: "#6b7280", fontSize: "18px", cursor: "pointer", lineHeight: 1 }}>✕</button>
            </div>

            {sucesso ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✅</div>
                <p style={{ color: "#22c55e", fontSize: "15px", margin: 0 }}>Feedback enviado! Obrigado.</p>
              </div>
            ) : (
              <>
                {/* Seleção de categoria */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "1.25rem" }}>
                  {categorias.map(c => (
                    <button
                      key={c.tipo}
                      onClick={() => setTipo(c.tipo)}
                      style={{
                        flex: 1, padding: "10px 6px", borderRadius: "10px", cursor: "pointer",
                        background: tipo === c.tipo ? "rgba(59,130,246,0.1)" : "#0b0f1a",
                        border: `1px solid ${tipo === c.tipo ? "#3b82f6" : "#374151"}`,
                        color: tipo === c.tipo ? "#3b82f6" : "#9ca3af",
                        fontSize: "12px", display: "flex", flexDirection: "column",
                        alignItems: "center", gap: "4px", transition: "all 0.15s",
                      }}
                    >
                      <span style={{ fontSize: "1.25rem" }}>{c.icone}</span>
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>

                {/* Formulário opinião */}
                {tipo === "opiniao" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "6px" }}>Avaliação *</label>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <button key={n} onClick={() => setEstrelas(n)}
                            style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", padding: "2px", lineHeight: 1 }}>
                            {n <= estrelas ? "★" : "☆"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "6px" }}>O que você acha do TestPath? *</label>
                      <textarea value={mensagem} onChange={e => setMensagem(e.target.value)}
                        placeholder="Mínimo 10 caracteres..."
                        style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }} />
                    </div>
                  </div>
                )}

                {/* Formulário certificação */}
                {tipo === "certificacao" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "6px" }}>Nome da certificação *</label>
                      <input value={nomeCert} onChange={e => setNomeCert(e.target.value)}
                        placeholder="Ex: CTAL-TA, PMP, IREB CPRE" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "6px" }}>Organização / banca *</label>
                      <input value={orgCert} onChange={e => setOrgCert(e.target.value)}
                        placeholder="Ex: ISTQB, PMI, IREB" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "6px" }}>Por que seria útil? *</label>
                      <textarea value={motivoCert} onChange={e => setMotivoCert(e.target.value)}
                        placeholder="Mínimo 10 caracteres..."
                        style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
                    </div>
                  </div>
                )}

                {/* Formulário bug */}
                {tipo === "bug" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "6px" }}>Onde aconteceu? *</label>
                      <select value={localBug} onChange={e => setLocalBug(e.target.value)}
                        style={{ ...inputStyle, appearance: "auto" }}>
                        <option value="">Selecione...</option>
                        {locaisBug.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "6px" }}>O que aconteceu? *</label>
                      <textarea value={descBug} onChange={e => setDescBug(e.target.value)}
                        placeholder="Mínimo 10 caracteres..."
                        style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginBottom: "6px" }}>URL ou tela (opcional)</label>
                      <input value={urlBug} onChange={e => setUrlBug(e.target.value)}
                        placeholder="Ex: /capitulo/1/topico/niveis-teste" style={inputStyle} />
                    </div>
                  </div>
                )}

                {/* Botão enviar */}
                {tipo && (
                  <button
                    onClick={enviar}
                    disabled={!podeSalvar() || enviando}
                    style={{
                      width: "100%", marginTop: "1.25rem",
                      background: podeSalvar() && !enviando ? "#3b82f6" : "#1f2937",
                      border: "none", borderRadius: "10px",
                      padding: "12px", color: podeSalvar() && !enviando ? "#fff" : "#4b5563",
                      fontSize: "14px", fontWeight: "bold",
                      cursor: podeSalvar() && !enviando ? "pointer" : "not-allowed",
                      transition: "background 0.15s",
                    }}
                  >
                    {enviando ? "Enviando..." : "Enviar feedback"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Verificar build**

```bash
npm run build
```

Esperado: sem erros TypeScript.

- [ ] **Commit**

```bash
git add src/components/FeedbackWidget.tsx
git commit -m "feat: componente FeedbackWidget — botão flutuante + modal 3 categorias"
```

---

## Task 3: Adicionar widget ao layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Importar e inserir o FeedbackWidget**

Em `src/app/layout.tsx`, adicionar o import:

```tsx
import FeedbackWidget from "../components/FeedbackWidget";
```

E inserir `<FeedbackWidget />` dentro do `<body>`, logo antes do `</body>` (após PWAInstaller e Script do AdSense):

```tsx
<body className="min-h-full flex flex-col">
  {children}
  <BFCacheReload />
  <PWAInstaller />
  {process.env.NEXT_PUBLIC_ADSENSE_ID && (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )}
  <FeedbackWidget />
</body>
```

- [ ] **Verificar build**

```bash
npm run build
```

Esperado: sem erros. Todas as rotas estáticas e dinâmicas devem aparecer normalmente.

- [ ] **Testar manualmente**

1. `npm run dev`
2. Abrir `http://localhost:3000` — botão "💬 Feedback" deve aparecer no canto inferior direito
3. Clicar → modal abre
4. Selecionar cada categoria e preencher campos — botão "Enviar feedback" deve ficar ativo somente com campos obrigatórios preenchidos
5. Abrir `http://localhost:3000/simulado-final` — botão **não** deve aparecer
6. Enviar um feedback real e verificar no Supabase (`select * from feedbacks`) e no e-mail

- [ ] **Commit e push**

```bash
git add src/app/layout.tsx
git commit -m "feat: FeedbackWidget no layout — botão flutuante em todas as páginas"
git push origin main
```
