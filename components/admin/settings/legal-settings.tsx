"use client"

import * as React from "react"
import { Shield } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { type SiteSettings } from "@/lib/actions/settings"

interface LegalSettingsProps {
  settings: SiteSettings
  setSettings: (settings: SiteSettings) => void
}

export function LegalSettings({ settings, setSettings }: LegalSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Links Legais
        </h3>
        <p className="text-sm text-foreground mt-1">Páginas de conformidade e transparência.</p>
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
  )
}
