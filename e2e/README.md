# Testes E2E — TestPath

Playwright + Page Object Model. Rodam contra `https://testpath.online`.

## Rodando localmente

1. Crie `.env.test` na raiz com as credenciais do usuário de teste:
   ```
   TEST_USER_EMAIL=teste@testpath.online
   TEST_USER_PASSWORD=SenhaDoTestE2E123!
   ```
2. Rode o setup de auth uma vez:
   ```bash
   npx playwright test --project=setup
   ```
3. Rode todos os testes:
   ```bash
   npm run test:e2e
   ```
4. Ver relatório HTML:
   ```bash
   npm run test:e2e:report
   ```

## Adicionando testes para novas features

### 1. Nova rota pública (ex: `/sobre`)
- Criar `e2e/pages/SobrePage.ts` com seletores e ações
- Adicionar `describe` block em spec existente ou criar `e2e/tests/sobre.spec.ts`
- **Não** usar `test.use({ storageState })` — é página pública

### 2. Nova rota autenticada (ex: `/ranking`)
- Criar `e2e/pages/RankingPage.ts`
- Criar `e2e/tests/ranking.spec.ts` com `test.use({ storageState: 'e2e/.auth/user.json' })` no topo
- Testar: carrega, elementos principais visíveis, rota protegida redireciona sem auth

### 3. Nova feature em rota existente (ex: novo widget no dashboard)
- Adicionar locator no `DashboardPage.ts` existente
- Adicionar `test` no `dashboard.spec.ts` existente

## Convenção de Page Objects

- **Sem assertions** dentro do Page Object — apenas ações e getters de locators
- Métodos nomeados como ações do usuário: `login()`, `salvarPerfil()`, `iniciarSimulado()`
- Um arquivo por rota/página

## Timeouts

- Padrão: 30s
- Testes com Groq (simulados): usar `test.setTimeout(60_000)` no início do teste
- Aguardar Supabase carregar dados: `page.waitForTimeout(2_000)` ou `waitForSelector`

## Estrutura de arquivos

```
e2e/
  .auth/user.json     ← cookie de sessão (gitignored)
  fixtures/
    auth.setup.ts     ← login único, roda antes de todos os testes
  pages/              ← Page Objects (seletores + ações, sem assertions)
  tests/              ← Specs (assertions)
```

## GitHub Secrets necessários

Para o CI funcionar, adicione em Settings → Secrets and variables → Actions:
- `TEST_USER_EMAIL` — e-mail do usuário de teste
- `TEST_USER_PASSWORD` — senha do usuário de teste
