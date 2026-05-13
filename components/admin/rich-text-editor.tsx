"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Youtube from "@tiptap/extension-youtube"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { useMemo, useEffect } from "react"
import { EditorToolbar } from "./editor/editor-toolbar"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

// Extensões estáticas otimizadas para legendas
const extensions = [
  StarterKit.configure({
    link: {
      openOnClick: false,
      HTMLAttributes: {
        class: "text-primary underline underline-offset-4 cursor-pointer",
      },
    },
  }),
  Youtube.configure({
    inline: false,
    HTMLAttributes: {
      class: "aspect-video w-full rounded-lg overflow-hidden my-6",
    },
  }),
  Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        title: {
          default: null,
          parseHTML: (element) => element.getAttribute("title") || element.nextSibling?.textContent,
          renderHTML: (attributes) => {
            if (!attributes.title) return {}
            return { title: attributes.title }
          },
        },
      }
    },
    renderHTML({ HTMLAttributes }) {
      const { title, ...rest } = HTMLAttributes
      if (title) {
        return [
          "figure",
          { class: "editorial-figure" },
          ["img", { ...rest, title }],
          ["figcaption", { class: "editorial-caption" }, title],
        ]
      }
      return ["img", HTMLAttributes]
    },
  }).configure({
    HTMLAttributes: {
      class: "rounded-2xl max-w-full h-auto mt-8 shadow-lg",
    },
  }),
  Placeholder.configure({
    placeholder: "Escreva aqui...",
  }),
]

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] p-6",
      },
    },
  })

  // Sincronizar conteúdo quando a prop muda (importante para resetar o editor)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // Usamos setTimeout para evitar conflitos de renderização durante o ciclo do React
      const timer = setTimeout(() => {
        editor.commands.setContent(content)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [content, editor])

  return (
    <div className="w-full border border-input rounded-xl overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring transition-all duration-200">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
