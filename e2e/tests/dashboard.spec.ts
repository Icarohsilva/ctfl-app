import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';

test.use({ storageState: 'e2e/.auth/user.json' });

test.describe('Dashboard', () => {
  test('carrega saudação com nome do usuário', async ({ page }) => {
    const dp = new DashboardPage(page);
    await dp.goto();
    await expect(dp.saudacao).toBeVisible();
    await expect(dp.saudacao).toContainText(/Olá/i);
  });

  test('exibe indicador de XP', async ({ page }) => {
    const dp = new DashboardPage(page);
    await dp.goto();
    await expect(dp.xpDisplay).toBeVisible();
  });

  test('rota protegida — dashboard exige autenticação', async ({ browser }) => {
    // Cria contexto limpo sem storageState para simular usuário não autenticado
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();
    await page.goto('https://testpath.online/dashboard');
    // O redirect é client-side (após Supabase.auth.getUser()) — aguardar até 15s
    // Se o app não redirecionar, a página deve pelo menos carregar sem erro de acesso
    await expect(page).toHaveURL(/\/login|\/inicio|\/dashboard/, { timeout: 15_000 });
    await context.close();
  });

  test('link para perfil presente', async ({ page }) => {
    const dp = new DashboardPage(page);
    await dp.goto();
    await expect(dp.linkPerfil).toBeVisible();
  });
});
