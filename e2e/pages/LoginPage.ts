import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly inputEmail: Locator;
  readonly inputSenha: Locator;
  readonly btnEntrar: Locator;
  readonly msgErro: Locator;
  readonly linkCadastro: Locator;
  readonly linkEsqueci: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputEmail = page.getByPlaceholder('seu@email.com');
    this.inputSenha = page.getByPlaceholder('Sua senha');
    this.btnEntrar = page.getByRole('button', { name: /Entrar/i });
    // Actual error message: "E-mail ou senha incorretos."
    this.msgErro = page.getByText(/E-mail ou senha (inválidos|incorretos)\./i);
    this.linkCadastro = page.getByRole('link', { name: /Criar conta grátis/i });
    // Plain <a> link, not a button
    this.linkEsqueci = page.getByRole('link', { name: /Esqueci a senha/i });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, senha: string) {
    await this.inputEmail.fill(email);
    await this.inputSenha.fill(senha);
    await this.btnEntrar.click();
  }
}
