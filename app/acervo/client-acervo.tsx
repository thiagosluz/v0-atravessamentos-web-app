"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { OrganicImage } from "@/components/ui/organic-image"
import { cn } from "@/lib/utils"
import { getGalleryAssets, likeGalleryAsset, unlikeGalleryAsset } from "@/lib/actions/gallery"
import { Loader2, Heart } from "lucide-react"
import { ArtisticLightbox } from "@/components/gallery/artistic-lightbox"

import { type GalleryAsset } from "@/types/admin"

export function ClientAcervo() {
  const [filter, setFilter] = React.useState<string | null>(null)
  const [assets, setAssets] = React.useState<GalleryAsset[]>([])

  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedAssetIndex, setSelectedAssetIndex] = React.useState<number | null>(null)
  
  interface LikeData {
    timestamp: number
    token?: string
  }
  const [likedAssets, setLikedAssets] = React.useState<Record<string, LikeData>>({})

  React.useEffect(() => {
    async function load() {
      const data = await getGalleryAssets()
      setAssets(data)
      setIsLoading(false)
    }
    load()
    
    // Load likes from local storage
    const savedLikes = localStorage.getItem("atravessamentos_likes")
    if (savedLikes) {
      try {
        const parsed = JSON.parse(savedLikes)
          // Migration from old formats
          let migrated: Record<string, LikeData> = {}
          
          if (Array.isArray(parsed)) {
            // Oldest format (Array of IDs)
            migrated = parsed.reduce((acc, id) => {
              acc[id] = { timestamp: 0 }
              return acc
            }, {} as Record<string, LikeData>)
          } else {
            // Check if it's the intermediate format (Record<string, number>) or new format
            Object.entries(parsed).forEach(([id, value]) => {
              if (typeof value === "number") {
                migrated[id] = { timestamp: value }
              } else {
                migrated[id] = value as LikeData
              }
            })
          }
          setLikedAssets(migrated)
          localStorage.setItem("atravessamentos_likes", JSON.stringify(migrated))
      } catch (e) {
        console.error("Failed to parse likes", e)
      }
    }
  }, [])

  const handleLike = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation() // Prevent opening lightbox
    
    const now = Date.now()
    const likeData = likedAssets[id]

    if (likeData !== undefined) {
      // Already liked
      const isUndoable = likeData.timestamp > 0 && (now - likeData.timestamp < 15000)
      
      if (isUndoable && likeData.token) {
        // Optimistic unlike
        setLikedAssets(prev => {
          const next = { ...prev }
          delete next[id]
          localStorage.setItem("atravessamentos_likes", JSON.stringify(next))
          return next
        })
        setAssets(prev => prev.map(asset => 
          asset.id === id ? { ...asset, likes: Math.max(0, (asset.likes || 0) - 1) } : asset
        ))
        await unlikeGalleryAsset(id, likeData.token)
      }
      return
    }

    // New Like (Optimistic update)
    setLikedAssets(prev => {
      const next = { ...prev, [id]: { timestamp: now } }
      localStorage.setItem("atravessamentos_likes", JSON.stringify(next))
      return next
    })
    
    setAssets(prev => prev.map(asset => 
      asset.id === id ? { ...asset, likes: (asset.likes || 0) + 1 } : asset
    ))

    // Call server action
    const res = await likeGalleryAsset(id)
    
    if (res.success && res.undoToken) {
      // Salvar o token retornado para permitir o undo
      setLikedAssets(prev => {
        if (prev[id]) {
          const next = { ...prev, [id]: { timestamp: now, token: res.undoToken } }
          localStorage.setItem("atravessamentos_likes", JSON.stringify(next))
          return next
        }
        return prev
      })
    }
  }

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
        <p className="text-sm font-display italic text-foreground">Abrindo os baús da memória...</p>
      </div>
    )
  }

  if (assets.length === 0) {
    return (
      <div className="text-center py-24 border-2 border-dashed border-border rounded-3xl">
        <p className="text-foreground italic">O acervo está sendo curado. Volte em breve.</p>
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
            !filter ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:border-primary/40"
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
              filter === tag ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:border-primary/40"
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
                
                {/* Like Button */}
                <button
                  onClick={(e) => handleLike(e, asset.id)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 backdrop-blur-md text-white transition-all hover:scale-110 active:scale-95"
                  aria-label="Curtir obra"
                >
                  <Heart 
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      likedAssets[asset.id] !== undefined ? "fill-red-500 text-red-500 scale-110" : "fill-transparent hover:text-red-300"
                    )} 
                  />
                  {/* Like Count */}
                  {(asset.likes || 0) > 0 && (
                    <span className="absolute -bottom-4 right-1 text-[10px] font-bold text-white drop-shadow-md">
                      {asset.likes}
                    </span>
                  )}
                </button>
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
