"use server"

import { createAdminClient } from "@/lib/supabase/admin"

export type SearchResult = {
  id: string
  title: string
  subtitle?: string
  image?: string
  type: "project" | "member" | "blog" | "gallery" | "exhibition"
  href: string
}

export async function globalSearch(query: string, isAdmin: boolean = false): Promise<SearchResult[]> {
  if (!query || query.length < 2) return []

  const supabase = createAdminClient()
  const q = `%${query}%`

  // Preparar queries
  let projectsQuery = supabase
    .from("projects")
    .select("id, title, category, cover_image")
    .or(`title.ilike.${q},description.ilike.${q}`)
    .limit(5)

  if (!isAdmin) {
    projectsQuery = projectsQuery.eq("status", "Publicado")
  }

  let blogQuery = supabase
    .from("blog_posts")
    .select("id, title, excerpt, cover_image, slug")
    .or(`title.ilike.${q},excerpt.ilike.${q}`)
    .limit(5)

  if (!isAdmin) {
    blogQuery = blogQuery.eq("status", "Publicado")
  }

  let exhibitionsQuery = supabase
    .from("exhibitions")
    .select("id, title, description, cover_image, slug")
    .or(`title.ilike.${q},description.ilike.${q}`)
    .limit(5)

  if (!isAdmin) {
    exhibitionsQuery = exhibitionsQuery.eq("status", "Publicado")
  }

  // Buscas paralelas
  const [projectsRes, membersRes, blogRes, galleryRes, exhibitionsRes] = await Promise.all([
    projectsQuery,
    supabase
      .from("members")
      .select("id, name, role, avatar")
      .or(`name.ilike.${q},bio.ilike.${q}`)
      .limit(5),
    blogQuery,
    supabase
      .from("gallery_assets")
      .select("id, title, description, image_url")
      .or(`title.ilike.${q},description.ilike.${q}`)
      .limit(5),
    exhibitionsQuery,
  ])

  const results: SearchResult[] = []

  if (projectsRes.data) {
    results.push(
      ...projectsRes.data.map((p) => ({
        id: p.id,
        title: p.title,
        subtitle: p.category,
        image: p.cover_image,
        type: "project" as const,
        href: `/projetos/${p.id}`,
      }))
    )
  }

  // Mapear membros
  if (membersRes.data) {
    results.push(
      ...membersRes.data.map((m) => ({
        id: m.id,
        title: m.name,
        subtitle: m.role,
        image: m.avatar,
        type: "member" as const,
        href: `/membros/${m.id}`,
      }))
    )
  }

  // Mapear blog
  if (blogRes.data) {
    results.push(
      ...blogRes.data.map((b) => ({
        id: b.id,
        title: b.title,
        subtitle: b.excerpt?.substring(0, 60) + "...",
        image: b.cover_image,
        type: "blog" as const,
        href: `/diario/${b.slug}`,
      }))
    )
  }

  // Mapear Acervo (Galeria)
  if (galleryRes.data) {
    results.push(
      ...galleryRes.data.map((g) => ({
        id: g.id,
        title: g.title,
        subtitle: g.description?.substring(0, 60) + "...",
        image: g.image_url,
        type: "gallery" as const,
        href: `/acervo`,
      }))
    )
  }

  // Mapear Exposições
  if (exhibitionsRes.data) {
    results.push(
      ...exhibitionsRes.data.map((e) => ({
        id: e.id,
        title: e.title,
        subtitle: e.description?.substring(0, 60) + "...",
        image: e.cover_image,
        type: "exhibition" as const,
        href: `/exposicoes/${e.slug}`,
      }))
    )
  }

  return results
}
