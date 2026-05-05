# Testes E2E com Playwright — TestPath

**Data:** 2026-05-05
**Escopo:** Suite completa de testes E2E com Page Object Model cobrindo todas as rotas do sistema, pipeline de CI no GitHub Actions acionado a cada push na main, e convenção para adicionar testes a cada nova feature.

---

## 1. Decisões de design

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| Ambiente de teste | `https://testpath.online` (produção) | Sem setup de env vars local no CI |
| Auth nos testes | Usuário dedicado via GitHub Secrets | Login único com `storageState` reutilizado |
| Simulados (Groq) | Chamadas reais | Testa o fluxo completo de verdade |
| Browser no CI | Chromium apenas | Velocidade; Firefox/WebKit opcionais local |

---

## 2. Estrutura de arquivos

```
e2e/
  .auth/
    user.json              ← storageState (gitignored)
  fixtures/
    auth.setup.ts          ← global setup: login uma vez, salva storageState
  pages/
    LandingPage.ts
    LoginPage.ts
    CadastroPage.ts
    EsqueciSenhaPage.ts
    DashboardPage.ts
    AprenderPage.ts
    CapituloPage.ts
    TopicoPage.ts
    SimuladoPage.ts
    SimuladoFinalPage.ts
    PerfilPage.ts
  tests/
    landing.spec.ts
    auth.spec.ts
    dashboard.spec.ts
    trilha.spec.ts
    simulado.spec.ts
    simulado-final.spec.ts
    perfil.spec.ts
  README.md
playwright.config.ts
```

---

## 3. Configuração (`playwright.config.ts`)

- `baseURL`: `https://testpath.online`
- `testDir`: `./e2e/tests`
- `globalSetup`: `./e2e/fixtures/auth.setup.ts`
- `storageState`: `./e2e/.auth/user.json` (apenas projetos autenticados)
- Dois projetos Playwright:
  - `setup` — roda `auth.setup.ts` primeiro
  - `chromium` — depende de `setup`, usa `storageState`
- `timeout`: 30 000ms por teste
- `retries`: 1 no CI, 0 local
- `reporter`: `html` + `github` no CI
- Screenshots e vídeos apenas em falhas

---

## 4. Auth setup (`e2e/fixtures/auth.setup.ts`)

```typescript
import { test as setup } from '@playwright/test';

setup('autenticar usuário de teste', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel(/e-mail/i).fill(process.env.TEST_USER_EMAIL!);
  await page.getByLabel(/senha/i).fill(process.env.TEST_USER_PASSWORD!);
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForURL('**/dashboard');
  await page.context().storageState({ path: 'e2e/.auth/user.json' });
});
```

`TEST_USER_EMAIL` e `TEST_USER_PASSWORD` lidos de `.env.test` localmente e de GitHub Secrets no CI.

---

## 5. Cobertura por spec

### `landing.spec.ts` — público
- Logo "TestPath" visível no nav
- Heading principal contém "certificações"
- Botão "Começar grátis" navega para `/cadastro`
- Link "Entrar" navega para `/login`
- Seção "Feito por um QA de verdade" visível
- Link do LinkedIn presente e com `href` correto

### `auth.spec.ts` — público
- Login com credenciais erradas exibe mensagem de erro
- Login com credenciais corretas redireciona para `/dashboard`
- Formulário de cadastro valida campos obrigatórios
- Página esqueci-senha aceita e-mail e exibe confirmação

### `dashboard.spec.ts` — autenticado
- Redireciona `/login` → `/dashboard` quando autenticado
- Card CTFL visível com progresso
- Botão "Continuar trilha" navega para `/inicio/ctfl` ou tópico

### `trilha.spec.ts` — autenticado
- `/inicio/ctfl` carrega lista de capítulos
- Clicar em capítulo navega para `/capitulo/[n]`
- `/capitulo/1` exibe lista de tópicos do capítulo 1
- Clicar em tópico navega para `/capitulo/1/topico/[id]`
- Conteúdo do tópico carrega (narrativa e cards visíveis)

### `simulado.spec.ts` — autenticado
- Botão "Iniciar simulado" visível na página do tópico
- Após clicar, questão carrega dentro de 15s (timeout estendido para Groq)
- Opções de resposta visíveis (mínimo 2)
- Selecionar opção e confirmar avança para próxima questão ou resultado

### `simulado-final.spec.ts` — autenticado
- `/simulado-final` carrega sem erro
- Timer/cronômetro visível
- Primeira questão carrega dentro de 20s
- Botão de submissão existe

### `perfil.spec.ts` — autenticado
- `/perfil` carrega com nome do usuário
- Atualizar nome e salvar exibe mensagem de sucesso **abaixo** do botão
- Mensagem de confirmação visível sem rolar para cima

---

## 6. Padrão de Page Object

Cada Page Object encapsula seletores e ações de uma rota. Exemplo mínimo:

```typescript
// e2e/pages/LoginPage.ts
import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.getByLabel(/e-mail/i).fill(email);
    await this.page.getByLabel(/senha/i).fill(password);
    await this.page.getByRole('button', { name: /entrar/i }).click();
  }

  async erroVisivel() {
    return this.page.getByRole('alert').isVisible();
  }
}
```

Regras:
- Um arquivo por página/rota
- Métodos nomeados como ações do usuário (`login()`, `salvarPerfil()`, `iniciarSimulado()`)
- Nenhum `expect()` dentro do Page Object — apenas ações e getters
- Assertions ficam no spec

---

## 7. Pipeline CI (`.github/workflows/e2e.yml`)

```yaml
name: E2E Tests

on:
  push:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
        env:
          TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

---

## 8. Convenção para novas features

A cada nova rota ou feature adicionada ao sistema:

1. **Page Object** — criar `e2e/pages/NomePage.ts` com seletores e ações da nova tela
2. **Spec** — adicionar `describe` block no spec existente mais próximo **ou** criar `e2e/tests/feature.spec.ts`
3. **README** — adicionar 1 linha em `e2e/README.md` descrevendo o que o teste cobre
4. **Regra:** PR sem teste para nova rota pública ou fluxo autenticado deve ser justificado

---

## 9. Arquivos modificados/criados

| Arquivo | Tipo |
|---------|------|
| `playwright.config.ts` | Novo |
| `e2e/fixtures/auth.setup.ts` | Novo |
| `e2e/pages/*.ts` (11 arquivos) | Novos |
| `e2e/tests/*.spec.ts` (7 arquivos) | Novos |
| `e2e/README.md` | Novo |
| `e2e/.auth/` | Novo (gitignored) |
| `.github/workflows/e2e.yml` | Novo |
| `.gitignore` | Modificado (adiciona `e2e/.auth/`) |
| `package.json` | Modificado (adiciona script `test:e2e`) |

---

## 10. Fora do escopo

- Testes de acessibilidade (a11y)
- Testes em Firefox e WebKit no CI
- Testes de performance (Lighthouse)
- Mock de chamadas Groq
- Cobertura da rota `/cancelar-notificacoes` (fluxo de e-mail externo)
