# 🧪 Plano de Expansão de Cobertura de Testes

Este plano descreve a estratégia para elevar a confiança e a resiliência do Coletivo Atravessamentos, cobrindo lacunas identificadas em estados de erro, acessibilidade, performance e segurança.

---

## 1. 🔍 Análise da Cobertura Atual
Atualmente, o sistema possui uma base sólida de:
- **E2E:** Fluxos principais de CMS (Projetos/Membros), Login, Newsletter e Integração Redis.
- **Unitários:** Server Actions, Utils, Hooks e Validações de Schema.

---

## 2. 🎯 Novas Sugestões de Testes

### A. Testes Unitários (Vitest) ✅
**Foco:** Lógica pura, estados de erro e performance.

1. **`lib/search-logic.test.ts`** [Concluído]
2. **`actions/error-handling.test.ts`** [Concluído]
3. **`hooks/use-admin-state.test.ts`** [Concluído]
4. **`utils/performance.test.ts`** [Concluído]

### B. Testes de Integração de UI (Testing Library) ✅
**Foco:** Comportamento de componentes sem a carga total do E2E.

1. **`components/admin/Sidebar.test.tsx`** [Concluído]
2. **`components/shared/CookieConsent.test.tsx`** [Concluído]

### C. Testes End-to-End (Playwright)
**Foco:** Segurança, Acessibilidade e Resiliência.

1. **`e2e/security-access.spec.ts`**:
   - Tentar acessar rotas de `/admin/*` sem estar logado e garantir o redirecionamento.
   - Validar que um usuário logado não consegue acessar funções de outro tenant (se aplicável).
2. **`e2e/accessibility.spec.ts`**:
   - Integrar o `@axe-core/playwright` para rodar uma auditoria automática de WCAG nas páginas principais (Home, Diário, Admin).
3. **`e2e/empty-states.spec.ts`**:
   - Validar a experiência do usuário quando não há projetos ou posts cadastrados (mensagens de "Nenhum resultado encontrado").
4. **`e2e/resilience-network.spec.ts`**:
   - Usar `page.route` para simular falhas de API (500) e verificar se os `Error Boundaries` e Toasts de erro aparecem corretamente.

---

## 📅 Próximos Passos
1. Criar os esqueletos dos arquivos de teste sugeridos.
2. Implementar a auditoria automática de acessibilidade (Alto impacto, baixo esforço).
3. Implementar testes de interceptação de rede para simular erros.

---
*Plano proposto em 14/05/2026 por Antigravity Orchestrator.*
