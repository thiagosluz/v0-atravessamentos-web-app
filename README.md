# Atravessamentos - CMS & Portfólio Coletivo

Plataforma oficial do coletivo **Atravessamentos**.

> **"Corpo coletivo que escuta, sonha e age. Travessia, afeto, política e criação."**

O Atravessamentos é uma plataforma digital dedicada a preservar e difundir a memória, os projetos e as reflexões de um coletivo artístico e educativo nascido em Jataí — GO. O site combina uma estética orgânica e moderna com um sistema de gerenciamento de conteúdo (CMS) integrado ao Supabase.

---

## 🚀 Funcionalidades Principais

- 🌑 **Modo Escuro e Design System**: Estética orgânica com cores tailoreadas e animações de órbita.
- 📊 **Dashboard Administrativo**: Visão geral de métricas, atividades recentes e gráficos de distribuição.
- ⌨️ **Centro de Comando (Cmd+K / Ctrl+K)**: Navegação ultra-rápida entre todas as seções do admin.
- 🔄 **UX Premium**: Transições de página fluidas, esqueletos de carregamento (Skeletons) e animações motion.
- 🔍 **SEO de Elite**: Sitemap dinâmico, metadados automáticos e OpenGraph para compartilhamento social.
- 📧 **Newsletter e Broadcast**: Disparo automático de e-mails com identidade visual ao publicar novas notícias.
- 🧹 **Testes E2E com Limpeza**: Infraestrutura robusta com limpeza automática no Supabase.
- 🗺️ **Roadmap de Qualidade**: Estratégia de estabilização e performance detalhada em [ROADMAP_OPTIMIZATION.md](./ROADMAP_OPTIMIZATION.md).

## 🛠️ Tecnologias

- **Frontend**: Next.js 16 (App Router + Turbopack), Tailwind CSS 4, Motion (ex-Framer Motion).
- **Backend**: Supabase (Auth, Database, Storage), Server Actions.
- **Visualização**: Recharts para o dashboard administrativo.
- **Testes**: Playwright (E2E) e Vitest (Unitários).
- **SEO**: Metadados dinâmicos, Sitemap.xml e Robots.txt integrados.
- **E-mail**: Resend (Delivery), React Email (Templates), Resend Audiences (Gestão).
- **Editor**: Tiptap Rich Text Editor customizado.
- **Monitoramento**: Sentry (Error Tracking), Vercel Speed Insights + Web Analytics.
- **Cache & Rate Limit**: Upstash Redis (KV) via `@upstash/redis` e `@upstash/ratelimit`.

## 📦 Estrutura de Pastas

O projeto utiliza a estrutura padrão do Next.js App Router com separação clara de domínios:

- `app/`: Rotas públicas e administrativas.
- `components/`: Componentes modulares (admin, landing, UI).
- `lib/actions/`: Lógica de negócio e mutações via Server Actions.
- `e2e/`: Suíte de testes ponta-a-ponta.

## 🚦 Início Rápido

### Instalação

```bash
pnpm install
```

### Configuração

Crie um arquivo `.env.local` com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=sua-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
RESEND_API_KEY=re_sua_chave_resend
RESEND_AUDIENCE_ID=seu_audience_id
KV_REST_API_URL=sua_url_kv
KV_REST_API_TOKEN=seu_token_kv
NEXT_PUBLIC_SENTRY_DSN=seu_dsn_sentry  # Opcional local — injetado pela Vercel em prod
```

### Desenvolvimento

```bash
pnpm dev
```

### Testes

```bash
# Unitários
pnpm test

# E2E (Playwright)
pnpm test:e2e
```

---
Desenvolvido com afeto para o Coletivo Atravessamentos.
