import { notFound } from "next/navigation"
import { ArrowLeft, Clock, User } from "lucide-react"
import { getBlogPostBySlug, getBlogPostSlugs } from "@/lib/actions/blog-posts"
import { formatDate } from "@/lib/mock-data"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { SiteFooter } from "@/components/site-footer"
import { getSiteSettings } from "@/lib/actions/settings"
import { SafeHTML } from "@/components/safe-html"
import { RelatedReadings } from "@/components/blog/related-readings"

interface Props {
  params: Promise<{ slug: string }>
}

const categoryStyles: Record<string, string> = {
  Reflexão: "bg-primary/15 text-primary",
  Evento: "bg-accent/20 text-accent",
  Manifesto: "bg-foreground text-background",
  Notícia: "bg-[var(--ouro)]/30 text-foreground",
}

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}

  const title = `${post.title} — Diário de Travessia`
  const description = post.excerpt

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.coverImage ? [post.coverImage] : ['/og-image.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.coverImage ? [post.coverImage] : ['/og-image.jpg'],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const [post, settings] = await Promise.all([
    getBlogPostBySlug(slug),
    getSiteSettings(),
  ])

  if (!post) notFound()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mx-auto max-w-4xl px-4 pt-8 md:px-8">
        <Link
          href="/#diario"
          className="inline-flex items-center gap-2 text-sm text-foreground/50 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Diário de Travessia
        </Link>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-4xl px-4 py-12 md:px-8">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
              categoryStyles[post.category] ?? "bg-muted text-foreground",
            )}
          >
            {post.category}
          </span>
          <span className="text-sm text-foreground/50">{formatDate(post.date)}</span>
        </div>

        {/* Title */}
        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.02] tracking-tight text-balance md:text-6xl">
          {post.title}
        </h1>

        {/* Byline */}
        <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-border pb-6 text-sm text-foreground/60">
          <span className="inline-flex items-center gap-1.5">
            <User className="h-4 w-4" />
            {post.author}
          </span>
          {post.readTime && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime} de leitura
            </span>
          )}
        </div>

        {/* Cover */}
        {post.coverImage && (
          <div className="mt-8 overflow-hidden rounded-3xl">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full object-cover aspect-[16/9]"
            />
          </div>
        )}

        {/* Excerpt / Content */}
        <div className="mt-10 space-y-6">
          <p className="text-xl font-medium leading-relaxed text-foreground/80 md:text-2xl">
            {post.excerpt}
          </p>

          {post.content ? (
            <SafeHTML 
              content={post.content} 
              className="prose prose-lg max-w-none text-foreground/80 leading-relaxed"
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center">
              <p className="text-sm text-foreground/50">
                ✏️ O texto completo deste post pode ser editado pelo painel administrativo.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-border pt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                Escrito por
              </p>
              <p className="mt-1 font-display text-xl font-bold">{post.author}</p>
            </div>
            <Link
              href="/#diario"
              className="inline-flex items-center gap-2 rounded-full border border-foreground px-5 py-2.5 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
            >
              <ArrowLeft className="h-4 w-4" />
              Mais textos
            </Link>
          </div>
        </div>
        {/* Related Readings */}
        <RelatedReadings 
          currentPostId={post.id} 
          category={post.category} 
          tags={post.tags} 
        />
      </article>
      <SiteFooter settings={settings} />
    </div>
  )
}
