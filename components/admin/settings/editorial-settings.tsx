"use client"

import * as React from "react"
import { FileText } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from "../shared/rich-text-editor"
import { type SiteSettings } from "@/lib/actions/settings"

interface EditorialSettingsProps {
  settings: SiteSettings
  setSettings: (settings: SiteSettings) => void
}

export function EditorialSettings({ settings, setSettings }: EditorialSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Conteúdo Editorial das Páginas Legais
        </h3>
        <p className="text-sm text-foreground mt-1">
          Edite o texto completo que aparece nas páginas de conformidade.
        </p>
      </div>

      <Tabs defaultValue="access" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-xl">
          <TabsTrigger value="access" className="rounded-lg">
            Acessibilidade
          </TabsTrigger>
          <TabsTrigger value="privacy" className="rounded-lg">
            Privacidade
          </TabsTrigger>
          <TabsTrigger value="terms" className="rounded-lg">
            Termos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="access" className="mt-4 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="access_seo">Meta Descrição (SEO)</Label>
              <Input
                id="access_seo"
                value={settings.accessibility_seo_description || ""}
                onChange={(e) =>
                  setSettings({ ...settings, accessibility_seo_description: e.target.value })
                }
                placeholder="Descrição que aparece no Google para esta página..."
              />
            </div>
            <div className="space-y-2">
              <Label>Conteúdo de Acessibilidade</Label>
              <RichTextEditor
                content={settings.accessibility_content || ""}
                onChange={(content) =>
                  setSettings({ ...settings, accessibility_content: content })
                }
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="mt-4 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="privacy_seo">Meta Descrição (SEO)</Label>
              <Input
                id="privacy_seo"
                value={settings.privacy_seo_description || ""}
                onChange={(e) => setSettings({ ...settings, privacy_seo_description: e.target.value })}
                placeholder="Descrição que aparece no Google para esta página..."
              />
            </div>
            <div className="space-y-2">
              <Label>Conteúdo da Política de Privacidade</Label>
              <RichTextEditor
                content={settings.privacy_policy_content || ""}
                onChange={(content) => setSettings({ ...settings, privacy_policy_content: content })}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="terms" className="mt-4 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="terms_seo">Meta Descrição (SEO)</Label>
              <Input
                id="terms_seo"
                value={settings.terms_seo_description || ""}
                onChange={(e) => setSettings({ ...settings, terms_seo_description: e.target.value })}
                placeholder="Descrição que aparece no Google para esta página..."
              />
            </div>
            <div className="space-y-2">
              <Label>Conteúdo dos Termos de Uso</Label>
              <RichTextEditor
                content={settings.terms_of_use_content || ""}
                onChange={(content) => setSettings({ ...settings, terms_of_use_content: content })}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
