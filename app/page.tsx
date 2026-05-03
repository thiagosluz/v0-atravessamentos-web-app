import * as React from "react"
import { HeroSection } from "@/components/landing/hero-section"
import { AboutSection } from "@/components/landing/about-section"
import { ProjectsSection } from "@/components/landing/projects-section"
import { MembersSection } from "@/components/landing/members-section"
import { BlogSection } from "@/components/landing/blog-section"
import { SiteFooter } from "@/components/site-footer"
import { AdminWrapper } from "@/components/admin/admin-wrapper"
import { getProjects } from "@/lib/actions/projects"
import { getMembers } from "@/lib/actions/members"
import { getBlogPosts } from "@/lib/actions/blog-posts"

export default async function HomePage() {
  // Busca todos os dados em paralelo no servidor
  const [projects, members, blogPosts] = await Promise.all([
    getProjects(),
    getMembers(),
    getBlogPosts(),
  ])

  return (
    <>
      <AdminWrapper initialProjects={projects} />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection initialProjects={projects} />
        <MembersSection initialMembers={members} />
        <BlogSection initialPosts={blogPosts} />
      </main>
      <SiteFooter />
    </>
  )
}
