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
    // Detectar SO e testar atalho
    const isMac = process.platform === 'darwin';
    const modifier = isMac ? 'Meta' : 'Control';
    
    // Abrir Command Menu via atalho
    await page.keyboard.press(`${modifier}+k`);
    
    // Verificar se o menu abriu
    const commandMenu = page.locator('[role="dialog"]');
    await expect(commandMenu).toBeVisible();
    
    // Verificar opção de voltar para o site público
    const backToSiteOption = page.locator('text="Ver Site Público"');
    await expect(backToSiteOption).toBeVisible();
    
    // Fechar menu
    await page.keyboard.press('Escape');
    await expect(commandMenu).not.toBeVisible();
  });

  test('deve permitir voltar para o site público via Logo e Header', async ({ page }) => {
    // 1. Testar Logo
    const logoLink = page.locator('aside a:has-text("atravessamentos")');
    await expect(logoLink).toBeVisible();
    
    // 2. Testar Botão "Ver site" no topo
    const viewSiteBtn = page.locator('header a:has-text("Ver site")');
    await expect(viewSiteBtn).toBeVisible();
    
    // Clicar e verificar se saiu do admin
    await viewSiteBtn.click();
    await expect(page).not.toHaveURL(/\/admin/);
  });
});
