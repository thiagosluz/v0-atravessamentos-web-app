"use client"

import * as React from "react"
import { Plus, Loader2, Pencil, Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog-admin"
import { cn } from "@/lib/utils"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { AnimatedAdminModal } from "@/components/admin/animated-admin-modal"
import { useAdminForm } from "@/hooks/use-admin-form"

import { type Category } from "@/lib/actions/categories"

const STATUSES = ["Publicado", "Rascunho"] as const

interface BlogFormDialogProps {
  initialData?: any
  categories: Category[]
  onSuccess: (post: any, isEdit: boolean) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function BlogFormDialog({ 
  initialData, 
  categories, 
  onSuccess,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: BlogFormDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen
  const [status, setStatus] = React.useState<string>(initialData?.status || "Rascunho")
  const [editorContent, setEditorContent] = React.useState<string>(initialData?.content || "")
  const [coverPreview, setCoverPreview] = React.useState<string | null>(initialData?.coverImage || null)
  const { executeAction, pending, error } = useAdminForm()
  // Mock function for local validation that previously used toast
  const showToast = (opts: any) => console.warn("Validation error:", opts.title)

  // Resetar formulário quando abrir para um NOVO post
  React.useEffect(() => {
    if (open && !initialData) {
      setEditorContent("")
      setCoverPreview(null)
      setStatus("Rascunho")
    } else if (open && initialData) {
      setEditorContent(initialData.content || "")
      setCoverPreview(initialData.coverImage || null)
      setStatus(initialData.status || "Rascunho")
    }
  }, [open, initialData])

  const isEdit = !!initialData

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast({
          title: "Arquivo muito grande",
          description: "A capa deve ter no máximo 2MB.",
          variant: "destructive",
        })
        e.target.value = ""
        return
      }
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    formData.set("status", status)
    formData.set("content", editorContent)

    executeAction({
      actionFn: () => isEdit ? updateBlogPost(initialData.id, formData) : createBlogPost(formData),
      onSuccessCallback: (result) => ({
        id: isEdit ? initialData.id : ((result as any).id || `temp-${Date.now()}`),
        title: formData.get("title") as string,
        category: formData.get("category") as string,
        excerpt: formData.get("excerpt") as string,
        content: editorContent,
        author: formData.get("author") as string,
        readTime: formData.get("readTime") as string,
        status: status,
        date: initialData?.date || new Date().toISOString(),
        coverImage: coverPreview,
      }),
      successMessage: (optimistic) => ({
        title: isEdit ? "Post atualizado" : "Post criado",
        description: isEdit 
          ? `O post "${optimistic.title}" foi atualizado com sucesso.`
          : `O post "${optimistic.title}" foi adicionado ao diário.`,
      }),
      onComplete: (optimistic) => {
        onSuccess(optimistic, isEdit)
        if (!isEdit) {
          setEditorContent("")
          setCoverPreview(null)
          setStatus("Rascunho")
        }
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
          aria-label="Editar post"
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
          Novo post
        </Button>
      )}

      <AnimatedAdminModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={isEdit ? "Editar post do diário" : "Novo post do diário"}
        description={isEdit ? "Atualize o conteúdo do post." : "Escreva para o blog."}
        maxWidthClass="max-w-4xl"
        isPending={pending}
      >

              <form id="blog-form" onSubmit={handleSubmit} className="space-y-4">
                {/* Cover Image Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                    Imagem de Capa
                  </label>
                  <div 
                    className={cn(
                      "group relative flex aspect-[21/9] w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30 transition-all hover:bg-muted/50",
                      coverPreview && "border-solid border-transparent"
                    )}
                  >
                    {coverPreview ? (
                      <>
                        <img src={coverPreview} alt="Capa" className="h-full w-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                          <Button 
                            type="button" 
                            variant="secondary" 
                            size="sm" 
                            className="rounded-full shadow-lg"
                            onClick={() => (document.getElementById("blog-cover") as HTMLInputElement).click()}
                          >
                            <Upload className="mr-2 h-4 w-4" /> Alterar capa
                          </Button>
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="icon" 
                            className="ml-2 rounded-full shadow-lg"
                            onClick={() => setCoverPreview(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-foreground/30">
                        <ImageIcon className="h-8 w-8" />
                        <span className="text-xs font-medium">Recomendado: 1200x500px</span>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 rounded-full border-dashed border-foreground/30 bg-transparent text-foreground/50 hover:bg-muted"
                          onClick={() => (document.getElementById("blog-cover") as HTMLInputElement).click()}
                        >
                          Escolher imagem
                        </Button>
                      </div>
                    )}
                    <input 
                      id="blog-cover" 
                      name="coverImage" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleCoverChange} 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="blog-title" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                    Título *
                  </label>
                  <Input id="blog-title" name="title" defaultValue={initialData?.title} required disabled={pending} className="h-10" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="blog-category" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                      Categoria *
                    </label>
                    <select
                      name="category"
                      id="category"
                      defaultValue={initialData?.category || categories[0]?.name || ""}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name} className="bg-background text-foreground">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="blog-author" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                      Autor *
                    </label>
                    <Input id="blog-author" name="author" defaultValue={initialData?.author} required disabled={pending} className="h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="blog-readtime" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                      Tempo leitura
                    </label>
                    <Input id="blog-readtime" name="readTime" defaultValue={initialData?.readTime || "5 min"} disabled={pending} className="h-10" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="blog-status" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
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
                              : "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "border-border bg-background hover:bg-muted text-foreground/70"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="blog-excerpt" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                    Resumo (Linha fina)
                  </label>
                  <textarea id="blog-excerpt" name="excerpt" defaultValue={initialData?.excerpt} rows={2} disabled={pending} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                    Conteúdo
                  </label>
                  <RichTextEditor 
                    content={editorContent} 
                    onChange={setEditorContent} 
                    placeholder="Escreva o conteúdo do post..." 
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="flex justify-end gap-3 pt-2 border-t border-border mt-4">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={pending} className="rounded-full mt-4">
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={pending} className="rounded-full bg-foreground text-background mt-4">
                    {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando…</> : (isEdit ? "Salvar alterações" : "Publicar post")}
                  </Button>
                </div>
              </form>
      </AnimatedAdminModal>
    </>
  )
}
