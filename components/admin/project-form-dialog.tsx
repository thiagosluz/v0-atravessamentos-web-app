"use client"

import * as React from "react"
import { Plus, Loader2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createProject, updateProject } from "@/lib/actions/projects-admin"
import { cn } from "@/lib/utils"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { AnimatedAdminModal } from "@/components/admin/animated-admin-modal"
import { useAdminForm } from "@/hooks/use-admin-form"

import { type Category } from "@/lib/actions/categories"

const STATUSES = ["Publicado", "Rascunho", "Em revisão"] as const

interface ProjectFormDialogProps {
  initialData?: any
  categories: Category[]
  onSuccess: (project: any, isEdit: boolean) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ProjectFormDialog({ 
  initialData, 
  categories, 
  onSuccess,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: ProjectFormDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen
  const [status, setStatus] = React.useState<string>(initialData?.status || "Rascunho")
  const [editorContent, setEditorContent] = React.useState<string>(initialData?.description || "")
  const { executeAction, pending, error } = useAdminForm()

  // Resetar formulário quando abrir
  React.useEffect(() => {
    if (open && !initialData) {
      setEditorContent("")
      setStatus("Rascunho")
    } else if (open && initialData) {
      setEditorContent(initialData.description || "")
      setStatus(initialData.status || "Rascunho")
    }
  }, [open, initialData])

  const isEdit = !!initialData

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    formData.set("status", status)
    
    executeAction({
      actionFn: () => isEdit ? updateProject(initialData.id, formData) : createProject(formData),
      onSuccessCallback: (result) => ({
        id: isEdit ? initialData.id : (result.id || `temp-${Date.now()}`),
        title: formData.get("title") as string,
        category: formData.get("category") as string,
        description: formData.get("description") as string,
        year: parseInt(formData.get("year") as string),
        status: status,
        coverImage: initialData?.coverImage || null,
        updatedAt: new Date().toISOString(),
      }),
      successMessage: (optimistic) => ({
        title: isEdit ? "Projeto atualizado" : "Projeto criado",
        description: isEdit 
          ? `O projeto "${optimistic.title}" foi atualizado com sucesso.`
          : `O projeto "${optimistic.title}" foi adicionado à galeria.`,
      }),
      onComplete: (optimistic) => {
        onSuccess(optimistic, isEdit)
        setOpen(false)
      }
    })
  }

  return (
    <>
      {isEdit ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-foreground/70 hover:text-foreground"
          aria-label="Editar projeto"
          onClick={() => setOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Novo projeto
        </Button>
      )}

      <AnimatedAdminModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={isEdit ? "Editar projeto" : "Novo projeto"}
        description={isEdit ? "Atualize as informações do projeto." : "Preencha as informações básicas para criar o projeto."}
        maxWidthClass="max-w-4xl"
        isPending={pending}
      >

              <form id="project-form" onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label htmlFor="proj-title" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                    Título *
                  </label>
                  <Input
                    id="proj-title"
                    name="title"
                    required
                    defaultValue={initialData?.title}
                    placeholder="Ex: América Invertida"
                    disabled={pending}
                    className="h-10"
                  />
                </div>

                {/* Category + Year */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="proj-category" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                      Categoria *
                    </label>
                      <select
                        name="category"
                        id="project-category"
                        defaultValue={initialData?.category || categories[0]?.name || ""}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                        disabled={pending}
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.name} className="bg-background text-foreground">
                            {c.name}
                          </option>
                        ))}
                      </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="proj-year" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                      Ano *
                    </label>
                    <Input
                      id="proj-year"
                      name="year"
                      type="number"
                      required
                      min={2000}
                      max={2099}
                      defaultValue={initialData?.year || new Date().getFullYear()}
                      disabled={pending}
                      className="h-10"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label htmlFor="proj-status" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                    Status *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s)}
                        disabled={pending}
                        aria-label={`Status ${s}`}
                        className={cn(
                          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                          status === s 
                            ? s === "Publicado" 
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                              : s === "Rascunho"
                                ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background hover:bg-muted text-foreground/70"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label htmlFor="proj-desc" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                    Descrição do Projeto
                  </label>
                  <RichTextEditor 
                    content={editorContent} 
                    onChange={setEditorContent} 
                    placeholder="Conte a história deste projeto, insira imagens e vídeos…" 
                  />
                  <input type="hidden" name="description" value={editorContent} />
                </div>

                {error && (
                  <p className="text-sm text-destructive" role="alert">{error}</p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => !pending && setOpen(false)}
                    disabled={pending}
                    className="rounded-full"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={pending}
                    className="rounded-full bg-foreground text-background hover:bg-primary"
                  >
                    {pending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando…</>
                    ) : (
                      isEdit ? "Salvar alterações" : "Criar projeto"
                    )}
                  </Button>
                </div>
              </form>
      </AnimatedAdminModal>
    </>
  )
}
