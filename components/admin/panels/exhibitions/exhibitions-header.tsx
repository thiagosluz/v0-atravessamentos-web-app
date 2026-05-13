"use client"

import * as React from "react"
import { Plus, GalleryVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExhibitionsHeaderProps {
  onAdd: () => void
}

export function ExhibitionsHeader({ onAdd }: ExhibitionsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border p-4 md:flex-row md:items-center md:justify-between md:p-6">
      <div className="space-y-1">
        <h3 className="font-display text-lg font-bold flex items-center gap-2 md:text-xl">
          <GalleryVertical className="h-5 w-5 text-primary" />
          Salas de Curadoria
        </h3>
        <p className="text-sm text-foreground/60">Crie narrativas visuais a partir do seu acervo.</p>
      </div>
      <Button onClick={onAdd} className="rounded-xl bg-primary text-primary-foreground">
        <Plus className="mr-2 h-4 w-4" />
        Nova Exposição
      </Button>
    </div>
  )
}
