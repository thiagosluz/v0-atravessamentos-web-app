"use client"

import * as React from "react"
import { Upload, X, ImageIcon, Layout, Sparkles, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { OrganicImage } from "@/components/ui/organic-image"
import { type SiteSettings, updateSiteSettings, uploadSiteImage } from "@/lib/actions/settings"
import { cn } from "@/lib/utils"

interface VisualSettingsPanelProps {
  siteSettings: SiteSettings
}

export function VisualSettingsPanel({ siteSettings }: VisualSettingsPanelProps) {
  const [settings, setSettings] = React.useState(siteSettings)
  const [isSaving, setIsSaving] = React.useState(false)
  const [uploadingField, setUploadingField] = React.useState<string | null>(null)
  const { toast } = useToast()

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, field: "hero" | number) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingField(field === "hero" ? "hero" : `about-${field}`)
    const formData = new FormData()
    formData.append("image", file)

    const res = await uploadSiteImage(formData)
    
    if (res.url) {
      if (field === "hero") {
        setSettings(prev => ({ ...prev, hero_image_url: res.url }))
      } else {
        const newAboutImages = [...(settings.about_images || [])]
        newAboutImages[field] = res.url
        setSettings(prev => ({ ...prev, about_images: newAboutImages }))
      }
      toast({ title: "Imagem carregada", description: "A pré-visualização foi atualizada." })
    } else {
      toast({ title: "Erro no upload", description: res.error, variant: "destructive" })
    }
    setUploadingField(null)
  }

  function handleRemoveImage(field: "hero" | number) {
    if (field === "hero") {
      setSettings(prev => ({ ...prev, hero_image_url: null }))
    } else {
      const newAboutImages = [...(settings.about_images || [])]
      newAboutImages[field] = "" // String vazia para disparar o fallback
      setSettings(prev => ({ ...prev, about_images: newAboutImages }))
    }
    toast({ title: "Imagem removida", description: "O padrão será restaurado ao salvar." })
  }

  async function handleSave() {
    setIsSaving(true)
    const res = await updateSiteSettings(settings)
    setIsSaving(false)

    if (res.success) {
      toast({ title: "Configurações salvas", description: "As imagens da landing page foram atualizadas." })
    } else {
      toast({ title: "Erro ao salvar", description: res.error, variant: "destructive" })
    }
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Identidade Visual</h2>
          <p className="text-muted-foreground text-sm">Gerencie as imagens e formas artísticas das seções principais.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Hero Section Management */}
        <section className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 font-semibold">
            <Layout className="h-5 w-5 text-primary" />
            <h3>Seção Hero (Topo)</h3>
          </div>
          
          <div className="space-y-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
              <OrganicImage 
                src={settings.hero_image_url || ""} 
                fallbackSrc="/placeholder.svg?width=800&height=1000&query=abstract-collage"
                shape="organic"
                alt="Prévia Hero"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                <label className="cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90">
                  {uploadingField === "hero" ? "Enviando..." : "Trocar"}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "hero")} />
                </label>
                {settings.hero_image_url && (
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="rounded-full"
                    onClick={() => handleRemoveImage("hero")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">Tamanho recomendado: 800x1000px (Vertical)</p>
          </div>
        </section>

        {/* About Section Management */}
        <section className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5 text-[var(--ouro)]" />
            <h3>Seção Sobre (Colagem)</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={cn(
                "relative aspect-square overflow-hidden rounded-lg bg-muted",
                i === 0 && "col-span-2 row-span-2 aspect-auto"
              )}>
                <OrganicImage 
                  src={settings.about_images?.[i] || ""} 
                  fallbackSrc={`/placeholder.svg?width=400&height=400&query=about-${i}`}
                  shape={i === 0 ? "organic" : i === 2 ? "rounded-custom" : "rounded-3xl"}
                  overlayColor={i === 0 ? "primary" : i === 1 ? "accent" : "ouro"}
                  alt={`Sobre ${i}`}
                />
                <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                  <label className="cursor-pointer p-1.5 bg-white/20 rounded-full hover:bg-white/40 transition-colors">
                    <Upload className="h-4 w-4 text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, i)} />
                  </label>
                  {settings.about_images?.[i] && (
                    <button 
                      onClick={() => handleRemoveImage(i)}
                      className="p-1.5 bg-destructive/80 rounded-full hover:bg-destructive transition-colors"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center italic">
            Dica: A primeira imagem é a principal e as outras compõem o grid.
          </p>
        </section>

        {/* Statistics Management */}
        <section className="space-y-4 rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <div className="flex items-center gap-2 font-semibold">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3>Estatísticas de Impacto (Seção Sobre)</h3>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">Anos de Travessia</label>
              <Input 
                value={settings.stats_years || ""} 
                onChange={(e) => setSettings(prev => ({ ...prev, stats_years: e.target.value }))}
                placeholder="Ex: 12"
              />
              <p className="text-[10px] text-muted-foreground italic">Deixe vazio para ocultar</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">Projetos Realizados</label>
              <Input 
                value={settings.stats_projects || ""} 
                onChange={(e) => setSettings(prev => ({ ...prev, stats_projects: e.target.value }))}
                placeholder="Ex: 40+"
              />
              <p className="text-[10px] text-muted-foreground italic">Deixe vazio para ocultar</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">Cidades Alcançadas</label>
              <Input 
                value={settings.stats_cities || ""} 
                onChange={(e) => setSettings(prev => ({ ...prev, stats_cities: e.target.value }))}
                placeholder="Ex: 6"
              />
              <p className="text-[10px] text-muted-foreground italic">Deixe vazio para ocultar</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
