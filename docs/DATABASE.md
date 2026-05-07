# Banco de dados (Supabase)

PostgreSQL no **Supabase**, consumido pelo app via **Supabase JS** e **Server Actions**. Os nomes de colunas abaixo seguem o que o código usa ao ler/gravar (`snake_case` no Postgres, mapeado para `camelCase` em alguns retornos).

---

## Tabelas principais

### `categories`

Categorias do diário, dos projetos e tags de membros.

| Coluna | Tipo | Notas |
|--------|------|--------|
| `id` | uuid | PK |
| `name` | text | Nome exibido |
| `slug` | text | Identificador estável |
| `type` | text | `post` \| `project` \| `member` |
| `color` | text | Nome para o tema (ex.: `amber`, `rose`) |
| `sort_order` | int | Ordem na UI |
| `created_at` | timestamptz | |

Constraint típica de `type`: `CHECK (type IN ('post', 'project', 'member'))`.

---

### `blog_posts`

Posts do diário.

| Coluna | Tipo | Notas |
|--------|------|--------|
| `id` | uuid | PK |
| `title` | text | |
| `slug` | text | Único; usado em `/diario/[slug]` |
| `excerpt` | text | Resumo no feed |
| `content` | text | HTML do Tiptap |
| `category` | text | Nome da categoria (referência por nome, não FK) |
| `author` | text | |
| `read_time` | text | Ex.: "5 min" |
| `status` | text | No código admin: `Publicado` \| `Rascunho` |
| `published_at` | timestamptz | Ordenação e data pública |
| `cover_image` | text | URL (ex.: Storage público) |

O site público lista apenas linhas com `status = 'Publicado'`.

---

### `projects`

Projetos e ações do coletivo.

| Coluna | Tipo | Notas |
|--------|------|--------|
| `id` | uuid | PK |
| `title` | text | |
| `description` | text | Pode conter HTML (editor rico) |
| `year` | int | Usado na linha do tempo / filtros |
| `status` | text | `Ativo` \| `Concluído` \| `Em Desenvolvimento` (conforme Zod Schema no admin) |
| `category` | text | Nome da categoria |
| `cover_image` | text | URL opcional |
| `updated_at` | timestamptz | Atualizado nas mutações → ordenação em `getProjects` |

A listagem pública filtrada usa `status = 'Publicado'`.

---

### `members`

Integrantes.

| Coluna | Tipo | Notas |
|--------|------|--------|
| `id` | uuid | PK |
| `name` | text | Também usado para achar posts do diário onde `author` = nome |
| `role` | text | |
| `bio` | text | |
| `avatar` | text | URL |
| `tags` | text[] | Nomes alinhados a categorias `type = 'member'` |
| `instagram` | text | Opcional |
| `linkedin` | text | Opcional |
| `email` | text | Opcional |
| `phone` | text | Opcional |
| `created_at` | timestamptz | Ordenação em `getMembers` |

---

### `site_settings`

Configurações únicas do rodapé e contatos (o código assume registro com `id = 1` no `update`).

Campos usados em `lib/actions/settings.ts`, entre outros: `footer_description`, `location_text`, `location_url`, `instagram_url`, `youtube_url`, `contact_email`, `whatsapp_number`, `privacy_policy_url`, `terms_url`, `accessibility_url`, `updated_at`.

Se a tabela estiver vazia ou houver erro na leitura, a action devolve **valores padrão** em código.

---

### `contact_messages`

Persistência das mensagens enviadas pelo formulário de contato público.

| Coluna | Tipo | Notas |
|--------|------|--------|
| `id` | uuid | PK |
| `created_at` | timestamptz | |
| `name` | text | |
| `email` | text | |
| `category` | text | `Parceria` \| `Edital` \| `Colaboração` \| `Trabalho` \| `Outros` |
| `subject` | text | |
| `message` | text | |
| `status` | text | `Lido` \| `Respondido` |

As mensagens são gravadas via **Admin Client** (Service Role) a partir da Server Action `sendContactMessage`, ignorando RLS para garantir a captura do contato mesmo sem autenticação do remetente.

---

## Storage (buckets)

Conforme as Server Actions:

- **`blog-media`**: imagens de capa / mídia de posts (`blog-admin.ts`).
- **`avatars`**: fotos de membros (`members-admin.ts`).
- **`site-assets`**: imagens globais, favicons e metadados de SEO (`settings.ts`).

Configure políticas de Storage no Supabase para leitura pública onde necessário e escrita apenas para o perfil de serviço ou usuários autenticados, conforme a política de segurança do coletivo.

---

## Relacionamentos

Categorias são referenciadas por **nome** (e eventualmente slug) nos registros de posts e projetos, não por FK obrigatória — simplifica formulários e troca de rótulos, com o trade-off de manter nomes consistentes.

---

## RLS e políticas (exemplo)

Habilite RLS nas tabelas expostas e defina políticas explícitas por operação (`SELECT`, `INSERT`, `UPDATE`, `DELETE`). Exemplo **ilustrativo** só para leitura pública em posts:

```sql
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leitura_publica_blog"
ON blog_posts
FOR SELECT
USING (true);

-- Políticas de INSERT/UPDATE/DELETE para papéis autenticados ou service role
-- devem ser criadas separadamente, de acordo com o modelo de permissão desejado.
```

Ajuste sempre ao esquema e aos papéis reais do projeto (incluindo uso de **service role** no backend, que ignora RLS).

---

## Scripts úteis

### Constraint de `categories.type`

```sql
ALTER TABLE categories
DROP CONSTRAINT IF EXISTS categories_type_check;

ALTER TABLE categories
ADD CONSTRAINT categories_type_check
CHECK (type IN ('post', 'project', 'member'));
```

Se a base foi criada com nomes de colunas diferentes dos usados nas actions (ex.: `image_url` em vez de `cover_image`), será necessário migrar colunas ou views para coincidir com o código.
