import { test, expect } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';

test.describe('Landing Page', () => {
  test('logo TestPath visível', async ({ page }) => {
    const lp = new LandingPage(page);
    await lp.goto();
    await expect(lp.logo).toBeVisible();
  });

  test('heading principal contém "certificações"', async ({ page }) => {
    const lp = new LandingPage(page);
    await lp.goto();
    await expect(lp.headingPrincipal).toContainText(/certificaç/i);
  });

  test('botão Começar grátis navega para /cadastro', async ({ page }) => {
    const lp = new LandingPage(page);
    await lp.goto();
    await lp.btnComecarGratis.click();
    await expect(page).toHaveURL(/\/cadastro/);
  });

  test('link Entrar navega para /login', async ({ page }) => {
    const lp = new LandingPage(page);
    await lp.goto();
    await lp.linkEntrar.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('seção "Feito por um QA de verdade" visível', async ({ page }) => {
    const lp = new LandingPage(page);
    await lp.goto();
    await expect(lp.secaoSobre).toBeVisible();
  });

  test('link do LinkedIn presente e com href correto', async ({ page }) => {
    const lp = new LandingPage(page);
    await lp.goto();
    await expect(lp.linkLinkedIn).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/icarosilvaqa/'
    );
  });
});
