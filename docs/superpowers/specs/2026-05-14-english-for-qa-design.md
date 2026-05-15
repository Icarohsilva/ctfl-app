# English for QA — Design Spec

**Data:** 2026-05-14  
**Status:** Aprovado pelo usuário  
**Abordagem escolhida:** MVP Completo com Web Speech API

---

## Visão geral

Adicionar o curso "English for QA" ao TestPath como terceiro curso no catálogo (ao lado de CTFL v4.0 e Playwright + IA). O curso vai do nível A1 ao B2, com foco em carreira de QA — vocabulário técnico, bug reports, reuniões de sprint, entrevistas internacionais. A experiência é estilo Duolingo: trilha vertical de nodes, exercícios sequenciais, XP, score de pronúncia por IA e fila de revisão adaptativa.

---

## Decisões de design

| Decisão | Escolha |
|---|---|
| Posicionamento | Mais um curso no catálogo `/cursos` |
| Estrutura de lições | Trilha de nodes vertical estilo Duolingo |
| Exercícios | 6 tipos: tradução, múltipla escolha, ordenar palavras, speaking, completar, listening |
| Nivelamento | Teste adaptativo com 10 questões (A1–B2) |
| Gamificação | XP por lição + score de pronúncia + fila de revisão |
| Conteúdo | Híbrido: esqueleto estático em `.ts` + exercícios gerados por Groq |
| Speaking | Web Speech API (browser nativo) + Groq para avaliação de pronúncia |

---

## Arquitetura

### Rotas Next.js (novas)

```
/inicio/ingles                  — onboarding + teste de nivelamento
/ingles                         — trilha principal (nodes por nível)
/ingles/licao/[id]              — player de lição (exercícios sequenciais)
/ingles/revisao                 — fila de revisão (palavras e frases fracas)
/api/ingles/exercicios          — POST: gera 6 exercícios via Groq
/api/ingles/pronuncia           — POST: avalia transcript vs frase esperada
/api/ingles/nivelamento         — POST: próxima questão adaptativa
```

### Arquivos de dados (`src/data/`)

| Arquivo | Conteúdo |
|---|---|
| `ingles-curriculum.ts` | Níveis A1→B2, unidades, metadados dos nodes (id, título, emoji, xp, tipo) |
| `ingles-licoes.ts` | Conteúdo-base de cada lição: tema, frases-exemplo, vocabulário-alvo |
| `ingles-nivelamento.ts` | Banco estático de 40 questões de múltipla escolha para o placement test |

### Tabelas Supabase (novas)

```sql
-- Progresso geral por usuário
ingles_progresso (
  user_id        uuid references auth.users,
  nivel_atual    text,           -- A1 | A2 | B1 | B2
  meta           text,           -- docs | calls | entrevistas
  licoes_concluidas text[],      -- array de licao_ids
  score_pronuncia_medio numeric, -- recalculado via AVG(ingles_scores_pronuncia.score) por user_id
  created_at     timestamptz
)
-- Nota: XP NÃO é armazenado aqui. O XP do curso de inglês é acumulado em
-- usuario_certificacoes.pontos (certificacao_id='ingles') — mesma fonte de
-- verdade dos outros cursos.

-- Fila de revisão de palavras/frases fracas
ingles_revisao (
  id             uuid primary key,
  user_id        uuid,
  item           text,           -- frase ou palavra
  tipo           text,           -- vocabulario | gramatica | pronuncia
  tentativas     int default 0,
  acertos        int default 0,
  proxima_revisao timestamptz
)

-- Histórico de scores de pronúncia
ingles_scores_pronuncia (
  id             uuid primary key,
  user_id        uuid,
  licao_id       text,
  frase          text,
  score          int,            -- 0–100
  transcript     text,           -- o que o usuário disse
  created_at     timestamptz
)
```

**Enrollment** reutiliza `usuario_certificacoes` com `certificacao_id = "ingles"` — zero mudança de schema existente.

---

## Curriculum

### Estrutura: 4 níveis × 8 unidades × ~5 nodes = ~160 lições

**Nível A1** — Sobrevivência técnica
1. Greetings & Job Titles  
2. Numbers, Dates & Times  
3. Basic Bug Reports  
4. Test Cases (simple)  
5. Daily Stand-up Phrases  
6. Reading Error Messages  
7. Tools & Environment  
8. **Checkpoint A1** *(avaliação de unidade)*

**Nível A2** — Comunicação no dia a dia de QA
1. Sprint Vocabulary  
2. Writing Defect Reports  
3. Meeting Expressions  
4. Agile Ceremonies  
5. Test Case Writing  
6. Asking Clarifying Questions  
7. Email & Slack Communication  
8. **Checkpoint A2**

**Nível B1** — Autonomia técnica
1. Technical Interviews (basic)  
2. Code Review Comments  
3. Incident & Postmortem Reports  
4. Stakeholder Communication  
5. Test Strategy Presentations  
6. Giving & Receiving Feedback  
7. Documentation Writing  
8. **Checkpoint B1**

**Nível B2** — Liderança e influência
1. Leading QA Meetings  
2. Writing RFCs & Proposals  
3. Advanced Interview Scenarios  
4. Negotiating with Stakeholders  
5. Mentoring in English  
6. Conference & Community  
7. Complex Technical Writing  
8. **Checkpoint B2**

### Nodes especiais
- **Checkpoint** (🏆) — ao final de cada unidade, avaliação mais rigorosa com 10 exercícios. Score mínimo de 70% (7/10 acertos) para desbloquear a próxima unidade. Se reprovar: node volta ao estado "ativo" e o usuário pode refazer imediatamente — sem penalidade de XP, mas os erros vão para `ingles_revisao`.
- **Conclusão do B2** — após o Checkpoint B2, exibe tela de conclusão do curso com certificado simbólico (badge no perfil) e sugestão de manter prática com `/ingles/revisao`.
- **Speaking desabilitado em A1** — exercícios de fala só aparecem a partir de A2.

---

## Teste de Nivelamento (`/inicio/ingles`)

### Fluxo em 3 steps

**Step 1 — Meta** (30 segundos)  
Pergunta única: "Qual é o seu objetivo com inglês?"
- Ler documentação técnica  
- Participar de calls e reuniões  
- Passar em entrevistas internacionais  

Salvo em `ingles_progresso.meta`. Personaliza o vocabulário priorizado nas lições.

**Step 2 — 10 questões adaptativas**

Algoritmo:
```
estado inicial: { nivel_corrente: "A2", score: 0, historico: [] }

para cada questão:
  se acertou → score += peso[nivel_corrente], nivel_corrente sobe (máx B2)
  se errou   → nivel_corrente desce (mín A1)

pesos: A1=1, A2=2, B1=3, B2=4

resultado por score total:
  < 4   → A1
  4–9   → A2
  10–17 → B1
  ≥ 18  → B2
```

Banco de questões: `ingles-nivelamento.ts` — 40 questões de múltipla escolha cobrindo gramática, vocabulário técnico e compreensão de texto. O estado é mantido no client via `useState` — sem sessão server-side.

**Step 3 — Resultado + CTA**  
Tela celebratória com o nível detectado, resumo do que vai aprender e botão "Começar minha trilha". Cria registro em `usuario_certificacoes` + `ingles_progresso`.

---

## Player de Lições (`/ingles/licao/[id]`)

### Fluxo por lição

1. `POST /api/ingles/exercicios` com `{ licao_id, nivel, meta, tipos_exercicio[] }` → Groq gera 6 exercícios
2. Player exibe um exercício por vez com barra de progresso (1/6 … 6/6)
3. Feedback imediato: acerto = verde + XP; erro = vermelho + explicação + item vai para `ingles_revisao`
4. Ao concluir todos os 6 → tela de celebração + XP acumulado + próximo node desbloqueado

### Tipos de exercício

| Tipo | Descrição |
|---|---|
| **Tradução** | Frase em pt-BR → usuário escreve em inglês; Groq avalia semanticamente (não exige correspondência exata), aceita variações gramaticalmente corretas e equivalentes em significado |
| **Múltipla escolha** | 3 opções, 1 correta; foco em gramática e vocabulário técnico |
| **Ordenar palavras** | Palavras embaralhadas → clicar para montar a frase correta |
| **Speaking** | Frase exibida → usuário fala → Web Speech API transcreve → Groq avalia |
| **Completar** | Fill in the blank com digitação ou seleção de palavra |
| **Listening** | Web Speech API `SpeechSynthesis` (browser nativo, gratuito, `lang='en-US'`) toca frase técnica → usuário digita o que ouviu. Fallback: se `SpeechSynthesis` não disponível, exibe frase em texto com nota "áudio não disponível no seu browser". |

**Regra de distribuição:** máximo 2 exercícios do mesmo tipo por lição; speaking só em A2+.

---

## Speaking com Web Speech API

### Fluxo técnico

```
1. Player detecta suporte: 'SpeechRecognition' in window
2. Se suportado:
   a. Exibe botão 🎙 + frase a repetir
   b. Usuário clica → SpeechRecognition.start(), lang='en-US'
   c. Animação de ondas enquanto ouve
   d. onresult → captura transcript parcial em tempo real
   e. onend → POST /api/ingles/pronuncia { esperado, transcript, nivel }
   f. Exibe score + erros destacados + dica
   g. Salva em ingles_scores_pronuncia

3. Se não suportado (Firefox, Safari):
   - Botão desabilitado com mensagem: "Speaking não disponível no Chrome"
   - Opção: "Pular este exercício" (não penaliza XP)
```

### API `POST /api/ingles/pronuncia`

**Input:** `{ esperado: string, transcript: string, nivel: string }`

**Processamento (Groq):** Compara palavras token por token; detecta erros fonéticos comuns de falantes de pt-BR:
- Substituição de "th" por "d" ou "f"
- Confusão v/b ("very" → "bery")
- Pronúncia de "-ed" final ("walked" → "walkéd")
- Vogais longas vs curtas ("sheet" vs "shit")
- Sílabas tônicas erradas

**Output:** `{ score: number, erros: string[], dica: string }`

**Cálculo do score:** `100 - (erros.length × 15)`, mínimo 10.

---

## Gamificação

| Elemento | Comportamento |
|---|---|
| **XP** | Cada lição concluída dá XP fixo por tipo de node: lição normal = 30 pts, checkpoint = 100 pts. Acumulado em `usuario_certificacoes.pontos` (certificacao_id='ingles') — mesma fonte de verdade dos outros cursos. |
| **Score de pronúncia** | Score 0–100 por exercício de speaking. Média histórica exibida no perfil. Evolução visível ao longo do tempo. |
| **Fila de revisão** | Exercícios errados → `ingles_revisao`. Rota `/ingles/revisao` exibe sessão de reforço a qualquer momento. |

Sem corações/vidas. Sem streak separado (o streak global do TestPath já cobre).

---

## Mudanças em arquivos existentes

### `src/app/cursos/page.tsx`
- Adicionar card "English for QA" na seção "Iniciar" se `certificacao_id = "ingles"` não existir em `usuario_certificacoes`
- Cor: `#22c55e`, emoji: 🗣️
- Texto: "Do zero ao inglês técnico · 4 níveis · ~160 lições"

### `src/app/page.tsx` (landing)
- Array `certs`: adicionar `{ id: "ingles", nome: "English for QA", cor: "#22c55e", emoji: "🗣️", status: "disponível", desc: "Do A1 ao B2 com foco em carreira de QA." }`
- Array `features`: adicionar card de inglês com Duolingo como referência
- Label "CERTIFICAÇÕES" → "CURSOS" para acomodar o inglês sem estranheza

---

## Fora do escopo (MVP)

- Leaderboard / ranking entre usuários
- Corações / sistema de vidas
- Streak separado para inglês
- Speaking via upload de áudio (MediaRecorder + Whisper) — fase 2 se Web Speech API mostrar limitações
- Conteúdo em vídeo nas lições de inglês
- Modo offline para lições de inglês
