# Sistema de Recomendações por Afinidade (Diário)

Este documento descreve o funcionamento do sistema de "Leituras Relacionadas" implementado no Diário do coletivo Atravessamentos.

## 🧠 Lógica de Funcionamento

O sistema utiliza um algoritmo de **afinidade temática** baseado em dois eixos principais: **Tags** e **Categorias**.

### 1. Captura de Dados
No painel administrativo, cada post agora possui um campo de "Palavras-chave (Tags)". 
- O autor insere tags separadas por vírgula.
- O sistema processa essas strings, remove espaços extras e as armazena como um array de strings (`TEXT[]`) no PostgreSQL.

### 2. Algoritmo de Recomendação (`getRelatedPosts`)
A função de busca (`lib/actions/blog-posts.ts`) segue os seguintes critérios de ranqueamento para sugerir 3 posts:

1.  **Interseção de Tags (Peso Máximo)**: Posts que compartilham o maior número de palavras-chave com o post atual são priorizados.
2.  **Mesma Categoria (Peso Secundário)**: Se houver empate ou poucas tags em comum, posts da mesma categoria (ex: Reflexão, Manifesto) são priorizados.
3.  **Recência (Critério de Desempate)**: Posts publicados mais recentemente têm prioridade sobre posts antigos.
4.  **Exclusão**: O post que está sendo lido atualmente é sempre excluído da lista de sugestões.

## 🛠️ Implementação Técnica

- **Banco de Dados**: Tabela `blog_posts`, coluna `tags` (TEXT[]).
- **Backend**: Utiliza o operador `.overlap` (ou `ov`) do PostgreSQL via Supabase para encontrar interseções de arrays de forma performática.
- **Frontend**: Componente `RelatedReadings` (`components/blog/related-readings.tsx`) renderizado via Server Component para SEO e performance.

## 🚀 Como usar no Admin
Para que as recomendações sejam precisas:
1. Use tags específicas (ex: `cerrado`, `audiovisual`, `educação popular`).
2. Tente manter um padrão de escrita para as tags (sempre no singular ou sempre no plural).
3. Posts sem tags usarão apenas a Categoria como critério de recomendação.

---
*Documentação atualizada em 14 de maio de 2026.*
