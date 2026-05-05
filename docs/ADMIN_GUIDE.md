# 👤 Guia Administrativo

Este guia explica como gerenciar o conteúdo do site Atravessamentos através do Painel Administrativo.

---

## 🔑 Acesso ao Painel
1. Acesse o link de login (ex: `/login` ou via botão "Área Restrita" no rodapé).
2. Insira suas credenciais cadastradas no Supabase Auth.
3. Você será redirecionado para o Dashboard.

---

## 📂 Gerenciando Categorias e Tags (O Coração do Site)
Antes de criar posts ou membros, você deve configurar as categorias em **Configurações**:

### 1. Categorias do Diário e Projetos
- Escolha um nome e uma **Cor**.
- As cores usam o sistema Tailwind (ex: `amber`, `rose`, `sky`).
- A cor escolhida aparecerá automaticamente nos "badges" (etiquetas) no site.

### 2. Tags de Membros
- Defina especialidades (ex: "Pesquisadora", "Artista").
- Essas tags estarão disponíveis para seleção no formulário de membros.

---

## ✍️ Criando Conteúdo

### 📅 Diário (Blog)
- **Título e Resumo**: Aparecem no feed principal.
- **Categoria**: Selecione uma das categorias cadastradas anteriormente.
- **Status**: Mude para "Publicado" para que apareça no site.

### 🚀 Projetos
- **Ano**: Define a posição na linha do tempo.
- **Imagem de Capa**: Use URLs de imagens hospedadas ou caminhos locais.

### 👥 Membros
- **Papel Principal**: Ex: "Cineasta e Educadora".
- **Tags**: Clique nos badges para selecionar as especialidades. Você pode selecionar múltiplas tags.
- **Links**: Redes sociais e contato.

---

## 💡 Dicas para um Conteúdo Bonito

1. **Imagens**: Tente usar imagens com boa resolução. Para fotos de membros, prefira fotos quadradas (1:1).
2. **Resumos**: Mantenha os resumos do diário curtos (até 150 caracteres) para manter o feed organizado.
3. **Cores**: Tente variar as cores das categorias para que o site fique vibrante, mas mantenha uma consistência (ex: todos os projetos de "Educação" com a mesma cor).

---

## ⚠️ Solução de Problemas
- **O conteúdo não aparece?** Verifique se o status está como "Publicado".
- **Erro ao salvar?** Certifique-se de que todos os campos obrigatórios (*) foram preenchidos.
- **As cores estão erradas?** Verifique se o nome da cor em Configurações está escrito corretamente (apenas letras minúsculas, ex: `emerald`).
