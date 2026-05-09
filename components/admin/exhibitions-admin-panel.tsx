"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { 
  Plus, 
  GalleryVertical, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  Image as ImageIcon,
  Loader2,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { 
  getExhibitions, 
  createExhibition, 
  updateExhibition, 
  deleteExhibition 
} from "@/lib/actions/exhibitions"
import { getGalleryAssets } from "@/lib/actions/gallery"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export function ExhibitionsAdminPanel() {
  const [exhibitions, setExhibitions] = React.useState<any[]>([])
  const [assets, setAssets] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isEditing, setIsEditing] = React.useState(false)
  const [selectedExhibition, setSelectedExhibition] = React.useState<any | null>(null)
  
  // Estado do Formulário
  const [formData, setFormData] = React.useState({
    title: "",
    slug: "",
    description: "",
    cover_image: "",
    status: "Rascunho",
    asset_ids: [] as string[]
  })

  const { toast } = useToast()

  React.useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)
    const [exData, asData] = await Promise.all([
      getExhibitions(),
      getGalleryAssets()
    ])
    setExhibitions(exData)
    setAssets(asData)
    setIsLoading(false)
  }

  function openCreate() {
    setSelectedExhibition(null)
    setFormData({
      title: "",
      slug: "",
      description: "",
      cover_image: "",
      status: "Rascunho",
      asset_ids: []
    })
    setIsEditing(true)
  }

  function openEdit(ex: any) {
    setSelectedExhibition(ex)
    setFormData({
      title: ex.title,
      slug: ex.slug,
      description: ex.description || "",
      cover_image: ex.cover_image || "",
      status: ex.status || "Rascunho",
      asset_ids: ex.asset_ids || []
    })
    setIsEditing(true)
  }

  async function handleSubmit() {
    if (!formData.title || !formData.slug) {
      toast({ title: "Título e Slug são obrigatórios", variant: "destructive" })
      return
    }

    const res = selectedExhibition 
      ? await updateExhibition(selectedExhibition.id, formData)
      : await createExhibition(formData)

    if (res.success) {
      toast({ title: selectedExhibition ? "Exposição atualizada!" : "Exposição criada!" })
      setIsEditing(false)
      loadData()
    } else {
      toast({ title: "Erro ao salvar", description: res.error, variant: "destructive" })
    }
  }

  const toggleAsset = (id: string) => {
    const current = [...formData.asset_ids]
    if (current.includes(id)) {
      setFormData({ ...formData, asset_ids: current.filter(aid => aid !== id) })
    } else {
      setFormData({ ...formData, asset_ids: [...current, id] })
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary/40" />
        <p className="text-sm font-display italic text-foreground/50">Organizando as salas de memória...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header & Create */}
      <div className="flex flex-col gap-4 border-b border-border p-4 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold flex items-center gap-2 md:text-xl">
            <GalleryVertical className="h-5 w-5 text-primary" />
            Salas de Curadoria
          </h3>
          <p className="text-sm text-foreground/60">Crie narrativas visuais a partir do seu acervo.</p>
        </div>
        <Button onClick={openCreate} className="rounded-xl bg-primary text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" />
          Nova Exposição
        </Button>
      </div>

      {/* Listagem com Padding */}
      <div className="p-6 md:p-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {exhibitions.map((ex) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative overflow-hidden rounded-3xl border bg-card p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="aspect-video mb-4 overflow-hidden rounded-2xl bg-muted relative">
                {ex.cover_image ? (
                  <img src={ex.cover_image} alt={ex.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-foreground/20">
                    <ImageIcon className="h-12 w-12" />
                  </div>
                )}
                <Badge 
                  className="absolute top-2 right-2" 
                  variant={ex.status === 'Publicado' ? 'default' : 'secondary'}
                >
                  {ex.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-display text-lg font-bold truncate">{ex.title}</h4>
                <p className="text-xs text-foreground/60 line-clamp-2 italic">{ex.description}</p>
                <div className="flex items-center gap-2 text-[10px] text-foreground/40 font-medium">
                  <ImageIcon className="h-3 w-3" />
                  {ex.asset_ids?.length || 0} Ativos vinculados
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 rounded-xl" onClick={() => openEdit(ex)}>
                  <Edit2 className="mr-2 h-3 w-3" />
                  Editar
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="rounded-xl"
                  onClick={async () => {
                    if (confirm("Excluir esta sala virtual?")) {
                      await deleteExhibition(ex.id)
                      loadData()
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {exhibitions.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-foreground/40 italic">Nenhuma exposição criada ainda.</p>
          </div>
        )}
      </div>

      {/* Modal de Criação/Edição */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {selectedExhibition ? "Refinar Exposição" : "Inaugurar Nova Sala"}
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
            <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} className="px-8 rounded-xl">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Consolidar Curadoria
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
