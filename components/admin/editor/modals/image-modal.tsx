"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { uploadBlogImage } from "@/lib/actions/blog-admin"
import { cn } from "@/lib/utils"

interface ImageUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (url: string, caption: string) => void
}

export function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
}: ImageUploadModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [caption, setCaption] = React.useState("")

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

      if (result.data?.url) {
        onUpload(result.data.url, caption)
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
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Inserir Imagem Editorial
            </h3>
            <button
              onClick={onClose}
              disabled={loading}
              className="rounded-full p-1 hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 text-foreground" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Legenda (Opcional)</label>
              <Input
                placeholder="Ex: Detalhe da obra América Invertida..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                disabled={loading}
                className="h-9 text-sm"
              />
            </div>

            <div
              className={cn(
                "flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 transition-all relative",
                loading ? "bg-muted animate-pulse" : "hover:bg-muted/50 cursor-pointer"
              )}
            >
              {loading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                  <p className="text-xs font-medium text-foreground text-center">
                    Enviando para o Storage...
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-foreground mb-2" />
                  <p className="text-xs text-foreground text-center">
                    Clique ou arraste para enviar (Máx 2MB)
                  </p>
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
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={loading}
                className="rounded-full text-xs"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
