import { test, expect } from '@playwright/test';
import { CursosPage } from '../pages/CursosPage';

test.use({ storageState: 'e2e/.auth/user.json' });

test.describe('Hub de Cursos (/cursos)', () => {
  test('página carrega com saudação ao usuário', async ({ page }) => {
    const cp = new CursosPage(page);
    await cp.goto();
    await expect(cp.saudacao).toBeVisible({ timeout: 15_000 });
  });

  test('card CTFL visível', async ({ page }) => {
    const cp = new CursosPage(page);
    await cp.goto();
    await expect(cp.cardCTFL).toBeVisible({ timeout: 15_000 });
  });

  test('card Playwright visível', async ({ page }) => {
    const cp = new CursosPage(page);
    await cp.goto();
    await expect(cp.cardPlaywright).toBeVisible({ timeout: 15_000 });
  });

  test('rota protegida — /cursos exige autenticação', async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();
    await page.goto('https://testpath.online/cursos');
    await expect(page).toHaveURL(/\/login|\/cursos/, { timeout: 15_000 });
    await context.close();
  });

  test('clicar no card CTFL navega para /dashboard', async ({ page }) => {
    const cp = new CursosPage(page);
    await cp.goto();
    await cp.cardCTFL.click();
    await expect(page).toHaveURL(/\/dashboard|\/inicio\/ctfl/, { timeout: 15_000 });
  });
});
