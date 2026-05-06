import { Page, Locator } from '@playwright/test';

export class CadastroPage {
  readonly page: Page;
  readonly inputNome: Locator;
  readonly inputEmail: Locator;
  readonly inputSenha: Locator;
  // Passo 1 shows "Continuar →", passo 2 shows "Criar minha conta →"
  readonly btnContinuar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputNome = page.getByPlaceholder('Ex: João Silva');
    this.inputEmail = page.getByPlaceholder('seu@email.com');
    this.inputSenha = page.getByPlaceholder('Mínimo 8 caracteres');
    // On passo 1 the button reads "Continuar →"; on passo 2 "Criar minha conta →"
    this.btnContinuar = page.getByRole('button', { name: /Continuar|Criar minha conta/i });
  }

  async goto() {
    await this.page.goto('/cadastro');
  }
}
