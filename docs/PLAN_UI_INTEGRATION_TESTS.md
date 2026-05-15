# 🎨 Plano de Implementação: Testes de Integração de UI

Este plano detalha a criação de testes de comportamento para componentes críticos de interface, garantindo acessibilidade e persistência de estado.

---

## 📅 Arquivos de Destino
- `__tests__/unit/components/admin-sidebar.test.tsx`
- `__tests__/unit/components/cookie-consent.test.tsx`

---

## 🧪 Casos de Teste Detalhados

### 1. `components/admin-sidebar.test.tsx`
**Fonte:** `components/admin/layout/admin-sidebar.tsx`
- **Links Ativos:** Validar que o link correspondente à aba `active` recebe os estilos de destaque.
- **Acessibilidade:** Verificar se o link ativo possui o atributo `aria-current="page"`.
- **Navegação:** Simular cliques nos botões de navegação e verificar se a função `setActive` é chamada com o argumento correto.

### 2. `components/cookie-consent.test.tsx`
**Fonte:** `components/shared/cookie-consent.tsx`
- **Exibição Inicial:** Garantir que o banner aparece se não houver registro no `localStorage`.
- **Interação de Aceite:** Simular clique em "Aceitar" e verificar se o banner desaparece e se `localStorage.setItem('cookie-consent', 'accepted')` foi chamado.
- **Persistência:** Validar que o banner NÃO aparece se o valor já estiver no `localStorage`.

---

## 🛠️ Orquestração de Agentes
1. **`project-planner`**: Planejamento e detalhamento.
2. **`frontend-specialist`**: Implementação dos testes usando `@testing-library/react`.
3. **`test-engineer`**: Execução dos testes e verificação de sanidade.

---
*Plano gerado em 14/05/2026. Aguardando aprovação para execução.*
