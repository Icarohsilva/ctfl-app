import { Page, Locator } from '@playwright/test';

export class CursosPage {
  readonly page: Page;
  readonly saudacao: Locator;
  readonly cardCTFL: Locator;
  readonly cardPlaywright: Locator;

  constructor(page: Page) {
    this.page = page;
    this.saudacao = page.getByText(/Olá|Bem-vindo/i).first();
    this.cardCTFL = page.getByText(/CTFL/i).first();
    this.cardPlaywright = page.getByText(/Playwright/i).first();
  }

  async goto() {
    await this.page.goto('/cursos');
  }
}
