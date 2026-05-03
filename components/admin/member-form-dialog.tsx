"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, Plus, Loader2, Upload, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createMember, updateMember } from "@/lib/actions/members-admin"
import { type Member } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

interface MemberFormDialogProps {
  initialData?: Member
  onSuccess: (member: any, isEdit: boolean) => void
}

export function MemberFormDialog({ initialData, onSuccess }: MemberFormDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const { toast } = useToast()
  const [error, setError] = React.useState<string | null>(null)
  const [preview, setPreview] = React.useState<string | null>(initialData?.avatar || null)

  const isEdit = !!initialData

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    let result

    if (isEdit) {
      result = await updateMember(initialData.id, formData)
    } else {
      result = await createMember(formData)
    }

    if (result?.error) {
      setError(result.error)
      setPending(false)
      return
    }

    const tagsStr = formData.get("tags") as string
    const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) : []

    const optimistic: any = {
      id: isEdit ? initialData.id : `temp-${Date.now()}`,
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      bio: formData.get("bio") as string,
      instagram: formData.get("instagram") as string,
      linkedin: formData.get("linkedin") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      tags,
      avatar: preview, // optimistic preview
    }

    onSuccess(optimistic, isEdit)
    toast({
      title: isEdit ? "Membro atualizado" : "Membro adicionado",
      description: isEdit 
        ? `${optimistic.name} foi atualizado com sucesso.` 
        : `${optimistic.name} agora faz parte do coletivo.`,
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
          Novo membro
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
                    {isEdit ? "Editar membro" : "Novo membro"}
                  </h2>
                  <p className="mt-1 text-sm text-foreground/55">
                    {isEdit ? "Atualize as informações do membro." : "Adicione alguém ao coletivo."}
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

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Avatar Upload */}
                <div className="flex items-center gap-6">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-dashed border-foreground/30 bg-muted/50">
                    {preview ? (
                      <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-foreground/30">
                        <Upload className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label htmlFor="mem-avatar" className="text-sm font-semibold text-foreground/80">
                      Foto de perfil
                    </label>
                    <p className="text-xs text-foreground/50">Formato JPG ou PNG. Recomendado: 800x800px.</p>
                    <Input id="mem-avatar" name="avatar" type="file" accept="image/*" onChange={handleFileChange} disabled={pending} className="mt-2 text-sm h-auto py-1.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="mem-name" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                      Nome *
                    </label>
                    <Input id="mem-name" name="name" defaultValue={initialData?.name} required disabled={pending} className="h-10" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="mem-role" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                      Papel principal *
                    </label>
                    <Input id="mem-role" name="role" defaultValue={initialData?.role} required disabled={pending} placeholder="Ex: Pesquisadora" className="h-10" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="mem-tags" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                    Tags (separadas por vírgula)
                  </label>
                  <Input id="mem-tags" name="tags" defaultValue={initialData?.tags?.join(", ")} disabled={pending} placeholder="Ex: Educadoras, Artistas" className="h-10" />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="mem-bio" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                    Minibio
                  </label>
                  <textarea
                    id="mem-bio"
                    name="bio"
                    defaultValue={initialData?.bio}
                    rows={3}
                    disabled={pending}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>

                {/* Social Links */}
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-bold tracking-tight mb-4">Contatos e Redes (Opcional)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="mem-instagram" className="text-xs font-semibold text-foreground/50">Instagram</label>
                      <Input id="mem-instagram" name="instagram" defaultValue={initialData?.instagram || ""} disabled={pending} placeholder="@usuario" className="h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="mem-linkedin" className="text-xs font-semibold text-foreground/50">LinkedIn</label>
                      <Input id="mem-linkedin" name="linkedin" defaultValue={initialData?.linkedin || ""} disabled={pending} placeholder="URL do perfil" className="h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="mem-email" className="text-xs font-semibold text-foreground/50">E-mail</label>
                      <Input id="mem-email" name="email" type="email" defaultValue={initialData?.email || ""} disabled={pending} placeholder="contato@exemplo.com" className="h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="mem-phone" className="text-xs font-semibold text-foreground/50">Telefone/WhatsApp</label>
                      <Input id="mem-phone" name="phone" defaultValue={initialData?.phone || ""} disabled={pending} placeholder="(00) 00000-0000" className="h-10" />
                    </div>
                  </div>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={pending} className="rounded-full">
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={pending} className="rounded-full bg-foreground text-background">
                    {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando…</> : (isEdit ? "Salvar alterações" : "Adicionar membro")}
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

