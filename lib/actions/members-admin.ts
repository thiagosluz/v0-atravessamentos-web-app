"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"
import { ensureAdmin } from "@/lib/utils/auth-guard"

// Helper para fazer upload da imagem
async function uploadAvatar(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null

  const supabase = createAdminClient()
  const fileExt = file.name.split(".").pop()
  const fileName = `${uuidv4()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, { upsert: true })

  if (error) {
    console.error("Erro no upload do avatar:", error)
    return null
  }

  // Gera a URL pública
  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName)

  return publicUrlData.publicUrl
}

function parseMemberData(formData: FormData) {
  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const bio = formData.get("bio") as string
  const tagsStr = formData.get("tags") as string
  const tags = tagsStr ? tagsStr.split(",").map(t => t.trim()).filter(Boolean) : []
  
  const instagram = formData.get("instagram") as string || null
  const linkedin = formData.get("linkedin") as string || null
  const lattes_url = formData.get("lattes_url") as string || null
  const email = formData.get("email") as string || null
  const phone = formData.get("phone") as string || null

  return { name, role, bio, tags, instagram, linkedin, lattes_url, email, phone }
}

export async function createMember(formData: FormData) {
  await ensureAdmin()
  const supabase = createAdminClient()

  const data = parseMemberData(formData)
  if (!data.name || !data.role) {
    return { error: "Nome e papel são obrigatórios." }
  }

  const avatarFile = formData.get("avatar") as File | null
  const avatarUrl = await uploadAvatar(avatarFile)

  const { error } = await supabase.from("members").insert({
    ...data,
    avatar: avatarUrl,
  })

  if (error) {
    console.error("Erro ao criar membro:", error)
    return { error: "Não foi possível adicionar o membro." }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}

export async function updateMember(id: string, formData: FormData) {
  await ensureAdmin()
  const supabase = createAdminClient()

  const data = parseMemberData(formData)
  if (!data.name || !data.role) {
    return { error: "Nome e papel são obrigatórios." }
  }

  const updates: any = { ...data }

  const avatarFile = formData.get("avatar") as File | null
  if (avatarFile && avatarFile.size > 0) {
    const avatarUrl = await uploadAvatar(avatarFile)
    if (avatarUrl) updates.avatar = avatarUrl
  }

  const { error } = await supabase.from("members").update(updates).eq("id", id)

  if (error) {
    console.error("Erro ao atualizar membro:", error)
    return { error: "Não foi possível atualizar o membro." }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath(`/membros/${id}`)
  return { success: true }
}

export async function deleteMember(id: string) {
  await ensureAdmin()
  const supabase = createAdminClient()

  // Buscar o membro para obter a URL do avatar
  const { data: member } = await supabase.from("members").select("avatar").eq("id", id).single()

  // Se o membro tiver um avatar que vem do nosso storage, precisamos excluí-lo
  if (member?.avatar && member.avatar.includes("supabase.co") && member.avatar.includes("/avatars/")) {
    const avatarUrl = member.avatar
    const fileName = avatarUrl.split("/").pop()
    if (fileName) {
      await supabase.storage.from("avatars").remove([fileName])
    }
  }

  const { error } = await supabase.from("members").delete().eq("id", id)

  if (error) {
    return { error: "Não foi possível excluir o membro." }
  }

  revalidatePath("/")
  revalidatePath("/admin")
  return { success: true }
}
