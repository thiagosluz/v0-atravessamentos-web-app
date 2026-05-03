"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createMember } from "@/lib/actions/members-admin"

interface NewMemberDialogProps {
  onSuccess: (member: any) => void
}

export function NewMemberDialog({ onSuccess }: NewMemberDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createMember(formData)

    if (result?.error) {
      setError(result.error)
      setPending(false)
      return
    }

    const tagsStr = formData.get("tags") as string
    const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) : []

    const optimistic = {
      id: `temp-${Date.now()}`,
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      bio: formData.get("bio") as string,
      tags,
      avatar: null,
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
        Novo membro
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !pending && setOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm"
            />

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
                    Novo membro
                  </h2>
                  <p className="mt-1 text-sm text-foreground/55">
                    Adicione alguém ao coletivo.
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="mem-name" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                      Nome *
                    </label>
                    <Input id="mem-name" name="name" required disabled={pending} className="h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="mem-role" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                      Papel principal *
                    </label>
                    <Input id="mem-role" name="role" required disabled={pending} placeholder="Ex: Pesquisadora" className="h-10" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="mem-tags" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                    Tags (separadas por vírgula)
                  </label>
                  <Input id="mem-tags" name="tags" disabled={pending} placeholder="Ex: Educadoras, Artistas" className="h-10" />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="mem-bio" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                    Minibio
                  </label>
                  <textarea
                    id="mem-bio"
                    name="bio"
                    rows={3}
                    disabled={pending}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={pending} className="rounded-full">
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={pending} className="rounded-full bg-foreground text-background">
                    {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando…</> : "Adicionar membro"}
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
