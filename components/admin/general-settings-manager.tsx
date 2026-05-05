"use client"

import * as React from "react"
import { Save, Instagram, Youtube, Mail, MapPin, Globe, Shield, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { type SiteSettings, updateSiteSettings } from "@/lib/actions/settings"

interface GeneralSettingsManagerProps {
  initialSettings: SiteSettings
}

export function GeneralSettingsManager({ initialSettings }: GeneralSettingsManagerProps) {
  const [settings, setSettings] = React.useState<SiteSettings>(initialSettings)
  const [isSaving, setIsSaving] = React.useState(false)
  const { toast } = useToast()

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    const result = await updateSiteSettings(settings)

    if (result.error) {
      toast({
        title: "Erro ao salvar",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Configurações salvas",
        description: "As alterações já estão refletidas no site público.",
      })
    }
    setIsSaving(false)
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 p-4 md:p-6">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Institucional */}
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
            <Label htmlFor="footer_description">Descrição do Rodapé</Label>
            <Textarea
              id="footer_description"
              value={settings.footer_description}
              onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
              placeholder="Ex: Coletivo de educação, arte e justiça social..."
              className="h-24 resize-none"
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

        {/* Redes Sociais e Contato */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Canais de Contato
            </h3>
            <p className="text-sm text-foreground/60 mt-1">
              Links das redes sociais e e-mail oficial.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact_email">E-mail Público</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                <Input
                  id="contact_email"
                  value={settings.contact_email}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp (Opcional)</Label>
              <Input
                id="whatsapp"
                value={settings.whatsapp_number || ""}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                placeholder="Ex: 5564999999999"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                <Input
                  id="instagram"
                  value={settings.instagram_url || ""}
                  onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube</Label>
              <div className="relative">
                <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                <Input
                  id="youtube"
                  value={settings.youtube_url || ""}
                  onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-border" />

      {/* Legal */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Links Legais
          </h3>
          <p className="text-sm text-foreground/60 mt-1">
            Páginas de conformidade e transparência.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="privacy">Política de Privacidade</Label>
            <Input
              id="privacy"
              value={settings.privacy_policy_url}
              onChange={(e) => setSettings({ ...settings, privacy_policy_url: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="terms">Termos de Uso</Label>
            <Input
              id="terms"
              value={settings.terms_url}
              onChange={(e) => setSettings({ ...settings, terms_url: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="access">Acessibilidade</Label>
            <Input
              id="access"
              value={settings.accessibility_url}
              onChange={(e) => setSettings({ ...settings, accessibility_url: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-border pt-6">
        <Button type="submit" disabled={isSaving} className="rounded-full px-8">
          {isSaving ? "Salvando..." : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
