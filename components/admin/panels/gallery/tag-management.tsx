"use client"

import * as React from "react"
import { Plus, Tag as TagIcon, X, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { type GalleryTag } from "@/types/admin"

interface TagManagementProps {
  tags: GalleryTag[]
  newTag: string
  setNewTag: (value: string) => void
  onCreateTag: () => void
  onDeleteTag: (tagId: string, tagName: string) => Promise<void>
  onCountUsage: (tagName: string) => Promise<number>
}

export function TagManagement({
  tags,
  newTag,
  setNewTag,
  onCreateTag,
  onDeleteTag,
  onCountUsage,
}: TagManagementProps) {
  const [deleteTarget, setDeleteTarget] = React.useState<{ id: string; name: string } | null>(null)
  const [usageCount, setUsageCount] = React.useState<number>(0)
  const [isLoadingUsage, setIsLoadingUsage] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDeleteClick = async (tag: GalleryTag) => {
    setDeleteTarget({ id: tag.id, name: tag.name })
    setIsLoadingUsage(true)
    const count = await onCountUsage(tag.name)
    setUsageCount(count)
    setIsLoadingUsage(false)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    await onDeleteTag(deleteTarget.id, deleteTarget.name)
    setIsDeleting(false)
    setDeleteTarget(null)
  }

  return (
    <section className="space-y-4">
      <h3 className="font-display text-lg font-bold flex items-center gap-2">
        <TagIcon className="h-5 w-5" />
        Hashtags Conceituais
      </h3>

      {/* Input para criar nova tag */}
      <div className="flex gap-2">
        <Input 
          placeholder="Nova hashtag (ex: cerrado)" 
          className="max-w-xs h-10 rounded-xl"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onCreateTag()}
        />
        <Button onClick={onCreateTag} className="rounded-xl bg-primary text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Tag
        </Button>
      </div>

      {/* Tags existentes como chips removíveis */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/5"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => handleDeleteClick(tag)}
                className="rounded-full p-0.5 text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Excluir tag ${tag.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Diálogo de confirmação inteligente */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="sm:max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Excluir tag &ldquo;{deleteTarget?.name}&rdquo;
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 pt-1">
                {isLoadingUsage ? (
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verificando uso da tag...
                  </div>
                ) : usageCount > 0 ? (
                  <p className="text-sm">
                    Esta tag está sendo usada por{" "}
                    <strong className="text-foreground">{usageCount} {usageCount === 1 ? "mídia" : "mídias"}</strong>
                    {" "}no acervo. Ao excluir, a tag será removida automaticamente dessas mídias.
                  </p>
                ) : (
                  <p className="text-sm">
                    Esta tag não está sendo usada por nenhuma mídia. Ela será excluída permanentemente.
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isLoadingUsage || isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : usageCount > 0 ? (
                `Excluir e remover de ${usageCount} ${usageCount === 1 ? "mídia" : "mídias"}`
              ) : (
                "Excluir tag"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
