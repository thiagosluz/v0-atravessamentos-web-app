import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface DiaryPaginationProps {
  currentPage: number
  totalPages: number
  category: string
  q: string
}

function buildURL(page: number, category: string, q: string) {
  const params = new URLSearchParams()
  if (page > 1) params.set("pagina", String(page))
  if (category) params.set("categoria", category)
  if (q) params.set("q", q)
  const qs = params.toString()
  return `/diario${qs ? `?${qs}` : ""}`
}

export function DiaryPagination({ currentPage, totalPages, category, q }: DiaryPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  // Para muitas páginas, mostrar janela deslizante
  const WINDOW = 2
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= WINDOW
  )

  return (
    <nav
      aria-label="Paginação do diário"
      className="mt-16 flex items-center justify-center gap-2"
    >
      {/* Anterior */}
      <Link
        href={buildURL(currentPage - 1, category, q)}
        aria-disabled={currentPage === 1}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors",
          currentPage === 1
            ? "pointer-events-none opacity-30"
            : "hover:border-primary hover:text-primary"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {/* Páginas */}
      {visiblePages.map((page, idx) => {
        const prev = visiblePages[idx - 1]
        const showEllipsis = prev && page - prev > 1

        return (
          <span key={page} className="flex items-center gap-2">
            {showEllipsis && (
              <span className="text-foreground/30 text-sm px-1">…</span>
            )}
            <Link
              href={buildURL(page, category, q)}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                page === currentPage
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground/60 hover:border-primary hover:text-primary"
              )}
            >
              {page}
            </Link>
          </span>
        )
      })}

      {/* Próximo */}
      <Link
        href={buildURL(currentPage + 1, category, q)}
        aria-disabled={currentPage === totalPages}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors",
          currentPage === totalPages
            ? "pointer-events-none opacity-30"
            : "hover:border-primary hover:text-primary"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  )
}
