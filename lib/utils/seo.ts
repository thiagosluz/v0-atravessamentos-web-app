import { Metadata } from "next"
import { SiteSettings } from "@/lib/actions/settings"

interface SEOProps {
  title: string
  description?: string
  image?: string
  settings: SiteSettings
  type?: "website" | "article"
}

export function constructMetadata({
  title,
  description,
  image,
  settings,
  type = "website"
}: SEOProps): Metadata {
  const siteTitle = settings.seo_title || "Atravessamentos"
  const fullTitle = title === siteTitle ? title : `${title} — ${siteTitle}`
  const finalDescription = description || settings.seo_description || ""
  const finalImage = image || settings.og_image_url || "/og-image.jpg" // Fallback para imagem estática se existir

  return {
    title: fullTitle,
    description: finalDescription,
    openGraph: {
      title: fullTitle,
      description: finalDescription,
      type,
      siteName: siteTitle,
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: finalDescription,
      images: [finalImage],
      creator: "@atravessamentos", // Ajuste se houver Twitter oficial
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
  }
}
