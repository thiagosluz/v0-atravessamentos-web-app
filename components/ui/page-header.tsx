"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  label: string
  title: React.ReactNode
  description?: string
  className?: string
}

export function PageHeader({ label, title, description, className }: PageHeaderProps) {
  return (
    <header className={cn("max-w-4xl mb-16 md:mb-24", className)}>
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-6"
      >
        <span className="h-px w-8 bg-primary" />
        {label}
      </motion.span>
      
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className="font-display text-5xl md:text-8xl font-bold tracking-tight text-foreground leading-[0.95] mb-8"
      >
        {title}
      </motion.h1>
      
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xl md:text-2xl text-foreground/70 leading-relaxed max-w-2xl text-pretty"
        >
          {description}
        </motion.p>
      )}
    </header>
  )
}
