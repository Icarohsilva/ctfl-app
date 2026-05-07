import { test, expect } from '@playwright/test';
import { SimuladoFinalPage } from '../pages/SimuladoFinalPage';

test.use({ storageState: 'e2e/.auth/user.json' });

test.describe('Simulado Final', () => {
  test('página carrega tela de introdução', async ({ page }) => {
    const sfp = new SimuladoFinalPage(page);
    await sfp.goto();
    await expect(sfp.headingIntro).toBeVisible();
  });

  test('link ← Dashboard visível', async ({ page }) => {
    const sfp = new SimuladoFinalPage(page);
    await sfp.goto();
    await expect(sfp.linkVoltar).toBeVisible();
  });

  test('botão Iniciar simulado visível', async ({ page }) => {
    const sfp = new SimuladoFinalPage(page);
    await sfp.goto();
    await expect(sfp.btnIniciar).toBeVisible();
  });

  test('após iniciar, tela de carregamento aparece e questões carregam', async ({ page }) => {
    // Geração de 40 questões via 6 chamadas sequenciais à Groq pode levar 2-3 minutos
    test.setTimeout(240_000);
    const sfp = new SimuladoFinalPage(page);
    await sfp.goto();
    await sfp.iniciar();
    // Confirma que a tela de carregamento apareceu (estado "carregando")
    await expect(page.getByText(/Gerando/i).first()).toBeVisible({ timeout: 10_000 });
    // Aguarda o estado mudar de "carregando" para "simulado" — texto "Questão X de 40"
    // A geração faz 6 chamadas sequenciais à Groq — pode levar mais de 2 minutos
    await expect(page.getByText(/Questão/i)).toBeVisible({ timeout: 180_000 });
  });
});
