import * as React from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getSiteSettings } from "@/lib/actions/settings"
import { ClientAcervo } from "./client-acervo"
import { BackButton } from "@/components/ui/back-button"
import { PageHeader } from "@/components/ui/page-header"
import { BackgroundBlobs } from "@/components/ui/background-blobs"

// Buscamos os dados no servidor
export default async function AcervoPage() {
  const settings = await getSiteSettings()
  
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 relative isolate">
      <div className="absolute inset-0 -z-10 bg-[url('/paper-texture.png')] opacity-20 pointer-events-none" />
      <BackgroundBlobs />
      <SiteHeader />
      
      <main className="relative pt-32 pb-24">
        
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <BackButton href="/" />
          </div>
          
          <PageHeader 
            label="Memória Viva"
            title={<>Acervo <em className="not-italic text-primary italic font-light">Vivo</em></>}
            description="Um repositório de memórias, gestos e travessias. Navegue pelos atravessamentos conceituais que moldam nossa história."
          />

          <ClientAcervo />
        </div>
      </main>

      <SiteFooter settings={settings} />
    </div>
  )
}
