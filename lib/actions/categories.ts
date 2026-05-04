"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export type CategoryType = "post" | "project" | "member"

export interface Category {
  id: string
  name: string
  slug: string
  type: CategoryType
  color: string | null
  sort_order: number
  created_at: string
}

export async function getCategories(type?: CategoryType) {
  const supabase = createAdminClient()
  
  let query = supabase.from("categories").select("*").order("sort_order", { ascending: true })
  
  if (type) {
    query = query.eq("type", type)
  }

  const { data, error } = await query

  if (error) {
    console.error("Erro ao buscar categorias:", error)
    return []
  }

  return data as Category[]
}

export async function upsertCategory(category: Partial<Category>) {
  const supabase = createAdminClient()

  if (!category.slug && category.name) {
    // Generate slug if not provided
    category.slug = category.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const { data, error } = await supabase
    .from("categories")
    .upsert({
      id: category.id,
      name: category.name,
      slug: category.slug,
      type: category.type,
      color: category.color,
      sort_order: category.sort_order || 0,
    })
    .select()
    .single()

  if (error) {
    console.error("Erro ao salvar categoria:", error)
    return { error: error.message }
  }

  revalidatePath("/admin")
  if (category.type === "post") revalidatePath("/diario")
  if (category.type === "project") revalidatePath("/projetos")

  return { data: data as Category }
}

export async function deleteCategory(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    console.error("Erro ao excluir categoria:", error)
    return { error: error.message }
  }

  revalidatePath("/admin")
  return { success: true }
}
