import { Metadata } from "next"
import { getSiteSettings } from "@/lib/actions/settings"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ContactView } from "@/components/contact/contact-view"

export const metadata: Metadata = {
  title: "Contato — Atravessamentos",
  description: "Entre em contato com o Coletivo Atravessamentos. Parcerias, editais, colaborações e diálogos.",
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <SiteHeader />
      <main className="pt-32 pb-24 overflow-hidden">
        <ContactView settings={settings} />
      </main>
      <SiteFooter settings={settings} />
    </div>
  )
}
