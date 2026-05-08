# Curso Playwright + IA — Implementation Plan (Fase 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar o curso Playwright ao TestPath — hub multi-curso `/cursos`, onboarding, dashboard do curso, componente de lab passo a passo, e conteúdo completo dos Módulos 0 e 1 (7 labs).

**Architecture:** Os dados do curso ficam em arquivos estáticos TypeScript (`playwright-modulos.ts` e `playwright-labs.ts`). As rotas seguem o padrão Next.js App Router já estabelecido no projeto. O progresso é salvo no Supabase reutilizando as tabelas `usuario_certificacoes` e `progresso_topicos` com `certificacao_id = "playwright"`. Uma nova tabela `playwright_projetos_finais` é criada agora, mas o projeto final fica como stub (Fase 2).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Supabase (anon key client-side), Tailwind v4, inline styles dark theme (#0b0f1a bg, #d4af37 gold, #06b6d4 cyan Playwright). Sem test runner — verificação via `npm run build` e dev server manual.

---

## Mapa de Arquivos

| Ação | Arquivo | Responsabilidade |
|------|---------|-----------------|
| Criar | `src/data/playwright-modulos.ts` | Metadata dos 7 módulos e labs (como mapa-capitulos.ts) |
| Criar | `src/data/playwright-labs.ts` | Conteúdo dos 7 labs (Módulos 0 e 1) com os 4 passos |
| Criar | `src/components/LabPassos.tsx` | Componente reutilizável dos 4 passos de cada lab |
| Criar | `src/app/cursos/page.tsx` | Hub multi-curso pós-login |
| Criar | `src/app/inicio/playwright/page.tsx` | Onboarding do curso Playwright |
| Criar | `src/app/playwright/page.tsx` | Dashboard do curso Playwright |
| Criar | `src/app/playwright/modulo/[modulo]/page.tsx` | Visão do módulo (lista de labs) |
| Criar | `src/app/playwright/modulo/[modulo]/lab/[lab]/page.tsx` | Página do lab individual |
| Criar | `src/app/playwright/projeto-final/page.tsx` | Stub do projeto final (Fase 2) |
| Criar | `src/app/api/playwright/avaliar/route.ts` | Stub da API de avaliação Groq (Fase 2) |
| Modificar | `src/app/login/page.tsx:32` | Trocar redirect `/dashboard` → `/cursos` |

---

## Task 1: Data — playwright-modulos.ts

**Files:**
- Create: `src/data/playwright-modulos.ts`

- [ ] **Step 1: Criar o arquivo com os tipos e o mapa completo dos 7 módulos**

```typescript
// src/data/playwright-modulos.ts

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
  0: {
    numero: 0,
    titulo: "Base para Testers Manuais",
    descricao: "Fundamentos de terminal, Node.js e JavaScript para quem nunca programou",
    cor: "#f97316",
    emoji: "🧱",
    labs: [
      { id: "o-que-e-node", numero: 1, titulo: "O que é Node.js", subtitulo: "Por que testadores precisam dele", xp: 30 },
      { id: "terminal-sem-medo", numero: 2, titulo: "Terminal sem medo", subtitulo: "cd, npm, npx — comandos que você vai usar todo dia", xp: 30 },
      { id: "js-minimo", numero: 3, titulo: "JavaScript mínimo", subtitulo: "Variáveis, funções e async/await para entender testes", xp: 40 },
      { id: "vscode-setup", numero: 4, titulo: "VS Code para Playwright", subtitulo: "Extensões e configurações essenciais", xp: 20 },
    ],
  },
  1: {
    numero: 1,
    titulo: "Primeiros Passos no Playwright",
    descricao: "Instale, rode seu primeiro teste e leia os resultados",
    cor: "#22c55e",
    emoji: "🚀",
    labs: [
      { id: "instalacao", numero: 1, titulo: "Instalação e configuração", subtitulo: "npm init playwright@latest — do zero ao projeto pronto", xp: 40 },
      { id: "primeiro-teste", numero: 2, titulo: "Seu primeiro teste", subtitulo: "Anatomia de um teste: test(), page, expect()", xp: 50 },
      { id: "html-report", numero: 3, titulo: "Lendo o HTML Report", subtitulo: "Entenda o que passou, o que falhou e por quê", xp: 40 },
    ],
  },
  2: {
    numero: 2,
    titulo: "Locators e Elementos",
    descricao: "Encontre qualquer elemento da página de forma robusta",
    cor: "#3b82f6",
    emoji: "🔍",
    labs: [
      { id: "locators-modernos", numero: 1, titulo: "Locators modernos", subtitulo: "getByRole, getByText, getByTestId — a forma certa", xp: 50 },
      { id: "css-xpath", numero: 2, titulo: "CSS e XPath", subtitulo: "Quando e como usar seletores tradicionais", xp: 40 },
      { id: "boas-praticas-locators", numero: 3, titulo: "Boas práticas", subtitulo: "O que evitar para testes que não quebram à toa", xp: 40 },
    ],
  },
  3: {
    numero: 3,
    titulo: "Ações, Formulários e Esperas",
    descricao: "Interaja com a página como um usuário real",
    cor: "#f59e0b",
    emoji: "🖱️",
    labs: [
      { id: "acoes-basicas", numero: 1, titulo: "Cliques e formulários", subtitulo: "click, fill, press, select — as ações mais comuns", xp: 50 },
      { id: "auto-wait", numero: 2, titulo: "Auto-wait do Playwright", subtitulo: "Adeus sleep() — como o Playwright espera automaticamente", xp: 50 },
      { id: "uploads-downloads", numero: 3, titulo: "Uploads, downloads e diálogos", subtitulo: "Casos especiais que todo QA encontra", xp: 40 },
    ],
  },
  4: {
    numero: 4,
    titulo: "Assertions e Validações",
    descricao: "Confirme que a aplicação está se comportando como esperado",
    cor: "#8b5cf6",
    emoji: "✅",
    labs: [
      { id: "assertions-basicas", numero: 1, titulo: "Assertions essenciais", subtitulo: "toBeVisible, toHaveText, toHaveValue e muito mais", xp: 50 },
      { id: "soft-assertions", numero: 2, titulo: "Soft assertions e screenshots", subtitulo: "Valide múltiplas coisas sem parar no primeiro erro", xp: 50 },
    ],
  },
  5: {
    numero: 5,
    titulo: "Organização Profissional",
    descricao: "Estruture seus testes como um profissional de QA",
    cor: "#06b6d4",
    emoji: "🏗️",
    labs: [
      { id: "page-object-model", numero: 1, titulo: "Page Object Model", subtitulo: "Separe seletores do código de teste — mantenibilidade real", xp: 60 },
      { id: "fixtures-hooks", numero: 2, titulo: "Fixtures e hooks", subtitulo: "beforeEach, afterAll e fixtures customizados", xp: 50 },
      { id: "config-avancada", numero: 3, titulo: "Configuração e paralelismo", subtitulo: "playwright.config.ts — browsers, envs, workers", xp: 50 },
    ],
  },
  6: {
    numero: 6,
    titulo: "Playwright + IA (Agentes)",
    descricao: "Geração e revisão de testes com IA — o futuro do QA",
    cor: "#d4af37",
    emoji: "🤖",
    labs: [
      { id: "codegen", numero: 1, titulo: "playwright codegen", subtitulo: "Grave ações e gere código automaticamente", xp: 60 },
      { id: "playwright-mcp", numero: 2, titulo: "@playwright/mcp", subtitulo: "Conecte Claude ao navegador com o MCP oficial", xp: 80 },
      { id: "workflow-ia", numero: 3, titulo: "Workflow IA → Teste → Refinamento", subtitulo: "Descreva em português, a IA cria, você revisa", xp: 70 },
    ],
  },
};

export default mapaModulos;
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npm run build
```
Esperado: sem erros de tipo. Se aparecer erro, verifique se todos os campos obrigatórios do tipo estão preenchidos.

- [ ] **Step 3: Commit**

```bash
git add src/data/playwright-modulos.ts
git commit -m "feat: dados dos 7 módulos do curso Playwright"
```

---

## Task 2: Data — playwright-labs.ts (Módulo 0, 4 labs)

**Files:**
- Create: `src/data/playwright-labs.ts`

- [ ] **Step 1: Criar o arquivo com os tipos e o conteúdo do Módulo 0**

```typescript
// src/data/playwright-labs.ts

export type Reflexao = {
  pergunta: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
};

export type LabConteudo = {
  moduloId: number;
  labId: string;
  conceito: string;
  codigo: string;
  instrucaoExecucao: string;
  reflexao: Reflexao;
};

export const conteudoLabs: Record<string, LabConteudo> = {

  "o-que-e-node": {
    moduloId: 0,
    labId: "o-que-e-node",
    conceito: `Node.js é um ambiente de execução JavaScript que roda no seu computador — não no navegador. Pensa assim: o Chrome executa JavaScript para animar sites. O Node executa JavaScript para rodar ferramentas no seu PC.

Por que você precisa dele? O Playwright é escrito em JavaScript/TypeScript e precisa do Node para funcionar. É ele que baixa os navegadores de teste, roda seus scripts e gera os relatórios.

A boa notícia: você não vai programar em Node diretamente. Vai usá-lo como uma ferramenta de suporte — como um testador manual usa o navegador sem programar o Chrome.

Junto com o Node vem o npm (Node Package Manager), o gerenciador de pacotes. É com ele que você instala o Playwright com um único comando.

Antes de continuar: verifique se o Node 18 ou superior está instalado no seu computador. Se não tiver, acesse nodejs.org e baixe a versão LTS.`,
    codigo: `// Não há código para escrever neste lab.
// Execute os comandos abaixo no terminal para verificar a instalação:

// Verificar versão do Node:
// node --version

// Verificar versão do npm:
// npm --version

// Se precisar instalar:
// 1. Acesse https://nodejs.org
// 2. Baixe a versão LTS (Long Term Support)
// 3. Execute o instalador
// 4. Feche e abra o terminal novamente`,
    instrucaoExecucao: `Abra o terminal (PowerShell no Windows, Terminal no Mac/Linux) e execute:

  node --version
  npm --version

Saída esperada:
  v20.11.0     ← qualquer versão 18 ou superior
  10.2.4       ← versão do npm (qualquer versão recente)

ERRO COMUM: "'node' não é reconhecido como comando"
→ Causa: Node não está instalado ou não está no PATH do sistema.
→ Solução: baixe em nodejs.org → instale → feche e abra o terminal novamente.`,
    reflexao: {
      pergunta: "Para que serve o Node.js no contexto do Playwright?",
      opcoes: [
        "É o navegador que o Playwright controla durante os testes",
        "É o ambiente de execução que roda o código do Playwright no seu computador",
        "É um banco de dados onde os resultados dos testes são salvos",
      ],
      correta: 1,
      explicacao: "Correto! O Node.js é o ambiente de execução — ele roda o código JavaScript do Playwright no seu computador. O Playwright usa o Node para instalar e controlar os navegadores (Chrome, Firefox, Safari), mas o Node em si não é o navegador.",
    },
  },

  "terminal-sem-medo": {
    moduloId: 0,
    labId: "terminal-sem-medo",
    conceito: `O terminal é uma janela onde você digita comandos de texto para o computador. Parece intimidador no começo, mas você vai usar apenas 5-6 comandos no dia a dia do Playwright.

No Windows, use o PowerShell (já vem instalado) ou o Terminal do Windows. No Mac/Linux, use o Terminal.

Os comandos essenciais que você precisa saber:

• cd pasta — entra em uma pasta (Change Directory)
• cd .. — volta uma pasta
• ls (Mac/Linux) ou dir (Windows) — lista arquivos na pasta atual
• mkdir nome — cria uma pasta
• npm install — instala dependências
• npx playwright test — roda os testes

Uma dica: o terminal sempre está "dentro" de uma pasta. Quando você abre o terminal, geralmente está na pasta do seu usuário. Para trabalhar com um projeto, primeiro navegue até a pasta dele com cd.`,
    codigo: `// Exemplos de comandos — execute um por vez no terminal:

// Navegar para a pasta Documents:
// cd Documents

// Criar uma pasta para seus projetos:
// mkdir meus-testes-playwright

// Entrar na pasta criada:
// cd meus-testes-playwright

// Ver o que há nessa pasta (vazia por enquanto):
// ls          ← Mac/Linux
// dir         ← Windows

// Voltar uma pasta:
// cd ..

// Ver em qual pasta você está agora:
// pwd         ← Mac/Linux
// cd          ← Windows (sem argumentos mostra o diretório atual)`,
    instrucaoExecucao: `Execute os comandos abaixo em sequência no terminal:

  mkdir meus-testes-playwright
  cd meus-testes-playwright
  ls     (Mac/Linux) ou dir (Windows)

Saída esperada do ls/dir: pasta vazia (sem arquivos listados).

DICA: Use a tecla Tab para autocompletar nomes de pastas.
Por exemplo: cd Doc[Tab] → completa para cd Documents

ERRO COMUM: "A pasta não existe" ao usar cd
→ Verifique se digitou o nome corretamente (maiúsculas importam no Mac/Linux).`,
    reflexao: {
      pergunta: "O que o comando `cd meus-testes` faz no terminal?",
      opcoes: [
        "Cria uma pasta chamada meus-testes",
        "Entra na pasta meus-testes (muda o diretório atual)",
        "Deleta a pasta meus-testes",
      ],
      correta: 1,
      explicacao: "Correto! cd significa Change Directory — muda o diretório (pasta) atual. Para criar uma pasta, usamos mkdir. Para deletar, usamos rm -rf (Mac/Linux) ou rmdir (Windows).",
    },
  },

  "js-minimo": {
    moduloId: 0,
    labId: "js-minimo",
    conceito: `Você não precisa virar desenvolvedor para usar o Playwright. Mas entender 4 conceitos de JavaScript vai tornar tudo muito mais claro:

1. Variáveis: guardam valores. const nome = "João" guarda o texto João.

2. Funções: blocos de código que fazem algo. O Playwright usa muitas funções.

3. async/await: o Playwright controla um navegador — isso leva tempo. O await faz o código esperar a ação terminar antes de continuar. Sem ele, o teste tentaria clicar num botão que ainda não carregou.

4. Arrow functions: uma forma curta de escrever funções. test("meu teste", async () => { ... }) é um exemplo completo de um teste Playwright — "meu teste" é o nome, e tudo dentro de { } é o que ele faz.

Não precisa memorizar a sintaxe. Com o tempo você vai reconhecer esses padrões automaticamente.`,
    codigo: `// 1. Variáveis — guardam valores
const url = "https://demo.playwright.dev";
const titulo = "Playwright Demo";
let contador = 0;

// 2. Função simples
function somar(a, b) {
  return a + b;
}

// 3. async/await — espera ações que levam tempo
// SEM await (ERRADO no Playwright):
// page.click("button");      ← não espera o clique terminar
// page.screenshot();         ← pode capturar antes do clique

// COM await (CORRETO):
// await page.click("button");      ← espera o clique
// await page.screenshot();         ← captura depois

// 4. Arrow function — como você vai ver em todo teste Playwright:
// test("descrição do teste", async ({ page }) => {
//   await page.goto("https://exemplo.com");
//   await page.click("button");
// });
//
// Leitura: "teste chamado X, que é uma função assíncrona
// que recebe {page} e executa os comandos dentro das chaves"`,
    instrucaoExecucao: `Crie um arquivo chamado teste.js em qualquer pasta e cole:

  const resultado = 2 + 2;
  console.log("Resultado:", resultado);
  console.log("URL seria:", "https://demo.playwright.dev");

Execute no terminal:
  node teste.js

Saída esperada:
  Resultado: 4
  URL seria: https://demo.playwright.dev

Isso confirma que o Node está funcionando e executando JavaScript.

DICA: Delete o teste.js depois — era só para experimentar.`,
    reflexao: {
      pergunta: "Por que usamos `await` antes de comandos do Playwright como `await page.click()`?",
      opcoes: [
        "Para deixar o código mais legível — não tem efeito técnico",
        "Para esperar a ação terminar antes de executar o próximo comando",
        "Para evitar erros de sintaxe no TypeScript",
      ],
      correta: 1,
      explicacao: "Correto! O await faz o código pausar até a ação terminar. Como o Playwright controla um navegador (que é lento), sem await o próximo comando rodaria antes da ação anterior terminar — causando falhas intermitentes e difíceis de debugar.",
    },
  },

  "vscode-setup": {
    moduloId: 0,
    labId: "vscode-setup",
    conceito: `O VS Code (Visual Studio Code) é o editor de código mais usado por quem trabalha com Playwright. Ele é gratuito, leve e tem extensões que tornam o trabalho muito mais fácil.

Se ainda não tiver instalado, baixe em code.visualstudio.com.

As extensões essenciais para Playwright são:

1. Playwright Test for VSCode (publicador: Microsoft) — a extensão oficial. Mostra os testes numa aba lateral, permite rodar e debugar testes com um clique, e destaca erros diretamente no código.

2. ESLint — aponta erros de JavaScript/TypeScript enquanto você digita, sem precisar rodar nada.

3. Prettier — formata o código automaticamente ao salvar, mantendo consistência.

Com a extensão do Playwright instalada, você verá um ícone de beaker (🧪) na barra lateral do VS Code. Clique nele para gerenciar e rodar seus testes visualmente.`,
    codigo: `// Não há código para escrever. Siga as instruções de instalação.

// Após instalar a extensão Playwright Test for VSCode:
// 1. Abra a pasta do seu projeto Playwright no VS Code
//    (File → Open Folder → selecione a pasta)
//
// 2. Clique no ícone 🧪 na barra lateral esquerda
//
// 3. Seus testes aparecerão em uma lista
//
// 4. Clique no botão ▶ ao lado de um teste para rodá-lo
//    sem precisar abrir o terminal
//
// Atalhos úteis:
// Ctrl+\` (crase)  — abre o terminal integrado
// Ctrl+Shift+P    — abre o painel de comandos
// Ctrl+P          — busca de arquivos`,
    instrucaoExecucao: `1. Abra o VS Code
2. Vá em Extensions (Ctrl+Shift+X)
3. Busque por "Playwright Test for VSCode" (publicador: Microsoft)
4. Clique em Install
5. Busque "ESLint" e instale
6. Busque "Prettier" e instale

Verificação: após instalar a extensão do Playwright, você verá o
ícone 🧪 (Testing) na barra lateral esquerda do VS Code.

DICA: Configure o Prettier para formatar ao salvar:
→ Ctrl+Shift+P → "Open User Settings (JSON)"
→ Adicione: "editor.formatOnSave": true`,
    reflexao: {
      pergunta: "O que a extensão 'Playwright Test for VSCode' permite fazer que o terminal não permite?",
      opcoes: [
        "Rodar testes mais rápido, pois usa menos memória que o terminal",
        "Ver, rodar e debugar testes com interface visual sem digitar comandos",
        "Criar novos testes automaticamente sem escrever código",
      ],
      correta: 1,
      explicacao: "Correto! A extensão oferece uma interface visual: lista todos os testes, mostra quais passaram ou falharam com ícones coloridos, permite rodar um teste específico com um clique, e tem modo debug que para na linha exata do erro.",
    },
  },
};
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```
Esperado: sem erros de TypeScript.

- [ ] **Step 3: Commit**

```bash
git add src/data/playwright-labs.ts
git commit -m "feat: conteúdo dos labs do Módulo 0 (base para testers manuais)"
```

---

## Task 3: Data — playwright-labs.ts (Módulo 1, 3 labs)

**Files:**
- Modify: `src/data/playwright-labs.ts` (adicionar 3 entradas ao objeto `conteudoLabs`)

- [ ] **Step 1: Adicionar os 3 labs do Módulo 1 ao objeto `conteudoLabs` em `src/data/playwright-labs.ts`**

Localizar a linha `};` final do arquivo e inserir antes dela (dentro do objeto `conteudoLabs`):

```typescript
  "instalacao": {
    moduloId: 1,
    labId: "instalacao",
    conceito: `Agora que você tem o Node.js instalado, vamos criar seu primeiro projeto Playwright com um único comando.

O comando npm init playwright@latest faz tudo automaticamente:
• Cria o arquivo playwright.config.ts (configurações do Playwright)
• Cria a pasta tests/ com um exemplo de teste
• Baixa os navegadores Chrome, Firefox e Safari para rodar os testes localmente
• Adiciona o Playwright como dependência no package.json

Durante a instalação, ele faz algumas perguntas. Para este lab, responda:
• Linguagem: TypeScript (pressione Enter — já é o padrão)
• Pasta de testes: tests (pressione Enter)
• GitHub Actions: N (não precisamos agora)
• Instalar navegadores: y (sim — necessário)

A instalação leva alguns minutos porque baixa os navegadores (~250MB).`,
    codigo: `// Abra o terminal e navegue até uma pasta vazia para o projeto:
// mkdir meu-projeto-playwright
// cd meu-projeto-playwright

// Execute o comando de instalação:
// npm init playwright@latest

// Estrutura criada após a instalação:
// meu-projeto-playwright/
// ├── playwright.config.ts    ← configurações (browsers, timeouts, etc.)
// ├── package.json            ← dependências do projeto
// ├── package-lock.json       ← versões exatas instaladas
// └── tests/
//     └── example.spec.ts    ← exemplo de teste pronto para rodar

// Para verificar que tudo foi instalado corretamente:
// npx playwright --version`,
    instrucaoExecucao: `1. Abra o terminal e crie uma pasta nova:
   mkdir meu-projeto-playwright
   cd meu-projeto-playwright

2. Execute a instalação:
   npm init playwright@latest

3. Responda as perguntas:
   ✓ TypeScript (Enter)
   ✓ tests (Enter)
   ✓ N para GitHub Actions
   ✓ y para instalar navegadores

4. Aguarde (~2-5 minutos para baixar os navegadores)

5. Verifique a instalação:
   npx playwright --version

Saída esperada: Version 1.x.x

ERRO COMUM: timeout durante o download dos navegadores
→ Sua rede pode estar lenta. Aguarde mais tempo ou tente novamente.`,
    reflexao: {
      pergunta: "O que o arquivo `playwright.config.ts` armazena?",
      opcoes: [
        "Os casos de teste que serão executados",
        "As configurações do projeto: quais browsers usar, timeouts, URL base, etc.",
        "Os resultados dos testes anteriores",
      ],
      correta: 1,
      explicacao: "Correto! O playwright.config.ts é o arquivo de configuração do projeto. Nele você define: quais navegadores rodar (Chrome, Firefox, Safari), o timeout padrão, a URL base da aplicação, onde salvar relatórios, quantos testes rodar em paralelo (workers), e muito mais.",
    },
  },

  "primeiro-teste": {
    moduloId: 1,
    labId: "primeiro-teste",
    conceito: `Um teste Playwright tem sempre a mesma estrutura: um nome, e uma função que usa o objeto page para controlar o navegador.

O objeto page é a sua "mão" dentro do navegador. Com ele você pode:
• page.goto(url) — navegar para um endereço
• page.locator("seletor") — encontrar um elemento
• expect(elemento).toBeVisible() — verificar se algo está visível

O test("nome", async ({ page }) => { ... }) é a função que o Playwright chama quando roda seus testes. O async/await garante que cada ação espera a anterior terminar.

Veja o arquivo tests/example.spec.ts que foi criado na instalação. Ele já tem dois testes funcionais apontando para playwright.dev. Vamos rodá-los e depois entender o que cada linha faz.`,
    codigo: `// tests/meu-primeiro-teste.spec.ts
// Crie este arquivo na pasta tests/ do seu projeto

import { test, expect } from "@playwright/test";

test("página do Playwright abre corretamente", async ({ page }) => {
  // Navega para a URL
  await page.goto("https://demo.playwright.dev/todomvc");

  // Verifica se o título da página contém "TodoMVC"
  await expect(page).toHaveTitle(/TodoMVC/);

  // Verifica se o campo de input está visível
  const input = page.getByPlaceholder("What needs to be done?");
  await expect(input).toBeVisible();
});

test("consigo adicionar uma tarefa", async ({ page }) => {
  await page.goto("https://demo.playwright.dev/todomvc");

  // Digita uma nova tarefa e pressiona Enter
  await page.getByPlaceholder("What needs to be done?").fill("Aprender Playwright");
  await page.keyboard.press("Enter");

  // Verifica se a tarefa apareceu na lista
  await expect(page.getByText("Aprender Playwright")).toBeVisible();
});`,
    instrucaoExecucao: `1. Crie o arquivo tests/meu-primeiro-teste.spec.ts com o código acima

2. Rode os testes (navegador visível):
   npx playwright test meu-primeiro-teste.spec.ts --headed

3. Observe o Chrome abrindo, navegando e testando automaticamente

4. Saída esperada no terminal:
   Running 2 tests using 1 worker
   ✓  1 página do Playwright abre corretamente (1.2s)
   ✓  2 consigo adicionar uma tarefa (0.9s)
   2 passed (3s)

ERRO COMUM: "Timeout 30000ms exceeded"
→ A conexão com demo.playwright.dev foi lenta.
→ Tente novamente ou verifique sua conexão com a internet.`,
    reflexao: {
      pergunta: "O que o `{ page }` representa na assinatura `async ({ page }) => { ... }`?",
      opcoes: [
        "O nome do arquivo de teste que será executado",
        "O objeto que representa o navegador — usado para navegar, clicar e verificar elementos",
        "O resultado do teste anterior (pass ou fail)",
      ],
      correta: 1,
      explicacao: "Correto! O page é a abstração do Playwright para o navegador. É por meio dele que você faz tudo: navegar (page.goto), encontrar elementos (page.locator), clicar, preencher formulários, tirar screenshots e muito mais. Cada teste recebe seu próprio page isolado.",
    },
  },

  "html-report": {
    moduloId: 1,
    labId: "html-report",
    conceito: `Depois de rodar os testes, o Playwright gera um relatório HTML completo. Ele mostra quais testes passaram, quais falharam, quanto tempo cada um levou, e — o mais importante — um vídeo e screenshots do que aconteceu nos testes que falharam.

O relatório é gerado automaticamente na pasta playwright-report/. Para abrir:
npx playwright show-report

Isso abre o relatório no seu navegador. Na tela principal você vê:
• ✅ Verde: teste passou
• ❌ Vermelho: teste falhou
• ⏭ Laranja: teste foi pulado

Clicando em um teste que falhou, você vê:
• A linha exata do erro
• O HTML da página no momento do erro (Trace Viewer)
• Vídeo do que aconteceu (se configurado)

Entender bem o relatório é uma habilidade fundamental — é aqui que você vai passar muito do seu tempo como QA de automação.`,
    codigo: `// playwright.config.ts — para ativar vídeo nos relatórios de falha
// (modifique o arquivo existente na raiz do projeto)

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  reporter: "html",   // gera o relatório HTML automaticamente
  use: {
    // Grava vídeo apenas quando o teste falhar:
    video: "retain-on-failure",
    // Salva screenshot quando o teste falhar:
    screenshot: "only-on-failure",
    // Ativa o Trace Viewer para testes que falharam:
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});`,
    instrucaoExecucao: `1. Abra o playwright.config.ts e adicione as configurações de video,
   screenshot e trace conforme o código acima

2. Faça um teste falhar de propósito — edite meu-primeiro-teste.spec.ts:
   Troque "Aprender Playwright" por "TEXTO QUE NAO EXISTE"

3. Rode os testes:
   npx playwright test meu-primeiro-teste.spec.ts

4. Abra o relatório:
   npx playwright show-report

5. Clique no teste vermelho e explore:
   • Aba "Error": mensagem de erro
   • Aba "Trace": gravação do que aconteceu passo a passo

6. Corrija o texto de volta para "Aprender Playwright"

Saída esperada no relatório: 1 teste vermelho com trace disponível.`,
    reflexao: {
      pergunta: "Qual configuração faz o Playwright gravar um vídeo somente quando o teste falhar?",
      opcoes: [
        `video: "on"`,
        `video: "retain-on-failure"`,
        `video: "off-on-success"`,
      ],
      correta: 1,
      explicacao: 'Correto! A opção "retain-on-failure" grava vídeo de todos os testes mas descarta os de testes bem-sucedidos — economizando espaço. Use "on" para gravar sempre (útil durante desenvolvimento) ou "off" para não gravar (mais rápido em CI/CD).',
    },
  },
};
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```
Esperado: sem erros. O objeto `conteudoLabs` deve ter 7 entradas.

- [ ] **Step 3: Commit**

```bash
git add src/data/playwright-labs.ts
git commit -m "feat: conteúdo dos labs do Módulo 1 (primeiros passos no Playwright)"
```

---

## Task 4: Component — LabPassos.tsx

**Files:**
- Create: `src/components/LabPassos.tsx`

- [ ] **Step 1: Criar o componente dos 4 passos**

```typescript
// src/components/LabPassos.tsx
"use client";
import { useState } from "react";
import type { LabConteudo } from "@/data/playwright-labs";

type Props = {
  lab: LabConteudo;
  onConcluido: (xp: number) => void;
  xp: number;
};

export default function LabPassos({ lab, onConcluido, xp }: Props) {
  const [passo, setPasso] = useState(1);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<number | null>(null);
  const [respondeu, setRespondeu] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    await navigator.clipboard.writeText(lab.codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const responder = (idx: number) => {
    if (respondeu) return;
    setOpcaoSelecionada(idx);
    setRespondeu(true);
  };

  const concluir = () => onConcluido(xp);

  const corPasso = "#06b6d4";

  return (
    <div>
      {/* Barra de progresso dos 4 passos */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "24px" }}>
        {[1, 2, 3, 4].map(n => (
          <div key={n} style={{ flex: 1, height: "3px", borderRadius: "99px",
            background: n <= passo ? corPasso : "#1f2937", transition: "background 0.3s" }} />
        ))}
      </div>

      {/* PASSO 1 — CONCEITO */}
      {passo === 1 && (
        <div>
          <div style={{ fontSize: "10px", color: corPasso, fontWeight: "bold",
            letterSpacing: "0.06em", marginBottom: "12px" }}>📖 PASSO 1 — CONCEITO</div>
          <div style={{ background: "#111827", border: `1px solid ${corPasso}44`,
            borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
            <p style={{ fontSize: "14px", color: "#d1d5db", lineHeight: 1.8,
              margin: 0, whiteSpace: "pre-line" }}>{lab.conceito}</p>
          </div>
          <button onClick={() => setPasso(2)}
            style={{ width: "100%", background: corPasso, border: "none",
              borderRadius: "10px", padding: "13px", color: "#000",
              fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            Próximo: ver o código →
          </button>
        </div>
      )}

      {/* PASSO 2 — CÓDIGO */}
      {passo === 2 && (
        <div>
          <div style={{ fontSize: "10px", color: corPasso, fontWeight: "bold",
            letterSpacing: "0.06em", marginBottom: "12px" }}>💻 PASSO 2 — CÓDIGO</div>
          <div style={{ background: "#0d1117", border: "1px solid #374151",
            borderRadius: "12px", overflow: "hidden", marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between",
              alignItems: "center", padding: "10px 16px",
              borderBottom: "1px solid #1f2937" }}>
              <span style={{ fontSize: "11px", color: "#6b7280" }}>TypeScript</span>
              <button onClick={copiar}
                style={{ background: "transparent", border: "1px solid #374151",
                  borderRadius: "6px", padding: "4px 10px", color: "#9ca3af",
                  fontSize: "11px", cursor: "pointer" }}>
                {copiado ? "✓ Copiado!" : "Copiar"}
              </button>
            </div>
            <pre style={{ margin: 0, padding: "16px", overflowX: "auto",
              fontSize: "12px", color: "#e5e7eb", lineHeight: 1.7 }}>
              <code>{lab.codigo}</code>
            </pre>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setPasso(1)}
              style={{ flex: 1, background: "transparent", border: "1px solid #374151",
                borderRadius: "10px", padding: "12px", color: "#9ca3af",
                fontSize: "13px", cursor: "pointer" }}>
              ← Voltar
            </button>
            <button onClick={() => setPasso(3)}
              style={{ flex: 2, background: corPasso, border: "none",
                borderRadius: "10px", padding: "12px", color: "#000",
                fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
              Próximo: executar →
            </button>
          </div>
        </div>
      )}

      {/* PASSO 3 — EXECUTE */}
      {passo === 3 && (
        <div>
          <div style={{ fontSize: "10px", color: corPasso, fontWeight: "bold",
            letterSpacing: "0.06em", marginBottom: "12px" }}>🏃 PASSO 3 — EXECUTE</div>
          <div style={{ background: "#111827", border: `1px solid ${corPasso}44`,
            borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", color: "#d1d5db", lineHeight: 1.8,
              margin: 0, whiteSpace: "pre-line", fontFamily: "monospace" }}>
              {lab.instrucaoExecucao}
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setPasso(2)}
              style={{ flex: 1, background: "transparent", border: "1px solid #374151",
                borderRadius: "10px", padding: "12px", color: "#9ca3af",
                fontSize: "13px", cursor: "pointer" }}>
              ← Voltar
            </button>
            <button onClick={() => setPasso(4)}
              style={{ flex: 2, background: corPasso, border: "none",
                borderRadius: "10px", padding: "12px", color: "#000",
                fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
              Próximo: reflexão →
            </button>
          </div>
        </div>
      )}

      {/* PASSO 4 — REFLEXÃO */}
      {passo === 4 && (
        <div>
          <div style={{ fontSize: "10px", color: corPasso, fontWeight: "bold",
            letterSpacing: "0.06em", marginBottom: "12px" }}>💡 PASSO 4 — REFLEXÃO</div>
          <div style={{ background: "#111827", border: `1px solid ${corPasso}44`,
            borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
            <p style={{ fontSize: "14px", color: "#e5e7eb", fontWeight: "600",
              marginBottom: "16px" }}>{lab.reflexao.pergunta}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {lab.reflexao.opcoes.map((opcao, i) => {
                const acertou = respondeu && i === lab.reflexao.correta;
                const errou = respondeu && i === opcaoSelecionada && i !== lab.reflexao.correta;
                return (
                  <button key={i} onClick={() => responder(i)} disabled={respondeu}
                    style={{ background: acertou ? "rgba(34,197,94,0.12)"
                      : errou ? "rgba(239,68,68,0.12)" : "#0d1117",
                      border: `1px solid ${acertou ? "#22c55e" : errou ? "#ef4444" : "#374151"}`,
                      borderRadius: "8px", padding: "12px 14px", color: "#e5e7eb",
                      fontSize: "13px", textAlign: "left", cursor: respondeu ? "default" : "pointer",
                      transition: "all 0.15s" }}>
                    {acertou ? "✅ " : errou ? "❌ " : ""}{opcao}
                  </button>
                );
              })}
            </div>
            {respondeu && (
              <div style={{ marginTop: "16px", padding: "12px",
                background: "rgba(6,182,212,0.08)", border: "1px solid #06b6d444",
                borderRadius: "8px", fontSize: "13px", color: "#9ca3af",
                lineHeight: 1.7 }}>
                {lab.reflexao.explicacao}
              </div>
            )}
          </div>
          <button onClick={() => setPasso(3)}
            style={{ background: "transparent", border: "1px solid #374151",
              borderRadius: "10px", padding: "10px 16px", color: "#9ca3af",
              fontSize: "13px", cursor: "pointer", marginBottom: "8px" }}>
            ← Voltar
          </button>
          {respondeu && (
            <button onClick={concluir}
              style={{ width: "100%", background: "#22c55e", border: "none",
                borderRadius: "10px", padding: "14px", color: "#000",
                fontSize: "15px", fontWeight: "700", cursor: "pointer",
                display: "block", boxShadow: "0 0 0 1px rgba(34,197,94,0.4), 0 8px 20px rgba(34,197,94,0.2)" }}>
              ✅ Concluir lab (+{xp} XP)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```
Esperado: sem erros de TypeScript.

- [ ] **Step 3: Commit**

```bash
git add src/components/LabPassos.tsx
git commit -m "feat: componente LabPassos com os 4 passos (conceito, código, execute, reflexão)"
```

---

## Task 5: Hub — /cursos

**Files:**
- Create: `src/app/cursos/page.tsx`

- [ ] **Step 1: Criar a página do hub multi-curso**

```typescript
// src/app/cursos/page.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import mapaModulos from "@/data/playwright-modulos";
import mapaCaptulos from "@/data/mapa-capitulos";

type CursoAtivo = {
  id: string;
  nome: string;
  emoji: string;
  cor: string;
  tipo: "certificacao" | "curso";
  rota: string;
  rotaInicio: string;
  progresso: number;
  posicaoAtual: string;
};

const TOTAL_TOPICOS_CTFL = 22;
const TOTAL_LABS_PLAYWRIGHT = 21;

export default function Cursos() {
  const [perfil, setPerfil] = useState<{ nome: string } | null>(null);
  const [cursosAtivos, setCursosAtivos] = useState<CursoAtivo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }

    const { data: perfilData } = await supabase
      .from("profiles").select("nome").eq("id", user.id).single();
    if (perfilData) setPerfil(perfilData);

    const { data: certs } = await supabase
      .from("usuario_certificacoes")
      .select("certificacao_id, semana_atual, status")
      .eq("user_id", user.id);

    const { data: progressoData } = await supabase
      .from("progresso_topicos")
      .select("certificacao_id, concluido")
      .eq("user_id", user.id)
      .eq("concluido", true);

    const ativos: CursoAtivo[] = [];

    if (certs?.find(c => c.certificacao_id === "ctfl")) {
      const concluidos = progressoData?.filter(p => p.certificacao_id === "ctfl").length || 0;
      const cert = certs.find(c => c.certificacao_id === "ctfl")!;
      const semana = cert.semana_atual || 1;
      const titulos = ["", "Fundamentos", "Ciclo de Vida", "Teste Estático",
        "Téc. Caixa-Preta", "Téc. Caixa-Branca", "Gerenciamento", "Ferramentas", "Simulado Final"];
      ativos.push({
        id: "ctfl", nome: "CTFL v4.0", emoji: "🎓", cor: "#d4af37",
        tipo: "certificacao", rota: "/dashboard", rotaInicio: "/inicio/ctfl",
        progresso: Math.round((concluidos / TOTAL_TOPICOS_CTFL) * 100),
        posicaoAtual: `Semana ${semana} — ${titulos[Math.min(semana, 8)] || "Simulado Final"}`,
      });
    }

    if (certs?.find(c => c.certificacao_id === "playwright")) {
      const concluidos = progressoData?.filter(p => p.certificacao_id === "playwright").length || 0;
      const cert = certs.find(c => c.certificacao_id === "playwright")!;
      const moduloAtual = cert.semana_atual || 0;
      const mod = mapaModulos[moduloAtual];
      ativos.push({
        id: "playwright", nome: "Playwright + IA", emoji: "🤖", cor: "#06b6d4",
        tipo: "curso", rota: "/playwright", rotaInicio: "/inicio/playwright",
        progresso: Math.round((concluidos / TOTAL_LABS_PLAYWRIGHT) * 100),
        posicaoAtual: `Módulo ${moduloAtual} — ${mod?.titulo || "Conclusão"}`,
      });
    }

    setCursosAtivos(ativos);
    setLoading(false);
  };

  const sair = async () => { await supabase.auth.signOut(); window.location.href = "/"; };

  const logoGold: React.CSSProperties = {
    background: "linear-gradient(135deg, #d4af37, #f5d76e)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
  };

  const cursosDisponiveis = [
    { id: "ctfl-at", nome: "CTFL-AT", emoji: "⚡", cor: "#10b981", desc: "Agile Tester" },
    { id: "ctal-ta", nome: "CTAL-TA", emoji: "🔬", cor: "#3b82f6", desc: "Test Analyst" },
    { id: "ctal-tm", nome: "CTAL-TM", emoji: "📋", cor: "#8b5cf6", desc: "Test Manager" },
  ];

  if (loading) return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#06b6d4", fontFamily: "Georgia, serif" }}>Carregando seus cursos...</div>
    </main>
  );

  const primeiroNome = perfil?.nome?.split(" ")[0] || "Tester";
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb", fontFamily: "sans-serif" }}>
      <style>{`
        @media (max-width: 640px) { .padding-main { padding: 1rem !important; } }
      `}</style>

      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0.875rem 2rem", borderBottom: "1px solid #1f2937", position: "sticky",
        top: 0, background: "rgba(11,15,26,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "24px", height: "24px" }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.1rem", ...logoGold }}>
            TestPath
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <a href="/perfil" style={{ color: "#9ca3af", fontSize: "12px", textDecoration: "none",
            border: "1px solid #374151", borderRadius: "8px", padding: "5px 10px" }}>
            {primeiroNome}
          </a>
          <button onClick={sair}
            style={{ background: "transparent", border: "1px solid #374151", borderRadius: "8px",
              padding: "5px 12px", color: "#9ca3af", fontSize: "12px", cursor: "pointer" }}>
            Sair
          </button>
        </div>
      </nav>

      <div className="padding-main" style={{ maxWidth: "680px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Saudação */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "4px",
            letterSpacing: "0.04em" }}>{saudacao.toUpperCase()}, {primeiroNome.toUpperCase()}</div>
          <div style={{ fontSize: "1.3rem", fontFamily: "Georgia, serif", color: "#e5e7eb" }}>
            {cursosAtivos.length === 0 ? "Escolha seu primeiro curso 🎯"
              : "Continue de onde parou 🚀"}
          </div>
        </div>

        {/* Meus cursos */}
        {cursosAtivos.length > 0 && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em",
              marginBottom: "10px" }}>MEUS CURSOS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {cursosAtivos.map(curso => (
                <div key={curso.id} onClick={() => window.location.href = curso.rota}
                  style={{ background: "#111827", border: `1px solid ${curso.cor}44`,
                    borderRadius: "14px", padding: "14px 16px", cursor: "pointer",
                    display: "flex", gap: "14px", alignItems: "center",
                    transition: "border-color 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = curso.cor;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 4px ${curso.cor}18`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${curso.cor}44`;
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px",
                    background: `${curso.cor}18`, border: `1px solid ${curso.cor}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.3rem", flexShrink: 0 }}>
                    {curso.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between",
                      alignItems: "center", marginBottom: "5px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "bold", color: "#e5e7eb" }}>
                        {curso.nome}
                      </span>
                      <span style={{ fontSize: "11px", color: curso.cor }}>{curso.progresso}%</span>
                    </div>
                    <div style={{ background: "#1f2937", borderRadius: "99px", height: "4px",
                      marginBottom: "5px" }}>
                      <div style={{ background: curso.cor, width: `${curso.progresso}%`,
                        height: "4px", borderRadius: "99px", transition: "width 0.5s" }} />
                    </div>
                    <div style={{ fontSize: "11px", color: "#6b7280" }}>{curso.posicaoAtual}</div>
                  </div>
                  <span style={{ color: curso.cor, fontSize: "1.3rem", flexShrink: 0 }}>›</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Iniciar Playwright se não inscrito */}
        {!cursosAtivos.find(c => c.id === "playwright") && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em",
              marginBottom: "10px" }}>
              {cursosAtivos.length > 0 ? "ADICIONAR CURSO" : "COMEÇAR AGORA"}
            </div>
            <div onClick={() => window.location.href = "/inicio/playwright"}
              style={{ background: "#111827", border: "1px solid rgba(6,182,212,0.4)",
                borderRadius: "14px", padding: "16px", cursor: "pointer",
                transition: "border-color 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#06b6d4";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 4px rgba(6,182,212,0.12)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(6,182,212,0.4)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}>
              <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px",
                  background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.3rem", flexShrink: 0 }}>🤖</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: "bold", color: "#e5e7eb",
                    marginBottom: "2px" }}>Playwright + IA</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    Do zero à automação com agentes de IA · 7 módulos · 21 labs
                  </div>
                </div>
                <div style={{ background: "#06b6d4", color: "#000", fontSize: "11px",
                  fontWeight: "bold", padding: "4px 10px", borderRadius: "99px" }}>
                  Iniciar
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Descobrir — em breve */}
        <div>
          <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em",
            marginBottom: "10px" }}>EM BREVE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            {cursosDisponiveis.map(c => (
              <div key={c.id}
                style={{ background: "#0d1117", border: "1px solid #1f2937",
                  borderRadius: "10px", padding: "12px", opacity: 0.5 }}>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>{c.emoji} {c.nome}</div>
                <div style={{ fontSize: "10px", color: "#374151", marginTop: "2px" }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```
Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/app/cursos/page.tsx
git commit -m "feat: hub multi-curso /cursos com cards de progresso"
```

---

## Task 6: Onboarding — /inicio/playwright

**Files:**
- Create: `src/app/inicio/playwright/page.tsx`

- [ ] **Step 1: Criar a página de onboarding do Playwright**

```typescript
// src/app/inicio/playwright/page.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function InicioPlaywright() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [experiencia, setExperiencia] = useState<string>("");
  const [disponibilidade, setDisponibilidade] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data } = await supabase.from("usuario_certificacoes")
        .select("id").eq("user_id", user.id).eq("certificacao_id", "playwright").single();
      if (data) window.location.href = "/playwright";
    })();
  }, []);

  const concluir = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("usuario_certificacoes").insert({
      user_id: user.id,
      certificacao_id: "playwright",
      status: "em_andamento",
      semana_atual: 0,
      ritmo: disponibilidade === "30min" ? "leve" : "moderado",
      pontos: 0,
      streak: 0,
      maior_streak: 0,
      data_inicio: new Date().toISOString().split("T")[0],
      data_meta: null,
    });
    window.location.href = "/playwright";
  };

  const logoGold: React.CSSProperties = {
    background: "linear-gradient(135deg, #d4af37, #f5d76e)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
  };

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "2rem", fontFamily: "sans-serif" }}>
      <a href="/cursos" style={{ display: "flex", alignItems: "center", gap: "8px",
        textDecoration: "none", marginBottom: "2rem" }}>
        <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "26px", height: "26px" }} />
        <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold",
          fontSize: "1.1rem", ...logoGold }}>TestPath</span>
      </a>

      <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: "16px",
        padding: "2.5rem", width: "100%", maxWidth: "440px" }}>
        {/* Step 1 — Experiência */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: "10px", color: "#06b6d4", letterSpacing: "0.06em",
              marginBottom: "8px" }}>PASSO 1 DE 2</div>
            <h2 style={{ fontSize: "1.3rem", color: "#e5e7eb", fontFamily: "Georgia, serif",
              fontWeight: "normal", marginBottom: "8px" }}>Qual sua experiência com código?</h2>
            <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "20px" }}>
              Vamos personalizar o curso para o seu nível atual.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { id: "nenhuma", label: "Nunca programei", desc: "Sou testador manual puro" },
                { id: "basico", label: "Sei o básico", desc: "Já mexi com scripts ou automação simples" },
                { id: "intermediario", label: "Programo regularmente", desc: "JavaScript/Python/outra linguagem" },
              ].map(op => (
                <button key={op.id} onClick={() => setExperiencia(op.id)}
                  style={{ background: experiencia === op.id ? "rgba(6,182,212,0.1)" : "#0d1117",
                    border: `1px solid ${experiencia === op.id ? "#06b6d4" : "#374151"}`,
                    borderRadius: "10px", padding: "12px 14px", textAlign: "left",
                    cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ fontSize: "13px", fontWeight: "600",
                    color: experiencia === op.id ? "#06b6d4" : "#e5e7eb" }}>{op.label}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{op.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(2)} disabled={!experiencia}
              style={{ width: "100%", background: experiencia ? "#06b6d4" : "#1f2937",
                border: "none", borderRadius: "10px", padding: "13px", color: "#000",
                fontSize: "14px", fontWeight: "700", cursor: experiencia ? "pointer" : "default",
                marginTop: "16px", transition: "background 0.15s" }}>
              Próximo →
            </button>
          </div>
        )}

        {/* Step 2 — Disponibilidade */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: "10px", color: "#06b6d4", letterSpacing: "0.06em",
              marginBottom: "8px" }}>PASSO 2 DE 2</div>
            <h2 style={{ fontSize: "1.3rem", color: "#e5e7eb", fontFamily: "Georgia, serif",
              fontWeight: "normal", marginBottom: "8px" }}>Quanto tempo por dia?</h2>
            <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "20px" }}>
              Cada lab leva de 10 a 20 minutos. Sem pressão.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { id: "30min", label: "30 minutos por dia", desc: "Ritmo tranquilo, 1-2 labs por dia" },
                { id: "1hora", label: "1 hora por dia", desc: "Ritmo moderado, 3-4 labs por dia" },
              ].map(op => (
                <button key={op.id} onClick={() => setDisponibilidade(op.id)}
                  style={{ background: disponibilidade === op.id ? "rgba(6,182,212,0.1)" : "#0d1117",
                    border: `1px solid ${disponibilidade === op.id ? "#06b6d4" : "#374151"}`,
                    borderRadius: "10px", padding: "12px 14px", textAlign: "left",
                    cursor: "pointer", transition: "all 0.15s" }}>
                  <div style={{ fontSize: "13px", fontWeight: "600",
                    color: disponibilidade === op.id ? "#06b6d4" : "#e5e7eb" }}>{op.label}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{op.desc}</div>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button onClick={() => setStep(1)}
                style={{ flex: 1, background: "transparent", border: "1px solid #374151",
                  borderRadius: "10px", padding: "12px", color: "#9ca3af",
                  fontSize: "13px", cursor: "pointer" }}>
                ← Voltar
              </button>
              <button onClick={concluir} disabled={!disponibilidade || loading}
                style={{ flex: 2, background: disponibilidade ? "#06b6d4" : "#1f2937",
                  border: "none", borderRadius: "10px", padding: "12px", color: "#000",
                  fontSize: "14px", fontWeight: "700",
                  cursor: disponibilidade && !loading ? "pointer" : "default" }}>
                {loading ? "Criando seu curso..." : "Começar o curso →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/app/inicio/playwright/page.tsx
git commit -m "feat: onboarding do curso Playwright (/inicio/playwright)"
```

---

## Task 7: Dashboard — /playwright

**Files:**
- Create: `src/app/playwright/page.tsx`

- [ ] **Step 1: Criar o dashboard do curso Playwright**

```typescript
// src/app/playwright/page.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import mapaModulos from "@/data/playwright-modulos";

type CertData = {
  semana_atual: number;
  pontos: number;
  streak: number;
  maior_streak: number;
  ritmo: string;
};

type ProgressoLab = { capitulo: number; topico_id: string };

const TOTAL_LABS = 21;

export default function PlaywrightDashboard() {
  const [cert, setCert] = useState<CertData | null>(null);
  const [progresso, setProgresso] = useState<ProgressoLab[]>([]);
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<{ nome: string } | null>(null);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }

    const { data: perfilData } = await supabase
      .from("profiles").select("nome").eq("id", user.id).single();
    if (perfilData) setPerfil(perfilData);

    const { data: certData } = await supabase
      .from("usuario_certificacoes").select("*")
      .eq("user_id", user.id).eq("certificacao_id", "playwright").single();

    if (!certData) { window.location.href = "/inicio/playwright"; return; }
    setCert(certData);

    const { data: progressoData } = await supabase
      .from("progresso_topicos").select("capitulo, topico_id")
      .eq("user_id", user.id).eq("certificacao_id", "playwright").eq("concluido", true);

    if (progressoData) setProgresso(progressoData);
    setLoading(false);
  };

  const sair = async () => { await supabase.auth.signOut(); window.location.href = "/"; };

  if (loading) return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#06b6d4", fontFamily: "Georgia, serif" }}>
        Carregando seu curso...
      </div>
    </main>
  );

  const totalConcluidos = progresso.length;
  const progressoGeral = Math.round((totalConcluidos / TOTAL_LABS) * 100);
  const moduloAtual = cert?.semana_atual || 0;
  const xpTotal = cert?.pontos || 0;
  const streak = cert?.streak || 0;

  // Módulo e lab atual para card "Continuar"
  const modInfo = mapaModulos[Math.min(moduloAtual, 6)];
  const labsConcluidos = progresso.filter(p => p.capitulo === moduloAtual).length;
  const proximoLab = modInfo?.labs[labsConcluidos] || modInfo?.labs[0];
  const rotaContinuar = proximoLab
    ? `/playwright/modulo/${moduloAtual}/lab/${proximoLab.id}`
    : moduloAtual < 6 ? `/playwright/modulo/${moduloAtual + 1}` : "/playwright/projeto-final";

  const logoGold: React.CSSProperties = {
    background: "linear-gradient(135deg, #d4af37, #f5d76e)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
  };

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb",
      fontFamily: "sans-serif" }}>
      <style>{`
        @media (max-width: 640px) { .padding-main { padding: 1rem !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>

      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0.875rem 2rem", borderBottom: "1px solid #1f2937", position: "sticky",
        top: 0, background: "rgba(11,15,26,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src="/icons/favicon-96x96.png" alt="TestPath" style={{ width: "24px", height: "24px" }} />
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold",
            fontSize: "1.1rem", ...logoGold }}>TestPath</span>
          <span style={{ fontSize: "11px", background: "rgba(6,182,212,0.08)",
            color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)",
            padding: "2px 8px", borderRadius: "99px" }}>Playwright</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.3)",
            borderRadius: "99px", padding: "5px 12px", fontSize: "13px",
            color: "#d4af37", fontWeight: "bold" }}>
            ⭐ {xpTotal} XP
          </div>
          <a href="/cursos" style={{ color: "#9ca3af", fontSize: "12px", textDecoration: "none",
            border: "1px solid #374151", borderRadius: "8px", padding: "5px 10px" }}>
            Meus cursos
          </a>
          <button onClick={sair}
            style={{ background: "transparent", border: "1px solid #374151",
              borderRadius: "8px", padding: "5px 12px", color: "#9ca3af",
              fontSize: "12px", cursor: "pointer" }}>Sair</button>
        </div>
      </nav>

      <div className="padding-main" style={{ maxWidth: "680px", margin: "0 auto", padding: "1.5rem" }}>
        {/* Stats */}
        <div className="stats-grid" style={{ display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "1.25rem" }}>
          <div style={{ background: "#111827", border: "1px solid #1f2937",
            borderRadius: "14px", padding: "1rem" }}>
            <div style={{ fontSize: "10px", color: "#6b7280", marginBottom: "4px",
              letterSpacing: "0.04em" }}>PROGRESSO</div>
            <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#06b6d4",
              marginBottom: "4px" }}>{progressoGeral}%</div>
            <div style={{ background: "#1f2937", borderRadius: "99px", height: "4px" }}>
              <div style={{ background: "#06b6d4", width: `${progressoGeral}%`,
                height: "4px", borderRadius: "99px" }} />
            </div>
          </div>
          <div style={{ background: "#111827", border: "1px solid #1f2937",
            borderRadius: "14px", padding: "1rem" }}>
            <div style={{ fontSize: "10px", color: "#6b7280", marginBottom: "4px",
              letterSpacing: "0.04em" }}>STREAK</div>
            <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#e5e7eb",
              marginBottom: "4px" }}>🔥 {streak}</div>
            <div style={{ fontSize: "10px", color: "#6b7280" }}>
              {streak === 0 ? "Estuda hoje!" : `${streak} dia${streak > 1 ? "s" : ""} seguido${streak > 1 ? "s" : ""}`}
            </div>
          </div>
          <div style={{ background: "#111827", border: "1px solid #1f2937",
            borderRadius: "14px", padding: "1rem" }}>
            <div style={{ fontSize: "10px", color: "#6b7280", marginBottom: "4px",
              letterSpacing: "0.04em" }}>LABS</div>
            <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#e5e7eb",
              marginBottom: "4px" }}>{totalConcluidos}/{TOTAL_LABS}</div>
            <div style={{ fontSize: "10px", color: "#6b7280" }}>concluídos</div>
          </div>
        </div>

        {/* Card Continuar */}
        {modInfo && (
          <div onClick={() => window.location.href = rotaContinuar}
            style={{ background: "#111827", border: "1px solid rgba(6,182,212,0.4)",
              borderRadius: "14px", padding: "1rem 1.25rem", marginBottom: "1.25rem",
              display: "flex", alignItems: "center", gap: "0.875rem", cursor: "pointer",
              transition: "border-color 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "#06b6d4";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 4px rgba(6,182,212,0.12)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(6,182,212,0.4)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px",
              background: "rgba(6,182,212,0.12)", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>▶️</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "10px", color: "#6b7280", marginBottom: "2px",
                letterSpacing: "0.04em" }}>CONTINUAR</div>
              <div style={{ fontSize: "14px", fontWeight: "bold", color: "#e5e7eb",
                marginBottom: "1px", overflow: "hidden", textOverflow: "ellipsis",
                whiteSpace: "nowrap" }}>
                Módulo {moduloAtual} — {modInfo.titulo}
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                {proximoLab ? `Lab: ${proximoLab.titulo}` : "Todos os labs concluídos"}
              </div>
            </div>
            <span style={{ color: "#06b6d4", fontSize: "1.4rem", flexShrink: 0 }}>›</span>
          </div>
        )}

        {/* Lista de módulos */}
        <div style={{ fontSize: "10px", color: "#6b7280", letterSpacing: "0.08em",
          marginBottom: "10px" }}>MÓDULOS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {Object.values(mapaModulos).map(mod => {
            const labsConcl = progresso.filter(p => p.capitulo === mod.numero).length;
            const pct = Math.round((labsConcl / mod.labs.length) * 100);
            const isAtual = mod.numero === moduloAtual;
            return (
              <div key={mod.numero}
                onClick={() => window.location.href = `/playwright/modulo/${mod.numero}`}
                style={{ background: "#111827", border: `1px solid ${isAtual ? mod.cor + "66" : "#1f2937"}`,
                  borderRadius: "12px", padding: "12px 14px", cursor: "pointer",
                  display: "flex", gap: "12px", alignItems: "center",
                  transition: "border-color 0.2s" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "10px",
                  background: `${mod.cor}18`, border: `1px solid ${mod.cor}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem", flexShrink: 0 }}>{mod.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: isAtual ? "bold" : "normal",
                    color: "#e5e7eb", marginBottom: "3px" }}>
                    {mod.numero}. {mod.titulo}
                  </div>
                  <div style={{ background: "#1f2937", borderRadius: "99px", height: "3px" }}>
                    <div style={{ background: mod.cor, width: `${pct}%`,
                      height: "3px", borderRadius: "99px" }} />
                  </div>
                </div>
                <span style={{ fontSize: "11px", color: "#6b7280", flexShrink: 0 }}>
                  {labsConcl}/{mod.labs.length}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/app/playwright/page.tsx
git commit -m "feat: dashboard do curso Playwright (/playwright)"
```

---

## Task 8: Module View — /playwright/modulo/[modulo]

**Files:**
- Create: `src/app/playwright/modulo/[modulo]/page.tsx`

- [ ] **Step 1: Criar a página de visão do módulo**

```typescript
// src/app/playwright/modulo/[modulo]/page.tsx
import { use } from "react";
import { notFound } from "next/navigation";
import ModuloPage from "./ModuloPage";
import mapaModulos from "@/data/playwright-modulos";

export default function Modulo({ params }: { params: Promise<{ modulo: string }> }) {
  const { modulo } = use(params);
  const num = Number(modulo);
  if (!Number.isInteger(num) || !mapaModulos[num]) notFound();
  return <ModuloPage numeroModulo={num} />;
}
```

- [ ] **Step 2: Criar o componente client ModuloPage**

Criar `src/app/playwright/modulo/[modulo]/ModuloPage.tsx`:

```typescript
// src/app/playwright/modulo/[modulo]/ModuloPage.tsx
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import mapaModulos from "@/data/playwright-modulos";

export default function ModuloPage({ numeroModulo }: { numeroModulo: number }) {
  const [labsConcluidos, setLabsConcluidos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const mod = mapaModulos[numeroModulo];

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data } = await supabase.from("progresso_topicos")
        .select("topico_id").eq("user_id", user.id)
        .eq("certificacao_id", "playwright")
        .eq("capitulo", numeroModulo).eq("concluido", true);
      if (data) setLabsConcluidos(data.map(d => d.topico_id));
      setLoading(false);
    })();
  }, [numeroModulo]);

  if (loading) return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#06b6d4", fontFamily: "Georgia, serif" }}>Carregando...</div>
    </main>
  );

  const pct = Math.round((labsConcluidos.length / mod.labs.length) * 100);

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb",
      fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <a href="/playwright" style={{ fontSize: "13px", color: "#9ca3af",
          textDecoration: "none", display: "inline-flex", alignItems: "center",
          gap: "4px", marginBottom: "1.5rem" }}>
          ← Dashboard Playwright
        </a>

        <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px",
            background: `${mod.cor}18`, border: `1px solid ${mod.cor}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem", flexShrink: 0 }}>{mod.emoji}</div>
          <div>
            <div style={{ fontSize: "11px", color: mod.cor, fontWeight: "bold",
              letterSpacing: "0.06em", marginBottom: "2px" }}>
              MÓDULO {mod.numero}
            </div>
            <h1 style={{ fontSize: "1.4rem", fontFamily: "Georgia, serif",
              fontWeight: "normal", color: "#e5e7eb", margin: 0 }}>{mod.titulo}</h1>
            <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
              {mod.descricao}
            </div>
          </div>
        </div>

        {/* Barra de progresso do módulo */}
        <div style={{ background: "#111827", borderRadius: "10px", padding: "12px 16px",
          marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between",
            marginBottom: "6px", fontSize: "12px", color: "#9ca3af" }}>
            <span>{labsConcluidos.length}/{mod.labs.length} labs concluídos</span>
            <span style={{ color: mod.cor }}>{pct}%</span>
          </div>
          <div style={{ background: "#1f2937", borderRadius: "99px", height: "5px" }}>
            <div style={{ background: mod.cor, width: `${pct}%`,
              height: "5px", borderRadius: "99px", transition: "width 0.5s" }} />
          </div>
        </div>

        {/* Lista de labs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {mod.labs.map((lab, i) => {
            const concluido = labsConcluidos.includes(lab.id);
            const bloqueado = i > 0 && !labsConcluidos.includes(mod.labs[i - 1].id);
            return (
              <div key={lab.id}
                onClick={() => !bloqueado && (window.location.href =
                  `/playwright/modulo/${numeroModulo}/lab/${lab.id}`)}
                style={{ background: "#111827",
                  border: `1px solid ${concluido ? mod.cor + "44" : "#1f2937"}`,
                  borderRadius: "12px", padding: "14px 16px",
                  cursor: bloqueado ? "default" : "pointer", opacity: bloqueado ? 0.5 : 1,
                  display: "flex", gap: "12px", alignItems: "center",
                  transition: "border-color 0.2s" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px",
                  background: concluido ? `${mod.cor}18` : "#1f2937",
                  border: `1px solid ${concluido ? mod.cor : "#374151"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.9rem", flexShrink: 0, color: concluido ? mod.cor : "#6b7280" }}>
                  {concluido ? "✓" : bloqueado ? "🔒" : `${lab.numero}`}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: "600",
                    color: concluido ? mod.cor : "#e5e7eb" }}>{lab.titulo}</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "1px" }}>
                    {lab.subtitulo}
                  </div>
                </div>
                <div style={{ fontSize: "11px", color: "#d4af37" }}>+{lab.xp} XP</div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Verificar build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/playwright/modulo/
git commit -m "feat: visão do módulo Playwright com lista de labs e progresso"
```

---

## Task 9: Lab Page — /playwright/modulo/[modulo]/lab/[lab]

**Files:**
- Create: `src/app/playwright/modulo/[modulo]/lab/[lab]/page.tsx`

- [ ] **Step 1: Criar a página do lab individual**

```typescript
// src/app/playwright/modulo/[modulo]/lab/[lab]/page.tsx
"use client";
import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import mapaModulos from "@/data/playwright-modulos";
import { conteudoLabs } from "@/data/playwright-labs";
import LabPassos from "@/components/LabPassos";

export default function LabPage({
  params,
}: {
  params: Promise<{ modulo: string; lab: string }>;
}) {
  const { modulo, lab } = use(params);
  const numModulo = Number(modulo);
  const mod = mapaModulos[numModulo];
  const conteudo = conteudoLabs[lab];

  if (!mod || !conteudo) notFound();

  const labMeta = mod.labs.find(l => l.id === lab);
  if (!labMeta) notFound();

  const [userId, setUserId] = useState<string | null>(null);
  const [concluido, setConcluido] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      setUserId(user.id);
      const { data } = await supabase.from("progresso_topicos")
        .select("id").eq("user_id", user.id)
        .eq("certificacao_id", "playwright")
        .eq("capitulo", numModulo).eq("topico_id", lab).eq("concluido", true).single();
      if (data) setConcluido(true);
    })();
  }, [numModulo, lab]);

  const salvarProgresso = async (xp: number) => {
    if (!userId || concluido) return;
    await supabase.from("progresso_topicos").upsert({
      user_id: userId,
      certificacao_id: "playwright",
      capitulo: numModulo,
      topico_id: lab,
      concluido: true,
      xp_ganho: xp,
      atualizado_em: new Date().toISOString(),
    }, { onConflict: "user_id,certificacao_id,capitulo,topico_id" });

    const { data: cert } = await supabase.from("usuario_certificacoes")
      .select("pontos, streak, maior_streak, semana_atual")
      .eq("user_id", userId).eq("certificacao_id", "playwright").single();

    if (cert) {
      const hoje = new Date().toISOString().split("T")[0];
      const novoStreak = (cert.streak || 0) + 1;
      const labsConcluidos = mod.labs.findIndex(l => l.id === lab);
      const todosModuloConcluidos = labsConcluidos === mod.labs.length - 1;
      await supabase.from("usuario_certificacoes").update({
        pontos: (cert.pontos || 0) + xp,
        streak: novoStreak,
        maior_streak: Math.max(novoStreak, cert.maior_streak || 0),
        ultimo_estudo: hoje,
        ...(todosModuloConcluidos && cert.semana_atual === numModulo
          ? { semana_atual: numModulo + 1 } : {}),
      }).eq("user_id", userId).eq("certificacao_id", "playwright");
    }

    setConcluido(true);
    // Navegar para o próximo lab ou módulo
    const idxAtual = mod.labs.findIndex(l => l.id === lab);
    if (idxAtual < mod.labs.length - 1) {
      window.location.href = `/playwright/modulo/${numModulo}/lab/${mod.labs[idxAtual + 1].id}`;
    } else {
      window.location.href = `/playwright/modulo/${numModulo}`;
    }
  };

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", color: "#e5e7eb",
      fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px",
          fontSize: "12px", color: "#6b7280", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <a href="/playwright" style={{ color: "#9ca3af", textDecoration: "none" }}>
            Playwright
          </a>
          <span>›</span>
          <a href={`/playwright/modulo/${numModulo}`}
            style={{ color: "#9ca3af", textDecoration: "none" }}>
            Módulo {numModulo} — {mod.titulo}
          </a>
          <span>›</span>
          <span style={{ color: "#06b6d4" }}>Lab {labMeta.numero}</span>
        </div>

        {/* Título */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "10px", color: "#06b6d4", fontWeight: "bold",
            letterSpacing: "0.06em", marginBottom: "6px" }}>
            {mod.emoji} MÓDULO {numModulo} · LAB {labMeta.numero}/{mod.labs.length}
          </div>
          <h1 style={{ fontSize: "1.5rem", fontFamily: "Georgia, serif",
            fontWeight: "normal", color: "#e5e7eb", margin: "0 0 4px" }}>
            {labMeta.titulo}
          </h1>
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>{labMeta.subtitulo}</p>
        </div>

        {/* Lab já concluído */}
        {concluido ? (
          <div style={{ background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.3)", borderRadius: "12px",
            padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>✅</div>
            <div style={{ color: "#22c55e", fontWeight: "bold", marginBottom: "4px" }}>
              Lab concluído!
            </div>
            <div style={{ color: "#6b7280", fontSize: "13px", marginBottom: "16px" }}>
              Você já completou este lab.
            </div>
            <a href={`/playwright/modulo/${numModulo}`}
              style={{ color: "#06b6d4", fontSize: "13px", textDecoration: "none" }}>
              ← Voltar ao módulo
            </a>
          </div>
        ) : (
          <LabPassos lab={conteudo} xp={labMeta.xp} onConcluido={salvarProgresso} />
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```
Esperado: sem erros de TypeScript.

- [ ] **Step 3: Commit**

```bash
git add "src/app/playwright/modulo/[modulo]/lab/"
git commit -m "feat: página do lab individual com 4 passos e salvamento de progresso"
```

---

## Task 10: Stubs — Projeto Final + API de Avaliação

**Files:**
- Create: `src/app/playwright/projeto-final/page.tsx`
- Create: `src/app/api/playwright/avaliar/route.ts`

- [ ] **Step 1: Criar stub do projeto final**

```typescript
// src/app/playwright/projeto-final/page.tsx
"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ProjetoFinal() {
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = "/login";
    })();
  }, []);

  return (
    <main style={{ background: "#0b0f1a", minHeight: "100vh", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "2rem", fontFamily: "sans-serif", color: "#e5e7eb" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔨</div>
      <h1 style={{ fontFamily: "Georgia, serif", fontWeight: "normal",
        fontSize: "1.8rem", marginBottom: "1rem", color: "#e5e7eb", textAlign: "center" }}>
        Projeto Final
      </h1>
      <p style={{ color: "#9ca3af", maxWidth: "480px", textAlign: "center",
        lineHeight: 1.7, marginBottom: "2rem" }}>
        Complete os 7 módulos do curso para desbloquear o projeto final.
        Aqui você vai automatizar a aplicação <strong style={{ color: "#06b6d4" }}>
        demo.playwright.dev</strong> e ter seus testes avaliados por IA.
      </p>
      <a href="/playwright" style={{ color: "#06b6d4", textDecoration: "none", fontSize: "14px" }}>
        ← Voltar ao dashboard
      </a>
    </main>
  );
}
```

- [ ] **Step 2: Criar stub da API de avaliação**

```typescript
// src/app/api/playwright/avaliar/route.ts
import { NextRequest, NextResponse } from "next/server";

// Stub — implementação completa na Fase 2
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.codigo) {
    return NextResponse.json({ error: "Código não fornecido" }, { status: 400 });
  }
  return NextResponse.json({
    score: 0,
    aprovado: false,
    mensagem: "Avaliação por IA disponível em breve.",
  });
}
```

- [ ] **Step 3: Verificar build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/app/playwright/projeto-final/page.tsx src/app/api/playwright/avaliar/route.ts
git commit -m "feat: stubs do projeto final e API de avaliação (Fase 2)"
```

---

## Task 11: Banco de Dados — playwright_projetos_finais

**Files:**
- Nenhum arquivo de código — executar SQL no Supabase Dashboard.

- [ ] **Step 1: Abrir o Supabase Dashboard**

Acesse: [https://supabase.com/dashboard](https://supabase.com/dashboard) → seu projeto → SQL Editor → New query.

- [ ] **Step 2: Executar o SQL de criação da tabela**

```sql
-- Criar a tabela para submissões do projeto final
CREATE TABLE IF NOT EXISTS playwright_projetos_finais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  codigo_tests text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  aprovado boolean NOT NULL DEFAULT false,
  feedback_ia jsonb NOT NULL DEFAULT '{}'::jsonb,
  tentativa integer NOT NULL DEFAULT 1,
  criado_em timestamptz DEFAULT now()
);

-- RLS: usuário vê e insere apenas seus próprios registros
ALTER TABLE playwright_projetos_finais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário vê seus projetos" ON playwright_projetos_finais
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuário insere seu projeto" ON playwright_projetos_finais
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

- [ ] **Step 3: Verificar que a tabela foi criada**

No Supabase Dashboard → Table Editor: confirmar que `playwright_projetos_finais` aparece com as colunas: `id`, `user_id`, `codigo_tests`, `score`, `aprovado`, `feedback_ia`, `tentativa`, `criado_em`.

---

## Task 12: Atualizar redirect do login para /cursos

**Files:**
- Modify: `src/app/login/page.tsx:32`

- [ ] **Step 1: Trocar o redirect e atualizar o texto da página**

No arquivo `src/app/login/page.tsx`:

Trocar a linha 32:
```typescript
window.location.href = "/dashboard";
```
Por:
```typescript
window.location.href = "/cursos";
```

E na linha 93, trocar o texto do subtítulo:
```typescript
// ANTES:
Entre para continuar sua trilha CTFL.

// DEPOIS:
Entre para continuar seus estudos.
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```
Esperado: sem erros.

- [ ] **Step 3: Testar o fluxo de login manualmente**

```bash
npm run dev
```

1. Acesse `http://localhost:3000/login`
2. Faça login com uma conta existente
3. Confirme que redireciona para `/cursos` (não mais `/dashboard`)
4. Confirme que `/cursos` mostra o card do CTFL com o progresso correto
5. Confirme que clicar no card CTFL leva para `/dashboard`

- [ ] **Step 4: Commit**

```bash
git add src/app/login/page.tsx
git commit -m "feat: redirecionar login para /cursos (hub multi-curso)"
```

---

## Self-Review

### Spec coverage
- ✅ Hub `/cursos` — Task 5
- ✅ Onboarding Playwright — Task 6
- ✅ Dashboard `/playwright` — Task 7
- ✅ Módulo view — Task 8
- ✅ Lab page com LabPassos — Tasks 4 + 9
- ✅ Conteúdo Módulos 0 e 1 (7 labs completos) — Tasks 2 + 3
- ✅ Tabela `playwright_projetos_finais` — Task 11
- ✅ Projeto final stub — Task 10
- ✅ API avaliar stub — Task 10
- ✅ Redirect login para /cursos — Task 12
- ✅ Metadados todos os 7 módulos — Task 1

### Sem placeholders
Todos os passos têm código completo. Stubs explicitamente marcados como Fase 2.

### Type consistency
- `LabConteudo` definido em Task 2 → usado em `LabPassos` (Task 4) e lab page (Task 9) ✅
- `ModuloMeta` / `LabMeta` definidos em Task 1 → usados em Tasks 7, 8, 9 ✅
- `mapaModulos` exportado como `Record<number, ModuloMeta>` → acessos por número em todas as rotas ✅
- `conteudoLabs` exportado como `Record<string, LabConteudo>` → acessado por `lab.id` (string) ✅
