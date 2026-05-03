"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createProject } from "@/lib/actions/projects-admin"
import { cn } from "@/lib/utils"

const CATEGORIES = ["Audiovisual", "Educação", "Evento", "Pesquisa", "Editorial"] as const
const STATUSES = ["Publicado", "Rascunho", "Em revisão"] as const

interface NewProjectDialogProps {
  onSuccess: (project: any) => void
}

export function NewProjectDialog({ onSuccess }: NewProjectDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createProject(formData)

    if (result?.error) {
      setError(result.error)
      setPending(false)
      return
    }

    // Build a temporary project object for optimistic UI update
    const optimistic = {
      id: `temp-${Date.now()}`,
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      year: parseInt(formData.get("year") as string),
      status: formData.get("status") as string,
      coverImage: null,
      updatedAt: new Date().toISOString(),
    }

    onSuccess(optimistic)
    setOpen(false)
    setPending(false)
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="mr-1.5 h-4 w-4" />
        Novo projeto
      </Button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !pending && setOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm"
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold tracking-tight">
                    Novo projeto
                  </h2>
                  <p className="mt-1 text-sm text-foreground/55">
                    Preencha as informações básicas para criar o projeto.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => !pending && setOpen(false)}
                  className="rounded-full p-1.5 text-foreground/40 hover:bg-muted hover:text-foreground transition-colors"
                  aria-label="Fechar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label htmlFor="proj-title" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                    Título *
                  </label>
                  <Input
                    id="proj-title"
                    name="title"
                    required
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
                      id="proj-category"
                      name="category"
                      required
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
                      defaultValue={new Date().getFullYear()}
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
                      <label key={s} className="cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value={s}
                          defaultChecked={s === "Rascunho"}
                          className="sr-only"
                          disabled={pending}
                        />
                        <span className={cn(
                          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                          "border-border bg-background hover:bg-muted",
                          "[&:has(input:checked)]:border-primary [&:has(input:checked)]:bg-primary/10 [&:has(input:checked)]:text-primary"
                        )}>
                          {s}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label htmlFor="proj-desc" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                    Descrição
                  </label>
                  <textarea
                    id="proj-desc"
                    name="description"
                    placeholder="Um breve texto sobre o projeto…"
                    rows={3}
                    disabled={pending}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
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
                      "Criar projeto"
                    )}
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
