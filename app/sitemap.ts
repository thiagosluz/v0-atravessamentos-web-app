import { MetadataRoute } from 'next'
import { getProjectIds } from "@/lib/actions/projects"
import { getBlogPostSlugs } from "@/lib/actions/blog-posts"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://atravessamentos.com.br'

  // Páginas Estáticas
  const routes = [
    '',
    '/projetos',
    '/diario',
    '/contato',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Páginas de Projetos
  const projectIds = await getProjectIds()
  const projectRoutes = projectIds.map((id) => ({
    url: `${baseUrl}/projetos/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Páginas do Diário (Blog)
  const blogSlugs = await getBlogPostSlugs()
  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${baseUrl}/diario/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...routes, ...projectRoutes, ...blogRoutes]
}
