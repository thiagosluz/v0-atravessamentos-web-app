"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { type BlogPost } from "@/lib/mock-data"

function mapPost(p: any): BlogPost & { slug: string; content?: string } {
  return {
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    author: p.author,
    date: p.published_at,
    readTime: p.read_time,
    coverImage: p.cover_image,
    slug: p.slug,
    content: p.content,
    status: p.status,
    tags: p.tags || [],
  }
}

export async function getBlogPosts(limit?: number) {
  const supabase = createAdminClient()

  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "Publicado")
    .order("published_at", { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error("Erro ao buscar posts:", error)
    return []
  }

  return data.map(mapPost)
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error || !data) return null

  return mapPost(data)
}

export async function getBlogPostSlugs() {
  const supabase = createAdminClient()

  const { data } = await supabase.from("blog_posts").select("slug")

  return (data ?? []).map((p) => p.slug) as string[]
}

export async function getAdminBlogPosts(page: number = 1, limit: number = 10) {
  const supabase = createAdminClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .order("published_at", { ascending: false })
    .range(from, to)

  if (error) {
    console.error("Erro ao buscar posts admin:", error)
    return { data: [], count: 0 }
  }

  return {
    data: data.map(mapPost),
    count: count || 0
  }
}

export type BlogPostsFilter = {
  page?: number
  category?: string
  q?: string
  limit?: number
}

export async function getPaginatedBlogPosts(filters: BlogPostsFilter = {}) {
  const supabase = createAdminClient()

  const { page = 1, category, q, limit = 10 } = filters
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .eq("status", "Publicado")
    .order("published_at", { ascending: false })
    .range(from, to)

  if (category) {
    query = query.eq("category", category)
  }

  if (q) {
    query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("Erro ao buscar posts paginados:", error)
    return { posts: [], total: 0, totalPages: 0 }
  }

  const total = count ?? 0
  const totalPages = Math.ceil(total / limit)

  return {
    posts: (data ?? []).map(mapPost),
    total,
    totalPages,
  }
}

export async function getRelatedPosts(currentPostId: string, category: string, tags: string[] = [], limit: number = 3) {
  const supabase = createAdminClient()
  
  // Busca posts da mesma categoria ou com tags em comum
  // Usamos .overlap ({}) para verificar interseção de arrays no Supabase
  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "Publicado")
    .neq("id", currentPostId)

  if (tags.length > 0) {
    const formattedTags = tags.map(t => `"${t}"`).join(",")
    query = query.or(`category.eq."${category}",tags.ov.{${formattedTags}}`)
  } else {
    query = query.eq("category", category)
  }

  const { data, error } = await query.limit(limit * 2)
    
  if (error || !data) return []
  
  const posts = data.map(mapPost)
  
  // Ordenação manual por afinidade (mais tags em comum primeiro)
  return posts.sort((a, b) => {
    const aCommonTags = (a.tags || []).filter(t => tags.includes(t)).length
    const bCommonTags = (b.tags || []).filter(t => tags.includes(t)).length
    
    if (aCommonTags !== bCommonTags) {
      return bCommonTags - aCommonTags
    }
    
    // Mesma categoria como segundo critério
    if (a.category === category && b.category !== category) return -1
    if (b.category === category && a.category !== category) return 1
    
    return 0
  }).slice(0, limit)
}
