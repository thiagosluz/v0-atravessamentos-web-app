"use client"

import * as React from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { type SiteSettings, updateSiteSettings } from "@/lib/actions/settings"
import { InstitutionalSettings } from "./settings/institutional-settings"
import { SocialSettings } from "./settings/social-settings"
import { LegalSettings } from "./settings/legal-settings"
import { EditorialSettings } from "./settings/editorial-settings"

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
        <InstitutionalSettings settings={settings} setSettings={setSettings} />
        <SocialSettings settings={settings} setSettings={setSettings} />
      </div>

      <hr className="border-border" />

      <LegalSettings settings={settings} setSettings={setSettings} />

      <hr className="border-border" />

      <EditorialSettings settings={settings} setSettings={setSettings} />

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
