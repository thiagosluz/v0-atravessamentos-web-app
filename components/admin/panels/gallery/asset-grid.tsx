"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Image as ImageIcon, Loader2 } from "lucide-react"
import { AssetItem } from "./asset-item"
import { type GalleryAsset } from "@/types/admin"

interface AssetGridProps {
  assets: GalleryAsset[]
  isUploading: boolean
  onEditAsset: (index: number) => void
}

export function AssetGrid({
  assets,
  isUploading,
  onEditAsset,
}: AssetGridProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Memória do Coletivo
        </h3>
        <p className="text-xs text-foreground/60">Os ativos aparecerão aqui após o upload.</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {assets.map((asset, index) => (
            <AssetItem 
              key={asset.id} 
              asset={asset} 
              onEdit={() => onEditAsset(index)} 
            />
          ))}
        </AnimatePresence>

        {isUploading && (
          <div className="aspect-square animate-pulse rounded-2xl bg-muted flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
          </div>
        )}
      </div>
    </section>
  )
}
