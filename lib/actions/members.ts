"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { type Member } from "@/lib/mock-data"

export async function getMembers() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Erro ao buscar membros:", error)
    return []
  }

  return data.map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    tags: m.tags ?? [],
    avatar: m.avatar,
    bio: m.bio,
    instagram: m.instagram,
    linkedin: m.linkedin,
    email: m.email,
    phone: m.phone,
  })) as Member[]
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

  const member: Member = {
    id: data.id,
    name: data.name,
    role: data.role,
    tags: data.tags ?? [],
    avatar: data.avatar,
    bio: data.bio,
    instagram: data.instagram,
    linkedin: data.linkedin,
    email: data.email,
    phone: data.phone,
  }

  return { member, relatedPosts: postsData || [] }
}
