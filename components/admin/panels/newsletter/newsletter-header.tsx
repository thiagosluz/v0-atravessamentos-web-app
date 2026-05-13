"use client"

import * as React from "react"
import { Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NewsletterHeaderProps {
  onBroadcast: () => void
  isBroadcasting: boolean
}

export function NewsletterHeader({ onBroadcast, isBroadcasting }: NewsletterHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border p-4 md:flex-row md:items-center md:justify-between md:p-6">
      <div className="space-y-1">
        <h3 className="font-display text-lg font-bold flex items-center gap-2 md:text-xl">
          <Mail className="h-5 w-5 text-primary" />
          Gestão de Newsletter
        </h3>
        <p className="text-sm text-foreground/60">Acompanhe seus assinantes e envie novidades.</p>
      </div>
      <Button 
        onClick={onBroadcast} 
        disabled={isBroadcasting}
        className="rounded-xl bg-primary text-primary-foreground"
      >
        <Send className="mr-2 h-4 w-4" />
        {isBroadcasting ? "Enviando..." : "Disparar Última Novidade"}
      </Button>
    </div>
  )
}
