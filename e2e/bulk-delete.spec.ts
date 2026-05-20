import { test, expect } from '@playwright/test';

test.describe('CMS - Exclusão em Massa', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('cookie-consent', 'accepted');
    });

    await page.goto('/login');
    await page.fill('#login-email', 'test@atravessamentos.com');
    await page.fill('#login-password', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin');
  });

  test('deve excluir membros em massa com confirmação de segurança', async ({ page }) => {
    test.setTimeout(90000);
    const timestamp = Date.now();
    const memberNames = [
      `[E2E-BULK] Membro A ${timestamp}`,
      `[E2E-BULK] Membro B ${timestamp}`,
    ];

    await test.step('Criar membros de teste', async () => {
      await page.click('aside button:has-text("Membros")');

      for (const name of memberNames) {
        await page.click('button:has-text("Novo membro")');
        await page.fill('#mem-name', name);
        await page.fill('#mem-role', 'Testador Bulk');
        await page.locator('.ProseMirror').fill('Bio de teste para exclusão em massa.');
        await page.click('button:has-text("Adicionar membro")');

        // Aguardar o modal fechar
        await expect(page.locator('text=Adicione alguém ao coletivo')).not.toBeVisible();
        await page.waitForTimeout(500);
      }

      // Verificar que os membros foram criados
      for (const name of memberNames) {
        await expect(page.locator('table')).toContainText(name);
      }
    });

    await test.step('Selecionar membros e excluir em massa', async () => {
      // Selecionar os dois membros recém-criados
      for (const name of memberNames) {
        const row = page.locator('tr').filter({ hasText: name }).first();
        await row.getByRole('checkbox').check();
      }

      // Verificar que a contagem de seleção apareceu
      await expect(page.locator('text=2 selecionado(s)')).toBeVisible();

      // Clicar em "Excluir em massa"
      await page.click('button:has-text("Excluir em massa")');

      // O diálogo de confirmação deve aparecer
      await expect(page.locator('text=Confirmar exclusão em massa')).toBeVisible();
      await expect(page.locator('text=2 membros')).toBeVisible();

      // Tentar confirmar sem digitar a palavra-chave
      const confirmButton = page.locator('button:has-text("Excluir permanentemente")');
      await expect(confirmButton).toBeDisabled();

      // Digitar a palavra de segurança
      await page.fill('#confirmText', 'EXCLUIR');

      // O botão deve estar habilitado agora
      await expect(confirmButton).toBeEnabled();
      await confirmButton.click();

      // Verificar que os membros foram removidos da tabela
      for (const name of memberNames) {
        await expect(page.locator('table')).not.toContainText(name);
      }
    });
  });
});
