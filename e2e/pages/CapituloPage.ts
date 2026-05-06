import { Page, Locator } from '@playwright/test';

export class CapituloPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly primeroTopico: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading').first();
    // O primeiro tópico do cap. 1 se chama "Por que testar?" e usa onClick (div), não <a>
    this.primeroTopico = page.getByText(/Por que testar/i).first();
  }

  async goto(capitulo: number) {
    await this.page.goto(`/capitulo/${capitulo}`);
  }
}
