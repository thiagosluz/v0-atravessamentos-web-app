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
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { ExhibitionsHeader } from "./exhibitions/exhibitions-header"
import { ExhibitionsGrid } from "./exhibitions/exhibitions-grid"
import { ExhibitionFormDialog } from "./exhibitions/exhibition-form-dialog"

export function ExhibitionsAdminPanel() {
  const [exhibitions, setExhibitions] = React.useState<Exhibition[]>([])
  const [assets, setAssets] = React.useState<GalleryAsset[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isEditing, setIsEditing] = React.useState(false)
  const [selectedExhibition, setSelectedExhibition] = React.useState<Exhibition | null>(null)
  const [exhibitionToDelete, setExhibitionToDelete] = React.useState<string | null>(null)
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
    setExhibitionToDelete(id)
  }

  async function confirmDelete() {
    if (!exhibitionToDelete) return
    const res = await deleteExhibition(exhibitionToDelete)
    if (res.success) {
      toast({ title: "Exposição excluída" })
      loadData()
    } else {
      toast({ title: "Erro ao excluir", description: res.error, variant: "destructive" })
    }
    setExhibitionToDelete(null)
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

  async function handleToggleStatus(id: string, newStatus: "Publicado" | "Rascunho") {
    const res = await updateExhibition(id, { status: newStatus } as ExhibitionFormData)
    if (res.success) {
      toast({ title: newStatus === "Publicado" ? "Exposição publicada!" : "Exposição recolhida para rascunho." })
      loadData()
    } else {
      toast({ title: "Erro ao alterar status", description: res.error, variant: "destructive" })
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary/40" />
        <p className="text-sm font-display italic text-foreground">Organizando as salas de memória...</p>
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
        onToggleStatus={handleToggleStatus}
      />

      <ExhibitionFormDialog 
        open={isEditing} 
        onOpenChange={setIsEditing} 
        initialData={selectedExhibition}
        assets={assets}
        onSubmit={handleSubmit}
      />

      {/* Modal de Confirmação de Deleção Customizado */}
      <AlertDialog open={!!exhibitionToDelete} onOpenChange={(open: boolean) => !open && setExhibitionToDelete(null)}>
        <AlertDialogContent className="rounded-[32px] border-none shadow-2xl p-8">
          <AlertDialogHeader>
            <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <Trash2 className="h-6 w-6" />
            </div>
            <AlertDialogTitle className="text-2xl font-display font-black uppercase italic tracking-tight">
              Excluir Exposição
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-foreground">
              Você tem certeza que deseja excluir esta sala virtual? Esta ação removerá a narrativa e desvinculará os ativos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="rounded-full border-none bg-muted hover:bg-muted/80 h-12 px-6 font-bold transition-all">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="rounded-full bg-red-600 hover:bg-red-700 text-white h-12 px-8 font-bold shadow-lg shadow-red-600/20 transition-all border-none"
            >
              Sim, Excluir Sala
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
