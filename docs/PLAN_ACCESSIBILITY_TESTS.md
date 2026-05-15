# Plano de Implementação: Fase C - E2E de Acessibilidade

Este plano detalha a integração de auditorias automáticas de acessibilidade (WCAG) usando `@axe-core/playwright` na suíte de testes E2E do Coletivo Atravessamentos.

## 🛠️ Objetivos
1. **Conformidade Automatizada:** Garantir que as páginas principais (Home, Diário, Admin) sigam as diretrizes WCAG 2.1 AA.
2. **Prevenção de Regressões:** Bloquear commits que introduzam erros básicos de acessibilidade (contraste, falta de alt text, navegação de teclado quebrada).
3. **Relatórios Detalhados:** Configurar o Playwright para gerar relatórios de violações de acessibilidade.

## 📋 Tarefas

### 1. Infraestrutura e Dependências
- [ ] Instalar `@axe-core/playwright` como dependência de desenvolvimento.
- [ ] Criar utilitário de auxílio para testes de acessibilidade (se necessário).

### 2. Implementação de Testes (`e2e/accessibility.spec.ts`)
- [ ] **Teste Home:** Validar estrutura de cabeçalhos, contraste de cores e rótulos de navegação.
- [ ] **Teste Diário:** Validar acessibilidade de posts, imagens (alt text) e paginação.
- [ ] **Teste Admin Dashboard:** Validar acessibilidade de tabelas, botões de ação e modais (focus management).
- [ ] **Teste Cookie Consent:** Validar se o banner é amigável a leitores de tela e navegação por teclado.

### 3. Refinamento e Correções
- [ ] Analisar violações encontradas pelos primeiros testes.
- [ ] Corrigir problemas críticos (ex: botões sem label, baixo contraste em textos secundários).
- [ ] Adicionar exceções justificadas (se houver limitações técnicas).

## 🚀 Próximos Passos
1. Instalar `@axe-core/playwright`.
2. Criar `e2e/accessibility.spec.ts` com verificações básicas.
3. Rodar a auditoria e reportar resultados.

---
*Plano gerado por Antigravity Orchestrator em 14/05/2026.*
