"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function createMember(formData: FormData) {
  const supabase = createAdminClient()

  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const bio = formData.get("bio") as string
  const tagsStr = formData.get("tags") as string
  const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) : []

  if (!name || !role) {
    return { error: "Nome e papel são obrigatórios." }
  }

  const { error } = await supabase.from("members").insert({
    name,
    role,
    bio,
    tags,
    avatar: null,
  })

  if (error) {
    console.error("Erro ao criar membro:", error)
    return { error: "Não foi possível adicionar o membro." }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}

export async function deleteMember(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("members").delete().eq("id", id)

  if (error) {
    return { error: "Não foi possível excluir o membro." }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}
