"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { galleryAssetSchema } from "@/lib/validations"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, ArrowRight, Trash2 } from "lucide-react"
import { updateGalleryAsset, deleteGalleryAsset } from "@/lib/actions/gallery"
import { useToast } from "@/hooks/use-toast"

import { type GalleryAsset, type GalleryTag, type ProjectOption } from "@/types/admin"

interface EditAssetModalProps {
  asset: GalleryAsset | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  onNext?: () => void
  projects: ProjectOption[]
  availableTags: GalleryTag[]
}



export function EditAssetModal({
  asset,
  isOpen,
  onClose,
  onSuccess,
  onNext,
  projects,
  availableTags
}: EditAssetModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(galleryAssetSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      project_id: "",
      tags: [] as string[],
    },
  })

  // Atualiza os valores do formulário quando o asset muda (para navegação sequencial)
  React.useEffect(() => {
    if (asset) {
      form.reset({
        title: asset.title || "",
        description: asset.description || "",
        location: asset.location || "",
        project_id: asset.project_id || "none",
        tags: asset.tags || [],
      })
    }
  }, [asset, form])

  async function onSubmit(data: z.infer<typeof galleryAssetSchema>, nextAfter = false) {
    if (!asset) return
    setIsSubmitting(true)

    try {
      // Ajuste crucial: "none" vira null para o banco de dados
      const payload = {
        ...data,
        project_id: (data.project_id === "none" || data.project_id === "") ? null : data.project_id,
      }

      const res = await updateGalleryAsset(asset.id, payload)
      if (res.success) {
        toast({ title: "Ativo atualizado com sucesso!" })
        onSuccess()
        
        if (nextAfter && onNext) {
          onNext()
        } else if (!nextAfter) {
          onClose()
        }
      } else {
        toast({ title: "Erro ao atualizar", description: res.error, variant: "destructive" })
      }
    } catch (error) {
      console.error("Erro no submit:", error)
      toast({ title: "Erro técnico", description: "Verifique os dados informados.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleTag = (tagName: string) => {
    const currentTags = form.getValues("tags")
    if (currentTags.includes(tagName)) {
      form.setValue("tags", currentTags.filter(t => t !== tagName))
    } else {
      form.setValue("tags", [...currentTags, tagName])
    }
  }

  if (!asset) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Curadoria de Memória</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4 md:grid-cols-2">
          {/* Visualização da Imagem */}
          <div className="space-y-4">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl border bg-muted">
              <img 
                src={asset.image_url} 
                alt="Preview" 
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-xs text-foreground/40 break-all">{asset.image_url}</p>
          </div>

          {/* Formulário */}
          <Form {...form}>
            <form id="edit-asset-form" className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título Poético</FormLabel>
                    <FormControl>
                      <Input placeholder="Dê um nome a este momento..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Alto Paraíso, GO" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="project_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projeto Relacionado</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "none"}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Selecione um projeto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent position="popper" className="z-[110]">
                        <SelectItem value="none">Nenhum projeto</SelectItem>
                        {projects && projects.length > 0 ? (
                          projects.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.title}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-4 text-xs text-center text-muted-foreground italic">
                            Nenhum projeto cadastrado no banco.
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-[10px]">
                      Vincule esta imagem a um projeto existente.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Hashtags Conceituais</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={form.watch("tags").includes(tag.name) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag.name)}
                    >
                      #{tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manifesto / Contexto</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Escreva sobre o atravessamento desta imagem..." 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter className="flex-col gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={async () => {
              if (confirm("Excluir definitivamente esta memória?")) {
                await deleteGalleryAsset(asset.id)
                onSuccess()
                onClose()
              }
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={form.handleSubmit((d) => onSubmit(d, false))}
              disabled={isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </Button>
            
            {onNext && (
              <Button 
                type="button" 
                onClick={form.handleSubmit((d) => onSubmit(d, true))}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="mr-2 h-4 w-4" />
                )}
                Salvar e Próximo
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
