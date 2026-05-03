"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, Plus, Loader2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog-admin"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

const CATEGORIES = ["Reflexão", "Evento", "Manifesto", "Notícia"] as const
const STATUSES = ["Publicado", "Rascunho"] as const

interface BlogFormDialogProps {
  initialData?: any
  onSuccess: (post: any, isEdit: boolean) => void
}

export function BlogFormDialog({ initialData, onSuccess }: BlogFormDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<string>(initialData?.status || "Rascunho")
  const { toast } = useToast()

  const isEdit = !!initialData

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set("status", status)

    let result

    if (isEdit) {
      result = await updateBlogPost(initialData.id, formData)
    } else {
      result = await createBlogPost(formData)
    }

    if (result?.error) {
      setError(result.error)
      setPending(false)
      return
    }

    const optimistic = {
      id: isEdit ? initialData.id : `temp-${Date.now()}`,
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      excerpt: formData.get("excerpt") as string,
      content: formData.get("content") as string,
      author: formData.get("author") as string,
      readTime: formData.get("readTime") as string,
      status: status,
      date: initialData?.date || new Date().toISOString(),
      coverImage: initialData?.coverImage || null,
    }

    onSuccess(optimistic, isEdit)
    
    toast({
      title: isEdit ? "Post atualizado" : "Post criado",
      description: isEdit 
        ? `O post "${optimistic.title}" foi atualizado com sucesso.`
        : `O post "${optimistic.title}" foi adicionado ao diário.`,
    })

    setOpen(false)
    setPending(false)
  }

  return (
    <>
      {isEdit ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-foreground/70 hover:text-foreground"
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

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !pending && setOpen(false)}
              className="fixed inset-0 z-[100] bg-foreground/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 z-[101] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-2xl overflow-y-auto max-h-[90vh] text-left whitespace-normal"
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold tracking-tight">
                    {isEdit ? "Editar post do diário" : "Novo post do diário"}
                  </h2>
                  <p className="mt-1 text-sm text-foreground/55">
                    {isEdit ? "Atualize o conteúdo do post." : "Escreva para o blog."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => !pending && setOpen(false)}
                  className="rounded-full p-1.5 text-foreground/40 hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                      id="blog-category"
                      name="category"
                      required
                      defaultValue={initialData?.category || ""}
                      disabled={pending}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Selecione…</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
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
                        className={cn(
                          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                          status === s 
                            ? "border-primary bg-primary/10 text-primary" 
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
                  <label htmlFor="blog-content" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                    Conteúdo
                  </label>
                  <textarea id="blog-content" name="content" defaultValue={initialData?.content} rows={8} disabled={pending} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none font-mono" placeholder="Escreva o conteúdo em parágrafos separados..." />
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
