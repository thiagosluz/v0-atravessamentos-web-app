"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Youtube from "@tiptap/extension-youtube"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
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
  X,
  Upload,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useCallback, useState, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useToast } from "@/hooks/use-toast"
import { uploadBlogImage } from "@/lib/actions/blog-admin"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

const UrlModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  defaultValue = "" 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (url: string) => void;
  title: string;
  defaultValue?: string;
}) => {
  const [url, setUrl] = useState(defaultValue)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70">{title}</h3>
            <button onClick={onClose} className="rounded-full p-1 hover:bg-muted transition-colors">
              <X className="h-4 w-4 text-foreground/40" />
            </button>
          </div>
          <div className="space-y-4">
            <Input
              autoFocus
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-10"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSubmit(url)
                  setUrl("")
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose} className="rounded-full text-xs">
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  onSubmit(url)
                  setUrl("")
                }}
                className="rounded-full bg-primary text-primary-foreground text-xs px-4"
              >
                Confirmar
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

const ImageUploadModal = ({ 
  isOpen, 
  onClose, 
  onUpload 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onUpload: (url: string, caption: string) => void;
}) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [caption, setCaption] = useState("")

  if (!isOpen) return null

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O tamanho máximo permitido é 2MB.",
          variant: "destructive",
        })
        return
      }

      setLoading(true)
      const formData = new FormData()
      formData.append("image", file)

      const result = await uploadBlogImage(formData)
      
      if (result.error) {
        toast({
          title: "Erro no upload",
          description: result.error,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (result.url) {
        onUpload(result.url, caption)
        setCaption("")
        setLoading(false)
      }
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !loading && onClose()}
          className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70">Inserir Imagem Editorial</h3>
            <button onClick={onClose} disabled={loading} className="rounded-full p-1 hover:bg-muted transition-colors">
              <X className="h-4 w-4 text-foreground/40" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/50">Legenda (Opcional)</label>
              <Input 
                placeholder="Ex: Detalhe da obra América Invertida..." 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                disabled={loading}
                className="h-9 text-sm"
              />
            </div>

            <div className={cn(
              "flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 transition-all relative",
              loading ? "bg-muted animate-pulse" : "hover:bg-muted/50 cursor-pointer"
            )}>
              {loading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                  <p className="text-xs font-medium text-foreground/60 text-center">Enviando para o Storage...</p>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-foreground/30 mb-2" />
                  <p className="text-xs text-foreground/50 text-center">Clique ou arraste para enviar (Máx 2MB)</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                </>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose} disabled={loading} className="rounded-full text-xs">
                Cancelar
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

const MenuBar = ({ editor }: { editor: any }) => {
  const [modalConfig, setModalConfig] = useState<{ type: 'link' | 'youtube', isOpen: boolean, defaultValue?: string } | null>(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  const handleUrlSubmit = (url: string) => {
    if (!url) {
      if (modalConfig?.type === 'link') {
        editor.chain().focus().extendMarkRange("link").unsetLink().run()
      }
      setModalConfig(null)
      return
    }

    if (modalConfig?.type === 'youtube') {
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
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("italic") && "bg-muted text-primary")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn("h-8 w-8 p-0", editor.isActive("heading", { level: 2 }) && "bg-muted text-primary")}
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
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("orderedList") && "bg-muted text-primary")}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("blockquote") && "bg-muted text-primary")}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1 my-auto" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setModalConfig({ type: 'link', isOpen: true, defaultValue: editor.getAttributes("link").href })}
          className={cn("h-8 w-8 p-0", editor.isActive("link") && "bg-muted text-primary")}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsImageModalOpen(true)}
          className={cn("h-8 w-8 p-0", editor.isActive("image") && "bg-muted text-primary")}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setModalConfig({ type: 'youtube', isOpen: true })}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <UrlModal 
        isOpen={modalConfig?.isOpen || false}
        onClose={() => setModalConfig(null)}
        onSubmit={handleUrlSubmit}
        title={modalConfig?.type === 'youtube' ? "Inserir vídeo do YouTube" : "Inserir Link"}
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

// Extensões estáticas otimizadas para legendas
const extensions = [
  StarterKit,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-primary underline underline-offset-4 cursor-pointer",
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
          parseHTML: element => element.getAttribute('title') || element.nextSibling?.textContent,
          renderHTML: attributes => {
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
          'figure',
          { class: 'editorial-figure' },
          ['img', { ...rest, title }],
          ['figcaption', { class: 'editorial-caption' }, title],
        ]
      }
      return ['img', HTMLAttributes]
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

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
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
  useMemo(() => {
    if (editor && content !== editor.getHTML()) {
      // Se o conteúdo externo for diferente do interno (ex: resetado para vazio)
      // usamos queueMicrotask ou setTimeout para evitar conflitos de renderização
      setTimeout(() => {
        editor.commands.setContent(content)
      }, 0)
    }
  }, [content, editor])

  return (
    <div className="w-full border border-input rounded-xl overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring transition-all duration-200">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
