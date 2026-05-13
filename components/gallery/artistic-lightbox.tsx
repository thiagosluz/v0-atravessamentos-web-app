"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, MapPin, Tag, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import { OrganicImage } from "@/components/ui/organic-image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { type GalleryAsset } from "@/types/admin"

interface ArtisticLightboxProps {
  asset: GalleryAsset | null

  onClose: () => void
  onNext?: () => void
  onPrev?: () => void
}

export function ArtisticLightbox({ asset, onClose, onNext, onPrev }: ArtisticLightboxProps) {
  // Atalhos de teclado
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") onNext?.()
      if (e.key === "ArrowLeft") onPrev?.()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose, onNext, onPrev])

  if (!asset) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md p-4 md:p-8"
      >
        {/* Background poético (Textura de papel) */}
        <div className="absolute inset-0 -z-10 bg-[url('/paper-texture.png')] opacity-10" />

        {/* Botão Fechar */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 h-12 w-12 rounded-full hover:bg-primary/10"
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="relative grid h-full w-full max-w-7xl gap-8 md:grid-cols-12 items-center">
          
          {/* Navegação Esquerda */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:block">
            <Button variant="ghost" size="icon" onClick={onPrev} className="h-16 w-16 rounded-full">
              <ChevronLeft className="h-10 w-10" />
            </Button>
          </div>

          {/* Imagem Central */}
          <div className="md:col-span-8 flex h-full items-center justify-center overflow-hidden">
            <motion.div
              key={asset.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative aspect-[3/4] max-h-[85vh] w-full"
            >
              <OrganicImage
                src={asset.image_url}
                fallbackSrc={asset.image_url}
                alt={asset.title}
                priority
                shape="rounded-3xl"
                containerClassName="shadow-2xl border-8 border-white/50"
              />
            </motion.div>
          </div>

          {/* Painel de Metadados Poéticos */}
          <div className="md:col-span-4 flex flex-col justify-center space-y-6">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {asset.project?.title && (
                <p className="text-primary font-medium text-sm tracking-[0.2em] uppercase mb-2">
                  Projeto: {asset.project.title}
                </p>
              )}
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl mb-4">
                {asset.title || "Sem título"}
              </h2>
              
              {asset.description && (
                <p className="text-lg text-foreground/70 italic leading-relaxed">
                  "{asset.description}"
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4 pt-6 border-t border-border"
            >
              {asset.location && (
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                  <MapPin className="h-4 w-4 text-primary" />
                  {asset.location}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {asset.tags?.map((tag: string) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Tag className="h-3 w-3" />
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Navegação Direita */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:block">
            <Button variant="ghost" size="icon" onClick={onNext} className="h-16 w-16 rounded-full">
              <ChevronRight className="h-10 w-10" />
            </Button>
          </div>
        </div>

        {/* Navegação Mobile */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-4 md:hidden">
          <Button variant="outline" size="icon" onClick={onPrev} className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={onNext} className="rounded-full">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
