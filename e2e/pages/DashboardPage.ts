import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly saudacao: Locator;
  readonly xpDisplay: Locator;
  readonly linkCapitulo1: Locator;
  readonly btnSair: Locator;
  readonly linkPerfil: Locator;

  constructor(page: Page) {
    this.page = page;
    this.saudacao = page.getByRole('heading', { level: 1 });
    this.xpDisplay = page.getByText(/XP/i).first();
    // O link para capítulo 1 é um <div onClick> no dashboard — usar getByText como fallback
    this.linkCapitulo1 = page.getByText(/Cap\. 1|Fundamentos de Teste/i).first();
    this.btnSair = page.getByRole('button', { name: /Sair/i });
    // O link para o perfil exibe o primeiro nome do usuário, não o texto "Perfil"
    // Usa o href como seletor confiável
    this.linkPerfil = page.locator('a[href="/perfil"]').first();
  }

  async goto() {
    await this.page.goto('/dashboard');
  }
}
