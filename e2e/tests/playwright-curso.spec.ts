import { test, expect } from '@playwright/test';
import { PlaywrightDashboardPage } from '../pages/PlaywrightDashboardPage';
import { PlaywrightModuloPage } from '../pages/PlaywrightModuloPage';

test.use({ storageState: 'e2e/.auth/user.json' });

test.describe('Curso Playwright', () => {
  test.describe('Dashboard (/playwright)', () => {
    test('página carrega sem erro', async ({ page }) => {
      const dp = new PlaywrightDashboardPage(page);
      await dp.goto();
      await expect(dp.heading).toBeVisible({ timeout: 15_000 });
    });

    test('card CONTINUAR visível', async ({ page }) => {
      const dp = new PlaywrightDashboardPage(page);
      await dp.goto();
      await expect(dp.cardContinuar).toBeVisible({ timeout: 15_000 });
    });

    test('lista de módulos exibe Módulo 0', async ({ page }) => {
      const dp = new PlaywrightDashboardPage(page);
      await dp.goto();
      await expect(dp.listaModulos).toBeVisible({ timeout: 15_000 });
    });

    test('rota protegida — /playwright exige autenticação', async ({ browser }) => {
      const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
      const page = await context.newPage();
      await page.goto('https://testpath.online/playwright');
      await expect(page).toHaveURL(/\/login|\/playwright/, { timeout: 15_000 });
      await context.close();
    });
  });

  test.describe('Visão do Módulo (/playwright/modulo/0)', () => {
    test('módulo 0 carrega com heading', async ({ page }) => {
      const mp = new PlaywrightModuloPage(page);
      await mp.goto(0);
      await expect(mp.heading).toBeVisible({ timeout: 15_000 });
    });

    test('primeiro lab do módulo 0 visível', async ({ page }) => {
      const mp = new PlaywrightModuloPage(page);
      await mp.goto(0);
      await expect(mp.primeiroLab).toBeVisible({ timeout: 15_000 });
    });

    test('módulo inválido retorna 404', async ({ page }) => {
      await page.goto('/playwright/modulo/99');
      await expect(page.getByText(/404|não encontrad/i).first()).toBeVisible({ timeout: 10_000 });
    });
  });

  test.describe('Lab individual (/playwright/modulo/0/lab/o-que-e-node)', () => {
    test('lab carrega com 4 passos', async ({ page }) => {
      await page.goto('/playwright/modulo/0/lab/o-que-e-node');
      await expect(page.getByText(/Conceito|Node\.js/i).first()).toBeVisible({ timeout: 15_000 });
    });

    test('passo 1 (conceito) exibe conteúdo', async ({ page }) => {
      await page.goto('/playwright/modulo/0/lab/o-que-e-node');
      await expect(page.getByText(/📖|Conceito/i).first()).toBeVisible({ timeout: 15_000 });
    });

    test('botão Próximo passo avança para passo 2', async ({ page }) => {
      await page.goto('/playwright/modulo/0/lab/o-que-e-node');
      await page.getByRole('button', { name: /Próximo passo/i }).click();
      await expect(page.getByText(/💻|Código/i).first()).toBeVisible({ timeout: 10_000 });
    });

    test('lab inválido retorna 404', async ({ page }) => {
      await page.goto('/playwright/modulo/0/lab/lab-inexistente');
      await expect(page.getByText(/404|não encontrad/i).first()).toBeVisible({ timeout: 10_000 });
    });
  });

  test.describe('Onboarding Playwright (/inicio/playwright)', () => {
    test('página carrega com opções de nível', async ({ page }) => {
      await page.goto('/inicio/playwright');
      await expect(page.getByText(/programei|programo|básico/i).first()).toBeVisible({ timeout: 15_000 });
    });
  });
});
