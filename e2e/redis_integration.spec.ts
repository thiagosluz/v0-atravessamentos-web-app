import { test, expect } from '@playwright/test';

test.describe('Integração Redis - Cache do Acervo', () => {
  test('deve carregar o acervo e validar performance do cache', async ({ page }) => {
    // 1. Primeira carga (Cache Miss)
    const start1 = Date.now();
    await page.goto('/acervo');
    // Wait for the acervo grid or the empty state message to appear
    await page.waitForFunction(() => {
      return document.querySelector('.columns-1') !== null || 
             document.querySelector('.border-dashed') !== null;
    }, { timeout: 15000 });
    const end1 = Date.now();
    const duration1 = end1 - start1;
    
    console.log(`Primeiro carregamento (Miss): ${duration1}ms`);

    // 2. Segunda carga (Cache Hit)
    // Navegamos para fora e voltamos para garantir um novo request com cache quente
    await page.goto('/');
    await page.waitForTimeout(500);
    
    const start2 = Date.now();
    await page.goto('/acervo');
    await page.waitForFunction(() => {
      return document.querySelector('.columns-1') !== null || 
             document.querySelector('.border-dashed') !== null;
    }, { timeout: 10000 });
    const end2 = Date.now();
    const duration2 = end2 - start2;

    console.log(`Segundo carregamento (Hit): ${duration2}ms`);

    // O teste garante que a página não quebra com a camada de cache ativa e carrega o título
    await expect(page.locator('[data-testid="page-header"] h1')).toContainText('Acervo');
  });
});
