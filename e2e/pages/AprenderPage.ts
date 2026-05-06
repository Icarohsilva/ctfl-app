import { Page, Locator } from '@playwright/test';

export class AprenderPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly linkVoltar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading').first();
    this.linkVoltar = page.getByRole('link', { name: /← Voltar|Dashboard/i }).first();
  }

  async goto() {
    await this.page.goto('/inicio/ctfl');
  }
}
