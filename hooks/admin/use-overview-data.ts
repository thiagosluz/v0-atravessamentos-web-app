import * as React from "react"
import { type Project, type Member, type BlogPost } from "@/types/admin"

interface UseOverviewDataProps {
  projects: Project[]
  blogPosts: BlogPost[]
  members: Member[]
}

export type OverviewItem = 
  | (Project & { type: 'project' })
  | (BlogPost & { type: 'blog' })
  | (Member & { type: 'member' })

export function useOverviewData({ projects, blogPosts, members }: UseOverviewDataProps) {
  const [isMac, setIsMac] = React.useState(true)

  React.useEffect(() => {
    if (typeof window !== "undefined" && navigator) {
      setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
    }
  }, [])

  // Helper to normalize dates
  const getItemDate = React.useCallback((item: any) => {
    const dateStr = item.updatedAt || item.date || item.createdAt || item.updated_at || item.created_at
    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? new Date(0) : date
  }, [])

  // Combine and sort recent activity
  const recentActivity = React.useMemo<OverviewItem[]>(() => {
    const p = projects.map(item => ({ ...item, type: 'project' as const }))
    const b = blogPosts.map(item => ({ ...item, type: 'blog' as const }))
    const m = members.map(item => ({ ...item, name: item.name, type: 'member' as const }))

    return [...p, ...b, ...m]
      .sort((a, b) => getItemDate(b).getTime() - getItemDate(a).getTime())
      .slice(0, 5)
  }, [projects, blogPosts, members, getItemDate])

  // Items needing attention
  const pendingItems = React.useMemo(() => {
    const p = projects.filter(item => item.status !== 'Publicado').map(item => ({ ...item, type: 'project' as const }))
    const b = blogPosts.filter(item => item.status !== 'Publicado').map(item => ({ ...item, type: 'blog' as const }))

    return [...p, ...b]
      .sort((a, b) => getItemDate(b).getTime() - getItemDate(a).getTime())
      .slice(0, 4)
  }, [projects, blogPosts, getItemDate])

  // Chart data
  const chartData = React.useMemo(() => {
    const counts: Record<string, number> = {}
    projects.forEach(p => {
      const category = p.category || "Sem Categoria"
      counts[category] = (counts[category] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [projects])

  // Count new items in last 30 days
  const newItemsCount = React.useMemo(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const newProjects = projects.filter(p => getItemDate(p) > thirtyDaysAgo).length
    const newPosts = blogPosts.filter(b => getItemDate(b) > thirtyDaysAgo).length

    return newProjects + newPosts
  }, [projects, blogPosts, getItemDate])

  // Stats calculation
  const stats = React.useMemo(() => {
    const publishedProjects = projects.filter(p => p.status === 'Publicado').length
    const publishedPosts = blogPosts.filter(b => b.status === 'Publicado').length
    
    return {
      projects: {
        published: publishedProjects,
        total: projects.length,
        trend: projects.filter(p => getItemDate(p) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
      },
      members: {
        total: members.length
      },
      blog: {
        published: publishedPosts,
        total: blogPosts.length,
        drafts: blogPosts.filter(b => b.status === 'Rascunho').length
      }
    }
  }, [projects, blogPosts, members, getItemDate])

  return {
    isMac,
    recentActivity,
    pendingItems,
    chartData,
    newItemsCount,
    getItemDate,
    stats
  }
}
