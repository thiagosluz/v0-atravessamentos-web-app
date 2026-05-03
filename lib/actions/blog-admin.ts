"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { type BlogPost } from "@/lib/mock-data"

export async function createBlogPost(formData: FormData) {
  const supabase = createAdminClient()

  const title = formData.get("title") as string
  const category = formData.get("category") as BlogPost["category"]
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const author = formData.get("author") as string
  const readTime = formData.get("readTime") as string
  const status = formData.get("status") as "Publicado" | "Rascunho"

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
    cover_image: null,
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
