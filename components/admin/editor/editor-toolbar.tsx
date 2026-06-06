"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading2,
  Quote,
  Table as TableIcon,
  Palette,
  Highlighter,
  ChevronDown,
  Undo,
  Redo,
} from "lucide-react"
import { SiYoutube as YoutubeIcon } from "@icons-pack/react-simple-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { UrlModal } from "./modals/url-modal"
import { ImageUploadModal } from "./modals/image-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface EditorToolbarProps {
  editor: Editor | null
}

const PALETTE_COLORS = [
  { name: "Padrão", value: "inherit" },
  { name: "Terracota", value: "#c0543c" },
  { name: "Musgo", value: "#567c52" },
  { name: "Ouro", value: "#d5ac4a" },
  { name: "Carvão", value: "#2a2724" },
  { name: "Vermelho", value: "#ef4444" },
  { name: "Azul", value: "#3b82f6" },
]

const HIGHLIGHT_COLORS = [
  { name: "Nenhum", value: "transparent" },
  { name: "Papel", value: "#f0e9d8" },
  { name: "Ouro Claro", value: "#fef3c7" },
  { name: "Terracota Clara", value: "#ffedd5" },
  { name: "Musgo Claro", value: "#dcfce7" },
  { name: "Azul Claro", value: "#dbeafe" },
  { name: "Amarelo", value: "#fef08a" },
]

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

  const isTableActive = editor.isActive("table")

  return (
    <>
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-2 bg-muted/30">
        {/* Estilos de Texto Básicos */}
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
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("underline") && "bg-muted text-primary")}
          title="Sublinhado"
        >
          <UnderlineIcon className="h-4 w-4" />
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
          title="Título (H2)"
        >
          <Heading2 className="h-4 w-4" />
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

        <div className="w-px h-6 bg-border mx-1" />

        {/* Alinhamento de Texto */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1 px-2 text-xs"
              title="Alinhamento"
            >
              {editor.isActive({ textAlign: "center" }) ? (
                <AlignCenter className="h-4 w-4 text-primary" />
              ) : editor.isActive({ textAlign: "right" }) ? (
                <AlignRight className="h-4 w-4 text-primary" />
              ) : editor.isActive({ textAlign: "justify" }) ? (
                <AlignJustify className="h-4 w-4 text-primary" />
              ) : (
                <AlignLeft className="h-4 w-4" />
              )}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign("left").run()}>
              <AlignLeft className="mr-2 h-4 w-4" /> Alinhar à Esquerda
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign("center").run()}>
              <AlignCenter className="mr-2 h-4 w-4" /> Centralizar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign("right").run()}>
              <AlignRight className="mr-2 h-4 w-4" /> Alinhar à Direita
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
              <AlignJustify className="mr-2 h-4 w-4" /> Justificado
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Cores (Fonte e Fundo/Destaque) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1 px-2 text-xs"
              title="Cor do Texto"
            >
              <Palette className="h-4 w-4" />
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3" align="start">
            <div className="text-xs font-semibold mb-2">Cor da Fonte</div>
            <div className="grid grid-cols-5 gap-1.5">
              {PALETTE_COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => {
                    if (color.value === "inherit") {
                      editor.chain().focus().unsetColor().run()
                    } else {
                      editor.chain().focus().setColor(color.value).run()
                    }
                  }}
                  className={cn(
                    "h-6 w-6 rounded-md border border-border transition-transform hover:scale-110",
                    color.value === "inherit" && "bg-background flex items-center justify-center text-[10px]"
                  )}
                  style={{ backgroundColor: color.value !== "inherit" ? color.value : undefined }}
                  title={color.name}
                >
                  {color.value === "inherit" && "❌"}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1 px-2 text-xs"
              title="Cor do Fundo (Marca-texto)"
            >
              <Highlighter className="h-4 w-4" />
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3" align="start">
            <div className="text-xs font-semibold mb-2">Marca-texto</div>
            <div className="grid grid-cols-4 gap-1.5">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => {
                    if (color.value === "transparent") {
                      editor.chain().focus().unsetHighlight().run()
                    } else {
                      editor.chain().focus().setHighlight({ color: color.value }).run()
                    }
                  }}
                  className={cn(
                    "h-6 w-6 rounded-md border border-border transition-transform hover:scale-110",
                    color.value === "transparent" && "bg-background flex items-center justify-center text-[10px]"
                  )}
                  style={{ backgroundColor: color.value !== "transparent" ? color.value : undefined }}
                  title={color.name}
                >
                  {color.value === "transparent" && "❌"}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Listas */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("bulletList") && "bg-muted text-primary")}
          title="Lista Simples"
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

        <div className="w-px h-6 bg-border mx-1" />

        {/* Gerenciador de Tabelas */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn("h-8 gap-1 px-2 text-xs", isTableActive && "bg-muted/50 font-semibold")}
              title="Tabela"
            >
              <TableIcon className="h-4 w-4" />
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {!isTableActive ? (
              <>
                <DropdownMenuLabel>Criar Tabela</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
                  Tabela Padrão (3x3)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run()}>
                  Tabela Pequena (2x2)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().insertTable({ rows: 5, cols: 4, withHeaderRow: true }).run()}>
                  Tabela Longa (5x4)
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuLabel>Operações de Linha</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>
                  Adicionar Linha Acima
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>
                  Adicionar Linha Abaixo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()}>
                  Excluir Linha Selecionada
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuLabel>Operações de Coluna</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>
                  Adicionar Coluna Antes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>
                  Adicionar Coluna Depois
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()}>
                  Excluir Coluna Selecionada
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />

                <DropdownMenuLabel>Mesclagem e Célula</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => editor.chain().focus().mergeCells().run()}>
                  Mesclar Células
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().splitCell().run()}>
                  Dividir Célula Mesclada
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeaderCell().run()}>
                  Alternar Célula de Cabeçalho
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => editor.chain().focus().deleteTable().run()} className="text-destructive focus:text-destructive">
                  Excluir Tabela Completa
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Links, Imagens e Vídeo */}
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

        {/* Undo e Redo */}
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

