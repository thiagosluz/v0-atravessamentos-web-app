"use client"

import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  History, 
  Send, 
  Users, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Mail
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { type NewsletterBroadcast } from "@/types/admin"

interface BroadcastHistoryProps {
  history: NewsletterBroadcast[]
}

export function BroadcastHistory({ history }: BroadcastHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-3xl bg-muted/20">
        <History className="h-12 w-12 text-foreground mb-4" />
        <p className="text-sm font-display italic text-foreground">Nenhum disparo realizado até o momento.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6 px-4">
        <History className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Registros de Transmissão</h3>
      </div>

      <div className="grid gap-4">
        {history.map((item) => (
          <div 
            key={item.id}
            className="group relative bg-background border rounded-3xl p-6 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="rounded-full bg-primary/5 text-primary border-primary/20 text-[10px]">
                    {item.category}
                  </Badge>
                  <span className="text-[10px] text-foreground font-medium uppercase tracking-tighter">
                    {format(new Date(item.created_at), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <h4 className="text-lg font-display font-bold group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-sm text-foreground line-clamp-1 italic">
                  {item.excerpt}
                </p>
              </div>

              <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-8 border-dashed">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-xl font-display font-black leading-none">{item.count}</span>
                  </div>
                  <p className="text-[10px] uppercase font-bold text-foreground tracking-widest">Alcance</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-500 mb-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase">Enviado</span>
                  </div>
                  <p className="text-[10px] uppercase font-bold text-foreground tracking-widest">Status</p>
                </div>

                {item.batch_id && (
                  <a 
                    href={`https://resend.com/emails/${item.batch_id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-muted hover:bg-primary hover:text-white transition-all group/link"
                    title="Ver no Resend"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
            
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all group-hover:right-4 pointer-events-none">
              <ChevronRight className="h-6 w-6 text-primary/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
