"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { type Project } from "@/lib/mock-data"

function mapProject(p: any): Project {
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    excerpt: p.excerpt,
    description: p.description,
    coverImage: p.cover_image,
    year: p.year,
    start_date: p.start_date,
    end_date: p.end_date,
    status: p.status,
    memberIds: p.member_ids,
    updatedAt: p.updated_at,
  }
}

export async function getProjects(page: number = 1, limit: number = 10) {
  const supabase = createAdminClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from("projects")
    .select("*", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(from, to)

  if (error) {
    console.error("Erro ao buscar projetos:", error)
    return { data: [], count: 0 }
  }

  return {
    data: data.map(mapProject) as Project[],
    count: count || 0
  }
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

export async function getFilteredProjects(opts: {
  category?: string
  q?: string
} = {}) {
  const supabase = createAdminClient()

  let query = supabase
    .from("projects")
    .select("*")
    .eq("status", "Publicado")
    .order("year", { ascending: false })

  if (opts.category) {
    query = query.eq("category", opts.category)
  }

  if (opts.q) {
    query = query.or(`title.ilike.%${opts.q}%,description.ilike.%${opts.q}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Erro ao filtrar projetos:", error)
    return []
  }

  return data.map(mapProject) as Project[]
}
