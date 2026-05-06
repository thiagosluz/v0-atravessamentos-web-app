# Guia Técnico de Componentes Admin

Este documento detalha o funcionamento dos componentes avançados de interface desenvolvidos para o painel administrativo do **Atravessamentos**.

---

## 🖼️ SmartImageUpload

O `SmartImageUpload` é um componente de upload inteligente que automatiza o processamento de imagens para SEO.

### Funcionamento Técnico (Canvas API)
Em vez de simplesmente enviar o arquivo para o servidor, o componente realiza as seguintes etapas no navegador do usuário:

1.  **Criação de Contexto**: Cria um `HTMLCanvasElement` de 1200x630 pixels (proporção ideal de 1.91:1).
2.  **Camada de Fundo (Blur)**: 
    - A imagem original é desenhada para cobrir todo o canvas.
    - É aplicado um filtro de `blur(30px)` e um leve escurecimento (`brightness(0.7)`).
3.  **Camada Superior (Centralizada)**:
    - A imagem original é desenhada por cima, centralizada.
    - Utiliza a lógica de "contain" para garantir que nenhum detalhe da foto seja cortado.
    - Aplica uma sombra suave (`shadowBlur`) para destacar a imagem do fundo.
4.  **Conversão e Upload**: O canvas é convertido para um Blob JPEG de alta qualidade e enviado via Server Action para o Supabase Storage.

### Manutenção
O código reside em `components/admin/smart-image-upload.tsx`. Caso deseje alterar o nível de desfoque ou as dimensões padrão, ajuste as constantes dentro da função `processImage`.

---

## 🔍 SEOPreview

O `SEOPreview` é um simulador visual que fornece feedback instantâneo ao administrador.

### Recursos:
- **Google Simulator**: Imita a tipografia e o layout dos resultados de busca orgânica do Google.
- **Social Card Simulator**: Simula o visual de links compartilhados no WhatsApp, Facebook e Instagram.
- **Sincronização em Tempo Real**: Conecta-se diretamente aos estados do `GeneralSettingsManager`, reagindo a cada tecla digitada.

### Localização
O componente está em `components/admin/seo-preview.tsx`. Ele foi projetado para ser puro (stateless), recebendo título, descrição e imagem via props.

---

## ⚖️ LegalPageLayout

Componente responsável por renderizar as páginas de Acessibilidade, Privacidade e Termos.

### Segurança (XSS Protection)
Como os conteúdos legais são editados em um **Rich Text Editor**, o sistema utiliza a biblioteca `isomorphic-dompurify` para sanitizar o HTML no servidor antes da renderização. Isso impede que scripts maliciosos injetados no banco de dados sejam executados no navegador dos usuários.

### Localização e Data
O componente utiliza `date-fns/locale/pt-BR` para formatar a data de atualização no formato por extenso: *"Última atualização: 15 de Maio de 2026"*.

---

## 💡 Instruções para Desenvolvedores
Ao criar novas abas de configurações que exijam previews ou uploads, siga o padrão de **Processamento no Cliente** (Client-side processing) estabelecido nestes componentes para manter a performance do servidor e o feedback instantâneo para o usuário.
