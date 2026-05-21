"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Edit2, Trash2, Image as ImageIcon, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type Exhibition } from "@/types/admin"
import { cn } from "@/lib/utils"
import { QrCodeDialog } from "../../pdf/qr-code-dialog"

interface ExhibitionCardProps {
  exhibition: Exhibition
  onEdit: (ex: Exhibition) => void
  onDelete: (id: string) => void
  onToggleStatus?: (id: string, newStatus: "Publicado" | "Rascunho") => void
}

export function ExhibitionCard({ exhibition, onEdit, onDelete, onToggleStatus }: ExhibitionCardProps) {
  const isPublished = exhibition.status === "Publicado"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-3xl border bg-card p-4 shadow-sm transition-all hover:shadow-md"
    >
      <div className="aspect-video mb-4 overflow-hidden rounded-2xl bg-muted relative">
        {exhibition.cover_image ? (
          <img src={exhibition.cover_image} alt={exhibition.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-foreground">
            <ImageIcon className="h-12 w-12" />
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleStatus?.(exhibition.id, isPublished ? "Rascunho" : "Publicado")
          }}
          className={cn(
            "absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer",
            "hover:scale-105 active:scale-95",
            isPublished
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted-foreground/20 text-foreground hover:bg-muted-foreground/30"
          )}
          title={isPublished ? "Clique para recolher (Rascunho)" : "Clique para publicar"}
        >
          {isPublished ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          {exhibition.status}
        </button>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-display text-lg font-bold truncate">{exhibition.title}</h4>
        <p className="text-xs text-foreground line-clamp-2 italic">{exhibition.description}</p>
        <div className="flex items-center gap-2 text-[10px] text-foreground font-medium">
          <ImageIcon className="h-3 w-3" />
          {exhibition.asset_ids?.length || 0} Ativos vinculados
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <QrCodeDialog 
          url={`${typeof window !== "undefined" ? window.location.origin : ""}/exposicoes/${exhibition.slug}`}
          title={exhibition.title}
        />
        <Button variant="outline" size="sm" className="flex-1 rounded-xl" onClick={() => onEdit(exhibition)}>
          <Edit2 className="mr-2 h-3 w-3" />
          Editar
        </Button>
        <Button 
          variant="destructive" 
          size="icon" 
          className="rounded-xl"
          onClick={() => onDelete(exhibition.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
