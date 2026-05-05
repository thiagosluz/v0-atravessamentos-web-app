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
