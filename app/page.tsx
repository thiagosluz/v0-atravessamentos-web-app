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
import { getCategories } from "@/lib/actions/categories"
import { getSiteSettings } from "@/lib/actions/settings"

export default async function HomePage() {
  // Busca todos os dados em paralelo no servidor
  const [{ data: projects }, { data: members }, blogPosts, categories, settings] = await Promise.all([
    getProjects(),
    getMembers(),
    getBlogPosts(6),
    getCategories(),
    getSiteSettings(),
  ])

  return (
    <>
      <AdminWrapper initialProjects={projects} />
      <main>
        <HeroSection settings={settings} />
        <AboutSection settings={settings} />
        <ProjectsSection initialProjects={projects} categories={categories} />
        <MembersSection initialMembers={members} categories={categories} />
        <BlogSection initialPosts={blogPosts} categories={categories} />
      </main>
      <SiteFooter settings={settings} />
    </>
  )
}
