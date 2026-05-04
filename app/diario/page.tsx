import { getPaginatedBlogPosts } from "@/lib/actions/blog-posts"
import { getCategories } from "@/lib/actions/categories"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { DiaryFeed } from "@/components/blog/diary-feed"
import { DiaryFilters } from "@/components/blog/diary-filters"
import { DiaryPagination } from "@/components/blog/diary-pagination"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Diário de Travessia — Atravessamentos",
  description: "Ensaios, manifestos, crônicas e chamadas para os encontros. Palavras que atravessam.",
  openGraph: {
    title: "Diário de Travessia — Atravessamentos",
    description: "Ensaios, manifestos, crônicas e chamadas para os encontros que estão por vir.",
  },
}

const LIMIT = 10

interface DiarioPageProps {
  searchParams: Promise<{ pagina?: string; categoria?: string; q?: string }>
}

export default async function DiarioPage({ searchParams }: DiarioPageProps) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.pagina ?? "1", 10))
  const category = params.categoria ?? ""
  const q = params.q ?? ""

  const [{ posts, total, totalPages }, categories] = await Promise.all([
    getPaginatedBlogPosts({
      page,
      category: category || undefined,
      q: q || undefined,
      limit: LIMIT,
    }),
    getCategories("post"),
  ])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-4xl px-4 md:px-8">

          {/* Botão Voltar */}
          <div className="mb-10">
            <Link
              href="/#diario"
              className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors group"
            >
              <ArrowUpRight className="h-4 w-4 rotate-[225deg] transition-transform group-hover:-translate-x-0.5" />
              Voltar para o início
            </Link>
          </div>

          {/* Cabeçalho editorial */}
          <header className="mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary" />
              Diário de Travessia
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.02]">
              Palavras que<br />atravessam.
            </h1>
            <p className="mt-5 text-lg md:text-xl text-foreground/65 max-w-2xl leading-relaxed">
              Ensaios, manifestos, crônicas e chamadas para os encontros que estão por vir.{" "}
              <span className="text-foreground/40">{total} entradas no arquivo.</span>
            </p>
          </header>

          {/* Filtros de categoria + busca */}
          <DiaryFilters 
            categories={categories}
            currentCategory={category} 
            currentQ={q} 
          />

          {/* Feed linear tipográfico */}
          {posts.length > 0 ? (
            <DiaryFeed posts={posts} />
          ) : (
            <div className="py-24 text-center">
              <p className="text-foreground/40 text-lg">
                Nenhuma entrada encontrada{q ? ` para "${q}"` : ""}{category ? ` em ${category}` : ""}.
              </p>
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <DiaryPagination
              currentPage={page}
              totalPages={totalPages}
              category={category}
              q={q}
            />
          )}

        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
