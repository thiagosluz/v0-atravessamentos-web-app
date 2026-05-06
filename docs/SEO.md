# Estratégia de SEO e Identidade Digital

O projeto **Atravessamentos** utiliza uma estratégia híbrida de SEO que combina configurações globais da marca com otimizações contextuais por página.

## 🏗️ Arquitetura Técnica

A gestão de metadados é centralizada no utilitário `lib/utils/seo.ts`, que utiliza a função `constructMetadata`.

### Fluxo de Dados:
1.  **Configurações Globais**: Armazenadas na tabela `site_settings`. Incluem `seo_title` (nome do coletivo), `seo_description` (bio principal) e `og_image_url` (imagem padrão).
2.  **Sobrescrita Contextual**: Cada página (ex: `/termos`, `/privacidade`) pode buscar seus próprios metadados no banco e passá-los para o `constructMetadata`.
3.  **Fallback Inteligente**: Se uma página não possui uma descrição ou imagem específica, o sistema utiliza automaticamente os valores globais definidos no painel administrativo.

## 🛠️ O Utilitário `constructMetadata`

Localizado em `lib/utils/seo.ts`, este utilitário automatiza a geração de:
-   **Meta Tags padrão** (Title, Description).
-   **OpenGraph** (WhatsApp, Facebook, LinkedIn).
-   **Twitter Cards** (Cards grandes com imagem).
-   **Favicons** (Icon, Shortcut, Apple Touch).

```typescript
// Exemplo de uso em uma Page
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return constructMetadata({
    title: "Título da Página",
    description: settings.specific_seo_description,
    settings
  })
}
```

## 📋 Guia para Administradores

No painel de **Configurações Gerais**, os campos de SEO têm papéis específicos:

### 1. Meta Descrição Global
- **Onde aparece**: Em todas as páginas que não têm uma descrição própria (como a Home).
- **Melhor prática**: Escreva um texto de 120 a 160 caracteres que sintetize a alma do coletivo.

### 2. Imagem de Compartilhamento (OG Image)
- **Onde aparece**: Quando você cola o link do site no WhatsApp ou Redes Sociais.
- **Dica**: Use o nosso **Smart Upload**. Ele cuidará do enquadramento e do fundo borrado automaticamente.

### 3. Meta Descrições Específicas (Páginas Legais)
- Cada aba legal tem seu campo de SEO. Use-os para explicar resumidamente o que o usuário encontrará naquele documento legal (ex: "Entenda como protegemos seus dados...").

## 🚀 Impacto nos Motores de Busca
Graças ao uso de **Server-Side Rendering (SSR)** nas páginas dinâmicas, o Google consegue ler instantaneamente os metadados atualizados via Admin, garantindo que o site esteja sempre indexado com as informações mais recentes.
