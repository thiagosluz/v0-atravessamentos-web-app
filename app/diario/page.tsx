import { getPaginatedBlogPosts } from "@/lib/actions/blog-posts"
import { getCategories } from "@/lib/actions/categories"
import { getSiteSettings } from "@/lib/actions/settings"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { DiaryFeed } from "@/components/blog/diary-feed"
import { DiaryFilters } from "@/components/blog/diary-filters"
import { DiaryPagination } from "@/components/blog/diary-pagination"
import type { Metadata } from "next"
import { BackButton } from "@/components/ui/back-button"
import { PageHeader } from "@/components/ui/page-header"
import { BackgroundBlobs } from "@/components/ui/background-blobs"

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

  const [{ posts, total, totalPages }, categories, settings] = await Promise.all([
    getPaginatedBlogPosts({
      page,
      category: category || undefined,
      q: q || undefined,
      limit: LIMIT,
    }),
    getCategories("post"),
    getSiteSettings(),
  ])

  return (
    <div className="min-h-screen bg-background relative isolate">
      <div className="absolute inset-0 -z-10 bg-[url('/paper-texture.png')] opacity-20 pointer-events-none" />
      <BackgroundBlobs />
      <SiteHeader />

      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-4xl px-4 md:px-8">

          {/* Botão Voltar */}
          <div className="mb-10">
            <BackButton href="/#diario" />
          </div>

          {/* Cabeçalho editorial */}
          <PageHeader 
            label="Diário de Travessia"
            title={<>Palavras que<br />atravessam.</>}
            description={`Ensaios, manifestos, crônicas e chamadas para os encontros que estão por vir. ${total} entradas no arquivo.`}
          />

          {/* Filtros de categoria + busca */}
          <DiaryFilters 
            categories={categories}
            currentCategory={category} 
            currentQ={q} 
          />

          {/* Feed linear tipográfico */}
          {posts.length > 0 ? (
            <DiaryFeed posts={posts} categories={categories} />
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

      <SiteFooter settings={settings} />
    </div>
  )
}
