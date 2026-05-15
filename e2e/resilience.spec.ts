import { test, expect } from '@playwright/test';

test.describe('Resiliência e Tratamento de Erros', () => {
  
  test.beforeEach(async ({ page }) => {
    // Injetar consentimento de cookies
    await page.addInitScript(() => {
      window.localStorage.setItem('cookie-consent', 'accepted');
    });
  });

  test('deve mostrar erro quando uma ação de servidor falha (500)', async ({ page }) => {
    // Login e ir para o Admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@atravessamentos.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin');

    // Mudar para a aba de Projetos para ver a tabela
    await page.getByTestId('sidebar-item-projetos').click();
    await expect(page.getByText(/Gerencie publicações/i)).toBeVisible();

    // Interceptar a ação de delete (POST request do Next.js)
    await page.route('**/admin*', async route => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      } else {
        route.continue();
      }
    });

    // Tentar excluir o primeiro projeto da lista (usando o aria-label definido no TableRow)
    const deleteBtn = page.locator('button[aria-label*="Excluir"]').first();
    await deleteBtn.click();
    
    // Aguardar o modal de confirmação aparecer
    const dialog = page.getByRole('alertdialog');
    await expect(dialog).toBeVisible();

    // Confirmar no modal de confirmação customizado do AdminDashboard
    const confirmBtn = dialog.getByRole('button', { name: "Sim, Excluir Item" });
    await confirmBtn.click();

    // Verificar feedback de erro (Toast ou Alert)
    const errorToast = page.getByText(/erro|não foi possível/i);
    await expect(errorToast.first()).toBeVisible({ timeout: 10000 });
  });

  test('deve lidar com timeout de rede na autenticação', async ({ page }) => {
    // Simular atraso de 6 segundos (maior que o timeout de 5s do expect)
    await page.route('**/auth/v1/token*', async route => {
      await new Promise(resolve => setTimeout(resolve, 6000));
      route.continue();
    });

    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@atravessamentos.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Verificar se o botão de loading permanece ou se há timeout amigável
    const submitBtn = page.getByRole('button', { name: /entrando/i });
    await expect(submitBtn).toBeDisabled();
    await expect(submitBtn).toBeVisible();
  });

  test('deve notificar o usuário quando estiver offline no Admin', async ({ page, context }) => {
    // Login e ir para o Admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@atravessamentos.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin');
    
    // Aguarda estabilização para garantir que os listeners foram registrados
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Colocar o navegador em modo offline
    await context.setOffline(true);
    
    // Verificar banner de offline
    await expect(page.getByTestId('offline-banner')).toBeVisible();

    // Voltar online
    await context.setOffline(false);
    await expect(page.getByTestId('offline-banner')).not.toBeVisible();
  });
});
