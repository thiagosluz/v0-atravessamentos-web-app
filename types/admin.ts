import { type Project, type Member, type BlogPost, type ProjectStatus } from "@/lib/mock-data"
import { type Category } from "@/lib/actions/categories"
import { type SiteSettings } from "@/lib/actions/settings"

export type { Project, Member, BlogPost, ProjectStatus }

export type ContentStatus = ProjectStatus | "Publicado" | "Rascunho" | "Em revisão"

export interface ActionResponse<T = any> {
  success: boolean
  error?: string
  message?: string
  data?: T
  count?: number
  batchId?: string
  alreadySubscribed?: boolean
}

export interface ExhibitionFormData {
  title: string
  slug: string
  description: string
  cover_image: string
  status: ContentStatus
  asset_ids: string[]
}

export interface GalleryAssetUpdateData {
  title: string
  description?: string | null
  location?: string | null
  project_id?: string | null
  tags: string[]
}

export interface NewsletterSubscriber {
  id: string
  email: string
  created_at: string
}

export interface NewsletterBroadcast {
  id: string
  created_at: string
  title: string
  excerpt: string
  category: string
  slug: string
  count: number
  batch_id?: string
  status: string
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
