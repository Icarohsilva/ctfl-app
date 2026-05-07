import { Page, Locator } from '@playwright/test';

export class SimuladoFinalPage {
  readonly page: Page;
  readonly btnIniciar: Locator;
  readonly linkVoltar: Locator;
  readonly headingIntro: Locator;

  constructor(page: Page) {
    this.page = page;
    // Botão na tela de intro: "Iniciar simulado →"
    this.btnIniciar = page.getByRole('button', { name: /Iniciar simulado/i });
    // Link "← Dashboard" no topo da tela de intro
    this.linkVoltar = page.getByRole('link', { name: /← Dashboard/i });
    // Heading principal da tela de intro: <h1>Simulado Final CTFL</h1>
    this.headingIntro = page.getByRole('heading').first();
  }

  async goto() {
    await this.page.goto('/simulado-final');
  }

  async iniciar() {
    await this.btnIniciar.click();
  }
}
