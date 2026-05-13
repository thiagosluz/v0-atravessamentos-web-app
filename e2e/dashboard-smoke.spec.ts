import { test, expect } from '@playwright/test';

test.describe('Dashboard Admin - Smoke Test', () => {
  test.beforeEach(async ({ page }) => {
    // Login automático usando credenciais de teste padrão
    await page.goto('/login');
    await page.fill('#login-email', 'test@atravessamentos.com');
    await page.fill('#login-password', 'password123');
    await page.click('button[type="submit"]');
    
    // Esperar redirecionar para o admin
    await expect(page).toHaveURL('/admin');
  });

  test('deve renderizar os elementos principais da Visão Geral', async ({ page }) => {
    // 1. Verificar Banner de Boas-Vindas
    const welcomeBanner = page.locator('h2:has-text("Olá,")');
    await expect(welcomeBanner).toBeVisible();
    
    // 2. Verificar Gráfico de Temas
    const chartTitle = page.locator('h3:has-text("Temas dos Projetos")');
    await expect(chartTitle).toBeVisible();
    
    const pieChart = page.locator('.recharts-responsive-container');
    await expect(pieChart).toBeVisible();
    
    // 3. Verificar Atividades Recentes
    const activitiesTitle = page.locator('h3:has-text("Últimas Atualizações")');
    await expect(activitiesTitle).toBeVisible();
  });

  test('deve funcionar o atalho de teclado inteligente e navegação', async ({ page }) => {
    // Garantir viewport desktop para o menu não estar oculto (sm:block)
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Detectar SO e testar atalho
    const isMac = process.platform === 'darwin';
    const modifier = isMac ? 'Meta' : 'Control';
    
    // 1. Abrir Command Menu via Botão Visual (Estratégia mais estável)
    const searchButton = page.getByTestId('command-menu-trigger');
    await expect(searchButton).toBeVisible();
    await searchButton.click();
    
    // Verificar se o menu abriu usando o diálogo ou o marcador que adicionamos
    const commandMenu = page.locator('[role="dialog"]');
    await expect(commandMenu).toBeVisible({ timeout: 10000 });
    
    // Fechar menu para testar o atalho
    await page.keyboard.press('Escape');
    await expect(commandMenu).not.toBeVisible();

    // Pequeno delay para o evento de fechamento processar
    await page.waitForTimeout(500);

    // 2. Testar o atalho de teclado (Estratégia secundária)
    await page.keyboard.down(modifier);
    await page.keyboard.press('k');
    await page.keyboard.up(modifier);
    await expect(commandMenu).toBeVisible({ timeout: 10000 });
    
    // Verificar opção de voltar para o site público
    const backToSiteOption = page.locator('text="Ver Site Público"');
    await expect(backToSiteOption).toBeVisible();
    
    // Fechar menu
    await page.keyboard.press('Escape');
    await expect(commandMenu).not.toBeVisible();
  });

  test('deve permitir voltar para o site público via Logo e Header', async ({ page }) => {
    // Garantir viewport desktop para botão "Ver site" que usa lg:flex
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // 1. Testar Logo
    const logo = page.getByTestId('admin-logo');
    await expect(logo).toBeVisible();
    
    // 2. Testar Botão "Ver site" via Command Menu (novo fluxo)
    await page.getByTestId('command-menu-trigger').click();
    
    const viewSiteOption = page.locator('text="Ver Site Público"');
    await expect(viewSiteOption).toBeVisible();
    
    // Clicar e verificar se saiu do admin
    await viewSiteOption.click();
    await expect(page).not.toHaveURL(/\/admin/);
  });
});
