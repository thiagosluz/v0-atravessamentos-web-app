import * as React from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getExhibitionBySlug } from "@/lib/actions/exhibitions"
import { getSiteSettings } from "@/lib/actions/settings"
import { ClientExhibitionDetail } from "@/app/exposicoes/[slug]/client-exhibition"
import { notFound } from "next/navigation"
import { BackButton } from "@/components/ui/back-button"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const exhibition = await getExhibitionBySlug(slug)
  
  if (!exhibition) return { title: "Exposição não encontrada" }

  return {
    title: `${exhibition.title} | Exposições Atravessamentos`,
    description: exhibition.description,
  }
}

export default async function ExhibitionDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [exhibition, settings] = await Promise.all([
    getExhibitionBySlug(slug),
    getSiteSettings()
  ])

  if (!exhibition || exhibition.status !== "Publicado") {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-24">
        <div className="mb-12">
          <BackButton href="/exposicoes" label="Voltar para Salas de Curadoria" />
        </div>
        {/* Intro da Exposição */}
        <div className="mb-24 space-y-8 max-w-4xl mx-auto text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight">
            {exhibition.title}
          </h1>
          <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
          <p className="text-xl md:text-2xl text-foreground/70 italic leading-relaxed font-light">
            {exhibition.description}
          </p>
        </div>

        {/* Grid de Ativos Curados (Client Component para interatividade) */}
        <ClientExhibitionDetail assets={exhibition.assets} />
      </main>

      <SiteFooter settings={settings} />
    </div>
  )
}
