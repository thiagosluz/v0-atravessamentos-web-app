import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Acessibilidade Automatizada (WCAG)', () => {
  
  test.beforeEach(async ({ page }) => {
    // Injetar consentimento de cookies para evitar obstrução da UI nos testes
    await page.addInitScript(() => {
      window.localStorage.setItem('cookie-consent', 'accepted');
    });
  });

  test('deve passar na auditoria de acessibilidade da Home', async ({ page }) => {
    await page.goto('/');
    
    // Aguarda animações iniciais
    await page.waitForTimeout(1000);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('deve passar na auditoria de acessibilidade do Diário', async ({ page }) => {
    await page.goto('/diario');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('deve passar na auditoria de acessibilidade do Painel Admin', async ({ page }) => {
    // Login necessário para acessar o Admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@atravessamentos.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      // Ignorar animações de gráficos que podem causar falsos positivos em scans instantâneos
      .exclude('.recharts-wrapper')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
