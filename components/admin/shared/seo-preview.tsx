"use client"

import React from "react"
import { Globe, MessageSquare, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SEOPreviewProps {
  title: string
  description: string
  imageUrl?: string
  url?: string
}

export function SEOPreview({ title, description, imageUrl, url = "https://www.coletivoatravessamentos.com.br/" }: SEOPreviewProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Google Preview */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-foreground">
          <Globe className="h-3 w-3" />
          Busca no Google
        </div>
        <div className="rounded-2xl border border-border bg-white p-6 dark:bg-zinc-900 shadow-sm">
          <div className="space-y-1">
            <div className="text-[14px] text-[#202124] dark:text-zinc-400 flex items-center gap-1">
              {url}
            </div>
            <h3 className="text-[20px] text-[#1a0dab] dark:text-blue-400 font-medium hover:underline cursor-pointer leading-tight">
              {title || "Título do Site"}
            </h3>
            <p className="text-[14px] text-[#4d5156] dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {description || "Sua descrição aparecerá aqui. Recomenda-se entre 120 e 160 caracteres para uma melhor visualização nos resultados de busca."}
            </p>
          </div>
        </div>
      </div>

      {/* Social Card Preview (WhatsApp/Facebook) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-foreground">
          <Share2 className="h-3 w-3" />
          Redes Sociais e WhatsApp
        </div>
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-md max-w-[400px]">
          {imageUrl ? (
            <div className="aspect-[1200/630] w-full bg-muted overflow-hidden">
              <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="aspect-[1200/630] w-full bg-muted flex items-center justify-center border-b border-border">
              <span className="text-xs text-foreground font-medium uppercase tracking-widest">Sem Imagem</span>
            </div>
          )}
          <div className="p-4 bg-muted/30">
            <div className="text-[12px] text-foreground uppercase tracking-wider mb-1">coletivoatravessamentos.com.br</div>
            <h4 className="text-[16px] font-bold text-foreground mb-1 line-clamp-1">
              {title || "Título da Travessia"}
            </h4>
            <p className="text-[13px] text-foreground line-clamp-2 leading-snug">
              {description || "A descrição de como o coletivo é visto nas redes sociais aparecerá aqui..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
