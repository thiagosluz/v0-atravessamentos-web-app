"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface UrlModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (url: string) => void
  title: string
  defaultValue?: string
}

export function UrlModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  defaultValue = "",
}: UrlModalProps) {
  const [url, setUrl] = React.useState(defaultValue)

  // Atualiza o estado interno quando o defaultValue muda (ex: ao abrir para editar link)
  React.useEffect(() => {
    if (isOpen) setUrl(defaultValue)
  }, [isOpen, defaultValue])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/70">{title}</h3>
            <button onClick={onClose} className="rounded-full p-1 hover:bg-muted transition-colors">
              <X className="h-4 w-4 text-foreground/40" />
            </button>
          </div>
          <div className="space-y-4">
            <Input
              autoFocus
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-10"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSubmit(url)
                  setUrl("")
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose} className="rounded-full text-xs">
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  onSubmit(url)
                  setUrl("")
                }}
                className="rounded-full bg-primary text-primary-foreground text-xs px-4"
              >
                Confirmar
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
