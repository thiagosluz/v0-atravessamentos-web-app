# 🚀 Roadmap de Otimização e Resiliência

Este documento consolida as recomendações de arquitetura, performance e tratamento de erros identificadas durante as sessões de brainstorming para implementação futura.

---

## 1. 🛡️ Tratamento de Erros e Resiliência ✅
**Objetivo:** Garantir que a aplicação não quebre silenciosamente e que o usuário tenha feedback claro em qualquer cenário de falha.

### A. Error Boundaries Granulares ✅
- **Onde:** Todos os 10 painéis do Admin (Visão Geral, Projetos, Diário, Membros, Perfil, Configurações, Visual, Acervo, Exposições, Newsletter).
- **Implementação:** Cada painel possui seu próprio `<ErrorBoundary>` com nome descritivo. Falhas isoladas (ex: gráfico recharts no Overview) não derrubam o painel inteiro. O `componentDidCatch` reporta diretamente ao Sentry com component stack.

### B. Padronização de Respostas (Server Actions) ✅
- **Implementação:** Criação do wrapper universal `safeAction()` em `lib/utils/safe-action.ts`. Refatoração de `projects-admin.ts`, `blog-admin.ts` e `members-admin.ts`. Toast de erro automático global via `useAdminForm`.

### C. Observabilidade ✅
- **Implementação:** Sentry integrado em `app/error.tsx` (barreira de rotas) e `app/global-error.tsx` (barreira sistêmica). User Feedback Dialog (`Sentry.showReportDialog`) disponível para relatos de erro.

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

### A. Contraste e Legibilidade ✅ (Parcial)
- **Ação:** Revisar o uso de opacidades (`text-foreground/30`, `/50`). Substituir por cores sólidas que garantam um ratio de contraste mínimo de 4.5:1 (WCAG AA).
- **Onde:** Labels de categorias, metadados de posts no Diário e legendas no Admin.
- **Progresso:** Corrigido o contraste do card "Dica Pro" no OverviewPanel (`text-muted-foreground` → `text-foreground`, `bg-muted` → `bg-foreground text-background`). Auditoria axe-core passando.

### B. Navegação por Teclado e Focus Management
- **Focus Trap:** Implementar captura de foco em modais e no menu mobile para evitar que o foco "escape" para o fundo da página.
- **Aria Current:** Adicionar `aria-current="page"` nos links ativos da sidebar e navegação principal.

### C. Semântica e Rótulos ✅ (Parcial)
- **Hierarquia:** Substituir `span` e `div` por tags de cabeçalho (`h2`, `h3`) em seções de navegação e títulos de blocos.
- **Accessible Labels:** Garantir que botões de ícone (ThemeToggle, Fechar Menu) tenham `aria-label` descritivos e que o Logo tenha um texto alternativo oculto ("Início").
- **DialogDescription:** Implementado `<DialogDescription className="sr-only">` em todos os modais do admin (ExhibitionFormDialog, EditAssetModal) para conformidade com o Radix UI e leitores de tela.

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

## 6. 🚀 Novas Funcionalidades e Expansão
**Objetivo:** Evoluir o sistema de um portfólio/CMS para uma plataforma viva, interativa e de alcance global.

### A. Interatividade e Engajamento (Camada Social)
- **Sistema de Comentários**: Implementar discussões moderadas no Diário e Projetos para fomentar o diálogo com o público.
- **Portfólios de Membros**: Expandir as páginas de membros para mini-sites integrados, permitindo que cada artista gerencie sua própria galeria e currículo dentro do ecossistema.
- **Feed Social Integrado**: Trazer conteúdos dinâmicos (Instagram/YouTube) para a home para aumentar a sensação de atualização constante.

### B. Curadoria e Gestão Avançada (CMS Pro)
- **Mapa Cultural Interativo**: Visualização baseada em geolocalização para mapear os territórios onde o coletivo atua ou atuou.
- **Busca Semântica com IA**: Integrar um sistema de busca que entenda o contexto artístico e conceitual dos projetos.
- **Agenda e Eventos**: Calendário público integrado para divulgar oficinas, exposições e encontros futuros.
- **Criação Rápida no Command Menu (⌘K)**: Adicionar atalhos diretos no Command Menu administrativo para "Novo Projeto", "Nova Exposição", "Novo Diário" e "Novo Membro", utilizando Estado Global (Zustand) ou Search Params na URL para acionar a abertura dos respectivos modais independentemente da aba atual.
- **Gerenciador Central de Mídias (Media Library)**: Centralizar o upload e armazenamento de imagens em uma única aba, permitindo a reutilização das mídias em diferentes partes do site (Projetos, Diário, Acervo) em vez de fazer uploads duplicados por modal.
- **Ordenação Curatorial (Drag & Drop)**: Implementar ordenação visual (arrastar e soltar) nas tabelas administrativas para dar ao administrador controle total sobre a ordem de exibição dos projetos e exposições na página inicial pública.
- **Histórico de Atividades (Audit Trail)**: Criar uma linha do tempo no dashboard principal que registre quem criou, editou ou excluiu quais itens (ex: "Maria publicou o projeto X há 2 horas"), essencial para a gestão em equipe.

### C. Acessibilidade Radical e Internacionalização
- **Multi-idiomas (i18n)**: Tradução completa (Português/Inglês/Espanhol) para expansão internacional do coletivo.
- **Acessibilidade Assistiva Nativa**: Campos dedicados para audiodescrição em todas as obras da galeria (Acervo) e suporte a widgets de acessibilidade (Libras).
- **Sistema de Apoio e Sustentabilidade**: Integração de botões de doação, assinaturas (Newsletter Premium) ou pequena loja de merchandising.

### D. Sistema de Compartilhamento Poético (Editorial)
- **Objetivo:** Facilitar a circulação dos conteúdos sem poluir o design minimalista.
- **Implementação Sugerida:**
    - Botão flutuante minimalista (Popover) com opções: WhatsApp, Twitter/X e LinkedIn.
    - Funcionalidade de "Copiar Link" com feedback visual imediato (check ✅).
    - Integração com a API nativa `navigator.share` em dispositivos móveis para uma experiência fluida.
    - Posicionamento Estratégico: Popover flutuante ou bloco integrado ao rodapé dos posts.


---

## 🧭 Caminhos Estratégicos (Brainstorm de Maio 2026)

Definimos três caminhos de evolução com diferentes níveis de impacto e esforço para direcionar as próximas sprints do projeto:

### Opção A: Resiliência Extrema e UX de Elite
Foco total em blindar a aplicação contra falhas externas e maximizar a fluidez visual para o usuário final.
- **Ações:** Error Boundaries granulares no admin/feed, migração completa para `next/image` e memoização estratégica de renderização de listas complexas.
- **Prós:** Zero tela branca, LCP otimizado e fluidez ultra-premium (60 FPS).
- **Cons:** Não traz novas features perceptíveis ao público externo imediatamente.
- **Esforço:** Médio.

### Opção B: Sistema de Compartilhamento Poético e Engajamento
Foco em tornar o Diário e as ações do coletivo virais e propensos a compartilhamento orgânico com foco na experiência mobile.
- **Ações:** Popover flutuante minimalista para compartilhamento rápido, geração de OpenGraph dinâmico com imagem de fundo do post e integração nativa com a API `navigator.share` do celular.
- **Prós:** Rápido de testar, estimula a circulação dos ensaios e traz engajamento ativo.
- **Cons:** Exige refino estético meticuloso para manter a proposta minimalista e poética.
- **Esforço:** Baixo a Médio.

### Opção C: CMS Pro com Agenda Cultural e Eventos
Transformar a plataforma em uma central ativa de atividades e encontros para o coletivo (oficinas, projeções, residências artísticas).
- **Ações:** Criação de calendário integrado público, nova tabela de eventos administrativa e painel de gerenciamento no CMS do admin.
- **Prós:** Alto valor comunitário e prático para o público regional.
- **Cons:** Requer novas tabelas no banco de dados Supabase e novas telas no admin.
- **Esforço:** Alto.

---

## 📅 Próximos Passos Sugeridos

1. **Qualidade de Testes:** Refatorar `actions.test.ts` para incluir asserções reais (Base da pirâmide).
2. Migração para `next/image` na Timeline Pública (Alto impacto visual).
3. Implementação de Memoization no `AdminDataTable` (Melhoria de UX no gerenciamento).
4. **Auditoria de Contraste:** Ajustar tokens de cores para conformidade WCAG (Inclusão).
5. Adição de Error Boundaries nos gráficos do Overview (Resiliência).
6. **Sistema de Compartilhamento:** Implementar o protótipo de "Copiar Link" nos posts (Engajamento).
7. **Floating UI Kit (Em Andamento):** O componente `FloatingInput` já está implementado e em uso no Login e Newsletter do Footer. Próximos passos: expandir para `FloatingTextarea` e `FloatingSelect`, e migrar formulários públicos (Contato, Inscrição).

---

## ✅ Funcionalidades Concluídas (Maio 2026)

### 🛡️ Error Boundaries Granulares e Wrapper safeAction
- **Error Boundaries**: Migração do ErrorBoundary único no admin para 10 boundaries individuais, um por painel, com nomes descritivos (ex: "Visão Geral", "Acervo", "Newsletter"). O `componentDidCatch` envia exceções ao Sentry com component stack trace completo.
- **Wrapper `safeAction()`**: Criação de utilitário universal em `lib/utils/safe-action.ts` que encapsula `try/catch`, validação Zod e retorno estruturado `{ success, error?, data? }`. Refatoração completa de `projects-admin.ts`, `blog-admin.ts` e `members-admin.ts`.
- **Toast de Erro Automático**: O hook `useAdminForm` agora dispara toasts destrutivos automaticamente em caso de erro, eliminando a necessidade de renderização manual em cada formulário.
- **Resultado**: Seção 1 do Roadmap (Tratamento de Erros e Resiliência) 100% concluída. Zero boilerplate duplicado nas Server Actions.

### 📬 Observabilidade e Captura Resiliente de Erros (Sentry)
- **Implementação**: Integração direta do SDK `@sentry/nextjs` em `app/error.tsx` (barreira de erro em nível de rotas), capturando exceções silenciosas no cliente e anexando automaticamente identificadores de ambiente e metadados (`digest`).
- **User Feedback Dialog**: Adicionado suporte ao formulário nativo de reporte de problemas da dashboard do Sentry (`Sentry.showReportDialog`), ativado através de um botão secundário dinâmico no `ErrorLayout` ("Reportar problema").
- **Resultado**: Zero lacunas de observabilidade de exceções no cliente em produção, permitindo diagnóstico imediato com o relato direto de usuários ou membros do coletivo.

### 🧩 Estabilização de Layout e Resiliência da Sidebar
- **Implementação:** Refatoração de contêineres Flexbox da Sidebar (Desktop/Mobile) adotando estratégias de restrição (`min-h-0` e `overflow-y-auto`).
- **Resultado:** Menu de navegação perfeitamente rolável, mantendo o logo (Header) e as opções de perfil (Footer) sempre visíveis e alinhados, sem empurrar componentes para fora da tela.
- **Auditoria de Acessibilidade:** Conformidade em semântica de botões interativos para navegação via teclado, suporte a `prefers-reduced-motion` no Cookie Consent, e correção de CLS nas galerias/avatares.

### 🤖 Automação E2E e Bypass Estratégico
- **Implementação:** Padronização global de bypass do `Cookie Consent` para suítes de testes (`window.localStorage`). Expansão de tolerância de timeouts (`toHaveURL`) nas soft-navigations locais do ambiente de desenvolvimento.
- **Resultado:** Esteira E2E 100% verde (7 testes passando sem falsos positivos). Seletores mais resilientes.

### 📱 Navegação Administrativa Mobile
- **Implementação:** Menu "Gaveta" (Sheet/Drawer) com botão hambúrguer.
- **Resultado:** Painel 100% responsivo, eliminando cortes de conteúdo e compressão de layout em telas pequenas.

### 🧠 Sistema de Recomendações por Afinidade (Diário)
- **Implementação:** Algoritmo baseado em interseção de Tags e Categorias (`TEXT[]` no Supabase).
- **Resultado:** Aumento do potencial de engajamento através do componente "Leituras Relacionadas" ao final de cada post.
- **Testes:** Suítes de E2E e Unitárias atualizadas para cobrir o ciclo de vida das tags.

### 🧪 Testes de Integração e Acessibilidade (Fase B)
- **Implementação:** Criação de testes de comportamento para `AdminSidebar` e `CookieConsent` usando Vitest e React Testing Library com mocks de animação.
- **Acessibilidade:** Implementação do atributo `aria-current="page"` na Sidebar administrativa para navegação assistiva.
- **Resultado:** Validação de 8 cenários críticos de UI (links ativos, persistência de localStorage e visibilidade controlada).

### 🚀 Funcionalidades Bônus de Expansão e Engajamento
- **Vínculo Membro-Projeto**: Multiselect no painel de projetos para associar obras aos membros do coletivo.
- **Portfólios em PDF (Membros)**: Geração client-side (via `react-pdf`) de currículos/portfólios diretamente pelo admin, listando bio, contato e projetos vinculados de forma estilizada.
- **Modo Apresentação (Exposições)**: Visualização imersiva fullscreen (slideshow com autoplay configurável) focado na exibição em eventos/galerias.
- **QR Codes Dinâmicos**: Botão dedicado no grid de exposições para gerar e baixar QR Codes, facilitando o acesso presencial.
- **Curtidas Anônimas (Acervo)**: Botão de "favoritar" obras públicas com proteção anti-spam via `localStorage` e otimização por Server Action sem RLS block.
- **Resultado:** Maior interação pública, ferramentas úteis para produção (PDF/QR) e ampliação da capacidade exibicional da plataforma.

---
*Documento atualizado em 21/05/2026.*

