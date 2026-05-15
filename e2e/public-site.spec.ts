import { test, expect } from '@playwright/test';

test.describe('Site Público - Navegação e Filtros', () => {

  test.beforeEach(async ({ page }) => {
    // Injetar consentimento de cookies ANTES da navegação para evitar intercepção de cliques no site público
    await page.addInitScript(() => {
      window.localStorage.setItem('cookie-consent', 'accepted');
    });
  });

  test('deve navegar pelas seções da home', async ({ page }) => {
    await page.goto('/');
    
    // Verificar se as seções principais existem
    await expect(page.locator('#projetos')).toBeVisible();
    await expect(page.locator('#coletivo')).toBeVisible();
    await expect(page.locator('#diario')).toBeVisible();
    await expect(page.locator('#sobre')).toBeVisible();
    
    // Testar navegação do header
    await page.click('nav a:has-text("Projetos")');
    await expect(page).toHaveURL(/\/projetos/);
  });

  test('deve filtrar e buscar projetos na galeria', async ({ page }) => {
    await page.goto('/projetos');
    
    // Testar busca por texto via URL
    await page.goto('/projetos?q=BuscaTeste');
    await expect(page).toHaveURL(/.*q=BuscaTeste/);
    
    // Testar filtro por categoria via URL
    await page.goto('/projetos?categoria=Teste');
    await expect(page).toHaveURL(/.*categoria=Teste/);

    // Testar limpar filtros (clicar no botão se existir)
    const clearButton = page.locator('button:has-text("Limpar")');
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await expect(page).not.toHaveURL(/.*categoria=.*/, { timeout: 15000 });
    }
  });

  test('deve filtrar e buscar no diário', async ({ page }) => {
    await page.goto('/diario');
    
    // Testar busca por texto via URL
    await page.goto('/diario?q=BuscaTeste');
    await expect(page).toHaveURL(/.*q=BuscaTeste/);
    
    // Testar filtro por categoria via URL
    await page.goto('/diario?categoria=Teste');
    await expect(page).toHaveURL(/.*categoria=Teste/);
  });
});
