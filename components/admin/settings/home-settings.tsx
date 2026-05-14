"use client"

import * as React from "react"
import { Home, BarChart3, Images } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SmartImageUpload } from "../shared/smart-image-upload"
import { type SiteSettings } from "@/lib/actions/settings"

interface HomeSettingsProps {
  settings: SiteSettings
  setSettings: (settings: SiteSettings) => void
}

export function HomeSettings({ settings, setSettings }: HomeSettingsProps) {
  // Helper para atualizar as imagens da colagem
  const updateAboutImage = (index: number, url: string) => {
    const newImages = [...(settings.about_images || [])]
    // Garantir que o array tenha tamanho suficiente
    while (newImages.length <= index) {
      newImages.push("")
    }
    newImages[index] = url
    setSettings({ ...settings, about_images: newImages })
  }

  return (
    <div className="space-y-10">
      {/* Seção Hero */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-primary">
          <Home className="h-5 w-5" />
          <h3 className="text-lg font-bold">Destaque Principal (Hero)</h3>
        </div>

        <div className="space-y-4">
          <Label>Imagem de Destaque</Label>
          <SmartImageUpload
            value={settings.hero_image_url || ""}
            onChange={(url) => setSettings({ ...settings, hero_image_url: url })}
          />
          <p className="text-xs text-foreground/40">
            A imagem principal que aparece ao lado do título do coletivo.
          </p>
        </div>
      </div>

      <hr className="border-border/50" />

      {/* Seção Números */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-primary">
          <BarChart3 className="h-5 w-5" />
          <h3 className="text-lg font-bold">Números de Impacto</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="stats_years">Anos de Travessia</Label>
            <Input
              id="stats_years"
              value={settings.stats_years || ""}
              onChange={(e) => setSettings({ ...settings, stats_years: e.target.value })}
              placeholder="Ex: 3"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stats_projects">Projetos Realizados</Label>
            <Input
              id="stats_projects"
              value={settings.stats_projects || ""}
              onChange={(e) => setSettings({ ...settings, stats_projects: e.target.value })}
              placeholder="Ex: 10+"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stats_cities">Cidades Alcançadas</Label>
            <Input
              id="stats_cities"
              value={settings.stats_cities || ""}
              onChange={(e) => setSettings({ ...settings, stats_cities: e.target.value })}
              placeholder="Ex: 6"
            />
          </div>
        </div>
      </div>

      <hr className="border-border/50" />

      {/* Seção Colagem Sobre */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-primary">
          <Images className="h-5 w-5" />
          <h3 className="text-lg font-bold">Colagem de Fotos (Sobre)</h3>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Foto Principal (Grande)</Label>
            <SmartImageUpload
              value={settings.about_images?.[0] || ""}
              onChange={(url) => updateAboutImage(0, url)}
            />
          </div>
          <div className="space-y-2">
            <Label>Foto Superior Direita</Label>
            <SmartImageUpload
              value={settings.about_images?.[1] || ""}
              onChange={(url) => updateAboutImage(1, url)}
            />
          </div>
          <div className="space-y-2">
            <Label>Foto Inferior Esquerda</Label>
            <SmartImageUpload
              value={settings.about_images?.[2] || ""}
              onChange={(url) => updateAboutImage(2, url)}
            />
          </div>
          <div className="space-y-2">
            <Label>Foto Central Inferior</Label>
            <SmartImageUpload
              value={settings.about_images?.[3] || ""}
              onChange={(url) => updateAboutImage(3, url)}
            />
          </div>
          <div className="space-y-2">
            <Label>Foto Direita Inferior</Label>
            <SmartImageUpload
              value={settings.about_images?.[4] || ""}
              onChange={(url) => updateAboutImage(4, url)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
