"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback, useTransition } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Category } from "@/lib/actions/categories"

interface DiaryFiltersProps {
  categories: Category[]
  currentCategory: string
  currentQ: string
}

export function DiaryFilters({ categories, currentCategory, currentQ }: DiaryFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const createURL = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())
      // Sempre reset para página 1 ao filtrar
      params.delete("pagina")
      Object.entries(updates).forEach(([key, val]) => {
        if (val) params.set(key, val)
        else params.delete(key)
      })
      return `${pathname}?${params.toString()}`
    },
    [pathname, searchParams]
  )

  function handleCategory(cat: string) {
    startTransition(() => {
      const next = cat === currentCategory ? undefined : cat
      router.push(createURL({ categoria: next }))
    })
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value.trim()
    startTransition(() => {
      router.push(createURL({ q: q || undefined }))
    })
  }

  function handleClear() {
    startTransition(() => {
      router.push(pathname)
    })
  }

  const hasFilter = !!currentCategory || !!currentQ

  return (
    <div className={cn("mb-12 space-y-4 transition-opacity", isPending && "opacity-50")}>
      {/* Busca */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
        <input
          name="q"
          type="search"
          defaultValue={currentQ}
          placeholder="Buscar no diário…"
          className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-12 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
        {currentQ && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
            aria-label="Limpar busca"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Abas de categoria */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => handleCategory("")}
          data-active={!currentCategory}
          className={cn(
            "rounded-full border border-border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-all",
            "text-foreground/60 hover:border-foreground/30 hover:text-foreground",
            !currentCategory && "border-foreground bg-foreground text-background"
          )}
        >
          Todos
        </button>
        {categories.map((cat) => {
          const isActive = currentCategory === cat.name
          const color = cat.color || "primary"
          
          return (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat.name)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-all",
                isActive
                  ? `border-${color}-500/30 bg-${color}-500/10 text-${color}-600 dark:text-${color}-400`
                  : "border-border text-foreground/60 hover:border-foreground/30 hover:text-foreground"
              )}
            >
              {cat.name}
            </button>
          )
        })}

        {hasFilter && (
          <button
            onClick={handleClear}
            className="ml-auto flex items-center gap-1.5 text-xs text-foreground/40 hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  )
}
