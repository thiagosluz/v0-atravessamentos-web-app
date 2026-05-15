"use client"

import * as React from "react"
import Link from "next/link"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { signOut } from "@/lib/actions/auth"
import { type User } from "@/types/admin"

interface AdminSidebarProps {
  active: string
  setActive: (id: string) => void
  navigation: Array<{ id: string; label: string; icon: any }>
  user: User | null
  projectsCount: number
}

export function AdminSidebar({
  active,
  setActive,
  navigation,
  user,
  projectsCount,
}: AdminSidebarProps) {
  return (
    <aside className="hidden h-screen sticky top-0 w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      {/* Header - Fixo */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-5">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="flex h-8 w-8 items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground border-organic">
            <span className="font-display text-base font-bold leading-none">A</span>
          </span>
          <span className="font-display text-sm font-bold tracking-tight">atravessamentos</span>
        </Link>
      </div>

      {/* Área Rolável */}
      <div className="flex-1 overflow-y-auto py-3 custom-scrollbar">
        <div className="px-3 mb-4">
          <div className="rounded-lg bg-sidebar-accent px-3 py-2 text-xs">
            <div className="flex items-center gap-1.5 text-sidebar-foreground/60">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--musgo)]" />
              Modo administrador
            </div>
            <p className="mt-1 font-medium text-sidebar-foreground">Painel de demonstração</p>
          </div>
        </div>

        <nav className="space-y-0.5 px-3" aria-label="Navegação do painel">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = active === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
                {item.id === "projects" && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      isActive
                        ? "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground"
                        : "bg-sidebar-accent text-sidebar-foreground/80"
                    )}
                  >
                    {projectsCount}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Footer - Fixo */}
      <div className="shrink-0 border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent font-display text-sm font-bold uppercase">
            {user?.user_metadata?.full_name?.substring(0, 2) ||
              user?.email?.substring(0, 2) ||
              "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuário"}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/55">
              {user?.email || "Sem e-mail"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut()}
            className="h-8 w-8 shrink-0 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            aria-label="Sair do painel"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
