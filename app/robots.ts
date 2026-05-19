import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/login/'], // Protege áreas sensíveis da indexação
    },
    sitemap: 'https://coletivoatravessamentos.com.br/sitemap.xml',
  }
}
