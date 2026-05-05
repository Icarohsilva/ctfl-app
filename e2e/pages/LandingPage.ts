import { Page, Locator } from '@playwright/test';

export class LandingPage {
  readonly page: Page;
  readonly logo: Locator;
  readonly headingPrincipal: Locator;
  readonly btnComecarGratis: Locator;
  readonly linkEntrar: Locator;
  readonly secaoSobre: Locator;
  readonly linkLinkedIn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.getByText('TestPath').first();
    this.headingPrincipal = page.getByRole('heading', { level: 1 });
    this.btnComecarGratis = page.getByRole('link', { name: /Começar grátis/i }).first();
    this.linkEntrar = page.getByRole('link', { name: /^Entrar$/i }).first();
    this.secaoSobre = page.getByText('Feito por um QA de verdade');
    this.linkLinkedIn = page.getByRole('link', { name: /LinkedIn/i });
  }

  async goto() {
    await this.page.goto('/');
  }
}
