# Atravessamentos - CMS & Portfólio Coletivo

Plataforma oficial do coletivo **Atravessamentos**.

> **"Corpo coletivo que escuta, sonha e age. Travessia, afeto, política e criação."**

O Atravessamentos é uma plataforma digital dedicada a preservar e difundir a memória, os projetos e as reflexões de um coletivo artístico e educativo nascido em Jataí — GO. O site combina uma estética orgânica e moderna com um sistema de gerenciamento de conteúdo (CMS) integrado ao Supabase.

---

## 🚀 Funcionalidades Principais

- 🌑 **Modo Escuro nativo**: Design moderno e focado em acessibilidade.
- 📊 **Dashboard Administrativo**: Visão geral de métricas, atividades recentes e gráficos de distribuição de conteúdo.
- ⌨️ **Centro de Comando (Cmd+K / Ctrl+K)**: Navegação ultra-rápida entre todas as seções do admin.
- 🔄 **Navegação Integrada**: Transição fluida entre o site público e a área de gestão.
- 🧹 **Testes E2E com Limpeza Automática**: Infraestrutura de testes robusta que não polui o banco de dados.

## 🛠️ Tecnologias

- **Frontend**: Next.js 15+ (App Router), Tailwind CSS 4, Framer Motion.
- **Backend**: Supabase (Auth, Database, Storage), Server Actions.
- **Visualização**: Recharts para o dashboard administrativo.
- **Testes**: Playwright (E2E) e Vitest (Unitários).
- **Editor**: Tiptap Rich Text Editor customizado.

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
