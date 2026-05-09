import { test, expect } from '@playwright/test';

test.describe('UI Standardization - Internal Pages', () => {
  const pages = [
    { path: '/acervo', title: 'Acervo' },
    { path: '/exposicoes', title: 'Exposições' },
    { path: '/diario', title: 'Diário' },
    { path: '/projetos', title: 'Projetos' },
  ];

  for (const page of pages) {
    test(`should have standardized UI elements on ${page.path}`, async ({ page: p }) => {
      await p.goto(page.path);

      // 1. Verify BackButton is present
      const backButton = p.locator('a:has-text("Voltar")');
      await expect(backButton).toBeVisible();

      // 2. Verify PageHeader components are present
      const heading = p.locator('h1');
      await expect(heading).toBeVisible({ timeout: 10000 });

      const description = p.getByTestId('page-header-description');
      await expect(description).toBeVisible();

      // 3. Verify Background atmosphere (BackgroundBlobs / Textures)
      // BackgroundBlobs usually has an absolute positioned div with isolate
      const backgroundElements = p.locator('.isolate');
      await expect(backgroundElements.first()).toBeVisible();
    });
  }
});

test.describe('Admin Dashboard - Layout Standardization', () => {
  test.beforeEach(async ({ page }) => {
    // Perform login
    await page.goto('/login');
    await page.fill('#login-email', 'test@atravessamentos.com');
    await page.fill('#login-password', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin');
  });

  test('Gallery Admin Panel should have standardized header and padding', async ({ page }) => {
    await page.click('button:has-text("Acervo")');
    
    // Check for the new header structure
    const header = page.locator('h3:has-text("Acervo de Mídias")');
    await expect(header).toBeVisible();
    
    // Check for the description
    const description = page.locator('text=/Gerencie o repositório/i');
    await expect(description).toBeVisible();
  });

  test('Exhibitions Admin Panel should have standardized header and padding', async ({ page }) => {
    await page.click('button:has-text("Exposições")');
    
    // Check for the new header structure
    const header = page.locator('h3:has-text("Salas de Curadoria")');
    await expect(header).toBeVisible();
    
    // Check for the description
    const description = page.locator('text=/Crie narrativas visuais/i');
    await expect(description).toBeVisible();
  });
});
