"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Lock, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { label: "Sobre", href: "/#sobre" },
  { label: "Projetos", href: "/projetos" },
  { label: "Coletivo", href: "/#coletivo" },
  { label: "Diário", href: "/diario" },
  { label: "Contato", href: "/#contato" },
]

interface SiteHeaderProps {
  onOpenAdmin?: () => void
}

export function SiteHeader({ onOpenAdmin }: SiteHeaderProps) {
  const handleOpenAdmin = onOpenAdmin || (() => { window.location.href = "/admin" })
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-foreground/10"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-8">
        {/* Logo — sempre volta para home */}
        <Link href="/" className="group flex items-center gap-2">
          <span className="relative flex h-9 w-9 items-center justify-center bg-primary text-primary-foreground border-organic transition-transform group-hover:rotate-12">
            <span className="font-display text-lg font-bold leading-none">A</span>
          </span>
          <span className="font-display text-base font-bold tracking-tight md:text-lg">
            atravessamentos
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {navItems.map((item) => {
            const isActive = item.href === "/projetos" || item.href === "/diario"
              ? pathname === item.href
              : false
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground font-semibold after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:rounded-full after:bg-primary after:-translate-x-1/2"
                    : "text-foreground/80 hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleOpenAdmin}
            variant="outline"
            size="sm"
            className="hidden border-foreground/20 bg-transparent font-medium md:inline-flex"
          >
            <Lock className="mr-2 h-4 w-4" />
            Área Restrita
          </Button>
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-foreground/20 bg-transparent lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-foreground/10 bg-background lg:hidden"
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-foreground/80 hover:bg-foreground/5"
              >
                {item.label}
              </Link>
            ))}
            <Button
              onClick={() => {
                setOpen(false)
                handleOpenAdmin()
              }}
              variant="outline"
              className="mt-2 border-foreground/20 bg-transparent"
            >
              <Lock className="mr-2 h-4 w-4" />
              Área Restrita
            </Button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}
