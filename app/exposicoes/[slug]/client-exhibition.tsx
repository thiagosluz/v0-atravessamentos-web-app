"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { OrganicImage } from "@/components/ui/organic-image"
import { ArtisticLightbox } from "@/components/gallery/artistic-lightbox"

export function ClientExhibitionDetail({ assets }: { assets: any[] }) {
  const [selectedAssetIndex, setSelectedAssetIndex] = React.useState<number | null>(null)

  const handleNext = () => {
    if (selectedAssetIndex !== null) {
      setSelectedAssetIndex((selectedAssetIndex + 1) % assets.length)
    }
  }

  const handlePrev = () => {
    if (selectedAssetIndex !== null) {
      setSelectedAssetIndex((selectedAssetIndex - 1 + assets.length) % assets.length)
    }
  }

  if (!assets || assets.length === 0) {
    return (
      <div className="text-center py-24 border-2 border-dashed border-border rounded-3xl">
        <p className="text-foreground/50 italic">Esta sala está sendo preparada para visitação.</p>
      </div>
    )
  }

  return (
    <>
      {/* Grid Masonry Curado */}
      <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {assets.map((asset, index) => (
            <motion.div
              key={asset.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              onClick={() => setSelectedAssetIndex(index)}
              className="mb-8 break-inside-avoid group relative cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <OrganicImage
                  src={asset.image_url}
                  fallbackSrc={asset.image_url}
                  alt={asset.title || "Imagem da Exposição"}
                  shape={index % 3 === 0 ? "organic" : index % 3 === 1 ? "organic-2" : "organic-3"}
                  containerClassName="shadow-xl transition-transform duration-700 group-hover:scale-[1.02]"
                />
                
                {/* Overlay Poético */}
                <div className="absolute inset-0 flex items-center justify-center bg-primary/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 backdrop-blur-[2px] pointer-events-none">
                  <div className="text-center p-6 space-y-2">
                    <p className="font-display text-2xl font-bold text-white drop-shadow-lg">
                      {asset.title}
                    </p>
                    {asset.location && (
                      <p className="text-white/80 text-xs tracking-widest uppercase italic">
                        {asset.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox Imersivo */}
      {selectedAssetIndex !== null && (
        <ArtisticLightbox
          asset={assets[selectedAssetIndex]}
          onClose={() => setSelectedAssetIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </>
  )
}
