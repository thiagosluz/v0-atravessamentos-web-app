"use client"

import * as React from "react"
import { Image as ImageIcon } from "lucide-react"

export function GalleryHeader() {
  return (
    <div className="flex flex-col gap-4 border-b border-border p-4 md:flex-row md:items-center md:justify-between md:p-6">
      <div className="space-y-1">
        <h3 className="font-display text-lg font-bold flex items-center gap-2 md:text-xl">
          <ImageIcon className="h-5 w-5 text-primary" />
          Acervo de Mídias
        </h3>
        <p className="text-sm text-foreground/65">
          Gerencie o repositório de imagens e vídeos do coletivo.
        </p>
      </div>
    </div>
  )
}
