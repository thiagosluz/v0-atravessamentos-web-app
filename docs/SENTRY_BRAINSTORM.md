# Brainstorm: Integração do Sentry em `app/error.tsx`

Este documento apresenta a análise da implantação atual do Sentry no projeto Atravessamentos e propõe 3 caminhos de evolução para o tratamento de erros no arquivo de barreira de erro de rota (`app/error.tsx`).

---

## 🔍 Diagnóstico da Implantação Atual do Sentry

Realizamos uma varredura completa da infraestrutura de monitoramento existente e constatamos que **o SDK do Sentry já está amplamente configurado e ativo**:

1. **Runtimes Mapeados**:
   - `sentry.client.config.ts` ➔ Captura erros do navegador com exclusão inteligente de ruídos (extensões de terceiros, falhas de rede comuns e navegações canceladas do Next.js).
   - `sentry.server.config.ts` ➔ Captura exceções no ambiente Node.js.
   - `sentry.edge.config.ts` ➔ Captura falhas na Edge Runtime (como no `proxy.ts`).
   - `instrumentation.ts` ➔ Registra handlers para erro de requisição em tempo de execução (`onRequestError`).

2. **Onde já está integrado**:
   - **`app/global-error.tsx`**: A barreira sistêmica raiz já faz o uso correto de `Sentry.captureException(error)` antes de renderizar o layout de falha fatal.

3. **A lacuna identificada (Onde falta integrar)**:
   - **`app/error.tsx`**: A barreira de erro no nível de rotas (que protege falhas de páginas individuais sob o `RootLayout`) **apenas executa um `console.error` local**. Ela não notifica o Sentry em produção, fazendo com que falhas de páginas específicas fiquem silenciosas caso não derrubem o layout global.

---

## 🧭 Opções de Evolução

Abaixo estão três abordagens com diferentes níveis de sofisticação e esforço para solucionar essa lacuna e aprimorar a resiliência em produção.

---

### Opção A: Integração Direta com Captura Simples (Resolução Imediata)
Consiste em importar o SDK do Sentry no cliente e capturar a exceção no hook `useEffect` existente em `app/error.tsx`, espelhando o comportamento seguro e testado de `global-error.tsx`.

* **Implementação**:
  - Adição de `import * as Sentry from "@sentry/nextjs"` em `app/error.tsx`.
  - Chamada a `Sentry.captureException(error)` no `useEffect` ativo em produção.

✅ **Prós**:
- **Esforço Mínimo**: Implementação e validação extremamente rápidas.
- **Uniformidade**: Segue o mesmo padrão limpo do `global-error.tsx`.
- **Zero Overhead**: Sem dependências ou bibliotecas adicionais na renderização.

❌ **Cons**:
- **Ausência de Contexto Adicional**: Captura o erro seco, sem enriquecer os logs com o contexto do que o usuário estava preenchendo ou de qual painel administrativo ele veio.

📊 **Esforço**: Baixo (15 minutos)

---

### Opção B: Enriquecimento de Contexto e Formulário de Feedback (Recomendado)
Aproveita que o `app/error.tsx` é um componente executado inteiramente no navegador para extrair dados úteis da sessão do usuário no momento da falha e abrir uma caixa de diálogo poética/técnica do Sentry de "Relato de Bug" (User Feedback Dialog) se o usuário desejar.

* **Implementação**:
  - Capturar o erro e usar `Sentry.withScope` para anexar metadados úteis (como o ID digest da falha gerado pelo Next.js, se a falha ocorreu em ambiente `/admin` ou público, etc.).
  - Em ambientes de produção, exibir um gatilho sutil no layout de erro ("*Deseja reportar o que aconteceu ao coletivo?*") que invoca o `Sentry.showReportDialog()` para capturar o relato do usuário diretamente para a dashboard do Sentry.

✅ **Prós**:
- **Engajamento e Transparência**: Transforma um erro técnico em uma oportunidade de conexão poética e profissional.
- **Diagnóstico Preciso**: O relato do usuário fica atrelado exatamente ao mesmo `event_id` da stack trace do erro no Sentry.
- **Segurança de Dados**: O formulário é totalmente gerido pelo SDK do Sentry de forma segura.

❌ **Cons**:
- **Exposição de Feedback**: Requer que o usuário esteja disposto a relatar (mas o preenchimento é opcional).

📊 **Esforço**: Médio (1 a 2 horas)

---

### Opção C: Hub de Ações Sanitizadas e Error Boundary Granular
Construir um wrapper de auditoria de exceções para Server Actions e componentes críticos de UI, enviando breadcrumbs ricos (passos de navegação e inputs de formulário sanitizados) antes que o erro atinja a página em si.

* **Implementação**:
  - Criação de um utilitário centralizado de log e tratamento de erros no servidor.
  - Implementação de `ErrorBoundary` menores ao redor de componentes instáveis (como o painel de gráficos do admin) para capturar o erro de forma isolada, permitindo que o Sentry identifique a falha sem que o usuário saia da página principal.

✅ **Prós**:
- **Resiliência Máxima (UX Pro)**: A página inteira não cai; apenas o componente instável mostra um fallback, mantendo a navegação do usuário ativa.
- **Rastreabilidade Completa**: Sentry recebe todos os passos (breadcrumbs) que levaram ao erro.

❌ **Cons**:
- **Complexidade**: Aumenta o nível de acoplamento do código e exige refatorações em múltiplos pontos da aplicação.

📊 **Esforço**: Alto (4 a 6 horas)

---

## 💡 Recomendação e Implantação

**Decidido e Implantado: Opção A + Opção B (Captura Completa + User Feedback Dialog).**

### O que foi feito:
1. **Captura em Tempo de Execução (`app/error.tsx`)**: Integramos o SDK do `@sentry/nextjs` na barreira de erros das rotas da aplicação. Agora, qualquer exceção lançada dentro da navegação de páginas é devidamente reportada para a dashboard de produção do Sentry.
2. **Contexto Enriquecido**: Anexamos o metadado `digest` do Next.js e a tag `error_boundary: route-level` ao escopo de envio do erro.
3. **Formulário de Relato de Bugs**: Habilitamos o botão secundário dinâmico no `ErrorLayout` para que, se houver um `eventId` ativo retornado pelo Sentry, o usuário possa clicar em **"Reportar problema"** e acionar diretamente a janela nativa `Sentry.showReportDialog()` para descrever o cenário do erro.
4. **Validação**: Todas as suítes de teste de integração e acessibilidade rodaram e passaram perfeitamente sem regressões.

*Documento atualizado e finalizado em 19/05/2026 após implantação técnica.*
