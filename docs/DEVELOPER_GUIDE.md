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

## 🔢 Paginação Server-Side

O projeto utiliza paginação baseada em URL para as listagens administrativas e públicas.
- **Componente**: `<Pagination />` em `components/admin/pagination.tsx`.
- **Lógica**: A página (ex: `/admin`) captura os `searchParams` e os injeta nas Server Actions.
- **Consultas**: Utilize `page` e `limit` para calcular o `.range(start, end)` nas chamadas ao Supabase.

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

As actions administrativas são testadas com **mocks** de `createAdminClient`; isso garante regressão na lógica das funções sem bater no Supabase real.

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
