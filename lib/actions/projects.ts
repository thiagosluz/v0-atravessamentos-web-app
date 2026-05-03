"use server"

import { createClient } from "@/lib/supabase/server"
import { type Project } from "@/lib/mock-data"

export async function getProjects() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar projetos:", error)
    return []
  }

  // Mapear campos do banco (snake_case) para o frontend (camelCase) se necessário
  return data.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    description: p.description,
    coverImage: p.cover_image,
    year: p.year,
    status: p.status,
    updatedAt: p.updated_at,
  })) as Project[]
}
