"use client"

import * as React from "react"
import { AnimatePresence } from "motion/react"
import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/landing/hero-section"
import { AboutSection } from "@/components/landing/about-section"
import { ProjectsSection } from "@/components/landing/projects-section"
import { MembersSection } from "@/components/landing/members-section"
import { BlogSection } from "@/components/landing/blog-section"
import { SiteFooter } from "@/components/site-footer"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function HomePage() {
  const [adminOpen, setAdminOpen] = React.useState(false)

  // Lock scroll when admin overlay is open
  React.useEffect(() => {
    if (adminOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [adminOpen])

  return (
    <>
      <SiteHeader onOpenAdmin={() => setAdminOpen(true)} />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <MembersSection />
        <BlogSection />
      </main>
      <SiteFooter />

      <AnimatePresence>
        {adminOpen && <AdminDashboard onClose={() => setAdminOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
