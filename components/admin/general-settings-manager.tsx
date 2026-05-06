"use client"

import * as React from "react"
import { Save, Instagram, Youtube, Mail, MapPin, Globe, Shield, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { type SiteSettings, updateSiteSettings } from "@/lib/actions/settings"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SEOPreview } from "@/components/admin/seo-preview"
import { SmartImageUpload } from "@/components/admin/smart-image-upload"

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
            <p className="text-xs text-foreground/40">Aparece nos resultados de busca do Google (120-160 caracteres).</p>
          </div>

          <div className="space-y-4">
            <Label htmlFor="og_image">Imagem de Compartilhamento (SEO)</Label>
            <SmartImageUpload 
              value={settings.og_image_url || ""}
              onChange={(url) => setSettings({ ...settings, og_image_url: url })}
            />
            <p className="text-xs text-foreground/40">Aparece no WhatsApp e Redes Sociais. Qualquer imagem enviada será automaticamente centralizada com fundo borrado no tamanho ideal (1200x630px).</p>
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

          {/* SEO Preview Section */}
          <div className="mt-8 pt-8 border-t border-border/50">
            <div className="mb-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground/70">Prévia da Identidade Digital</h4>
              <p className="text-xs text-foreground/40 mt-1">Veja como o Coletivo aparece no mundo digital.</p>
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

      <hr className="border-border" />

      {/* Conteúdo Editorial */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Conteúdo Editorial das Páginas Legais
          </h3>
          <p className="text-sm text-foreground/60 mt-1">
            Edite o texto completo que aparece nas páginas de conformidade.
          </p>
        </div>

        <Tabs defaultValue="access" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-xl">
            <TabsTrigger value="access" className="rounded-lg">Acessibilidade</TabsTrigger>
            <TabsTrigger value="privacy" className="rounded-lg">Privacidade</TabsTrigger>
            <TabsTrigger value="terms" className="rounded-lg">Termos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="access" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="access_seo">Meta Descrição (SEO)</Label>
                <Input
                  id="access_seo"
                  value={settings.accessibility_seo_description || ""}
                  onChange={(e) => setSettings({ ...settings, accessibility_seo_description: e.target.value })}
                  placeholder="Descrição que aparece no Google para esta página..."
                />
              </div>
              <div className="space-y-2">
                <Label>Conteúdo de Acessibilidade</Label>
                <RichTextEditor 
                  content={settings.accessibility_content || ""} 
                  onChange={(content) => setSettings({ ...settings, accessibility_content: content })}
                  placeholder="Descreva o compromisso do coletivo com a acessibilidade..."
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
                  placeholder="Descreva como os dados são tratados..."
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
                  placeholder="Descreva as regras de convivência e uso do site..."
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
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
