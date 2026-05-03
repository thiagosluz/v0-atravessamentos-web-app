"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { projects } from "@/lib/mock-data"

export async function seedProjects() {
  const supabase = createAdminClient()

  // Limpa a tabela antes de popular (opcional)
  // await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const formattedProjects = projects.map((p) => ({
    title: p.title,
    category: p.category,
    description: p.description,
    cover_image: p.coverImage,
    year: p.year,
    status: p.status,
  }))

  const { data, error } = await supabase.from("projects").insert(formattedProjects).select()

  if (error) {
    console.error("Erro ao popular banco:", error)
    return { success: false, error }
  }

  return { success: true, count: data.length }
}
