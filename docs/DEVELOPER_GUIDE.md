# Guia do desenvolvedor

Manutenção e evolução do projeto Atravessamentos.

---

## Padrões de código

### Tailwind CSS

- Prefira tokens do tema (`bg-background`, `text-foreground`, variáveis em `app/globals.css`) em vez de hex espalhados no JSX.
- Para classes condicionais, use o helper `cn()` (`clsx` + `tailwind-merge`).

### React e Next.js

- **Server Actions**: ficam em `lib/actions/`, com `"use server"` no topo. Devem seguir o padrão de validação rigorosa com **Zod** e retorno de erros estruturados.
- **Componentes**: prefira componentes pequenos; estado e efeitos complexos vão para arquivos `"use client"` dedicados.
- **Dados**: App Router — priorize Server Components; utilize os parâmetros de busca da URL para gerir estados como a paginação.

### UI/UX e Padronização

- **Páginas Internas**: Todas as páginas de conteúdo (Acervo, Diário, Projetos, etc.) devem seguir o padrão editorial:
  1.  **Navegação**: Incluir `<BackButton />` no topo.
  2.  **Cabeçalho**: Utilizar `<PageHeader />` para títulos e descrições, mantendo a consistência tipográfica.
  3.  **Atmosfera**: Envolver o conteúdo em um container `relative isolate` e incluir `<BackgroundBlobs />` para profundidade visual.
- **Admin**: As seções administrativas devem possuir cabeçalhos claros (`border-b`, `p-4 md:p-6`) e áreas de conteúdo com "respiro" (`p-6 md:p-10`).

### Tipos e domínio

- Tipos compartilhados do site em `lib/mock-data.ts` (nomes legados; em essência espelham colunas e enums usados nas telas).

---

## 🛡️ Segurança e Validação

### Validação com Zod
Todas as mutações via Server Action devem ser validadas. Exemplo:
```typescript
const schema = zod.object({ ... });
const validatedFields = schema.safeParse(formData);
if (!validatedFields.success) {
  return { error: 'Dados inválidos' };
}
```

### Sanitização (XSS)
Para exibir conteúdo HTML proveniente do editor Tiptap, utilize o utilitário de sanitização baseado em `isomorphic-dompurify` para neutralizar scripts maliciosos.

---

## 🔢 Paginação Server-Side e Assíncrona

O projeto utiliza dois padrões de paginação para otimizar a performance e evitar listas infinitas:
1. **Baseada em URL**: Para listagens públicas e painéis administrativos tradicionais. A rota captura os `searchParams` e os injeta na Server Action (ex: `.range(start, end)`).
2. **Reativa/Assíncrona**: Para listagens dinâmicas onde não queremos recarregar a rota inteira (ex: Histórico de Transmissões da Newsletter).
   - **Hook**: `useAsyncData` (em `hooks/use-async-data.ts`) gerencia loading, erros e re-busca automática baseado em estado de página reativo.
   - **Componente**: Controles acessíveis (`<nav aria-label="...">` com `aria-current="page"`) para troca de página sem interrupções.

---

## ♿ Padrões de Acessibilidade (WCAG)

Para garantir que a plataforma Atravessamentos passe com sucesso nas auditorias automatizadas de acessibilidade (Axe/WCAG 2.1 AA) e proporcione uma navegação excelente:
- **Botões e Links com Ícones**: Qualquer botão ou link que contenha apenas ícones (ex: botão de deletar, paginações com setas, links externos como o do Resend) **deve** possuir um atributo `aria-label` explícito e autoexplicativo em português.
- **Navegação**: Agrupamentos de controles de paginação **devem** ser estruturados usando a tag `<nav>` com `aria-label` descritivo.
- **Semântica e Estado**: Links ou botões de páginas ativas devem receber `aria-current="page"` para informar leitores de tela sobre a localização atual do foco.
- **Formulários**: Todos os inputs devem ter um rótulo associado. Para formulários novos ou refatorados, prefira o componente `FloatingInput` (`components/ui/floating-input.tsx`), que já inclui a linkagem `<label htmlFor>` automaticamente.
- **Modais (Dialog)**: Todo `<DialogContent>` do Radix UI **deve** conter um `<DialogDescription>`. Se a descrição não for visualmente desejada, use a classe `sr-only` para ocultá-la visualmente enquanto mantém a acessibilidade para leitores de tela. A ausência gera warnings no console e reprova auditorias WCAG.
- **Contraste de Cores**: Evitar `text-muted-foreground` sobre fundos coloridos ou com opacidade. Sempre garantir ratio mínimo de **4.5:1** (WCAG AA). Preferir `text-foreground` sobre fundos temáticos.

---

## 🛡️ Segurança de Ambiente e Evitação de Spam

Para impedir o envio acidental de e-mails de teste para assinantes reais da newsletter em ambientes locais ou E2E:
- A função de disparo de transmissões (`broadcastNews`) conta com detecção de ambiente.
- Se executada sob `localhost`, ambiente de desenvolvimento (`development`) ou sob execução do Playwright, a lista de contatos do Resend é automaticamente filtrada, limitando o envio apenas para e-mails de teste específicos e mocks, blindando os assinantes legítimos.

---

## Fluxo de trabalho

1. Branch por funcionalidade ou correção.
2. `pnpm dev` local com `.env.local` preenchido.
3. Alterações no Supabase: migrations, RLS e **buckets de Storage** (`blog-media`, `avatars`) alinhados ao que as actions esperam.
4. Alterações Sensíveis: Variáveis de ambiente relacionadas ao Redis/KV (Rate Limit) e Sentry (Monitoramento) devem estar sincronizadas.
5. Pull request com testes e lint passando quando possível.

---

## Dependências principais

| Pacote | Uso |
|--------|-----|
| `next` | Framework, RSC, rotas |
| `@supabase/supabase-js`, `@supabase/ssr` | Banco, auth, storage |
| `motion` | Animações na interface |
| `lucide-react` | Ícones |
| Componentes Radix via shadcn | UI acessível |
| `date-fns` | Formatação de datas |
| `@tiptap/*` | Editor rico no admin |
| `react-hook-form`, `zod` | Formulários e validação |
| `@sentry/nextjs` | Monitoramento de erros e captura de falhas |
| `@upstash/ratelimit` | Prevenção de abusos de API e formulários (Rate Limiting) |

---

## 🔭 Observabilidade e Monitoramento

A infraestrutura do projeto conta com os seguintes serviços configurados para ambiente de produção:
- **Sentry**: Integrado via `sentry.*.config.ts` para capturar exceções críticas do lado do cliente, servidor e Edge (middleware). O `app/global-error.tsx` se encarrega de repassar falhas graves antes da UI de fallback.
- **Vercel Web Analytics & Speed Insights**: Coleta de pageviews e Web Vitals diretamente conectados na conta Vercel do coletivo.

---

## Testes

| Comando | Descrição |
|---------|-----------|
| `pnpm test` | Vitest, modo run único |
| `pnpm test:watch` | Vitest em modo watch |
| `pnpm exec vitest run --coverage` | Cobertura (v8); exclusões em `vitest.config.ts` |
| `pnpm test:e2e` | Playwright (`e2e/`, baseURL `http://localhost:3000`, sobe `pnpm dev` se necessário) |
| `pnpm lint` | ESLint (`eslint .`) |

As actions administrativas e os hooks customizados são testados com **Vitest**.
- **Server Actions**: Testadas em `__tests__/unit/actions.test.ts` usando mocks de `createAdminClient` e verificando asserções reais de banco de dados.
- **Hooks**: Testados em `__tests__/unit/hooks.test.ts` via `@testing-library/react`.
- **E2E**: O Playwright garante que a integração entre Redis, Supabase e UI está funcional.

---

## Comandos úteis

```bash
pnpm dev          # Desenvolvimento
pnpm build        # Build de produção
pnpm start        # Servidor após build
pnpm lint         # ESLint
```

---

## Melhorias opcionais (backlog técnico)

- CI (GitHub Actions ou similar) rodando `lint`, `test` e `build`.
- Melhoria na cobertura de testes para os novos componentes de UI.
