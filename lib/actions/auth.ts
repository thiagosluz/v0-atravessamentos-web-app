"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signIn(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return { error: "E-mail ou senha inválidos. Tente novamente." }
    }
  } catch (err) {
    console.error("Auth error:", err)
    return { error: "Ocorreu um erro ao tentar entrar. Verifique sua conexão." }
  }

  redirect("/admin")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function getSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get("name") as string | null
  const email = formData.get("email") as string | null
  const password = formData.get("password") as string | null
  
  const updates: any = {}
  
  if (name) updates.data = { full_name: name }
  if (email) updates.email = email
  if (password) updates.password = password
  
  const { error } = await supabase.auth.updateUser(updates)
  
  if (error) {
    return { error: error.message }
  }
  
  return { success: true }
}
