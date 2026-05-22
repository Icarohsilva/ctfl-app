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
    await use(page);
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
