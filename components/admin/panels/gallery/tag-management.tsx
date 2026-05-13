"use client"

import * as React from "react"
import { Plus, Tag as TagIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TagManagementProps {
  newTag: string
  setNewTag: (value: string) => void
  onCreateTag: () => void
}

export function TagManagement({
  newTag,
  setNewTag,
  onCreateTag,
}: TagManagementProps) {
  return (
    <section className="space-y-4">
      <h3 className="font-display text-lg font-bold flex items-center gap-2">
        <TagIcon className="h-5 w-5" />
        Hashtags Conceituais
      </h3>
      <div className="flex gap-2">
        <Input 
          placeholder="Nova hashtag (ex: cerrado)" 
          className="max-w-xs h-10 rounded-xl"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onCreateTag()}
        />
        <Button onClick={onCreateTag} className="rounded-xl bg-primary text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Tag
        </Button>
      </div>
    </section>
  )
}
