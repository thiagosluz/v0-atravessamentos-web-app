"use client"

import React, { useState, useRef } from "react"
import { Upload, Loader2, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { uploadSiteImage } from "@/lib/actions/settings"
import { cn } from "@/lib/utils"

interface SmartImageUploadProps {
  value: string
  onChange: (url: string) => void
}

export function SmartImageUpload({ value, onChange }: SmartImageUploadProps) {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) return reject("Não foi possível carregar o contexto do Canvas")

        // Tamanho ideal para SEO (Facebook/WhatsApp)
        const targetWidth = 1200
        const targetHeight = 630
        canvas.width = targetWidth
        canvas.height = targetHeight

        // 1. Desenhar fundo com BLUR (Cobrindo tudo)
        const scale = Math.max(targetWidth / img.width, targetHeight / img.height)
        const bgW = img.width * scale
        const bgH = img.height * scale
        const bgX = (targetWidth - bgW) / 2
        const bgY = (targetHeight - bgH) / 2

        ctx.filter = "blur(30px) brightness(0.7)"
        ctx.drawImage(img, bgX, bgY, bgW, bgH)
        ctx.filter = "none"

        // 2. Desenhar overlay escuro leve no fundo
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
        ctx.fillRect(0, 0, targetWidth, targetHeight)

        // 3. Desenhar imagem centralizada (Mantendo proporção sem cortar)
        const containScale = Math.min(targetWidth / img.width, targetHeight / img.height)
        const fgW = img.width * containScale
        const fgH = img.height * containScale
        const fgX = (targetWidth - fgW) / 2
        const fgY = (targetHeight - fgH) / 2

        // Sombra leve na imagem central para destacar do blur
        ctx.shadowColor = "rgba(0,0,0,0.5)"
        ctx.shadowBlur = 40
        ctx.drawImage(img, fgX, fgY, fgW, fgH)

        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else reject("Falha ao gerar o Blob da imagem")
        }, "image/jpeg", 0.9)
      }
      img.onerror = () => reject("Erro ao carregar imagem")
      img.src = URL.createObjectURL(file)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo é 5MB. A imagem final será otimizada.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Processar no cliente (Canvas)
      const processedBlob = await processImage(file)
      const processedFile = new File([processedBlob], "seo-optimized.jpg", { type: "image/jpeg" })

      // Enviar para o Supabase
      const formData = new FormData()
      formData.append("image", processedFile)

      const result = await uploadSiteImage(formData)

      if (result.error) {
        toast({
          title: "Erro no upload",
          description: result.error,
          variant: "destructive",
        })
      } else if (result.url) {
        onChange(result.url)
        toast({
          title: "Imagem otimizada!",
          description: "O enquadramento e o fundo foram processados com sucesso.",
        })
      }
    } catch (error) {
      toast({
        title: "Erro no processamento",
        description: "Não conseguimos preparar sua imagem.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div 
        className={cn(
          "relative group cursor-pointer border-2 border-dashed border-border rounded-2xl overflow-hidden transition-all hover:bg-muted/50",
          isProcessing && "animate-pulse bg-muted"
        )}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        {value ? (
          <div className="aspect-[1200/630] w-full relative">
            <img src={value} alt="SEO Preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
                Trocar Imagem
              </div>
            </div>
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                onChange("")
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="aspect-[1200/630] flex flex-col items-center justify-center p-8 gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {isProcessing ? <Loader2 className="h-8 w-8 animate-spin" /> : <Upload className="h-8 w-8" />}
            </div>
            <div className="text-center">
              <p className="font-bold text-foreground/80">
                {isProcessing ? "Processando imagem..." : "Upload da Imagem de SEO"}
              </p>
              <p className="text-xs text-foreground/40 mt-1 uppercase tracking-widest font-semibold">
                Qualquer formato • Ajuste automático • Máx 5MB
              </p>
            </div>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={isProcessing}
        />
      </div>
    </div>
  )
}
