import { getSession } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { getProjects } from "@/lib/actions/projects"
import { getMembers } from "@/lib/actions/members"
import { getAdminBlogPosts } from "@/lib/actions/blog-posts"
import { getCategories } from "@/lib/actions/categories"
import { getSiteSettings } from "@/lib/actions/settings"

export const metadata = {
  title: "Painel — Atravessamentos",
  robots: "noindex, nofollow",
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await getSession()
  if (!user) redirect("/login")

  const params = await searchParams
  const pPage = Number(params.p_page) || 1
  const mPage = Number(params.m_page) || 1
  const bPage = Number(params.b_page) || 1

  const [projectsRes, membersRes, blogRes, categories, settings] = await Promise.all([
    getProjects(pPage),
    getMembers(mPage),
    getAdminBlogPosts(bPage),
    getCategories(),
    getSiteSettings(),
  ])

  return (
    <AdminDashboard
      user={user}
      projectsData={projectsRes}
      membersData={membersRes}
      blogPostsData={blogRes}
      initialCategories={categories}
      siteSettings={settings}
      currentPage={{
        projects: pPage,
        members: mPage,
        blog: bPage
      }}
    />
  )
}
