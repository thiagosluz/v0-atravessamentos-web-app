"use server"

import { Resend } from "resend"
import { z } from "zod"
import { ratelimit } from "@/lib/redis"
import { headers } from "next/headers"
import { createAdminClient } from "@/lib/supabase/admin"
import { type ActionResponse, type NewsletterSubscriber, type NewsletterBroadcast } from "@/types/admin"

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder")
const audienceId = process.env.RESEND_AUDIENCE_ID

const newsletterSchema = z.object({
  email: z.string().email("E-mail inválido"),
})

export async function subscribeToNewsletter(formData: FormData): Promise<ActionResponse> {
  try {
    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1"
    const { success: limitSuccess } = await ratelimit.limit(`newsletter_${ip}`)

    if (!limitSuccess) {
      return { 
        success: false,
        error: "Muitas tentativas. Por favor, aguarde alguns instantes." 
      }
    }

    const honeypot = formData.get("website")
    if (honeypot) {
      return { success: true }
    }

    const email = formData.get("email") as string
    const validated = newsletterSchema.parse({ email })

    if (!audienceId) {
      console.error("RESEND_AUDIENCE_ID não configurado")
      return { success: false, error: "Configuração do servidor incompleta." }
    }

    const { error } = await resend.contacts.create({
      email: validated.email,
      audienceId: audienceId,
    })

    if (error) {
      const resendError = error as any
      if (resendError.name === "contact_already_exists" || resendError.error_code === "contact_already_exists") {
        return { success: true, alreadySubscribed: true }
      }
      return { success: false, error: resendError.message || "Não foi possível assinar no momento." }
    }

    return { success: true }
  } catch (err: any) {
    console.error("Erro fatal na Server Action de Newsletter:", err)
    return { success: false, error: err?.message || "Ocorreu um erro inesperado no servidor." }
  }
}

export async function unsubscribeFromNewsletter(email: string): Promise<ActionResponse> {
  if (!audienceId) {
    return { success: false, error: "Configuração de audiência ausente." }
  }

  try {
    if (!email || !email.includes("@")) {
      return { success: false, error: "E-mail inválido." }
    }

    const { error } = await resend.contacts.remove({
      email: email,
      audienceId: audienceId,
    })

    if (error) {
      console.error("Erro ao remover contato do Resend:", error)
      return { success: false, error: "Não foi possível processar o descadastramento." }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Erro fatal no unsubscribe:", error)
    return { success: false, error: "Ocorreu um erro inesperado." }
  }
}

export async function getNewsletterSubscribers(): Promise<ActionResponse<NewsletterSubscriber[]>> {
  if (!audienceId) {
    return { success: false, error: "Configuração de audiência ausente." }
  }

  try {
    const { data, error } = await resend.contacts.list({
      audienceId: audienceId,
    })

    if (error) {
      console.error("Erro ao buscar inscritos:", error)
      return { success: false, error: "Não foi possível carregar a lista de inscritos." }
    }

    return { success: true, data: data?.data || [] }
  } catch (error: any) {
    console.error("Erro fatal ao buscar inscritos:", error)
    return { success: false, error: "Ocorreu um erro inesperado." }
  }
}

export async function getBroadcastHistory(): Promise<ActionResponse<NewsletterBroadcast[]>> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("newsletter_broadcasts")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error: any) {
    console.error("Erro ao buscar histórico de broadcast:", error)
    return { success: false, error: error.message }
  }
}
