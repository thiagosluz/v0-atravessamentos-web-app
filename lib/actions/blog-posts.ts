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
  }
}

export async function getBlogPosts() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "Publicado")
    .order("published_at", { ascending: false })

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
