import { Page, Locator } from '@playwright/test';

export class SimuladoPage {
  readonly page: Page;
  readonly btnIniciar: Locator;
  readonly msgCarregando: Locator;
  readonly opcoes: Locator;
  readonly btnConfirmar: Locator;
  readonly btnProxima: Locator;

  constructor(page: Page) {
    this.page = page;
    // Botões na etapa "video" — um primário e um secundário que avançam pro simulado
    this.btnIniciar = page.getByRole('button', { name: /Ir pro simulado|Pular vídeo/i }).first();
    // Mensagem exibida enquanto o Groq gera questões (etapa "carregando" com msg "Preparando simulado...")
    this.msgCarregando = page.getByText(/Preparando simulado/i);
    // Opções de resposta: botões com texto longo (as opções não têm prefixo a)/b))
    this.opcoes = page.locator('button').filter({ hasText: /.{10,}/ });
    // Botão para confirmar a resposta selecionada
    this.btnConfirmar = page.getByRole('button', { name: /Confirmar resposta/i });
    // Botão para avançar para a próxima questão
    this.btnProxima = page.getByRole('button', { name: /Próxima →|Ver resultado/i });
  }

  async goto(capitulo: number, topicoId: string) {
    await this.page.goto(`/capitulo/${capitulo}/topico/${topicoId}`);
  }

  async iniciarSimulado() {
    // Fluxo: narrativa → cards (vários) → video → simulado
    // Botão na etapa narrativa: "Entendi! Ver os conceitos →"
    // Botão nos cards: "Próximo →" / "Ver o vídeo! 🎬"
    // Botão no vídeo: "Ir pro simulado! 🎯" ou "Pular vídeo"

    for (let i = 0; i < 15; i++) {
      // Já chegamos na etapa de vídeo?
      if (await this.btnIniciar.isVisible({ timeout: 500 }).catch(() => false)) break;

      // Tenta clicar em qualquer botão de avanço disponível e habilitado
      // Usa seletor CSS para pegar botões que não estão desabilitados
      const avancos = [
        'button:not([disabled]):has-text("Entendi")',
        'button:not([disabled]):has-text("Próximo")',
        'button:not([disabled]):has-text("Ver o vídeo")',
        'button:not([disabled]):has-text("Avançar")',
      ];

      let clicou = false;
      for (const seletor of avancos) {
        const btn = this.page.locator(seletor).first();
        if (await btn.isVisible({ timeout: 300 }).catch(() => false)) {
          await btn.scrollIntoViewIfNeeded();
          await btn.click();
          await this.page.waitForTimeout(600);
          clicou = true;
          break;
        }
      }

      if (!clicou) {
        // Aguarda um pouco caso a página ainda esteja carregando conteúdo
        await this.page.waitForTimeout(1000);
      }
    }

    await this.btnIniciar.scrollIntoViewIfNeeded();
    await this.btnIniciar.click();
  }

  async responderPrimeiraOpcao() {
    // Aguarda o Groq gerar as questões (pode demorar até 50s)
    await this.page.waitForFunction(
      () => document.querySelectorAll('button').length > 3,
      { timeout: 50_000 }
    );
    // As opções são botões com texto longo (não têm prefixo a)/b))
    const opcoes = this.page.locator('button').filter({ hasText: /.{10,}/ });
    const count = await opcoes.count();
    if (count > 0) await opcoes.first().click();
  }
}
