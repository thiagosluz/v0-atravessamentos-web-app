"use client"

import * as React from "react"
import { Trash2, UserPlus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Subscriber {
  id: string
  email: string
  created_at: string
}

interface SubscriberListProps {
  subscribers: Subscriber[]
  onRemove: (email: string) => void
}

export function SubscriberList({ subscribers, onRemove }: SubscriberListProps) {
  const [query, setQuery] = React.useState("")

  const filtered = subscribers.filter(s => 
    s.email.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-4 p-6 md:p-10">
      <div className="flex items-center gap-4 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <Input 
            placeholder="Buscar assinante..." 
            className="pl-10 rounded-xl"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>E-mail</TableHead>
              <TableHead>Inscrição</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-12 text-center text-foreground/40 italic">
                  Nenhum assinante encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.id} className="hover:bg-muted/10 transition-colors border-border">
                  <TableCell className="font-medium">{s.email}</TableCell>
                  <TableCell className="text-sm text-foreground/60">
                    {new Date(s.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive/20"
                      onClick={() => onRemove(s.email)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
