# 🚀 Roadmap de Otimização e Resiliência

Este documento consolida as recomendações de arquitetura, performance e tratamento de erros identificadas durante as sessões de brainstorming para implementação futura.

---

## 1. 🛡️ Tratamento de Erros e Resiliência
**Objetivo:** Garantir que a aplicação não quebre silenciosamente e que o usuário tenha feedback claro em qualquer cenário de falha.

### A. Error Boundaries Granulares
- **Onde:** `OverviewPanel` (Gráficos), `AdminDataTable`, `GalleryGrid`.
- **Ação:** Envolver componentes pesados ou dependentes de APIs externas em `ErrorBoundary` locais para evitar que uma falha isolada derrube a página inteira.

### B. Padronização de Respostas (Server Actions)
- **Ação:** Implementar um wrapper universal para as ações que capture erros inesperados e dispare um `toast` global, reduzindo o boilerplate de `try/catch` nos formulários.

### C. Observabilidade
- **Ação:** Integrar um serviço de monitoramento (ex: Sentry) no `app/error.tsx` para capturar falhas em produção sem depender de relatos manuais dos usuários.

---

## 2. ⚡ Performance e Eficiência
**Objetivo:** Manter a fluidez da interface (60fps) e reduzir o tempo de carregamento inicial (LCP).

### A. Memoization Estratégica
- **Tabelas:** Memoizar definições de colunas (`useMemo`) e handlers de ação (`useCallback`) no `AdminDataTable` e nos painéis.
- **Listas:** Usar `React.memo` nos cards da Linha do Tempo e nas linhas da tabela para evitar re-renders em cascata durante filtragens ou buscas.

### B. Otimização de Assets (Next.js Image)
- **Ação:** Migrar todas as tags `<img>` para `next/image`.
- **Benefícios:** Lazy loading nativo, conversão automática para WebP, redimensionamento dinâmico e placeholders de carregamento (blur).

### C. Virtualização
- **Onde:** Tabelas administrativas com paginação muito longa ou grids com centenas de itens.
- **Ferramenta:** `react-virtuoso` ou `react-window`.

---

## 3. 🎨 Manutenibilidade de Design
**Objetivo:** Garantir que o "Estilo Premium" seja consistente e fácil de evoluir.

### A. Design Tokens
- **Ação:** Extrair cores recorrentes (ex: cores de categoria, tons de ouro/terra) para variáveis CSS no `globals.css` ou tokens no `tailwind.config.js`.

### B. Componentização de Modais
- **Ação:** Continuar a migração de modais "brutos" para o padrão `AnimatedAdminModal` para garantir consistência de animação e layout em todo o admin.

---

## 4. ♿ Acessibilidade (A11y)
**Objetivo:** Garantir que a aplicação seja inclusiva, navegável por teclado e compreensível por tecnologias assistivas (WCAG).

### A. Contraste e Legibilidade
- **Ação:** Revisar o uso de opacidades (`text-foreground/30`, `/50`). Substituir por cores sólidas que garantam um ratio de contraste mínimo de 4.5:1 (WCAG AA).
- **Onde:** Labels de categorias, metadados de posts no Diário e legendas no Admin.

### B. Navegação por Teclado e Focus Management
- **Focus Trap:** Implementar captura de foco em modais e no menu mobile para evitar que o foco "escape" para o fundo da página.
- **Aria Current:** Adicionar `aria-current="page"` nos links ativos da sidebar e navegação principal.

### C. Semântica e Rótulos
- **Hierarquia:** Substituir `span` e `div` por tags de cabeçalho (`h2`, `h3`) em seções de navegação e títulos de blocos.
- **Accessible Labels:** Garantir que botões de ícone (ThemeToggle, Fechar Menu) tenham `aria-label` descritivos e que o Logo tenha um texto alternativo oculto ("Início").

---

## 5. 🧪 Qualidade e Testes
**Objetivo:** Elevar a confiança nas entregas através de uma pirâmide de testes equilibrada e assertiva.

### A. Reforço de Testes Unitários
- **Ação:** Refatorar suítes de teste de `Server Actions` para incluir asserções reais (ex: verificar se os dados corretos foram enviados ao Supabase) em vez de apenas verificar se a função não falhou.
- **Utils:** Garantir 100% de cobertura em funções de utilidade crítica (formatação, cálculos, validações).

### B. Testes de Hooks e Lógica de UI
- **Ação:** Implementar testes para hooks complexos (`useAdminForm`, `useAdminState`) usando `@testing-library/react-hooks` para validar fluxos de mutação e estado sem depender do navegador.

### C. Expansão de E2E (Playwright)
- **Cenários de Borda:** Adicionar testes de falha de rede, timeouts e estados vazios (empty states).
- **Acessibilidade Automatizada:** Integrar `@axe-core/playwright` ao fluxo de CI para detectar regressões de acessibilidade em cada commit.

---

## 📅 Próximos Passos Sugeridos
1. **Qualidade de Testes:** Refatorar `actions.test.ts` para incluir asserções reais (Base da pirâmide).
2. Migração para `next/image` na Timeline Pública (Alto impacto visual).
3. Implementação de Memoization no `AdminDataTable` (Melhoria de UX no gerenciamento).
4. **Auditoria de Contraste:** Ajustar tokens de cores para conformidade WCAG (Inclusão).
5. Adição de Error Boundaries nos gráficos do Overview (Resiliência).

---
*Documento atualizado em 13/05/2026 com diretrizes de qualidade e testes.*
