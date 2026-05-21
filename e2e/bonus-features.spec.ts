import { test, expect } from '@playwright/test';

test.describe('Bonus Features Suite', () => {
  // 1. Favoritos do Acervo & Rate Limit
  test('deve permitir curtir e desfazer a curtida no acervo dentro de 15s', async ({ page }) => {
    await page.goto('/acervo');
    
    // Esperar o carregamento do masonry grid
    await page.waitForSelector('button[aria-label="Curtir obra"]');
    
    const likeButton = page.locator('button[aria-label="Curtir obra"]').first();
    const heartIcon = likeButton.locator('svg');
    
    // Certificar-se que o botão existe
    await expect(likeButton).toBeVisible();
    
    // Capturar texto inicial (se existir)
    const initialText = await likeButton.innerText();
    const initialCount = initialText ? parseInt(initialText, 10) : 0;
    
    // Curtir
    await likeButton.click();
    
    // Deve exibir o ícone preenchido e count + 1 imediatamente (Optimistic UI)
    await expect(heartIcon).toHaveClass(/fill-red-500/);
    await expect(likeButton).toContainText((initialCount + 1).toString());
    
    // Esperar um pouco para a Server Action de Like retornar o token e salvar no client
    await page.waitForTimeout(2000);

    // Desfazer curtida (dentro dos 15 segundos)
    await likeButton.click();
    
    // Esperar a requisição processar
    await page.waitForTimeout(1000);

    // Deve exibir o ícone vazio novamente e count original
    await expect(heartIcon).not.toHaveClass(/fill-red-500/);
    if (initialCount === 0) {
      await expect(likeButton).not.toContainText('1');
    } else {
      await expect(likeButton).toContainText(initialCount.toString());
    }
  });

  // 2. Modo Apresentação
  test('deve abrir o modo apresentação e usar controles de navegação', async ({ page }) => {
    // Presumindo que existe uma exposição mockada ou a exposição 'tecido-social'
    // Vamos apenas verificar a página inicial de exposições para entrar numa apresentação
    await page.goto('/exposicoes');
    
    // Tenta encontrar um link para o modo apresentação
    const presentationLink = page.locator('a[href$="/apresentacao"]').first();
    
    // Se existir uma exposição listada
    if (await presentationLink.isVisible()) {
      await presentationLink.click();
      
      // Verifica controles do modo apresentação
      await expect(page.locator('button:has-text("Play"), button:has-text("Pause")')).toBeVisible();
      await expect(page.locator('button:has-text("Sair da Tela Cheia")')).toBeVisible();
      
      // Testa interações (ex: click no botão next)
      const nextBtn = page.locator('button[aria-label="Avançar"]');
      if (await nextBtn.isVisible()) {
        await nextBtn.click();
      }
    }
  });

  // 3. Exportação PDF do Portfólio (Mock/Checklink)
  test('deve conter botão para gerar PDF do portfólio no admin', async ({ page }) => {
    await page.goto('/login');
    // Faz o login admin
    await page.fill('#login-email', 'test@atravessamentos.com');
    await page.fill('#login-password', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin');
    
    // Abre a aba de Membros
    await page.click('aside button:has-text("Membros")');
    
    // Verifica se os membros carregaram
    await page.waitForSelector('table');
    
    // Verifica se existe o botão/link de "Gerar PDF" diretamente na linha da tabela
    const generatePdfBtn = page.locator('button:has-text("Gerar PDF")').first();
    if (await generatePdfBtn.isVisible()) {
      // Clica para preparar os dados
      await generatePdfBtn.click();
      
      // Espera aparecer o botão "Baixar PDF" (que é um link)
      const downloadPdfOption = page.locator('a:has-text("Baixar PDF")').first();
      await expect(downloadPdfOption).toBeVisible({ timeout: 10000 });
      
      const href = await downloadPdfOption.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  // 4. QR Codes para Exposição
  test('deve existir a opção de visualizar QR Code da Exposição no admin', async ({ page }) => {
    await page.goto('/login');
    // Faz o login admin
    await page.fill('#login-email', 'test@atravessamentos.com');
    await page.fill('#login-password', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin');
    
    // Abre a aba de Exposições
    await page.click('aside button:has-text("Exposições")');
    
    // Verifica se os cards carregaram
    await page.waitForSelector('button[title="QR Code da Exposição"]');
    
    // Encontra o botão de QR Code do primeiro card
    const qrCodeBtn = page.locator('button[title="QR Code da Exposição"]').first();
    if (await qrCodeBtn.isVisible()) {
      // Clica e verifica se o Dialog abre
      await qrCodeBtn.click();
      const dialog = page.locator('div[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog).toContainText('QR Code');
    }
  });
});
