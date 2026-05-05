# Guia do desenvolvedor

Manutenção e evolução do projeto Atravessamentos.

---

## Padrões de código

### Tailwind CSS

- Prefira tokens do tema (`bg-background`, `text-foreground`, variáveis em `app/globals.css`) em vez de hex espalhados no JSX.
- Para classes condicionais, use o helper `cn()` (`clsx` + `tailwind-merge`).

### React e Next.js

- **Server Actions**: ficam em `lib/actions/`, com `"use server"` no topo dos arquivos que exportam ações.
- **Componentes**: prefira componentes pequenos; estado e efeitos complexos vão para arquivos `"use client"` dedicados.
- **Dados**: App Router — priorize Server Components; passe props para clients quando precisar de interatividade.

### Tipos e domínio

- Tipos compartilhados do site em `lib/mock-data.ts` (nomes legados; em essência espelham colunas e enums usados nas telas).

---

## Fluxo de trabalho

1. Branch por funcionalidade ou correção.
2. `pnpm dev` local com `.env.local` preenchido.
3. Alterações no Supabase: migrations, RLS e **buckets de Storage** (`blog-media`, `avatars`) alinhados ao que as actions esperam.
4. Pull request com testes e lint passando quando possível.

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

- Monitoramento de erros em produção (ex.: Sentry).
- CI (GitHub Actions ou similar) rodando `lint`, `test` e `build`.
- `middleware.ts` na raiz integrando `updateSession` e políticas de redirect, se desejado no Edge.
