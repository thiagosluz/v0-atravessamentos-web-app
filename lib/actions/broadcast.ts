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
    const html = await render(NewsEmail(props))

    // 3. Disparo em Lote (Batch)
    // O Resend permite até 100 e-mails por batch. 
    // Para simplificar no início, faremos um batch único. 
    // Se a lista crescer muito, precisaremos de um loop com delay.
    
    const FROM_EMAIL = "Coletivo Atravessamentos <onboarding@resend.dev>"
    
    const emails = subscribers
      .map((contact) => ({
        from: FROM_EMAIL,
        to: contact.email,
        subject: `✨ Nova publicação: ${props.title}`,
        html: html,
      }))
      // Durante testes com onboarding@resend.dev, o Resend só permite enviar para o seu próprio e-mail.
      // Vamos filtrar para evitar que a Action quebre se houver outros e-mails na lista.
      .filter(email => {
        if (FROM_EMAIL.includes("onboarding@resend.dev")) {
          // Só permite se for para o e-mail que você usa no Resend (ou se for o seu e-mail de teste)
          // Aqui você pode colocar o seu e-mail fixo de teste se quiser
          return email.to === "coletivoatravessamentosapp@gmail.com" || email.to === "filhodaluz8@gmail.com"
        }
        return true
      })

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
