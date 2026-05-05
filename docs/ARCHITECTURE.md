# 🏗️ Arquitetura do Sistema

Este documento detalha a estrutura técnica e as decisões de design do projeto **Atravessamentos**.

---

## 🏗️ Estrutura de Pastas

```text
/
├── app/               # Rotas e Páginas (Next.js App Router)
│   ├── (auth)/        # Rotas de Autenticação (Login)
│   ├── admin/         # Painel Administrativo (Protegido)
│   ├── projetos/      # Páginas de listagem de projetos
│   ├── diario/        # Páginas do Blog/Diário
│   └── page.tsx       # Landing Page principal
├── components/        # Componentes React
│   ├── admin/         # Componentes específicos do Painel Admin
│   ├── landing/       # Seções da Página Inicial
│   ├── ui/            # Componentes base (Shadcn/UI)
│   └── blog/          # Componentes específicos do Diário
├── lib/               # Lógica e utilitários
│   ├── actions/       # Server Actions (CRUD Supabase)
│   ├── supabase/      # Configuração do cliente Supabase
│   └── utils.ts       # Funções utilitárias (Tailwind merge, etc)
├── public/            # Ativos estáticos (Imagens, ícones)
└── styles/            # CSS Global e Tokens
```

---

## 🔄 Fluxo de Dados

O projeto utiliza **Server Components** por padrão para garantir a melhor performance e SEO:

1. **Busca de Dados**: Realizada no lado do servidor em `app/page.tsx` e subpáginas usando as Server Actions em `lib/actions/`.
2. **Hidratação**: Os dados são passados para componentes de cliente (`"use client"`) quando interatividade é necessária (ex: animações, filtros, formulários).
3. **Mutação**: Toda gravação no banco é feita via `Server Actions`, garantindo que chaves privadas do Supabase nunca vazem para o navegador.

---

## 🎨 Sistema de Design Dinâmico

Uma das inovações deste projeto é o **Mapeamento de Cores Dinâmico**:

- **Problema**: Categorias fixas no código exigem deploy para mudar cores.
- **Solução**: O banco de dados armazena o nome da cor (ex: `rose`, `amber`, `emerald`).
- **Implementação**: O helper `getCategoryColor` mapeia esses nomes para classes Tailwind arbitrárias:
  ```typescript
  return `bg-${color}-500/15 text-${color}-700 border-${color}-500/30`
  ```

---

## 🔐 Segurança e Autenticação

- **Supabase Auth**: Gerencia usuários e sessões.
- **Middleware/Wrappers**: O `AdminWrapper` e as verificações em `lib/supabase/server` garantem que apenas usuários autenticados acessem as rotas de gerenciamento.
- **RLS (Row Level Security)**: O banco de dados possui regras que permitem leitura pública mas exigem autenticação para escrita.

---

## 🚀 Deployment

O projeto está configurado para deploy automático na **Vercel** ou plataformas similares compatíveis com Next.js.

- **Variáveis de Ambiente**: Devem ser configuradas no painel de controle do hosting.
- **Revalidação de Cache**: Usamos `revalidatePath("/")` após cada mutação de dados para garantir que a home mostre sempre o conteúdo mais recente.
