# Arquitetura do sistema

Visão técnica do projeto **Atravessamentos** (Next.js App Router + Supabase).

---

## Estrutura de pastas (resumo)

```text
/
├── app/                    # Rotas e páginas (App Router)
│   ├── layout.tsx          # Layout raiz, fontes, ThemeProvider, globals.css
│   ├── globals.css         # CSS global e variáveis de tema (Tailwind 4)
│   ├── page.tsx            # Landing (home)
│   ├── login/              # Login (não usa grupo (auth); rota explícita)
│   ├── membros/[id]/       # Perfil público do membro
│   ├── admin/              # Painel CMS (sessão obrigatória na página)
│   ├── projetos/           # Listagem e detalhe de projeto
│   ├── diario/             # Arquivo do blog e post por slug
│   └── (legal)/            # Termos, privacidade, acessibilidade
├── components/
│   ├── admin/              # Dashboard, formulários, RichTextEditor (Tiptap)
│   ├── landing/            # Seções da home
│   ├── blog/               # Feed e UI do diário
│   ├── ui/                 # Componentes shadcn/ui
│   ├── theme-provider.tsx
│   └── …
├── lib/
│   ├── actions/            # Server Actions ("use server") — CRUD e leituras
│   ├── supabase/
│   │   ├── server.ts       # Cliente Supabase em Server Components / Actions (cookies)
│   │   ├── admin.ts        # Cliente com service role (servidor apenas)
│   │   └── middleware.ts   # updateSession (helper para uso em middleware Next)
│   ├── mock-data.ts        # Tipos TypeScript espelhando o domínio / colunas DB
│   └── utils.ts
├── e2e/                    # Testes Playwright
├── __tests__/              # Testes Vitest (unit + setup)
├── public/                 # Estáticos
├── proxy.ts                # Lógica tipo-middleware (Supabase + redirects /admin e /login); ver nota abaixo
├── playwright.config.ts
├── vitest.config.ts
└── components.json         # Configuração shadcn/ui
```

Há também `styles/globals.css` no repositório; o layout ativo importa **`app/globals.css`**.

---

## Fluxo de dados

1. **Leitura**: via Server Components que chamam funções em `lib/actions/*.ts`. Implementamos **Paginação Server-Side** nestas ações usando o método `.range()` do Supabase, retornando sempre `{ data, count }` para permitir cálculos de UI no frontend.
2. **Interatividade**: dados hidratados em componentes `"use client"` (filtros, formulários, animações). O componente `<Pagination />` gerencia a navegação sincronizada com a URL.
3. **Escrita**: Server Actions em `lib/actions/*-admin.ts`, etc., usando o cliente admin do Supabase. Agora todas as mutações são validadas com **Zod Schemas** antes de qualquer persistência.

---

## Sistema de cores dinâmico (categorias)

- Categorias no banco incluem um campo `color` com nome de cor compatível com Tailwind (ex.: `amber`, `rose`).
- Helpers no frontend mapeiam isso para classes de badge/borda coerentes com o tema.

---

## Autenticação e proteção de rotas

- **Supabase Auth** para login e sessão (cookies geridos pelo cliente SSR em `lib/supabase/server.ts`).
- **Middleware Nativo (`middleware.ts`)**: Implementado na raiz do projeto para proteção global de rotas. Ele gerencia redirecionamentos automáticos (Ex: `/admin` -> `/login` sem sessão) e garante que o usuário esteja autenticado antes mesmo da página carregar no servidor.
- **`/admin`**: Protegida pelo Middleware e reforçada por checagens de sessão no Server Component da página.
- **`lib/supabase/middleware.ts`**: Utilizado pelo `middleware.ts` principal para renovar tokens de sessão a cada requisição (refresh de cookies).

Sobre **RLS**: as políticas no Postgres continuam importantes para acesso direto ao Supabase; o app também usa **service role** em várias actions — o modelo de segurança deve ser revisado em conjunto (RLS + validação de usuário nas actions) para ambientes de produção.

---

## Deploy

- Compatível com **Vercel** (ou qualquer host com suporte a Next.js Node).
- Definir as mesmas variáveis de ambiente no painel do provedor.
- Após mutações, `revalidatePath` mantém a home e listagens alinhadas ao banco.
