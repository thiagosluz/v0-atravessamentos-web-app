"use server"

import { z } from "zod"
import { Resend } from "resend"
import { contactSchema } from "@/lib/validations"
import { getSiteSettings } from "./settings"
import { createAdminClient } from "@/lib/supabase/admin"
import { ratelimit } from "@/lib/redis"
import { headers } from "next/headers"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactMessage(formData: FormData) {
  try {
    // 0. Rate limiting check
    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1"
    const { success: limitSuccess } = await ratelimit.limit(
      `contact_${ip}`
    )

    if (!limitSuccess) {
      return { 
        error: "Muitas tentativas. Por favor, aguarde alguns instantes antes de enviar uma nova mensagem." 
      }
    }

    // 1. Honeypot check
    const honeypot = formData.get("website")
    
    if (honeypot) {
      return { success: true }
    }

    // 2. Validate data
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      category: formData.get("category"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    }

    const validated = contactSchema.parse(rawData)

    // 3. Persist in Supabase
    const supabase = createAdminClient()
    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert([validated])

    if (dbError) {
      console.error("Erro ao salvar mensagem no banco:", dbError)
      // Continuamos para tentar enviar o e-mail mesmo se o banco falhar
    }

    // 4. Get destination email from settings
    const settings = await getSiteSettings()
    const destination = settings.contact_email || "contato@atravessamentos.com.br"

    // 4. Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "Atravessamentos <onboarding@resend.dev>", // Usar onboarding no início ou domínio verificado
      to: [destination],
      subject: `[${validated.category}] ${validated.subject}`,
      replyTo: validated.email,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
          <h2 style="color: #588157;">Novo contato via site</h2>
          <p><strong>Nome:</strong> ${validated.name}</p>
          <p><strong>E-mail:</strong> ${validated.email}</p>
          <p><strong>Categoria:</strong> ${validated.category}</p>
          <p><strong>Assunto:</strong> ${validated.subject}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="white-space: pre-wrap;">${validated.message}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <footer style="font-size: 12px; color: #999;">
            Enviado via formulário de contato Atravessamentos em ${new Date().toLocaleString('pt-BR')}
          </footer>
        </div>
      `,
    })

    if (error) {
      console.error("Erro no Resend:", error)
      return { error: "Não foi possível enviar sua mensagem no momento. Tente novamente mais tarde." }
    }

    return { success: true }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // Retorna a mensagem de erro específica do esquema (ex: "A mensagem deve ter pelo menos 10 caracteres")
      return { error: error.errors[0].message }
    }
    console.error("Erro na Server Action de Contato:", error)
    return { error: "Ocorreu um erro inesperado." }
  }
}
