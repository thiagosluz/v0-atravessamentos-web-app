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

1. **Leitura**: em geral via Server Components que chamam funções em `lib/actions/*.ts` (muitas usam `createAdminClient()` para leitura no servidor, sem expor chaves ao browser).
2. **Interatividade**: dados hidratados em componentes `"use client"` (filtros, formulários, animações).
3. **Escrita**: Server Actions em `lib/actions/*-admin.ts`, `categories.ts`, `settings.ts`, etc., usando o cliente admin do Supabase e `revalidatePath` após mutações para atualizar páginas estáticas/cache.

---

## Sistema de cores dinâmico (categorias)

- Categorias no banco incluem um campo `color` com nome de cor compatível com Tailwind (ex.: `amber`, `rose`).
- Helpers no frontend mapeiam isso para classes de badge/borda coerentes com o tema.

---

## Autenticação e proteção de rotas

- **Supabase Auth** para login e sessão (cookies geridos pelo cliente SSR em `lib/supabase/server.ts`).
- **`/admin`**: a página `app/admin/page.tsx` chama `getSession()` e redireciona para `/login` se não houver usuário.
- **`/login`**: redireciona para `/admin` se já existir sessão.
- **Arquivo `proxy.ts`**: contém um `matcher` e lógica de redirect semelhante à de middleware, porém o Next.js **só executa automaticamente** um arquivo chamado **`middleware.ts`** na raiz (ou conforme a pasta `src/` do projeto). Com o layout atual, **`proxy.ts` não é invocado pelo framework**; quem mantém o repositório pode mover essa lógica para um `middleware.ts` na raiz ou remover o arquivo se optar apenas pela checagem nas páginas.
- **`lib/supabase/middleware.ts`**: função `updateSession` documentada pelo Supabase para renovar sessão no Edge; integra-se ao pipeline quando existe `middleware.ts` que a chama.

Sobre **RLS**: as políticas no Postgres continuam importantes para acesso direto ao Supabase; o app também usa **service role** em várias actions — o modelo de segurança deve ser revisado em conjunto (RLS + validação de usuário nas actions) para ambientes de produção.

---

## Deploy

- Compatível com **Vercel** (ou qualquer host com suporte a Next.js Node).
- Definir as mesmas variáveis de ambiente no painel do provedor.
- Após mutações, `revalidatePath` mantém a home e listagens alinhadas ao banco.
