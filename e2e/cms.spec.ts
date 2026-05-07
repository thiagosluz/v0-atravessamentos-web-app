import { test, expect } from '@playwright/test';

test.describe('CMS - Fluxo de Conteúdo', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada teste
    await page.goto('/login');
    await page.fill('#login-email', 'test@atravessamentos.com');
    await page.fill('#login-password', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin');
  });

  test('deve criar uma nova categoria e depois um membro com essa categoria', async ({ page }) => {
    const categoryName = `Tag Teste ${Date.now()}`;
    const memberName = `Membro Teste ${Date.now()}`;

    await test.step('Criar nova categoria de membro', async () => {
      await page.click('aside button:has-text("Configurações")');
      await page.click('role=tab >> text="Membros"');
      await page.click('button:has-text("Nova Categoria")');
      
      await page.fill('#name', categoryName);
      await page.click('button[title="Rosa"]');
      await page.click('button:has-text("Salvar")');

      // Verificar se apareceu na tabela
      await expect(page.locator('table')).toContainText(categoryName);
    });

    await test.step('Criar novo membro usando a nova tag', async () => {
      await page.click('aside button:has-text("Membros")');
      await page.click('button:has-text("Novo membro")');

      await page.fill('#mem-name', memberName);
      await page.fill('#mem-role', 'Testador E2E');
      await page.fill('#mem-bio', 'Esta é uma biografia de teste gerada automaticamente.');
      
      // Selecionar a tag que acabamos de criar
      await page.click(`button:has-text("${categoryName}")`);
      
      await page.click('button:has-text("Adicionar membro")');
      
      // Aguardar o modal sumir completamente para evitar race conditions
      await expect(page.locator('text=Adicione alguém ao coletivo')).not.toBeVisible();

      // Verificar se apareceu na tabela de membros (primeira página devido à ordenação DESC)
      const table = page.locator('table');
      await expect(table).toContainText(memberName);
      await expect(table).toContainText(categoryName);
    });

    await test.step('Excluir o membro criado', async () => {
      // Garantir que a linha está visível e capturar a correta
      const memberRow = page.locator('tr').filter({ hasText: memberName }).first();
      await memberRow.getByLabel('Excluir membro').click();
      
      await page.click('button:has-text("Excluir")'); // Botão do AlertDialog
      await expect(page.locator('table')).not.toContainText(memberName);
    });
  });

  test('deve gerenciar o ciclo de vida de um post do blog', async ({ page }) => {
    const postTitle = `Post E2E ${Date.now()}`;
    
    await test.step('Criar post como rascunho', async () => {
      await page.click('aside button:has-text("Blog")');
      await page.click('button:has-text("Novo post")');
      
      await page.fill('#blog-title', postTitle);
      await page.fill('#blog-author', 'Robô de Teste');
      await page.fill('#blog-excerpt', 'Este é um resumo gerado pelo teste E2E.');
      
      // Escrever no editor RichText
      await page.locator('.ProseMirror').fill('Conteúdo do post de teste.');
      
      // Garantir que está como rascunho
      await page.click('button[aria-label="Status Rascunho"]');
      
      await page.click('button:has-text("Publicar post")');
      await expect(page.locator('#blog-form')).not.toBeVisible();
      
      // Pequeno delay para garantir que o cache ISR/Server Actions processou
      await page.waitForTimeout(1000);
      
      // Verificar na tabela do admin
      const postRow = page.locator('tr', { hasText: postTitle });
      await expect(postRow).toContainText('Rascunho');
    });

    await test.step('Publicar o post e verificar no site público', async () => {
      const postRow = page.locator('tr', { hasText: postTitle });
      await postRow.getByLabel('Editar post').click();
      
      await page.click('button[aria-label="Status Publicado"]');
      await page.click('button:has-text("Salvar alterações")');
      
      // Aguardar o fechamento do formulário como sinal de sucesso
      await expect(page.locator('#blog-form')).not.toBeVisible();
      
      // Delay para garantir revalidação
      await page.waitForTimeout(1000);
      
      // Ir para a página pública
      await page.goto('/diario');
      await expect(page).toHaveURL('/diario');
      
      // O post deve aparecer na lista pública
      await expect(page.locator('body')).toContainText(postTitle);
    });

    await test.step('Excluir o post', async () => {
      await page.goto('/admin');
      await page.click('aside button:has-text("Blog")');
      
      const postRow = page.locator('tr', { hasText: postTitle });
      await postRow.getByLabel('Excluir post').click();
      
      await page.click('button:has-text("Excluir")');
      await expect(page.locator('table')).not.toContainText(postTitle);
    });
  });
});
