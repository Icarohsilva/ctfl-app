import { test, expect } from '@playwright/test';
import { AprenderPage } from '../pages/AprenderPage';
import { CapituloPage } from '../pages/CapituloPage';
import { TopicoPage } from '../pages/TopicoPage';

test.use({ storageState: 'e2e/.auth/user.json' });

test.describe('Trilha de aprendizado', () => {
  test('/inicio/ctfl carrega sem erro', async ({ page }) => {
    const ap = new AprenderPage(page);
    await ap.goto();
    await expect(ap.heading).toBeVisible();
  });

  test('/capitulo/1 carrega lista de tópicos', async ({ page }) => {
    const cp = new CapituloPage(page);
    await cp.goto(1);
    await expect(cp.heading).toBeVisible();
    await expect(cp.primeroTopico).toBeVisible();
  });

  test('clicar em tópico navega para a rota correta', async ({ page }) => {
    const cp = new CapituloPage(page);
    await cp.goto(1);
    await cp.primeroTopico.click();
    await expect(page).toHaveURL(/\/capitulo\/1\/topico\//);
  });

  test('página do tópico carrega conteúdo', async ({ page }) => {
    const tp = new TopicoPage(page);
    await tp.goto(1, 'por-que-testar');
    await expect(tp.conteudo).toBeVisible();
    await expect(page.getByText(/Por que testar|testar software/i).first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test('link voltar visível na página do tópico', async ({ page }) => {
    const tp = new TopicoPage(page);
    await tp.goto(1, 'por-que-testar');
    await expect(tp.linkVoltar).toBeVisible();
  });
});
