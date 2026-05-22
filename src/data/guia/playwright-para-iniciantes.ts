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
