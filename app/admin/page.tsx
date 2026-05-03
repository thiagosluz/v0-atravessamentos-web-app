import { getSession } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { getProjects } from "@/lib/actions/projects"
import { getMembers } from "@/lib/actions/members"
import { getBlogPosts } from "@/lib/actions/blog-posts"

export const metadata = {
  title: "Painel — Atravessamentos",
  robots: "noindex, nofollow",
}

export default async function AdminPage() {
  const user = await getSession()
  if (!user) redirect("/login")

  const [projects, members, blogPosts] = await Promise.all([
    getProjects(),
    getMembers(),
    getBlogPosts(),
  ])

  return (
    <AdminDashboard
      initialProjects={projects}
      initialMembers={members}
      initialBlogPosts={blogPosts}
    />
  )
}
