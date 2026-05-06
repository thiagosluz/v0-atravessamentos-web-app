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
- **Páginas legais dinâmicas**: termos, privacidade e acessibilidade com conteúdo gerenciado via CMS e proteção XSS.
- **SEO Profissional**: metadados dinâmicos, OpenGraph e Twitter Cards automatizados por página.
- **Tema**: claro/escuro via `next-themes`.

### Painel administrativo (CMS)

- **CRUD**: projetos, membros, posts do diário e categorias.
- **Editor rico**: Tiptap nos formulários de **Diário**, **Projetos** e **Páginas Legais**.
- **Smart Media Processing**: upload inteligente com processamento via Canvas API (centralização e fundo blur automático para SEO).
- **SEO Preview**: simulador visual de Google e Redes Sociais integrado ao gerenciador de configurações.
- **Configurações do site**: tabela `site_settings` expandida para incluir identidade digital e metadados globais.
- **Autenticação**: Supabase Auth com proteção de rotas no servidor.

---

## Tech stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilo**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animação**: [Motion](https://motion.dev/)
- **Dados e auth**: [Supabase](https://supabase.com/) (Postgres + Auth + Storage)
- **Processamento de Imagem**: Canvas API (Client-side)
- **Segurança**: [isomorphic-dompurify](https://www.npmjs.com/package/isomorphic-dompurify) (Sanitização XSS)
- **Util**: [date-fns](https://date-fns.org/) (Localização pt-BR)
- **Editor**: [Tiptap](https://tiptap.dev/)
- **Analytics**: [@vercel/analytics](https://vercel.com/analytics)

---

## Como começar

### Pré-requisitos

- **Node.js 20+**
- **pnpm**

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

4. **Storage**: Certifique-se de criar o bucket `site-assets` com acesso público no Supabase para as imagens de SEO e identidade.

5. Inicie o ambiente de desenvolvimento:

```bash
pnpm dev
```

---

## Testes e qualidade

- **Vitest** (`pnpm test`): testes unitários focados nas Server Actions.
- **Playwright** (`pnpm test:e2e`): fluxos de navegação e CRUD no navegador.
- **ESLint** (`pnpm lint`).

---

## Documentação no repositório

| Documento | Conteúdo |
|-----------|----------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Pastas, fluxo de dados, auth, deploy |
| [docs/SEO.md](docs/SEO.md) | Estratégia de SEO Global e Contextual 🆕 |
| [docs/COMPONENTS.md](docs/COMPONENTS.md) | Guia técnico de Smart Upload e SEO Preview 🆕 |
| [docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md) | Uso do painel para editores |
| [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) | Padrões e comandos para quem desenvolve |

---

## Licença

Este projeto é desenvolvido para o Coletivo Atravessamentos e está sob a [Licença MIT](LICENSE).

---

<div align="center">
  <p>Desenvolvido com ❤️ para a arte e educação de Jataí.</p>
</div>
