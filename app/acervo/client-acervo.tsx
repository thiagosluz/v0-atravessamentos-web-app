"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { OrganicImage } from "@/components/ui/organic-image"
import { cn } from "@/lib/utils"
import { getGalleryAssets } from "@/lib/actions/gallery"
import { Loader2 } from "lucide-react"
import { ArtisticLightbox } from "@/components/gallery/artistic-lightbox"

import { type GalleryAsset } from "@/types/admin"

export function ClientAcervo() {
  const [filter, setFilter] = React.useState<string | null>(null)
  const [assets, setAssets] = React.useState<GalleryAsset[]>([])

  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedAssetIndex, setSelectedAssetIndex] = React.useState<number | null>(null)
  
  React.useEffect(() => {
    async function load() {
      const data = await getGalleryAssets()
      setAssets(data)
      setIsLoading(false)
    }
    load()
  }, [])

  const tags = Array.from(new Set(assets.flatMap(a => a.tags || [])))
  const filteredAssets = filter ? assets.filter(a => a.tags?.includes(filter)) : assets

  const handleNext = () => {
    if (selectedAssetIndex !== null) {
      setSelectedAssetIndex((selectedAssetIndex + 1) % filteredAssets.length)
    }
  }

  const handlePrev = () => {
    if (selectedAssetIndex !== null) {
      setSelectedAssetIndex((selectedAssetIndex - 1 + filteredAssets.length) % filteredAssets.length)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary/40" />
        <p className="text-sm font-display italic text-foreground/50">Abrindo os baús da memória...</p>
      </div>
    )
  }

  if (assets.length === 0) {
    return (
      <div className="text-center py-24 border-2 border-dashed border-border rounded-3xl">
        <p className="text-foreground/50 italic">O acervo está sendo curado. Volte em breve.</p>
      </div>
    )
  }

  return (
    <>
      {/* Filtros Poéticos */}
      <div className="mb-12 flex flex-wrap gap-3">
        <button
          onClick={() => setFilter(null)}
          className={cn(
            "rounded-full border px-6 py-2 text-sm font-medium transition-all",
            !filter ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground/60 border-border hover:border-primary/40"
          )}
        >
          Todos
        </button>
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={cn(
              "rounded-full border px-6 py-2 text-sm font-medium transition-all",
              filter === tag ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground/60 border-border hover:border-primary/40"
            )}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Grid Masonry */}
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {filteredAssets.map((asset, index) => (
            <motion.div
              key={asset.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              onClick={() => setSelectedAssetIndex(index)}
              className="mb-6 break-inside-avoid group relative cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <OrganicImage
                  src={asset.image_url}
                  fallbackSrc={asset.image_url}
                  alt={asset.title || "Imagem do Acervo"}
                  shape={index % 3 === 0 ? "organic" : index % 3 === 1 ? "organic-2" : "organic-3"}
                  containerClassName="shadow-lg transition-transform duration-500 group-hover:scale-[1.02]"
                />
                
                <div className="absolute inset-0 flex items-center justify-center bg-primary/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 backdrop-blur-[2px] pointer-events-none">
                  <p className="font-display text-xl font-bold text-white text-center px-4 drop-shadow-md">
                    {asset.title}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox imersivo */}
      {selectedAssetIndex !== null && (
        <ArtisticLightbox
          asset={filteredAssets[selectedAssetIndex]}
          onClose={() => setSelectedAssetIndex(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </>
  )
}
