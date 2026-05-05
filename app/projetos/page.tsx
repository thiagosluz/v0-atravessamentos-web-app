import { getCategories } from "@/lib/actions/categories"
import { getSiteSettings } from "@/lib/actions/settings"
import { getFilteredProjects } from "@/lib/actions/projects"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { TimelineSection } from "@/components/projects/timeline-section"
import { ProjectFilters } from "@/components/projects/project-filters"
import { type Project } from "@/lib/mock-data"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Projetos — Atravessamentos",
  description: "Uma linha do tempo das nossas investigações artísticas, produções audiovisuais e ações educativas.",
  openGraph: {
    title: "Projetos — Atravessamentos",
    description: "Conheça as obras e travessias do coletivo ao longo dos anos.",
  },
}

interface ProjectsPageProps {
  searchParams: Promise<{ categoria?: string; q?: string }>
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams
  const category = params.categoria ?? ""
  const q = params.q ?? ""

  const [projects, categories, settings] = await Promise.all([
    getFilteredProjects({
      category: category || undefined,
      q: q || undefined,
    }),
    getCategories("project"),
    getSiteSettings(),
  ])

  // Agrupar por ano
  const groupedProjects = projects.reduce((acc, project) => {
    const year = project.year
    if (!acc[year]) acc[year] = []
    acc[year].push(project)
    return acc
  }, {} as Record<number, Project[]>)

  const years = Object.keys(groupedProjects)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="pt-32 pb-24">
        <div className="container mx-auto max-w-6xl px-4 md:px-8">

          {/* Botão Voltar */}
          <div className="mb-10">
            <Link
              href="/#projetos"
              className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors group"
            >
              <ArrowUpRight className="h-4 w-4 rotate-[225deg] transition-transform group-hover:-translate-x-0.5" />
              Voltar para o início
            </Link>
          </div>

          {/* Cabeçalho editorial */}
          <header className="max-w-3xl mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-6">
              <span className="h-px w-8 bg-primary" />
              Arquivo do Coletivo
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.02] mb-6">
              Arquivo de{" "}
              <em className="not-italic text-primary">Travessias</em>.
            </h1>
            <p className="text-lg md:text-xl text-foreground/65 leading-relaxed">
              Nossa história contada através de obras, pesquisas e ações.{" "}
              <span className="text-foreground/40">{projects.length} {projects.length === 1 ? "projeto" : "projetos"} no arquivo.</span>
            </p>
          </header>

          {/* Filtros */}
          <ProjectFilters
            categories={categories}
            currentCategory={category}
            currentQ={q}
            total={projects.length}
          />

          {/* Timeline */}
          {projects.length > 0 ? (
            <div className="relative">
              {/* Linha vertical */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-accent/30 to-transparent md:-translate-x-1/2" />

              <div className="space-y-32 relative">
                {years.map((year, index) => (
                  <TimelineSection
                    key={year}
                    year={year}
                    projects={groupedProjects[year]}
                    isEven={index % 2 === 0}
                    categories={categories}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-foreground/40 text-lg">
                Nenhum projeto encontrado
                {q ? ` para "${q}"` : ""}
                {category ? ` na categoria ${category}` : ""}.
              </p>
            </div>
          )}

        </div>
      </main>

      <SiteFooter settings={settings} />
    </div>
  )
}
