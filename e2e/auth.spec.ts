import { test, expect } from '@playwright/test';

test.describe('Autenticação', () => {
  test('deve mostrar erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('#login-email', 'errado@atravessamentos.com');
    await page.fill('#login-password', 'senha123');
    await page.click('button[type="submit"]');
    
    const error = page.locator('p[role="alert"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('inválidos');
  });

  test('deve redirecionar para o site se clicar em Voltar', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Voltar ao site');
    await expect(page).toHaveURL('/');
  });
});
