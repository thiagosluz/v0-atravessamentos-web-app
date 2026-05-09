"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { ensureAdmin } from "@/lib/utils/auth-guard"
import { galleryAssetSchema, galleryTagSchema } from "@/lib/validations"
import { z } from "zod"

// Helper para upload de imagem
async function uploadToGallery(supabase: any, file: File) {
  if (!file || file.size === 0) return null

  const fileExt = file.name.split('.').pop()
  const fileName = `gallery-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from("site-assets")
    .upload(`gallery/${fileName}`, file)

  if (error) {
    console.error("Erro no upload para galeria:", error)
    return null
  }

  const { data: { publicUrl } } = supabase.storage
    .from("site-assets")
    .getPublicUrl(data.path)

  return publicUrl
}

// Criar nova tag dinâmica
export async function createGalleryTag(data: { name: string, color?: string }) {
  try {
    await ensureAdmin()
    const validated = galleryTagSchema.parse(data)
    const supabase = createAdminClient()

    const slug = validated.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")

    const { error } = await supabase.from("categories").insert({
      name: validated.name,
      slug,
      type: "gallery_tag",
      color: validated.color || "primary"
    })

    if (error) throw error
    revalidatePath("/admin")
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Obter todas as tags de galeria
export async function getGalleryTags() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("type", "gallery_tag")
    .order("name")

  if (error) return []
  return data
}

// Upload em lote (Batch Upload)
export async function batchUploadGalleryImages(formData: FormData) {
  try {
    await ensureAdmin()
    const supabase = createAdminClient()
    const files = formData.getAll("images") as File[]
    const tags = formData.getAll("tags") as string[]
    
    if (!files || files.length === 0) return { error: "Nenhuma imagem enviada." }

    const results = []
    for (const file of files) {
      const url = await uploadToGallery(supabase, file)
      if (url) {
        const { data, error } = await supabase.from("gallery_assets").insert({
          image_url: url,
          tags: tags,
          title: file.name.split('.')[0] // Título inicial baseado no nome do arquivo
        }).select("id").single()
        
        if (!error) results.push(data.id)
      }
    }

    revalidatePath("/acervo")
    revalidatePath("/admin")
    return { success: true, count: results.length }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Atualizar ativo do acervo
export async function updateGalleryAsset(id: string, data: any) {
  try {
    await ensureAdmin()
    const validated = galleryAssetSchema.parse(data)
    const supabase = createAdminClient()

    const { error } = await supabase
      .from("gallery_assets")
      .update({
        title: validated.title,
        description: validated.description,
        location: validated.location,
        project_id: validated.project_id || null,
        tags: validated.tags,
      })
      .eq("id", id)

    if (error) throw error
    revalidatePath("/acervo")
    revalidatePath("/admin")
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Excluir ativo do acervo
export async function deleteGalleryAsset(id: string) {
  try {
    await ensureAdmin()
    const supabase = createAdminClient()
    
    // Primeiro pegamos a URL para deletar do storage depois
    const { data: asset } = await supabase.from("gallery_assets").select("image_url").eq("id", id).single()
    
    const { error } = await supabase.from("gallery_assets").delete().eq("id", id)
    if (error) throw error

    // Opcional: Deletar arquivo do storage se necessário
    
    revalidatePath("/acervo")
    revalidatePath("/admin")
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Obter ativos do acervo (com filtro opcional de tag)
export async function getGalleryAssets(tag?: string) {
  const supabase = createAdminClient()
  
  let query = supabase
    .from("gallery_assets")
    .select("*, project:projects(title)")
    .order("created_at", { ascending: false })

  if (tag) {
    query = query.contains("tags", [tag])
  }

  const { data, error } = await query

  if (error) {
    console.error("Erro ao buscar ativos:", error)
    return []
  }
  return data
}

// Obter lista simplificada de projetos para o select
export async function getProjectsForSelect() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("projects")
    .select("id, title")
    .order("title")

  if (error) {
    console.error("Erro ao buscar projetos:", error)
    return []
  }
  return data
}
