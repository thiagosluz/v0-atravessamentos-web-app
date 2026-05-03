// ============================================================================
// Tipos de dados — espelho do banco de dados (Supabase)
// ============================================================================

export type ProjectCategory = "Audiovisual" | "Educação" | "Evento" | "Pesquisa" | "Editorial"
export type ProjectStatus = "Publicado" | "Rascunho" | "Em revisão"

export interface Project {
  id: string
  title: string
  category: ProjectCategory
  description: string
  coverImage: string
  year: number
  status: ProjectStatus
  updatedAt: string
}

export interface Member {
  id: string
  name: string
  role: string
  tags: string[]
  avatar: string | null
  bio: string
  instagram?: string | null
  linkedin?: string | null
  email?: string | null
  phone?: string | null
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: "Reflexão" | "Evento" | "Manifesto" | "Notícia"
  author: string
  date: string
  readTime: string
  coverImage: string
  status?: "Publicado" | "Rascunho"
}

// ============================================================================
// Helpers
// ============================================================================

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}
