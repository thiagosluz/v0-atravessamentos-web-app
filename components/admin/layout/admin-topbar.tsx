"use client"

import * as React from "react"
import Link from "next/link"
import { ExternalLink, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminCommandMenu } from "@/components/admin/admin-command-menu"
import { signOut } from "@/lib/actions/auth"

interface AdminTopbarProps {
  activeLabel: string
  setActive: (id: string) => void
  onEditItem: (type: "project" | "member" | "blog", id: string) => void
}

export function AdminTopbar({ activeLabel, setActive, onEditItem }: AdminTopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 md:px-8 no-print">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-xl font-bold tracking-tight md:text-2xl">
          {activeLabel}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden sm:block">
          <AdminCommandMenu setActive={setActive} onEditItem={onEditItem} />
        </div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="hidden gap-2 text-muted-foreground hover:text-foreground lg:flex"
        >
          <Link href="/">
            <ExternalLink className="h-4 w-4" />
            Ver site
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut()}
          className="rounded-full"
        >
          <LogOut className="mr-1.5 h-4 w-4" />
          Sair
        </Button>
      </div>
    </header>
  )
}
