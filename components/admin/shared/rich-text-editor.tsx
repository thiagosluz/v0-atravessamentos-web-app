import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

// Importação dinâmica (Lazy Load) do Editor Tiptap
// Isso economiza quase 300kb de JavaScript inicial na tela!
export const RichTextEditor = dynamic(
  () => import("./rich-text-editor-inner").then((mod) => mod.RichTextEditor),
  {
    ssr: false, // O Tiptap lida melhor com renderização do lado do cliente
    loading: () => (
      <div className="flex min-h-[350px] w-full items-center justify-center rounded-xl border border-input bg-muted/20">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">Carregando editor...</span>
        </div>
      </div>
    ),
  }
)
