import { Page, Locator } from '@playwright/test';

export class EsqueciSenhaPage {
  readonly page: Page;
  readonly inputEmail: Locator;
  readonly btnEnviar: Locator;
  // After submission: heading "E-mail enviado!" and text with "Verifique"
  readonly msgConfirmacao: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputEmail = page.getByPlaceholder('seu@email.com');
    // Button text: "Enviar link de redefinição →"
    this.btnEnviar = page.getByRole('button', { name: /Enviar/i });
    // Success state shows heading "E-mail enviado!" — use heading role for strict match
    this.msgConfirmacao = page.getByRole('heading', { name: /E-mail enviado/i });
  }

  async goto() {
    await this.page.goto('/esqueci-senha');
  }

  async solicitarRedefinicao(email: string) {
    await this.inputEmail.fill(email);
    await this.btnEnviar.click();
  }
}
