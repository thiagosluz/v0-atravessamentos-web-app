"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { type Member } from "@/lib/mock-data"

export async function getMembers(page: number = 1, limit: number = 10) {
  const supabase = createAdminClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from("members")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) {
    console.error("Erro ao buscar membros:", error)
    return { data: [], count: 0 }
  }

  return {
    data: data.map((m) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      tags: m.tags ?? [],
      avatar: m.avatar,
      bio: m.bio,
      instagram: m.instagram,
      linkedin: m.linkedin,
      lattes_url: m.lattes_url,
      email: m.email,
      phone: m.phone,
      createdAt: m.created_at,
    })) as Member[],
    count: count || 0
  }
}

export async function getMemberIds() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from("members").select("id")
  if (error) return []
  return data.map(m => m.id)
}

export async function getMemberById(id: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) return null

  // Busca os posts relacionados (onde o autor é o nome do membro)
  const { data: postsData } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("author", data.name)
    .order("date", { ascending: false })

  // Busca os projetos onde o membro participou (usando contains com array)
  const { data: projectsData } = await supabase
    .from("projects")
    .select("*")
    .contains("member_ids", [id])
    .order("year", { ascending: false })

  const member: Member = {
    id: data.id,
    name: data.name,
    role: data.role,
    tags: data.tags ?? [],
    avatar: data.avatar,
    bio: data.bio,
    instagram: data.instagram,
    linkedin: data.linkedin,
    lattes_url: data.lattes_url,
    email: data.email,
    phone: data.phone,
  }

  return { 
    member, 
    relatedPosts: postsData || [],
    relatedProjects: projectsData || []
  }
}
