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
Como os conteúdos legais são editados em um **Rich Text Editor**, o sistema utiliza a biblioteca `sanitize-html` para sanitizar o HTML no servidor antes da renderização. Isso impede que scripts maliciosos injetados no banco de dados sejam executados no navegador dos usuários.

### Localização e Data
O componente utiliza `date-fns/locale/pt-BR` para formatar a data de atualização no formato por extenso: *"Última atualização: 15 de Maio de 2026"*.

---

## 🛡️ SafeHTML

O `SafeHTML` é o componente padrão para renderização de conteúdos ricos (Rich Text) vindos do CMS (Blog e Projetos).

### Funcionalidades:
- **Sanitização**: Utiliza `sanitize-html` para limpar o conteúdo contra ataques XSS.
- **Iframe Support**: Configurado para permitir embeds seguros de YouTube e Vimeo.
- **Tailwind Typography**: Utiliza o plugin `@tailwindcss/typography` (classe `prose`) para garantir que o conteúdo dinâmico siga o design system do coletivo.

### Uso:
- **Projetos**: Renderiza o campo `description` (que agora é Rich Text).
- **Blog**: Renderiza o campo `content`.

---

## 📰 PageHeader (Editorial)

O `PageHeader` é o componente central da nova identidade editorial das páginas internas do site. Ele padroniza a apresentação de títulos e descrições.

### Estrutura:
- **Etiqueta superior (Badge)**: Uma linha poética precedida por `---` (ex: `--- MEMÓRIA VIVA`).
- **Título Monumental**: Utiliza a fonte `font-display` com suporte a elementos HTML como `em` para itálicos poéticos.
- **Descrição**: Um parágrafo descritivo com tipografia refinada e espaçamento padrão.

### Localização:
`components/ui/page-header.tsx`. Deve ser utilizado como o primeiro elemento dentro do `<main>` nas páginas internas.

---

## 🌫️ BackgroundBlobs

O `BackgroundBlobs` é responsável pela atmosfera imersiva e orgânica das páginas internas.

### Recursos:
- **Formas Orgânicas**: Utiliza gradientes suaves com filtros de desfoque (`blur-3xl`) que se movem ou flutuam sutilmente.
- **Efeito Isolate**: Utiliza a classe `isolate` e `z-index` negativos para garantir que o conteúdo textual permaneça legível e acima dos efeitos visuais.
- **Textura de Papel**: Geralmente acompanhado por um overlay de textura de papel (`/paper-texture.png`) com baixa opacidade para um feeling tátil/analógico.

### Localização:
`components/ui/background-blobs.tsx`.

---

## ✏️ FloatingInput (Formulários Premium)

O `FloatingInput` é o componente padrão para campos de texto em formulários novos ou refatorados. Ele implementa um rótulo animado (floating label) usando CSS puro via a diretiva `peer` do Tailwind.

### Funcionamento Técnico (CSS Peer)
O componente utiliza uma técnica de "label flutuante" sem JavaScript para a animação:

1.  **Placeholder Invisível**: O `<input>` recebe `placeholder=" "` (espaço). Isso permite ao CSS detectar se o campo está vazio ou preenchido.
2.  **Animação via `peer`**: O `<label>` é posicionado como irmão do input e utiliza os seletores `peer-placeholder-shown` e `peer-focus` para alternar entre os estados "dentro do campo" (escala 100%) e "flutuando acima" (escala 75%).
3.  **ID Automático**: Se nenhum `id` é fornecido via props, o componente gera um automaticamente com `React.useId()`, garantindo a linkagem `htmlFor`↔`id` para acessibilidade.
4.  **Tratamento Explícito de `disabled`**: A prop `disabled` é extraída explicitamente na desestruturação (não fica no spread `...props`) para evitar uma anomalia de SSR do Next.js que injeta `disabled=""` no HTML de forma forçada.

### Props
| Prop | Tipo | Descrição |
|------|------|-----------|
| `label` | `string` | Texto exibido como rótulo flutuante (obrigatório) |
| `labelClassName` | `string?` | Classes CSS extras para o `<label>` |
| `containerClassName` | `string?` | Classes CSS extras para o `<div>` container |
| Demais props | `InputHTMLAttributes` | Todas as props nativas de `<input>` são suportadas via spread |

### Onde está em uso:
- **Login** (`components/auth/login-form.tsx`): Campos de e-mail e senha.
- **Footer** (`components/site-footer.tsx`): Campo de inscrição na Newsletter.

### Expansão Planejada (Floating UI Kit):
- `FloatingTextarea` — Variante para campos de texto longo.
- `FloatingSelect` — Variante para dropdowns.
- Migração gradual dos formulários de Contato e Inscrição em páginas públicas.

### Localização:
`components/ui/floating-input.tsx`

---

## 🛠️ Organização Modular (Admin)

Recentemente, refatoramos o diretório `components/admin/` para uma estrutura funcional, visando escalabilidade:

- **`forms/`**: Contém os formulários complexos de edição e criação (ex: `ProjectForm`, `BlogPostForm`). Utilizam o hook `useAdminForm`.
- **`panels/`**: Componentes de alto nível que compõem as telas principais (ex: `OverviewPanel`, `SettingsPanel`).
- **`table/`**: Toda a lógica de listagem, incluindo `AdminDataTable`, `TableHeader` e ações em lote.
- **`shared/`**: Componentes reutilizáveis específicos do admin, como diálogos de confirmação, modais de curadoria (`EditAssetModal`) e inputs customizados.

---

## 💡 Instruções para Desenvolvedores
Ao criar novas funcionalidades administrativas:
1. Verifique se o componente deve ser um **Form** (mutação) ou um **Panel** (visualização).
2. Utilize o hook `useAdminForm` para gerenciar o estado da mutação e feedbacks (toast).
3. Siga o padrão poético: `PageHeader` para o título e `BackgroundBlobs` para a atmosfera.
4. **Formulários novos**: Prefira `FloatingInput` em vez de `Input` + `Label` separados para manter a identidade visual sofisticada.
