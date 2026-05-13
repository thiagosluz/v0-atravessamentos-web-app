"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SmartImageUpload } from "@/components/admin/smart-image-upload"
import { SEOPreview } from "@/components/admin/seo-preview"
import { type SiteSettings } from "@/lib/actions/settings"

interface InstitutionalSettingsProps {
  settings: SiteSettings
  setSettings: (settings: SiteSettings) => void
}

export function InstitutionalSettings({ settings, setSettings }: InstitutionalSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Identidade Institucional
        </h3>
        <p className="text-sm text-foreground/60 mt-1">
          Textos exibidos no rodapé e em metadados globais.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo_title">Título do Site (SEO)</Label>
        <Input
          id="seo_title"
          value={settings.seo_title || ""}
          onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
          placeholder="Ex: Atravessamentos — Arte e Educação"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="global_seo_desc">Meta Descrição Global</Label>
        <Textarea
          id="global_seo_desc"
          value={settings.seo_description || ""}
          onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
          placeholder="Descrição principal que representa o coletivo em todo o site..."
          className="h-24 resize-none"
        />
        <p className="text-xs text-foreground/40">
          Aparece nos resultados de busca do Google (120-160 caracteres).
        </p>
      </div>

      <div className="space-y-4">
        <Label htmlFor="og_image">Imagem de Compartilhamento (SEO)</Label>
        <SmartImageUpload
          value={settings.og_image_url || ""}
          onChange={(url) => setSettings({ ...settings, og_image_url: url })}
        />
        <p className="text-xs text-foreground/40">
          Aparece no WhatsApp e Redes Sociais. Qualquer imagem enviada será automaticamente
          centralizada com fundo borrado no tamanho ideal (1200x630px).
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="footer_description">Descrição do Rodapé</Label>
        <Textarea
          id="footer_description"
          value={settings.footer_description}
          onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
          placeholder="Ex: Coletivo de educação, arte e justiça social..."
          className="h-24"
        />
      </div>

      <div className="mt-8 pt-8 border-t border-border/50">
        <div className="mb-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-foreground/70">
            Prévia da Identidade Digital
          </h4>
          <p className="text-xs text-foreground/40 mt-1">
            Veja como o Coletivo aparece no mundo digital.
          </p>
        </div>
        <SEOPreview
          title={settings.seo_title || ""}
          description={settings.seo_description || ""}
          imageUrl={settings.og_image_url}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location_text">Localização (Texto)</Label>
        <Input
          id="location_text"
          value={settings.location_text}
          onChange={(e) => setSettings({ ...settings, location_text: e.target.value })}
          placeholder="Ex: Jataí — GO, Brasil · Cerrado"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location_url">URL do Google Maps</Label>
        <Input
          id="location_url"
          value={settings.location_url}
          onChange={(e) => setSettings({ ...settings, location_url: e.target.value })}
          placeholder="https://maps.google.com/..."
        />
      </div>
    </div>
  )
}
