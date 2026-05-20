"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { type BlogPost } from "@/lib/mock-data"
import { ensureAdmin } from "@/lib/utils/auth-guard"
import { blogPostSchema } from "@/lib/validations"
import { safeAction } from "@/lib/utils/safe-action"
import { broadcastNews } from "./broadcast"

async function uploadImage(supabase: any, file: File, bucket: string) {
  if (!file || file.size === 0) return null

  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) {
    console.error(`Erro no upload (${bucket}):`, error)
    return null
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return publicUrl
}

export async function uploadBlogImage(formData: FormData) {
  return safeAction({
    action: async () => {
      await ensureAdmin()
      const supabase = createAdminClient()
      const file = formData.get("image") as File

      if (!file) throw new Error("Nenhuma imagem enviada.")

      const url = await uploadImage(supabase, file, "blog-media")

      if (!url) throw new Error("Erro ao fazer upload da imagem.")

      return { url }
    },
  })
}

export async function createBlogPost(formData: FormData) {
  return safeAction({
    action: async () => {
      await ensureAdmin()

      const rawData = {
        title: formData.get("title") as string,
        category: formData.get("category") as string,
        excerpt: formData.get("excerpt") as string,
        content: formData.get("content") as string,
        author: formData.get("author") as string,
        read_time: formData.get("readTime") as string,
        status: formData.get("status") as any,
        tags: formData.get("tags") ? (formData.get("tags") as string).split(",").map(t => t.trim()).filter(Boolean) : [],
      }

      const validated = blogPostSchema.parse(rawData)
      const supabase = createAdminClient()

      const coverFile = formData.get("coverImage") as File | null
      let coverImageUrl = null

      if (coverFile && coverFile.size > 0) {
        coverImageUrl = await uploadImage(supabase, coverFile, "blog-media")
      }

      const slug = validated.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      const { data, error } = await supabase.from("blog_posts").insert({
        ...validated,
        read_time: validated.read_time,
        slug,
        cover_image: coverImageUrl,
      }).select("id").single()

      if (error) {
        console.error("Erro ao criar post:", error)
        throw error
      }

      revalidatePath("/")
      revalidatePath("/diario")
      revalidatePath("/admin")

      // Disparar Newsletter se estiver publicado
      if (validated.status === "Publicado") {
        broadcastNews({
          title: validated.title,
          excerpt: validated.excerpt,
          category: validated.category,
          slug: slug,
          imageUrl: coverImageUrl || undefined,
        }).then(async (res) => {
          if (res.success) {
            await supabase
              .from("blog_posts")
              .update({ newsletter_sent_at: new Date().toISOString() })
              .eq("id", data.id)
          }
        }).catch(err => console.error("Falha silenciosa no broadcast:", err))
      }

      return { id: data.id }
    },
    errorMap: { "23505": "Já existe um post com este título. Por favor, use um título diferente." },
  })
}

export async function updateBlogPost(id: string, formData: FormData) {
  return safeAction({
    action: async () => {
      await ensureAdmin()
      if (id.startsWith("temp-")) throw new Error("ID inválido.")

      const rawData = {
        title: formData.get("title") as string,
        category: formData.get("category") as string,
        excerpt: formData.get("excerpt") as string,
        content: formData.get("content") as string,
        author: formData.get("author") as string,
        read_time: formData.get("readTime") as string,
        status: formData.get("status") as any,
        tags: formData.get("tags") ? (formData.get("tags") as string).split(",").map(t => t.trim()).filter(Boolean) : [],
      }

      const validated = blogPostSchema.parse(rawData)
      const supabase = createAdminClient()

      const coverFile = formData.get("coverImage") as File | null
      let coverImageUrl = null

      if (coverFile && coverFile.size > 0) {
        coverImageUrl = await uploadImage(supabase, coverFile, "blog-media")
      }

      const slug = validated.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      const { data: updatedPost, error } = await supabase
        .from("blog_posts")
        .update({
          ...validated,
          read_time: validated.read_time,
          slug,
          ...(validated.status === "Publicado" ? { published_at: new Date().toISOString() } : {}),
          ...(coverImageUrl ? { cover_image: coverImageUrl } : {}),
        })
        .eq("id", id)
        .select("*, newsletter_sent_at")
        .single()

      if (error) {
        console.error("Erro ao atualizar post:", error)
        throw error
      }

      // Disparar Newsletter se estiver publicado e nunca enviado
      if (validated.status === "Publicado" && !updatedPost.newsletter_sent_at) {
        broadcastNews({
          title: validated.title,
          excerpt: validated.excerpt,
          category: validated.category,
          slug: slug,
          imageUrl: updatedPost.cover_image || undefined,
        }).then(async (res) => {
          if (res.success) {
            await supabase
              .from("blog_posts")
              .update({ newsletter_sent_at: new Date().toISOString() })
              .eq("id", id)
          }
        }).catch(err => console.error("Falha no broadcast:", err))
      }

      revalidatePath("/")
      revalidatePath("/diario")
      revalidatePath("/admin")
      return {}
    },
    errorMap: { "23505": "Já existe um post com este título." },
  })
}

export async function deleteBlogPost(id: string) {
  return safeAction({
    action: async () => {
      await ensureAdmin()
      const supabase = createAdminClient()
      const { error } = await supabase.from("blog_posts").delete().eq("id", id)

      if (error) throw error

      revalidatePath("/")
      revalidatePath("/diario")
      revalidatePath("/admin")
      return {}
    },
  })
}

export async function deleteBlogPostsBulk(ids: string[]) {
  return safeAction({
    action: async () => {
      await ensureAdmin()
      if (!ids.length) throw new Error("Nenhum ID informado para exclusão.")

      const supabase = createAdminClient()
      const { error } = await supabase.from("blog_posts").delete().in("id", ids)

      if (error) throw error

      revalidatePath("/")
      revalidatePath("/diario")
      revalidatePath("/admin")
      return { deletedCount: ids.length }
    },
  })
}
