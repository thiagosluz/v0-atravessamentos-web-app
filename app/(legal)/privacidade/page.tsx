import React from "react"
import { getSiteSettings } from "@/lib/actions/settings"
import { LegalPageLayout } from "@/components/legal-page-layout"
import { Metadata } from "next"
import { constructMetadata } from "@/lib/utils/seo"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return constructMetadata({
    title: "Privacidade",
    description: settings.privacy_seo_description,
    settings
  })
}

export default async function PrivacidadePage() {
  const settings = await getSiteSettings()

  return (
    <LegalPageLayout
      title="Privacidade como Cuidado"
      subtitle="Transparência"
      content={settings?.privacy_policy_content || "<p>Conteúdo em desenvolvimento.</p>"}
      lastUpdate={settings?.updated_at}
    />
  )
}
