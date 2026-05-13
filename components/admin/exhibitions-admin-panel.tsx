"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { 
  getExhibitions, 
  createExhibition, 
  updateExhibition, 
  deleteExhibition 
} from "@/lib/actions/exhibitions"
import { getGalleryAssets } from "@/lib/actions/gallery"
import { type Exhibition, type GalleryAsset, type ExhibitionFormData } from "@/types/admin"

import { ExhibitionsHeader } from "./panels/exhibitions/exhibitions-header"
import { ExhibitionsGrid } from "./panels/exhibitions/exhibitions-grid"
import { ExhibitionFormDialog } from "./panels/exhibitions/exhibition-form-dialog"

export function ExhibitionsAdminPanel() {
  const [exhibitions, setExhibitions] = React.useState<Exhibition[]>([])
  const [assets, setAssets] = React.useState<GalleryAsset[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isEditing, setIsEditing] = React.useState(false)
  const [selectedExhibition, setSelectedExhibition] = React.useState<Exhibition | null>(null)

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

  function handleOpenCreate() {
    setSelectedExhibition(null)
    setIsEditing(true)
  }

  function handleOpenEdit(ex: Exhibition) {
    setSelectedExhibition(ex)
    setIsEditing(true)
  }

  async function handleDelete(id: string) {
    if (confirm("Excluir esta sala virtual?")) {
      const res = await deleteExhibition(id)
      if (res.success) {
        toast({ title: "Exposição excluída" })
        loadData()
      } else {
        toast({ title: "Erro ao excluir", description: res.error, variant: "destructive" })
      }
    }
  }

  async function handleSubmit(formData: ExhibitionFormData) {
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
      <ExhibitionsHeader onAdd={handleOpenCreate} />

      <ExhibitionsGrid 
        exhibitions={exhibitions} 
        onEdit={handleOpenEdit} 
        onDelete={handleDelete} 
      />

      <ExhibitionFormDialog 
        open={isEditing} 
        onOpenChange={setIsEditing} 
        initialData={selectedExhibition}
        assets={assets}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
