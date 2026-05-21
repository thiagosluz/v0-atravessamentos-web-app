"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Youtube from "@tiptap/extension-youtube"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"

import { TextAlign } from "@tiptap/extension-text-align"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import { Highlight } from "@tiptap/extension-highlight"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"

import { useMemo, useEffect } from "react"
import { EditorToolbar } from "../editor/editor-toolbar"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  // Extensões instanciadas e memorizadas por instância de editor para evitar avisos de duplicidade
  const extensions = useMemo(() => [
    StarterKit.configure({
      link: {
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4 cursor-pointer",
        },
      },
    }),

    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    TextStyle.configure(),
    Color.configure(),
    Highlight.configure({
      multicolor: true,
    }),
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: "border-collapse table-auto w-full my-6 border border-border",
      },
    }),
    TableRow.configure(),
    TableHeader.configure({
      HTMLAttributes: {
        class: "border border-border px-4 py-2 bg-muted/50 font-bold text-left",
      },
    }),
    TableCell.configure({
      HTMLAttributes: {
        class: "border border-border px-4 py-2 text-left align-top",
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
      placeholder: placeholder || "Escreva aqui...",
    }),
  ], [placeholder])

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
