# Guia administrativo

Como gerenciar o conteúdo do site pelo painel em **`/admin`** (após login em **`/login`**).

---

## Acesso

1. Abra `/login` (ou o link equivalente indicado pelo coletivo).
2. Use o e-mail e a senha criados no **Supabase Auth** para este projeto.
3. Com sessão válida, o painel carrega em `/admin`; há abas para projetos, membros, diário, configurações e perfil.

---

## Configurações — categorias e site

### Categorias e “tags” de membros

Na área **Configurações**, gerencie a tabela de **categorias**:

- Tipos possíveis: **`post`** (diário), **`project`** (projetos), **`member`** (tags de membros).
- Cada item tem **nome**, **slug**, **cor** (nome Tailwind, ex.: `emerald`, `rose`) e **ordem** de exibição.
- As cores aparecem nos badges do site público.

### Configurações gerais do site

Ainda em Configurações, o bloco de **dados do site** (tabela `site_settings`) permite editar, entre outros:

- Texto e links do rodapé, localização (texto + URL do mapa).
- E-mail de contato, WhatsApp.
- Redes (Instagram, YouTube).
- URLs das páginas legais (privacidade, termos, acessibilidade) — normalmente caminhos como `/privacidade`, `/termos`, `/acessibilidade`.

---

## Diário (blog)

- **Título e resumo** aparecem no feed e na capa do post.
- **Conteúdo**: editor rico (**Tiptap**) — negrito, listas, links, imagens e incorporação de YouTube; o que for salvo é **HTML** exibido na página do post.
- **Categoria**: deve existir nas categorias do tipo `post`.
- **Status**: apenas **Publicado** entra no site público; rascunhos ficam só no painel.
- **Capa**: pode ser enviada como arquivo (bucket `blog-media` no Supabase).

---

## Projetos

- **Ano**, **categoria** (tipo `project`), **status** (`Publicado`, `Rascunho`, `Em revisão` no domínio atual).
- **Descrição**: texto rico (Tiptap), com campo oculto que envia o HTML ao salvar.
- **Imagem de capa**: o banco tem `cover_image`, mas o **modal atual não inclui upload de capa** — novos projetos são criados com capa nula até que isso seja implementado ou ajustado direto no Supabase.

Só projetos **Publicados** entram na listagem pública filtrada (`/projetos`).

---

## Membros

- **Papel**, **bio**, **avatar** (upload no bucket `avatars` quando aplicável).
- **Tags**: escolha entre categorias do tipo `member`.
- **Contato**: Instagram, LinkedIn, e-mail, telefone, quando preenchidos.

---

## Dicas de conteúdo

1. **Imagens**: boa resolução; avatares funcionam bem em proporção quadrada.
2. **Resumos do diário**: curtos para o feed (por volta de uma ou duas linhas na listagem).
3. **Cores**: use nomes Tailwind em **minúsculas** nas categorias, consistentes entre itens do mesmo eixo (ex.: todos os posts de um eixo com a mesma cor).

---

## Problemas comuns

- **Post ou projeto não aparece no site?** Confira se o **status** é **Publicado**.
- **Erro ao salvar?** Preencha campos obrigatórios; no diário, verifique categoria existente.
- **Cor estranha no badge?** O campo de cor na categoria deve ser um token válido do tema (nome Tailwind acordado pelo projeto).
