# Plano de Correção: Estabilização de Testes E2E

Este plano visa corrigir as falhas nos testes E2E causadas pelas recentes atualizações de UI (Menu Mobile e Cookie Consent).

## 🔍 Análise de Causa Raiz
As falhas ocorrem principalmente em ações de clique no final de formulários.
1. **Cookie Consent**: O banner flutuante aparece após 2s com `z-[100]`, possivelmente bloqueando a interação com elementos da interface.
2. **Mudança de Layout Admin**: A sidebar agora é condicional (`md:flex`), o que pode afetar testes que rodam em viewports menores ou que usam seletores baseados na árvore DOM anterior.

## 🛠️ Ações Propostas

### 1. Neutralizar o Cookie Consent nos Testes
Para evitar que o banner interfira nos testes, vamos:
- **Opção A**: Adicionar um comando no `beforeEach` global dos testes para setar `localStorage.setItem('cookie-consent', 'accepted')`. Isso impedirá o banner de aparecer.

### 2. Ajustar Seletores da Sidebar
- Verificar se `page.click('aside button:has-text("Diário")')` ainda funciona. No desktop deve funcionar, mas se o Playwright estiver simulando um dispositivo móvel por padrão, ele precisará abrir o `Sheet` primeiro.
- **Ajuste**: Garantir que o teste abra o menu mobile se o botão da sidebar não estiver visível.

### 3. Validação do Campo de Tags
- Confirmar se o ID `#blog-tags` no `BlogFormDialog` está sendo encontrado corretamente.

## 📝 Passo a Passo da Implementação

1. **Fase de Preparação (test-engineer)**:
   - Modificar `e2e/cms.spec.ts` e `e2e/projects.spec.ts` para injetar o consentimento de cookies no `beforeEach`.
   
2. **Fase de Correção de Seletores (frontend-specialist)**:
   - Revisar se os botões de "Excluir" e "Editar" ainda estão acessíveis com os seletores atuais (`getByLabel`, `hasText`).

3. **Fase de Verificação (test-engineer)**:
   - Executar `npx playwright test`.

## ✅ Critérios de Aceite
- [ ] Todos os 3 testes falhos passando.
- [ ] O banner de cookies não aparece durante a execução dos testes.
- [ ] A navegação entre painéis (Diário, Projetos, Membros) funciona via sidebar desktop.
