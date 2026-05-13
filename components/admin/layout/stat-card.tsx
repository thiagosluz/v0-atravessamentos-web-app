"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string
  trend: string
  icon: React.ComponentType<{ className?: string }>
  accent: string
  variation?: string
}

export function StatCard({ label, value, trend, icon: Icon, accent, variation }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-foreground/65">{label}</p>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", accent)}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold tracking-tight">
        {value}
        {variation && (
          <span className="ml-2 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            {variation}
          </span>
        )}
      </p>
      <p className="mt-1 text-xs text-foreground/60">{trend}</p>
    </div>
  )
}
