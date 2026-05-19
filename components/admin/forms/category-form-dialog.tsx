"use client"

import * as React from "react"
import { Plus, Pencil, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AnimatedAdminModal } from "../shared/animated-admin-modal"
import { useAdminForm } from "@/hooks/use-admin-form"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { type Category, upsertCategory } from "@/lib/actions/categories"

interface CategoryFormDialogProps {
  type: "post" | "project" | "member"
  initialData?: Category | null
  onSuccess: (category: Category, isEdit: boolean) => void
  totalCount: number
}

export function CategoryFormDialog({ type, initialData, onSuccess, totalCount }: CategoryFormDialogProps) {
  const [open, setOpen] = React.useState(false)
  const { executeAction, pending, error } = useAdminForm()

  const isEdit = !!initialData

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const color = formData.get("color") as string
    
    executeAction({
      actionFn: async () => {
        const result = await upsertCategory({
          id: initialData?.id,
          type,
          name,
          color: color || null,
          sort_order: initialData?.sort_order ?? totalCount
        })
        if (result.error || !result.data) {
          return { error: result.error || "Não foi possível salvar a categoria." }
        }
        return result.data
      },
      onSuccessCallback: (result) => result,
      successMessage: () => ({
        title: "Categoria salva",
        description: "A categoria foi atualizada com sucesso."
      }),
      onComplete: (data) => {
        onSuccess(data, isEdit)
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
          className="h-8 w-8"
          onClick={() => setOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nova Categoria
        </Button>
      )}

      <AnimatedAdminModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={isEdit ? "Editar Categoria" : "Nova Categoria"}
        description="Preencha os dados da categoria. O slug será gerado automaticamente."
        maxWidthClass="max-w-md"
        isPending={pending}
      >
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" defaultValue={initialData?.name} placeholder="Ex: Audiovisual" required disabled={pending} className="h-10" />
            </div>
            <ColorPicker defaultValue={initialData?.color || ""} />
            
            {error && <p className="text-sm text-destructive">{error}</p>}
            
            <div className="flex justify-end gap-3 pt-2 border-t border-border mt-6">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={pending} className="rounded-full">
                Cancelar
              </Button>
              <Button type="submit" disabled={pending} className="rounded-full bg-foreground text-background">
                {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : "Salvar"}
              </Button>
            </div>
          </form>
      </AnimatedAdminModal>
    </>
  )
}

// ── Color Palette Picker ──────────────────────────────────────────────────────

const COLOR_OPTIONS = [
  { label: "Padrão",    value: "",         dot: "bg-foreground/30 border border-dashed border-foreground/40" },
  { label: "Âmbar",    value: "amber",    dot: "bg-amber-500" },
  { label: "Esmeralda",value: "emerald",  dot: "bg-emerald-600" },
  { label: "Ciano",    value: "cyan",     dot: "bg-cyan-500" },
  { label: "Azul",     value: "blue",     dot: "bg-blue-500" },
  { label: "Índigo",   value: "indigo",   dot: "bg-indigo-500" },
  { label: "Rosa",     value: "rose",     dot: "bg-rose-500" },
  { label: "Laranja",  value: "orange",   dot: "bg-orange-500" },
  { label: "Ardósia",  value: "slate",    dot: "bg-slate-500" },
] as const

type ColorValue = typeof COLOR_OPTIONS[number]["value"]

// Tailwind requires full class strings to be present in source for JIT
const BADGE_STYLES: Record<string, string> = {
  "":       "bg-foreground/10 text-foreground border-foreground/20",
  amber:    "bg-amber-500/15 text-amber-800 border-amber-500/30 dark:text-amber-400",
  emerald:  "bg-emerald-500/15 text-emerald-800 border-emerald-500/30 dark:text-emerald-400",
  cyan:     "bg-cyan-500/15 text-cyan-800 border-cyan-500/30 dark:text-cyan-400",
  blue:     "bg-blue-500/15 text-blue-800 border-blue-500/30 dark:text-blue-400",
  indigo:   "bg-indigo-500/15 text-indigo-800 border-indigo-500/30 dark:text-indigo-400",
  rose:     "bg-rose-500/15 text-rose-800 border-rose-500/30 dark:text-rose-400",
  orange:   "bg-orange-500/15 text-orange-800 border-orange-500/30 dark:text-orange-400",
  slate:    "bg-slate-500/15 text-slate-800 border-slate-500/30 dark:text-slate-400",
}

function ColorPicker({ defaultValue }: { defaultValue: string }) {
  const [selected, setSelected] = React.useState<ColorValue>(
    (defaultValue as ColorValue) ?? ""
  )

  return (
    <div className="grid gap-3">
      <Label>Cor da etiqueta</Label>
      {/* Hidden input to submit the value */}
      <input type="hidden" name="color" value={selected} />

      <div className="flex flex-wrap gap-2">
        {COLOR_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            title={opt.label}
            onClick={() => setSelected(opt.value)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
              selected === opt.value
                ? "border-foreground bg-foreground/5 ring-2 ring-foreground/20"
                : "border-border hover:border-foreground/40"
            )}
          >
            <span className={cn("h-3 w-3 rounded-full", opt.dot)} />
            {opt.label}
          </button>
        ))}
      </div>

      {/* Live preview */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
        <span className="text-xs text-foreground">Preview:</span>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
            BADGE_STYLES[selected]
          )}
        >
          {selected ? COLOR_OPTIONS.find(o => o.value === selected)?.label : "Sem cor"}
        </span>
      </div>
    </div>
  )
}
