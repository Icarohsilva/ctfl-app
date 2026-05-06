import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CadastroPage } from '../pages/CadastroPage';
import { EsqueciSenhaPage } from '../pages/EsqueciSenhaPage';

test.describe('Autenticação', () => {
  test.describe('Login', () => {
    test('credenciais erradas exibem mensagem de erro', async ({ page }) => {
      const lp = new LoginPage(page);
      await lp.goto();
      await lp.login('naoexiste@testpath.online', 'senhaerrada123');
      await expect(lp.msgErro).toBeVisible({ timeout: 10_000 });
    });

    test('login com credenciais corretas redireciona para dashboard', async ({ page }) => {
      const lp = new LoginPage(page);
      await lp.goto();
      await lp.login(
        process.env.TEST_USER_EMAIL!,
        process.env.TEST_USER_PASSWORD!
      );
      await page.waitForURL('**/dashboard', { timeout: 15_000 });
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test('link "Esqueci a senha" navega para /esqueci-senha', async ({ page }) => {
      const lp = new LoginPage(page);
      await lp.goto();
      await lp.linkEsqueci.click();
      await expect(page).toHaveURL(/\/esqueci-senha/);
    });

    test('link "Criar conta grátis" navega para /cadastro', async ({ page }) => {
      const lp = new LoginPage(page);
      await lp.goto();
      await lp.linkCadastro.click();
      await expect(page).toHaveURL(/\/cadastro/);
    });
  });

  test.describe('Cadastro', () => {
    test('página carrega com campos de nome, e-mail e senha', async ({ page }) => {
      const cp = new CadastroPage(page);
      await cp.goto();
      await expect(cp.inputNome).toBeVisible();
      await expect(cp.inputEmail).toBeVisible();
      await expect(cp.inputSenha).toBeVisible();
    });

    test('botão Continuar visível no passo 1', async ({ page }) => {
      // NOTE: The "Continuar →" button on passo 1 is NOT HTML-disabled — it relies on
      // JS validation when clicked. On passo 2 the button is disabled when no nivel
      // is selected. This test verifies the button is present and enabled on passo 1.
      const cp = new CadastroPage(page);
      await cp.goto();
      await expect(cp.btnContinuar).toBeVisible();
      await expect(cp.btnContinuar).toBeEnabled();
    });
  });

  test.describe('Esqueci a senha', () => {
    test('página carrega com input de e-mail', async ({ page }) => {
      const ep = new EsqueciSenhaPage(page);
      await ep.goto();
      await expect(ep.inputEmail).toBeVisible();
      await expect(ep.btnEnviar).toBeVisible();
    });

    test('submeter e-mail válido exibe confirmação', async ({ page }) => {
      const ep = new EsqueciSenhaPage(page);
      await ep.goto();
      await ep.solicitarRedefinicao('qualquer@email.com');
      await expect(ep.msgConfirmacao).toBeVisible({ timeout: 10_000 });
    });
  });
});
