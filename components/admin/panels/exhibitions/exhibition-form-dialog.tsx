"use client"

import * as React from "react"
import { CheckCircle2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { type Exhibition, type GalleryAsset } from "@/types/admin"

interface ExhibitionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: Exhibition | null
  assets: GalleryAsset[]
  onSubmit: (data: any) => Promise<void>
}

export function ExhibitionFormDialog({
  open,
  onOpenChange,
  initialData,
  assets,
  onSubmit,
}: ExhibitionFormDialogProps) {
  const [formData, setFormData] = React.useState({
    title: "",
    slug: "",
    description: "",
    cover_image: "",
    status: "Rascunho",
    asset_ids: [] as string[]
  })

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        slug: initialData.slug,
        description: initialData.description || "",
        cover_image: initialData.cover_image || "",
        status: initialData.status || "Rascunho",
        asset_ids: initialData.asset_ids || []
      })
    } else {
      setFormData({
        title: "",
        slug: "",
        description: "",
        cover_image: "",
        status: "Rascunho",
        asset_ids: []
      })
    }
  }, [initialData, open])

  const toggleAsset = (id: string) => {
    const current = [...formData.asset_ids]
    if (current.includes(id)) {
      setFormData({ ...formData, asset_ids: current.filter(aid => aid !== id) })
    } else {
      setFormData({ ...formData, asset_ids: [...current, id] })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {initialData ? "Refinar Exposição" : "Inaugurar Nova Sala"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-8 md:grid-cols-2 py-4">
          {/* Metadados */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Título da Exposição</label>
              <Input 
                placeholder="Ex: Entre Rios e Corpos" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Slug (URL)</label>
              <Input 
                placeholder="ex: entre-rios-e-corpos" 
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Imagem de Capa (URL)</label>
              <Input 
                placeholder="https://..." 
                value={formData.cover_image}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Status</label>
              <div className="flex gap-2">
                {['Rascunho', 'Publicado'].map((s) => (
                  <Button
                    key={s}
                    type="button"
                    variant={formData.status === s ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormData({ ...formData, status: s })}
                    className="flex-1 rounded-xl"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Introdução Poética (Manifesto)</label>
              <Textarea 
                placeholder="Escreva a alma desta exposição..." 
                className="min-h-[150px]"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Mesa de Curadoria (Seletor de Ativos) */}
          <div className="space-y-4 border-l pl-8">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold">Pendurar no Mural ({formData.asset_ids.length})</label>
              <p className="text-[10px] text-foreground/40 italic">Selecione fotos do acervo para esta sala</p>
            </div>
            <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {assets.map((asset) => {
                const isSelected = formData.asset_ids.includes(asset.id)
                return (
                  <div 
                    key={asset.id}
                    onClick={() => toggleAsset(asset.id)}
                    className={cn(
                      "relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 transition-all",
                      isSelected ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={asset.image_url} alt="" className="h-full w-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center text-primary">
                        <CheckCircle2 className="h-8 w-8 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => onSubmit(formData)} className="px-8 rounded-xl">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Consolidar Curadoria
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
