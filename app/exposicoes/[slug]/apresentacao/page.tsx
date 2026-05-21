import * as React from "react"
import { getExhibitionBySlug } from "@/lib/actions/exhibitions"
import { notFound } from "next/navigation"
import { PresentationClient } from "./presentation-client"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const exhibition = await getExhibitionBySlug(slug)
  
  if (!exhibition) return { title: "Modo Apresentação não encontrado" }

  return {
    title: `Apresentação: ${exhibition.title}`,
  }
}

export default async function PresentationPage({ params }: PageProps) {
  const { slug } = await params
  const exhibition = await getExhibitionBySlug(slug)

  if (!exhibition || exhibition.status !== "Publicado") {
    notFound()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black text-white">
      <PresentationClient assets={exhibition.assets || []} slug={slug} />
    </div>
  )
}
