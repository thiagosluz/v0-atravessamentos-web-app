"use server"

import { Resend } from "resend"
import { NewsEmail } from "@/components/emails/news-template"
import { render } from "@react-email/components"

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder")
const audienceId = process.env.RESEND_AUDIENCE_ID

interface BroadcastNewsProps {
  title: string
  excerpt: string
  category: string
  slug: string
  imageUrl?: string
}

export async function broadcastNews(props: BroadcastNewsProps) {
  if (!audienceId) {
    console.error("RESEND_AUDIENCE_ID não configurado para broadcast")
    return { error: "Configuração de audiência ausente." }
  }

  try {
    // 1. Buscar todos os contatos da Audience
    const { data: contactsData, error: contactsError } = await resend.contacts.list({
      audienceId: audienceId,
    })

    if (contactsError || !contactsData) {
      console.error("Erro ao buscar contatos para broadcast:", contactsError)
      return { error: "Falha ao recuperar lista de assinantes." }
    }

    const subscribers = contactsData.data
    if (subscribers.length === 0) {
      return { success: true, message: "Nenhum assinante para enviar." }
    }

    // 2. Preparar o e-mail (React Email para HTML)
    // Nota: O render é assíncrono no @react-email/components v3+
    const FROM_EMAIL = "Coletivo Atravessamentos <onboarding@resend.dev>"
    
    // Gerar e-mails personalizados para cada destinatário (para ter o link de unsubscribe correto)
    const emails = await Promise.all(subscribers
      .filter(contact => {
        // Filtro de segurança para o modo onboarding
        if (FROM_EMAIL.includes("onboarding@resend.dev")) {
          return contact.email === "coletivoatravessamentosapp@gmail.com"
        }
        return true
      })
      .map(async (contact) => {
        const html = await render(NewsEmail({ 
          ...props, 
          recipientEmail: contact.email 
        }))
        
        return {
          from: FROM_EMAIL,
          to: contact.email,
          subject: `✨ Nova publicação: ${props.title}`,
          html: html,
        }
      }))

    if (emails.length === 0) {
      return { success: true, message: "Nenhum destinatário autorizado para o domínio de teste." }
    }

    // Resend batch send
    const { data: batchData, error: batchError } = await resend.batch.send(emails)

    if (batchError) {
      console.error("Erro no disparo em lote:", batchError)
      return { error: "Erro ao disparar e-mails em massa." }
    }

    return { 
      success: true, 
      count: subscribers.length,
      batchId: (batchData as any)?.id 
    }
  } catch (error) {
    console.error("Erro fatal no broadcast:", error)
    return { error: "Ocorreu um erro inesperado no disparo." }
  }
}
