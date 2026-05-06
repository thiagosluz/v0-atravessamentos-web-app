import React from "react"
import { getSiteSettings } from "@/lib/actions/settings"
import { LegalPageLayout } from "@/components/legal-page-layout"
import { Metadata } from "next"
import { constructMetadata } from "@/lib/utils/seo"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return constructMetadata({
    title: "Termos de Uso",
    description: settings.terms_seo_description,
    settings
  })
}

export default async function TermosPage() {
  const settings = await getSiteSettings()

  return (
    <LegalPageLayout
      title="Acordos de Convivência"
      subtitle="Ética Coletiva"
      content={settings?.terms_of_use_content || "<p>Conteúdo em desenvolvimento.</p>"}
      lastUpdate={settings?.updated_at}
    />
  )
}
