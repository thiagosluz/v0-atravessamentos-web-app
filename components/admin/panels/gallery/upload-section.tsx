"use client"

import * as React from "react"
import { Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { type GalleryTag } from "@/types/admin"

interface UploadSectionProps {
  isUploading: boolean
  tags: GalleryTag[]
  selectedTags: string[]
  onToggleTag: (tagName: string) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function UploadSection({
  isUploading,
  tags,
  selectedTags,
  onToggleTag,
  onFileChange,
}: UploadSectionProps) {
  return (
    <section className="rounded-3xl border-2 border-dashed border-border bg-card/50 p-12 transition-colors hover:border-primary/20">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Upload className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-display text-xl font-bold">Upload em Lote</h3>
          <p className="text-sm text-foreground/60">Arraste ou clique para enviar até 20 fotos de uma vez</p>
        </div>
        
        {/* Tag Selection during upload */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {tags.map(tag => (
            <Badge 
              key={tag.id}
              variant={selectedTags.includes(tag.name) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                onToggleTag(tag.name)
              }}
            >
              {tag.name}
            </Badge>
          ))}
        </div>

        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          onChange={onFileChange}
          disabled={isUploading}
        />
      </label>
    </section>
  )
}
