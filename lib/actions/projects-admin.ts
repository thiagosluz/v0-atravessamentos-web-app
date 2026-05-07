"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { ensureAdmin } from "@/lib/utils/auth-guard"
import { projectSchema } from "@/lib/validations"
import { z } from "zod"

export async function createProject(formData: FormData) {
  try {
    await ensureAdmin()
    
    const rawData = {
      title: formData.get("title") as string,
      category: formData.get("category") as string,
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
      return { error: "Erro ao salvar no banco de dados." }
    }

    revalidatePath("/")
    revalidatePath("/projetos")
    revalidatePath("/admin")
    return { success: true, id: data.id }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: "Dados inválidos: " + error.errors.map(e => e.message).join(", ") }
    }
    return { error: error.message || "Erro inesperado." }
  }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    await ensureAdmin()
    
    const rawData = {
      title: formData.get("title") as string,
      category: formData.get("category") as string,
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
      return { error: "Não foi possível atualizar o projeto." }
    }

    revalidatePath("/")
    revalidatePath("/projetos")
    revalidatePath("/admin")
    return { success: true }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: "Dados inválidos: " + error.errors.map(e => e.message).join(", ") }
    }
    return { error: error.message || "Erro inesperado." }
  }
}

export async function deleteProject(id: string) {
  try {
    await ensureAdmin()
    const supabase = createAdminClient()
    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) return { error: "Não foi possível excluir o projeto." }

    revalidatePath("/")
    revalidatePath("/projetos")
    revalidatePath("/admin")
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function updateProjectStatus(id: string, status: any) {
  try {
    await ensureAdmin()
    const supabase = createAdminClient()

    const { error } = await supabase
      .from("projects")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) return { error: "Não foi possível atualizar o status." }

    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
