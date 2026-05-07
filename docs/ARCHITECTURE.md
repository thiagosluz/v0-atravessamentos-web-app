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
│   ├── cleanup.ts          # Script global de limpeza de dados (globalTeardown)
│   └── …
├── __tests__/              # Testes Vitest (unit + setup)
├── public/                 # Estáticos
├── proxy.ts                # Lógica tipo-middleware (Supabase + redirects /admin e /login); ver nota abaixo
├── playwright.config.ts
├── vitest.config.ts
└── components.json         # Configuração shadcn/ui
```

---

## Fluxo de dados

1. **Leitura**: via Server Components que chamam funções em `lib/actions/*.ts`. Implementamos **Paginação Server-Side** nestas ações usando o método `.range()` do Supabase, retornando sempre `{ data, count }` para permitir cálculos de UI no frontend.
2. **Interatividade**: dados hidratados em componentes `"use client"` (filtros, formulários, animações). O componente `<Pagination />` gerencia a navegação sincronizada com a URL.
3. **Escrita**: Server Actions em `lib/actions/*-admin.ts`, etc., usando o cliente admin do Supabase. Agora todas as mutações são validadas com **Zod Schemas** antes de qualquer persistência.

---

## Dashboard Administrativo (Overview)

O painel central (`OverviewPanel`) utiliza uma arquitetura de agregação de dados no cliente:
- **Agregação**: Combina `projects`, `blogPosts` e `members` em uma lista unificada de atividades recentes.
- **Visualização**: Utiliza `recharts` para o gráfico de rosca de distribuição de categorias de projeto.
- **Normalização**: Uma camada de normalização de datas lida com campos disparatados (`updated_at`, `created_at`, `published_at`) para garantir a ordem cronológica correta.
- **UX Adaptativa**: O componente detecta o SO do usuário para exibir atalhos apropriados (`Cmd+K` vs `Ctrl+K`).

---

## Autenticação e proteção de rotas

- **Supabase Auth** para login e sessão (cookies geridos pelo cliente SSR em `lib/supabase/server.ts`).
- **Middleware Nativo (`middleware.ts`)**: Implementado na raiz do projeto para proteção global de rotas. Ele gerencia redirecionamentos automáticos (Ex: `/admin` -> `/login` sem sessão).
- **RLS**: As políticas no Postgres continuam importantes para acesso direto ao Supabase; o app também usa **service role** em várias actions críticas.

---

## Estratégia de Testes e Qualidade

- **Testes Unitários**: Vitest para funções puras e utilitários em `lib/utils.ts`.
- **Testes E2E**: Playwright para fluxos completos do CMS.
- **Vassoura de Dados (Cleanup)**: Implementamos um `globalTeardown` que identifica itens criados durante os testes (prefixados com `[E2E]`) e os remove automaticamente do banco ao final da execução. Isso mantém o banco de desenvolvimento livre de lixo.

---

## Deploy

- Compatível com **Vercel** (ou qualquer host com suporte a Next.js Node).
- Definir as mesmas variáveis de ambiente no painel do provedor.
- Após mutações, `revalidatePath` mantém a home e listagens alinhadas ao banco.
