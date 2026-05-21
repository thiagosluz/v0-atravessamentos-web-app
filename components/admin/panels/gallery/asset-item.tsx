"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Heart } from "lucide-react"
import { type GalleryAsset } from "@/types/admin"

interface AssetItemProps {
  asset: GalleryAsset
  onEdit: () => void
}

export function AssetItem({ asset, onEdit }: AssetItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={onEdit}
      className="group relative aspect-square overflow-hidden rounded-2xl bg-muted cursor-pointer"
    >
      <img 
        src={asset.image_url} 
        alt={asset.title} 
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      {/* Indicador de Curtidas Permanente */}
      {(asset.likes || 0) > 0 && (
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 z-10">
          <Heart className="h-3 w-3 fill-red-500 text-red-500" />
          <span className="text-[10px] font-bold text-white">{asset.likes}</span>
        </div>
      )}
      
      {/* Overlay de Info */}
      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex flex-col justify-end p-3">
        <div className="text-white">
          <p className="text-xs font-bold truncate">{asset.title}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {asset.tags?.map((t: string) => (
              <span key={t} className="text-[8px] bg-white/20 px-1 rounded">#{t}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
