"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { redis } from "@/lib/redis"
import { ensureAdmin } from "@/lib/utils/auth-guard"
import { galleryAssetSchema, galleryTagSchema } from "@/lib/validations"
import { type ActionResponse, type GalleryAssetUpdateData } from "@/types/admin"
import { headers } from "next/headers"
import crypto from "crypto"

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
export async function createGalleryTag(data: { name: string, color?: string }): Promise<ActionResponse> {
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
    return { success: false, error: error.message }
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

// Contar quantos assets usam uma tag específica
export async function countGalleryTagUsage(tagName: string): Promise<number> {
  const supabase = createAdminClient()
  const { count, error } = await supabase
    .from("gallery_assets")
    .select("id", { count: "exact", head: true })
    .contains("tags", [tagName])

  if (error) return 0
  return count ?? 0
}

// Excluir tag de galeria e remover referências dos assets
export async function deleteGalleryTag(tagId: string, tagName: string): Promise<ActionResponse> {
  try {
    await ensureAdmin()
    const supabase = createAdminClient()

    // Buscar todos os assets que usam esta tag
    const { data: affectedAssets } = await supabase
      .from("gallery_assets")
      .select("id, tags")
      .contains("tags", [tagName])

    // Remover a tag do array de cada asset afetado
    if (affectedAssets?.length) {
      for (const asset of affectedAssets) {
        const updatedTags = (asset.tags as string[]).filter(t => t !== tagName)
        await supabase
          .from("gallery_assets")
          .update({ tags: updatedTags })
          .eq("id", asset.id)
      }
    }

    // Excluir a tag da tabela categories
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", tagId)

    if (error) throw error

    revalidatePath("/acervo")
    revalidatePath("/admin")
    await redis.del("gallery_assets_all")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Upload em lote (Batch Upload)
export async function batchUploadGalleryImages(formData: FormData): Promise<ActionResponse> {
  try {
    await ensureAdmin()
    const supabase = createAdminClient()
    const files = formData.getAll("images") as File[]
    const tags = formData.getAll("tags") as string[]
    
    if (!files || files.length === 0) return { success: false, error: "Nenhuma imagem enviada." }

    const results = []
    for (const file of files) {
      const url = await uploadToGallery(supabase, file)
      if (url) {
        const { data, error } = await supabase.from("gallery_assets").insert({
          image_url: url,
          tags: tags,
          title: file.name.split('.')[0]
        }).select("id").single()
        
        if (!error) results.push(data.id)
      }
    }

    revalidatePath("/acervo")
    revalidatePath("/admin")
    await redis.del("gallery_assets_all")
    return { success: true, count: results.length }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Atualizar ativo do acervo
export async function updateGalleryAsset(id: string, data: GalleryAssetUpdateData): Promise<ActionResponse> {
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
    await redis.del("gallery_assets_all")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Excluir ativo do acervo
export async function deleteGalleryAsset(id: string): Promise<ActionResponse> {
  try {
    await ensureAdmin()
    const supabase = createAdminClient()
    
    const { error } = await supabase.from("gallery_assets").delete().eq("id", id)
    if (error) throw error
    
    revalidatePath("/acervo")
    revalidatePath("/admin")
    await redis.del("gallery_assets_all")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Favoritar ativo (público - protegido contra spam por IP)
export async function likeGalleryAsset(id: string): Promise<ActionResponse & { undoToken?: string }> {
  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"

    // Rate Limiting (máximo 20 curtidas por minuto por IP)
    const rateLimitKey = `rate_limit:like:${ip}`
    const currentRequests = await redis.incr(rateLimitKey)
    if (currentRequests === 1) {
      await redis.expire(rateLimitKey, 60)
    }
    if (currentRequests > 20) {
      throw new Error("Muitas requisições. Tente novamente mais tarde.")
    }

    const supabase = createAdminClient() // Bypassa RLS
    
    // Ler o valor atual
    const { data: asset, error: fetchError } = await supabase
      .from("gallery_assets")
      .select("likes")
      .eq("id", id)
      .single()
      
    if (fetchError || !asset) throw new Error("Ativo não encontrado")
    
    const newLikes = (asset.likes || 0) + 1

    const { error: updateError } = await supabase
      .from("gallery_assets")
      .update({ likes: newLikes })
      .eq("id", id)

    if (updateError) throw updateError
    
    revalidatePath("/acervo")
    await redis.del("gallery_assets_all")
    
    // Gerar token de segurança (HMAC) para permitir descurtir
    const timestamp = Date.now()
    const secret = process.env.SUPABASE_JWT_SECRET || process.env.NEXTAUTH_SECRET || "atravessamentos-secret"
    const dataToSign = `${id}:${timestamp}:${ip}`
    const hmac = crypto.createHmac("sha256", secret).update(dataToSign).digest("hex")
    const undoToken = `${timestamp}.${hmac}`
    
    return { success: true, count: newLikes, undoToken }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Desfazer favorito (público - bloqueado com assinatura de segurança)
export async function unlikeGalleryAsset(id: string, undoToken: string): Promise<ActionResponse> {
  try {
    if (!undoToken) throw new Error("Token de segurança ausente")

    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"

    // Validar assinatura criptográfica
    const [timestampStr, hmac] = undoToken.split(".")
    if (!timestampStr || !hmac) throw new Error("Token inválido")

    const timestamp = parseInt(timestampStr, 10)
    const secret = process.env.SUPABASE_JWT_SECRET || process.env.NEXTAUTH_SECRET || "atravessamentos-secret"
    const dataToSign = `${id}:${timestamp}:${ip}`
    const expectedHmac = crypto.createHmac("sha256", secret).update(dataToSign).digest("hex")

    if (hmac !== expectedHmac) {
      throw new Error("Tentativa de fraude detectada: Assinatura inválida")
    }

    // Validação de tempo NO SERVIDOR (Hard Limit de 15 segundos + 2s de tolerância de rede)
    if (Date.now() - timestamp > 17000) {
      throw new Error("A janela de tempo para desfazer a curtida expirou")
    }

    // Executar ação no banco
    const supabase = createAdminClient()
    const { data: asset, error: fetchError } = await supabase
      .from("gallery_assets")
      .select("likes")
      .eq("id", id)
      .single()
      
    if (fetchError || !asset) throw new Error("Ativo não encontrado")
    
    // Não pode ficar negativo
    const newLikes = Math.max(0, (asset.likes || 0) - 1)

    const { error: updateError } = await supabase
      .from("gallery_assets")
      .update({ likes: newLikes })
      .eq("id", id)

    if (updateError) throw updateError
    
    revalidatePath("/acervo")
    await redis.del("gallery_assets_all")
    
    return { success: true, count: newLikes }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Obter ativos do acervo (com filtro opcional de tag)
export async function getGalleryAssets(tag?: string) {
  const cacheKey = `gallery_assets_${tag || "all"}`
  try {
    const cached = await redis.get(cacheKey)
    if (cached) {
      return cached as any[]
    }
  } catch (err) {
    console.warn("Redis cache error:", err)
  }

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

  if (data) {
    try {
      await redis.set(cacheKey, data, { ex: 3600 })
    } catch (err) {
      console.warn("Redis set error:", err)
    }
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
