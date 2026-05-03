"use client"

import * as React from "react"
import { AnimatePresence } from "motion/react"
import { SiteHeader } from "@/components/site-header"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { type Project } from "@/lib/mock-data"

interface AdminWrapperProps {
  initialProjects: Project[]
}

export function AdminWrapper({ initialProjects }: AdminWrapperProps) {
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
      <AnimatePresence>
        {adminOpen && (
          <AdminDashboard
            onClose={() => setAdminOpen(false)}
            initialProjects={initialProjects}
          />
        )}
      </AnimatePresence>
    </>
  )
}
