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

### 4. Integrações Externas

#### 📧 Resend (E-mail Marketing)
- **Broadcast**: Disparo em lote (`batch.send`) via Server Actions.
- **React Email**: Utilizado para renderizar templates HTML seguros e responsivos com Tailwind CSS.

#### 📦 Vercel KV (Redis)
- **Caching Layer**: Cache de alta performance para o Acervo (Galeria) com invalidação automática em mutações.
- **Rate Limiting**: Proteção de endpoints de formulários (Contato, Newsletter) usando algoritmo de janela deslizante via `@upstash/ratelimit`.

### 5. Fluxos de Dados Críticos

1. **Leitura**: via Server Components que chamam funções em `lib/actions/*.ts`. Implementamos uma **Camada de Cache** (Redis) para ativos da galeria, reduzindo a carga no Supabase e acelerando navegações subsequentes.
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

## 🎨 Design System & UX (Motion)

O projeto utiliza uma estratégia de "Perceived Performance" (Performance Percebida) avançada:
- **Transições de Página**: Implementadas via `app/template.tsx` com `motion/react`, garantindo um fade-in orgânico em cada navegação.
- **Skeletons**: Áreas de alto impacto como o Dashboard, Arquivo de Projetos e Diário utilizam esqueletos de carregamento que espelham o layout real para evitar Layout Shifts.
- **Micro-interações**: Toggle de tema orbital e feedbacks visuais em botões elevam a sensação de produto premium.

---

## 🔍 Estratégia de SEO

A aplicação é otimizada para visibilidade máxima:
- **Sitemap Dinâmico**: Gerado em `app/sitemap.ts`, indexando automaticamente novos projetos e posts.
- **MetadataBase**: Configurado em `app/layout.tsx` para o domínio `atravessamentos.com.br`.
- **OpenGraph Dinâmico**: Cada post do blog e projeto gera metadados específicos para redes sociais (WhatsApp, Instagram, etc) via `generateMetadata`.

---

## 📬 Sistema de Contato e Comunicação

O fluxo de contato utiliza uma arquitetura híbrida para máxima resiliência e segurança:
- **Fluxo de Dados**: `Formulário (Client)` -> `Server Action (Server)` -> `Supabase (DB)` -> `Resend (Email)`.
- **Persistência**: Todas as mensagens são salvas na tabela `contact_messages` via **Service Role**, permitindo que o coletivo tenha um backup caso o e-mail não chegue.
- **Anti-Spam**: Proteção multicamada com **Honeypot** (campo invisível), **Zod Validation** e **Rate Limiting via Redis** (5 requisições / 10 segundos por IP).
- **Entrega**: Integração com a API do **Resend** para entrega de e-mails transacionais com templates HTML limpos.

---

## Deploy

- Compatível com **Vercel** (ou qualquer host com suporte a Next.js Node).
- Definir as mesmas variáveis de ambiente no painel do provedor.
- Após mutações, `revalidatePath` mantém a home e listagens alinhadas ao banco.
