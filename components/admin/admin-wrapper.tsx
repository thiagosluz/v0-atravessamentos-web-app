"use client"

import * as React from "react"
import { SiteHeader } from "@/components/site-header"
import { type Project } from "@/lib/mock-data"

interface AdminWrapperProps {
  initialProjects: Project[]
}

export function AdminWrapper({ initialProjects: _ }: AdminWrapperProps) {
  return <SiteHeader onOpenAdmin={() => window.location.href = "/admin"} />
}
