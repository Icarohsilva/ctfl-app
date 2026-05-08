import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('autenticar usuário de teste', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('seu@email.com').fill(process.env.TEST_USER_EMAIL!);
  await page.getByPlaceholder('Sua senha').fill(process.env.TEST_USER_PASSWORD!);
  await page.getByRole('button', { name: /Entrar/i }).click();
  await page.waitForURL(/\/(cursos|dashboard)/, { timeout: 15_000 });
  await page.context().storageState({ path: authFile });
});
