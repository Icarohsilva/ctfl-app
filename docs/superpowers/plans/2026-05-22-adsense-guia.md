# Guia Público + Correção AdSense — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar seção pública `/guia` com 17 artigos educacionais (CTFL, Playwright, English for QA) com vídeos embutidos e mini-quiz, e corrigir `AdBanner` em páginas autenticadas para resolver rejeição do Google AdSense.

**Architecture:** Artigos são Server Components SSG com dados em `src/data/guia/*.ts`. Componentes interativos (quiz, vídeo, navegação) são Client Components separados. AdBanner nas páginas existentes recebe guard `userId &&` para evitar exibição para usuários não autenticados.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Tailwind v4, inline styles dark theme (#0b0f1a bg, #c9a84c gold), AdBanner existente em `src/components/AdBanner.tsx`, videoUrls em `src/data/video-urls.ts`.

---

## Task 1: Tipos compartilhados e metadados do índice

**Files:**
- Create: `src/data/guia/types.ts`
- Create: `src/data/guia/index.ts`

- [ ] **Step 1: Criar `src/data/guia/types.ts`**

```ts
export type SecaoArtigo = {
  titulo: string;
  conteudo: string; // HTML estático renderizado via dangerouslySetInnerHTML
  videoId?: string; // chave de src/data/video-urls.ts
};

export type QuizPergunta = {
  pergunta: string;
  opcoes: [string, string, string, string];
  correta: 0 | 1 | 2 | 3;
  explicacao: string;
};

export type ArtigoGuia = {
  slug: string;
  titulo: string;
  descricao: string;
  secao: "ctfl" | "playwright" | "ingles";
  tempoLeitura: number;
  nivel: "iniciante" | "intermediário" | "avançado";
  secoes: SecaoArtigo[];
  quiz: QuizPergunta[];
};

export type ArtigoMeta = Pick<
  ArtigoGuia,
  "slug" | "titulo" | "descricao" | "secao" | "tempoLeitura" | "nivel"
>;
```

- [ ] **Step 2: Criar `src/data/guia/index.ts`**

```ts
import type { ArtigoMeta } from "./types";

export const artigos: ArtigoMeta[] = [
  // CTFL
  { slug: "o-que-e-ctfl", titulo: "O que é o CTFL v4.0: guia completo", descricao: "Entenda o que é o exame CTFL v4.0 do ISTQB, como funciona, quem deve fazer e o que esperar no dia da prova.", secao: "ctfl", tempoLeitura: 8, nivel: "iniciante" },
  { slug: "como-se-preparar-ctfl", titulo: "Como se preparar para o CTFL: passo a passo", descricao: "Plano de estudo detalhado para o CTFL v4.0: cronograma, recursos recomendados, dicas de simulado e estratégias para a prova.", secao: "ctfl", tempoLeitura: 10, nivel: "iniciante" },
  { slug: "fundamentos-de-teste", titulo: "Fundamentos de Teste de Software (Cap. 1 CTFL)", descricao: "Os 7 princípios do teste, conceitos de erro, defeito e falha, atividades e papéis no processo de teste.", secao: "ctfl", tempoLeitura: 12, nivel: "iniciante" },
  { slug: "teste-no-ciclo-de-vida", titulo: "Teste no Ciclo de Vida de Software (Cap. 2 CTFL)", descricao: "Modelos de desenvolvimento, níveis de teste (unitário, integração, sistema, aceite) e tipos de teste.", secao: "ctfl", tempoLeitura: 12, nivel: "iniciante" },
  { slug: "teste-estatico", titulo: "Teste Estático (Cap. 3 CTFL)", descricao: "Revisões de código, análise estática, benefícios do teste estático e como aplicar em projetos reais.", secao: "ctfl", tempoLeitura: 9, nivel: "intermediário" },
  { slug: "analise-e-modelagem-de-teste", titulo: "Análise e Modelagem de Teste (Cap. 4 CTFL)", descricao: "Técnicas caixa-preta (partição de equivalência, valor-limite, tabela de decisão, transição de estado) e caixa-branca.", secao: "ctfl", tempoLeitura: 14, nivel: "intermediário" },
  { slug: "gerenciamento-de-atividades-de-teste", titulo: "Gerenciamento de Atividades de Teste (Cap. 5 CTFL)", descricao: "Planejamento, estimativa, monitoramento, controle de teste, gestão de riscos e defeitos.", secao: "ctfl", tempoLeitura: 11, nivel: "intermediário" },
  { slug: "ferramentas-de-suporte-ao-teste", titulo: "Ferramentas de Suporte ao Teste (Cap. 6 CTFL)", descricao: "Categorias de ferramentas de teste, automação, como selecionar e implementar ferramentas em projetos.", secao: "ctfl", tempoLeitura: 9, nivel: "intermediário" },
  { slug: "glossario-ctfl", titulo: "Glossário CTFL v4.0: 50+ termos essenciais", descricao: "Definições de todos os termos-chave do syllabus CTFL v4.0 do ISTQB, com exemplos práticos.", secao: "ctfl", tempoLeitura: 15, nivel: "iniciante" },
  // Playwright
  { slug: "o-que-e-playwright", titulo: "O que é Playwright: automação moderna de testes web", descricao: "Introdução ao Playwright, comparação com Selenium e Cypress, casos de uso e por que aprender em 2025.", secao: "playwright", tempoLeitura: 8, nivel: "iniciante" },
  { slug: "playwright-para-iniciantes", titulo: "Playwright para iniciantes: primeiros passos", descricao: "Como instalar o Playwright, escrever o primeiro teste, executar e interpretar resultados.", secao: "playwright", tempoLeitura: 10, nivel: "iniciante" },
  { slug: "locators-e-page-object-model", titulo: "Locators, assertivas e Page Object Model no Playwright", descricao: "Como usar locators robustos, escrever assertivas eficientes e organizar testes com o padrão POM.", secao: "playwright", tempoLeitura: 12, nivel: "intermediário" },
  { slug: "playwright-em-ci-cd", titulo: "Playwright em CI/CD: boas práticas e relatórios", descricao: "Integrar Playwright em GitHub Actions, gerar relatórios HTML, depurar falhas e escalar a suíte de testes.", secao: "playwright", tempoLeitura: 11, nivel: "intermediário" },
  // English for QA
  { slug: "ingles-para-qa", titulo: "Inglês para QA: por que é essencial e como começar", descricao: "Por que o inglês é indispensável na carreira de QA, vocabulário básico e como desenvolver o idioma do zero.", secao: "ingles", tempoLeitura: 8, nivel: "iniciante" },
  { slug: "vocabulario-tecnico-qa-ingles", titulo: "Vocabulário técnico de QA em inglês: bug reports e terminologia", descricao: "Os termos técnicos de teste mais usados em inglês: como escrever bug reports, user stories e documentação.", secao: "ingles", tempoLeitura: 10, nivel: "iniciante" },
  { slug: "comunicacao-qa-ingles", titulo: "Comunicação em inglês para QA: dailies, reviews e retrospectivas", descricao: "Frases e expressões para participar de reuniões ágeis em inglês como QA: daily, planning, review e retro.", secao: "ingles", tempoLeitura: 10, nivel: "intermediário" },
  { slug: "entrevista-tecnica-qa-ingles", titulo: "Preparação para entrevistas técnicas de QA em inglês", descricao: "As perguntas mais comuns em entrevistas de QA em inglês, como responder e vocabulário específico para cada tema.", secao: "ingles", tempoLeitura: 12, nivel: "intermediário" },
];

export const artigosPorSecao = {
  ctfl: artigos.filter(a => a.secao === "ctfl"),
  playwright: artigos.filter(a => a.secao === "playwright"),
  ingles: artigos.filter(a => a.secao === "ingles"),
};
```

- [ ] **Step 3: Verificar build**

```bash
npm run build 2>&1 | tail -20
```
Esperado: sem erros de tipo nos novos arquivos.

- [ ] **Step 4: Commit**

```bash
git add src/data/guia/types.ts src/data/guia/index.ts
git commit -m "feat: tipos e metadados do índice do /guia"
```

---

## Task 2: Componentes reutilizáveis do /guia

**Files:**
- Create: `src/components/guia/VideoEmbed.tsx`
- Create: `src/components/guia/QuizArtigo.tsx`
- Create: `src/components/guia/NavArtigo.tsx`

- [ ] **Step 1: Criar `src/components/guia/VideoEmbed.tsx`**

```tsx
"use client";

type Props = {
  videoId: string;
  titulo?: string;
};

export default function VideoEmbed({ videoId, titulo }: Props) {
  const videoUrls: Record<string, string> = {
    "por-que-testar": "https://www.youtube.com/embed/GWs-BjMtcVc",
    "7-principios": "https://www.youtube.com/embed/kBh2rMH59Lg",
    "erro-defeito-falha": "https://www.youtube.com/embed/ZB9RqaBbFN0",
    "atividades-e-papeis": "https://www.youtube.com/embed/uAt3mfEl8Rk",
    "modelos-desenvolvimento": "https://www.youtube.com/embed/rYri_0c71pg",
    "niveis-teste": "https://www.youtube.com/embed/SpXcEsMIaPQ",
    "tipos-teste": "https://www.youtube.com/embed/q-_YLvAM_zE",
    "teste-manutencao": "https://www.youtube.com/embed/J1G6RZ6MNAQ",
    "fundamentos-estatico": "https://www.youtube.com/embed/tBs0-_-s_Es",
    "processo-revisao": "https://www.youtube.com/embed/D_qqizvvPJA",
    "analise-estatica": "https://www.youtube.com/embed/M_G8k7UHyGY",
    "particao-equivalencia": "https://www.youtube.com/embed/3ZQQ6IOfNUU",
    "analise-valor-limite": "https://www.youtube.com/embed/sHS6DI5DSZM",
    "tabela-decisao": "https://www.youtube.com/embed/1M6zmV5LdZc",
    "transicao-estado": "https://www.youtube.com/embed/raJYY1YJolM",
    "caixa-branca": "https://www.youtube.com/embed/PIi9LOtwLPc",
    "baseado-experiencia": "https://www.youtube.com/embed/n1j7kqSrulI",
    "planejamento-teste": "https://www.youtube.com/embed/7SJ5NYkUMOE",
    "monitoramento-controle": "https://www.youtube.com/embed/1sphwbuzI7c",
    "gestao-risco": "https://www.youtube.com/embed/v_ZULMqqbp4",
    "gestao-defeitos": "https://www.youtube.com/embed/cN2_RL0MqOA",
    "ferramentas-suporte": "https://www.youtube.com/embed/Re82WN3vi4w",
    "automacao-teste": "https://www.youtube.com/embed/FzbbO4mytxA",
    "selecao-ferramenta": "https://www.youtube.com/embed/1WbPYUYIky0",
  };

  const src = videoUrls[videoId];
  if (!src) return null;

  return (
    <div style={{ margin: "1.5rem 0" }}>
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "12px", overflow: "hidden", border: "1px solid #1f2937" }}>
        <iframe
          src={src}
          title={titulo || videoId}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
        />
      </div>
      {titulo && (
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "8px", textAlign: "center" }}>
          🎬 {titulo}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Criar `src/components/guia/QuizArtigo.tsx`**

```tsx
"use client";
import { useState } from "react";
import type { QuizPergunta } from "@/data/guia/types";

type Props = {
  perguntas: QuizPergunta[];
  slugArtigo: string;
};

export default function QuizArtigo({ perguntas, slugArtigo }: Props) {
  const [atual, setAtual] = useState(0);
  const [selecionada, setSelecionada] = useState<number | null>(null);
  const [confirmada, setConfirmada] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const pergunta = perguntas[atual];

  const confirmar = () => {
    if (selecionada === null) return;
    setConfirmada(true);
    if (selecionada === pergunta.correta) setAcertos(a => a + 1);
  };

  const avancar = () => {
    if (atual + 1 >= perguntas.length) {
      setFinalizado(true);
    } else {
      setAtual(a => a + 1);
      setSelecionada(null);
      setConfirmada(false);
    }
  };

  if (finalizado) {
    const pct = Math.round((acertos / perguntas.length) * 100);
    return (
      <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          {pct >= 80 ? "🏆" : pct >= 60 ? "📚" : "💪"}
        </div>
        <h3 style={{ fontSize: "1.3rem", color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "0.5rem" }}>
          {acertos} de {perguntas.length} corretas ({pct}%)
        </h3>
        <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "1.5rem" }}>
          {pct >= 80 ? "Excelente! Você domina esse conteúdo." : pct >= 60 ? "Bom resultado! Revise os pontos que errou." : "Continue estudando — você vai chegar lá!"}
        </p>
        <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem" }}>
          <p style={{ color: "#e5e7eb", fontSize: "14px", marginBottom: "0.75rem", fontWeight: 600 }}>
            Quer mais questões sobre esse tópico?
          </p>
          <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "1rem" }}>
            Na plataforma você tem simulados completos com IA, fila de revisão adaptativa e progresso salvo.
          </p>
          <a href="/cadastro" style={{ display: "inline-block", background: "#3b82f6", color: "#fff", padding: "10px 24px", borderRadius: "8px", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}>
            Criar conta grátis →
          </a>
        </div>
        <button onClick={() => { setAtual(0); setSelecionada(null); setConfirmada(false); setAcertos(0); setFinalizado(false); }}
          style={{ background: "transparent", border: "1px solid #374151", borderRadius: "8px", padding: "8px 20px", color: "#9ca3af", fontSize: "13px", cursor: "pointer" }}>
          Refazer quiz
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "1.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <span style={{ fontSize: "12px", color: "#6b7280", letterSpacing: "0.05em" }}>MINI-QUIZ</span>
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>{atual + 1} / {perguntas.length}</span>
      </div>
      <p style={{ color: "#e5e7eb", fontSize: "15px", lineHeight: 1.6, marginBottom: "1.25rem", fontWeight: 500 }}>
        {pergunta.pergunta}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1rem" }}>
        {pergunta.opcoes.map((opcao, i) => {
          let bg = "#0b0f1a";
          let border = "#374151";
          let color = "#9ca3af";
          if (selecionada === i && !confirmada) { bg = "rgba(59,130,246,0.08)"; border = "#3b82f6"; color = "#3b82f6"; }
          if (confirmada && i === pergunta.correta) { bg = "rgba(16,185,129,0.08)"; border = "#10b981"; color = "#10b981"; }
          if (confirmada && selecionada === i && i !== pergunta.correta) { bg = "rgba(239,68,68,0.08)"; border = "#ef4444"; color = "#ef4444"; }
          return (
            <button key={i} onClick={() => !confirmada && setSelecionada(i)}
              style={{ background: bg, border: `1px solid ${border}`, borderRadius: "8px", padding: "10px 14px", color, fontSize: "14px", cursor: confirmada ? "default" : "pointer", textAlign: "left", transition: "all 0.15s" }}>
              {opcao}
            </button>
          );
        })}
      </div>
      {confirmada && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1f2937", borderRadius: "8px", padding: "12px", marginBottom: "1rem" }}>
          <p style={{ fontSize: "13px", color: "#9ca3af", lineHeight: 1.6, margin: 0 }}>
            💡 {pergunta.explicacao}
          </p>
        </div>
      )}
      {!confirmada ? (
        <button onClick={confirmar} disabled={selecionada === null}
          style={{ background: selecionada !== null ? "#3b82f6" : "#1f2937", border: "none", borderRadius: "8px", padding: "10px 24px", color: selecionada !== null ? "#fff" : "#6b7280", fontSize: "14px", fontWeight: 600, cursor: selecionada !== null ? "pointer" : "not-allowed", transition: "all 0.15s" }}>
          Confirmar
        </button>
      ) : (
        <button onClick={avancar}
          style={{ background: "#3b82f6", border: "none", borderRadius: "8px", padding: "10px 24px", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
          {atual + 1 >= perguntas.length ? "Ver resultado" : "Próxima pergunta →"}
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Criar `src/components/guia/NavArtigo.tsx`**

```tsx
import type { ArtigoMeta } from "@/data/guia/types";

type Props = {
  anterior: ArtigoMeta | null;
  proximo: ArtigoMeta | null;
};

export default function NavArtigo({ anterior, proximo }: Props) {
  return (
    <div style={{ display: "flex", gap: "1rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
      {anterior ? (
        <a href={`/guia/${anterior.slug}`} style={{ flex: 1, minWidth: "200px", background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "1rem 1.25rem", textDecoration: "none", transition: "border-color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "#374151")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#1f2937")}>
          <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px" }}>← ANTERIOR</div>
          <div style={{ fontSize: "14px", color: "#e5e7eb", fontWeight: 500, lineHeight: 1.4 }}>{anterior.titulo}</div>
        </a>
      ) : <div style={{ flex: 1 }} />}
      {proximo ? (
        <a href={`/guia/${proximo.slug}`} style={{ flex: 1, minWidth: "200px", background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "1rem 1.25rem", textDecoration: "none", textAlign: "right", transition: "border-color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "#374151")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#1f2937")}>
          <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px" }}>PRÓXIMO →</div>
          <div style={{ fontSize: "14px", color: "#e5e7eb", fontWeight: 500, lineHeight: 1.4 }}>{proximo.titulo}</div>
        </a>
      ) : <div style={{ flex: 1 }} />}
    </div>
  );
}
```

- [ ] **Step 4: Verificar build**

```bash
npm run build 2>&1 | tail -20
```
Esperado: sem erros de tipo nos 3 novos componentes.

- [ ] **Step 5: Commit**

```bash
git add src/components/guia/
git commit -m "feat: componentes VideoEmbed, QuizArtigo e NavArtigo para o /guia"
```

---

## Task 3: Artigos CTFL — Introdução (o-que-e-ctfl, como-se-preparar-ctfl)

**Files:**
- Create: `src/data/guia/o-que-e-ctfl.ts`
- Create: `src/data/guia/como-se-preparar-ctfl.ts`

- [ ] **Step 1: Criar `src/data/guia/o-que-e-ctfl.ts`**

```ts
import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "o-que-e-ctfl",
  titulo: "O que é o CTFL v4.0: guia completo",
  descricao: "Entenda o que é o exame CTFL v4.0 do ISTQB, como funciona, quem deve fazer e o que esperar no dia da prova.",
  secao: "ctfl",
  tempoLeitura: 8,
  nivel: "iniciante",
  secoes: [
    {
      titulo: "O que é o CTFL?",
      conteudo: `<p>O <strong>CTFL (Certified Tester Foundation Level)</strong> é a certificação de entrada do <strong>ISTQB® (International Software Testing Qualifications Board)</strong>, o maior programa de certificação em teste de software do mundo. Com mais de 1,3 milhão de certificados emitidos em mais de 120 países, o CTFL é o ponto de partida padrão para qualquer profissional que queira construir uma carreira sólida em Quality Assurance.</p>
<p>A versão atual é o <strong>CTFL v4.0</strong>, lançada em 2023, com foco em práticas modernas de desenvolvimento ágil, DevOps e entrega contínua. O syllabus foi atualizado para refletir como as equipes de software trabalham hoje, sem abandonar os fundamentos clássicos do teste.</p>
<p>No Brasil, a certificação é aplicada pelo <strong>BSTQB (Brazilian Software Testing Qualifications Board)</strong>, e a prova pode ser feita em português ou inglês.</p>`,
    },
    {
      titulo: "Por que fazer o CTFL?",
      conteudo: `<p>A certificação CTFL abre portas de formas concretas:</p>
<ul>
<li><strong>Reconhecimento internacional:</strong> o certificado é aceito em empresas de tecnologia no mundo inteiro, incluindo multinacionais que contratam QAs no Brasil.</li>
<li><strong>Linguagem comum:</strong> o CTFL padroniza terminologia — quando você diz "defeito", "falha" ou "caso de teste", todos na equipe entendem o mesmo conceito.</li>
<li><strong>Progressão na carreira:</strong> é pré-requisito para certificações avançadas do ISTQB, como CTAL-TA (Test Analyst) e CTAL-TM (Test Manager).</li>
<li><strong>Diferencial salarial:</strong> profissionais certificados tendem a ser mais valorizados em processos seletivos, especialmente em empresas com práticas maduras de QA.</li>
</ul>
<p>Mesmo para quem já trabalha com testes há anos, o CTFL é valioso por organizar e formalizar o conhecimento adquirido na prática.</p>`,
    },
    {
      titulo: "Estrutura do exame",
      conteudo: `<p>O exame CTFL v4.0 tem o seguinte formato:</p>
<ul>
<li><strong>40 questões</strong> de múltipla escolha (4 alternativas, apenas uma correta)</li>
<li><strong>60 minutos</strong> de duração (75 minutos para candidatos em língua não nativa)</li>
<li><strong>Nota mínima para aprovação: 65%</strong> — ou seja, 26 questões corretas de 40</li>
<li>Prova <strong>fechada</strong> — sem consulta a materiais</li>
</ul>
<p>As questões seguem uma distribuição por capítulo do syllabus. O Capítulo 4 (Análise e Modelagem de Teste) tem o maior peso, com 11 questões. Conhecer essa distribuição ajuda a priorizar os estudos.</p>
<p>A distribuição oficial por capítulo é: Cap. 1 — 8 questões, Cap. 2 — 6 questões, Cap. 3 — 4 questões, Cap. 4 — 11 questões, Cap. 5 — 9 questões, Cap. 6 — 2 questões.</p>`,
    },
    {
      titulo: "Quem pode fazer o CTFL?",
      conteudo: `<p>Não há pré-requisito formal para fazer o CTFL v4.0. Qualquer pessoa pode se inscrever, independentemente de formação acadêmica ou tempo de experiência em TI.</p>
<p>Na prática, o exame é mais aproveitado por:</p>
<ul>
<li>Analistas e testadores de software que querem formalizar o conhecimento</li>
<li>Desenvolvedores que querem entender melhor o processo de qualidade</li>
<li>Gerentes de projeto e Scrum Masters que trabalham com equipes de QA</li>
<li>Estudantes de TI que querem se diferenciar no mercado</li>
<li>Profissionais em transição de carreira para a área de QA</li>
</ul>
<p>O nível Foundation é projetado para ser acessível a iniciantes, mas exige estudo sério — especialmente para quem não tem experiência prática com teste de software.</p>`,
    },
    {
      titulo: "Como se inscrever e onde fazer a prova",
      conteudo: `<p>No Brasil, a inscrição é feita diretamente no site do <strong>BSTQB (bstqb.org.br)</strong>. A prova pode ser feita de duas formas:</p>
<ul>
<li><strong>Presencial:</strong> em centros de teste autorizados (como Pearson VUE) em várias cidades brasileiras</li>
<li><strong>Online com supervisão (proctored):</strong> direto do seu computador, com câmera e monitoramento em tempo real</li>
</ul>
<p>O valor do exame varia, mas gira em torno de R$ 600 a R$ 800. Após a aprovação, o certificado é emitido digitalmente pelo ISTQB e fica disponível para verificação no site oficial.</p>
<p>O certificado não tem validade — uma vez aprovado, você é certificado para sempre. Porém, o ISTQB lança novas versões do syllabus periodicamente, e manter-se atualizado é uma boa prática profissional.</p>`,
    },
  ],
  quiz: [
    {
      pergunta: "Quantas questões compõem o exame CTFL v4.0?",
      opcoes: ["30 questões", "40 questões", "50 questões", "60 questões"],
      correta: 1,
      explicacao: "O exame CTFL v4.0 tem exatamente 40 questões de múltipla escolha, com nota mínima de aprovação de 65% (26 questões corretas).",
    },
    {
      pergunta: "Qual é a nota mínima para aprovação no exame CTFL v4.0?",
      opcoes: ["50%", "60%", "65%", "70%"],
      correta: 2,
      explicacao: "A nota mínima para aprovação é 65%, o que equivale a 26 questões corretas de 40.",
    },
    {
      pergunta: "Qual capítulo do CTFL v4.0 possui o maior número de questões no exame?",
      opcoes: ["Capítulo 1 — Fundamentos", "Capítulo 2 — Ciclo de Vida", "Capítulo 4 — Análise e Modelagem", "Capítulo 5 — Gerenciamento"],
      correta: 2,
      explicacao: "O Capítulo 4 (Análise e Modelagem de Teste) tem 11 questões, o maior peso de todos os capítulos no exame.",
    },
    {
      pergunta: "Qual organização é responsável pela certificação CTFL no Brasil?",
      opcoes: ["ISTQB", "BSTQB", "ABNT", "PMI"],
      correta: 1,
      explicacao: "O BSTQB (Brazilian Software Testing Qualifications Board) é o representante oficial do ISTQB no Brasil e aplica as certificações da linha ISTQB no país.",
    },
    {
      pergunta: "O certificado CTFL possui validade por quantos anos?",
      opcoes: ["2 anos", "5 anos", "10 anos", "Não tem validade"],
      correta: 3,
      explicacao: "O certificado CTFL não tem prazo de validade. Uma vez aprovado, o profissional é certificado permanentemente.",
    },
  ],
};
```

- [ ] **Step 2: Criar `src/data/guia/como-se-preparar-ctfl.ts`**

```ts
import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "como-se-preparar-ctfl",
  titulo: "Como se preparar para o CTFL: passo a passo",
  descricao: "Plano de estudo detalhado para o CTFL v4.0: cronograma, recursos recomendados, dicas de simulado e estratégias para a prova.",
  secao: "ctfl",
  tempoLeitura: 10,
  nivel: "iniciante",
  secoes: [
    {
      titulo: "Quanto tempo você precisa para se preparar?",
      conteudo: `<p>O tempo de preparação varia muito com o seu nível de experiência em teste de software:</p>
<ul>
<li><strong>Iniciante (sem experiência em QA):</strong> 8 a 12 semanas estudando 1 hora por dia</li>
<li><strong>Com experiência prática em testes:</strong> 4 a 6 semanas estudando 45 minutos por dia</li>
<li><strong>QA sênior ou líder de qualidade:</strong> 2 a 3 semanas de revisão focada</li>
</ul>
<p>A honestidade sobre o próprio nível é crucial. Subestimar o exame é um erro comum — o CTFL cobra conceitos específicos com terminologia precisa, e saber testar na prática não substitui conhecer o vocabulário formal do ISTQB.</p>`,
    },
    {
      titulo: "O material de estudo oficial",
      conteudo: `<p>O ponto de partida é o <strong>syllabus oficial do CTFL v4.0</strong>, disponível gratuitamente no site do ISTQB (istqb.org). Esse documento define exatamente o que cai no exame. Não há justificativa para não lê-lo — é o gabarito do que você precisa saber.</p>
<p>Além do syllabus, os recursos mais recomendados pela comunidade de QA são:</p>
<ul>
<li><strong>Livro "Foundations of Software Testing"</strong> (Black, Veenendaal, Graham) — baseado no syllabus, bom para aprofundar conceitos</li>
<li><strong>Simulados do BSTQB e ISTQB</strong> — disponíveis nos sites oficiais gratuitamente</li>
<li><strong>Plataformas de simulado com IA</strong> — como o TestPath, que gera questões únicas por sessão e explica cada resposta</li>
<li><strong>Vídeos explicativos no YouTube</strong> — busque pelo nome de cada tópico do syllabus</li>
</ul>`,
    },
    {
      titulo: "Plano de estudo semana a semana",
      conteudo: `<p>Abaixo, um plano de 8 semanas para iniciantes:</p>
<ul>
<li><strong>Semana 1:</strong> Capítulo 1 — Fundamentos de Teste (por que testar, princípios, processo)</li>
<li><strong>Semana 2:</strong> Capítulo 2 — Teste no Ciclo de Vida (modelos de desenvolvimento, níveis, tipos)</li>
<li><strong>Semana 3:</strong> Capítulo 3 — Teste Estático (revisões, análise estática)</li>
<li><strong>Semana 4 e 5:</strong> Capítulo 4 — Análise e Modelagem (técnicas de caixa-preta e caixa-branca) — vale duas semanas pela complexidade</li>
<li><strong>Semana 6:</strong> Capítulo 5 — Gerenciamento de Atividades de Teste</li>
<li><strong>Semana 7:</strong> Capítulo 6 — Ferramentas de Suporte ao Teste</li>
<li><strong>Semana 8:</strong> Revisão geral + simulados completos</li>
</ul>
<p>A semana 8 é onde muitos candidatos passam ou falham: fazer pelo menos 3 simulados completos de 40 questões em 60 minutos é indispensável.</p>`,
    },
    {
      titulo: "Como usar simulados de forma eficiente",
      conteudo: `<p>Fazer simulados errado é pior do que não fazê-los. Veja a estratégia correta:</p>
<ul>
<li><strong>Não faça simulados antes de estudar o conteúdo.</strong> Simulados são para fixação, não para aprendizado inicial.</li>
<li><strong>Leia a explicação de cada questão errada.</strong> Entender por que você errou é mais valioso do que o número de acertos.</li>
<li><strong>Simule as condições reais:</strong> timer ligado, sem interrupções, sem consulta ao material.</li>
<li><strong>Foque nas questões de Capítulo 4 e 5</strong> — elas respondem por 50% do exame.</li>
<li><strong>Use a fila de revisão:</strong> questões que você errou devem voltar até você acertar consistentemente.</li>
</ul>
<p>Uma pontuação de 75-80% nos simulados antes da prova é um bom sinal de preparo.</p>`,
    },
    {
      titulo: "No dia da prova",
      conteudo: `<p>Algumas dicas práticas para o dia do exame:</p>
<ul>
<li><strong>Leia o enunciado com atenção total.</strong> Muitas questões do CTFL têm pegadinhas sutis de terminologia — "sempre", "nunca", "principalmente" são palavras que mudam a resposta.</li>
<li><strong>Não confunda a resposta "certa na prática" com a resposta "certa segundo o ISTQB."</strong> O exame cobra a visão do syllabus, não a realidade da sua empresa.</li>
<li><strong>Responda todas as questões</strong> — não há penalização por respostas erradas. Se não sabe, chute.</li>
<li><strong>Reserve os últimos 10 minutos para revisar</strong> as questões em que você ficou em dúvida.</li>
<li><strong>Durma bem na noite anterior.</strong> Cansaço é inimigo da concentração em questões de interpretação.</li>
</ul>`,
    },
  ],
  quiz: [
    {
      pergunta: "Qual é o recurso de estudo mais importante e obrigatório para quem vai fazer o CTFL?",
      opcoes: ["Livro 'Foundations of Software Testing'", "Syllabus oficial do CTFL v4.0 no site do ISTQB", "Vídeos no YouTube sobre teste de software", "Experiência prática em projetos de QA"],
      correta: 1,
      explicacao: "O syllabus oficial do CTFL v4.0, disponível gratuitamente no site do ISTQB, define exatamente o que é cobrado no exame. É o ponto de partida obrigatório para qualquer candidato.",
    },
    {
      pergunta: "Qual capítulo do CTFL deve receber mais tempo de estudo por sua complexidade E peso no exame?",
      opcoes: ["Capítulo 1 — Fundamentos", "Capítulo 3 — Teste Estático", "Capítulo 4 — Análise e Modelagem", "Capítulo 6 — Ferramentas"],
      correta: 2,
      explicacao: "O Capítulo 4 tem 11 questões no exame (o maior peso) e cobre técnicas de caixa-preta e caixa-branca, que exigem prática e memorização. Merece duas semanas de estudo no plano de 8 semanas.",
    },
    {
      pergunta: "Qual pontuação nos simulados é considerada um bom indicador de preparo para a prova real?",
      opcoes: ["Acima de 50%", "Acima de 60%", "Acima de 65%", "Acima de 75%"],
      correta: 3,
      explicacao: "Uma pontuação de 75-80% nos simulados oferece uma margem de segurança adequada sobre a nota mínima de aprovação (65%), considerando que a pressão do exame real pode afetar o desempenho.",
    },
    {
      pergunta: "Ao errar uma questão no simulado, qual é a atitude mais produtiva?",
      opcoes: ["Marcar como errada e seguir para a próxima", "Ler a explicação da questão para entender o erro", "Refazer o simulado imediatamente", "Buscar a resposta no syllabus"],
      correta: 1,
      explicacao: "Ler a explicação de cada questão errada é mais valioso do que o número de acertos. Entender por que você errou fixe o conceito correto e evita repetir o mesmo erro no exame.",
    },
    {
      pergunta: "No CTFL, quando uma questão cobre uma prática que difere do que você faz na sua empresa, você deve:",
      opcoes: ["Responder com base na sua experiência prática", "Responder com base no que o syllabus do ISTQB define", "Deixar a questão em branco", "Escolher a alternativa mais conservadora"],
      correta: 1,
      explicacao: "O CTFL avalia o conhecimento do syllabus do ISTQB, não a realidade de cada empresa. A resposta correta é sempre a que o syllabus define como correta, mesmo que sua experiência prática seja diferente.",
    },
  ],
};
```

- [ ] **Step 3: Build check**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add src/data/guia/o-que-e-ctfl.ts src/data/guia/como-se-preparar-ctfl.ts
git commit -m "feat: artigos /guia — o-que-e-ctfl e como-se-preparar-ctfl"
```

---

## Task 4: Artigos CTFL Cap. 1 e Cap. 2

**Files:**
- Create: `src/data/guia/fundamentos-de-teste.ts`
- Create: `src/data/guia/teste-no-ciclo-de-vida.ts`

- [ ] **Step 1: Criar `src/data/guia/fundamentos-de-teste.ts`**

```ts
import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "fundamentos-de-teste",
  titulo: "Fundamentos de Teste de Software (Cap. 1 CTFL)",
  descricao: "Os 7 princípios do teste, conceitos de erro, defeito e falha, atividades e papéis no processo de teste.",
  secao: "ctfl",
  tempoLeitura: 12,
  nivel: "iniciante",
  secoes: [
    {
      titulo: "Por que o teste de software é necessário?",
      conteudo: `<p>Sistemas de software estão presentes em praticamente todas as áreas da vida moderna — saúde, aviação, finanças, comunicação. Quando esses sistemas falham, as consequências podem ir de mero inconveniente a perdas financeiras enormes ou até riscos à vida humana.</p>
<p>O teste de software existe para <strong>reduzir o risco de falhas em produção</strong>. Ele não garante que o software é perfeito — isso seria impossível na prática — mas aumenta a confiança de que o sistema funciona conforme o esperado para os casos mais importantes.</p>
<p>Além de encontrar defeitos, o teste contribui para a qualidade de outras formas: fornece informações para decisões de liberação, verifica que requisitos foram atendidos e ajuda a cumprir requisitos contratuais e regulatórios.</p>`,
      videoId: "por-que-testar",
    },
    {
      titulo: "Os 7 Princípios do Teste",
      conteudo: `<p>O CTFL v4.0 define 7 princípios fundamentais que guiam como o teste deve ser abordado:</p>
<ol>
<li><strong>O teste demonstra a presença de defeitos, não a ausência.</strong> Testes encontram problemas, mas não provam que não existem outros.</li>
<li><strong>Testes exaustivos são impossíveis.</strong> Testar todas as combinações possíveis de entradas seria impraticável — priorizamos com base em risco.</li>
<li><strong>O teste inicial economiza tempo e dinheiro.</strong> Defeitos encontrados cedo custam muito menos para corrigir.</li>
<li><strong>Os defeitos se agrupam.</strong> A maioria dos problemas costuma estar concentrada em poucos módulos do sistema (Princípio de Pareto).</li>
<li><strong>Os testes se desgastam.</strong> Rodar os mesmos testes indefinidamente reduz sua eficácia — é necessário variar as abordagens.</li>
<li><strong>O teste depende do contexto.</strong> O que é adequado para um app bancário pode ser excessivo para um site institucional.</li>
<li><strong>A ausência de defeitos é uma falácia.</strong> Um sistema sem bugs ainda pode ser inútil se não atender às necessidades reais do usuário.</li>
</ol>`,
      videoId: "7-principios",
    },
    {
      titulo: "Erro, Defeito e Falha: terminologia essencial",
      conteudo: `<p>Uma das principais fontes de questões no exame CTFL é a distinção precisa entre esses três termos:</p>
<ul>
<li><strong>Erro (Error):</strong> uma ação humana que produz um resultado incorreto. É o que acontece na cabeça do desenvolvedor — um equívoco de raciocínio, um descuido, uma interpretação errada do requisito.</li>
<li><strong>Defeito (Defect / Bug):</strong> a manifestação do erro no artefato — no código, no documento, na configuração. É o que existe no sistema antes de ser executado.</li>
<li><strong>Falha (Failure):</strong> o comportamento incorreto observado quando o software é executado. É o sintoma visível ao usuário ou ao testador.</li>
</ul>
<p>A cadeia é: <strong>erro → defeito → falha</strong>. Um desenvolvedor comete um erro que introduz um defeito no código. Quando o código é executado, o defeito pode causar uma falha. Importante: nem todo defeito sempre causa falha — pode depender de condições específicas de execução.</p>`,
      videoId: "erro-defeito-falha",
    },
    {
      titulo: "Atividades e papéis no processo de teste",
      conteudo: `<p>O processo de teste do CTFL é composto por atividades principais:</p>
<ul>
<li><strong>Planejamento de teste:</strong> definir objetivos, estratégia, recursos e cronograma.</li>
<li><strong>Monitoramento e controle:</strong> acompanhar o progresso e tomar ações corretivas.</li>
<li><strong>Análise de teste:</strong> identificar o que testar com base em bases de teste (requisitos, código, etc.).</li>
<li><strong>Modelagem de teste:</strong> definir como testar — criar casos de teste, dados e ambiente.</li>
<li><strong>Implementação de teste:</strong> preparar o ambiente e automatizar quando aplicável.</li>
<li><strong>Execução de teste:</strong> rodar os testes e registrar os resultados.</li>
<li><strong>Conclusão de teste:</strong> arquivar artefatos, gerar relatório final, compartilhar lições aprendidas.</li>
</ul>
<p>Os papéis centrais são o <strong>Testador</strong> (executa testes, relata defeitos, cria casos de teste) e o <strong>Líder/Gerente de Teste</strong> (planeja, coordena, reporta). Em times ágeis, esses papéis são frequentemente compartilhados entre o time.</p>`,
      videoId: "atividades-e-papeis",
    },
  ],
  quiz: [
    {
      pergunta: "Segundo o CTFL, qual é o objetivo principal do teste de software?",
      opcoes: ["Provar que o software não tem defeitos", "Reduzir o risco de falhas em produção e aumentar a confiança na qualidade", "Garantir que todos os requisitos foram implementados", "Substituir a revisão de código pelos desenvolvedores"],
      correta: 1,
      explicacao: "O teste reduz o risco de falhas e aumenta a confiança, mas não prova ausência de defeitos — esse é justamente o 1º princípio do CTFL: o teste demonstra a presença, não a ausência de defeitos.",
    },
    {
      pergunta: "Um desenvolvedor interpreta errado um requisito e escreve código incorreto. Esse código, quando executado, exibe um valor errado para o usuário. Classifique corretamente cada elemento:",
      opcoes: [
        "A interpretação errada é defeito; o código incorreto é erro; o valor errado é falha",
        "A interpretação errada é erro; o código incorreto é defeito; o valor errado é falha",
        "A interpretação errada é falha; o código incorreto é erro; o valor errado é defeito",
        "Todos os três são chamados de defeito no CTFL",
      ],
      correta: 1,
      explicacao: "Erro é a ação humana (interpretação incorreta), defeito é o resultado no artefato (código incorreto) e falha é o comportamento incorreto observado na execução (valor errado exibido).",
    },
    {
      pergunta: "Qual princípio do teste afirma que a maioria dos defeitos tende a estar concentrada em poucos módulos do sistema?",
      opcoes: ["Testes exaustivos são impossíveis", "O teste inicial economiza tempo", "Os defeitos se agrupam", "Os testes se desgastam"],
      correta: 2,
      explicacao: "O princípio 'Os defeitos se agrupam' (também chamado de clustering) indica que a maioria dos problemas está concentrada em poucas partes do sistema, guiando a priorização dos esforços de teste.",
    },
    {
      pergunta: "O que significa dizer que 'os testes se desgastam'?",
      opcoes: [
        "Os testes ficam mais lentos com o tempo",
        "Rodar os mesmos testes repetidamente reduz sua capacidade de encontrar novos defeitos",
        "Os testadores perdem motivação ao repetir os mesmos testes",
        "Os dados de teste se tornam inválidos ao longo do tempo",
      ],
      correta: 1,
      explicacao: "Este princípio (paradoxo do pesticida) indica que executar sempre os mesmos testes eventualmente não encontra mais defeitos novos, pois o software se 'adapta'. É necessário revisar e atualizar os testes periodicamente.",
    },
    {
      pergunta: "Qual atividade do processo de teste envolve definir COMO testar — criando casos de teste e dados de teste?",
      opcoes: ["Análise de teste", "Modelagem de teste", "Implementação de teste", "Planejamento de teste"],
      correta: 1,
      explicacao: "A Modelagem de Teste (Test Design) define como testar: cria casos de teste de alto nível, identifica dados de teste e define o ambiente necessário. A Análise define o QUE testar; a Implementação prepara o ambiente e automatiza.",
    },
  ],
};
```

- [ ] **Step 2: Criar `src/data/guia/teste-no-ciclo-de-vida.ts`**

```ts
import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "teste-no-ciclo-de-vida",
  titulo: "Teste no Ciclo de Vida de Software (Cap. 2 CTFL)",
  descricao: "Modelos de desenvolvimento, níveis de teste (unitário, integração, sistema, aceite) e tipos de teste.",
  secao: "ctfl",
  tempoLeitura: 12,
  nivel: "iniciante",
  secoes: [
    {
      titulo: "Modelos de desenvolvimento e o teste",
      conteudo: `<p>O modelo de desenvolvimento de software adotado pela equipe determina diretamente como o teste é integrado ao processo. O CTFL v4.0 cobre três grandes abordagens:</p>
<ul>
<li><strong>Modelos sequenciais (Cascata/V):</strong> o teste é realizado em fases após o desenvolvimento. O Modelo V é a evolução do cascata: cada fase de desenvolvimento tem uma fase de teste correspondente (requisitos ↔ teste de aceite, design ↔ teste de sistema, codificação ↔ teste unitário).</li>
<li><strong>Modelos iterativos e incrementais (Agile, Scrum):</strong> o software é desenvolvido em ciclos curtos (sprints). Testes acontecem dentro de cada iteração, e o princípio de "teste contínuo" é fundamental.</li>
<li><strong>DevOps e entrega contínua:</strong> testes automatizados são integrados ao pipeline CI/CD. O feedback é imediato e a qualidade é responsabilidade de todo o time.</li>
</ul>
<p>O CTFL v4.0 enfatiza que, independentemente do modelo, o princípio de <strong>teste inicial</strong> deve ser respeitado: quanto mais cedo os testes são realizados, mais baratos são os defeitos encontrados.</p>`,
      videoId: "modelos-desenvolvimento",
    },
    {
      titulo: "Níveis de teste",
      conteudo: `<p>Os <strong>níveis de teste</strong> definem em qual parte do sistema o teste se concentra:</p>
<ul>
<li><strong>Teste de Componente (Unitário):</strong> testa unidades individuais de código (funções, classes) de forma isolada. Geralmente feito pelo desenvolvedor. Rápido e barato.</li>
<li><strong>Teste de Integração de Componentes:</strong> verifica a comunicação entre componentes já testados individualmente. Encontra problemas nas interfaces entre módulos.</li>
<li><strong>Teste de Sistema:</strong> testa o sistema completo integrado, do ponto de vista do usuário final. Verifica comportamento funcional e não-funcional.</li>
<li><strong>Teste de Integração de Sistemas:</strong> verifica a integração com sistemas externos (APIs, bancos de dados, serviços de terceiros).</li>
<li><strong>Teste de Aceite:</strong> valida se o sistema atende às necessidades do negócio. Inclui UAT (User Acceptance Testing) e testes regulatórios.</li>
</ul>`,
      videoId: "niveis-teste",
    },
    {
      titulo: "Tipos de teste",
      conteudo: `<p>Os <strong>tipos de teste</strong> definem o que está sendo avaliado, independentemente do nível:</p>
<ul>
<li><strong>Teste Funcional:</strong> verifica o que o sistema faz — suas funcionalidades. Baseado em requisitos funcionais.</li>
<li><strong>Teste Não-Funcional:</strong> verifica como o sistema se comporta — performance, segurança, usabilidade, compatibilidade.</li>
<li><strong>Teste Caixa-Preta:</strong> testa sem conhecer o código interno, apenas com entradas e saídas esperadas.</li>
<li><strong>Teste Caixa-Branca:</strong> testa conhecendo a estrutura interna do código, verificando caminhos de execução.</li>
<li><strong>Teste de Regressão:</strong> verifica que mudanças recentes não quebraram funcionalidades que funcionavam antes.</li>
<li><strong>Teste de Confirmação (Re-teste):</strong> verifica que um defeito específico foi corrigido.</li>
</ul>`,
      videoId: "tipos-teste",
    },
    {
      titulo: "Teste de manutenção",
      conteudo: `<p>Sistemas em produção precisam de manutenção contínua — correções de bugs, novas funcionalidades, migração de infraestrutura. O <strong>teste de manutenção</strong> aborda o teste de sistemas já em produção.</p>
<p>Os gatilhos para teste de manutenção incluem: modificações planejadas (novas features), correções de emergência e migrações (novo servidor, novo banco de dados, nova versão de SO).</p>
<p>Um conceito chave é a <strong>análise de impacto</strong>: antes de testar, identifica-se quais partes do sistema foram afetadas pela mudança. Isso permite focar o esforço de regressão nas áreas de maior risco, em vez de retestar tudo do zero.</p>`,
      videoId: "teste-manutencao",
    },
  ],
  quiz: [
    {
      pergunta: "No Modelo V de desenvolvimento, o teste de aceite corresponde a qual fase de desenvolvimento?",
      opcoes: ["Codificação", "Design de componentes", "Design de sistema", "Análise de requisitos"],
      correta: 3,
      explicacao: "No Modelo V, cada fase de desenvolvimento tem uma fase de teste correspondente. O Teste de Aceite valida se os requisitos de negócio foram atendidos, correspondendo à fase de Análise de Requisitos.",
    },
    {
      pergunta: "Qual nível de teste verifica a comunicação e as interfaces entre módulos que já foram testados individualmente?",
      opcoes: ["Teste de componente (unitário)", "Teste de integração de componentes", "Teste de sistema", "Teste de aceite"],
      correta: 1,
      explicacao: "O Teste de Integração de Componentes verifica como módulos já testados individualmente se comunicam entre si, encontrando problemas nas interfaces e contratos entre eles.",
    },
    {
      pergunta: "Um testador verifica se o sistema mantém seu desempenho adequado com 10.000 usuários simultâneos. Que tipo de teste é esse?",
      opcoes: ["Teste funcional", "Teste de regressão", "Teste não-funcional", "Teste de confirmação"],
      correta: 2,
      explicacao: "Performance com múltiplos usuários simultâneos é uma característica de qualidade não-funcional (carga/stress). Testes não-funcionais avaliam COMO o sistema se comporta, não o QUE ele faz.",
    },
    {
      pergunta: "Após corrigir um bug reportado pelo testador, o desenvolvedor entrega a correção. Qual tipo de teste o testador deve executar primeiro?",
      opcoes: ["Teste de regressão", "Teste de confirmação (re-teste)", "Teste de aceite", "Teste de integração"],
      correta: 1,
      explicacao: "O Teste de Confirmação (re-teste) verifica especificamente se o defeito reportado foi corrigido. O Teste de Regressão verifica se a correção não quebrou nada mais — ambos são importantes, mas o re-teste vem primeiro.",
    },
    {
      pergunta: "O que é análise de impacto no contexto do teste de manutenção?",
      opcoes: [
        "Avaliar o impacto dos defeitos no negócio",
        "Identificar quais partes do sistema foram afetadas por uma mudança para focar o esforço de regressão",
        "Medir o tempo necessário para executar todos os testes de regressão",
        "Documentar os riscos identificados durante o planejamento de teste",
      ],
      correta: 1,
      explicacao: "A análise de impacto identifica quais partes do sistema foram afetadas por uma mudança (nova feature, correção, migração), permitindo focar o teste de regressão nas áreas de maior risco em vez de retestar tudo.",
    },
  ],
};
```

- [ ] **Step 3: Build check**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add src/data/guia/fundamentos-de-teste.ts src/data/guia/teste-no-ciclo-de-vida.ts
git commit -m "feat: artigos /guia — Cap.1 fundamentos e Cap.2 ciclo de vida"
```

---

## Task 5: Artigos CTFL Cap. 3 e Cap. 4

**Files:**
- Create: `src/data/guia/teste-estatico.ts`
- Create: `src/data/guia/analise-e-modelagem-de-teste.ts`

- [ ] **Step 1: Criar `src/data/guia/teste-estatico.ts`**

```ts
import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "teste-estatico",
  titulo: "Teste Estático (Cap. 3 CTFL)",
  descricao: "Revisões de código, análise estática, benefícios do teste estático e como aplicar em projetos reais.",
  secao: "ctfl",
  tempoLeitura: 9,
  nivel: "intermediário",
  secoes: [
    {
      titulo: "O que é teste estático?",
      conteudo: `<p>O <strong>teste estático</strong> examina artefatos de software <em>sem executá-los</em>. Isso inclui código-fonte, documentos de requisitos, casos de uso, planos de teste, modelos de arquitetura e qualquer outro artefato produzido durante o desenvolvimento.</p>
<p>Ao contrário do <strong>teste dinâmico</strong> (que executa o software com entradas e verifica saídas), o teste estático analisa o artefato em si — sua estrutura, consistência, completude e conformidade com padrões.</p>
<p>O benefício central é o <strong>custo</strong>: defeitos encontrados em documentos ou código antes da execução custam uma fração do que custaria encontrá-los em produção. Uma ambiguidade num requisito, identificada numa revisão, pode evitar semanas de retrabalho.</p>`,
      videoId: "fundamentos-estatico",
    },
    {
      titulo: "Tipos de revisão",
      conteudo: `<p>O CTFL v4.0 define quatro tipos de revisão em ordem crescente de formalidade:</p>
<ul>
<li><strong>Revisão Informal:</strong> sem processo definido. Um colega lê o documento ou código e dá feedback. Rápida e barata, mas sem registro formal.</li>
<li><strong>Walkthrough:</strong> o autor conduz a revisão, guiando os revisores pelo artefato. Foco em aprendizado e descoberta de problemas. Sem papéis formais obrigatórios.</li>
<li><strong>Revisão Técnica:</strong> conduzida por colegas técnicos (não o autor). Mais estruturada, com registro de defeitos encontrados. Foco em consenso técnico.</li>
<li><strong>Inspeção:</strong> o processo mais formal. Tem papéis definidos (moderador, autor, revisor, relator), processo documentado, métricas coletadas e critérios de entrada/saída. Alta taxa de detecção de defeitos, mas custo maior.</li>
</ul>`,
      videoId: "processo-revisao",
    },
    {
      titulo: "Análise estática com ferramentas",
      conteudo: `<p>A <strong>análise estática automatizada</strong> usa ferramentas para examinar o código sem executá-lo. Exemplos populares: ESLint (JavaScript), SonarQube (multi-linguagem), PMD (Java).</p>
<p>Essas ferramentas identificam:</p>
<ul>
<li>Violações de padrões de codificação</li>
<li>Vulnerabilidades de segurança conhecidas</li>
<li>Código duplicado (duplicação)</li>
<li>Complexidade ciclomática elevada (código difícil de testar)</li>
<li>Variáveis não inicializadas ou fluxos de controle problemáticos</li>
</ul>
<p>A análise estática não substitui a revisão humana — ela complementa, automatizando a verificação de padrões mecânicos para que os revisores humanos foquem em questões de lógica e design.</p>`,
      videoId: "analise-estatica",
    },
  ],
  quiz: [
    {
      pergunta: "Qual é a principal diferença entre teste estático e teste dinâmico?",
      opcoes: [
        "Teste estático usa ferramentas; teste dinâmico é manual",
        "Teste estático examina artefatos sem executá-los; teste dinâmico executa o software",
        "Teste estático é feito antes do desenvolvimento; teste dinâmico é feito depois",
        "Teste estático verifica performance; teste dinâmico verifica funcionalidade",
      ],
      correta: 1,
      explicacao: "A distinção fundamental é a execução: teste estático examina artefatos (código, documentos) sem executar o software. Teste dinâmico executa o software com entradas e verifica as saídas.",
    },
    {
      pergunta: "Qual tipo de revisão é o mais formal, com papéis definidos, processo documentado e métricas coletadas?",
      opcoes: ["Revisão informal", "Walkthrough", "Revisão técnica", "Inspeção"],
      correta: 3,
      explicacao: "A Inspeção é o tipo de revisão mais formal do CTFL: tem papéis definidos (moderador, autor, revisor, relator), segue um processo documentado e coleta métricas para melhoria contínua.",
    },
    {
      pergunta: "Durante um walkthrough, quem conduz a sessão de revisão?",
      opcoes: ["O moderador externo", "O autor do artefato", "O líder do projeto", "O testador líder"],
      correta: 1,
      explicacao: "No Walkthrough, o próprio autor guia os revisores pelo artefato, explicando decisões e buscando feedback. Isso o diferencia da Inspeção, onde um moderador neutro conduz o processo.",
    },
    {
      pergunta: "Uma ferramenta como SonarQube que analisa código-fonte sem executá-lo é um exemplo de:",
      opcoes: ["Teste de regressão automatizado", "Análise estática", "Teste de caixa-branca dinâmico", "Ferramenta de gerenciamento de defeitos"],
      correta: 1,
      explicacao: "Ferramentas como SonarQube, ESLint e PMD realizam análise estática automatizada — examinam o código-fonte sem executá-lo, identificando padrões problemáticos, vulnerabilidades e violações de boas práticas.",
    },
    {
      pergunta: "Por que o teste estático é considerado mais barato que o teste dinâmico para encontrar certos tipos de defeito?",
      opcoes: [
        "Porque usa menos ferramentas",
        "Porque defeitos em artefatos encontrados cedo (antes da execução) custam muito menos para corrigir",
        "Porque não exige testadores especializados",
        "Porque pode ser feito sem acesso ao código-fonte",
      ],
      correta: 1,
      explicacao: "O custo de correção de defeitos cresce exponencialmente com o tempo. Uma ambiguidade num requisito identificada em revisão custa horas; o mesmo problema identificado em produção pode custar semanas de retrabalho.",
    },
  ],
};
```

- [ ] **Step 2: Criar `src/data/guia/analise-e-modelagem-de-teste.ts`**

```ts
import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "analise-e-modelagem-de-teste",
  titulo: "Análise e Modelagem de Teste (Cap. 4 CTFL)",
  descricao: "Técnicas caixa-preta (partição de equivalência, valor-limite, tabela de decisão, transição de estado) e caixa-branca.",
  secao: "ctfl",
  tempoLeitura: 14,
  nivel: "intermediário",
  secoes: [
    {
      titulo: "Partição de Equivalência",
      conteudo: `<p>A <strong>Partição de Equivalência (PE)</strong> divide os dados de entrada em grupos (partições) onde todos os valores do grupo devem se comportar da mesma forma. A ideia é que se um valor dentro da partição revela um defeito, todos os outros valores também revelariam — e vice-versa.</p>
<p>Isso permite reduzir drasticamente o número de casos de teste sem perder cobertura. Em vez de testar 100 valores numéricos válidos, você testa um representante de cada partição.</p>
<p>Exemplo: campo "Idade" que aceita valores entre 18 e 65 anos. Partições:</p>
<ul>
<li>Partição inválida: valores abaixo de 18 (ex: 17)</li>
<li>Partição válida: valores entre 18 e 65 (ex: 30)</li>
<li>Partição inválida: valores acima de 65 (ex: 66)</li>
</ul>`,
      videoId: "particao-equivalencia",
    },
    {
      titulo: "Análise de Valor Limite",
      conteudo: `<p>A <strong>Análise de Valor Limite (AVL)</strong> complementa a PE focando nos <em>limites</em> das partições, onde defeitos se concentram com mais frequência. Desenvolvedores frequentemente erram nas condições de fronteira (usar &lt; em vez de &lt;=, por exemplo).</p>
<p>Para o CTFL v4.0, testamos os valores <strong>no limite</strong> e <strong>imediatamente além do limite</strong> (2 pontos por limite). Versões anteriores usavam 3 pontos (abaixo, no limite, acima).</p>
<p>Usando o mesmo exemplo de "Idade" (18-65):</p>
<ul>
<li>Limite inferior: testar 17 (inválido) e 18 (válido)</li>
<li>Limite superior: testar 65 (válido) e 66 (inválido)</li>
</ul>
<p>Resultado: 4 casos de teste cobrem os 4 pontos críticos da fronteira.</p>`,
      videoId: "analise-valor-limite",
    },
    {
      titulo: "Tabela de Decisão",
      conteudo: `<p>A <strong>Tabela de Decisão</strong> é ideal para requisitos com múltiplas condições combinadas que geram diferentes ações. Ela mapeia sistematicamente todas as combinações possíveis de condições e seus resultados esperados.</p>
<p>Estrutura de uma tabela de decisão:</p>
<ul>
<li><strong>Condições:</strong> as entradas ou estados do sistema (linhas superiores)</li>
<li><strong>Ações:</strong> os resultados esperados para cada combinação (linhas inferiores)</li>
<li><strong>Regras:</strong> cada coluna representa uma combinação de condições</li>
</ul>
<p>Exemplo: sistema de desconto onde "Cliente Premium" E "Compra acima de R$500" dão 20% de desconto; apenas um dos dois dá 10%; nenhum dos dois dá 0%.</p>`,
      videoId: "tabela-decisao",
    },
    {
      titulo: "Teste de Transição de Estado",
      conteudo: `<p>O <strong>Teste de Transição de Estado</strong> é usado quando o comportamento do sistema depende do seu estado atual. Sistemas com estados são representados por um diagrama de estados: círculos são estados, setas são transições disparadas por eventos.</p>
<p>Exemplo clássico: uma conta bancária tem estados (Ativa, Bloqueada, Encerrada). Cada transição (bloquear, desbloquear, encerrar) tem condições e ações associadas.</p>
<p>Cobertura em testes de transição de estado:</p>
<ul>
<li><strong>Cobertura de todos os estados:</strong> visitar cada estado ao menos uma vez</li>
<li><strong>Cobertura de todas as transições válidas:</strong> exercitar cada transição permitida</li>
<li><strong>Cobertura de transições inválidas:</strong> verificar que transições proibidas são rejeitadas</li>
</ul>`,
      videoId: "transicao-estado",
    },
    {
      titulo: "Teste Caixa-Branca e Baseado em Experiência",
      conteudo: `<p>O <strong>Teste Caixa-Branca</strong> (estrutural) usa o conhecimento da estrutura interna do código para criar casos de teste. A principal métrica é a <strong>cobertura de código</strong>:</p>
<ul>
<li><strong>Cobertura de instruções:</strong> percentual de linhas de código executadas</li>
<li><strong>Cobertura de ramificações:</strong> percentual de branches (if/else, switch) exercitados — mais rigorosa</li>
</ul>
<p>O <strong>Teste Baseado em Experiência</strong> usa o conhecimento e intuição do testador. As técnicas incluem:</p>
<ul>
<li><strong>Suposição de Erros (Error Guessing):</strong> o testador usa sua experiência para supor onde defeitos provavelmente estão.</li>
<li><strong>Teste Exploratório:</strong> design e execução simultâneos, guiados pela aprendizagem contínua durante o teste.</li>
<li><strong>Teste Baseado em Checklist:</strong> uso de listas de verificação derivadas de experiências anteriores.</li>
</ul>`,
      videoId: "caixa-branca",
    },
  ],
  quiz: [
    {
      pergunta: "Um campo aceita idades entre 18 e 65 anos. Usando Análise de Valor Limite (2 pontos), quais valores devem ser testados no limite inferior?",
      opcoes: ["17 e 18", "18 e 19", "17, 18 e 19", "16, 17 e 18"],
      correta: 0,
      explicacao: "Na AVL com 2 pontos, testamos o valor imediatamente abaixo do limite (17 — inválido) e o valor no limite (18 — válido). O limite inferior é 18, então testamos 17 e 18.",
    },
    {
      pergunta: "Qual técnica de caixa-preta é mais adequada quando o comportamento do sistema depende de múltiplas condições combinadas?",
      opcoes: ["Partição de Equivalência", "Análise de Valor Limite", "Tabela de Decisão", "Teste de Transição de Estado"],
      correta: 2,
      explicacao: "A Tabela de Decisão é ideal para requisitos com múltiplas condições que se combinam para produzir diferentes ações, mapeando sistematicamente todas as combinações possíveis.",
    },
    {
      pergunta: "No teste de transição de estado, o que representa uma 'transição inválida'?",
      opcoes: [
        "Uma transição que nunca ocorre na prática",
        "Uma transição de um estado para outro que o sistema não deveria permitir",
        "Uma transição com dados de entrada incorretos",
        "Uma transição que leva ao estado inicial",
      ],
      correta: 1,
      explicacao: "Transições inválidas são aquelas que o sistema não deveria permitir — por exemplo, tentar encerrar uma conta já encerrada ou desbloquear uma conta ativa. Testar essas situações verifica que o sistema rejeita corretamente estados proibidos.",
    },
    {
      pergunta: "Qual é a diferença entre cobertura de instruções e cobertura de ramificações no teste caixa-branca?",
      opcoes: [
        "Cobertura de instruções é mais rigorosa pois exige 100% do código executado",
        "Cobertura de ramificações é mais rigorosa pois exige que todos os branches (if/else) sejam exercitados",
        "São equivalentes — atingir uma implica atingir a outra",
        "Cobertura de instruções cobre código; cobertura de ramificações cobre dados",
      ],
      correta: 1,
      explicacao: "Cobertura de ramificações é mais rigorosa: você pode executar todas as linhas (100% de instruções) sem testar todos os branches. Ex: um if sem else — a instrução é executada, mas o branch 'false' pode nunca ser exercitado.",
    },
    {
      pergunta: "O que é teste exploratório?",
      opcoes: [
        "Teste sem planejamento prévio, executado de forma aleatória",
        "Teste em que o design e execução ocorrem simultaneamente, guiados por aprendizagem contínua",
        "Teste de novas funcionalidades antes de qualquer documentação",
        "Teste realizado por usuários finais sem conhecimento técnico",
      ],
      correta: 1,
      explicacao: "O teste exploratório é uma técnica baseada em experiência onde o testador projeta e executa os testes simultaneamente, usando o que aprende durante o processo para guiar os próximos passos. Não é aleatório — é intencional e orientado por heurísticas.",
    },
  ],
};
```

- [ ] **Step 3: Build check**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add src/data/guia/teste-estatico.ts src/data/guia/analise-e-modelagem-de-teste.ts
git commit -m "feat: artigos /guia — Cap.3 teste estático e Cap.4 análise e modelagem"
```

---

## Task 6: Artigos CTFL Cap. 5, Cap. 6 e Glossário

**Files:**
- Create: `src/data/guia/gerenciamento-de-atividades-de-teste.ts`
- Create: `src/data/guia/ferramentas-de-suporte-ao-teste.ts`
- Create: `src/data/guia/glossario-ctfl.ts`

- [ ] **Step 1: Criar `src/data/guia/gerenciamento-de-atividades-de-teste.ts`**

```ts
import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "gerenciamento-de-atividades-de-teste",
  titulo: "Gerenciamento de Atividades de Teste (Cap. 5 CTFL)",
  descricao: "Planejamento, estimativa, monitoramento, controle de teste, gestão de riscos e defeitos.",
  secao: "ctfl",
  tempoLeitura: 11,
  nivel: "intermediário",
  secoes: [
    {
      titulo: "Planejamento de teste",
      conteudo: `<p>O <strong>plano de teste</strong> é o documento central do gerenciamento de testes. Ele define: objetivo do teste, escopo, abordagem, recursos necessários, cronograma, critérios de entrada e saída, e riscos identificados.</p>
<p>Componentes essenciais de um plano de teste segundo o CTFL:</p>
<ul>
<li><strong>Contexto do teste:</strong> o que está sendo testado, quais riscos existem, quais restrições se aplicam.</li>
<li><strong>Abordagem de teste:</strong> quais níveis, tipos e técnicas serão usados.</li>
<li><strong>Critérios de entrada:</strong> o que precisa estar pronto para o teste começar (ex: build estável, ambiente configurado).</li>
<li><strong>Critérios de saída:</strong> o que determina que o teste foi suficiente (ex: 95% dos casos executados, zero defeitos críticos abertos).</li>
<li><strong>Estimativas:</strong> esforço, duração e recursos necessários.</li>
</ul>`,
      videoId: "planejamento-teste",
    },
    {
      titulo: "Monitoramento e controle",
      conteudo: `<p>Planejar não é suficiente — o gerente de testes precisa <strong>monitorar o progresso</strong> continuamente e <strong>tomar ações de controle</strong> quando o plano desvia da realidade.</p>
<p>Métricas comuns de monitoramento:</p>
<ul>
<li>Percentual de casos de teste planejados vs. executados</li>
<li>Número de defeitos encontrados vs. corrigidos vs. fechados</li>
<li>Cobertura de requisitos pelos casos de teste</li>
<li>Burn-down de defeitos ao longo do tempo</li>
</ul>
<p>Quando o progresso desvia do plano, o gerente aplica <strong>controle de teste</strong>: repriorizar casos de teste, alocar mais recursos, reduzir escopo, ou recomendar adiamento da liberação.</p>`,
      videoId: "monitoramento-controle",
    },
    {
      titulo: "Gestão de riscos em teste",
      conteudo: `<p>O <strong>risco</strong> no contexto de teste é a probabilidade de um evento negativo ocorrer, combinada com seu impacto. O CTFL distingue dois tipos:</p>
<ul>
<li><strong>Risco de produto:</strong> a possibilidade de que o software não funcione como esperado (risco de qualidade). Guia a priorização dos testes.</li>
<li><strong>Risco de projeto:</strong> fatores que podem impedir o projeto de entregar no prazo/escopo/custo (falta de pessoal, ambiente instável, requisitos incompletos).</li>
</ul>
<p>A análise de risco de produto envolve dois fatores: <strong>probabilidade</strong> (quão provável é que o defeito exista?) e <strong>impacto</strong> (quão grave seria se ocorresse?). Áreas com alto produto de probabilidade × impacto recebem mais atenção nos testes.</p>`,
      videoId: "gestao-risco",
    },
    {
      titulo: "Gestão de defeitos",
      conteudo: `<p>O processo de gestão de defeitos define como defeitos são reportados, rastreados e resolvidos. Um bom relatório de defeito contém:</p>
<ul>
<li><strong>Identificador único</strong> e data de registro</li>
<li><strong>Título descritivo</strong> — o que está errado</li>
<li><strong>Passos para reproduzir</strong> — exatamente como chegar ao defeito</li>
<li><strong>Resultado esperado vs. resultado atual</strong></li>
<li><strong>Severidade</strong> (impacto técnico) e <strong>prioridade</strong> (urgência de correção)</li>
<li><strong>Ambiente</strong> (versão, SO, browser, dados de teste)</li>
<li><strong>Evidências</strong> (screenshots, logs)</li>
</ul>
<p>O ciclo de vida de um defeito passa por estados: Novo → Atribuído → Em Correção → Aguardando Re-teste → Fechado (ou Reaberto).</p>`,
      videoId: "gestao-defeitos",
    },
  ],
  quiz: [
    {
      pergunta: "O que são 'critérios de saída' em um plano de teste?",
      opcoes: [
        "As condições que precisam ser atendidas para o teste começar",
        "As condições que determinam que o teste foi suficiente para liberar o software",
        "Os critérios para demitir um testador do projeto",
        "As métricas coletadas ao final do projeto para lições aprendidas",
      ],
      correta: 1,
      explicacao: "Critérios de saída (exit criteria / done criteria) definem quando o teste pode ser considerado completo o suficiente — ex: 95% dos casos executados, zero defeitos críticos abertos. Critérios de entrada definem quando o teste pode começar.",
    },
    {
      pergunta: "Qual é a diferença entre severidade e prioridade de um defeito?",
      opcoes: [
        "Severidade é definida pelo testador; prioridade é definida pelo desenvolvedor",
        "Severidade é o impacto técnico do defeito; prioridade é a urgência de correção do ponto de vista do negócio",
        "São sinônimos — ambos medem o quão grave é o defeito",
        "Severidade mede o tempo para corrigir; prioridade mede o impacto no usuário",
      ],
      correta: 1,
      explicacao: "Um defeito pode ter alta severidade (quebra funcionalidade crítica) mas baixa prioridade (ocorre apenas em cenário raramente usado). Ou baixa severidade (erro de digitação) mas alta prioridade (está na tela de login). São dimensões independentes.",
    },
    {
      pergunta: "Qual é a diferença entre risco de produto e risco de projeto?",
      opcoes: [
        "Risco de produto afeta o software; risco de projeto afeta o usuário final",
        "Risco de produto é a possibilidade de o software não funcionar; risco de projeto é o que pode impedir a entrega",
        "São equivalentes — ambos são gerenciados pelo mesmo processo",
        "Risco de produto é técnico; risco de projeto é comercial",
      ],
      correta: 1,
      explicacao: "Risco de produto: o software pode ter defeitos (qualidade). Guia a priorização dos testes. Risco de projeto: fatores que podem impedir a entrega (prazo, recursos, ambiente). Ambos são gerenciados no planejamento de teste.",
    },
    {
      pergunta: "Um testador encontra que apenas 60% dos casos de teste planejados foram executados, mas o prazo se aproxima. Que atividade de gerenciamento de testes deve ser aplicada?",
      opcoes: [
        "Monitoramento — registrar a situação no relatório",
        "Controle — tomar ações como repriorizar casos ou alocar mais recursos",
        "Planejamento — criar um novo plano de teste",
        "Conclusão — encerrar o ciclo de teste atual",
      ],
      correta: 1,
      explicacao: "O controle de teste é a resposta quando o monitoramento indica desvio do plano. O gerente deve tomar ações corretivas: repriorizar casos de teste para cobrir os mais críticos, alocar mais testadores, ou renegociar o escopo.",
    },
    {
      pergunta: "Qual informação é ESSENCIAL em um relatório de defeito para que o desenvolvedor possa reproduzi-lo?",
      opcoes: [
        "O nome do testador que encontrou o defeito",
        "Os passos exatos para reproduzir o defeito",
        "O número de versões anteriores onde o defeito também existia",
        "A estimativa de tempo para correção",
      ],
      correta: 1,
      explicacao: "Sem os passos de reprodução, o desenvolvedor não consegue verificar nem corrigir o defeito. É a informação mais crítica do relatório. Sem ela, o bug tende a ser marcado como 'não reproduzível' e fechado sem correção.",
    },
  ],
};
```

- [ ] **Step 2: Criar `src/data/guia/ferramentas-de-suporte-ao-teste.ts`**

```ts
import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "ferramentas-de-suporte-ao-teste",
  titulo: "Ferramentas de Suporte ao Teste (Cap. 6 CTFL)",
  descricao: "Categorias de ferramentas de teste, automação, como selecionar e implementar ferramentas em projetos.",
  secao: "ctfl",
  tempoLeitura: 9,
  nivel: "intermediário",
  secoes: [
    {
      titulo: "Categorias de ferramentas de teste",
      conteudo: `<p>O CTFL classifica as ferramentas de suporte ao teste por função:</p>
<ul>
<li><strong>Ferramentas de gerenciamento de teste:</strong> organizam casos de teste, execução, defeitos e rastreabilidade de requisitos. Exemplos: Jira (com plugins), TestRail, Zephyr.</li>
<li><strong>Ferramentas de teste estático:</strong> análise de código, linters, verificadores de estilo. Exemplos: SonarQube, ESLint, Checkstyle.</li>
<li><strong>Ferramentas de design de teste:</strong> geram casos de teste a partir de modelos, dados ou especificações.</li>
<li><strong>Ferramentas de execução de teste:</strong> automatizam a execução de casos de teste. Exemplos: Selenium, Playwright, Cypress, JUnit, pytest.</li>
<li><strong>Ferramentas de performance:</strong> testam carga, stress e resistência. Exemplos: JMeter, k6, Gatling.</li>
<li><strong>Ferramentas de DevOps/CI:</strong> integram o teste ao pipeline. Exemplos: GitHub Actions, Jenkins, GitLab CI.</li>
</ul>`,
      videoId: "ferramentas-suporte",
    },
    {
      titulo: "Benefícios e riscos da automação de teste",
      conteudo: `<p>A automação de teste oferece benefícios reais, mas traz riscos que precisam ser gerenciados:</p>
<p><strong>Benefícios:</strong></p>
<ul>
<li>Redução de esforço em tarefas repetitivas (regressão)</li>
<li>Execução mais rápida e consistente</li>
<li>Feedback imediato em pipelines CI/CD</li>
<li>Possibilidade de testes em múltiplos ambientes e configurações</li>
</ul>
<p><strong>Riscos e limitações:</strong></p>
<ul>
<li>Custo inicial de setup e curva de aprendizado</li>
<li>Manutenção contínua dos testes automatizados (testes frágeis que quebram com mudanças de UI)</li>
<li>Falsa sensação de segurança — automação não substitui testes exploratórios</li>
<li>ROI negativo em sistemas que mudam muito ou têm vida útil curta</li>
</ul>`,
      videoId: "automacao-teste",
    },
    {
      titulo: "Como selecionar e implementar ferramentas",
      conteudo: `<p>A seleção de uma ferramenta de teste deve considerar:</p>
<ul>
<li><strong>Compatibilidade técnica:</strong> linguagem do projeto, SO, browsers suportados</li>
<li><strong>Nível de habilidade do time:</strong> curva de aprendizado vs. skill disponível</li>
<li><strong>Custo total:</strong> licença + treinamento + manutenção</li>
<li><strong>Suporte e comunidade:</strong> ferramentas open-source com comunidade ativa são mais sustentáveis</li>
<li><strong>Integração:</strong> compatibilidade com o restante da toolchain (CI, gerenciamento de defeitos)</li>
</ul>
<p>A implementação deve ser <strong>gradual</strong> — começar com uma área específica, demonstrar valor, e expandir. Projetos piloto reduzem o risco de adopção de ferramentas que não funcionam para o contexto da equipe.</p>`,
      videoId: "selecao-ferramenta",
    },
  ],
  quiz: [
    {
      pergunta: "Um time usa JMeter para simular 5.000 usuários simultâneos acessando o sistema. Qual categoria de ferramenta é o JMeter?",
      opcoes: ["Ferramenta de gerenciamento de teste", "Ferramenta de execução de teste funcional", "Ferramenta de teste de performance", "Ferramenta de análise estática"],
      correta: 2,
      explicacao: "JMeter é uma ferramenta de teste de performance (carga/stress), usada para simular múltiplos usuários e verificar o comportamento do sistema sob carga. Não testa funcionalidades, testa comportamento sob pressão.",
    },
    {
      pergunta: "Qual é o maior risco da automação de testes de interface (UI automation)?",
      opcoes: [
        "Custo de licenciamento das ferramentas",
        "Testes frágeis que quebram com qualquer mudança de interface",
        "Velocidade de execução menor que testes manuais",
        "Impossibilidade de integração com CI/CD",
      ],
      correta: 1,
      explicacao: "Testes de UI são os mais frágeis: qualquer mudança no layout, id, class ou estrutura HTML pode quebrar dezenas de testes. É por isso que boas práticas como Page Object Model e uso de locators semânticos (roles, labels) são fundamentais.",
    },
    {
      pergunta: "Qual afirmação sobre automação de teste está CORRETA segundo o CTFL?",
      opcoes: [
        "Automação substitui completamente o teste exploratório",
        "Automação tem ROI positivo em todos os projetos",
        "Automação reduz esforço em tarefas repetitivas mas exige manutenção contínua",
        "Automação elimina a necessidade de testadores humanos",
      ],
      correta: 2,
      explicacao: "Automação é eficiente para tarefas repetitivas (regressão), mas exige investimento inicial e manutenção contínua. Não substitui testes exploratórios nem elimina a necessidade de julgamento humano.",
    },
    {
      pergunta: "Qual ferramenta é classificada como de 'gerenciamento de teste'?",
      opcoes: ["Selenium", "SonarQube", "TestRail", "JMeter"],
      correta: 2,
      explicacao: "TestRail é uma ferramenta de gerenciamento de teste — organiza casos de teste, execuções, planos de teste e rastreabilidade. Selenium executa testes, SonarQube faz análise estática, JMeter testa performance.",
    },
    {
      pergunta: "Por que a implementação de ferramentas de teste deve ser gradual?",
      opcoes: [
        "Ferramentas de teste são caras e devem ser adquiridas aos poucos",
        "Para reduzir o risco de adotar uma ferramenta que não funciona para o contexto da equipe",
        "Ferramentas novas não suportam todos os tipos de teste de imediato",
        "Para evitar conflitos com ferramentas já utilizadas pelo time de desenvolvimento",
      ],
      correta: 1,
      explicacao: "Projetos piloto em uma área específica permitem validar se a ferramenta funciona bem para o contexto antes de expandir. Isso reduz o risco de investimento significativo em treinamento e setup de uma ferramenta que não atende as necessidades reais.",
    },
  ],
};
```

- [ ] **Step 3: Criar `src/data/guia/glossario-ctfl.ts`**

```ts
import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "glossario-ctfl",
  titulo: "Glossário CTFL v4.0: 50+ termos essenciais",
  descricao: "Definições de todos os termos-chave do syllabus CTFL v4.0 do ISTQB, com exemplos práticos.",
  secao: "ctfl",
  tempoLeitura: 15,
  nivel: "iniciante",
  secoes: [
    {
      titulo: "Termos Fundamentais (A–E)",
      conteudo: `<p><strong>Análise de Valor Limite (Boundary Value Analysis):</strong> técnica de caixa-preta que testa os valores nos limites das partições de equivalência, onde defeitos se concentram.</p>
<p><strong>Automação de Teste:</strong> uso de ferramentas para executar testes automaticamente, reduzindo esforço manual em tarefas repetitivas.</p>
<p><strong>Base de Teste (Test Basis):</strong> toda informação usada para derivar casos de teste — requisitos, especificações, código-fonte, modelos.</p>
<p><strong>Bug:</strong> sinônimo informal de defeito. Ver Defeito.</p>
<p><strong>Caso de Teste (Test Case):</strong> conjunto de precondições, entradas, ações, resultados esperados e pós-condições que verificam um comportamento específico do software.</p>
<p><strong>Cobertura (Coverage):</strong> percentual de um item de cobertura (instrução, branch, requisito) exercitado pelos testes executados.</p>
<p><strong>Critério de Entrada (Entry Criteria):</strong> condições que devem ser atendidas para iniciar uma atividade de teste.</p>
<p><strong>Critério de Saída (Exit Criteria):</strong> condições que devem ser atendidas para encerrar uma atividade de teste.</p>
<p><strong>Defeito (Defect):</strong> imperfeição num artefato de trabalho que pode causar falha. Sinônimo: bug, fault.</p>`,
    },
    {
      titulo: "Termos Fundamentais (E–M)",
      conteudo: `<p><strong>Erro (Error):</strong> ação humana que produz um resultado incorreto, levando à introdução de um defeito.</p>
<p><strong>Falha (Failure):</strong> comportamento incorreto observado quando o sistema é executado, causado por um defeito.</p>
<p><strong>Inspeção (Inspection):</strong> tipo mais formal de revisão estática, com papéis definidos, processo documentado e métricas.</p>
<p><strong>Nível de Teste (Test Level):</strong> grupo de atividades de teste organizadas e gerenciadas juntas (unitário, integração, sistema, aceite).</p>
<p><strong>Manutenção de Teste (Test Maintenance):</strong> modificação e atualização dos testes para refletir mudanças no software ou no ambiente.</p>
<p><strong>Modelo V:</strong> modelo de desenvolvimento onde cada fase de desenvolvimento tem uma fase correspondente de teste.</p>`,
    },
    {
      titulo: "Termos Fundamentais (O–Z)",
      conteudo: `<p><strong>Objetivo de Teste (Test Objective):</strong> razão ou propósito de um teste — ex: encontrar defeitos, ganhar confiança, cumprir requisito regulatório.</p>
<p><strong>Oráculo de Teste (Test Oracle):</strong> fonte usada para determinar o resultado esperado de um teste. Ex: especificação, comportamento de sistema anterior, conhecimento especialista.</p>
<p><strong>Partição de Equivalência (Equivalence Partitioning):</strong> técnica de caixa-preta que divide dados de entrada em grupos onde todos os valores se comportam da mesma forma.</p>
<p><strong>Plano de Teste (Test Plan):</strong> documento que descreve objetivos, escopo, abordagem, recursos e cronograma do teste.</p>
<p><strong>Prioridade (Priority):</strong> urgência de correção de um defeito do ponto de vista do negócio.</p>
<p><strong>Severidade (Severity):</strong> impacto técnico de um defeito no sistema.</p>
<p><strong>Suíte de Testes (Test Suite):</strong> conjunto de casos de teste agrupados para execução conjunta.</p>
<p><strong>Teste de Aceite (Acceptance Testing):</strong> nível de teste que valida se o sistema atende às necessidades do negócio.</p>
<p><strong>Teste Exploratório (Exploratory Testing):</strong> abordagem onde design e execução ocorrem simultaneamente, guiados por aprendizagem durante o teste.</p>
<p><strong>Teste Estático (Static Testing):</strong> exame de artefatos sem execução do software.</p>
<p><strong>Tipo de Teste (Test Type):</strong> grupo de atividades de teste focadas num objetivo específico — funcional, não-funcional, caixa-branca, etc.</p>`,
    },
  ],
  quiz: [
    {
      pergunta: "Qual é a diferença entre defeito e falha segundo o CTFL?",
      opcoes: [
        "São sinônimos — ambos descrevem o mesmo problema",
        "Defeito é o problema no artefato; falha é o comportamento incorreto observado na execução",
        "Defeito é causado pelo testador; falha é causada pelo desenvolvedor",
        "Defeito é mais grave que falha",
      ],
      correta: 1,
      explicacao: "Defeito existe no artefato (código, documento) — é o problema em si. Falha é o comportamento incorreto observado quando o software com defeito é executado. Um defeito pode existir sem gerar falha (se a condição que o ativa nunca ocorrer).",
    },
    {
      pergunta: "O que é um 'oráculo de teste'?",
      opcoes: [
        "Uma ferramenta de IA que prevê onde estão os defeitos",
        "A fonte usada para determinar o resultado esperado de um teste",
        "O testador mais experiente da equipe",
        "O documento de requisitos aprovado pelo cliente",
      ],
      correta: 1,
      explicacao: "O oráculo de teste é qualquer fonte que permite determinar se o resultado do teste está correto ou não. Pode ser uma especificação, o comportamento de uma versão anterior do sistema, um especialista de domínio, ou uma fórmula matemática.",
    },
    {
      pergunta: "O que é uma 'suíte de testes'?",
      opcoes: [
        "O ambiente completo de teste (hardware + software)",
        "Conjunto de casos de teste agrupados para execução conjunta",
        "O relatório final do ciclo de testes",
        "A documentação de todos os defeitos encontrados",
      ],
      correta: 1,
      explicacao: "Uma suíte de testes (test suite) é um agrupamento de casos de teste que serão executados juntos, geralmente por terem escopo ou contexto relacionados — ex: suíte de regressão, suíte de smoke test.",
    },
    {
      pergunta: "Qual é a diferença entre critério de entrada e critério de saída?",
      opcoes: [
        "Critério de entrada é para o projeto; critério de saída é para o produto",
        "Critério de entrada define quando o teste COMEÇA; critério de saída define quando o teste TERMINA",
        "São usados em diferentes tipos de teste: funcional e não-funcional",
        "Critério de entrada é obrigatório; critério de saída é opcional",
      ],
      correta: 1,
      explicacao: "Critério de entrada (entry criteria): condições para iniciar o teste — ex: build disponível, ambiente configurado. Critério de saída (exit criteria): condições para encerrar — ex: 95% dos casos executados, zero bugs críticos abertos.",
    },
    {
      pergunta: "Qual é a definição de 'base de teste'?",
      opcoes: [
        "O ambiente de teste (servidor, banco de dados, ferramentas)",
        "A equipe responsável pelos testes",
        "Toda informação usada para derivar casos de teste",
        "O conjunto de defeitos conhecidos do sistema",
      ],
      correta: 2,
      explicacao: "A base de teste inclui tudo que é usado para identificar o que testar: requisitos, especificações funcionais, código-fonte, modelos de arquitetura, histórias de usuário, regras de negócio documentadas.",
    },
  ],
};
```

- [ ] **Step 4: Build check**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 5: Commit**

```bash
git add src/data/guia/gerenciamento-de-atividades-de-teste.ts src/data/guia/ferramentas-de-suporte-ao-teste.ts src/data/guia/glossario-ctfl.ts
git commit -m "feat: artigos /guia — Cap.5, Cap.6 e glossário CTFL"
```

---

## Task 7: Artigos Playwright (4 artigos)

**Files:**
- Create: `src/data/guia/o-que-e-playwright.ts`
- Create: `src/data/guia/playwright-para-iniciantes.ts`
- Create: `src/data/guia/locators-e-page-object-model.ts`
- Create: `src/data/guia/playwright-em-ci-cd.ts`

- [ ] **Step 1: Criar `src/data/guia/o-que-e-playwright.ts`**

```ts
import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "o-que-e-playwright",
  titulo: "O que é Playwright: automação moderna de testes web",
  descricao: "Introdução ao Playwright, comparação com Selenium e Cypress, casos de uso e por que aprender em 2025.",
  secao: "playwright",
  tempoLeitura: 8,
  nivel: "iniciante",
  secoes: [
    {
      titulo: "O que é o Playwright?",
      conteudo: `<p>O <strong>Playwright</strong> é um framework de automação de testes web de código aberto desenvolvido pela <strong>Microsoft</strong>. Lançado em 2020, tornou-se rapidamente uma das ferramentas mais adotadas por equipes de QA em todo o mundo.</p>
<p>O Playwright permite escrever testes que simulam ações reais do usuário em um navegador — clicar, preencher formulários, navegar entre páginas, fazer upload de arquivos, interceptar requisições de rede. E faz isso de forma <strong>confiável e rápida</strong>, com suporte nativo a Chromium, Firefox e WebKit (Safari).</p>
<p>Ao contrário de soluções mais antigas, o Playwright foi projetado desde o início para web moderna: aplicações SPA, autenticação OAuth, múltiplas abas, iframes, downloads e muito mais.</p>`,
    },
    {
      titulo: "Playwright vs Selenium vs Cypress",
      conteudo: `<p>As três ferramentas mais populares de automação web têm características distintas:</p>
<ul>
<li><strong>Selenium:</strong> a mais antiga e amplamente adotada. Suporta quase todas as linguagens e navegadores. Porém, é verboso, mais lento e requer configuração complexa (WebDriver). Ainda domina ambientes enterprise legacy.</li>
<li><strong>Cypress:</strong> surgiu como alternativa mais simples ao Selenium. Fácil de configurar, com ótima DX (developer experience). Limitação: só roda no Chrome/Edge e opera dentro do navegador, o que cria restrições para cenários multi-origem (cross-origin) e múltiplas abas.</li>
<li><strong>Playwright:</strong> combina o melhor dos dois. Suporta múltiplos browsers (incluindo Firefox e Safari), múltiplas abas e origens, é mais rápido que Selenium, e tem API moderna. Desvantagem: curva de aprendizado um pouco maior que Cypress para iniciantes.</li>
</ul>
<p>Em 2025, o Playwright é a escolha padrão para novos projetos que precisam de cobertura multi-browser.</p>`,
    },
    {
      titulo: "Casos de uso do Playwright",
      conteudo: `<p>O Playwright é adequado para:</p>
<ul>
<li><strong>Testes de ponta a ponta (E2E):</strong> simular fluxos completos de usuário — cadastro, login, checkout, etc.</li>
<li><strong>Testes de regressão visual:</strong> comparar screenshots para detectar mudanças visuais não intencionais.</li>
<li><strong>Testes de API:</strong> o Playwright tem cliente HTTP integrado, permitindo combinar testes de UI e API no mesmo framework.</li>
<li><strong>Scraping e monitoramento:</strong> extrair dados de páginas web ou verificar disponibilidade de serviços.</li>
<li><strong>Geração de PDFs e screenshots:</strong> automação de relatórios ou capturas programáticas de páginas.</li>
</ul>`,
    },
    {
      titulo: "Por que aprender Playwright em 2025?",
      conteudo: `<p>Alguns indicadores concretos do crescimento do Playwright:</p>
<ul>
<li>Mais de <strong>65.000 estrelas no GitHub</strong> e adoção crescente em pesquisas da comunidade de QA</li>
<li>Suporte oficial de Microsoft, Google e outras grandes empresas</li>
<li>Integrado nativamente em frameworks como Next.js, NestJS e ferramentas como VS Code</li>
<li>Vagas de emprego que mencionam Playwright cresceram mais de 200% entre 2022 e 2024 no LinkedIn</li>
</ul>
<p>Para QAs que querem evoluir para automação, o Playwright é atualmente o investimento com melhor retorno: community ativa, documentação excelente e demanda crescente no mercado.</p>`,
    },
  ],
  quiz: [
    {
      pergunta: "Qual empresa desenvolveu o Playwright?",
      opcoes: ["Google", "Meta", "Microsoft", "Amazon"],
      correta: 2,
      explicacao: "O Playwright foi desenvolvido pela Microsoft e lançado como open source em 2020. A equipe é formada por ex-desenvolvedores do Google que trabalharam no Puppeteer.",
    },
    {
      pergunta: "Qual é a principal limitação do Cypress em relação ao Playwright?",
      opcoes: [
        "Cypress não tem suporte a TypeScript",
        "Cypress só suporta Chrome/Edge e tem restrições para múltiplas abas e cross-origin",
        "Cypress não tem integração com CI/CD",
        "Cypress é pago para projetos comerciais",
      ],
      correta: 1,
      explicacao: "O Cypress opera dentro do contexto do navegador, o que cria limitações para cenários multi-origem (cross-origin) e múltiplas abas. O Playwright não tem essas limitações pois usa o protocolo CDP/WebSocket fora do navegador.",
    },
    {
      pergunta: "Para qual cenário o Playwright NÃO é adequado?",
      opcoes: [
        "Testes E2E multi-browser",
        "Testes de regressão visual",
        "Testes de performance/carga com milhares de usuários simultâneos",
        "Testes de API combinados com UI",
      ],
      correta: 2,
      explicacao: "O Playwright não é uma ferramenta de teste de carga/performance. Para simular milhares de usuários simultâneos, usam-se ferramentas como k6, JMeter ou Gatling. O Playwright opera uma instância de browser por vez.",
    },
    {
      pergunta: "Quais navegadores o Playwright suporta nativamente?",
      opcoes: [
        "Apenas Chromium",
        "Chromium e Firefox",
        "Chromium, Firefox e WebKit (Safari)",
        "Qualquer navegador via WebDriver"],
      correta: 2,
      explicacao: "O Playwright tem engines nativas para Chromium, Firefox e WebKit (o motor do Safari). Isso permite testar em ambientes que representam Chrome, Firefox e Safari sem precisar de WebDriver ou configuração extra.",
    },
    {
      pergunta: "O que diferencia o Playwright do Selenium em termos de velocidade?",
      opcoes: [
        "Playwright usa múltiplas threads; Selenium é single-threaded",
        "Playwright usa protocolo nativo de cada browser (CDP/WebSocket); Selenium usa WebDriver com HTTP",
        "Playwright só testa em modo headless; Selenium abre o browser",
        "Playwright não suporta testes síncronos; Selenium sim",
      ],
      correta: 1,
      explicacao: "O Playwright se comunica com o browser via protocolo nativo (CDP para Chromium, protocolo próprio para Firefox/WebKit), sem a camada extra do WebDriver HTTP. Isso reduz latência e torna os testes mais rápidos e confiáveis.",
    },
  ],
};
```

- [ ] **Step 2: Criar `src/data/guia/playwright-para-iniciantes.ts`**

```ts
import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "playwright-para-iniciantes",
  titulo: "Playwright para iniciantes: primeiros passos",
  descricao: "Como instalar o Playwright, escrever o primeiro teste, executar e interpretar resultados.",
  secao: "playwright",
  tempoLeitura: 10,
  nivel: "iniciante",
  secoes: [
    {
      titulo: "Instalação e configuração",
      conteudo: `<p>O Playwright requer <strong>Node.js 18+</strong>. A instalação é feita via npm:</p>
<pre><code>npm init playwright@latest</code></pre>
<p>O assistente de instalação pergunta: usar TypeScript ou JavaScript, onde colocar os testes, se adicionar GitHub Actions CI. Recomenda-se TypeScript para projetos profissionais.</p>
<p>Ao final, são criados:</p>
<ul>
<li><code>playwright.config.ts</code> — configuração global (browsers, baseURL, timeout)</li>
<li><code>tests/</code> — diretório de testes</li>
<li><code>tests-examples/</code> — exemplos para referência</li>
</ul>
<p>Para baixar os browsers necessários:</p>
<pre><code>npx playwright install</code></pre>`,
    },
    {
      titulo: "Primeiro teste",
      conteudo: `<p>Um teste básico no Playwright verifica se uma página carrega corretamente:</p>
<pre><code>import { test, expect } from '@playwright/test';

test('página inicial carrega com título correto', async ({ page }) => {
  await page.goto('https://meusite.com');
  await expect(page).toHaveTitle(/Meu Site/);
});

test('botão de login está visível', async ({ page }) => {
  await page.goto('https://meusite.com');
  await expect(page.getByRole('link', { name: 'Entrar' })).toBeVisible();
});</code></pre>
<p>Para executar:</p>
<pre><code>npx playwright test</code></pre>
<p>Para rodar com interface visual:</p>
<pre><code>npx playwright test --ui</code></pre>`,
    },
    {
      titulo: "Interações básicas",
      conteudo: `<p>As interações mais comuns:</p>
<pre><code>// Clicar em elemento
await page.getByRole('button', { name: 'Salvar' }).click();

// Preencher campo
await page.getByLabel('E-mail').fill('usuario@teste.com');

// Selecionar opção em dropdown
await page.getByLabel('País').selectOption('Brasil');

// Fazer upload de arquivo
await page.getByLabel('Arquivo').setInputFiles('documento.pdf');

// Aguardar elemento aparecer
await page.getByText('Salvo com sucesso').waitFor();</code></pre>
<p>O Playwright tem <strong>auto-waiting</strong> embutido: antes de cada ação, ele aguarda automaticamente que o elemento esteja visível, estável e habilitado. Isso elimina a maioria dos <code>sleep()</code> e <code>waitFor()</code> explícitos que infestam testes em Selenium.</p>`,
    },
    {
      titulo: "Interpretando resultados",
      conteudo: `<p>Após executar os testes, o Playwright gera um relatório HTML:</p>
<pre><code>npx playwright show-report</code></pre>
<p>O relatório mostra: testes passando/falhando, tempo de execução, screenshots automáticos de falhas, traces (gravação completa da execução para debugging).</p>
<p>Para depurar um teste específico em modo visual:</p>
<pre><code>npx playwright test meu-teste.spec.ts --debug</code></pre>
<p>O Playwright Inspector abre ao lado do browser, permitindo avançar passo a passo e ver o estado do DOM em cada instrução.</p>`,
    },
  ],
  quiz: [
    {
      pergunta: "Qual comando instala os browsers necessários para o Playwright?",
      opcoes: ["npm install playwright", "npx playwright install", "npx playwright setup", "npm run playwright:install"],
      correta: 1,
      explicacao: "'npx playwright install' baixa os binários dos browsers (Chromium, Firefox, WebKit) que o Playwright usa. Sem esse passo, os testes falham com erro de browser não encontrado.",
    },
    {
      pergunta: "O que é 'auto-waiting' no Playwright?",
      opcoes: [
        "O Playwright espera automaticamente o timeout máximo antes de falhar",
        "O Playwright aguarda automaticamente que elementos estejam visíveis e estáveis antes de interagir",
        "Os testes aguardam automaticamente a resposta do servidor",
        "O Playwright re-executa testes falhos automaticamente",
      ],
      correta: 1,
      explicacao: "Auto-waiting significa que o Playwright, antes de executar qualquer ação (click, fill, etc.), aguarda automaticamente que o elemento esteja visível, habilitado e estável. Isso elimina a maioria dos flaky tests causados por timing issues.",
    },
    {
      pergunta: "Como rodar os testes do Playwright com interface visual interativa?",
      opcoes: ["npx playwright test --headed", "npx playwright test --ui", "npx playwright open", "npx playwright test --visual"],
      correta: 1,
      explicacao: "'npx playwright test --ui' abre o Playwright UI Mode, uma interface gráfica que permite selecionar e executar testes individualmente, ver o browser em tempo real e acompanhar a execução passo a passo.",
    },
    {
      pergunta: "Como selecionar um botão pelo seu texto visível no Playwright?",
      opcoes: [
        "page.find('button').withText('Salvar').click()",
        "page.getByRole('button', { name: 'Salvar' }).click()",
        "page.querySelector('button:contains(Salvar)').click()",
        "page.locator('button').filter('Salvar').click()",
      ],
      correta: 1,
      explicacao: "'getByRole' com o parâmetro 'name' é a forma recomendada de selecionar elementos por papel semântico e texto acessível. Locators baseados em role são mais robustos que seletores CSS ou XPath.",
    },
    {
      pergunta: "Para que serve o 'trace' do Playwright?",
      opcoes: [
        "Para medir a performance de cada ação do teste",
        "Para gravar a execução completa e permitir debugging detalhado após uma falha",
        "Para rastrear requisições de rede feitas durante o teste",
        "Para registrar os logs do console do browser",
      ],
      correta: 1,
      explicacao: "O trace é uma gravação completa da execução do teste: screenshots de cada passo, DOM snapshot, logs de rede, erros do console. Permite entender exatamente o que aconteceu em um teste que falhou, sem precisar reproduzir manualmente.",
    },
  ],
};
```

- [ ] **Step 3: Criar `src/data/guia/locators-e-page-object-model.ts`**

```ts
import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "locators-e-page-object-model",
  titulo: "Locators, assertivas e Page Object Model no Playwright",
  descricao: "Como usar locators robustos, escrever assertivas eficientes e organizar testes com o padrão POM.",
  secao: "playwright",
  tempoLeitura: 12,
  nivel: "intermediário",
  secoes: [
    {
      titulo: "Locators: como encontrar elementos de forma robusta",
      conteudo: `<p>Um locator frágil quebra com qualquer mudança de CSS class ou estrutura HTML. O Playwright recomenda uma hierarquia de preferência:</p>
<ol>
<li><strong>getByRole:</strong> usa atributos ARIA — o mais robusto e acessível. <code>page.getByRole('button', { name: 'Enviar' })</code></li>
<li><strong>getByLabel:</strong> encontra campos de formulário pelo label associado. <code>page.getByLabel('Nome completo')</code></li>
<li><strong>getByPlaceholder:</strong> para inputs sem label. <code>page.getByPlaceholder('Digite seu e-mail')</code></li>
<li><strong>getByText:</strong> elemento pelo conteúdo de texto. <code>page.getByText('Bem-vindo, João')</code></li>
<li><strong>getByTestId:</strong> atributo data-testid. <code>page.getByTestId('submit-button')</code></li>
<li><strong>locator (CSS/XPath):</strong> último recurso. Frágil, evitar sempre que possível.</li>
</ol>`,
    },
    {
      titulo: "Assertivas (expect)",
      conteudo: `<p>O Playwright tem assertivas com retry automático — ele fica tentando até o timeout antes de falhar:</p>
<pre><code>// Visibilidade
await expect(page.getByText('Salvo!')).toBeVisible();
await expect(page.getByRole('button', { name: 'Excluir' })).toBeHidden();

// Conteúdo
await expect(page.getByRole('heading')).toHaveText('Bem-vindo');
await expect(page.getByLabel('Nome')).toHaveValue('Maria');

// URL e título
await expect(page).toHaveURL('/dashboard');
await expect(page).toHaveTitle('Dashboard — MeuApp');

// Elemento habilitado/desabilitado
await expect(page.getByRole('button', { name: 'Salvar' })).toBeEnabled();
await expect(page.getByRole('button', { name: 'Enviar' })).toBeDisabled();</code></pre>`,
    },
    {
      titulo: "Page Object Model (POM)",
      conteudo: `<p>O <strong>Page Object Model</strong> é um padrão de design que encapsula a lógica de interação com cada página em uma classe separada. Benefícios: reutilização, legibilidade e manutenção centralizada.</p>
<pre><code>// pages/LoginPage.ts
import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, senha: string) {
    await this.page.getByLabel('E-mail').fill(email);
    await this.page.getByLabel('Senha').fill(senha);
    await this.page.getByRole('button', { name: 'Entrar' }).click();
  }

  async getErroMensagem() {
    return this.page.getByRole('alert').textContent();
  }
}

// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('login com credenciais inválidas mostra erro', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('invalido@teste.com', 'senha-errada');
  expect(await loginPage.getErroMensagem()).toContain('Credenciais inválidas');
});</code></pre>`,
    },
    {
      titulo: "Fixtures e reutilização de autenticação",
      conteudo: `<p>O Playwright permite criar <strong>fixtures</strong> — objetos reutilizáveis injetados em cada teste. O caso mais comum é autenticação: em vez de fazer login em cada teste, você faz uma vez e reutiliza a sessão.</p>
<pre><code>// fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

export const test = base.extend({
  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('usuario@teste.com', 'senha123');
    await page.waitForURL('/dashboard');
    await use(page); // injeta a página autenticada no teste
  },
});

// tests/dashboard.spec.ts
import { test } from '../fixtures';
import { expect } from '@playwright/test';

test('dashboard mostra nome do usuário', async ({ loggedInPage }) => {
  await expect(loggedInPage.getByText('Olá, Usuário')).toBeVisible();
});</code></pre>`,
    },
  ],
  quiz: [
    {
      pergunta: "Qual é o locator mais recomendado pelo Playwright para encontrar botões?",
      opcoes: [
        "page.locator('button.submit-btn')",
        "page.getByRole('button', { name: 'Texto do botão' })",
        "page.querySelector('button[type=submit]')",
        "page.getByTestId('submit-button')",
      ],
      correta: 1,
      explicacao: "getByRole é o locator mais robusto pois usa atributos ARIA semânticos. Não quebra com mudanças de CSS class ou estrutura HTML, e ainda valida a acessibilidade do elemento.",
    },
    {
      pergunta: "Por que as assertivas do Playwright têm 'retry automático'?",
      opcoes: [
        "Para re-executar o teste completo em caso de falha",
        "Para aguardar que a condição seja verdadeira antes de falhar, evitando flaky tests",
        "Para tentar em múltiplos browsers automaticamente",
        "Para repetir a ação até o elemento ser encontrado",
      ],
      correta: 1,
      explicacao: "O retry automático nas assertivas (expect) significa que o Playwright verifica a condição repetidamente até o timeout. Isso é essencial para interfaces assíncronas onde elementos aparecem após carregar dados — sem retry, o teste falharia prematuramente.",
    },
    {
      pergunta: "Qual é o principal benefício do padrão Page Object Model?",
      opcoes: [
        "Aumenta a velocidade de execução dos testes",
        "Centraliza a lógica de interação com cada página, facilitando manutenção",
        "Permite executar testes em paralelo automaticamente",
        "Elimina a necessidade de escrever assertivas",
      ],
      correta: 1,
      explicacao: "O POM centraliza os seletores e interações de cada página em uma classe. Se um elemento muda (ex: o botão de login muda de id), você atualiza em um único lugar em vez de procurar em dezenas de testes.",
    },
    {
      pergunta: "O que são 'fixtures' no Playwright?",
      opcoes: [
        "Dados de teste fixos (usuários, produtos) usados nos testes",
        "Objetos reutilizáveis injetados em testes, como uma sessão autenticada",
        "Configurações fixas do playwright.config.ts",
        "Screenshots capturadas durante os testes",
      ],
      correta: 1,
      explicacao: "Fixtures são recursos reutilizáveis injetados nos testes via dependência. O caso mais comum é uma página já autenticada — você faz o login uma vez na fixture e todos os testes que dependem dela recebem a sessão pronta.",
    },
    {
      pergunta: "Qual assertiva verifica que um elemento está presente no DOM mas invisível ao usuário?",
      opcoes: [
        "expect(elemento).toBeHidden()",
        "expect(elemento).not.toBeVisible()",
        "expect(elemento).toBeInvisible()",
        "expect(elemento).toHaveDisplay('none')",
      ],
      correta: 0,
      explicacao: "toBeHidden() verifica que o elemento está oculto (display:none, visibility:hidden, ou opacity:0). É diferente de not.toBeVisible() que também passa para elementos não presentes no DOM.",
    },
  ],
};
```

- [ ] **Step 4: Criar `src/data/guia/playwright-em-ci-cd.ts`**

```ts
import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "playwright-em-ci-cd",
  titulo: "Playwright em CI/CD: boas práticas e relatórios",
  descricao: "Integrar Playwright em GitHub Actions, gerar relatórios HTML, depurar falhas e escalar a suíte de testes.",
  secao: "playwright",
  tempoLeitura: 11,
  nivel: "intermediário",
  secoes: [
    {
      titulo: "Configurando o Playwright no GitHub Actions",
      conteudo: `<p>O Playwright gera um workflow de CI pronto durante a instalação. Se precisar criar manualmente:</p>
<pre><code># .github/workflows/playwright.yml
name: Playwright Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30</code></pre>`,
    },
    {
      titulo: "Relatórios e artefatos",
      conteudo: `<p>Configure o relatório HTML no <code>playwright.config.ts</code>:</p>
<pre><code>import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'], // output no terminal
  ],
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
});</code></pre>
<p>Com essa configuração, cada teste que falha gera automaticamente: screenshot do momento da falha, vídeo da execução completa e um trace para análise detalhada. Esses artefatos ficam disponíveis no GitHub Actions por 30 dias.</p>`,
    },
    {
      titulo: "Execução paralela e sharding",
      conteudo: `<p>O Playwright executa testes em paralelo por padrão (workers = número de CPUs). Para grandes suítes, use <strong>sharding</strong> para distribuir entre múltiplas máquinas de CI:</p>
<pre><code># playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 2 : undefined,
});

# Executar shard 1 de 4 no CI:
npx playwright test --shard=1/4</code></pre>
<p>Com 4 máquinas em paralelo, uma suíte de 200 testes que levaria 20 minutos passa a levar ~5 minutos. O Playwright Merge Reports combina os relatórios de todos os shards no final.</p>`,
    },
    {
      titulo: "Debugging de testes flaky",
      conteudo: `<p>Testes <strong>flaky</strong> (que falham intermitentemente) são o maior problema em suítes de E2E. Estratégias para identificar e corrigir:</p>
<ul>
<li><strong>Use trace no modo CI:</strong> <code>trace: 'on-first-retry'</code> grava o trace apenas quando um teste é re-tentado, capturando o problema sem overhead constante.</li>
<li><strong>Evite hardcoded waits:</strong> substituir <code>await page.waitForTimeout(2000)</code> por assertivas com retry — <code>await expect(elemento).toBeVisible()</code>.</li>
<li><strong>Isole o estado de cada teste:</strong> use fixtures de autenticação e limpe dados entre testes. Testes que dependem de estado compartilhado falham de forma imprevisível.</li>
<li><strong>Use --repeat-each para reproduzir flakiness:</strong> <code>npx playwright test --repeat-each=5</code> executa cada teste 5 vezes, revelando falhas intermitentes.</li>
</ul>`,
    },
  ],
  quiz: [
    {
      pergunta: "Qual configuração faz o Playwright capturar screenshot apenas quando um teste falha?",
      opcoes: [
        "screenshot: 'always'",
        "screenshot: 'only-on-failure'",
        "screenshot: 'on-failure'",
        "captureScreenshot: true",
      ],
      correta: 1,
      explicacao: "A configuração 'screenshot: only-on-failure' no use do playwright.config.ts faz screenshots serem capturadas e anexadas ao relatório apenas para testes que falharam, economizando espaço em disco e tempo de execução.",
    },
    {
      pergunta: "O que é 'sharding' no contexto do Playwright CI?",
      opcoes: [
        "Dividir os testes por browser (shard = browser)",
        "Distribuir a suíte de testes entre múltiplas máquinas para execução paralela",
        "Agrupar testes por funcionalidade",
        "Armazenar os resultados dos testes em diferentes formatos",
      ],
      correta: 1,
      explicacao: "Sharding divide a suíte de testes entre N máquinas de CI. Com 4 shards, cada máquina executa 1/4 dos testes, reduzindo o tempo total de execução por um fator de ~4x.",
    },
    {
      pergunta: "Qual é a melhor estratégia para substituir 'await page.waitForTimeout(3000)' em um teste Playwright?",
      opcoes: [
        "Aumentar o timeout para 5000ms",
        "Usar uma assertiva com retry: await expect(elemento).toBeVisible()",
        "Usar page.waitForLoadState('networkidle')",
        "Adicionar um try/catch em volta da ação",
      ],
      correta: 1,
      explicacao: "waitForTimeout é um sleep fixo — frágil e lento. Assertivas com retry (expect().toBeVisible(), expect().toHaveText()) esperam exatamente pelo que você precisa, sem esperar mais do que necessário.",
    },
    {
      pergunta: "O que a configuração 'trace: retain-on-failure' faz?",
      opcoes: [
        "Gera traces para todos os testes sempre",
        "Gera e salva o trace apenas para testes que falharam",
        "Desabilita o trace em CI",
        "Gera trace apenas no primeiro retry",
      ],
      correta: 1,
      explicacao: "'retain-on-failure' grava o trace durante a execução, mas salva o arquivo apenas se o teste falhar. Isso permite debugging detalhado sem o overhead de salvar artefatos para cada teste que passa.",
    },
    {
      pergunta: "Qual comando executa um teste Playwright 5 vezes seguidas para detectar flakiness?",
      opcoes: [
        "npx playwright test --retry=5",
        "npx playwright test --repeat-each=5",
        "npx playwright test --flaky=5",
        "npx playwright test --runs=5",
      ],
      correta: 1,
      explicacao: "--repeat-each=N executa cada teste N vezes consecutivas. É útil para detectar testes flaky que falham intermitentemente — se um teste falha em 2 de 5 execuções, ele precisa ser investigado.",
    },
  ],
};
```

- [ ] **Step 5: Build check**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 6: Commit**

```bash
git add src/data/guia/o-que-e-playwright.ts src/data/guia/playwright-para-iniciantes.ts src/data/guia/locators-e-page-object-model.ts src/data/guia/playwright-em-ci-cd.ts
git commit -m "feat: artigos /guia — 4 artigos Playwright"
```

---

## Task 8: Artigos English for QA (4 artigos)

**Files:**
- Create: `src/data/guia/ingles-para-qa.ts`
- Create: `src/data/guia/vocabulario-tecnico-qa-ingles.ts`
- Create: `src/data/guia/comunicacao-qa-ingles.ts`
- Create: `src/data/guia/entrevista-tecnica-qa-ingles.ts`

- [ ] **Step 1: Criar `src/data/guia/ingles-para-qa.ts`**

```ts
import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "ingles-para-qa",
  titulo: "Inglês para QA: por que é essencial e como começar",
  descricao: "Por que o inglês é indispensável na carreira de QA, vocabulário básico e como desenvolver o idioma do zero.",
  secao: "ingles",
  tempoLeitura: 8,
  nivel: "iniciante",
  secoes: [
    {
      titulo: "Por que o inglês é essencial para QA?",
      conteudo: `<p>O inglês é a língua franca da tecnologia, e na área de QA isso é especialmente verdadeiro:</p>
<ul>
<li><strong>Documentação técnica:</strong> toda documentação do Selenium, Playwright, Cypress, JIRA, ferramentas de CI/CD está em inglês. Ler fluentemente economiza horas de tradução e evita mal-entendidos.</li>
<li><strong>Certificações:</strong> o syllabus oficial do ISTQB é em inglês. Mesmo traduzido, muitos termos técnicos não têm equivalente exato em português.</li>
<li><strong>Vagas internacionais e remoto:</strong> as melhores vagas remotas — muitas com salários em dólar ou euro — exigem inglês para comunicação com o time.</li>
<li><strong>Bug reports e comunicação:</strong> em times com desenvolvedores de outros países, bugs, histórias de usuário e code reviews são escritos em inglês.</li>
<li><strong>Comunidade:</strong> Stack Overflow, GitHub Issues, conferências de QA — tudo em inglês.</li>
</ul>`,
    },
    {
      titulo: "Vocabulário básico: termos que você vai usar todo dia",
      conteudo: `<p>Mesmo com inglês básico, dominar esses termos já muda sua comunicação:</p>
<ul>
<li><strong>Bug / Defect:</strong> defeito de software</li>
<li><strong>Test case:</strong> caso de teste</li>
<li><strong>Test suite:</strong> conjunto de casos de teste</li>
<li><strong>Sprint:</strong> ciclo de desenvolvimento no Scrum</li>
<li><strong>Backlog:</strong> lista de itens a fazer</li>
<li><strong>User story:</strong> história de usuário</li>
<li><strong>Acceptance criteria:</strong> critérios de aceite</li>
<li><strong>Release:</strong> versão liberada do software</li>
<li><strong>Deploy:</strong> publicação do software no servidor</li>
<li><strong>Regression:</strong> regressão — funcionalidade que parou de funcionar</li>
<li><strong>Smoke test:</strong> teste rápido de sanidade básica</li>
<li><strong>Hotfix:</strong> correção urgente em produção</li>
</ul>`,
    },
    {
      titulo: "Como desenvolver o inglês tendo base zero",
      conteudo: `<p>A melhor estratégia combina <strong>imersão técnica</strong> com <strong>prática ativa</strong>:</p>
<ul>
<li><strong>Leia documentação técnica em inglês:</strong> comece com documentação do Playwright ou JIRA. Use o tradutor para termos desconhecidos, mas não traduza tudo — force-se a inferir pelo contexto.</li>
<li><strong>Escreva seus bug reports em inglês:</strong> mesmo que só você veja, crie o hábito. Templates de bug report em inglês estão no próximo artigo.</li>
<li><strong>Assista com legenda em inglês:</strong> conteúdo técnico (YouTube, talks de conferências) com legenda em inglês ajuda a conectar som e texto.</li>
<li><strong>Apps de idioma com foco técnico:</strong> o curso English for QA do TestPath combina vocabulário específico de QA com lições progressivas e avaliação de pronúncia por IA.</li>
<li><strong>Participe de comunidades em inglês:</strong> responda e pergunte em fóruns como Stack Overflow e GitHub Issues.</li>
</ul>`,
    },
    {
      titulo: "Em quanto tempo você consegue comunicar em inglês para QA?",
      conteudo: `<p>Uma estimativa realista:</p>
<ul>
<li><strong>30 dias de estudo focado (30min/dia):</strong> consegue escrever bug reports básicos e ler documentação com auxílio do tradutor</li>
<li><strong>3 meses:</strong> lê documentação fluidamente, escreve emails e comentários de code review em inglês</li>
<li><strong>6 meses:</strong> participa de reuniões simples, entende dailies e planning em inglês</li>
<li><strong>1 ano:</strong> conduz conversas técnicas e entrevistas com desenvolvedores estrangeiros</li>
</ul>
<p>O segredo não é velocidade — é <strong>consistência</strong>. 20 minutos por dia por um ano supera 3 horas por dia por um mês.</p>`,
    },
  ],
  quiz: [
    {
      pergunta: "O que é um 'hotfix' em inglês técnico de QA?",
      opcoes: [
        "Um teste de performance em ambiente quente (produção)",
        "Uma correção urgente aplicada diretamente em produção",
        "Um recurso novo adicionado fora do sprint",
        "Um bug de alta prioridade ainda não corrigido",
      ],
      correta: 1,
      explicacao: "Hotfix é uma correção urgente aplicada diretamente em produção (ou em uma branch de release), sem passar pelo ciclo normal de desenvolvimento e sprint. É usado quando um bug crítico afeta usuários em produção.",
    },
    {
      pergunta: "O que significa 'acceptance criteria' em histórias de usuário?",
      opcoes: [
        "Os critérios para aceitar um novo membro na equipe",
        "As condições que devem ser atendidas para a história de usuário ser considerada concluída",
        "A lista de bugs que devem ser corrigidos antes do release",
        "Os requisitos não-funcionais do sistema",
      ],
      correta: 1,
      explicacao: "Acceptance criteria (critérios de aceite) definem as condições que uma história de usuário deve satisfazer para ser considerada 'done'. São usados pelo QA para criar casos de teste e pelo Product Owner para validar a entrega.",
    },
    {
      pergunta: "O que é um 'smoke test'?",
      opcoes: [
        "Teste de performance sob carga alta (como 'fumaça' de esforço intenso)",
        "Teste rápido das funcionalidades básicas para verificar que o build está minimamente estável",
        "Teste exploratório sem roteiro definido",
        "Teste de segurança que verifica vulnerabilidades críticas",
      ],
      correta: 1,
      explicacao: "Smoke test (ou sanity test) é um conjunto pequeno de testes que verifica as funcionalidades críticas básicas do sistema após um novo build. Se o smoke test falha, o build é rejeitado antes de testes mais profundos.",
    },
    {
      pergunta: "Por que o inglês técnico de QA é diferente do inglês geral?",
      opcoes: [
        "Não é diferente — inglês geral é suficiente para trabalhar em QA",
        "O inglês de QA tem vocabulário específico (bug, sprint, deploy, regression) que não aparece no inglês cotidiano",
        "O inglês de QA é mais formal e usa gramática diferente",
        "O inglês de QA é baseado em inglês britânico, não americano",
      ],
      correta: 1,
      explicacao: "O inglês técnico de QA inclui jargão específico (sprint, backlog, regression, hotfix, deploy, smoke test) que não faz parte do vocabulário cotidiano. Dominar esse vocabulário técnico específico é o primeiro passo mais produtivo para QAs.",
    },
    {
      pergunta: "Qual é a estratégia mais eficiente para desenvolver inglês para QA?",
      opcoes: [
        "Fazer um curso intensivo de inglês geral por 3 meses",
        "Combinar imersão em conteúdo técnico em inglês com prática ativa de escrita",
        "Traduzir toda a documentação para português antes de ler",
        "Esperar ter nível B2 geral antes de usar inglês no trabalho",
      ],
      correta: 1,
      explicacao: "A combinação de imersão técnica (ler docs em inglês, assistir talks) com prática ativa (escrever bug reports em inglês, participar de fóruns) cria aprendizado contextualizado e mais rápido do que cursos de inglês geral desconectados do trabalho.",
    },
  ],
};
```

- [ ] **Step 2: Criar `src/data/guia/vocabulario-tecnico-qa-ingles.ts`**

```ts
import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "vocabulario-tecnico-qa-ingles",
  titulo: "Vocabulário técnico de QA em inglês: bug reports e terminologia",
  descricao: "Os termos técnicos de teste mais usados em inglês: como escrever bug reports, user stories e documentação.",
  secao: "ingles",
  tempoLeitura: 10,
  nivel: "iniciante",
  secoes: [
    {
      titulo: "Como escrever um bug report em inglês",
      conteudo: `<p>Um bug report em inglês segue a mesma estrutura que em português, mas com terminologia específica:</p>
<pre><code>Title: [Short, descriptive summary of the bug]
Example: "Login button unresponsive after failed attempt"

Environment:
- Browser: Chrome 120 / macOS Sonoma
- Version: 2.4.1
- URL: https://app.example.com/login

Steps to Reproduce:
1. Navigate to /login
2. Enter invalid credentials
3. Click "Sign In"
4. Observe error message
5. Click "Sign In" again with valid credentials

Expected Result:
User should be redirected to the dashboard.

Actual Result:
The "Sign In" button becomes disabled and page does not respond.

Severity: High
Priority: Critical
Attachments: screenshot.png, console-log.txt</code></pre>`,
    },
    {
      titulo: "Termos de severidade e prioridade",
      conteudo: `<p>Entender as palavras para descrever severidade e prioridade é fundamental em ambientes internacionais:</p>
<p><strong>Severity levels:</strong></p>
<ul>
<li><strong>Critical / Blocker:</strong> impede o uso do sistema. Nenhum workaround disponível.</li>
<li><strong>High / Major:</strong> funcionalidade principal quebrada, mas há alternativa temporária.</li>
<li><strong>Medium / Minor:</strong> funcionalidade secundária afetada.</li>
<li><strong>Low / Trivial:</strong> problema cosmético ou de baixo impacto.</li>
</ul>
<p><strong>Priority levels:</strong></p>
<ul>
<li><strong>Urgent / P0:</strong> precisa ser corrigido imediatamente.</li>
<li><strong>High / P1:</strong> próximo sprint ou hotfix.</li>
<li><strong>Medium / P2:</strong> planejado para sprint futuro.</li>
<li><strong>Low / P3:</strong> backlog, sem data definida.</li>
</ul>`,
    },
    {
      titulo: "Vocabulário de Agile e JIRA",
      conteudo: `<p>Termos essenciais para trabalhar em ambiente Agile com JIRA em inglês:</p>
<ul>
<li><strong>Epic:</strong> grande funcionalidade que abrange várias histórias</li>
<li><strong>Story / User Story:</strong> funcionalidade descrita da perspectiva do usuário</li>
<li><strong>Task:</strong> unidade de trabalho técnico</li>
<li><strong>Subtask:</strong> parte de uma task maior</li>
<li><strong>In Progress:</strong> em andamento</li>
<li><strong>In Review / In QA:</strong> em revisão ou teste</li>
<li><strong>Done / Closed:</strong> concluído</li>
<li><strong>Blocked:</strong> impedido por outro item</li>
<li><strong>Assignee:</strong> responsável pelo item</li>
<li><strong>Reporter:</strong> quem reportou o bug</li>
<li><strong>Fix version:</strong> versão em que o bug será corrigido</li>
<li><strong>Reopened:</strong> bug que voltou após ser marcado como corrigido</li>
</ul>`,
    },
    {
      titulo: "Frases úteis para comentários e code review",
      conteudo: `<p>Comentários profissionais e construtivos em inglês:</p>
<p><strong>Reportando um bug:</strong></p>
<ul>
<li>"I was able to reproduce this on Chrome 120."</li>
<li>"This issue seems to be intermittent — happens ~3 out of 5 times."</li>
<li>"Attached screenshot and console log for reference."</li>
</ul>
<p><strong>Pedindo esclarecimentos:</strong></p>
<ul>
<li>"Could you clarify the expected behavior when the field is empty?"</li>
<li>"What should happen if the user submits the form without filling all required fields?"</li>
</ul>
<p><strong>Confirmando correção:</strong></p>
<ul>
<li>"Verified and closed. Fix is working as expected."</li>
<li>"Tested on all supported browsers. Marking as resolved."</li>
</ul>`,
    },
  ],
  quiz: [
    {
      pergunta: "Em um bug report em inglês, o que deve conter o campo 'Steps to Reproduce'?",
      opcoes: [
        "O código que causa o bug",
        "A sequência exata de ações para chegar ao comportamento incorreto",
        "O histórico de versões onde o bug apareceu",
        "A análise da causa raiz do defeito",
      ],
      correta: 1,
      explicacao: "'Steps to Reproduce' são as instruções passo a passo que permitem ao desenvolvedor reproduzir o bug exatamente. Sem eles, o bug frequentemente é marcado como 'cannot reproduce' e fechado sem correção.",
    },
    {
      pergunta: "Um bug que impede completamente o uso do sistema, sem workaround disponível, tem qual severidade?",
      opcoes: ["Low / Trivial", "Medium / Minor", "High / Major", "Critical / Blocker"],
      correta: 3,
      explicacao: "Critical ou Blocker é reservado para bugs que impedem completamente o uso do sistema ou de uma funcionalidade crítica, sem nenhuma alternativa temporária (workaround) disponível.",
    },
    {
      pergunta: "No JIRA, o que significa um item com status 'Blocked'?",
      opcoes: [
        "O item foi bloqueado pelo gerente e não pode ser alterado",
        "O item está impedido de avançar por uma dependência ou problema externo",
        "O item foi cancelado e não será mais desenvolvido",
        "O item tem bugs críticos que impedem seu fechamento",
      ],
      correta: 1,
      explicacao: "'Blocked' significa que o item não pode avançar devido a uma impedância externa — outra task não concluída, ambiente indisponível, decisão pendente. Blocked items devem ser discutidos na daily para remover o impedimento.",
    },
    {
      pergunta: "Como você diria em inglês que verificou a correção de um bug e ele está funcionando?",
      opcoes: [
        "'Bug is fixed, I think.'",
        "'Verified and closed. Fix is working as expected.'",
        "'The bug was corrected by the developer.'",
        "'I tested it and it seems OK now.'",
      ],
      correta: 1,
      explicacao: "'Verified and closed. Fix is working as expected.' é a forma profissional padrão. Inclui a ação (verified), o resultado (closed) e a confirmação do comportamento (working as expected).",
    },
    {
      pergunta: "O que é um 'workaround' em inglês técnico?",
      opcoes: [
        "Uma solução definitiva para um bug",
        "Uma solução temporária que permite continuar trabalhando apesar do bug",
        "Um teste que verifica se o bug foi corrigido",
        "Uma versão alternativa do software sem o bug",
      ],
      correta: 1,
      explicacao: "Workaround é uma solução temporária ou alternativa que permite ao usuário contornar o problema enquanto a correção definitiva não é entregue. Ex: 'Use o menu lateral em vez do botão com bug até a próxima release.'",
    },
  ],
};
```

- [ ] **Step 3: Criar `src/data/guia/comunicacao-qa-ingles.ts`**

```ts
import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "comunicacao-qa-ingles",
  titulo: "Comunicação em inglês para QA: dailies, reviews e retrospectivas",
  descricao: "Frases e expressões para participar de reuniões ágeis em inglês como QA: daily, planning, review e retro.",
  secao: "ingles",
  tempoLeitura: 10,
  nivel: "intermediário",
  secoes: [
    {
      titulo: "Daily Standup em inglês",
      conteudo: `<p>A daily standup segue o mesmo formato em qualquer idioma: o que fiz, o que vou fazer, algum impedimento. Em inglês:</p>
<p><strong>O que você fez ontem:</strong></p>
<ul>
<li>"Yesterday I finished testing the login flow — found 2 bugs and logged them in JIRA."</li>
<li>"I completed the regression test suite for the payment module."</li>
<li>"I reviewed the test cases for the new feature with the dev team."</li>
</ul>
<p><strong>O que você vai fazer hoje:</strong></p>
<ul>
<li>"Today I'm going to test the checkout flow."</li>
<li>"I'll be working on automating the smoke test suite."</li>
<li>"I'm planning to verify the hotfix for bug QA-123."</li>
</ul>
<p><strong>Impedimentos:</strong></p>
<ul>
<li>"I'm blocked — the test environment is down. Can someone from DevOps help?"</li>
<li>"I need clarification on the acceptance criteria for story #456 before I can start."</li>
<li>"No blockers from my side."</li>
</ul>`,
    },
    {
      titulo: "Sprint Planning em inglês",
      conteudo: `<p>Durante o planning, o QA precisa fazer perguntas sobre as histórias e critérios de aceite:</p>
<p><strong>Pedindo esclarecimentos:</strong></p>
<ul>
<li>"What's the expected behavior when the user leaves this field empty?"</li>
<li>"Are there any edge cases we should consider for this feature?"</li>
<li>"What are the acceptance criteria for this story?"</li>
<li>"Should this work the same way on mobile as on desktop?"</li>
</ul>
<p><strong>Estimando esforço de teste:</strong></p>
<ul>
<li>"Testing this story will take about 2 days — it has a lot of edge cases."</li>
<li>"I can test this quickly — it's a minor UI change."</li>
<li>"We'll need to run a full regression for this change since it touches the core authentication module."</li>
</ul>`,
    },
    {
      titulo: "Sprint Review em inglês",
      conteudo: `<p>Na review, o QA frequentemente apresenta o que foi testado e os resultados:</p>
<p><strong>Apresentando resultados de teste:</strong></p>
<ul>
<li>"The feature is working as expected. All 15 test cases passed."</li>
<li>"We found 3 bugs during testing. 2 were fixed before the release; 1 is a known issue tracked in QA-234."</li>
<li>"The payment flow has been tested on Chrome, Firefox, and Safari. No issues found."</li>
</ul>
<p><strong>Apresentando riscos:</strong></p>
<ul>
<li>"There's still a known issue with IE11 compatibility. We're monitoring it."</li>
<li>"Performance tests show a slight degradation under load — within acceptable limits but worth watching."</li>
</ul>`,
    },
    {
      titulo: "Retrospectiva em inglês",
      conteudo: `<p>Na retro, o QA contribui com observações sobre o processo de qualidade:</p>
<p><strong>O que funcionou bem (What went well):</strong></p>
<ul>
<li>"The early involvement of QA in the story refinement really helped — we caught ambiguities before development started."</li>
<li>"The automated regression suite saved us a lot of manual testing time this sprint."</li>
</ul>
<p><strong>O que pode melhorar (What could be better):</strong></p>
<ul>
<li>"We need a more stable test environment — it was down twice this sprint, blocking testing."</li>
<li>"Stories are often missing clear acceptance criteria, which makes it hard to define test cases upfront."</li>
</ul>
<p><strong>Ações (Action items):</strong></p>
<ul>
<li>"I'll create a template for acceptance criteria that the team can use starting next sprint."</li>
<li>"We'll add a QA environment health check to our daily checklist."</li>
</ul>`,
    },
  ],
  quiz: [
    {
      pergunta: "Como você diz em inglês que está bloqueado porque o ambiente de teste está fora do ar?",
      opcoes: [
        "'My test environment is not working, please help.'",
        "'I'm blocked — the test environment is down. Can someone from DevOps help?'",
        "'I cannot test because environment has problem.'",
        "'Testing is blocked by infrastructure issues.'",
      ],
      correta: 1,
      explicacao: "A frase profissional comunica: o estado (I'm blocked), o motivo específico (test environment is down) e o pedido de ajuda (Can someone from DevOps help?). Direto, claro e acionável.",
    },
    {
      pergunta: "Durante o sprint planning, como você pergunta sobre casos extremos (edge cases) de uma funcionalidade?",
      opcoes: [
        "'What about the strange cases?'",
        "'Are there any edge cases we should consider for this feature?'",
        "'What if something wrong happens with the feature?'",
        "'Do you have all the cases documented?'",
      ],
      correta: 1,
      explicacao: "'Are there any edge cases we should consider?' é a forma profissional de perguntar sobre cenários extremos ou incomuns que podem revelar bugs. 'Edge case' é o termo técnico correto no vocabulário de QA.",
    },
    {
      pergunta: "Como apresentar na sprint review que todos os testes passaram?",
      opcoes: [
        "'All tests are OK.'",
        "'The feature is working as expected. All 15 test cases passed.'",
        "'Testing is done, no problems found.'",
        "'We finished testing the feature.'",
      ],
      correta: 1,
      explicacao: "A resposta profissional especifica: que a funcionalidade atende ao esperado, quantos casos foram executados e o resultado. Detalhes concretos tornam o relatório mais confiável do que afirmações genéricas.",
    },
    {
      pergunta: "Na retrospectiva, como você propõe uma melhoria para o processo?",
      opcoes: [
        "'We need better acceptance criteria.'",
        "'Stories are often missing clear acceptance criteria — I'll create a template for next sprint.'",
        "'Acceptance criteria are always incomplete.'",
        "'The team should write better stories.'",
      ],
      correta: 1,
      explicacao: "A forma profissional identifica o problema (missing acceptance criteria), evita culpar pessoas, e propõe uma ação concreta (I'll create a template). Observações sem ação proposta geram pouco valor na retro.",
    },
    {
      pergunta: "O que significa 'known issue' em inglês técnico?",
      opcoes: [
        "Um bug que foi identificado e corrigido",
        "Um problema que foi identificado, documentado e aceito — mas ainda não corrigido",
        "Um bug que ocorre apenas em ambientes conhecidos (dev/staging)",
        "Uma funcionalidade que ainda não foi implementada",
      ],
      correta: 1,
      explicacao: "'Known issue' é um problema já identificado e documentado no sistema de rastreamento (JIRA), mas que não será corrigido neste ciclo. O time tem conhecimento dele e o produto pode ser liberado assim mesmo, com essa limitação documentada.",
    },
  ],
};
```

- [ ] **Step 4: Criar `src/data/guia/entrevista-tecnica-qa-ingles.ts`**

```ts
import type { ArtigoGuia } from "./types";

export const artigo: ArtigoGuia = {
  slug: "entrevista-tecnica-qa-ingles",
  titulo: "Preparação para entrevistas técnicas de QA em inglês",
  descricao: "As perguntas mais comuns em entrevistas de QA em inglês, como responder e vocabulário específico para cada tema.",
  secao: "ingles",
  tempoLeitura: 12,
  nivel: "intermediário",
  secoes: [
    {
      titulo: "As perguntas mais comuns e como responder",
      conteudo: `<p>Entrevistas de QA em inglês costumam começar com perguntas conceituais:</p>
<p><strong>"What is the difference between verification and validation?"</strong></p>
<p>Resposta modelo: "Verification checks that we're building the product right — it focuses on the process and whether we're following the requirements. Validation checks that we're building the right product — it focuses on the outcome and whether the product meets the user's actual needs."</p>
<p><strong>"Can you explain the difference between severity and priority?"</strong></p>
<p>Resposta modelo: "Severity is the technical impact of a bug — how badly it breaks the system. Priority is the business urgency — how quickly it needs to be fixed. A spelling mistake on the homepage has low severity but could have high priority because it's the first thing customers see."</p>`,
    },
    {
      titulo: "Perguntas sobre automação",
      conteudo: `<p><strong>"What automation framework have you worked with?"</strong></p>
<p>Resposta modelo: "I've primarily worked with Playwright for end-to-end testing. I appreciate how it handles modern web apps — async/await, multiple browsers, built-in trace and screenshot on failure. I've also worked with the Page Object Model pattern to keep tests maintainable."</p>
<p><strong>"How do you decide what to automate?"</strong></p>
<p>Resposta modelo: "I prioritize automating tests that are: frequently executed (like regression and smoke tests), stable (the feature is unlikely to change often), and have clear expected outcomes. I avoid automating exploratory tests or one-time scenarios — the ROI isn't there."</p>`,
    },
    {
      titulo: "Perguntas sobre processo e Agile",
      conteudo: `<p><strong>"How do you integrate QA in an Agile team?"</strong></p>
<p>Resposta modelo: "I believe QA should be involved from the beginning — during story refinement, not just at the end. I collaborate with developers on acceptance criteria, write test cases before development starts (shift-left), and participate in code reviews when changes touch critical flows. Testing is a team responsibility, not a gate at the end."</p>
<p><strong>"How do you handle tight deadlines when there's not enough time to test everything?"</strong></p>
<p>Resposta modelo: "I use risk-based testing. I map out the features by business impact and probability of failure, and focus my testing time on the highest-risk areas. I communicate clearly with the team about what was tested and what wasn't, so everyone understands the release risk."</p>`,
    },
    {
      titulo: "Perguntas comportamentais (behavioral questions)",
      conteudo: `<p>Entrevistas internacionais frequentemente usam o método STAR (Situation, Task, Action, Result):</p>
<p><strong>"Tell me about a time you found a critical bug close to release."</strong></p>
<p>Estrutura STAR em inglês:</p>
<ul>
<li><strong>Situation:</strong> "We were 2 days from releasing a payment feature when..."</li>
<li><strong>Task:</strong> "My job was to run the final regression suite."</li>
<li><strong>Action:</strong> "I found that the total amount was being calculated incorrectly for orders with discounts. I immediately documented the bug with steps to reproduce and escalated to the lead developer."</li>
<li><strong>Result:</strong> "The team fixed it in 4 hours. We delayed the release by one day but avoided shipping a bug that would have affected every discounted order."</li>
</ul>`,
    },
  ],
  quiz: [
    {
      pergunta: "Em inglês, qual é a diferença entre 'verification' e 'validation'?",
      opcoes: [
        "São sinônimos — ambos significam verificar o software",
        "Verification verifica se estamos construindo o produto corretamente; validation verifica se estamos construindo o produto correto",
        "Verification é teste automático; validation é teste manual",
        "Verification é feito pelo QA; validation é feito pelo cliente",
      ],
      correta: 1,
      explicacao: "Verification: 'Are we building the product right?' (seguindo os requisitos e processo). Validation: 'Are we building the right product?' (atendendo às necessidades reais do usuário). É uma distinção clássica de entrevistas de QA.",
    },
    {
      pergunta: "O método STAR para responder perguntas comportamentais em inglês significa:",
      opcoes: [
        "Skills, Tasks, Achievements, Results",
        "Situation, Task, Action, Result",
        "Strategy, Timeline, Approach, Review",
        "Strengths, Thinking, Analysis, Response",
      ],
      correta: 1,
      explicacao: "STAR: Situation (contexto), Task (sua responsabilidade), Action (o que você fez), Result (o resultado). É o framework padrão para responder 'Tell me about a time when...' em entrevistas internacionais.",
    },
    {
      pergunta: "Como você explica 'risk-based testing' para um entrevistador em inglês?",
      opcoes: [
        "'I test based on what is risky to test'",
        "'I prioritize testing based on business impact and probability of failure to focus effort on highest-risk areas'",
        "'I only test features that have a risk of breaking'",
        "'Risk-based testing means I automate all critical tests'",
      ],
      correta: 1,
      explicacao: "A definição profissional de risk-based testing combina dois fatores: impacto no negócio e probabilidade de falha. Você foca o tempo de teste nas áreas com maior produto de risco × impacto, comunicando o que foi e não foi testado.",
    },
    {
      pergunta: "Como você explica sua experiência com Playwright em uma entrevista em inglês?",
      opcoes: [
        "'I know Playwright, it's good for testing.'",
        "'I've worked with Playwright for E2E testing — I use Page Object Model and value its built-in auto-waiting and multi-browser support.'",
        "'Playwright is the framework I use for automation.'",
        "'I have experience with Playwright and other tools.'",
      ],
      correta: 1,
      explicacao: "A resposta profissional menciona: o contexto de uso (E2E testing), um padrão de design utilizado (POM), e características específicas que você valoriza (auto-waiting, multi-browser). Detalhes técnicos demonstram conhecimento real, não apenas familiaridade com o nome.",
    },
    {
      pergunta: "O que significa 'shift-left' no contexto de QA em inglês?",
      opcoes: [
        "Mover a equipe de QA para o lado esquerdo do escritório",
        "Envolver QA mais cedo no ciclo de desenvolvimento, antes do desenvolvimento começar",
        "Priorizar testes de unidade em vez de testes de sistema",
        "Automatizar todos os testes manuais existentes",
      ],
      correta: 1,
      explicacao: "'Shift-left' é o conceito de antecipar o QA no ciclo — em vez de testar só no final, o QA participa desde o refinamento de histórias, escreve critérios de aceite antes do desenvolvimento e revisa requisitos. Reduz retrabalho por encontrar problemas mais cedo.",
    },
  ],
};
```

- [ ] **Step 5: Build check**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 6: Commit**

```bash
git add src/data/guia/ingles-para-qa.ts src/data/guia/vocabulario-tecnico-qa-ingles.ts src/data/guia/comunicacao-qa-ingles.ts src/data/guia/entrevista-tecnica-qa-ingles.ts
git commit -m "feat: artigos /guia — 4 artigos English for QA"
```

---

## Task 9: Páginas /guia e /guia/[slug]

**Files:**
- Create: `src/app/guia/page.tsx`
- Create: `src/app/guia/[slug]/page.tsx`

- [ ] **Step 1: Criar `src/app/guia/page.tsx`**

```tsx
import type { Metadata } from "next";
import AdBanner from "@/components/AdBanner";
import { artigos, artigosPorSecao } from "@/data/guia/index";
import type { ArtigoMeta } from "@/data/guia/types";

export const metadata: Metadata = {
  title: "Guia de Estudos — TestPath",
  description: "Guias completos sobre CTFL v4.0, Playwright e Inglês para QA. Artigos detalhados com vídeos e quiz para se preparar para certificações de qualidade de software.",
  openGraph: {
    title: "Guia de Estudos — TestPath",
    description: "Guias completos sobre CTFL v4.0, Playwright e Inglês para QA.",
    url: "https://www.testpath.online/guia",
    type: "website",
  },
};

const nivelLabel: Record<string, string> = {
  "iniciante": "Iniciante",
  "intermediário": "Intermediário",
  "avançado": "Avançado",
};

const nivelCor: Record<string, string> = {
  "iniciante": "#10b981",
  "intermediário": "#3b82f6",
  "avançado": "#8b5cf6",
};

function CardArtigo({ artigo }: { artigo: ArtigoMeta }) {
  return (
    <a href={`/guia/${artigo.slug}`}
      style={{ display: "block", background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "1.25rem", textDecoration: "none", transition: "border-color 0.15s, transform 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#374151"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#1f2937"; e.currentTarget.style.transform = "translateY(0)"; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem", gap: "8px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#e5e7eb", lineHeight: 1.4, margin: 0 }}>{artigo.titulo}</h3>
      </div>
      <p style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.5, margin: "0 0 0.75rem" }}>{artigo.descricao}</p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "11px", color: nivelCor[artigo.nivel], background: `${nivelCor[artigo.nivel]}18`, padding: "2px 8px", borderRadius: "99px" }}>
          {nivelLabel[artigo.nivel]}
        </span>
        <span style={{ fontSize: "11px", color: "#6b7280" }}>📖 {artigo.tempoLeitura} min</span>
      </div>
    </a>
  );
}

const secoes = [
  { id: "ctfl", titulo: "CTFL v4.0 — Certified Tester Foundation Level", emoji: "🎓", cor: "#d4af37", desc: "Prepare-se para a certificação mais importante de QA do ISTQB. 9 guias cobrindo todos os 6 capítulos do syllabus v4.0." },
  { id: "playwright", titulo: "Playwright — Automação de Testes Web", emoji: "🤖", cor: "#06b6d4", desc: "Do zero à automação profissional com Playwright. Locators, POM, CI/CD e boas práticas." },
  { id: "ingles", titulo: "English for QA — Inglês Técnico", emoji: "🗣️", cor: "#22c55e", desc: "O inglês técnico essencial para a carreira em QA. Bug reports, vocabulário, reuniões e entrevistas em inglês." },
];

export default function GuiaPage() {
  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb", fontFamily: "sans-serif" }}>
      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", borderBottom: "1px solid #1f2937", position: "sticky", top: 0, background: "rgba(11,15,26,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "26px", height: "26px" }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.1rem", background: "linear-gradient(135deg, #d4af37, #f5d76e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>TestPath</span>
        </a>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <a href="/guia" style={{ color: "#d4af37", fontSize: "14px", textDecoration: "none", fontWeight: 600 }}>Guia</a>
          <a href="/login" style={{ color: "#9ca3af", fontSize: "14px", textDecoration: "none" }}>Entrar</a>
          <a href="/cadastro" style={{ background: "#3b82f6", color: "#fff", padding: "7px 16px", borderRadius: "8px", fontWeight: 600, fontSize: "13px", textDecoration: "none" }}>Começar grátis</a>
        </div>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.2rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e5e7eb", marginBottom: "0.75rem" }}>
            Guia de Estudos TestPath
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "15px", lineHeight: 1.6, maxWidth: "560px", margin: "0 auto" }}>
            Artigos completos, vídeos e quizzes para se preparar para certificações de QA. Conteúdo gratuito, sem login.
          </p>
        </div>

        {secoes.map(secao => {
          const artigos = artigosPorSecao[secao.id as keyof typeof artigosPorSecao];
          return (
            <section key={secao.id} style={{ marginBottom: "3rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "1.5rem" }}>{secao.emoji}</span>
                <h2 style={{ fontSize: "1.15rem", color: secao.cor, fontWeight: 600, margin: 0 }}>{secao.titulo}</h2>
              </div>
              <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "1.25rem", marginLeft: "2px" }}>{secao.desc}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.75rem" }}>
                {artigos.map(a => <CardArtigo key={a.slug} artigo={a} />)}
              </div>
            </section>
          );
        })}

        <AdBanner slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL || ""} format="horizontal" style={{ marginBottom: "2rem" }} />

        <div style={{ textAlign: "center", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "16px", padding: "2rem" }}>
          <p style={{ color: "#e5e7eb", fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Pronto para praticar com simulados?
          </p>
          <p style={{ color: "#9ca3af", fontSize: "14px", marginBottom: "1.25rem" }}>
            Na plataforma você tem simulados gerados por IA, fila de revisão adaptativa e progresso salvo.
          </p>
          <a href="/cadastro" style={{ display: "inline-block", background: "#3b82f6", color: "#fff", padding: "11px 28px", borderRadius: "10px", fontWeight: 600, fontSize: "15px", textDecoration: "none" }}>
            Criar conta grátis →
          </a>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Criar `src/app/guia/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdBanner from "@/components/AdBanner";
import QuizArtigo from "@/components/guia/QuizArtigo";
import VideoEmbed from "@/components/guia/VideoEmbed";
import NavArtigo from "@/components/guia/NavArtigo";
import { artigos } from "@/data/guia/index";

// Mapa de slugs para importações dinâmicas dos artigos
async function getArtigo(slug: string) {
  try {
    const mod = await import(`@/data/guia/${slug}`);
    return mod.artigo;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return artigos.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const artigo = await getArtigo(slug);
  if (!artigo) return { title: "Artigo não encontrado — TestPath" };
  return {
    title: `${artigo.titulo} — TestPath Guia`,
    description: artigo.descricao,
    openGraph: {
      title: artigo.titulo,
      description: artigo.descricao,
      url: `https://www.testpath.online/guia/${artigo.slug}`,
      type: "article",
    },
  };
}

const secaoNome: Record<string, string> = {
  ctfl: "CTFL v4.0",
  playwright: "Playwright",
  ingles: "English for QA",
};

export default async function ArtigoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artigo = await getArtigo(slug);
  if (!artigo) notFound();

  const idx = artigos.findIndex(a => a.slug === slug);
  const anterior = idx > 0 ? artigos[idx - 1] : null;
  const proximo = idx < artigos.length - 1 ? artigos[idx + 1] : null;

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb", fontFamily: "sans-serif" }}>
      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 2rem", borderBottom: "1px solid #1f2937", position: "sticky", top: 0, background: "rgba(11,15,26,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "26px", height: "26px" }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.1rem", background: "linear-gradient(135deg, #d4af37, #f5d76e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>TestPath</span>
        </a>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <a href="/guia" style={{ color: "#9ca3af", fontSize: "14px", textDecoration: "none" }}>← Guia</a>
          <a href="/login" style={{ color: "#9ca3af", fontSize: "14px", textDecoration: "none" }}>Entrar</a>
          <a href="/cadastro" style={{ background: "#3b82f6", color: "#fff", padding: "7px 16px", borderRadius: "8px", fontWeight: 600, fontSize: "13px", textDecoration: "none" }}>Começar grátis</a>
        </div>
      </nav>

      <article style={{ maxWidth: "760px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
        {/* BREADCRUMB */}
        <nav aria-label="breadcrumb" style={{ marginBottom: "1.5rem", fontSize: "12px", color: "#6b7280" }}>
          <a href="/guia" style={{ color: "#6b7280", textDecoration: "none" }}>Guia</a>
          <span style={{ margin: "0 6px" }}>›</span>
          <span style={{ color: "#9ca3af" }}>{secaoNome[artigo.secao]}</span>
          <span style={{ margin: "0 6px" }}>›</span>
          <span style={{ color: "#e5e7eb" }}>{artigo.titulo}</span>
        </nav>

        {/* HEADER */}
        <header style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "1.9rem", fontFamily: "Georgia, serif", fontWeight: "normal", color: "#e5e7eb", lineHeight: 1.3, marginBottom: "1rem" }}>
            {artigo.titulo}
          </h1>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "13px", color: "#6b7280" }}>
            <span>📖 {artigo.tempoLeitura} min de leitura</span>
            <span>📚 {secaoNome[artigo.secao]}</span>
            <span>🎯 {artigo.nivel.charAt(0).toUpperCase() + artigo.nivel.slice(1)}</span>
          </div>
        </header>

        {/* CONTEÚDO */}
        {artigo.secoes.map((secao: { titulo: string; conteudo: string; videoId?: string }, i: number) => (
          <section key={i} style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", color: "#d4af37", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "1rem", borderBottom: "1px solid #1f2937", paddingBottom: "0.5rem" }}>
              {secao.titulo}
            </h2>
            <div
              style={{ color: "#9ca3af", fontSize: "15px", lineHeight: 1.8 }}
              dangerouslySetInnerHTML={{ __html: secao.conteudo }}
            />
            {secao.videoId && (
              <VideoEmbed videoId={secao.videoId} titulo={secao.titulo} />
            )}
          </section>
        ))}

        {/* AD após conteúdo */}
        <AdBanner slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL || ""} format="horizontal" style={{ marginBottom: "2rem" }} />

        {/* QUIZ */}
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.1rem", color: "#e5e7eb", fontWeight: 600, marginBottom: "1rem" }}>
            🧠 Teste seus conhecimentos
          </h2>
          <QuizArtigo perguntas={artigo.quiz} slugArtigo={artigo.slug} />
        </section>

        {/* AD após quiz */}
        <AdBanner slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE || ""} format="rectangle" style={{ marginBottom: "2rem" }} />

        {/* NAVEGAÇÃO */}
        <NavArtigo anterior={anterior} proximo={proximo} />
      </article>
    </main>
  );
}
```

- [ ] **Step 3: Build check — crítico, valida SSG e imports dinâmicos**

```bash
npm run build 2>&1 | tail -30
```
Esperado: 17 rotas estáticas geradas em `/guia/[slug]` + `/guia`. Sem erros de tipo.

- [ ] **Step 4: Commit**

```bash
git add src/app/guia/
git commit -m "feat: páginas /guia e /guia/[slug] com SSG"
```

---

## Task 10: Correções de AdBanner no /dashboard e /perfil

**Files:**
- Modify: `src/app/dashboard/page.tsx:331`
- Modify: `src/app/perfil/page.tsx:569`

- [ ] **Step 1: Corrigir AdBanner no dashboard**

Em `src/app/dashboard/page.tsx`, linha 331, alterar:

```tsx
// ANTES
<AdBanner slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL || ""} format="horizontal" style={{ marginBottom: "1.25rem", marginTop: !(cert && userId) ? "1.25rem" : 0 }} />

// DEPOIS
{userId && <AdBanner slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HORIZONTAL || ""} format="horizontal" style={{ marginBottom: "1.25rem", marginTop: !(cert && userId) ? "1.25rem" : 0 }} />}
```

- [ ] **Step 2: Corrigir AdBanner no perfil**

Em `src/app/perfil/page.tsx`, linha 569, alterar:

```tsx
// ANTES
<AdBanner slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE || ""} format="rectangle" style={{ marginTop: "2rem" }} />

// DEPOIS
{perfil && <AdBanner slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE || ""} format="rectangle" style={{ marginTop: "2rem" }} />}
```

- [ ] **Step 3: Build check**

```bash
npm run build 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
git add src/app/dashboard/page.tsx src/app/perfil/page.tsx
git commit -m "fix: AdBanner só exibe em /dashboard e /perfil quando usuário autenticado"
```

---

## Task 11: Adicionar link "Guia" na nav da landing page

**Files:**
- Modify: `src/app/page.tsx:65-82`

- [ ] **Step 1: Adicionar link na nav desktop e mobile**

Em `src/app/page.tsx`, na seção `{/* Links desktop */}` (linha 65), adicionar o link "Guia" antes de "Entrar":

```tsx
// ANTES — nav desktop (linha 66-73)
<div className="nav-links">
  <a href="#certificacoes" className="nav-link">Certificações</a>
  <a href="#recursos" className="nav-link">Recursos</a>
  <a href="#como-funciona" className="nav-link">Como funciona</a>
  <a href="#sobre" className="nav-link">Quem fez</a>
  <a href="/login" className="nav-link">Entrar</a>
  <a href="/cadastro" style={{ background: "#3b82f6", color: "#ffffff", padding: "8px 18px", borderRadius: "8px", fontWeight: "600", fontSize: "14px", textDecoration: "none" }}>
    Começar grátis
  </a>
</div>

// DEPOIS
<div className="nav-links">
  <a href="#certificacoes" className="nav-link">Certificações</a>
  <a href="#recursos" className="nav-link">Recursos</a>
  <a href="#como-funciona" className="nav-link">Como funciona</a>
  <a href="#sobre" className="nav-link">Quem fez</a>
  <a href="/guia" className="nav-link">Guia</a>
  <a href="/login" className="nav-link">Entrar</a>
  <a href="/cadastro" style={{ background: "#3b82f6", color: "#ffffff", padding: "8px 18px", borderRadius: "8px", fontWeight: "600", fontSize: "14px", textDecoration: "none" }}>
    Começar grátis
  </a>
</div>
```

- [ ] **Step 2: Adicionar link na nav mobile**

Na seção `{/* Botões mobile */}` (linha 77), adicionar link "Guia" antes de "Entrar":

```tsx
// ANTES
<div className="nav-mobile">
  <a href="/login" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "13px" }}>Entrar</a>
  <a href="/cadastro" style={{ background: "#3b82f6", color: "#ffffff", padding: "7px 14px", borderRadius: "8px", fontWeight: "600", fontSize: "13px", textDecoration: "none" }}>
    Começar grátis
  </a>
</div>

// DEPOIS
<div className="nav-mobile">
  <a href="/guia" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "13px" }}>Guia</a>
  <a href="/login" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "13px" }}>Entrar</a>
  <a href="/cadastro" style={{ background: "#3b82f6", color: "#ffffff", padding: "7px 14px", borderRadius: "8px", fontWeight: "600", fontSize: "13px", textDecoration: "none" }}>
    Começar grátis
  </a>
</div>
```

- [ ] **Step 3: Build e lint**

```bash
npm run build 2>&1 | tail -10
npm run lint 2>&1 | tail -10
```

- [ ] **Step 4: Commit final**

```bash
git add src/app/page.tsx
git commit -m "feat: adiciona link Guia na nav da landing page"
```

---

## Task 12: Verificação final e re-submissão ao AdSense

- [ ] **Step 1: Build de produção limpo**

```bash
npm run build
```
Esperado: build sem erros. Verificar que `/guia` e todas as 17 rotas `/guia/[slug]` aparecem como páginas estáticas geradas.

- [ ] **Step 2: Verificar rotas públicas**

Confirmar que as seguintes rotas existem e não têm AdBanner em estado não-autenticado:
- `/guia` ✓ tem AdBanner com conteúdo substancial
- `/guia/o-que-e-ctfl` ✓ tem AdBanner com conteúdo substancial
- `/dashboard` ✓ sem AdBanner para usuário não autenticado
- `/perfil` ✓ sem AdBanner para usuário não autenticado

- [ ] **Step 3: Re-submeter ao AdSense**

Após deploy em produção, acessar o Google AdSense > Sites > TestPath > Solicitar revisão.

Aguardar 1–3 dias para resposta do Google.
