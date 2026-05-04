# Plano de Implementação: Editor Rich Text (Tiptap) com Embed de YouTube

Este plano detalha a transição do campo de texto simples (`textarea`) para um editor de texto rico moderno utilizando a biblioteca **Tiptap**, com suporte específico para vídeos do YouTube e melhorias na gestão de mídia.

## 1. Fundação e Dependências
Para garantir uma experiência fluida e modular, instalaremos os seguintes pacotes:
- `pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-youtube @tiptap/extension-image @tiptap/extension-placeholder`
- `pnpm add lucide-react` (para ícones da barra de ferramentas, já presente no projeto)

## 2. Componente Core: `RichTextEditor`
Criaremos um componente reutilizável em `components/admin/rich-text-editor.tsx`:
- **Toolbar:** Uma barra de ferramentas elegante com botões para Negrito, Itálico, Listas, Links e o botão especial de Vídeo.
- **Editor Area:** Onde o conteúdo é editado, com suporte a placeholder.
- **YouTube logic:** Um modal simples (ou prompt) para inserir a URL do YouTube, que o Tiptap converterá automaticamente em um embed responsivo.

## 3. Melhorias na Gestão de Mídia
- **Validação de Imagem:** No `MemberFormDialog` e `ProjectFormDialog`, adicionaremos uma verificação antes do upload:
  - Limite de tamanho (ex: 2MB).
  - Feedback visual caso o arquivo seja muito grande.
- **Previews Reais:** Melhorar a visualização das imagens selecionadas antes do salvamento.

## 4. Integração nos Formulários (CMS)
- **BlogFormDialog:** Substituir o `textarea` de "Conteúdo" pelo novo `RichTextEditor`.
- **ProjectFormDialog:** (Opcional/Futuro) Substituir a descrição por texto rico se necessário.
- **Action Update:** Garantir que o conteúdo HTML gerado pelo Tiptap seja salvo corretamente na coluna `content` (tipo `text` no Supabase).

## 5. Renderização no Site Público
- **Página de Postagem:** Atualizar o componente que exibe o conteúdo do blog para renderizar HTML de forma segura (`dangerouslySetInnerHTML` com sanitização ou CSS específico).
- **Responsividade:** Adicionar classes CSS globais (ex: `.prose`) para garantir que os iframes do YouTube ocupem 100% da largura mantendo a proporção 16:9.

## 6. Critérios de Aceite
- [ ] O usuário consegue formatar texto (Negrito/Itálico/Listas).
- [ ] O usuário consegue colar um link do YouTube e o vídeo aparece no editor.
- [ ] O sistema impede uploads de imagens gigantes que degradam a performance.
- [ ] O conteúdo editado é salvo e exibido corretamente no site.

---

### Próximos Passos (Phase 2):
1. **Frontend Specialist:** Instalar pacotes e construir o `RichTextEditor`.
2. **Frontend Specialist:** Integrar o editor nos modais de Blog e Projetos.
3. **Backend Specialist:** Validar o fluxo de salvamento e revalidação de cache.
4. **Test Engineer:** Verificar a responsividade dos vídeos em dispositivos móveis.
