import { Page, Locator } from '@playwright/test';

export class PlaywrightDashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly cardContinuar: Locator;
  readonly listaModulos: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading').first();
    this.cardContinuar = page.getByText(/CONTINUAR|Continuar/i).first();
    this.listaModulos = page.getByText(/Base para Testers|Módulo 0/i).first();
  }

  async goto() {
    await this.page.goto('/playwright');
  }
}
