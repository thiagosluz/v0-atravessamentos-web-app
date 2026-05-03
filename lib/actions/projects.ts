"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { type Project } from "@/lib/mock-data"

function mapProject(p: any): Project {
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    description: p.description,
    coverImage: p.cover_image,
    year: p.year,
    status: p.status,
    updatedAt: p.updated_at,
  }
}

export async function getProjects() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar projetos:", error)
    return []
  }

  return data.map(mapProject) as Project[]
}

export async function getProjectById(id: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) return null

  return mapProject(data) as Project
}

export async function getProjectIds() {
  const supabase = createAdminClient()

  const { data } = await supabase.from("projects").select("id")

  return (data ?? []).map((p) => p.id) as string[]
}
