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

## 📅 Próximos Passos Sugeridos
1. Migração para `next/image` na Timeline Pública (Alto impacto visual).
2. Implementação de Memoization no `AdminDataTable` (Melhoria de UX no gerenciamento).
3. Adição de Error Boundaries nos gráficos do Overview (Segurança técnica).

---
*Documento gerado em 13/05/2026 durante sessão de estabilização do projeto.*
