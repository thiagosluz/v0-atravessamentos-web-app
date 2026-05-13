"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Youtube as YoutubeIcon,
  Image as ImageIcon,
  Heading2,
  Quote,
  Undo,
  Redo,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { UrlModal } from "./modals/url-modal"
import { ImageUploadModal } from "./modals/image-modal"

interface EditorToolbarProps {
  editor: Editor | null
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [modalConfig, setModalConfig] = React.useState<{
    type: "link" | "youtube"
    isOpen: boolean
    defaultValue?: string
  } | null>(null)
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false)

  const handleUrlSubmit = (url: string) => {
    if (!editor) return

    if (!url) {
      if (modalConfig?.type === "link") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run()
      }
      setModalConfig(null)
      return
    }

    if (modalConfig?.type === "youtube") {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      })
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }

    setModalConfig(null)
  }

  const handleImageUpload = (url: string, caption: string) => {
    if (!editor) return
    editor.chain().focus().setImage({ src: url, title: caption }).run()
    setIsImageModalOpen(false)
  }

  if (!editor) {
    return null
  }

  return (
    <>
      <div className="flex flex-wrap gap-1 border-b border-border p-2 bg-muted/30">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("bold") && "bg-muted text-primary")}
          title="Negrito"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("italic") && "bg-muted text-primary")}
          title="Itálico"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("heading", { level: 2 }) && "bg-muted text-primary"
          )}
          title="Título"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1 my-auto" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("bulletList") && "bg-muted text-primary")}
          title="Lista"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("orderedList") && "bg-muted text-primary")}
          title="Lista Numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("blockquote") && "bg-muted text-primary")}
          title="Citação"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1 my-auto" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            setModalConfig({
              type: "link",
              isOpen: true,
              defaultValue: editor.getAttributes("link").href,
            })
          }
          className={cn("h-8 w-8 p-0", editor.isActive("link") && "bg-muted text-primary")}
          title="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsImageModalOpen(true)}
          className={cn("h-8 w-8 p-0", editor.isActive("image") && "bg-muted text-primary")}
          title="Imagem"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setModalConfig({ type: "youtube", isOpen: true })}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          title="YouTube"
        >
          <YoutubeIcon className="h-4 w-4" />
        </Button>
        <div className="flex-grow" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
          title="Desfazer"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
          title="Refazer"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <UrlModal
        isOpen={modalConfig?.isOpen || false}
        onClose={() => setModalConfig(null)}
        onSubmit={handleUrlSubmit}
        title={modalConfig?.type === "youtube" ? "Inserir vídeo do YouTube" : "Inserir Link"}
        defaultValue={modalConfig?.defaultValue}
      />

      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onUpload={handleImageUpload}
      />
    </>
  )
}
