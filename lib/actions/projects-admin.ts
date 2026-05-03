"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { type ProjectCategory, type ProjectStatus } from "@/lib/mock-data"

export async function createProject(formData: FormData) {
  const supabase = createAdminClient()

  const title = formData.get("title") as string
  const category = formData.get("category") as ProjectCategory
  const description = formData.get("description") as string
  const year = parseInt(formData.get("year") as string)
  const status = formData.get("status") as ProjectStatus

  if (!title || !category || !year || !status) {
    return { error: "Preencha todos os campos obrigatórios." }
  }

  const { error } = await supabase.from("projects").insert({
    title,
    category,
    description,
    year,
    status,
    cover_image: null,
  })

  if (error) {
    console.error("Erro ao criar projeto:", error)
    return { error: "Não foi possível criar o projeto. Tente novamente." }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}

export async function deleteProject(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) {
    return { error: "Não foi possível excluir o projeto." }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}

export async function updateProjectStatus(id: string, status: ProjectStatus) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("projects")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    return { error: "Não foi possível atualizar o status." }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}
