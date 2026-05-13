import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, FolderKanban } from "lucide-react"
import { getProjectById, getProjectIds } from "@/lib/actions/projects"
import { formatDate } from "@/lib/mock-data"
import { getProjects } from "@/lib/actions/projects"
import { getCategories } from "@/lib/actions/categories"
import { getSiteSettings } from "@/lib/actions/settings"
import { SiteFooter } from "@/components/site-footer"
import { ProjectsSection } from "@/components/landing/projects-section"
import { SafeHTML } from "@/components/safe-html"
import Link from "next/link"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const ids = await getProjectIds()
  return ids.map((id) => ({ id }))
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const project = await getProjectById(id)
  if (!project) return {}

  const title = `${project.title} — Projetos`
  
  return {
    title,
    description: project.description,
    openGraph: {
      title,
      description: project.description,
      type: 'website',
      images: project.coverImage ? [project.coverImage] : ['/og-image.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: project.description,
      images: project.coverImage ? [project.coverImage] : ['/og-image.jpg'],
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params
  const [project, settings] = await Promise.all([
    getProjectById(id),
    getSiteSettings(),
  ])

  if (!project) notFound()

  const [{ data: allProjects }, categories] = await Promise.all([
    getProjects(),
    getCategories()
  ])
  const related = allProjects.filter((p) => p.id !== id && p.category === project.category).slice(0, 3)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-foreground text-background">
        {/* Back */}
        <div className="mx-auto max-w-7xl px-4 pt-8 md:px-8">
          <Link
            href="/#projetos"
            className="inline-flex items-center gap-2 text-sm text-background/60 transition-colors hover:text-background"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para projetos
          </Link>
        </div>

        {/* Cover image */}
        <div className="relative mx-auto mt-8 max-w-7xl px-4 md:px-8">
          <div className="relative aspect-[21/9] overflow-hidden rounded-3xl">
            <img
              src={project.coverImage || "/placeholder.svg"}
              alt={project.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />

            {/* Category badge */}
            <div className="absolute left-6 bottom-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
                <FolderKanban className="h-3.5 w-3.5" />
                {project.category}
              </span>
            </div>
          </div>
        </div>

        {/* Title block */}
        <div className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-16">
          <div className="flex flex-wrap items-center gap-3 text-sm text-background/55">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {project.year}
            </span>
            <span>·</span>
            <span>{project.status}</span>
            {project.updatedAt && (
              <>
                <span>·</span>
                <span>Atualizado em {formatDate(project.updatedAt)}</span>
              </>
            )}
          </div>
          <h1 className="mt-4 font-display text-5xl font-bold leading-[0.92] tracking-[-0.03em] text-balance md:text-7xl">
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-background/75 leading-relaxed md:text-2xl">
            {project.excerpt}
          </p>
        </div>

        {/* Decorative word */}
        <div className="pointer-events-none select-none overflow-hidden border-t border-background/10 py-6 text-center">
          <span className="font-display text-[clamp(4rem,15vw,12rem)] font-bold leading-none tracking-[-0.05em] text-stroke text-background opacity-10">
            {project.category.toLowerCase()}
          </span>
        </div>
      </div>

      {/* Content area */}
      <div className="mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-24">
        <div className="space-y-12">
          {project.description ? (
            <SafeHTML 
              content={project.description} 
              className="prose prose-lg max-w-none text-foreground/80 leading-relaxed prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-3xl"
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center">
              <p className="text-sm text-foreground/50">
                ✏️ O conteúdo completo deste projeto pode ser editado pelo painel administrativo.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href="/#projetos"
            className="inline-flex items-center gap-2 rounded-full border border-foreground px-5 py-2.5 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
          >
            <ArrowLeft className="h-4 w-4" />
            Ver todos os projetos
          </Link>
        </div>
      </div>

      {/* Related projects */}
      {related.length > 0 && (
        <div className="border-t border-border bg-secondary py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Mais em{" "}
              <span className="text-primary italic font-light">{project.category}</span>
            </h2>
            <div className="mt-10">
              <ProjectsSection initialProjects={related} categories={categories} />
            </div>
          </div>
        </div>
      )}
      <SiteFooter settings={settings} />
    </div>
  )
}
