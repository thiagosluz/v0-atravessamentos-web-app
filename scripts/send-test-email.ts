import { Resend } from "resend"
import { NewsEmail } from "../components/emails/news-template"
import { render } from "@react-email/components"
import * as dotenv from "dotenv"
import * as path from "path"

// Carregar .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const resend = new Resend(process.env.RESEND_API_KEY)

async function main() {
  console.log("🚀 Iniciando envio de e-mail de teste...")
  
  const testData = {
    title: "Teste de Identidade Visual: Coletivo Atravessamentos",
    excerpt: "Este é um e-mail de teste para validar o layout terracota, as fontes e a estrutura da nossa nova newsletter automática.",
    category: "TESTE INTERNO",
    slug: "teste-visual",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=600&auto=format&fit=crop",
  }

  try {
    const html = await render(NewsEmail(testData))
    
    // Pegar o e-mail de destino (o mesmo do admin ou o verificado no Resend)
    const toEmail = "coletivoatravessamentosapp@gmail.com"

    const { data, error } = await resend.emails.send({
      from: "Atravessamentos <onboarding@resend.dev>",
      to: [toEmail],
      subject: "🎨 Teste de Layout: Nova Newsletter Atravessamentos",
      html: html,
    })

    if (error) {
      console.error("❌ Erro ao enviar:", error)
      return
    }

    console.log("✅ E-mail de teste enviado com sucesso!", data)
  } catch (err) {
    console.error("💥 Erro fatal:", err)
  }
}

main()
