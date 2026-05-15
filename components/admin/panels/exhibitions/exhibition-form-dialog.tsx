"use client"

import * as React from "react"
import { CheckCircle2, Search, Tag as TagIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { type Exhibition, type GalleryAsset, type ExhibitionFormData } from "@/types/admin"

interface ExhibitionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: Exhibition | null
  assets: GalleryAsset[]
  onSubmit: (data: ExhibitionFormData) => Promise<void>
}

export function ExhibitionFormDialog({
  open,
  onOpenChange,
  initialData,
  assets,
  onSubmit,
}: ExhibitionFormDialogProps) {
  const [formData, setFormData] = React.useState<ExhibitionFormData>({
    title: "",
    slug: "",
    description: "",
    cover_image: "",
    status: "Rascunho",
    asset_ids: []
  })

  const [activeFilter, setActiveFilter] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Extrair todas as tags únicas dos ativos disponíveis
  const availableTags = React.useMemo(() => {
    const tags = new Set<string>()
    assets.forEach(asset => {
      asset.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [assets])

  // Filtrar ativos para exibição
  const filteredAssets = React.useMemo(() => {
    return assets.filter(asset => {
      const matchesTag = !activeFilter || asset.tags?.includes(activeFilter)
      const matchesSearch = !searchQuery || 
        asset.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.description?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTag && matchesSearch
    })
  }, [assets, activeFilter, searchQuery])

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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-display text-2xl">
            {initialData ? "Refinar Exposição" : "Inaugurar Nova Sala"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-8 md:grid-cols-[1fr_1.5fr]">
            {/* Coluna de Metadados */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Conceito & Identidade</h4>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Título da Exposição</label>
                  <Input 
                    placeholder="Ex: Entre Rios e Corpos" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Slug (URL)</label>
                  <Input 
                    placeholder="ex: entre-rios-e-corpos" 
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Imagem de Capa (URL)</label>
                  <Input 
                    placeholder="https://..." 
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Status da Sala</label>
                  <div className="flex gap-2">
                    {['Rascunho', 'Publicado'].map((s) => (
                      <Button
                        key={s}
                        type="button"
                        variant={formData.status === s ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFormData({ ...formData, status: s as any })}
                        className="flex-1 rounded-xl"
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Introdução Poética (Manifesto)</label>
                  <Textarea 
                    placeholder="Escreva a alma desta exposição..." 
                    className="min-h-[180px] rounded-xl resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Mesa de Curadoria (Seletor de Ativos) */}
            <div className="space-y-6 border-l pl-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Mesa de Curadoria</h4>
                  <Badge variant="secondary" className="rounded-full">
                    {formData.asset_ids.length} selecionados
                  </Badge>
                </div>

                {/* Filtros e Busca */}
                <div className="space-y-4 bg-muted/30 p-4 rounded-2xl border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
                    <Input 
                      placeholder="Buscar no acervo..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background border-none rounded-xl shadow-sm"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] font-bold uppercase text-foreground mr-1">Filtrar por:</span>
                    <Badge 
                      variant={activeFilter === null ? "default" : "outline"}
                      className="cursor-pointer rounded-full transition-all"
                      onClick={() => setActiveFilter(null)}
                    >
                      Todos
                    </Badge>
                    {availableTags.map(tag => (
                      <Badge 
                        key={tag}
                        variant={activeFilter === tag ? "default" : "outline"}
                        className="cursor-pointer rounded-full transition-all flex items-center gap-1"
                        onClick={() => setActiveFilter(tag)}
                      >
                        <TagIcon className="h-2 w-2" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
                  {filteredAssets.length === 0 ? (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-sm text-foreground italic">Nenhum ativo encontrado com estes filtros.</p>
                    </div>
                  ) : (
                    filteredAssets.map((asset) => {
                      const isSelected = formData.asset_ids.includes(asset.id)
                      return (
                        <div 
                          key={asset.id}
                          onClick={() => toggleAsset(asset.id)}
                          className={cn(
                            "relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 transition-all group",
                            isSelected 
                              ? "border-primary ring-4 ring-primary/10" 
                              : "border-transparent opacity-70 hover:opacity-100 hover:border-primary/30"
                          )}
                        >
                          <img src={asset.image_url} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                          <div className={cn(
                            "absolute inset-0 flex items-center justify-center transition-opacity",
                            isSelected ? "bg-primary/20 opacity-100" : "bg-black/20 opacity-0 group-hover:opacity-100"
                          )}>
                            {isSelected && (
                              <CheckCircle2 className="h-8 w-8 text-white fill-primary" />
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 border-t bg-muted/10">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl">Cancelar</Button>
          <Button onClick={() => onSubmit(formData)} className="px-8 rounded-xl bg-primary shadow-lg shadow-primary/20">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Consolidar Curadoria
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
