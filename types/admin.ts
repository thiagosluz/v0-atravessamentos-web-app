import { type Project, type Member, type BlogPost, type ProjectStatus } from "@/lib/mock-data"
import { type Category } from "@/lib/actions/categories"
import { type SiteSettings } from "@/lib/actions/settings"

export type ContentStatus = ProjectStatus | "Publicado" | "Rascunho" | "Em revisão"

export interface ActionResponse {
  success?: boolean
  error?: string
  alreadySubscribed?: boolean
}


export interface User {
  id: string
  email?: string
  user_metadata: {
    full_name?: string
    avatar_url?: string
    [key: string]: any
  }
}

export interface GalleryTag {
  id: string
  name: string
  created_at: string
}

export interface ProjectOption {
  id: string
  title: string
}

export interface GalleryAsset {
  id: string
  title: string
  image_url: string
  description?: string | null
  location?: string | null
  project_id?: string | null
  tags: string[]
  created_at: string
  project?: {
    title: string
  }
}

export interface Exhibition {
  id: string
  title: string
  slug: string
  description?: string | null
  cover_image?: string | null
  status: ContentStatus
  asset_ids: string[]
  created_at: string
  assets?: GalleryAsset[]
}

export interface AdminDashboardProps {
  user: User | null
  projectsData: { data: Project[], count: number }
  membersData: { data: Member[], count: number }
  blogPostsData: { data: BlogPost[], count: number }
  initialCategories: Category[]
  siteSettings: SiteSettings
  currentPage: {
    projects: number
    members: number
    blog: number
  }
}

