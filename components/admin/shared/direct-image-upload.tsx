"use client"

import React, { useState, useRef } from "react"
import { Upload, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { uploadSiteImage } from "@/lib/actions/settings"
import { cn } from "@/lib/utils"

interface DirectImageUploadProps {
  value: string
  onChange: (url: string) => void
  recommendedText?: string
  aspectRatio?: string
}

export function DirectImageUpload({ 
  value, 
  onChange, 
  recommendedText = "Formato livre • Máx 5MB",
  aspectRatio = "aspect-video"
}: DirectImageUploadProps) {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const result = await uploadSiteImage(formData)

      if (result.error) {
        toast({
          title: "Erro no upload",
          description: result.error,
          variant: "destructive",
        })
      } else if (result.url) {
        onChange(result.url)
      }
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao enviar a imagem.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <div 
        className={cn(
          "relative group cursor-pointer border-2 border-dashed border-border rounded-xl overflow-hidden transition-all hover:bg-muted/50 hover:border-primary/50",
          isProcessing && "animate-pulse bg-muted",
          aspectRatio
        )}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        {value ? (
          <div className="w-full h-full relative">
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-background/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
                Trocar Capa
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
          <div className="h-full w-full flex flex-col items-center justify-center p-6 gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
              {isProcessing ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
            </div>
            <div className="text-center">
              <p className="font-bold text-foreground text-sm">
                {isProcessing ? "Enviando..." : "Fazer Upload da Capa"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-semibold">
                {recommendedText}
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
