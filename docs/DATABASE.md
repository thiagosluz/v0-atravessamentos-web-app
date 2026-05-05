# 📂 Guia do Banco de Dados (Supabase)

O Atravessamentos utiliza o **PostgreSQL** hospedado no Supabase. Abaixo estão as especificações das tabelas e o esquema necessário para o funcionamento do site.

---

## 📋 Tabelas principais

### 1. `categories`
Armazena as categorias para posts, projetos e tags de membros.
- `id` (uuid, primary key)
- `name` (text): Nome visível (ex: "Educação")
- `slug` (text): Identificador para URL
- `type` (text): Valores permitidos: `post`, `project`, `member`
- `color` (text): Nome da cor Tailwind (ex: `amber`, `rose`, `indigo`)
- `sort_order` (int): Ordem de exibição
- `created_at` (timestamp)

### 2. `blog_posts`
Posts do Diário.
- `id` (uuid, primary key)
- `title` (text)
- `slug` (text, unique)
- `excerpt` (text): Resumo para o feed
- `content` (text): Conteúdo completo
- `category` (text): Nome da categoria associada
- `published_at` (timestamp)
- `image_url` (text): Imagem de capa
- `status` (text): `Publicado`, `Rascunho`, `Em revisão`

### 3. `projects`
Projetos e ações do coletivo.
- `id` (uuid, primary key)
- `title` (text)
- `description` (text)
- `year` (text): Ex: "2024"
- `status` (text): `Ativo`, `Finalizado`
- `category` (text): Categoria principal
- `image_url` (text)
- `order` (int)

### 4. `members`
Integrantes do coletivo.
- `id` (uuid, primary key)
- `name` (text)
- `role` (text): Papel principal (ex: "Pesquisadora")
- `bio` (text)
- `avatar` (text): URL da foto de perfil
- `tags` (text[]): Array de tags (referenciando nomes em `categories` do tipo `member`)
- `instagram` (text)
- `linkedin` (text)
- `email` (text)

---

## 🛠️ Scripts SQL Necessários

### Correção de Constraints (Importante)
Se você estiver recebendo erros ao salvar novos tipos de categorias, certifique-se de atualizar as travas do banco:

```sql
-- Atualiza os tipos permitidos de categorias
ALTER TABLE categories 
DROP CONSTRAINT IF EXISTS categories_type_check;

ALTER TABLE categories 
ADD CONSTRAINT categories_type_check 
CHECK (type IN ('post', 'project', 'member'));
```

### Configuração de RLS (Row Level Security)
Permitir que qualquer pessoa leia o conteúdo, mas apenas admins (autenticados) editem:

```sql
-- Exemplo para a tabela blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso público de leitura" ON blog_posts
FOR SELECT USING (true);

CREATE POLICY "Acesso total para admins autenticados" ON blog_posts
USING (auth.role() = 'authenticated');
```

---

## 🔄 Relacionamentos
O sistema utiliza uma abordagem de **Referência por Nome/Slug** para as categorias, simplificando as consultas e permitindo que a troca de nomes no banco seja refletida dinamicamente na UI sem JOINS complexos no frontend.
