"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export interface SiteSettings {
  footer_description: string
  location_text: string
  location_url: string
  instagram_url: string | null
  youtube_url: string | null
  contact_email: string
  whatsapp_number: string | null
  privacy_policy_url: string
  terms_url: string
  accessibility_url: string
  seo_title?: string
  seo_description?: string
  og_image_url?: string
  privacy_seo_description?: string
  terms_seo_description?: string
  accessibility_seo_description?: string
  privacy_policy_content?: string
  terms_of_use_content?: string
  accessibility_content?: string
  updated_at?: string
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .single()

  if (error || !data) {
    // Retorno padrão caso a tabela ainda não exista ou esteja vazia
    return {
      footer_description: "Coletivo de educação, arte e justiça social nascido em Jataí — Goiás.",
      location_text: "Jataí — GO, Brasil · Cerrado",
      location_url: "https://maps.google.com/?q=Jataí+GO",
      instagram_url: "#",
      youtube_url: "#",
      contact_email: "contato@atravessamentos.org",
      whatsapp_number: null,
      privacy_policy_url: "/privacidade",
      terms_url: "/termos",
      accessibility_url: "/acessibilidade",
      seo_title: "Atravessamentos",
      seo_description: "Coletivo de educação, arte e justiça social.",
      og_image_url: "",
      privacy_seo_description: "",
      terms_seo_description: "",
      accessibility_seo_description: "",
      privacy_policy_content: "",
      terms_of_use_content: "",
      accessibility_content: "",
      updated_at: new Date().toISOString(),
    }
  }

  return data as SiteSettings
}

export async function updateSiteSettings(settings: Partial<SiteSettings>) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("site_settings")
    .update({
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1)

  if (error) {
    console.error("Erro ao atualizar configurações:", error)
    return { error: "Não foi possível salvar as configurações." }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}

export async function uploadSiteImage(formData: FormData) {
  try {
    const supabase = createAdminClient()
    const file = formData.get("image") as File
    if (!file) return { error: "Nenhuma imagem fornecida" }

    const fileExt = file.name.split(".").pop()
    const fileName = `seo-${Date.now()}.${fileExt}`
    const filePath = `settings/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(filePath, file, {
        contentType: "image/jpeg",
        upsert: true
      })

    if (uploadError) {
      console.error("Erro no Storage:", uploadError)
      return { error: `Erro no upload: ${uploadError.message}` }
    }

    const { data: { publicUrl } } = supabase.storage
      .from("site-assets")
      .getPublicUrl(filePath)

    return { url: publicUrl }
  } catch (error) {
    console.error("Erro na ação de upload:", error)
    return { error: "Erro interno no servidor ao processar o upload." }
  }
}
