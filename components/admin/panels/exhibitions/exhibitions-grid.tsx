"use client"

import * as React from "react"
import { ExhibitionCard } from "./exhibition-card"
import { type Exhibition } from "@/types/admin"

interface ExhibitionsGridProps {
  exhibitions: Exhibition[]
  onEdit: (ex: Exhibition) => void
  onDelete: (id: string) => void
}

export function ExhibitionsGrid({ exhibitions, onEdit, onDelete }: ExhibitionsGridProps) {
  if (exhibitions.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-foreground/40 italic">Nenhuma exposição criada ainda.</p>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {exhibitions.map((ex) => (
          <ExhibitionCard 
            key={ex.id} 
            exhibition={ex} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
      </div>
    </div>
  )
}
