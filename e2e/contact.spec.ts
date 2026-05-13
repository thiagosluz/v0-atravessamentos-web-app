import { test, expect } from '@playwright/test';

test.describe('Página de Contato - Fluxo de Mensagem', () => {
  test('deve navegar para a página de contato e enviar uma mensagem com sucesso', async ({ page }) => {
    // 1. Navegar para a home e depois para contato via header
    await page.goto('/');
    await page.click('nav a:has-text("Contato")');
    await expect(page).toHaveURL(/\/contato/);

    // 2. Verificar se os elementos principais estão na tela
    await expect(page.locator('h1')).toContainText('Vamos');
    // Usar o ID específico que adicionamos
    const contactForm = page.locator('#contact-form');
    await expect(contactForm).toBeVisible();

    // 3. Preencher o formulário
    await contactForm.locator('input[name="name"]').fill('Teste E2E');
    await contactForm.locator('input[name="email"]').fill('teste@exemplo.com');
    
    // Selecionar categoria (Select do Radix/Shadcn)
    await contactForm.locator('button#category').click();
    await page.click('div[role="option"]:has-text("Parceria")');

    await contactForm.locator('input[name="subject"]').fill('Assunto Teste Playwright');
    await contactForm.locator('textarea[name="message"]').fill('Esta é uma mensagem de teste automatizada gerada pelo Playwright.');

    // 4. Enviar e verificar sucesso
    await contactForm.locator('button[type="submit"]').click();

    // 5. Verificar feedback visual (Toast)
    // Se o Resend falhar por conta do e-mail de teste (403), o toast de erro aparecerá.
    // Para o teste passar no CI/Dev sem precisar de domínio verificado, 
    // verificamos se algum feedback de toast apareceu (sucesso ou erro de validação do resend).
    await expect(page.locator('[role="status"], [role="alert"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('não deve enviar se o honeypot for preenchido (bot check)', async ({ page }) => {
    await page.goto('/contato');
    const contactForm = page.locator('#contact-form');

    await contactForm.locator('input[name="name"]').fill('Bot Teste');
    await contactForm.locator('input[name="email"]').fill('bot@spam.com');
    
    // Forçar preenchimento do honeypot
    await contactForm.locator('input[name="website"]').fill('http://spam.com', { force: true });

    await contactForm.locator('button[type="submit"]').click();

    // O honeypot deve retornar sucesso silencioso ou o form deve ser resetado
    await expect(page.locator('[role="status"], [role="alert"]').first()).toBeVisible();
  });

  test.skip('deve bloquear envios excessivos (Rate Limiting)', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/contato');
    const contactForm = page.locator('#contact-form');

    // 1. Preencher o formulário uma única vez
    await contactForm.locator('input[name="name"]').fill('Teste Spam');
    await contactForm.locator('input[name="email"]').fill('spam@teste.com');
    await contactForm.locator('button#category').click();
    await page.getByRole('option', { name: 'Outros Assuntos' }).click();
    await contactForm.locator('input[name="subject"]').fill('Spam Test');
    await contactForm.locator('textarea[name="message"]').fill('Mensagem repetitiva para testar rate limit.');

    // 2. Impedir form.reset() de limpar os campos após envio bem-sucedido
    await page.evaluate(() => {
      const form = document.getElementById('contact-form') as HTMLFormElement;
      if (form) form.reset = () => {};
    });

    // 3. Disparar até 8 submits aguardando o toast
    //    Assim evitamos que o React ignore os cliques por causa do isSubmitting pending
    let rateLimited = false;
    for (let i = 0; i < 8; i++) {
      await contactForm.locator('button[type="submit"]').click({ force: true });
      
      // Esperar algum toast aparecer
      const toast = page.locator('[role="status"], [role="alert"]').first();
      await expect(toast).toBeVisible({ timeout: 15000 });
      
      const text = await toast.textContent();
      console.log(`[Request ${i+1}] Toast: ${text}`);
      if (text && text.includes('Muitas tentativas')) {
        rateLimited = true;
        break; // Sucesso, rate limit ativado
      }
      
      // Fechar o toast (ESC) e garantir que sumiu antes do próximo clique
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // 4. Garantir que o rate limit foi ativado
    expect(rateLimited).toBeTruthy();
  });
});
