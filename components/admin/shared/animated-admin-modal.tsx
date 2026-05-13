"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnimatedAdminModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  maxWidthClass?: string
  isPending?: boolean
}

export function AnimatedAdminModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidthClass = "max-w-2xl",
  isPending = false,
}: AnimatedAdminModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isPending && onClose()}
            className="fixed inset-0 z-[100] bg-foreground/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed left-1/2 top-1/2 z-[101] w-full -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-2xl overflow-y-auto max-h-[90vh] text-left whitespace-normal",
              maxWidthClass
            )}
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight">
                  {title}
                </h2>
                {description && (
                  <p className="mt-1 text-sm text-foreground/55">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => !isPending && onClose()}
                className="rounded-full p-1.5 text-foreground/40 hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
