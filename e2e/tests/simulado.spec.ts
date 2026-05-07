import { test, expect } from '@playwright/test';
import { SimuladoPage } from '../pages/SimuladoPage';

test.use({ storageState: 'e2e/.auth/user.json' });

test.describe('Simulado por tópico', () => {
  test('página do tópico carrega botão de simulado', async ({ page }) => {
    const sp = new SimuladoPage(page);
    await sp.goto(1, 'por-que-testar');
    await sp.iniciarSimulado();
    // Após clicar em "Ir pro simulado", a app entra na etapa "carregando" com
    // msgCarregando = "Preparando simulado..." e depois exibe as questões.
    const iniciou = page.getByText(/Preparando simulado|Questão/i);
    await expect(iniciou).toBeVisible({ timeout: 5_000 });
  });

  test('questões do Groq carregam dentro de 50s', async ({ page }) => {
    test.setTimeout(60_000);
    const sp = new SimuladoPage(page);
    await sp.goto(1, '7-principios');
    await sp.iniciarSimulado();
    // Espera qualquer botão com texto longo — as opções de resposta ou o botão "Confirmar resposta"
    const algumBotao = page.locator('button').filter({ hasText: /.{10,}/ });
    await expect(algumBotao.first()).toBeVisible({ timeout: 50_000 });
  });

  test('selecionar opção não trava a tela', async ({ page }) => {
    test.setTimeout(60_000);
    const sp = new SimuladoPage(page);
    await sp.goto(1, 'erro-defeito-falha');
    await sp.iniciarSimulado();
    await sp.responderPrimeiraOpcao();
    // Após selecionar uma opção, o botão "Confirmar resposta" deve ficar habilitado
    // e a tela (main) deve permanecer visível — sem crash ou redirect inesperado
    await expect(page.locator('main')).toBeVisible();
  });
});
