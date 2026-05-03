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
  })) as Member[]
}
