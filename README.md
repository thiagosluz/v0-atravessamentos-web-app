# Atravessamentos — Coletivo e Memória

![Atravessamentos Hero](public/hero-preview.png)

> **"Corpo coletivo que escuta, sonha e age. Travessia, afeto, política e criação."**

O Atravessamentos é uma plataforma digital dedicada a preservar e difundir a memória, os projetos e as reflexões de um coletivo artístico e educativo nascido em Jataí — GO. O site combina uma estética orgânica e moderna com um sistema de gerenciamento de conteúdo (CMS) potente e dinâmico.

---

## ✨ Funcionalidades Principais

### 🌐 Portal Público
- **Hero Dinâmico**: Tipografia artística com sobreposição ("Typographic Overlap") que reforça o conceito de "atravessamento".
- **Arquivo de Projetos**: Linha do tempo e galeria de ações do coletivo com filtragem por categorias.
- **Diário (Blog)**: Espaço de escrita e reflexão com feed cronológico.
- **Coletivo (Membros)**: Galeria de integrantes com tags dinâmicas e perfis detalhados.
- **Design Orgânico**: Interface fluida com formas mutáveis, animações suaves e paleta de cores curada.

### 🔐 Painel Administrativo (CMS)
- **Gestão de Conteúdo**: CRUD completo para Projetos, Membros e Posts do Diário.
- **Metadados Gerenciáveis**: Sistema centralizado para gerenciar categorias e tags com cores customizáveis via banco de dados.
- **Dashboard de Controle**: Visão geral de métricas e status de publicação.
- **Segurança**: Autenticação via Supabase Auth com proteção de rotas no servidor.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Animações**: [Motion (framer-motion)](https://motion.dev/)
- **Banco de Dados & Auth**: [Supabase](https://supabase.com/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)

---

## 🚀 Como Começar

### Pré-requisitos
- Node.js 18+
- pnpm (recomendado) ou npm

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
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

4. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

---

## 🧪 Testes Automatizados

O projeto conta com uma suíte de testes completa para garantir a estabilidade das funcionalidades críticas.

### Testes E2E (Playwright)
Validam os fluxos de ponta a ponta, desde o login até a criação e publicação de conteúdo no site público.
- **Executar todos os testes:** `npx playwright test`
- **Executar um teste específico:** `npx playwright test e2e/cms.spec.ts`
- **Ver relatório:** `npx playwright show-report`

> **Nota:** Para rodar os testes E2E, o servidor de desenvolvimento deve estar acessível em `http://localhost:3000`.

### Testes Unitários (Vitest)
Validam lógicas isoladas, helpers e componentes de UI.
- **Executar:** `pnpm test`
- **Modo Watch:** `npx vitest`

### Credenciais de Teste
Para desenvolvimento local e automação, utilizamos um usuário de teste padrão:
- **E-mail:** `test@atravessamentos.com`
- **Senha:** `password123`

---

## 📖 Documentação Detalhada

Para entender melhor a estrutura e manutenção do projeto, consulte:

- 🏗️ **[Arquitetura do Sistema](docs/ARCHITECTURE.md)**: Visão técnica e fluxo de dados.
- 📂 **[Guia do Banco de Dados](docs/DATABASE.md)**: Esquemas das tabelas e relacionamentos.
- 👤 **[Guia Administrativo](docs/ADMIN_GUIDE.md)**: Como gerenciar o conteúdo do site.
- 💻 **[Guia do Desenvolvedor](docs/DEVELOPER_GUIDE.md)**: Padrões de código e deployment.

---

## 📄 Licença

Este projeto é desenvolvido para o Coletivo Atravessamentos. Todos os direitos reservados.

---

<div align="center">
  <p>Desenvolvido com ❤️ para a arte e educação de Jataí.</p>
</div>
