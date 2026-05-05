# Atravessamentos — Coletivo e Memória

![Atravessamentos Hero](public/hero-preview.png)

> **"Corpo coletivo que escuta, sonha e age. Travessia, afeto, política e criação."**

O Atravessamentos é uma plataforma digital dedicada a preservar e difundir a memória, os projetos e as reflexões de um coletivo artístico e educativo nascido em Jataí — GO. O site combina uma estética orgânica e moderna com um sistema de gerenciamento de conteúdo (CMS) integrado ao Supabase.

---

## ✨ Funcionalidades principais

### Portal público

- **Hero**: tipografia com sobreposição (“Typographic Overlap”) no conceito de atravessamento.
- **Projetos**: listagem em `/projetos`, detalhe em `/projetos/[id]`, com filtro por categoria e busca.
- **Diário (blog)**: arquivo em `/diario` (paginação, filtro por categoria, busca) e post em `/diario/[slug]`.
- **Membros**: perfis em `/membros/[id]` e seção na landing.
- **Páginas legais**: termos, privacidade e acessibilidade em rotas agrupadas em `app/(legal)/`.
- **Tema**: claro/escuro via `next-themes`.

### Painel administrativo (CMS)

- **CRUD**: projetos, membros, posts do diário e categorias (tipos `post`, `project`, `member`).
- **Editor rico**: Tiptap nos formulários de **Diário** e **Projetos** (HTML gravado no banco).
- **Mídia**: uploads para buckets do Supabase Storage (`blog-media`, `avatars`).
- **Configurações do site**: tabela `site_settings` (rodapé, localização, redes, e-mail, WhatsApp, URLs legais).
- **Autenticação**: Supabase Auth; `/admin` exige sessão válida (verificação no servidor na página).

---

## Tech stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilo**: [Tailwind CSS 4](https://tailwindcss.com/), tokens em `app/globals.css`
- **Animação**: [Motion](https://motion.dev/)
- **Dados e auth**: [Supabase](https://supabase.com/) (Postgres + Auth + Storage)
- **UI**: [shadcn/ui](https://ui.shadcn.com/) (Radix), [Lucide](https://lucide.dev/)
- **Formulários / validação**: React Hook Form, Zod
- **Editor**: [Tiptap](https://tiptap.dev/) (`@tiptap/react`, starter-kit, link, image, YouTube, placeholder)
- **Analytics** (produção): [@vercel/analytics](https://vercel.com/analytics)

---

## Como começar

### Pré-requisitos

- **Node.js 20+** (recomendado para Next.js 16)
- **pnpm** (o repositório usa `pnpm-lock.yaml`)

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/thiagosluz/v0-atravessamentos-web-app.git
cd v0-atravessamentos-web-app
```

2. Instale as dependências:

```bash
pnpm install
```

3. Configure as variáveis de ambiente (`.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=seu_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

A chave **service role** é usada nas Server Actions que conversam com o banco e o Storage no servidor. Mantenha-a apenas em ambiente seguro; nunca exponha no cliente.

4. Inicie o ambiente de desenvolvimento:

```bash
pnpm dev
```

---

## Testes e qualidade

- **Vitest** (`pnpm test`): testes unitários com mocks do Supabase, focados nas Server Actions e utilitários. Relatório de cobertura: `pnpm exec vitest run --coverage` (trechos como `e2e/`, `proxy.ts` e configs costumam ficar fora do escopo — ver `vitest.config.ts`).
- **Playwright** (`pnpm test:e2e`): fluxos no navegador; sobe `pnpm dev` automaticamente quando não está em CI (ver `playwright.config.ts`).
- **ESLint** (`pnpm lint`).

Credenciais de exemplo para testes locais (conforme usuário criado no Supabase do ambiente de desenvolvimento):

- **E-mail:** `test@atravessamentos.com`
- **Senha:** `password123`

---

## Documentação no repositório

| Documento | Conteúdo |
|-----------|----------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Pastas, fluxo de dados, auth, deploy |
| [docs/DATABASE.md](docs/DATABASE.md) | Tabelas, colunas alinhadas ao código, Storage |
| [docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md) | Uso do painel para editores |
| [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) | Padrões e comandos para quem desenvolve |
| [docs/plan_tiptap_editor.md](docs/plan_tiptap_editor.md) | Plano histórico do editor rico e melhorias opcionais |

---

## Licença

Este projeto é desenvolvido para o Coletivo Atravessamentos. Todos os direitos reservados.

---

<div align="center">
  <p>Desenvolvido com ❤️ para a arte e educação de Jataí.</p>
</div>
