# Curso Playwright + IA — Design Spec

**Data:** 2026-05-07  
**Público-alvo:** Testadores manuais sem experiência em programação que querem aprender automação com Playwright e IA.  
**Goal:** Expandir o TestPath de plataforma de certificações para plataforma multi-curso, lançando o curso Playwright como primeiro curso técnico.

---

## 1. Visão Geral

O TestPath passa a ter dois tipos de conteúdo:
- **Certificações** (CTFL, CTFL-AT, CTAL-TA…) — trilha para exames ISTQB
- **Cursos técnicos** (Playwright, futuros) — habilidades práticas sem exame formal

Um novo **hub de cursos** (`/cursos`) serve como ponto de entrada pós-login, substituindo o redirect direto para `/dashboard`. O `/dashboard` CTFL não muda — continua existindo como está, acessível pelo hub.

---

## 2. Arquitetura de Rotas

### Rotas existentes — sem alteração
```
/dashboard                          — Dashboard CTFL (inalterado)
/capitulo/[capitulo]                — Capítulo CTFL
/capitulo/[capitulo]/topico/[id]   — Tópico CTFL
/simulado-final                     — Simulado final CTFL
/inicio/ctfl                        — Onboarding CTFL
```

### Rotas novas
```
/cursos                                           — Hub multi-curso (pós-login)
/inicio/playwright                                — Onboarding Playwright (ritmo, nível)
/playwright                                       — Dashboard do curso Playwright
/playwright/modulo/[modulo]                       — Visão do módulo (lista de labs)
/playwright/modulo/[modulo]/lab/[lab]             — Lab individual (4 passos)
/playwright/projeto-final                         — Projeto final + avaliação por IA
/api/playwright/avaliar                           — API route: avaliação Groq do projeto final
```

### Mudança de redirecionamento
O redirect pós-login (atualmente hardcoded para `/dashboard`) passa a verificar:
- Se usuário tem `usuario_certificacoes` com `certificacao_id = "ctfl"` E `certificacao_id = "playwright"` → `/cursos`
- Se só tem CTFL → `/dashboard` (comportamento atual preservado)
- Se não tem nenhum → `/cursos` (nova tela de descoberta)

O componente `src/app/dashboard/page.tsx` preserva o redirect para `/inicio/ctfl` quando o usuário não tem a certificação CTFL — isso não muda.

---

## 3. Hub de Cursos (`/cursos`)

### Layout
- **Nav** idêntica ao dashboard CTFL (logo, streak, XP, avatar, sair)
- **Saudação** com nome do usuário e frase motivadora
- **Seção "Meus Cursos"** — cards de cursos em que o usuário está inscrito, ordenados por último acesso
- **Seção "Descobrir"** — cards de cursos ainda não iniciados (CTFL-AT, CTAL-TA, etc.) com badge "Em breve"

### Card de curso
Cada card exibe:
- Ícone + nome do curso
- Barra de progresso (% de labs/tópicos concluídos)
- Indicador de posição atual (ex: "Módulo 2 · Lab 3")
- Clique navega para o dashboard do curso (`/dashboard` para CTFL, `/playwright` para Playwright)

### Responsividade
- Desktop: cards lado a lado (grid 2 colunas)
- Mobile: cards empilhados (1 coluna)

---

## 4. Estrutura do Curso Playwright

### Módulos e Labs

| Módulo | Título | Labs | Foco |
|--------|--------|------|------|
| 0 | Base para Testers Manuais | 4 | Node.js, terminal, JS mínimo, VS Code |
| 1 | Primeiros Passos no Playwright | 3 | Instalação, primeiro teste, HTML report |
| 2 | Locators e Elementos | 3 | getByRole/Text/TestId, CSS/XPath, boas práticas |
| 3 | Ações, Formulários e Esperas | 3 | Cliques, formulários, auto-wait, uploads |
| 4 | Assertions e Validações | 2 | expect(), soft assertions, screenshot testing |
| 5 | Organização Profissional | 3 | Page Object Model, fixtures, hooks, config |
| 6 | Playwright + IA (Agentes) | 3 + projeto | codegen, @playwright/mcp, workflow IA→teste |

**Total:** 21 labs + 1 projeto final avaliado por IA

### Dashboard do curso (`/playwright`)
Espelha visualmente o dashboard CTFL mas adaptado:
- XP, streak, módulos concluídos
- Card "Continuar" com módulo e lab atual
- Lista de módulos com progresso por barras
- Badge "Certificado de Conclusão" ao completar 100%

---

## 5. Formato dos Labs (Lab Passo a Passo)

Cada lab tem exatamente 4 passos sequenciais:

### Passo 1 — 📖 Conceito
- Texto narrativo (150–300 palavras) explicando o conceito
- Linguagem acessível para quem não programa
- Analogias com o dia a dia do testador manual quando possível
- Fonte: playwright.dev/docs adaptado ao pt-BR

### Passo 2 — 💻 Código
- Bloco de código completo, pronto para copiar
- Comentários em português explicando cada linha importante
- Badge de linguagem (TypeScript)
- Botão "Copiar código"

### Passo 3 — 🏃 Execute
- Instrução exata do comando a rodar (ex: `npx playwright test`)
- O que o usuário deve ver quando funcionar (output esperado)
- Solução para o erro mais comum daquele lab

### Passo 4 — 💡 Reflexão
- 1 pergunta de múltipla escolha simples (3 opções)
- Confirma entendimento conceitual, não memorização
- Ao responder (corretamente ou não, com explicação) → lab marcado como concluído → XP creditado

### Progressão visual
- Barra de 4 segmentos no topo mostrando o passo atual
- Botão "Próximo passo" avança entre passos
- Botão "Lab anterior / Próximo lab" na tela do Passo 4 concluído

---

## 6. Dashboard do Curso Playwright (`/playwright`)

### Dados carregados
```typescript
// De usuario_certificacoes WHERE certificacao_id = "playwright"
{ semana_atual, pontos, streak, maior_streak, ritmo, status }

// De progresso_topicos WHERE certificacao_id = "playwright"
{ capitulo (= módulo), topico_id (= lab id), concluido }
```

### Seções
1. Stats: XP total, streak, módulos concluídos (N/7)
2. Card "Continuar" — usa `semana_atual` (= módulo atual) para navegar ao lab correto
3. Lista de módulos com barra de progresso por módulo
4. Projeto final: bloqueado até completar 80% dos labs; desbloqueado exibe CTA

---

## 7. Projeto Final e Avaliação por IA

### Dinâmica
- Usuário recebe o contexto: "Automatize os fluxos principais de `demo.playwright.dev`"
- Interface mostra os fluxos sugeridos: login, todo list (criar/completar/deletar), filtros
- Usuário cola o código dos testes em uma textarea
- Clica em "Enviar para avaliação"

### Avaliação via Groq (`llama-3.3-70b-versatile`)
O prompt avalia o código submetido em 5 dimensões:

1. **Cobertura** (0–20 pts): quantos dos fluxos sugeridos foram testados
2. **Qualidade dos locators** (0–20 pts): uso de `getByRole`/`getByText` vs seletores frágeis
3. **Assertions** (0–20 pts): assertions presentes, específicas, não triviais
4. **Organização** (0–20 pts): uso de Page Objects, funções auxiliares, nomes descritivos
5. **Boas práticas** (0–20 pts): sem hardcoded waits, sem `page.waitForTimeout`, tratamento de falhas

**Score total:** 0–100 pts. **Aprovado:** ≥ 70 pts.

### Retorno ao usuário
```json
{
  "score": 82,
  "aprovado": true,
  "dimensoes": {
    "cobertura": 18,
    "locators": 16,
    "assertions": 14,
    "organizacao": 18,
    "boas_praticas": 16
  },
  "pontos_fortes": ["Uso excelente de getByRole", "Assertions bem específicas"],
  "melhorias": ["Adicionar teste de filtro 'Active'", "Extrair seletores para Page Object"]
}
```

### Banco de dados — `playwright_projetos_finais`
```sql
CREATE TABLE playwright_projetos_finais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  codigo_tests text NOT NULL,
  score integer NOT NULL,
  aprovado boolean NOT NULL,
  feedback_ia jsonb NOT NULL,
  tentativa integer DEFAULT 1,
  criado_em timestamptz DEFAULT now()
);
```
- RLS: usuário vê e insere apenas seus próprios registros
- Múltiplas tentativas permitidas (tentativa incremental)

---

## 8. Módulo 6 — Playwright + IA em detalhe

Este módulo é o diferencial do curso.

### Lab 6.1 — `playwright codegen`
- Conceito: gravar ações no navegador e gerar código automaticamente
- Código: `npx playwright codegen demo.playwright.dev`
- Execute: usuário grava um fluxo e vê o código gerado
- Reflexão: "O codegen gera código de produção ou ponto de partida?"

### Lab 6.2 — `@playwright/mcp` (MCP Server oficial)
- Conceito: o que é MCP (Model Context Protocol) e como o Playwright lançou um servidor oficial que deixa agentes de IA controlar o navegador
- Código: instalação (`npm init @playwright/mcp@latest`) e configuração no Claude Desktop / VS Code Copilot
- Execute: usuário configura o MCP e pede ao Claude "acesse demo.playwright.dev e crie um teste de login"
- Reflexão: "O MCP substitui o Playwright ou o usa por baixo?"

### Lab 6.3 — Workflow IA → Teste → Refinamento
- Conceito: o loop completo — descrever em português, IA gera, humano revisa, Playwright valida
- Código: prompt template para pedir testes ao Claude via MCP; exemplo de output refinado
- Execute: usuário completa o ciclo completo uma vez
- Reflexão: "Qual parte do ciclo ainda precisa mais da expertise humana?"

### Projeto Final
Descrição detalhada em Seção 7 acima.

---

## 9. Banco de Dados — Resumo

### Tabelas reutilizadas (sem mudança de schema)

**`usuario_certificacoes`** — inclui linha com `certificacao_id = "playwright"`:
- `semana_atual` → módulo atual (0–6)
- `pontos`, `streak`, `maior_streak`, `ritmo`, `status`, `ultimo_estudo` → igual ao CTFL

**`progresso_topicos`** — inclui linhas com `certificacao_id = "playwright"`:
- `capitulo` → número do módulo (0–6)
- `topico_id` → id do lab (ex: `"node-instalacao"`, `"primeiro-teste"`)
- `concluido` → true quando passo 4 (reflexão) for respondido

### Tabela nova
`playwright_projetos_finais` — detalhada na Seção 7.

---

## 10. Arquivos de Conteúdo Estático

### `src/data/playwright-modulos.ts`
```typescript
export type LabMeta = {
  id: string;
  numero: number;
  titulo: string;
  subtitulo: string;
  xp: number;
};

export type ModuloMeta = {
  numero: number;
  titulo: string;
  descricao: string;
  cor: string;
  emoji: string;
  labs: LabMeta[];
};

export const mapaModulos: Record<number, ModuloMeta> = {
  0: { numero: 0, titulo: "Base para Testers Manuais", ... },
  // ... módulos 1–6
};
```

### `src/data/playwright-labs.ts`
```typescript
export type LabConteudo = {
  modulo: number;
  labId: string;
  conceito: string;           // texto pt-BR, ~250 palavras
  codigo: string;             // TypeScript completo com comentários
  instrucaoExecucao: string;  // comando + output esperado + erro comum
  reflexao: {
    pergunta: string;
    opcoes: string[];          // 3 opções
    correta: number;           // índice 0-2
    explicacao: string;        // feedback após responder
  };
};

export const conteudoLabs: Record<string, LabConteudo> = { ... };
```

---

## 11. Onboarding Playwright (`/inicio/playwright`)

Mais simples que o CTFL — sem data-meta ou ritmo de exame. O campo `ritmo` é gravado mas aqui só afeta a frase motivadora exibida no dashboard (não calcula prazo):

1. Pergunta o nível de experiência com código: "Nunca programei" / "Já sei o básico" / "Programo regularmente"
2. Pergunta disponibilidade: "30 min/dia" (`ritmo = "leve"`) / "1 hora/dia" (`ritmo = "moderado"`)
3. Cria linha em `usuario_certificacoes` com `certificacao_id = "playwright"`, `semana_atual = 0`, `status = "em_andamento"`, `data_meta = null`
4. Redireciona para `/playwright`

O componente `OnboardingCertificacao` existente **não** é reutilizado aqui (ele é específico para certificações com prazo). Um novo componente `OnboardingPlaywright` é criado em `src/app/inicio/playwright/page.tsx`.

---

## 12. Componentes Novos

| Componente | Responsabilidade |
|------------|-----------------|
| `src/app/cursos/page.tsx` | Hub multi-curso |
| `src/app/inicio/playwright/page.tsx` | Onboarding Playwright |
| `src/app/playwright/page.tsx` | Dashboard do curso |
| `src/app/playwright/modulo/[modulo]/page.tsx` | Visão do módulo |
| `src/app/playwright/modulo/[modulo]/lab/[lab]/page.tsx` | Lab individual |
| `src/app/playwright/projeto-final/page.tsx` | Projeto final + avaliação IA |
| `src/app/api/playwright/avaliar/route.ts` | API avaliação Groq |
| `src/components/LabPassos.tsx` | Componente dos 4 passos (reutilizável) |
| `src/data/playwright-modulos.ts` | Metadata dos módulos |
| `src/data/playwright-labs.ts` | Conteúdo completo dos 21 labs |

---

## 13. Escopo de Implementação (Fases)

Este design cobre o sistema completo. A implementação será em duas fases:

### Fase 1 — Infraestrutura + Módulos 0 e 1 (este ciclo)
- Hub `/cursos`
- Onboarding Playwright
- Dashboard `/playwright`
- Componente `LabPassos`
- Rotas de módulo e lab
- Conteúdo dos Módulos 0 (4 labs) e 1 (3 labs) = 7 labs com conteúdo completo
- Tabela `playwright_projetos_finais` (criada, projeto final como "em breve")

### Fase 2 — Conteúdo restante + Projeto Final
- Conteúdo dos Módulos 2–6 (14 labs + 3 labs IA)
- Projeto final completo com avaliação Groq
- Badge/certificado de conclusão

---

## 14. O que não muda

- Todo o código e fluxo do CTFL: `/dashboard`, `/capitulo/[n]`, `/simulado-final`
- Tabelas `banco_questoes`, `fila_revisao`, RPCs existentes
- `use-certificacao` hook (já suporta qualquer `certId` — reutilizado para Playwright)
- `OnboardingCertificacao` component (mantido para CTFL; Playwright usa `OnboardingPlaywright` novo)
- Stack técnico: Next.js App Router, Supabase, Groq, Tailwind v4
