"use server"

import { Resend } from "resend"
import { z } from "zod"
import { ratelimit } from "@/lib/redis"
import { headers } from "next/headers"

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder")
const audienceId = process.env.RESEND_AUDIENCE_ID

const newsletterSchema = z.object({
  email: z.string().email("E-mail inválido"),
})

export async function subscribeToNewsletter(formData: FormData) {
  try {
    // 0. Rate limiting check
    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1"
    const { success: limitSuccess } = await ratelimit.limit(
      `newsletter_${ip}`
    )

    if (!limitSuccess) {
      return { 
        error: "Muitas tentativas. Por favor, aguarde alguns instantes." 
      }
    }

    // 1. Honeypot check
    const honeypot = formData.get("website")
    if (honeypot) {
      return { success: true }
    }

    // 2. Validate data
    const email = formData.get("email") as string
    const validated = newsletterSchema.parse({ email })

    if (!audienceId) {
      console.error("RESEND_AUDIENCE_ID não configurado")
      return { error: "Configuração do servidor incompleta." }
    }

    // 3. Add contact to Resend Audience
    const { error } = await resend.contacts.create({
      email: validated.email,
      audienceId: audienceId,
    })

    if (error) {
      const resendError = error as any
      console.error("Erro no Resend Newsletter:", resendError)

      // Se o erro for que o contato já existe, tratamos como sucesso para o usuário
      if (resendError.name === "contact_already_exists" || resendError.error_code === "contact_already_exists") {
        return { success: true, alreadySubscribed: true }
      }
      
      // Mensagem amigável para erro de permissão
      if (resendError.name === "restricted_api_key" || resendError.message?.includes("restricted")) {
        return { error: "Erro de configuração: A chave da API do Resend precisa de permissão 'Full Access'." }
      }

      return { error: resendError.message || "Não foi possível assinar no momento." }
    }

    return { success: true }
  } catch (err: any) {
    console.error("Erro fatal na Server Action de Newsletter:", err)
    return { error: err?.message || "Ocorreu um erro inesperado no servidor." }
  }
}
export async function unsubscribeFromNewsletter(email: string) {
  if (!audienceId) {
    return { error: "Configuração de audiência ausente." }
  }

  try {
    // 1. Validar e-mail básico
    if (!email || !email.includes("@")) {
      return { error: "E-mail inválido." }
    }

    // 2. Remover contato do Resend Audience
    // Nota: O Resend usa o ID ou o e-mail para remoção
    const { error } = await resend.contacts.remove({
      email: email,
      audienceId: audienceId,
    })

    if (error) {
      console.error("Erro ao remover contato do Resend:", error)
      return { error: "Não foi possível processar o descadastramento." }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Erro fatal no unsubscribe:", error)
    return { error: "Ocorreu um erro inesperado." }
  }
}
