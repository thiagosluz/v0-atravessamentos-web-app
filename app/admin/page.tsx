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

export default async function AdminPage() {
  const user = await getSession()
  if (!user) redirect("/login")

  const [projects, members, blogPosts, categories, settings] = await Promise.all([
    getProjects(),
    getMembers(),
    getAdminBlogPosts(),
    getCategories(),
    getSiteSettings(),
  ])

  return (
    <AdminDashboard
      user={user}
      initialProjects={projects}
      initialMembers={members}
      initialBlogPosts={blogPosts}
      initialCategories={categories}
      siteSettings={settings}
    />
  )
}
