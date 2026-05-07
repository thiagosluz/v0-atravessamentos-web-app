"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  totalCount: number
  pageSize: number
  currentPage: number
  paramName: string
}

export function Pagination({ totalCount, pageSize, currentPage, paramName }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(totalCount / pageSize)

  if (totalPages <= 1) return null

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set(paramName, page.toString())
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i)
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pages.push("ellipsis")
    }
  }

  const uniquePages = pages.filter((v, i, a) => v === "ellipsis" ? a[i-1] !== "ellipsis" : true)

  return (
    <div className="flex items-center justify-between border-t border-border p-4 px-6">
      <p className="text-xs text-foreground/50">
        Mostrando <span className="font-medium text-foreground">{(currentPage - 1) * pageSize + 1}</span> a{" "}
        <span className="font-medium text-foreground">{Math.min(currentPage * pageSize, totalCount)}</span> de{" "}
        <span className="font-medium text-foreground">{totalCount}</span> resultados
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg"
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1 px-2">
          {uniquePages.map((page, i) => (
            page === "ellipsis" ? (
              <MoreHorizontal key={`ellipsis-${i}`} className="h-4 w-4 text-foreground/30" />
            ) : (
              <button
                key={`page-${page}`}
                onClick={() => handlePageChange(page as number)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors",
                  currentPage === page
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/60 hover:bg-muted hover:text-foreground"
                )}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg"
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
