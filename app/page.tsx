import * as React from "react"
import { HeroSection } from "@/components/landing/hero-section"
import { AboutSection } from "@/components/landing/about-section"
import { ProjectsSection } from "@/components/landing/projects-section"
import { MembersSection } from "@/components/landing/members-section"
import { BlogSection } from "@/components/landing/blog-section"
import { SiteFooter } from "@/components/site-footer"
import { AdminWrapper } from "@/components/admin/admin-wrapper"
import { getProjects } from "@/lib/actions/projects"

export default async function HomePage() {
  // Busca os projetos diretamente do Supabase no servidor
  const projects = await getProjects()

  return (
    <>
      <AdminWrapper initialProjects={projects} />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection initialProjects={projects} />
        <MembersSection />
        <BlogSection />
      </main>
      <SiteFooter />
    </>
  )
}
