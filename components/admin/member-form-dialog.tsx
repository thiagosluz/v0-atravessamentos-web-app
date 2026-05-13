"use client"

import * as React from "react"
import { Plus, Loader2, Pencil, Upload, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createMember, updateMember } from "@/lib/actions/members-admin"
import { type Member } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { AnimatedAdminModal } from "@/components/admin/animated-admin-modal"
import { useAdminForm } from "@/hooks/use-admin-form"
import { type Category } from "@/lib/actions/categories"

interface MemberFormDialogProps {
  initialData?: Member
  onSuccess: (member: any, isEdit: boolean) => void
  categories: Category[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function MemberFormDialog({ 
  initialData, 
  onSuccess, 
  categories,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: MemberFormDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen
  
  const [preview, setPreview] = React.useState<string | null>(initialData?.avatar || null)
  const [selectedTags, setSelectedTags] = React.useState<string[]>(initialData?.tags || [])
  const [editorContent, setEditorContent] = React.useState<string>(initialData?.bio || "")
  
  const { executeAction, pending, error } = useAdminForm()

  // Resetar formulário quando abrir
  React.useEffect(() => {
    if (open && !initialData) {
      setEditorContent("")
      setSelectedTags([])
      setPreview(null)
    } else if (open && initialData) {
      setEditorContent(initialData.bio || "")
      setSelectedTags(initialData.tags || [])
      setPreview(initialData.avatar || null)
    }
  }, [open, initialData])

  const isEdit = !!initialData
  const memberCategories = categories.filter(c => c.type === "member")

  function toggleTag(tagName: string) {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    )
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    formData.set("tags", selectedTags.join(","))

    // Garantir que a URL da imagem não se perca se o input file estiver vazio no edit
    if (isEdit && !formData.get("avatar") && initialData?.avatar) {
      formData.set("existingAvatarUrl", initialData.avatar)
    }

    executeAction({
      actionFn: () => isEdit ? updateMember(initialData!.id, formData) : createMember(formData),
      onSuccessCallback: (result) => {
        return {
          id: isEdit ? initialData!.id : ((result as any).id || `temp-${Date.now()}`),
          name: formData.get("name") as string,
          role: formData.get("role") as string,
          bio: formData.get("bio") as string,
          tags: selectedTags,
          instagram: formData.get("instagram") as string,
          linkedin: formData.get("linkedin") as string,
          lattes_url: formData.get("lattes_url") as string,
          email: formData.get("email") as string,
          phone: formData.get("phone") as string,
          avatar: preview,
        }
      },
      successMessage: (optimistic) => ({
        title: isEdit ? "Membro atualizado" : "Membro adicionado",
        description: isEdit 
          ? `${optimistic.name} foi atualizado com sucesso.` 
          : `${optimistic.name} agora faz parte do coletivo.`,
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

      <AnimatedAdminModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={isEdit ? "Editar membro" : "Novo membro"}
        description={isEdit ? "Atualize as informações do membro." : "Adicione alguém ao coletivo."}
        maxWidthClass="max-w-2xl"
        isPending={pending}
      >
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

          <div className="space-y-2.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
              Especialidades / Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {memberCategories.length > 0 ? (
                memberCategories.map((cat) => {
                  const isSelected = selectedTags.includes(cat.name)
                  const color = cat.color || "primary"
                  
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleTag(cat.name)}
                      disabled={pending}
                      className={cn(
                        "relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                        isSelected 
                          ? `bg-${color}-500/20 text-${color}-700 border-${color}-500/40 ring-1 ring-${color}-500/20`
                          : "bg-muted/50 text-foreground/50 border-border hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                      {cat.name}
                    </button>
                  )
                })
              ) : (
                <p className="text-[10px] text-foreground/40 italic">
                  Nenhuma tag de membro cadastrada em Configurações.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="mem-bio" className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
              Minibio
            </label>
            <RichTextEditor 
              content={editorContent} 
              onChange={setEditorContent} 
              placeholder="Escreva sobre a trajetória, formação e áreas de atuação..." 
            />
            <input type="hidden" name="bio" value={editorContent} />
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
                <label htmlFor="mem-lattes" className="text-xs font-semibold text-foreground/50">Currículo Lattes</label>
                <Input id="mem-lattes" name="lattes_url" defaultValue={initialData?.lattes_url || ""} disabled={pending} placeholder="URL do Lattes" className="h-10" />
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
      </AnimatedAdminModal>
    </>
  )
}

