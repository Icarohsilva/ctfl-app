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
