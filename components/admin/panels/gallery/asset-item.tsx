"use client"

import * as React from "react"
import { motion } from "motion/react"
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
