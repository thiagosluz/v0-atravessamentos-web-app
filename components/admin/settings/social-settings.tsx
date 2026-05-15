"use client"

import * as React from "react"
import { Instagram, Youtube, Mail } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { type SiteSettings } from "@/lib/actions/settings"

interface SocialSettingsProps {
  settings: SiteSettings
  setSettings: (settings: SiteSettings) => void
}

export function SocialSettings({ settings, setSettings }: SocialSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Canais de Contato
        </h3>
        <p className="text-sm text-foreground mt-1">Links das redes sociais e e-mail oficial.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact_email">E-mail Público</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
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
            <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
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
            <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
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
  )
}
