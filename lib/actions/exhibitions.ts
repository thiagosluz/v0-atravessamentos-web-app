"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { ensureAdmin } from "@/lib/utils/auth-guard"

import { type ExhibitionFormData, type ActionResponse, type Exhibition } from "@/types/admin"

export async function createExhibition(payload: ExhibitionFormData): Promise<ActionResponse<Exhibition>> {
  try {
    await ensureAdmin()
    const supabase = createAdminClient()
    
    const { data, error } = await supabase
      .from("exhibitions")
      .insert([payload])
      .select()
      .single()

    if (error) throw error
    revalidatePath("/admin")
    revalidatePath("/exposicoes")
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateExhibition(id: string, payload: ExhibitionFormData): Promise<ActionResponse> {
  try {
    await ensureAdmin()
    const supabase = createAdminClient()
    
    const { error } = await supabase
      .from("exhibitions")
      .update(payload)
      .eq("id", id)

    if (error) throw error
    revalidatePath("/admin")
    revalidatePath("/exposicoes")
    if (payload.slug) revalidatePath(`/exposicoes/${payload.slug}`)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteExhibition(id: string): Promise<ActionResponse> {
  try {
    await ensureAdmin()
    const supabase = createAdminClient()
    const { error } = await supabase.from("exhibitions").delete().eq("id", id)
    if (error) throw error
    revalidatePath("/admin")
    revalidatePath("/exposicoes")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getExhibitions() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("exhibitions")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar exposições:", error)
    return []
  }
  return data
}

export async function getExhibitionBySlug(slug: string) {
  const supabase = createAdminClient()
  const { data: exhibition, error } = await supabase
    .from("exhibitions")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error || !exhibition) return null

  // Buscar os ativos reais baseados no array de IDs
  if (exhibition.asset_ids && exhibition.asset_ids.length > 0) {
    const { data: assets, error: assetError } = await supabase
      .from("gallery_assets")
      .select("*, project:projects(title)")
      .in("id", exhibition.asset_ids)

    if (!assetError) {
      // Manter a ordem definida no array asset_ids
      const orderedAssets = exhibition.asset_ids
        .map((id: string) => assets.find(a => a.id === id))
        .filter(Boolean)
      
      exhibition.assets = orderedAssets
    }
  } else {
    exhibition.assets = []
  }

  return exhibition
}
