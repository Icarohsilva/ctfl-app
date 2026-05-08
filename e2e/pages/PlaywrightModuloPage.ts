import { Page, Locator } from '@playwright/test';

export class PlaywrightModuloPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly primeiroLab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading').first();
    this.primeiroLab = page.getByText(/O que é Node|node/i).first();
  }

  async goto(modulo: number) {
    await this.page.goto(`/playwright/modulo/${modulo}`);
  }
}
