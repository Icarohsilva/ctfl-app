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
    ['list'],
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
