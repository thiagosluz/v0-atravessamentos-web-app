"use server"

import { Resend } from "resend"
import { NewsEmail } from "@/components/emails/news-template"
import { render } from "react-email"

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder")
const audienceId = process.env.RESEND_AUDIENCE_ID

interface BroadcastNewsProps {
  title: string
  excerpt: string
  category: string
  slug: string
  imageUrl?: string
}

import { createAdminClient } from "@/lib/supabase/admin"
import { type ActionResponse } from "@/types/admin"

export async function broadcastNews(props: BroadcastNewsProps): Promise<ActionResponse> {
  if (!audienceId) {
    console.error("RESEND_AUDIENCE_ID não configurado para broadcast")
    return { success: false, error: "Configuração de audiência ausente." }
  }

  try {
    // 1. Buscar todos os contatos da Audience
    const { data: contactsData, error: contactsError } = await resend.contacts.list({
      audienceId: audienceId,
    })

    if (contactsError || !contactsData) {
      console.error("Erro ao buscar contatos para broadcast:", contactsError)
      return { success: false, error: "Falha ao recuperar lista de assinantes." }
    }

    const subscribers = contactsData.data
    if (subscribers.length === 0) {
      return { success: true, count: 0, message: "Nenhum assinante para enviar." }
    }

    // 2. Preparar o e-mail (React Email para HTML)
    const FROM_EMAIL = "Coletivo Atravessamentos <contato@coletivoatravessamentos.com.br>"
    
    const emails = await Promise.all(subscribers
      .filter(contact => {
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
      return { success: true, count: 0, message: "Nenhum destinatário autorizado para o domínio de teste." }
    }

    // Resend batch send
    const { data: batchData, error: batchError } = await resend.batch.send(emails)

    if (batchError) {
      console.error("Erro no disparo em lote:", batchError)
      return { success: false, error: "Erro ao disparar e-mails em massa." }
    }

    // 3. Logar no Banco de Dados
    const supabase = createAdminClient()
    await supabase.from("newsletter_broadcasts").insert({
      title: props.title,
      excerpt: props.excerpt,
      category: props.category,
      slug: props.slug,
      count: emails.length,
      batch_id: (batchData as any)?.id,
      status: 'sent'
    })

    return { 
      success: true, 
      count: emails.length,
      batchId: (batchData as any)?.id 
    }
  } catch (error: any) {
    console.error("Erro fatal no broadcast:", error)
    return { success: false, error: error.message || "Ocorreu um erro inesperado no disparo." }
  }
}
