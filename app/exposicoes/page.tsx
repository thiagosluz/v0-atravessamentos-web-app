import * as React from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getExhibitions } from "@/lib/actions/exhibitions"
import { getSiteSettings } from "@/lib/actions/settings"
import { GalleryVertical, ArrowRight } from "lucide-react"
import Link from "next/link"
import { OrganicImage } from "@/components/ui/organic-image"
import { BackButton } from "@/components/ui/back-button"
import { PageHeader } from "@/components/ui/page-header"
import { BackgroundBlobs } from "@/components/ui/background-blobs"

export const metadata = {
  title: "Exposições | Coletivo Atravessamentos",
  description: "Curadorias temáticas e narrativas visuais sobre corpo, território e memória.",
}

export default async function ExposicoesPage() {
  const [exhibitions, settings] = await Promise.all([
    getExhibitions(),
    getSiteSettings()
  ])

  const publishedExhibitions = exhibitions.filter((e: any) => e.status === "Publicado")

  return (
    <div className="min-h-screen bg-background relative isolate">
      <div className="absolute inset-0 -z-10 bg-[url('/paper-texture.png')] opacity-20 pointer-events-none" />
      <BackgroundBlobs />
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-24">
        <div className="mb-12">
          <BackButton href="/" />
        </div>

        <PageHeader 
          label="Salas de Curadoria"
          title={<>Nossas <em className="not-italic text-primary italic font-light">Exposições</em></>}
          description="Narrativas curadas que atravessam o tempo e o espaço, organizadas para revelar as camadas profundas de cada registro."
        />

        {/* Listagem de Salas */}
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-2">
          {publishedExhibitions.length > 0 ? (
            publishedExhibitions.map((ex: any, index: number) => (
              <Link 
                key={ex.id} 
                href={`/exposicoes/${ex.slug}`}
                className="group relative block space-y-6"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] shadow-2xl">
                  <OrganicImage
                    src={ex.cover_image || "/placeholder.jpg"}
                    fallbackSrc="/placeholder.jpg"
                    alt={ex.title}
                    shape={index % 2 === 0 ? "organic" : "organic-2"}
                    containerClassName="transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Overlay Poético */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  
                  <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between text-white opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                    <span className="font-display text-sm font-medium tracking-widest uppercase italic">Entrar na Sala</span>
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </div>

                <div className="space-y-3 px-4">
                  <h2 className="font-display text-3xl md:text-4xl font-bold group-hover:text-primary transition-colors">
                    {ex.title}
                  </h2>
                  <p className="text-lg text-foreground italic line-clamp-2 leading-relaxed">
                    {ex.description}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-border rounded-[3rem]">
              <p className="text-foreground italic">As cortinas estão fechadas. Novas exposições em breve.</p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter settings={settings} />
    </div>
  )
}
