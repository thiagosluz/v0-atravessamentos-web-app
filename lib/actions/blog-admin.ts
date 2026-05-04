"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { type BlogPost } from "@/lib/mock-data"

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
  const supabase = createAdminClient()
  const file = formData.get("image") as File
  
  if (!file) return { error: "Nenhuma imagem enviada." }
  
  const url = await uploadImage(supabase, file, "blog-media")
  
  if (!url) return { error: "Erro ao fazer upload da imagem." }
  
  return { url }
}

export async function createBlogPost(formData: FormData) {
  const supabase = createAdminClient()

  const title = formData.get("title") as string
  const category = formData.get("category") as BlogPost["category"]
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const author = formData.get("author") as string
  const readTime = formData.get("readTime") as string
  const status = formData.get("status") as "Publicado" | "Rascunho"
  const coverFile = formData.get("coverImage") as File | null
  
  let coverImageUrl = null

  if (coverFile && coverFile.size > 0) {
    coverImageUrl = await uploadImage(supabase, coverFile, "blog-media")
  }

  if (!title || !category || !author || !status) {
    return { error: "Preencha todos os campos obrigatórios." }
  }

  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  const { error } = await supabase.from("blog_posts").insert({
    title,
    category,
    excerpt,
    content,
    author,
    read_time: readTime,
    slug,
    status,
    cover_image: coverImageUrl,
  })

  if (error) {
    console.error("Erro ao criar post:", error)
    if (error.code === "23505") {
      return { error: "Já existe um post com este título/slug." }
    }
    return { error: "Não foi possível criar o post." }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}

export async function updateBlogPost(id: string, formData: FormData) {
  if (id.startsWith("temp-")) {
    return { error: "Aguarde o post ser salvo antes de editá-lo." }
  }
  const supabase = createAdminClient()

  const title = formData.get("title") as string
  const category = formData.get("category") as BlogPost["category"]
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const author = formData.get("author") as string
  const readTime = formData.get("readTime") as string
  const status = formData.get("status") as "Publicado" | "Rascunho"
  const coverFile = formData.get("coverImage") as File | null

  let coverImageUrl = null

  if (coverFile && coverFile.size > 0) {
    coverImageUrl = await uploadImage(supabase, coverFile, "blog-media")
  }

  if (!title || !category || !author || !status) {
    return { error: "Preencha todos os campos obrigatórios." }
  }

  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  const { error } = await supabase
    .from("blog_posts")
    .update({
      title,
      category,
      excerpt,
      content,
      author,
      read_time: readTime,
      slug,
      status,
      ...(coverImageUrl ? { cover_image: coverImageUrl } : {}),
    })
    .eq("id", id)

  if (error) {
    console.error("Erro ao atualizar post:", error)
    return { error: "Não foi possível atualizar o post." }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}

export async function deleteBlogPost(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("blog_posts").delete().eq("id", id)

  if (error) {
    return { error: "Não foi possível excluir o post." }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}

export async function updateBlogPostStatus(id: string, status: "Publicado" | "Rascunho") {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("blog_posts")
    .update({ status, published_at: status === "Publicado" ? new Date().toISOString() : null })
    .eq("id", id)

  if (error) {
    return { error: "Não foi possível atualizar o status." }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}
