"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { ensureAdmin } from "@/lib/utils/auth-guard"
import { projectSchema } from "@/lib/validations"
import { safeAction } from "@/lib/utils/safe-action"

export async function createProject(formData: FormData) {
  return safeAction({
    action: async () => {
      await ensureAdmin()

      const rawData = {
        title: formData.get("title") as string,
        category: formData.get("category") as string,
        excerpt: formData.get("excerpt") as string,
        description: formData.get("description") as string,
        year: formData.get("year") as string,
        status: formData.get("status") as any,
      }

      const validated = projectSchema.parse(rawData)
      const supabase = createAdminClient()

      const { data, error } = await supabase.from("projects").insert({
        ...validated,
        year: parseInt(validated.year),
        cover_image: null,
      }).select("id").single()

      if (error) {
        console.error("Erro ao criar projeto:", error)
        throw error
      }

      revalidatePath("/")
      revalidatePath("/projetos")
      revalidatePath("/admin")
      return { id: data.id }
    },
    errorMap: { "23505": "Já existe um projeto com este título." },
  })
}

export async function updateProject(id: string, formData: FormData) {
  return safeAction({
    action: async () => {
      await ensureAdmin()

      const rawData = {
        title: formData.get("title") as string,
        category: formData.get("category") as string,
        excerpt: formData.get("excerpt") as string,
        description: formData.get("description") as string,
        year: formData.get("year") as string,
        status: formData.get("status") as any,
      }

      const validated = projectSchema.parse(rawData)
      const supabase = createAdminClient()

      const { error } = await supabase
        .from("projects")
        .update({
          ...validated,
          year: parseInt(validated.year),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) {
        console.error("Erro ao atualizar projeto:", error)
        throw error
      }

      revalidatePath("/")
      revalidatePath("/projetos")
      revalidatePath("/admin")
      return {}
    },
    errorMap: { "23505": "Já existe um projeto com este título." },
  })
}

export async function deleteProject(id: string) {
  return safeAction({
    action: async () => {
      await ensureAdmin()
      const supabase = createAdminClient()
      const { error } = await supabase.from("projects").delete().eq("id", id)

      if (error) throw error

      revalidatePath("/")
      revalidatePath("/projetos")
      revalidatePath("/admin")
      return {}
    },
  })
}

export async function deleteProjectsBulk(ids: string[]) {
  return safeAction({
    action: async () => {
      await ensureAdmin()
      if (!ids.length) throw new Error("Nenhum ID informado para exclusão.")

      const supabase = createAdminClient()
      const { error } = await supabase.from("projects").delete().in("id", ids)

      if (error) throw error

      revalidatePath("/")
      revalidatePath("/projetos")
      revalidatePath("/admin")
      return { deletedCount: ids.length }
    },
  })
}
