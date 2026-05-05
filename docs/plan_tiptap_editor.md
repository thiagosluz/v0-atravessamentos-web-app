# Plano: editor rich text (Tiptap) e mídia

Este documento descreve o plano original e o **estado atual** do repositório (para não divergir do código).

---

## Estado atual (implementado)

- Dependências Tiptap instaladas (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-youtube`, `@tiptap/extension-image`, `@tiptap/extension-placeholder`).
- Componente **`components/admin/rich-text-editor.tsx`** (`RichTextEditor`) com toolbar (formatação, listas, links, imagem, YouTube, placeholder).
- **`components/admin/blog-form-dialog.tsx`**: conteúdo do diário usa o `RichTextEditor`; HTML salvo na coluna `content` de `blog_posts`.
- **`components/admin/project-form-dialog.tsx`**: descrição do projeto usa o `RichTextEditor`.
- **`app/diario/[slug]/page.tsx`**: corpo do post renderizado com classes `prose` e `dangerouslySetInnerHTML` para o HTML gerado pelo editor.

---

## Fundação (histórico do plano)

Passos originais de instalação — **já contemplados** no `package.json` atual.

---

## Melhorias opcionais (não obrigatórias)

1. **Sanitização de HTML** na renderização pública do post (allowlist de tags/atributos) para endurecer segurança quando o conteúdo é HTML arbitrário.
2. **Validação de upload** (tamanho máximo, tipos MIME) unificada em membros, projetos e blog, com feedback claro no formulário.
3. **Pré-visualização** de imagens antes do envio onde ainda fizer sentido na UX.
4. **Testes manuais / e2e** de embeds do YouTube em viewports móveis.

---

## Critérios de aceite (referência)

| Critério | Situação |
|----------|----------|
| Formatação básica (negrito, itálico, listas) no diário | Atendido via Tiptap no blog |
| Link / YouTube no editor | Atendido (extensões Tiptap) |
| Bloqueio ou aviso para uploads muito grandes | Melhoria opcional; validar no código atual dos formulários |
| Conteúdo salvo e exibido no site | Atendido (HTML em `blog_posts.content` / descrição de projeto) |

---

## Próximos passos sugeridos (fase 2)

1. Revisar sanitização do HTML público.
2. Padronizar limites de arquivo e mensagens de erro nos três fluxos de mídia.
3. Documentar no ADMIN_GUIDE qualquer limite acordado (tamanho, formatos).
