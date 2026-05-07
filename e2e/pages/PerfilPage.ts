import { Page, Locator } from '@playwright/test';

export class PerfilPage {
  readonly page: Page;
  readonly inputNome: Locator;
  readonly btnSalvar: Locator;
  readonly msgSucesso: Locator;

  constructor(page: Page) {
    this.page = page;
    // Placeholder real no input: "Seu nome completo"
    this.inputNome = page.getByPlaceholder(/nome/i).first();
    // Botão na aba "Meu Perfil"
    this.btnSalvar = page.getByRole('button', { name: /Salvar alterações/i });
    // Mensagem exibida após salvar com sucesso (linha 156 em perfil/page.tsx)
    this.msgSucesso = page.getByText(/Perfil atualizado com sucesso/i);
  }

  async goto() {
    await this.page.goto('/perfil');
  }

  async atualizarNome(nome: string) {
    await this.inputNome.clear();
    await this.inputNome.fill(nome);
    await this.btnSalvar.click();
  }
}
