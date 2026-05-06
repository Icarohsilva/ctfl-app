import { Page, Locator } from '@playwright/test';

export class TopicoPage {
  readonly page: Page;
  readonly conteudo: Locator;
  readonly btnSimulado: Locator;
  readonly linkVoltar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.conteudo = page.locator('main');
    this.btnSimulado = page.getByRole('button', { name: /Ir pro simulado|simulado/i }).first();
    // O link voltar no tópico é "← Cap. N" (ex.: "← Cap. 1")
    this.linkVoltar = page.getByRole('link', { name: /← Cap\.|Capítulo/i }).first();
  }

  async goto(capitulo: number, topicoId: string) {
    await this.page.goto(`/capitulo/${capitulo}/topico/${topicoId}`);
  }
}
