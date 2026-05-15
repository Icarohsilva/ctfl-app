# English for QA — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar o curso "English for QA" ao TestPath — trilha estilo Duolingo com teste de nivelamento adaptativo (A1–B2), 6 tipos de exercício, avaliação de pronúncia por IA e fila de revisão.

**Architecture:** Híbrido — esqueleto estático em arquivos `.ts` + exercícios gerados por Groq por sessão. Três APIs novas (`/api/ingles/*`). Quatro páginas novas (`/inicio/ingles`, `/ingles`, `/ingles/licao/[id]`, `/ingles/revisao`). Enrollment via `usuario_certificacoes` existente com `certificacao_id = "ingles"`.

**Tech Stack:** Next.js 16 App Router · React 19 · Supabase (anon client) · Groq `llama-3.3-70b-versatile` · Web Speech API (SpeechRecognition + SpeechSynthesis) · TypeScript strict · Inline styles dark theme

**Spec:** `docs/superpowers/specs/2026-05-14-english-for-qa-design.md`

---

## Mapa de arquivos

| Ação | Arquivo |
|---|---|
| Criar | `src/data/ingles-curriculum.ts` |
| Criar | `src/data/ingles-licoes.ts` |
| Criar | `src/data/ingles-nivelamento.ts` |
| Criar | `src/app/api/ingles/nivelamento/route.ts` |
| Criar | `src/app/api/ingles/exercicios/route.ts` |
| Criar | `src/app/api/ingles/pronuncia/route.ts` |
| Criar | `src/app/inicio/ingles/page.tsx` |
| Criar | `src/app/ingles/page.tsx` |
| Criar | `src/app/ingles/licao/[id]/page.tsx` |
| Criar | `src/app/ingles/revisao/page.tsx` |
| Modificar | `src/app/cursos/page.tsx` |
| Modificar | `src/app/page.tsx` |
| SQL (Supabase dashboard) | 3 tabelas novas |

---

## Tarefa 1 — Tabelas Supabase

**Executar no Supabase Dashboard → SQL Editor**

- [ ] **1.1 — Criar tabela `ingles_progresso`**

```sql
create table ingles_progresso (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users on delete cascade not null,
  nivel_atual     text not null default 'A1',
  meta            text not null default 'docs',
  licoes_concluidas text[] not null default '{}',
  score_pronuncia_medio numeric default null,
  created_at      timestamptz not null default now(),
  unique(user_id)
);

alter table ingles_progresso enable row level security;

create policy "usuarios veem proprio progresso"
  on ingles_progresso for select
  using (auth.uid() = user_id);

create policy "usuarios inserem proprio progresso"
  on ingles_progresso for insert
  with check (auth.uid() = user_id);

create policy "usuarios atualizam proprio progresso"
  on ingles_progresso for update
  using (auth.uid() = user_id);
```

- [ ] **1.2 — Criar tabela `ingles_revisao`**

```sql
create table ingles_revisao (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users on delete cascade not null,
  licao_id        text not null,
  item            text not null,
  tipo            text not null,
  tentativas      int not null default 0,
  acertos         int not null default 0,
  proxima_revisao timestamptz default now(),
  created_at      timestamptz not null default now()
);

alter table ingles_revisao enable row level security;

create policy "usuarios veem propria revisao"
  on ingles_revisao for select
  using (auth.uid() = user_id);

create policy "usuarios inserem revisao"
  on ingles_revisao for insert
  with check (auth.uid() = user_id);

create policy "usuarios atualizam revisao"
  on ingles_revisao for update
  using (auth.uid() = user_id);
```

- [ ] **1.3 — Criar tabela `ingles_scores_pronuncia`**

```sql
create table ingles_scores_pronuncia (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users on delete cascade not null,
  licao_id   text not null,
  frase      text not null,
  score      int not null,
  transcript text not null,
  created_at timestamptz not null default now()
);

alter table ingles_scores_pronuncia enable row level security;

create policy "usuarios veem proprios scores"
  on ingles_scores_pronuncia for select
  using (auth.uid() = user_id);

create policy "usuarios inserem scores"
  on ingles_scores_pronuncia for insert
  with check (auth.uid() = user_id);
```

- [ ] **1.4 — Verificar no Supabase**

  Abrir Table Editor e confirmar que as 3 tabelas aparecem com as colunas corretas.

- [ ] **1.5 — Commit**

```bash
git add docs/superpowers/plans/2026-05-15-english-for-qa.md
git commit -m "plan: adiciona plano de implementação English for QA"
```

---

## Tarefa 2 — `src/data/ingles-curriculum.ts`

**Tipos compartilhados usados em TODOS os outros arquivos deste plano.**

- [ ] **2.1 — Criar o arquivo**

```typescript
// src/data/ingles-curriculum.ts

export type NivelCEFR = "A1" | "A2" | "B1" | "B2";
export type TipoNode = "licao" | "checkpoint";
export type MetaIngles = "docs" | "calls" | "entrevistas";
export type TipoExercicio =
  | "multipla"
  | "traducao"
  | "ordenar"
  | "speaking"
  | "completar"
  | "listening";

export type NodeMeta = {
  id: string;
  numero: number;
  titulo: string;
  tipo: TipoNode;
  xp: number;
};

export type UnidadeMeta = {
  numero: number;
  titulo: string;
  emoji: string;
  nodes: NodeMeta[];
};

export type NivelMeta = {
  nivel: NivelCEFR;
  titulo: string;
  descricao: string;
  cor: string;
  unidades: UnidadeMeta[];
};

export const curriculumIngles: NivelMeta[] = [
  {
    nivel: "A1",
    titulo: "Sobrevivência Técnica",
    descricao: "Primeiras palavras e frases para o dia a dia de QA",
    cor: "#22c55e",
    unidades: [
      {
        numero: 1, titulo: "Greetings & Job Titles", emoji: "👋",
        nodes: [
          { id: "a1-u1-n1", numero: 1, titulo: "Hello, I'm a QA", tipo: "licao", xp: 30 },
          { id: "a1-u1-n2", numero: 2, titulo: "Job titles in tech", tipo: "licao", xp: 30 },
          { id: "a1-u1-n3", numero: 3, titulo: "Your team & role", tipo: "licao", xp: 30 },
          { id: "a1-u1-n4", numero: 4, titulo: "Introducing yourself", tipo: "licao", xp: 30 },
          { id: "a1-u1-n5", numero: 5, titulo: "Checkpoint 1", tipo: "checkpoint", xp: 100 },
        ],
      },
      {
        numero: 2, titulo: "Numbers, Dates & Times", emoji: "📅",
        nodes: [
          { id: "a1-u2-n1", numero: 1, titulo: "Counting bugs", tipo: "licao", xp: 30 },
          { id: "a1-u2-n2", numero: 2, titulo: "Dates and deadlines", tipo: "licao", xp: 30 },
          { id: "a1-u2-n3", numero: 3, titulo: "Time expressions", tipo: "licao", xp: 30 },
          { id: "a1-u2-n4", numero: 4, titulo: "Sprint durations", tipo: "licao", xp: 30 },
          { id: "a1-u2-n5", numero: 5, titulo: "Checkpoint 2", tipo: "checkpoint", xp: 100 },
        ],
      },
      {
        numero: 3, titulo: "Basic Bug Reports", emoji: "🐛",
        nodes: [
          { id: "a1-u3-n1", numero: 1, titulo: "What is a bug?", tipo: "licao", xp: 30 },
          { id: "a1-u3-n2", numero: 2, titulo: "Bug severity words", tipo: "licao", xp: 30 },
          { id: "a1-u3-n3", numero: 3, titulo: "Steps to reproduce", tipo: "licao", xp: 30 },
          { id: "a1-u3-n4", numero: 4, titulo: "Expected vs actual", tipo: "licao", xp: 30 },
          { id: "a1-u3-n5", numero: 5, titulo: "Checkpoint 3", tipo: "checkpoint", xp: 100 },
        ],
      },
      {
        numero: 4, titulo: "Daily Stand-up", emoji: "🗣️",
        nodes: [
          { id: "a1-u4-n1", numero: 1, titulo: "Yesterday I tested...", tipo: "licao", xp: 30 },
          { id: "a1-u4-n2", numero: 2, titulo: "Today I will...", tipo: "licao", xp: 30 },
          { id: "a1-u4-n3", numero: 3, titulo: "I'm blocked by...", tipo: "licao", xp: 30 },
          { id: "a1-u4-n4", numero: 4, titulo: "Checkpoint 4", tipo: "checkpoint", xp: 100 },
        ],
      },
    ],
  },
  {
    nivel: "A2",
    titulo: "Comunicação no Dia a Dia",
    descricao: "Escrever reports, participar de reuniões e interagir com o time",
    cor: "#3b82f6",
    unidades: [
      {
        numero: 1, titulo: "Sprint Vocabulary", emoji: "🏃",
        nodes: [
          { id: "a2-u1-n1", numero: 1, titulo: "Backlog & user stories", tipo: "licao", xp: 30 },
          { id: "a2-u1-n2", numero: 2, titulo: "Sprint planning words", tipo: "licao", xp: 30 },
          { id: "a2-u1-n3", numero: 3, titulo: "Definition of Done", tipo: "licao", xp: 30 },
          { id: "a2-u1-n4", numero: 4, titulo: "Velocity & capacity", tipo: "licao", xp: 30 },
          { id: "a2-u1-n5", numero: 5, titulo: "Checkpoint 1", tipo: "checkpoint", xp: 100 },
        ],
      },
      {
        numero: 2, titulo: "Writing Defect Reports", emoji: "📝",
        nodes: [
          { id: "a2-u2-n1", numero: 1, titulo: "Defect title patterns", tipo: "licao", xp: 30 },
          { id: "a2-u2-n2", numero: 2, titulo: "Reproduction steps", tipo: "licao", xp: 30 },
          { id: "a2-u2-n3", numero: 3, titulo: "Environment info", tipo: "licao", xp: 30 },
          { id: "a2-u2-n4", numero: 4, titulo: "Priority & severity", tipo: "licao", xp: 30 },
          { id: "a2-u2-n5", numero: 5, titulo: "Checkpoint 2", tipo: "checkpoint", xp: 100 },
        ],
      },
      {
        numero: 3, titulo: "Meeting Expressions", emoji: "💬",
        nodes: [
          { id: "a2-u3-n1", numero: 1, titulo: "Asking for clarification", tipo: "licao", xp: 30 },
          { id: "a2-u3-n2", numero: 2, titulo: "Giving status updates", tipo: "licao", xp: 30 },
          { id: "a2-u3-n3", numero: 3, titulo: "Agreeing & disagreeing", tipo: "licao", xp: 30 },
          { id: "a2-u3-n4", numero: 4, titulo: "Checkpoint 3", tipo: "checkpoint", xp: 100 },
        ],
      },
      {
        numero: 4, titulo: "Email & Slack", emoji: "📧",
        nodes: [
          { id: "a2-u4-n1", numero: 1, titulo: "Bug report via email", tipo: "licao", xp: 30 },
          { id: "a2-u4-n2", numero: 2, titulo: "Slack etiquette in QA", tipo: "licao", xp: 30 },
          { id: "a2-u4-n3", numero: 3, titulo: "Following up politely", tipo: "licao", xp: 30 },
          { id: "a2-u4-n4", numero: 4, titulo: "Checkpoint 4", tipo: "checkpoint", xp: 100 },
        ],
      },
    ],
  },
  {
    nivel: "B1",
    titulo: "Autonomia Técnica",
    descricao: "Comunicação avançada com stakeholders e em entrevistas",
    cor: "#8b5cf6",
    unidades: [
      {
        numero: 1, titulo: "Technical Interviews", emoji: "🎯",
        nodes: [
          { id: "b1-u1-n1", numero: 1, titulo: "Tell me about yourself", tipo: "licao", xp: 30 },
          { id: "b1-u1-n2", numero: 2, titulo: "Describing your QA process", tipo: "licao", xp: 30 },
          { id: "b1-u1-n3", numero: 3, titulo: "Talking about tools", tipo: "licao", xp: 30 },
          { id: "b1-u1-n4", numero: 4, titulo: "Behavioral questions", tipo: "licao", xp: 30 },
          { id: "b1-u1-n5", numero: 5, titulo: "Checkpoint 1", tipo: "checkpoint", xp: 100 },
        ],
      },
      {
        numero: 2, titulo: "Code Review & Docs", emoji: "🔍",
        nodes: [
          { id: "b1-u2-n1", numero: 1, titulo: "Reading pull requests", tipo: "licao", xp: 30 },
          { id: "b1-u2-n2", numero: 2, titulo: "Writing review comments", tipo: "licao", xp: 30 },
          { id: "b1-u2-n3", numero: 3, titulo: "API documentation", tipo: "licao", xp: 30 },
          { id: "b1-u2-n4", numero: 4, titulo: "Test strategy docs", tipo: "licao", xp: 30 },
          { id: "b1-u2-n5", numero: 5, titulo: "Checkpoint 2", tipo: "checkpoint", xp: 100 },
        ],
      },
      {
        numero: 3, titulo: "Incident Reports", emoji: "🚨",
        nodes: [
          { id: "b1-u3-n1", numero: 1, titulo: "Describing production bugs", tipo: "licao", xp: 30 },
          { id: "b1-u3-n2", numero: 2, titulo: "Root cause analysis", tipo: "licao", xp: 30 },
          { id: "b1-u3-n3", numero: 3, titulo: "Postmortem writing", tipo: "licao", xp: 30 },
          { id: "b1-u3-n4", numero: 4, titulo: "Checkpoint 3", tipo: "checkpoint", xp: 100 },
        ],
      },
    ],
  },
  {
    nivel: "B2",
    titulo: "Liderança e Influência",
    descricao: "Liderar, apresentar e negociar em inglês",
    cor: "#f97316",
    unidades: [
      {
        numero: 1, titulo: "Leading QA Meetings", emoji: "🏆",
        nodes: [
          { id: "b2-u1-n1", numero: 1, titulo: "Opening & closing meetings", tipo: "licao", xp: 30 },
          { id: "b2-u1-n2", numero: 2, titulo: "Facilitating discussion", tipo: "licao", xp: 30 },
          { id: "b2-u1-n3", numero: 3, titulo: "Action items & follow-ups", tipo: "licao", xp: 30 },
          { id: "b2-u1-n4", numero: 4, titulo: "Checkpoint 1", tipo: "checkpoint", xp: 100 },
        ],
      },
      {
        numero: 2, titulo: "Advanced Interviews", emoji: "💼",
        nodes: [
          { id: "b2-u2-n1", numero: 1, titulo: "System design in QA", tipo: "licao", xp: 30 },
          { id: "b2-u2-n2", numero: 2, titulo: "Negotiating salary/role", tipo: "licao", xp: 30 },
          { id: "b2-u2-n3", numero: 3, titulo: "Leadership questions", tipo: "licao", xp: 30 },
          { id: "b2-u2-n4", numero: 4, titulo: "Checkpoint Final", tipo: "checkpoint", xp: 200 },
        ],
      },
    ],
  },
];

export function getNivel(nivel: NivelCEFR): NivelMeta | undefined {
  return curriculumIngles.find(n => n.nivel === nivel);
}

export function getNode(nodeId: string): { node: NodeMeta; unidade: UnidadeMeta; nivel: NivelMeta } | undefined {
  for (const nivel of curriculumIngles) {
    for (const unidade of nivel.unidades) {
      const node = unidade.nodes.find(n => n.id === nodeId);
      if (node) return { node, unidade, nivel };
    }
  }
  return undefined;
}

export function getProximoNode(nodeId: string): NodeMeta | undefined {
  for (const nivel of curriculumIngles) {
    for (const unidade of nivel.unidades) {
      const idx = unidade.nodes.findIndex(n => n.id === nodeId);
      if (idx !== -1) {
        if (idx < unidade.nodes.length - 1) return unidade.nodes[idx + 1];
        const idxUnidade = nivel.unidades.findIndex(u => u.nodes.some(n => n.id === nodeId));
        if (idxUnidade < nivel.unidades.length - 1) return nivel.unidades[idxUnidade + 1].nodes[0];
      }
    }
  }
  return undefined;
}
```

- [ ] **2.2 — Verificar TypeScript**

```bash
npx tsc --noEmit
```

Esperado: zero erros relacionados a `ingles-curriculum.ts`.

- [ ] **2.3 — Commit**

```bash
git add src/data/ingles-curriculum.ts
git commit -m "feat: adiciona curriculum do curso English for QA"
```

---

## Tarefa 3 — `src/data/ingles-nivelamento.ts`

Banco estático de questões para o teste adaptativo de nivelamento. 10 por nível = 40 total. O algoritmo seleciona questões baseado no `nivel_corrente` do estado.

- [ ] **3.1 — Criar o arquivo**

```typescript
// src/data/ingles-nivelamento.ts
import type { NivelCEFR } from "./ingles-curriculum";

export type QuestaoNivelamento = {
  id: string;
  nivel: NivelCEFR;
  pergunta: string;
  opcoes: string[];
  correta: number; // índice 0-based
};

export const bancoNivelamento: QuestaoNivelamento[] = [
  // ── A1 ──────────────────────────────────────────────────────────────────
  {
    id: "niv-a1-01", nivel: "A1",
    pergunta: "How do you say 'eu encontrei um bug' in English?",
    opcoes: ["I found a bug", "I find a bug", "I founded a bug", "I finding a bug"],
    correta: 0,
  },
  {
    id: "niv-a1-02", nivel: "A1",
    pergunta: "Which word means 'defeito' in software testing?",
    opcoes: ["feature", "defect", "deploy", "sprint"],
    correta: 1,
  },
  {
    id: "niv-a1-03", nivel: "A1",
    pergunta: "Complete: 'The test _______ failed.'",
    opcoes: ["case", "cases", "casing", "cased"],
    correta: 0,
  },
  {
    id: "niv-a1-04", nivel: "A1",
    pergunta: "What does 'QA' stand for?",
    opcoes: ["Quick Analysis", "Quality Assurance", "Query Agent", "Queue Action"],
    correta: 1,
  },
  {
    id: "niv-a1-05", nivel: "A1",
    pergunta: "How do you say 'resultado esperado' in English?",
    opcoes: ["actual result", "expected result", "test result", "final result"],
    correta: 1,
  },
  {
    id: "niv-a1-06", nivel: "A1",
    pergunta: "Which sentence is correct?",
    opcoes: [
      "I is a tester.",
      "I am a tester.",
      "I are a tester.",
      "I be a tester.",
    ],
    correta: 1,
  },
  {
    id: "niv-a1-07", nivel: "A1",
    pergunta: "What does 'bug severity' mean in testing?",
    opcoes: [
      "How many bugs exist",
      "How serious a bug is",
      "Who created the bug",
      "When the bug was found",
    ],
    correta: 1,
  },
  {
    id: "niv-a1-08", nivel: "A1",
    pergunta: "How do you say 'passos para reproduzir' in English?",
    opcoes: ["steps to test", "steps to reproduce", "steps to deploy", "steps to close"],
    correta: 1,
  },
  {
    id: "niv-a1-09", nivel: "A1",
    pergunta: "Which word means 'bloqueado' in a stand-up context?",
    opcoes: ["done", "blocked", "deployed", "merged"],
    correta: 1,
  },
  {
    id: "niv-a1-10", nivel: "A1",
    pergunta: "Complete: 'Yesterday I _______ the login feature.'",
    opcoes: ["test", "tests", "tested", "testing"],
    correta: 2,
  },

  // ── A2 ──────────────────────────────────────────────────────────────────
  {
    id: "niv-a2-01", nivel: "A2",
    pergunta: "Which sentence correctly describes a bug priority?",
    opcoes: [
      "This bug has high priority because it blocks the checkout flow.",
      "This bug have high priority because it blocks the checkout flow.",
      "This bug is high priority because it block the checkout flow.",
      "This bug had high priority because it is blocking the checkout flow.",
    ],
    correta: 0,
  },
  {
    id: "niv-a2-02", nivel: "A2",
    pergunta: "What does 'regression testing' mean?",
    opcoes: [
      "Testing new features only",
      "Testing to ensure existing features still work after changes",
      "Testing on mobile devices",
      "Testing the database schema",
    ],
    correta: 1,
  },
  {
    id: "niv-a2-03", nivel: "A2",
    pergunta: "How do you politely ask for clarification in a meeting?",
    opcoes: [
      "What? I don't understand.",
      "Could you clarify what you mean by that?",
      "You explained it wrong.",
      "Say it again please.",
    ],
    correta: 1,
  },
  {
    id: "niv-a2-04", nivel: "A2",
    pergunta: "Which phrase correctly gives a status update?",
    opcoes: [
      "I will test yesterday the payment module.",
      "I am currently testing the payment module and expect to finish by EOD.",
      "The payment module test is doing.",
      "Testing payment module, I am.",
    ],
    correta: 1,
  },
  {
    id: "niv-a2-05", nivel: "A2",
    pergunta: "What does 'acceptance criteria' mean?",
    opcoes: [
      "The list of bugs found",
      "The conditions a feature must meet to be accepted",
      "The number of test cases",
      "The deadline for testing",
    ],
    correta: 1,
  },
  {
    id: "niv-a2-06", nivel: "A2",
    pergunta: "Complete: 'The feature _______ not deployed yet because tests are failing.'",
    opcoes: ["is", "are", "has", "have"],
    correta: 0,
  },
  {
    id: "niv-a2-07", nivel: "A2",
    pergunta: "How do you write a professional Slack message about a critical bug?",
    opcoes: [
      "URGENT BUG FOUND!!!",
      "@team Critical bug found in checkout: users cannot complete payment. Investigating now.",
      "there is a bug in checkout",
      "Hey found bug checkout broken fix asap",
    ],
    correta: 1,
  },
  {
    id: "niv-a2-08", nivel: "A2",
    pergunta: "What is a 'user story' in Agile?",
    opcoes: [
      "A document with all test cases",
      "A short description of a feature from the user's perspective",
      "A bug report written by the user",
      "A log of user actions in the system",
    ],
    correta: 1,
  },
  {
    id: "niv-a2-09", nivel: "A2",
    pergunta: "Which phrase means 'reproduzir o problema'?",
    opcoes: ["fix the issue", "reproduce the issue", "close the issue", "assign the issue"],
    correta: 1,
  },
  {
    id: "niv-a2-10", nivel: "A2",
    pergunta: "Complete the defect title: 'Login button _______ unresponsive on iOS 17'",
    opcoes: ["is", "are", "be", "been"],
    correta: 0,
  },

  // ── B1 ──────────────────────────────────────────────────────────────────
  {
    id: "niv-b1-01", nivel: "B1",
    pergunta: "In a technical interview, how do you describe your test automation experience?",
    opcoes: [
      "I do automation sometimes with some tools.",
      "I have 2 years of experience building automated regression suites using Playwright and integrating them into CI/CD pipelines.",
      "Automation is good and I know it.",
      "I worked with automation in my previous job with tools.",
    ],
    correta: 1,
  },
  {
    id: "niv-b1-02", nivel: "B1",
    pergunta: "What does 'shift-left testing' mean?",
    opcoes: [
      "Moving QA engineers to sit on the left side of the office",
      "Starting testing activities earlier in the development lifecycle",
      "Testing only the left side of the UI",
      "Shifting the test environment to a different server",
    ],
    correta: 1,
  },
  {
    id: "niv-b1-03", nivel: "B1",
    pergunta: "How do you write a code review comment that points out a missing test?",
    opcoes: [
      "You forgot the test!",
      "Could you add a unit test for this edge case? Specifically when the input is null.",
      "Test is missing here.",
      "No test = no merge.",
    ],
    correta: 1,
  },
  {
    id: "niv-b1-04", nivel: "B1",
    pergunta: "Which sentence correctly uses the passive voice in a postmortem?",
    opcoes: [
      "We deployed the fix at 3pm.",
      "The fix was deployed at 3pm after root cause was identified.",
      "The fix deployed at 3pm.",
      "At 3pm the fix is deploying.",
    ],
    correta: 1,
  },
  {
    id: "niv-b1-05", nivel: "B1",
    pergunta: "What does 'flaky test' mean?",
    opcoes: [
      "A test that runs slowly",
      "A test that produces inconsistent results without code changes",
      "A test written in a fragile programming language",
      "A test that only works on certain operating systems",
    ],
    correta: 1,
  },
  {
    id: "niv-b1-06", nivel: "B1",
    pergunta: "How do you communicate a risk to a stakeholder professionally?",
    opcoes: [
      "If we don't fix this, everything will break.",
      "I'd like to flag a risk: if we skip smoke testing before this release, we increase the chance of a critical defect reaching production.",
      "We have a risk here and it's bad.",
      "The stakeholders need to know about risks so I'm telling you.",
    ],
    correta: 1,
  },
  {
    id: "niv-b1-07", nivel: "B1",
    pergunta: "What is 'exploratory testing'?",
    opcoes: [
      "Testing with a fixed script of steps",
      "Simultaneous learning, test design, and execution without a predefined script",
      "Testing by exploring the file system",
      "Automated testing that explores all code paths",
    ],
    correta: 1,
  },
  {
    id: "niv-b1-08", nivel: "B1",
    pergunta: "Which phrase correctly summarizes an incident?",
    opcoes: [
      "Something broke and we fixed it.",
      "At 14:32 UTC, the payment service became unavailable due to a misconfigured environment variable, affecting 12% of users for 47 minutes.",
      "The payment broke for some users for some time.",
      "We had an incident with payments yesterday afternoon.",
    ],
    correta: 1,
  },
  {
    id: "niv-b1-09", nivel: "B1",
    pergunta: "How do you politely disagree with a developer's estimate in a meeting?",
    opcoes: [
      "That's wrong, it will take longer.",
      "I appreciate the estimate. Based on the complexity I've seen in similar features, I'd suggest we add a buffer of 2 days. Would that work?",
      "No, that's too fast.",
      "Your estimate is not realistic.",
    ],
    correta: 1,
  },
  {
    id: "niv-b1-10", nivel: "B1",
    pergunta: "Complete: 'The test suite _______ been refactored to improve maintainability.'",
    opcoes: ["has", "have", "had", "is"],
    correta: 0,
  },

  // ── B2 ──────────────────────────────────────────────────────────────────
  {
    id: "niv-b2-01", nivel: "B2",
    pergunta: "How do you open a retrospective meeting as a QA lead?",
    opcoes: [
      "Let's talk about what went wrong.",
      "Thank you all for joining. Today we'll reflect on our last sprint — what went well, what could be improved, and what actions we'll commit to. Let's keep it constructive.",
      "We need to discuss problems from last sprint.",
      "Hello team, retrospective time, let's go.",
    ],
    correta: 1,
  },
  {
    id: "niv-b2-02", nivel: "B2",
    pergunta: "Which sentence demonstrates advanced hedging language in a risk assessment?",
    opcoes: [
      "We might have problems.",
      "There is a possibility that, without additional test coverage on the payment module, we could see an increase in production defects following the release.",
      "Maybe we will have bugs.",
      "The risks are there and we should address them.",
    ],
    correta: 1,
  },
  {
    id: "niv-b2-03", nivel: "B2",
    pergunta: "What is the difference between 'verification' and 'validation' in testing?",
    opcoes: [
      "They mean the same thing.",
      "Verification checks if we are building the product right; validation checks if we are building the right product.",
      "Verification is automated; validation is manual.",
      "Verification is done by QA; validation is done by stakeholders.",
    ],
    correta: 1,
  },
  {
    id: "niv-b2-04", nivel: "B2",
    pergunta: "How do you mentor a junior QA engineer who keeps writing brittle tests?",
    opcoes: [
      "Tell them to rewrite all the tests.",
      "I'd sit with them and walk through why locators tied to dynamic attributes break easily, then pair on refactoring one test using more stable selectors as a reference.",
      "Send them a document about best practices.",
      "Their tests are brittle and they need to fix them.",
    ],
    correta: 1,
  },
  {
    id: "niv-b2-05", nivel: "B2",
    pergunta: "Which phrase correctly presents a test strategy proposal?",
    opcoes: [
      "We should test more things.",
      "I'd like to propose a risk-based testing approach for this release: we prioritise the payment and authentication flows given their business impact, while applying lighter coverage to lower-risk areas.",
      "My proposal is that we do risk-based testing.",
      "For this release I think risk-based testing would be good to do.",
    ],
    correta: 1,
  },
  {
    id: "niv-b2-06", nivel: "B2",
    pergunta: "Complete: 'Had the team _______ a more thorough regression suite, the production incident could have been prevented.'",
    opcoes: ["maintained", "maintain", "maintaining", "to maintain"],
    correta: 0,
  },
  {
    id: "niv-b2-07", nivel: "B2",
    pergunta: "How do you handle a stakeholder who insists on skipping testing to meet a deadline?",
    opcoes: [
      "OK, we'll skip testing.",
      "I understand the deadline pressure. Let me show you the risk matrix — skipping regression on checkout has historically led to P1 incidents. Can we agree on a focused smoke test as a minimum?",
      "We cannot skip testing, that's my final answer.",
      "Testing cannot be skipped because it's important for quality.",
    ],
    correta: 1,
  },
  {
    id: "niv-b2-08", nivel: "B2",
    pergunta: "What does 'test coverage' mean in a nuanced sense?",
    opcoes: [
      "The percentage of lines of code executed by tests",
      "A multi-dimensional measure including code coverage, requirement coverage, and risk coverage — no single metric tells the full story",
      "How many test cases you have written",
      "Whether all features have been tested at least once",
    ],
    correta: 1,
  },
  {
    id: "niv-b2-09", nivel: "B2",
    pergunta: "Which sentence uses a conditional correctly in a QA context?",
    opcoes: [
      "If we would have caught this earlier, the cost would be lower.",
      "Had this defect been caught during code review, the cost of fixing it would have been significantly lower.",
      "If we caught this earlier, the cost would be lower.",
      "If we catch this earlier, the cost would have been lower.",
    ],
    correta: 1,
  },
  {
    id: "niv-b2-10", nivel: "B2",
    pergunta: "How do you write an executive summary of test results?",
    opcoes: [
      "We ran tests and found bugs.",
      "Testing of the 3.2 release is complete. 94% of test cases passed. 2 critical defects were found and resolved. 1 medium-severity defect is deferred to 3.3 with stakeholder approval. Release is recommended to proceed.",
      "All tests done, mostly good, some bugs found, release ok.",
      "The test results show that we tested 94% and found some defects.",
    ],
    correta: 1,
  },
];

// Retorna questões aleatórias para um nível, sem repetir IDs já usados
export function getQuestaoParaNivel(
  nivel: NivelCEFR,
  usados: string[]
): QuestaoNivelamento | undefined {
  const disponiveis = bancoNivelamento.filter(
    q => q.nivel === nivel && !usados.includes(q.id)
  );
  if (disponiveis.length === 0) return undefined;
  return disponiveis[Math.floor(Math.random() * disponiveis.length)];
}
```

- [ ] **3.2 — Verificar TypeScript**

```bash
npx tsc --noEmit
```

Esperado: zero erros.

- [ ] **3.3 — Commit**

```bash
git add src/data/ingles-nivelamento.ts
git commit -m "feat: adiciona banco de questões do nivelamento English for QA"
```

---

## Tarefa 4 — `src/data/ingles-licoes.ts`

Conteúdo-base por node. O Groq usa `contexto` e `vocabulario` para gerar exercícios variados a cada sessão. Escreva uma entrada por node do curriculum — o padrão abaixo cobre os primeiros nodes de cada nível; adicione os demais seguindo o mesmo shape.

- [ ] **4.1 — Criar o arquivo**

```typescript
// src/data/ingles-licoes.ts
import type { NivelCEFR, MetaIngles } from "./ingles-curriculum";

export type LicaoBase = {
  id: string;
  nivel: NivelCEFR;
  titulo: string;
  contexto: string;             // instrução para o Groq
  frases_exemplo: string[];     // frases de referência para os exercícios
  vocabulario: { en: string; pt: string }[];
  foco_meta: Record<MetaIngles, string>; // personalização por objetivo do usuário
};

export const licoesBases: Record<string, LicaoBase> = {

  // ── A1 ─────────────────────────────────────────────────────────────────

  "a1-u1-n1": {
    id: "a1-u1-n1", nivel: "A1", titulo: "Hello, I'm a QA",
    contexto: "Lição introdutória para QA iniciantes. Foco em apresentações simples, verbo to be no presente, vocabulário de identidade profissional.",
    frases_exemplo: [
      "Hi, my name is Ana. I am a QA engineer.",
      "I work at a tech company.",
      "I test software to find bugs.",
      "Nice to meet you.",
      "I am from Brazil.",
    ],
    vocabulario: [
      { en: "QA engineer", pt: "engenheiro de QA" },
      { en: "software tester", pt: "testador de software" },
      { en: "I work at", pt: "eu trabalho em" },
      { en: "nice to meet you", pt: "prazer em conhecê-lo" },
      { en: "I am", pt: "eu sou / eu estou" },
    ],
    foco_meta: {
      docs: "Inclua frases sobre leitura de documentação técnica.",
      calls: "Inclua frases de apresentação em videochamadas.",
      entrevistas: "Inclua frases de abertura para entrevistas de emprego.",
    },
  },

  "a1-u1-n2": {
    id: "a1-u1-n2", nivel: "A1", titulo: "Job titles in tech",
    contexto: "Vocabulário de cargos em tecnologia. Foco em substantivos, artigo indefinido 'a/an', diferenças entre títulos.",
    frases_exemplo: [
      "She is a frontend developer.",
      "He is a product manager.",
      "We are QA engineers.",
      "The team has a designer and two testers.",
      "I report to the QA lead.",
    ],
    vocabulario: [
      { en: "developer", pt: "desenvolvedor" },
      { en: "tester", pt: "testador" },
      { en: "QA lead", pt: "líder de QA" },
      { en: "product manager", pt: "gerente de produto" },
      { en: "designer", pt: "designer" },
      { en: "team", pt: "time / equipe" },
    ],
    foco_meta: {
      docs: "Inclua frases sobre quem escreve e lê documentação.",
      calls: "Inclua frases de apresentação do time em reuniões.",
      entrevistas: "Inclua frases sobre hierarquia e cargos em entrevistas.",
    },
  },

  "a1-u3-n1": {
    id: "a1-u3-n1", nivel: "A1", titulo: "What is a bug?",
    contexto: "Conceito de bug e defeito para iniciantes. Foco em vocabulário básico de QA, frases simples no presente.",
    frases_exemplo: [
      "A bug is a problem in the software.",
      "I found a bug on the login page.",
      "The button is not working.",
      "The app crashes when I click save.",
      "This is a critical bug.",
    ],
    vocabulario: [
      { en: "bug", pt: "bug / defeito" },
      { en: "defect", pt: "defeito" },
      { en: "crash", pt: "travar / crashar" },
      { en: "login page", pt: "página de login" },
      { en: "not working", pt: "não está funcionando" },
      { en: "critical", pt: "crítico" },
    ],
    foco_meta: {
      docs: "Use exemplos de bugs documentados em ferramentas como Jira.",
      calls: "Use frases para reportar bugs verbalmente em reuniões.",
      entrevistas: "Use exemplos de bugs para responder 'Tell me about a bug you found'.",
    },
  },

  "a1-u4-n1": {
    id: "a1-u4-n1", nivel: "A1", titulo: "Yesterday I tested...",
    contexto: "Stand-up diário: o que fiz ontem. Foco no passado simples, verbos de teste e QA.",
    frases_exemplo: [
      "Yesterday I tested the checkout flow.",
      "I ran 15 test cases.",
      "I found two bugs.",
      "I reviewed the test plan.",
      "I finished testing the login module.",
    ],
    vocabulario: [
      { en: "tested", pt: "testei" },
      { en: "ran test cases", pt: "executei casos de teste" },
      { en: "found bugs", pt: "encontrei bugs" },
      { en: "reviewed", pt: "revisei" },
      { en: "finished", pt: "terminei" },
    ],
    foco_meta: {
      docs: "Inclua frases sobre atualização de documentação.",
      calls: "Inclua frases para o stand-up diário em videochamada.",
      entrevistas: "Inclua exemplos de resultados de trabalho passado.",
    },
  },

  // ── A2 ─────────────────────────────────────────────────────────────────

  "a2-u2-n1": {
    id: "a2-u2-n1", nivel: "A2", titulo: "Defect title patterns",
    contexto: "Padrões de título de bug report em inglês. Foco em estrutura [Componente] + [Verbo] + [Comportamento], tempo presente simples.",
    frases_exemplo: [
      "Login button unresponsive on iOS 17.",
      "Payment fails when discount code is applied.",
      "User profile image not loading in dark mode.",
      "Search returns no results for special characters.",
      "Checkout page crashes on slow network.",
    ],
    vocabulario: [
      { en: "unresponsive", pt: "sem resposta / travado" },
      { en: "fails", pt: "falha" },
      { en: "not loading", pt: "não carregando" },
      { en: "crashes", pt: "trava / cai" },
      { en: "returns", pt: "retorna" },
      { en: "discount code", pt: "código de desconto" },
    ],
    foco_meta: {
      docs: "Use frases para títulos de bugs em Jira/Linear.",
      calls: "Use frases para descrever bugs verbalmente de forma clara.",
      entrevistas: "Use exemplos de bons títulos de bugs para mostrar habilidade.",
    },
  },

  "a2-u3-n1": {
    id: "a2-u3-n1", nivel: "A2", titulo: "Asking for clarification",
    contexto: "Expressões para pedir esclarecimentos em reuniões e chats. Foco em linguagem educada, modal verbs (could, would).",
    frases_exemplo: [
      "Could you clarify what you mean by that?",
      "Sorry, I didn't quite catch that. Could you repeat?",
      "What do you mean by 'out of scope'?",
      "Can you give me an example?",
      "I want to make sure I understand — are you saying the feature is blocked?",
    ],
    vocabulario: [
      { en: "clarify", pt: "esclarecer" },
      { en: "out of scope", pt: "fora do escopo" },
      { en: "I didn't catch that", pt: "não entendi" },
      { en: "make sure", pt: "ter certeza" },
      { en: "are you saying", pt: "você está dizendo" },
    ],
    foco_meta: {
      docs: "Use expressões para esclarecer requisitos em documentos.",
      calls: "Use expressões para pedir repetição em calls internacionais.",
      entrevistas: "Use expressões para pedir esclarecimento em perguntas técnicas.",
    },
  },

  // ── B1 ─────────────────────────────────────────────────────────────────

  "b1-u1-n1": {
    id: "b1-u1-n1", nivel: "B1", titulo: "Tell me about yourself",
    contexto: "Resposta estruturada para a pergunta mais comum de entrevistas em inglês. Foco em estrutura Present Perfect + Simple Past + Present.",
    frases_exemplo: [
      "I have been working in software quality assurance for three years.",
      "In my current role at Acme Corp, I lead the regression testing effort for our mobile app.",
      "Before that, I worked as a manual tester and transitioned into automation using Playwright.",
      "I'm passionate about improving processes and reducing production defects.",
      "I'm now looking for a role where I can grow into a QA lead position.",
    ],
    vocabulario: [
      { en: "I have been working", pt: "tenho trabalhado" },
      { en: "in my current role", pt: "na minha função atual" },
      { en: "I lead", pt: "eu lidero" },
      { en: "transitioned into", pt: "fiz transição para" },
      { en: "I'm passionate about", pt: "sou apaixonado por" },
      { en: "looking for", pt: "procurando" },
    ],
    foco_meta: {
      docs: "Inclua referência a contribuições em documentação técnica.",
      calls: "Inclua frases para apresentação em calls com equipes internacionais.",
      entrevistas: "Estruture a resposta completa de 60 segundos para entrevistas.",
    },
  },

  // ── B2 ─────────────────────────────────────────────────────────────────

  "b2-u1-n1": {
    id: "b2-u1-n1", nivel: "B2", titulo: "Opening & closing meetings",
    contexto: "Fórmulas avançadas para abrir e fechar reuniões como líder de QA. Foco em linguagem formal, gerenciamento de agenda, expressões de facilitação.",
    frases_exemplo: [
      "Thank you all for joining. Let's get started — today's agenda has three items.",
      "Before we dive in, I'd like to set some ground rules.",
      "Let's park that discussion for now and add it to the backlog.",
      "To summarize what we've agreed: we'll prioritize the payment flow in this sprint.",
      "Thank you all for your input. I'll send the meeting notes and action items within the hour.",
    ],
    vocabulario: [
      { en: "let's get started", pt: "vamos começar" },
      { en: "agenda", pt: "pauta" },
      { en: "park that discussion", pt: "deixar essa discussão para depois" },
      { en: "to summarize", pt: "para resumir" },
      { en: "action items", pt: "itens de ação" },
      { en: "within the hour", pt: "dentro de uma hora" },
    ],
    foco_meta: {
      docs: "Inclua frases para registrar atas e decisões.",
      calls: "Inclua expressões para facilitar reuniões remotas internacionais.",
      entrevistas: "Inclua frases para demonstrar experiência em liderança de reuniões.",
    },
  },
};
```

- [ ] **4.2 — Verificar TypeScript**

```bash
npx tsc --noEmit
```

Esperado: zero erros. `LicaoBase` e `licoesBases` exportados corretamente.

- [ ] **4.3 — Commit**

```bash
git add src/data/ingles-licoes.ts
git commit -m "feat: adiciona conteúdo-base das lições English for QA"
```

---

## Tarefa 5 — `src/app/api/ingles/nivelamento/route.ts`

Recebe o estado do teste adaptativo, valida a resposta e retorna a próxima questão ou o resultado final.

- [ ] **5.1 — Criar o arquivo**

```typescript
// src/app/api/ingles/nivelamento/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getQuestaoParaNivel } from "@/data/ingles-nivelamento";
import type { NivelCEFR } from "@/data/ingles-curriculum";

const PESOS: Record<NivelCEFR, number> = { A1: 1, A2: 2, B1: 3, B2: 4 };
const ORDEM: NivelCEFR[] = ["A1", "A2", "B1", "B2"];

function subirNivel(nivel: NivelCEFR): NivelCEFR {
  const idx = ORDEM.indexOf(nivel);
  return idx < ORDEM.length - 1 ? ORDEM[idx + 1] : nivel;
}

function descerNivel(nivel: NivelCEFR): NivelCEFR {
  const idx = ORDEM.indexOf(nivel);
  return idx > 0 ? ORDEM[idx - 1] : nivel;
}

function calcularNivelFinal(score: number): NivelCEFR {
  if (score < 4) return "A1";
  if (score < 10) return "A2";
  if (score < 18) return "B1";
  return "B2";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    questao_idx,       // number — qual questão acabou de ser respondida (0-based)
    acertou,           // boolean
    estado,            // { score: number; nivel_corrente: NivelCEFR; usados: string[] }
  } = body as {
    questao_idx: number;
    acertou: boolean;
    estado: { score: number; nivel_corrente: NivelCEFR; usados: string[] };
  };

  const novoScore = acertou
    ? estado.score + PESOS[estado.nivel_corrente]
    : estado.score;

  const novoNivel: NivelCEFR = acertou
    ? subirNivel(estado.nivel_corrente)
    : descerNivel(estado.nivel_corrente);

  // Última questão (índice 9 = 10ª questão)
  if (questao_idx >= 9) {
    return NextResponse.json({
      fim: true,
      nivel: calcularNivelFinal(novoScore),
      score: novoScore,
    });
  }

  // Próxima questão
  const proxima = getQuestaoParaNivel(novoNivel, estado.usados);
  if (!proxima) {
    // Sem questões disponíveis para o nível — tenta o nível adjacente
    const alternativo = acertou ? estado.nivel_corrente : subirNivel(novoNivel);
    const proxAlt = getQuestaoParaNivel(alternativo, estado.usados);
    if (!proxAlt) {
      return NextResponse.json({
        fim: true,
        nivel: calcularNivelFinal(novoScore),
        score: novoScore,
      });
    }
    return NextResponse.json({
      fim: false,
      questao: proxAlt,
      estado: { score: novoScore, nivel_corrente: alternativo, usados: [...estado.usados, proxAlt.id] },
    });
  }

  return NextResponse.json({
    fim: false,
    questao: proxima,
    estado: { score: novoScore, nivel_corrente: novoNivel, usados: [...estado.usados, proxima.id] },
  });
}
```

- [ ] **5.2 — Testar manualmente no terminal**

```bash
# Iniciar o servidor de dev
npm run dev

# Em outro terminal — simular primeira chamada (questão_idx=0, acertou)
curl -X POST http://localhost:3000/api/ingles/nivelamento \
  -H "Content-Type: application/json" \
  -d '{"questao_idx":0,"acertou":true,"estado":{"score":0,"nivel_corrente":"A2","usados":[]}}'
```

Esperado: JSON com `fim: false`, `questao` (objeto com id/pergunta/opcoes/correta) e `estado.score: 2`.

- [ ] **5.3 — Commit**

```bash
git add src/app/api/ingles/nivelamento/route.ts
git commit -m "feat: adiciona API de nivelamento adaptativo"
```

---

## Tarefa 6 — `src/app/api/ingles/exercicios/route.ts`

Recebe o id da lição e o nível, chama o Groq para gerar 6 exercícios variados e retorna o array.

- [ ] **6.1 — Criar o arquivo**

```typescript
// src/app/api/ingles/exercicios/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { licoesBases } from "@/data/ingles-licoes";
import type { NivelCEFR, MetaIngles, TipoExercicio } from "@/data/ingles-curriculum";

export type ExercicioMultipla = {
  tipo: "multipla";
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
};
export type ExercicioTraducao = {
  tipo: "traducao";
  frase_pt: string;
  resposta_esperada: string;
  explicacao: string;
};
export type ExercicioOrdenar = {
  tipo: "ordenar";
  instrucao: string;
  palavras: string[];
  frase_correta: string;
  explicacao: string;
};
export type ExercicioSpeaking = {
  tipo: "speaking";
  frase: string;
  dica?: string;
};
export type ExercicioCompletar = {
  tipo: "completar";
  frase: string;
  lacuna: string;
  opcoes: string[];
  explicacao: string;
};
export type ExercicioListening = {
  tipo: "listening";
  frase: string;
  explicacao: string;
};

export type Exercicio =
  | ExercicioMultipla
  | ExercicioTraducao
  | ExercicioOrdenar
  | ExercicioSpeaking
  | ExercicioCompletar
  | ExercicioListening;

function tiposPermitidos(nivel: NivelCEFR): TipoExercicio[] {
  // Speaking desabilitado em A1
  const base: TipoExercicio[] = ["multipla", "traducao", "ordenar", "completar", "listening"];
  return nivel === "A1" ? base : [...base, "speaking"];
}

function distribuirTipos(nivel: NivelCEFR, quantidade: number): TipoExercicio[] {
  const permitidos = tiposPermitidos(nivel);
  const maxPorTipo = Math.ceil(quantidade / permitidos.length) + 1;
  const resultado: TipoExercicio[] = [];
  const contagem: Partial<Record<TipoExercicio, number>> = {};
  while (resultado.length < quantidade) {
    const disponiveis = permitidos.filter(t => (contagem[t] || 0) < maxPorTipo);
    const escolhido = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    resultado.push(escolhido);
    contagem[escolhido] = (contagem[escolhido] || 0) + 1;
  }
  return resultado;
}

export async function POST(req: NextRequest) {
  const { licao_id, nivel, meta, quantidade = 6 } = await req.json() as {
    licao_id: string;
    nivel: NivelCEFR;
    meta: MetaIngles;
    quantidade?: number;
  };

  const base = licoesBases[licao_id];
  const tipos = distribuirTipos(nivel, quantidade);
  const focoDaMeta = base?.foco_meta?.[meta] ?? "";

  const prompt = `Você é um professor de inglês especializado em profissionais de QA/software testing.
Gere exatamente ${quantidade} exercícios de inglês para a seguinte lição.

LIÇÃO: ${base?.titulo ?? licao_id}
NÍVEL CEFR: ${nivel}
CONTEXTO: ${base?.contexto ?? "Vocabulário técnico de QA em inglês"}
FRASES DE REFERÊNCIA: ${(base?.frases_exemplo ?? []).join(" | ")}
VOCABULÁRIO-ALVO: ${(base?.vocabulario ?? []).map(v => `${v.en} = ${v.pt}`).join(", ")}
PERSONALIZAÇÃO: ${focoDaMeta}
TIPOS NA ORDEM: ${tipos.join(", ")}

REGRAS:
- Gere exatamente ${quantidade} exercícios, na ordem dos tipos listados em TIPOS NA ORDEM
- Distribua os tipos conforme a lista — pode repetir tipos se necessário
- Todos os exercícios devem usar vocabulário de QA e software testing
- Para "speaking": apenas 1 frase curta (máx 10 palavras) para repetir
- Para "listening": frase que um QA usaria em reuniões ou documentos
- Para "ordenar": embaralhe as palavras no array "palavras" (não entregue na ordem correta)
- Para "traducao": frase em português no campo "frase_pt"
- Para "completar": use ___ no campo "frase" para indicar a lacuna

RESPONDA APENAS COM JSON VÁLIDO (array de 6 objetos), sem markdown:
[
  {"tipo":"multipla","pergunta":"...","opcoes":["A","B","C"],"correta":0,"explicacao":"..."},
  {"tipo":"traducao","frase_pt":"...","resposta_esperada":"...","explicacao":"..."},
  {"tipo":"ordenar","instrucao":"Monte a frase:","palavras":["word","word2"],"frase_correta":"...","explicacao":"..."},
  {"tipo":"speaking","frase":"...","dica":"..."},
  {"tipo":"completar","frase":"The ___ failed.","lacuna":"test","opcoes":["test","bug","deploy"],"explicacao":"..."},
  {"tipo":"listening","frase":"...","explicacao":"..."}
]`;

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const raw = completion.choices[0]?.message?.content ?? "[]";
  let exercicios: Exercicio[];
  try {
    exercicios = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Erro ao gerar exercícios" }, { status: 500 });
  }

  return NextResponse.json({ exercicios });
}
```

- [ ] **6.2 — Testar manualmente**

```bash
curl -X POST http://localhost:3000/api/ingles/exercicios \
  -H "Content-Type: application/json" \
  -d '{"licao_id":"a1-u1-n1","nivel":"A1","meta":"docs"}'
```

Esperado: `{ "exercicios": [ ...6 objetos... ] }` com tipos variados, zero erros de parsing.

- [ ] **6.3 — Commit**

```bash
git add src/app/api/ingles/exercicios/route.ts
git commit -m "feat: adiciona API de geração de exercícios via Groq"
```

---

## Tarefa 7 — `src/app/api/ingles/pronuncia/route.ts`

Recebe o transcript do Web Speech API e a frase esperada, pede ao Groq para avaliar a pronúncia, salva o score no Supabase e retorna o resultado.

- [ ] **7.1 — Criar o arquivo**

```typescript
// src/app/api/ingles/pronuncia/route.ts
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";
import type { NivelCEFR } from "@/data/ingles-curriculum";

function criarSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const { esperado, transcript, nivel, user_id, licao_id } = await req.json() as {
    esperado: string;
    transcript: string;
    nivel: NivelCEFR;
    user_id: string;
    licao_id: string;
  };

  const prompt = `Você é um avaliador de pronúncia de inglês especializado em falantes de português brasileiro.

FRASE ESPERADA: "${esperado}"
O QUE O USUÁRIO DISSE (transcript): "${transcript}"
NÍVEL DO ALUNO: ${nivel}

Analise a pronúncia comparando a frase esperada com o que foi transcrito.
Considere erros comuns de falantes de pt-BR:
- Substituição de "th" por "d" ou "f" (ex: "the" → "de")
- Confusão v/b (ex: "very" → "bery")
- Pronúncia de "-ed" final (ex: "walked" → "walkéd")
- Vogais longas/curtas (ex: "ship" vs "sheep")
- Sílabas tônicas erradas

RESPONDA APENAS COM JSON VÁLIDO, sem markdown:
{
  "score": 85,
  "erros": ["critical pronunciado como 'creetical'"],
  "dica": "Atenção ao 'i' em 'critical' — é um som curto /ɪ/, não longo. Tente: KRIT-ih-kul"
}

Regras do score:
- 100 = perfeito (transcript idêntico ou equivalente fonético)
- -15 por cada erro de pronúncia identificado
- Mínimo 10
- Se o transcript estiver muito diferente (usuário falou outra coisa), score = 10`;

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 400,
  });

  const raw = completion.choices[0]?.message?.content ?? '{"score":50,"erros":[],"dica":""}';
  let resultado: { score: number; erros: string[]; dica: string };
  try {
    resultado = JSON.parse(raw);
  } catch {
    resultado = { score: 50, erros: [], dica: "Não foi possível avaliar. Tente novamente." };
  }

  // Salvar score no Supabase
  if (user_id && licao_id) {
    const supabase = criarSupabase();
    await supabase.from("ingles_scores_pronuncia").insert({
      user_id,
      licao_id,
      frase: esperado,
      score: resultado.score,
      transcript,
    });

    // Atualizar média no ingles_progresso
    const { data: scores } = await supabase
      .from("ingles_scores_pronuncia")
      .select("score")
      .eq("user_id", user_id);

    if (scores && scores.length > 0) {
      const media = scores.reduce((acc, s) => acc + s.score, 0) / scores.length;
      await supabase
        .from("ingles_progresso")
        .update({ score_pronuncia_medio: Math.round(media) })
        .eq("user_id", user_id);
    }
  }

  return NextResponse.json(resultado);
}
```

- [ ] **7.2 — Testar manualmente**

```bash
curl -X POST http://localhost:3000/api/ingles/pronuncia \
  -H "Content-Type: application/json" \
  -d '{"esperado":"I found a critical bug","transcript":"I found a creetical bug","nivel":"A2","user_id":"","licao_id":"a2-u2-n1"}'
```

Esperado: `{ "score": 85, "erros": ["..."], "dica": "..." }`. Score abaixo de 100 por "creetical".

- [ ] **7.3 — Commit**

```bash
git add src/app/api/ingles/pronuncia/route.ts
git commit -m "feat: adiciona API de avaliação de pronúncia via Groq"
```

---

## Tarefa 8 — `src/app/inicio/ingles/page.tsx`

Onboarding com 3 steps: meta do usuário → 10 questões adaptativas → resultado + enrollment.

- [ ] **8.1 — Criar o arquivo**

```typescript
// src/app/inicio/ingles/page.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { bancoNivelamento } from "@/data/ingles-nivelamento";
import type { NivelCEFR, MetaIngles } from "@/data/ingles-curriculum";
import type { QuestaoNivelamento } from "@/data/ingles-nivelamento";

type EstadoNivelamento = {
  score: number;
  nivel_corrente: NivelCEFR;
  usados: string[];
};

const COR_NIVEL: Record<NivelCEFR, string> = {
  A1: "#22c55e", A2: "#3b82f6", B1: "#8b5cf6", B2: "#f97316",
};

const DESC_NIVEL: Record<NivelCEFR, string> = {
  A1: "Você está começando do zero. Perfeito — vamos construir uma base sólida com vocabulário essencial de QA.",
  A2: "Você já tem uma base. Vamos trabalhar bug reports, sprint vocabulary e expressões para reuniões.",
  B1: "Bom nível! Vamos focar em entrevistas técnicas, code reviews e comunicação avançada com stakeholders.",
  B2: "Nível avançado! Vamos trabalhar liderança, apresentações e negociação em inglês.",
};

const logoGold: React.CSSProperties = {
  background: "linear-gradient(135deg, #d4af37, #f5d76e)",
  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
};

export default function InicioIngles() {
  const [step, setStep] = useState<"meta" | "teste" | "resultado">("meta");
  const [meta, setMeta] = useState<MetaIngles | "">("");
  const [questaoAtual, setQuestaoAtual] = useState<QuestaoNivelamento | null>(null);
  const [estado, setEstado] = useState<EstadoNivelamento>({
    score: 0, nivel_corrente: "A2", usados: [],
  });
  const [questaoIdx, setQuestaoIdx] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null);
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [nivelFinal, setNivelFinal] = useState<NivelCEFR | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data } = await supabase.from("usuario_certificacoes")
        .select("id").eq("user_id", user.id).eq("certificacao_id", "ingles").single();
      if (data) window.location.href = "/ingles";
    })();
  }, []);

  const iniciarTeste = () => {
    // Primeira questão — começa em A2
    const primeira = bancoNivelamento.find(q => q.nivel === "A2");
    if (!primeira) return;
    setQuestaoAtual(primeira);
    setEstado({ score: 0, nivel_corrente: "A2", usados: [primeira.id] });
    setStep("teste");
  };

  const responder = async (idx: number) => {
    if (respostaSelecionada !== null) return;
    setRespostaSelecionada(idx);
    setMostrarFeedback(true);
  };

  const avancar = async () => {
    if (!questaoAtual) return;
    const acertou = respostaSelecionada === questaoAtual.correta;

    const res = await fetch("/api/ingles/nivelamento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questao_idx: questaoIdx, acertou, estado }),
    });
    const data = await res.json();

    if (data.fim) {
      setNivelFinal(data.nivel);
      setStep("resultado");
    } else {
      setQuestaoAtual(data.questao);
      setEstado(data.estado);
      setQuestaoIdx(q => q + 1);
      setRespostaSelecionada(null);
      setMostrarFeedback(false);
    }
  };

  const concluir = async () => {
    if (!nivelFinal) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("usuario_certificacoes").insert({
      user_id: user.id,
      certificacao_id: "ingles",
      status: "em_andamento",
      semana_atual: 0,
      pontos: 0,
      streak: 0,
      maior_streak: 0,
      data_inicio: new Date().toISOString().split("T")[0],
      data_meta: null,
    });

    await supabase.from("ingles_progresso").upsert({
      user_id: user.id,
      nivel_atual: nivelFinal,
      meta: meta || "docs",
      licoes_concluidas: [],
    });

    window.location.href = "/ingles";
  };

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "2rem", fontFamily: "sans-serif" }}>

      <a href="/cursos" style={{ display: "flex", alignItems: "center", gap: "8px",
        textDecoration: "none", marginBottom: "2rem" }}>
        <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "26px", height: "26px" }} />
        <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.1rem", ...logoGold }}>
          TestPath
        </span>
      </a>

      <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px",
        padding: "2.5rem", width: "100%", maxWidth: "480px" }}>

        {/* STEP: META */}
        {step === "meta" && (
          <div>
            <div style={{ fontSize: "10px", color: "#22c55e", letterSpacing: "0.06em", marginBottom: "8px" }}>
              ENGLISH FOR QA
            </div>
            <h2 style={{ fontSize: "1.3rem", color: "#e5e7eb", fontFamily: "Georgia, serif",
              fontWeight: "normal", marginBottom: "8px" }}>
              Qual é o seu objetivo com inglês?
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "20px" }}>
              Vamos personalizar o curso para o que você mais precisa.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              {([
                { id: "docs", label: "Ler documentação técnica", desc: "Entender docs, RFCs, changelogs e API docs em inglês" },
                { id: "calls", label: "Participar de calls e reuniões", desc: "Stand-ups, sprints, demos e reuniões com times internacionais" },
                { id: "entrevistas", label: "Passar em entrevistas", desc: "Entrevistas técnicas em inglês para empresas globais" },
              ] as { id: MetaIngles; label: string; desc: string }[]).map(op => (
                <button key={op.id} onClick={() => setMeta(op.id)}
                  style={{ background: meta === op.id ? "rgba(34,197,94,0.1)" : "#0d1117",
                    border: `1px solid ${meta === op.id ? "#22c55e" : "#374151"}`,
                    borderRadius: "10px", padding: "12px 14px", textAlign: "left",
                    cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ fontSize: "13px", fontWeight: "600",
                    color: meta === op.id ? "#22c55e" : "#e5e7eb" }}>{op.label}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{op.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={iniciarTeste} disabled={!meta}
              style={{ width: "100%", background: meta ? "#22c55e" : "#1f2937",
                border: "none", borderRadius: "10px", padding: "13px",
                color: meta ? "#000" : "#6b7280", fontSize: "14px", fontWeight: "700",
                cursor: meta ? "pointer" : "default", transition: "background 0.15s" }}>
              Fazer teste de nivelamento →
            </button>
          </div>
        )}

        {/* STEP: TESTE */}
        {step === "teste" && questaoAtual && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.06em" }}>
                QUESTÃO {questaoIdx + 1} DE 10
              </div>
              <div style={{ fontSize: "10px", color: "#22c55e" }}>
                Nível detectado: {estado.nivel_corrente}
              </div>
            </div>
            <div style={{ background: "#1f2937", borderRadius: "99px", height: "4px", marginBottom: "20px" }}>
              <div style={{ background: "#22c55e", width: `${(questaoIdx / 10) * 100}%`,
                height: "4px", borderRadius: "99px", transition: "width 0.3s" }} />
            </div>
            <p style={{ color: "#e5e7eb", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
              {questaoAtual.pergunta}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {questaoAtual.opcoes.map((opcao, i) => {
                let bg = "#0d1117"; let border = "#374151"; let cor = "#e5e7eb";
                if (mostrarFeedback) {
                  if (i === questaoAtual.correta) { bg = "rgba(34,197,94,0.1)"; border = "#22c55e"; cor = "#22c55e"; }
                  else if (i === respostaSelecionada) { bg = "rgba(239,68,68,0.1)"; border = "#ef4444"; cor = "#ef4444"; }
                } else if (i === respostaSelecionada) {
                  bg = "rgba(34,197,94,0.1)"; border = "#22c55e"; cor = "#22c55e";
                }
                return (
                  <button key={i} onClick={() => responder(i)}
                    style={{ background: bg, border: `1px solid ${border}`, borderRadius: "10px",
                      padding: "11px 14px", textAlign: "left", cursor: "pointer",
                      fontSize: "13px", color: cor, transition: "all 0.15s" }}>
                    {opcao}
                  </button>
                );
              })}
            </div>
            {mostrarFeedback && (
              <button onClick={avancar}
                style={{ width: "100%", background: "#22c55e", border: "none",
                  borderRadius: "10px", padding: "12px", color: "#000",
                  fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
                {questaoIdx >= 9 ? "Ver meu nível →" : "Próxima →"}
              </button>
            )}
          </div>
        )}

        {/* STEP: RESULTADO */}
        {step === "resultado" && nivelFinal && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🎉</div>
            <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.1em", marginBottom: "8px" }}>
              SEU NÍVEL
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold", fontFamily: "Georgia, serif",
              color: COR_NIVEL[nivelFinal], marginBottom: "16px" }}>
              {nivelFinal}
            </div>
            <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: "1.7", marginBottom: "24px" }}>
              {DESC_NIVEL[nivelFinal]}
            </p>
            <button onClick={concluir} disabled={loading}
              style={{ width: "100%", background: COR_NIVEL[nivelFinal], border: "none",
                borderRadius: "10px", padding: "13px", color: "#000",
                fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
              {loading ? "Criando sua trilha..." : `Começar trilha ${nivelFinal} →`}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
```

- [ ] **8.2 — Verificar no browser**

```
npm run dev
# Abrir http://localhost:3000/inicio/ingles
```

Verificar: (1) redireciona para /login se não autenticado; (2) seleção de meta habilita botão; (3) questões aparecem em sequência; (4) feedback verde/vermelho por acerto/erro; (5) resultado exibe nível correto.

- [ ] **8.3 — Commit**

```bash
git add src/app/inicio/ingles/page.tsx
git commit -m "feat: adiciona onboarding e nivelamento do curso English for QA"
```

---

## Tarefa 9 — `src/app/ingles/page.tsx`

Trilha de nodes estilo Duolingo — exibe os nodes do nível atual do usuário com estado concluído/ativo/bloqueado.

- [ ] **9.1 — Criar o arquivo**

```typescript
// src/app/ingles/page.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { curriculumIngles } from "@/data/ingles-curriculum";
import type { NivelCEFR, NivelMeta, NodeMeta } from "@/data/ingles-curriculum";

type Progresso = { nivel_atual: NivelCEFR; licoes_concluidas: string[]; meta: string };

const logoGold: React.CSSProperties = {
  background: "linear-gradient(135deg, #d4af37, #f5d76e)",
  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
};

export default function InglesPage() {
  const [progresso, setProgresso] = useState<Progresso | null>(null);
  const [nivelData, setNivelData] = useState<NivelMeta | null>(null);
  const [xp, setXp] = useState(0);
  const [perfil, setPerfil] = useState<{ nome: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }

    const { data: perfilData } = await supabase
      .from("profiles").select("nome").eq("id", user.id).single();
    if (perfilData) setPerfil(perfilData);

    const { data: cert } = await supabase.from("usuario_certificacoes")
      .select("pontos").eq("user_id", user.id).eq("certificacao_id", "ingles").single();
    if (!cert) { window.location.href = "/inicio/ingles"; return; }
    setXp(cert.pontos || 0);

    const { data: prog } = await supabase.from("ingles_progresso")
      .select("nivel_atual, licoes_concluidas, meta").eq("user_id", user.id).single();
    if (!prog) { window.location.href = "/inicio/ingles"; return; }

    setProgresso(prog);
    const nivel = curriculumIngles.find(n => n.nivel === prog.nivel_atual) ?? curriculumIngles[0];
    setNivelData(nivel);
    setLoading(false);
  };

  const sair = async () => { await supabase.auth.signOut(); window.location.href = "/"; };

  if (loading) return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#22c55e", fontFamily: "Georgia, serif" }}>Carregando sua trilha...</div>
    </main>
  );

  const concluidas = new Set(progresso?.licoes_concluidas ?? []);
  const cor = nivelData?.cor ?? "#22c55e";

  // XP máximo por nível (todos os nodes × xp)
  const xpMax = nivelData?.unidades.flatMap(u => u.nodes).reduce((acc, n) => acc + n.xp, 0) ?? 500;

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb", fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0.875rem 2rem", borderBottom: "1px solid #1f2937", position: "sticky",
        top: 0, background: "rgba(11,15,26,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "24px", height: "24px" }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.1rem", ...logoGold }}>
            TestPath
          </span>
          <span style={{ fontSize: "11px", background: `${cor}18`, color: cor,
            border: `1px solid ${cor}44`, padding: "2px 8px", borderRadius: "99px" }}>
            English {progresso?.nivel_atual}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <a href="/ingles/revisao" style={{ color: "#9ca3af", fontSize: "12px",
            textDecoration: "none", border: "1px solid #374151", borderRadius: "8px",
            padding: "5px 10px" }}>🔁 Revisão</a>
          <a href="/cursos" style={{ color: "#9ca3af", fontSize: "12px",
            textDecoration: "none", border: "1px solid #374151", borderRadius: "8px",
            padding: "5px 10px" }}>Cursos</a>
          <button onClick={sair} style={{ background: "transparent", border: "1px solid #374151",
            borderRadius: "8px", padding: "5px 12px", color: "#9ca3af",
            fontSize: "12px", cursor: "pointer" }}>Sair</button>
        </div>
      </nav>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Header do nível */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em", marginBottom: "4px" }}>
            NÍVEL {progresso?.nivel_atual} — {nivelData?.titulo.toUpperCase()}
          </div>
          <div style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "12px" }}>
            {nivelData?.descricao}
          </div>
          {/* XP bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "14px" }}>⭐</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between",
                fontSize: "10px", color: "#6b7280", marginBottom: "3px" }}>
                <span>XP do nível</span><span>{xp} / {xpMax}</span>
              </div>
              <div style={{ background: "#1f2937", borderRadius: "99px", height: "5px" }}>
                <div style={{ background: cor, width: `${Math.min((xp / xpMax) * 100, 100)}%`,
                  height: "5px", borderRadius: "99px", transition: "width 0.5s" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Trilha de nodes por unidade */}
        {nivelData?.unidades.map(unidade => {
          const todosAnterioresConcluidos = nivelData.unidades
            .slice(0, unidade.numero - 1)
            .every(u => u.nodes.every(n => concluidas.has(n.id)));
          const unidadeBloqueada = unidade.numero > 1 && !todosAnterioresConcluidos;

          return (
            <div key={unidade.numero} style={{ marginBottom: "32px" }}>
              <div style={{ fontSize: "10px", color: unidadeBloqueada ? "#374151" : "#6b7280",
                letterSpacing: "0.08em", marginBottom: "12px" }}>
                {unidade.emoji} UNIDADE {unidade.numero} — {unidade.titulo.toUpperCase()}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>
                {unidade.nodes.map((node, nodeIdx) => {
                  const anterior = nodeIdx === 0
                    ? (unidade.numero === 1 || !unidadeBloqueada)
                    : concluidas.has(unidade.nodes[nodeIdx - 1].id);
                  const concluido = concluidas.has(node.id);
                  const ativo = !concluido && anterior && !unidadeBloqueada;
                  const bloqueado = !concluido && !ativo;

                  const bgNode = concluido ? cor : ativo ? cor : "#1f2937";
                  const borderNode = bloqueado ? "#374151" : cor;
                  const emoji = node.tipo === "checkpoint" ? "🏆"
                    : concluido ? "✓" : bloqueado ? "🔒" : "📝";

                  return (
                    <div key={node.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      {nodeIdx > 0 && (
                        <div style={{ width: "2px", height: "16px",
                          background: concluidas.has(unidade.nodes[nodeIdx - 1].id) ? `${cor}66` : "#1f2937" }} />
                      )}
                      <div style={{ position: "relative" }}>
                        {ativo && (
                          <div style={{ position: "absolute", top: "-28px", left: "50%",
                            transform: "translateX(-50%)", background: cor, color: "#000",
                            fontSize: "9px", fontWeight: "bold", padding: "3px 8px",
                            borderRadius: "99px", whiteSpace: "nowrap" }}>
                            CONTINUAR
                          </div>
                        )}
                        <button
                          onClick={() => !bloqueado && (window.location.href = `/ingles/licao/${node.id}`)}
                          style={{
                            width: ativo ? "60px" : "52px",
                            height: ativo ? "60px" : "52px",
                            borderRadius: "50%",
                            background: bloqueado ? "#1f2937" : `${bgNode}`,
                            border: `2px solid ${borderNode}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: ativo ? "1.5rem" : "1.2rem",
                            cursor: bloqueado ? "default" : "pointer",
                            boxShadow: ativo ? `0 0 0 6px ${cor}33` : "none",
                            opacity: bloqueado ? 0.4 : 1,
                            transition: "all 0.2s",
                          }}>
                          {emoji}
                        </button>
                      </div>
                      <div style={{ fontSize: "10px", color: bloqueado ? "#374151" : "#6b7280",
                        marginTop: "4px", marginBottom: "4px", textAlign: "center", maxWidth: "100px" }}>
                        {node.titulo}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
```

- [ ] **9.2 — Verificar no browser**

```
# Com um usuário que completou o onboarding:
# Abrir http://localhost:3000/ingles
```

Verificar: (1) primeiro node ativo, restantes bloqueados; (2) node concluído mostra ✓; (3) clique em node ativo navega para `/ingles/licao/[id]`; (4) XP bar reflete pontos do usuário.

- [ ] **9.3 — Commit**

```bash
git add src/app/ingles/page.tsx
git commit -m "feat: adiciona trilha de nodes do curso English for QA"
```

---

## Tarefa 10 — `src/app/ingles/licao/[id]/page.tsx`

Player de lição: carrega 6 exercícios do Groq, exibe um por vez, feedback imediato, salva XP e erros na fila de revisão ao concluir.

- [ ] **10.1 — Criar o arquivo**

```typescript
// src/app/ingles/licao/[id]/page.tsx
"use client";
import { use, useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { getNode, getProximoNode } from "@/data/ingles-curriculum";
import type { Exercicio } from "@/app/api/ingles/exercicios/route";

const logoGold: React.CSSProperties = {
  background: "linear-gradient(135deg, #d4af37, #f5d76e)",
  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
};

export default function LicaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const info = getNode(id);
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [idx, setIdx] = useState(0);
  const [respostaUsuario, setRespostaUsuario] = useState<string>("");
  const [palavrasSelecionadas, setPalavrasSelecionadas] = useState<string[]>([]);
  const [respostaIdx, setRespostaIdx] = useState<number | null>(null);
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [acertou, setAcertou] = useState(false);
  const [xpGanho, setXpGanho] = useState(0);
  const [concluida, setConcluida] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [acertosCount, setAcertosCount] = useState(0);
  const isCheckpoint = info?.node.tipo === "checkpoint";
  const [scorePronutncia, setScorePronuncia] = useState<number | null>(null);
  const [transcriptAtual, setTranscriptAtual] = useState("");
  const [gravando, setGravando] = useState(false);
  const [suportaSpeech, setSuportaSpeech] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    setSuportaSpeech("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
    carregar();
  }, []);

  const carregar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }
    setUserId(user.id);

    const { data: prog } = await supabase.from("ingles_progresso")
      .select("nivel_atual, meta").eq("user_id", user.id).single();
    if (!prog) { window.location.href = "/ingles"; return; }

    // Verificar se já concluída
    const { data: cert } = await supabase.from("usuario_certificacoes")
      .select("pontos").eq("user_id", user.id).eq("certificacao_id", "ingles").single();
    if (!cert) { window.location.href = "/ingles"; return; }

    const res = await fetch("/api/ingles/exercicios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Checkpoints recebem 10 exercícios; lições normais recebem 6
      body: JSON.stringify({
        licao_id: id,
        nivel: prog.nivel_atual,
        meta: prog.meta,
        quantidade: info?.node.tipo === "checkpoint" ? 10 : 6,
      }),
    });
    const data = await res.json();
    setExercicios(data.exercicios ?? []);
    setLoading(false);
  };

  const exercicioAtual = exercicios[idx];
  const cor = info?.nivel.cor ?? "#22c55e";

  // ── Verificar respostas ─────────────────────────────────────────────────

  const verificarMultipla = (i: number) => {
    if (mostrarFeedback) return;
    setRespostaIdx(i);
    const ex = exercicioAtual as { tipo: "multipla"; correta: number };
    const ok = i === ex.correta;
    setAcertou(ok);
    setMostrarFeedback(true);
    if (!ok) salvarRevisao();
  };

  const verificarTexto = () => {
    if (!respostaUsuario.trim() || mostrarFeedback) return;
    const ex = exercicioAtual as { tipo: "traducao" | "completar" | "listening"; resposta_esperada?: string; lacuna?: string; frase?: string };
    const esperada = ex.resposta_esperada ?? ex.lacuna ?? "";
    const ok = respostaUsuario.trim().toLowerCase() === esperada.toLowerCase();
    setAcertou(ok);
    setMostrarFeedback(true);
    if (!ok) salvarRevisao();
  };

  const verificarOrdenar = () => {
    if (mostrarFeedback) return;
    const ex = exercicioAtual as { tipo: "ordenar"; frase_correta: string };
    const montada = palavrasSelecionadas.join(" ");
    const ok = montada.toLowerCase() === ex.frase_correta.toLowerCase();
    setAcertou(ok);
    setMostrarFeedback(true);
    if (!ok) salvarRevisao();
  };

  const salvarRevisao = async () => {
    if (!userId) return;
    const ex = exercicioAtual;
    const item = ex.tipo === "traducao" ? (ex as { frase_pt: string }).frase_pt
      : ex.tipo === "ordenar" ? (ex as { frase_correta: string }).frase_correta
      : ex.tipo === "speaking" ? (ex as { frase: string }).frase
      : (ex as { frase?: string; pergunta?: string }).frase ?? (ex as { pergunta?: string }).pergunta ?? "";
    await supabase.from("ingles_revisao").upsert({
      user_id: userId, licao_id: id, item, tipo: ex.tipo,
      tentativas: 1, acertos: 0, proxima_revisao: new Date().toISOString(),
    });
  };

  // ── Speaking ────────────────────────────────────────────────────────────

  const iniciarGravacao = () => {
    const SpeechRecognition = (window as Window & { SpeechRecognition?: typeof window.SpeechRecognition; webkitSpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition
      || (window as Window & { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join("");
      setTranscriptAtual(t);
    };
    recognition.onend = async () => {
      setGravando(false);
      const ex = exercicioAtual as { tipo: "speaking"; frase: string };
      if (!transcriptAtual) return;
      const res = await fetch("/api/ingles/pronuncia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ esperado: ex.frase, transcript: transcriptAtual,
          nivel: info?.nivel.nivel ?? "A2", user_id: userId, licao_id: id }),
      });
      const data = await res.json();
      setScorePronuncia(data.score);
      setAcertou(data.score >= 60);
      setMostrarFeedback(true);
      if (data.score < 60) salvarRevisao();
    };
    recognition.start();
    recognitionRef.current = recognition;
    setGravando(true);
  };

  const pararGravacao = () => { recognitionRef.current?.stop(); };

  // ── TTS para Listening ──────────────────────────────────────────────────

  const tocarAudio = (frase: string) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(frase);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  // ── Avançar ─────────────────────────────────────────────────────────────

  const avancar = async () => {
    const xp = acertou ? 10 : 0;
    setXpGanho(t => t + xp);
    const novosAcertos = acertosCount + (acertou ? 1 : 0);
    setAcertosCount(novosAcertos);

    if (idx >= exercicios.length - 1) {
      // Checkpoint: exige 70% de acerto para passar
      if (isCheckpoint && novosAcertos / exercicios.length < 0.7) {
        // Reprovado — não marca como concluído, volta ao estado ativo
        alert(`Você acertou ${novosAcertos}/${exercicios.length}. Precisa de ${Math.ceil(exercicios.length * 0.7)} para passar. Tente novamente!`);
        window.location.href = `/ingles/licao/${id}`;
        return;
      }
      // Lição concluída — salvar progresso
      const xpTotal = xpGanho + xp + (info?.node.xp ?? 30);
      await supabase.from("ingles_progresso").select("licoes_concluidas")
        .eq("user_id", userId).single().then(async ({ data }) => {
          if (!data) return;
          const novas = [...(data.licoes_concluidas ?? []), id];
          await supabase.from("ingles_progresso")
            .update({ licoes_concluidas: novas }).eq("user_id", userId);
        });
      await supabase.from("usuario_certificacoes")
        .select("pontos").eq("user_id", userId).eq("certificacao_id", "ingles")
        .single().then(async ({ data }) => {
          if (!data) return;
          await supabase.from("usuario_certificacoes")
            .update({ pontos: (data.pontos ?? 0) + xpTotal, ultimo_estudo: new Date().toISOString().split("T")[0] })
            .eq("user_id", userId).eq("certificacao_id", "ingles");
        });
      setConcluida(true);
      return;
    }

    setIdx(i => i + 1);
    setRespostaUsuario("");
    setPalavrasSelecionadas([]);
    setRespostaIdx(null);
    setMostrarFeedback(false);
    setAcertou(false);
    setScorePronuncia(null);
    setTranscriptAtual("");
  };

  // ── Render exercícios ───────────────────────────────────────────────────

  const renderExercicio = () => {
    if (!exercicioAtual) return null;
    const ex = exercicioAtual;

    if (ex.tipo === "multipla") return (
      <div>
        <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em", marginBottom: "12px" }}>ESCOLHA A OPÇÃO CORRETA</div>
        <p style={{ color: "#e5e7eb", fontSize: "14px", marginBottom: "16px" }}>{ex.pergunta}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {ex.opcoes.map((op, i) => {
            let bg = "#0d1117", border = "#374151", cor2 = "#e5e7eb";
            if (mostrarFeedback) {
              if (i === ex.correta) { bg = "rgba(34,197,94,0.1)"; border = "#22c55e"; cor2 = "#22c55e"; }
              else if (i === respostaIdx) { bg = "rgba(239,68,68,0.1)"; border = "#ef4444"; cor2 = "#ef4444"; }
            } else if (i === respostaIdx) { bg = "rgba(34,197,94,0.1)"; border = cor; cor2 = cor; }
            return (
              <button key={i} onClick={() => verificarMultipla(i)}
                style={{ background: bg, border: `1px solid ${border}`, borderRadius: "10px",
                  padding: "11px 14px", textAlign: "left", cursor: "pointer",
                  fontSize: "13px", color: cor2, transition: "all 0.15s" }}>
                {op}
              </button>
            );
          })}
        </div>
        {mostrarFeedback && <p style={{ marginTop: "12px", fontSize: "12px", color: "#9ca3af" }}>{ex.explicacao}</p>}
      </div>
    );

    if (ex.tipo === "traducao") return (
      <div>
        <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em", marginBottom: "12px" }}>TRADUZA PARA O INGLÊS</div>
        <p style={{ color: "#e5e7eb", fontSize: "15px", fontStyle: "italic", marginBottom: "16px" }}>"{ex.frase_pt}"</p>
        <input value={respostaUsuario} onChange={e => setRespostaUsuario(e.target.value)}
          onKeyDown={e => e.key === "Enter" && verificarTexto()}
          disabled={mostrarFeedback}
          placeholder="Type in English..."
          style={{ width: "100%", background: "#0d1117", border: `1px solid ${mostrarFeedback ? (acertou ? "#22c55e" : "#ef4444") : "#374151"}`,
            borderRadius: "10px", padding: "11px 14px", color: "#e5e7eb",
            fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
        {mostrarFeedback && (
          <div style={{ marginTop: "10px" }}>
            {!acertou && <p style={{ fontSize: "12px", color: "#22c55e" }}>✓ {ex.resposta_esperada}</p>}
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>{ex.explicacao}</p>
          </div>
        )}
        {!mostrarFeedback && (
          <button onClick={verificarTexto} style={{ marginTop: "12px", width: "100%",
            background: cor, border: "none", borderRadius: "10px", padding: "11px",
            color: "#000", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
            Verificar
          </button>
        )}
      </div>
    );

    if (ex.tipo === "ordenar") {
      const palavrasDisponiveis = ex.palavras.filter(p => !palavrasSelecionadas.includes(p));
      return (
        <div>
          <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em", marginBottom: "12px" }}>MONTE A FRASE</div>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "12px" }}>{ex.instrucao}</p>
          <div style={{ minHeight: "44px", border: `1px dashed ${mostrarFeedback ? (acertou ? "#22c55e" : "#ef4444") : "#374151"}`,
            borderRadius: "10px", padding: "8px 10px", marginBottom: "12px",
            display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
            {palavrasSelecionadas.map((p, i) => (
              <button key={i} onClick={() => !mostrarFeedback && setPalavrasSelecionadas(s => s.filter((_, j) => j !== i))}
                style={{ background: `${cor}22`, border: `1px solid ${cor}44`, borderRadius: "6px",
                  padding: "4px 10px", fontSize: "12px", color: cor, cursor: "pointer" }}>
                {p}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
            {palavrasDisponiveis.map((p, i) => (
              <button key={i} onClick={() => !mostrarFeedback && setPalavrasSelecionadas(s => [...s, p])}
                style={{ background: "#111827", border: "1px solid #374151", borderRadius: "6px",
                  padding: "4px 10px", fontSize: "12px", color: "#9ca3af", cursor: "pointer" }}>
                {p}
              </button>
            ))}
          </div>
          {mostrarFeedback && !acertou && (
            <p style={{ fontSize: "12px", color: "#22c55e", marginBottom: "8px" }}>✓ {ex.frase_correta}</p>
          )}
          {mostrarFeedback && <p style={{ fontSize: "12px", color: "#9ca3af" }}>{ex.explicacao}</p>}
          {!mostrarFeedback && palavrasSelecionadas.length > 0 && (
            <button onClick={verificarOrdenar} style={{ width: "100%", background: cor, border: "none",
              borderRadius: "10px", padding: "11px", color: "#000",
              fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
              Verificar
            </button>
          )}
        </div>
      );
    }

    if (ex.tipo === "speaking") return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em", marginBottom: "12px" }}>REPITA EM VOZ ALTA</div>
        <p style={{ color: "#e5e7eb", fontSize: "16px", fontStyle: "italic", marginBottom: "20px" }}>"{ex.frase}"</p>
        {!suportaSpeech ? (
          <div style={{ background: "#1f2937", borderRadius: "10px", padding: "14px",
            fontSize: "12px", color: "#6b7280", marginBottom: "12px" }}>
            Speaking não disponível no seu navegador. Use Chrome para esta funcionalidade.
          </div>
        ) : (
          <>
            <button onClick={gravando ? pararGravacao : iniciarGravacao}
              disabled={mostrarFeedback}
              style={{ width: "64px", height: "64px", borderRadius: "50%",
                background: gravando ? "rgba(239,68,68,0.2)" : `${cor}22`,
                border: `2px solid ${gravando ? "#ef4444" : cor}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.6rem", cursor: "pointer", margin: "0 auto 12px" }}>
              🎙
            </button>
            {gravando && <p style={{ fontSize: "11px", color: "#ef4444", marginBottom: "8px" }}>Ouvindo... clique para parar</p>}
            {transcriptAtual && (
              <div style={{ background: "#0d1117", border: "1px solid #1f2937", borderRadius: "8px",
                padding: "8px 12px", fontSize: "12px", color: "#9ca3af", marginBottom: "12px" }}>
                "{transcriptAtual}"
              </div>
            )}
          </>
        )}
        {mostrarFeedback && scorePronutncia !== null && (
          <div style={{ background: "#0d1117", border: "1px solid #1f2937", borderRadius: "10px", padding: "12px" }}>
            <div style={{ fontSize: "22px", fontWeight: "bold", color: scorePronutncia >= 80 ? "#22c55e" : scorePronutncia >= 60 ? "#d4af37" : "#ef4444" }}>
              {scorePronutncia}<span style={{ fontSize: "12px", color: "#6b7280" }}>/100</span>
            </div>
          </div>
        )}
        {!suportaSpeech && !mostrarFeedback && (
          <button onClick={() => { setAcertou(true); setMostrarFeedback(true); }}
            style={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "10px",
              padding: "10px 20px", color: "#6b7280", fontSize: "12px", cursor: "pointer", marginTop: "8px" }}>
            Pular este exercício
          </button>
        )}
      </div>
    );

    if (ex.tipo === "completar") return (
      <div>
        <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em", marginBottom: "12px" }}>COMPLETE A FRASE</div>
        <p style={{ color: "#e5e7eb", fontSize: "14px", marginBottom: "16px" }}>{ex.frase}</p>
        {ex.opcoes && ex.opcoes.length > 0 ? (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
            {ex.opcoes.map((op, i) => (
              <button key={i} onClick={() => { if (!mostrarFeedback) { setRespostaUsuario(op); const ok = op.toLowerCase() === ex.lacuna.toLowerCase(); setAcertou(ok); setMostrarFeedback(true); if (!ok) salvarRevisao(); }}}
                style={{ background: mostrarFeedback && op.toLowerCase() === ex.lacuna.toLowerCase() ? "rgba(34,197,94,0.1)" : respostaUsuario === op ? `${cor}22` : "#0d1117",
                  border: `1px solid ${mostrarFeedback && op.toLowerCase() === ex.lacuna.toLowerCase() ? "#22c55e" : respostaUsuario === op ? cor : "#374151"}`,
                  borderRadius: "8px", padding: "8px 14px", fontSize: "13px",
                  color: mostrarFeedback && op.toLowerCase() === ex.lacuna.toLowerCase() ? "#22c55e" : "#e5e7eb",
                  cursor: "pointer" }}>
                {op}
              </button>
            ))}
          </div>
        ) : (
          <input value={respostaUsuario} onChange={e => setRespostaUsuario(e.target.value)}
            onKeyDown={e => e.key === "Enter" && verificarTexto()}
            disabled={mostrarFeedback} placeholder="Digite a palavra..."
            style={{ width: "100%", background: "#0d1117", border: `1px solid #374151`,
              borderRadius: "10px", padding: "11px 14px", color: "#e5e7eb",
              fontSize: "13px", outline: "none", boxSizing: "border-box", marginBottom: "12px" }} />
        )}
        {mostrarFeedback && <p style={{ fontSize: "12px", color: "#9ca3af" }}>{ex.explicacao}</p>}
        {!mostrarFeedback && !ex.opcoes?.length && (
          <button onClick={verificarTexto} style={{ width: "100%", background: cor, border: "none",
            borderRadius: "10px", padding: "11px", color: "#000", fontWeight: "700",
            fontSize: "13px", cursor: "pointer" }}>Verificar</button>
        )}
      </div>
    );

    if (ex.tipo === "listening") return (
      <div>
        <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em", marginBottom: "12px" }}>OUÇA E ESCREVA</div>
        <button onClick={() => tocarAudio(ex.frase)}
          style={{ width: "64px", height: "64px", borderRadius: "50%",
            background: `${cor}22`, border: `2px solid ${cor}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.6rem", cursor: "pointer", margin: "0 auto 16px" }}>
          👂
        </button>
        {!("speechSynthesis" in window) && (
          <p style={{ fontSize: "12px", color: "#6b7280", textAlign: "center", marginBottom: "12px" }}>
            Áudio não disponível no seu navegador. Frase: <em>"{ex.frase}"</em>
          </p>
        )}
        <input value={respostaUsuario} onChange={e => setRespostaUsuario(e.target.value)}
          onKeyDown={e => e.key === "Enter" && verificarTexto()}
          disabled={mostrarFeedback} placeholder="What did you hear?"
          style={{ width: "100%", background: "#0d1117", border: `1px solid ${mostrarFeedback ? (acertou ? "#22c55e" : "#ef4444") : "#374151"}`,
            borderRadius: "10px", padding: "11px 14px", color: "#e5e7eb",
            fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
        {mostrarFeedback && (
          <div style={{ marginTop: "10px" }}>
            {!acertou && <p style={{ fontSize: "12px", color: "#22c55e" }}>✓ {ex.frase}</p>}
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>{ex.explicacao}</p>
          </div>
        )}
        {!mostrarFeedback && (
          <button onClick={verificarTexto} style={{ marginTop: "12px", width: "100%",
            background: cor, border: "none", borderRadius: "10px", padding: "11px",
            color: "#000", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
            Verificar
          </button>
        )}
      </div>
    );

    return null;
  };

  if (loading) return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#22c55e", fontFamily: "Georgia, serif" }}>Preparando lição...</div>
    </main>
  );

  // Tela de conclusão
  if (concluida) {
    const proximo = info ? getProximoNode(id) : undefined;
    return (
      <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "2rem", fontFamily: "sans-serif" }}>
        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px",
          padding: "2.5rem", width: "100%", maxWidth: "400px", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🎉</div>
          <h2 style={{ color: "#e5e7eb", fontFamily: "Georgia, serif", fontSize: "1.3rem",
            fontWeight: "normal", marginBottom: "8px" }}>Lição concluída!</h2>
          <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "20px" }}>
            +{info?.node.xp ?? 30} XP ganhos
          </p>
          <button onClick={() => window.location.href = proximo ? `/ingles/licao/${proximo.id}` : "/ingles"}
            style={{ width: "100%", background: cor, border: "none", borderRadius: "10px",
              padding: "13px", color: "#000", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            {proximo ? `Próxima lição →` : "Ver minha trilha →"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0.875rem 2rem", borderBottom: "1px solid #1f2937" }}>
        <a href="/ingles" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <img src="/icons/favicon-96x96.png" alt="" style={{ width: "22px", height: "22px" }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1rem", ...logoGold }}>TestPath</span>
        </a>
        <div style={{ fontSize: "12px", color: "#6b7280" }}>{info?.node.titulo}</div>
      </nav>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Barra de progresso */}
        <div style={{ display: "flex", gap: "4px", marginBottom: "24px" }}>
          {exercicios.map((_, i) => (
            <div key={i} style={{ flex: 1, height: "6px", borderRadius: "99px",
              background: i < idx ? cor : i === idx ? `${cor}88` : "#1f2937" }} />
          ))}
          <span style={{ fontSize: "11px", color: "#6b7280", marginLeft: "8px", whiteSpace: "nowrap" }}>
            {idx + 1}/{exercicios.length}
          </span>
        </div>

        {/* Exercício */}
        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "1.5rem" }}>
          {renderExercicio()}
        </div>

        {/* Feedback e botão avançar */}
        {mostrarFeedback && (
          <div style={{ marginTop: "16px" }}>
            <div style={{ background: acertou ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              border: `1px solid ${acertou ? "#22c55e" : "#ef4444"}`, borderRadius: "10px",
              padding: "12px", marginBottom: "12px", display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "1.2rem" }}>{acertou ? "✅" : "❌"}</span>
              <span style={{ fontSize: "12px", color: acertou ? "#22c55e" : "#ef4444", fontWeight: "600" }}>
                {acertou ? "Correto!" : "Incorreto — continue praticando."}
              </span>
            </div>
            <button onClick={avancar}
              style={{ width: "100%", background: cor, border: "none", borderRadius: "10px",
                padding: "13px", color: "#000", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
              {idx >= exercicios.length - 1 ? "Concluir lição 🎉" : "Continuar →"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
```

- [ ] **10.2 — Verificar no browser**

```
# Abrir http://localhost:3000/ingles/licao/a1-u1-n1
```

Verificar: (1) exercícios carregam; (2) múltipla escolha dá feedback verde/vermelho; (3) tradução valida por enter ou botão; (4) ordenar permite montar e verificar; (5) listening toca áudio e valida digitação; (6) tela de conclusão aparece após 6 exercícios; (7) XP salvo em `usuario_certificacoes.pontos`.

- [ ] **10.3 — Commit**

```bash
git add src/app/ingles/licao/
git commit -m "feat: adiciona player de lições com 6 tipos de exercício e speaking"
```

---

## Tarefa 11 — `src/app/ingles/revisao/page.tsx`

Fila de revisão — exibe itens errados em sessões passadas e permite praticar novamente.

- [ ] **11.1 — Criar o arquivo**

```typescript
// src/app/ingles/revisao/page.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type ItemRevisao = {
  id: string;
  item: string;
  tipo: string;
  tentativas: number;
  acertos: number;
};

const logoGold: React.CSSProperties = {
  background: "linear-gradient(135deg, #d4af37, #f5d76e)",
  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
};

export default function RevisaoPage() {
  const [itens, setItens] = useState<ItemRevisao[]>([]);
  const [idxAtual, setIdxAtual] = useState(0);
  const [resposta, setResposta] = useState("");
  const [mostrarResposta, setMostrarResposta] = useState(false);
  const [loading, setLoading] = useState(true);
  const [concluida, setConcluida] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data } = await supabase.from("ingles_revisao")
        .select("*").eq("user_id", user.id)
        .lte("proxima_revisao", new Date().toISOString())
        .order("tentativas", { ascending: false }).limit(10);
      setItens(data ?? []);
      setLoading(false);
    })();
  }, []);

  const itemAtual = itens[idxAtual];

  const marcarAcerto = async () => {
    await supabase.from("ingles_revisao").update({
      acertos: itemAtual.acertos + 1,
      proxima_revisao: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    }).eq("id", itemAtual.id);
    avancar();
  };

  const marcarErro = async () => {
    await supabase.from("ingles_revisao").update({
      tentativas: itemAtual.tentativas + 1,
      proxima_revisao: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    }).eq("id", itemAtual.id);
    avancar();
  };

  const avancar = () => {
    if (idxAtual >= itens.length - 1) { setConcluida(true); return; }
    setIdxAtual(i => i + 1);
    setResposta("");
    setMostrarResposta(false);
  };

  if (loading) return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#22c55e", fontFamily: "Georgia, serif" }}>Carregando revisão...</div>
    </main>
  );

  if (concluida || itens.length === 0) return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px",
        padding: "2.5rem", width: "100%", maxWidth: "400px", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "12px" }}>✅</div>
        <h2 style={{ color: "#e5e7eb", fontFamily: "Georgia, serif", fontWeight: "normal", marginBottom: "8px" }}>
          {itens.length === 0 ? "Nenhum item para revisar agora!" : "Revisão concluída!"}
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "20px" }}>
          {itens.length === 0 ? "Continue praticando para acumular itens aqui." : `${itens.length} itens revisados.`}
        </p>
        <a href="/ingles" style={{ display: "block", background: "#22c55e", borderRadius: "10px",
          padding: "13px", color: "#000", fontSize: "14px", fontWeight: "700", textDecoration: "none" }}>
          Voltar à trilha →
        </a>
      </div>
    </main>
  );

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0.875rem 2rem", borderBottom: "1px solid #1f2937" }}>
        <a href="/ingles" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <img src="/icons/favicon-96x96.png" alt="" style={{ width: "22px", height: "22px" }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1rem", ...logoGold }}>TestPath</span>
        </a>
        <div style={{ fontSize: "12px", color: "#6b7280" }}>🔁 Revisão · {idxAtual + 1}/{itens.length}</div>
      </nav>

      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div style={{ background: "#1f2937", borderRadius: "99px", height: "4px", marginBottom: "24px" }}>
          <div style={{ background: "#22c55e", width: `${((idxAtual) / itens.length) * 100}%`,
            height: "4px", borderRadius: "99px", transition: "width 0.3s" }} />
        </div>

        <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "1.5rem" }}>
          <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em", marginBottom: "12px" }}>
            REVISÃO — {itemAtual.tipo.toUpperCase()} · {itemAtual.tentativas} tentativas
          </div>
          <p style={{ color: "#e5e7eb", fontSize: "15px", lineHeight: "1.6", marginBottom: "20px" }}>
            {itemAtual.item}
          </p>

          {!mostrarResposta ? (
            <button onClick={() => setMostrarResposta(true)}
              style={{ width: "100%", background: "#22c55e", border: "none", borderRadius: "10px",
                padding: "12px", color: "#000", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
              Ver resposta / praticar
            </button>
          ) : (
            <div>
              <p style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "16px" }}>
                Você conseguiu usar esta frase corretamente?
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={marcarErro}
                  style={{ flex: 1, background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444",
                    borderRadius: "10px", padding: "11px", color: "#ef4444",
                    fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                  ❌ Ainda não
                </button>
                <button onClick={marcarAcerto}
                  style={{ flex: 1, background: "rgba(34,197,94,0.1)", border: "1px solid #22c55e",
                    borderRadius: "10px", padding: "11px", color: "#22c55e",
                    fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                  ✅ Consegui!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **11.2 — Verificar no browser**

```
# Abrir http://localhost:3000/ingles/revisao
```

Verificar: (1) sem itens mostra mensagem de "nenhum item"; (2) após errar exercícios nas lições, os itens aparecem aqui; (3) "Consegui!" agenda próxima revisão em 3 dias; (4) "Ainda não" agenda em 1 hora.

- [ ] **11.3 — Commit**

```bash
git add src/app/ingles/revisao/page.tsx
git commit -m "feat: adiciona fila de revisão do curso English for QA"
```

---

## Tarefa 12 — Mudanças em arquivos existentes

### 12a — `src/app/cursos/page.tsx`

- [ ] **12.1 — Adicionar card "English for QA" à seção "Iniciar"**

Localizar a seção que renderiza o card do Playwright (linha ~194) e adicionar bloco análogo logo após:

```typescript
{/* Iniciar English for QA se não inscrito */}
{!cursosAtivos.find(c => c.id === "ingles") && (
  <div style={{ marginBottom: "28px" }}>
    <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em",
      marginBottom: "10px" }}>
      {cursosAtivos.length > 0 ? "ADICIONAR CURSO" : "COMEÇAR AGORA"}
    </div>
    <div onClick={() => window.location.href = "/inicio/ingles"}
      style={{ background: "#111827", border: "1px solid rgba(34,197,94,0.4)",
        borderRadius: "14px", padding: "16px", cursor: "pointer",
        transition: "border-color 0.2s, box-shadow 0.2s" }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "#22c55e";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 4px rgba(34,197,94,0.12)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,197,94,0.4)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}>
      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px",
          background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.3rem", flexShrink: 0 }}>🗣️</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: "bold", color: "#e5e7eb",
            marginBottom: "2px" }}>English for QA</div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>
            Do zero ao inglês técnico · 4 níveis · ~160 lições
          </div>
        </div>
        <div style={{ background: "#22c55e", color: "#000", fontSize: "11px",
          fontWeight: "bold", padding: "4px 10px", borderRadius: "99px" }}>
          Iniciar
        </div>
      </div>
    </div>
  </div>
)}
```

- [ ] **12.2 — Adicionar suporte a `certificacao_id = "ingles"` no carregamento dos cursos ativos**

No bloco `carregar()`, após o bloco que trata `playwright`, adicionar:

```typescript
if (certs?.find(c => c.certificacao_id === "ingles")) {
  const { data: progData } = await supabase
    .from("ingles_progresso")
    .select("nivel_atual, licoes_concluidas")
    .eq("user_id", user.id).single();

  const cert = certs.find(c => c.certificacao_id === "ingles")!;
  const concluidos = progData?.licoes_concluidas?.length ?? 0;
  ativos.push({
    id: "ingles", nome: "English for QA", emoji: "🗣️", cor: "#22c55e",
    tipo: "curso", rota: "/ingles", rotaInicio: "/inicio/ingles",
    progresso: Math.round((concluidos / 160) * 100),
    posicaoAtual: `Nível ${progData?.nivel_atual ?? "A1"} · ${concluidos} lições`,
  });
}
```

### 12b — `src/app/page.tsx` (landing)

- [ ] **12.3 — Adicionar "English for QA" ao array `certs`**

```typescript
// Adicionar após o objeto do Playwright no array certs:
{
  id: "ingles",
  nome: "English for QA",
  org: "Idiomas",
  nivel: "A1 → B2",
  cor: "#22c55e",
  status: "disponível",
  desc: "Do A1 ao inglês técnico de QA. Lições estilo Duolingo com IA.",
  emoji: "🗣️",
},
```

- [ ] **12.4 — Adicionar card no array `features`**

```typescript
// Adicionar após o card de "Nível adaptativo":
{
  icon: "🗣️",
  titulo: "Inglês para QA",
  desc: "Do zero ao inglês técnico em carreira de QA. Trilha estilo Duolingo com teste de nivelamento, avaliação de pronúncia por IA e vocabulário focado em bug reports, reuniões e entrevistas."
},
```

- [ ] **12.5 — Commit final**

```bash
git add src/app/cursos/page.tsx src/app/page.tsx
git commit -m "feat: integra English for QA à página de cursos e landing"
```

---
