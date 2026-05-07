import { test, expect } from '@playwright/test';
import { PerfilPage } from '../pages/PerfilPage';

test.use({ storageState: 'e2e/.auth/user.json' });

test.describe('Perfil', () => {
  test('página carrega sem erro', async ({ page }) => {
    const pp = new PerfilPage(page);
    await pp.goto();
    await expect(page.locator('main')).toBeVisible();
  });

  test('abas Meu Perfil, Configurações e Segurança visíveis', async ({ page }) => {
    const pp = new PerfilPage(page);
    await pp.goto();
    // Os botões de aba têm emojis + texto: "👤 Meu Perfil", "⚙️ Configurações", "🔒 Segurança"
    await expect(page.getByRole('button', { name: /Meu Perfil/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Configurações/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Segurança/i })).toBeVisible();
  });

  test('salvar perfil exibe mensagem de sucesso abaixo do botão', async ({ page }) => {
    const pp = new PerfilPage(page);
    await pp.goto();
    // Aguarda o perfil carregar (sai do loading state)
    await expect(page.locator('main')).not.toContainText('Carregando perfil...', { timeout: 10_000 });
    await page.waitForTimeout(1_000);
    await pp.btnSalvar.click();
    await expect(pp.msgSucesso).toBeVisible({ timeout: 10_000 });
    const btnY = (await pp.btnSalvar.boundingBox())?.y ?? 0;
    const msgY = (await pp.msgSucesso.boundingBox())?.y ?? 0;
    expect(msgY).toBeGreaterThan(btnY);
  });
});
