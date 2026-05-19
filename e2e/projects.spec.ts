import { test, expect } from '@playwright/test';

test.describe('CMS - Ciclo de Vida de Projetos', () => {
  test.beforeEach(async ({ page }) => {
    // Injetar consentimento de cookies ANTES da navegação
    await page.addInitScript(() => {
      window.localStorage.setItem('cookie-consent', 'accepted');
    });

    // Login antes de cada teste
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@atravessamentos.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin', { timeout: 20000 });
  });

  test('deve gerenciar o ciclo de vida de um projeto', async ({ page }) => {
    test.setTimeout(60000);
    const projectTitle = `[E2E] Projeto E2E ${Date.now()}`;
    
    await test.step('Criar projeto como rascunho', async () => {
      // Ir para aba de projetos
      await page.click('aside button:has-text("Projetos")');
      await page.click('button:has-text("Novo projeto")');
      
      await page.fill('#proj-title', projectTitle);
      await page.fill('#proj-excerpt', 'Este é o resumo do projeto para o teste E2E.');
      await page.fill('#proj-year', '2025');
      
      // Escrever no editor RichText
      await page.locator('.ProseMirror').fill('Esta é a descrição detalhada do projeto de teste.');
      
      // Garantir que está como rascunho
      await page.click('button[aria-label="Status Rascunho"]');
      
      await page.click('button:has-text("Criar projeto")');
      
      // Aguardar fechamento
      await expect(page.locator('#project-form')).not.toBeVisible();
      
      // Verificar na tabela do admin
      const projectRow = page.locator('tr', { hasText: projectTitle });
      await expect(projectRow).toContainText('Rascunho');
    });

    await test.step('Verificar que rascunho NÃO aparece na Home', async () => {
      await page.goto('/');
      // O título não deve estar presente no container de projetos
      const projectsSection = page.locator('#projetos');
      await expect(projectsSection).not.toContainText(projectTitle);
    });

    await test.step('Publicar o projeto e verificar na Home', async () => {
      await page.goto('/admin');
      await page.click('aside button:has-text("Projetos")');
      
      const projectRow = page.locator('tr', { hasText: projectTitle });
      await projectRow.getByLabel('Editar projeto').click();
      
      await page.click('button[aria-label="Status Publicado"]');
      await page.click('button:has-text("Salvar alterações")');
      
      await expect(page.locator('#project-form')).not.toBeVisible();
      
      // Delay para revalidação de cache
      await page.waitForTimeout(1000);
      
      // Ir para a Home
      await page.goto('/');
      const projectsSection = page.locator('#projetos');
      await expect(projectsSection).toContainText(projectTitle);
    });

    await test.step('Excluir o projeto', async () => {
      await page.goto('/admin');
      await page.click('aside button:has-text("Projetos")');
      
      const projectRow = page.locator('tr', { hasText: projectTitle });
      await projectRow.getByLabel('Excluir projeto').click();
      
      await page.click('button:has-text("Excluir")');
      await expect(page.locator('text=Confirmar Exclusão')).not.toBeVisible();
      await expect(page.locator('table')).not.toContainText(projectTitle);
    });
  });
});
