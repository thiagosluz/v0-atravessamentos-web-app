import { getRelatedPosts } from "@/lib/actions/blog-posts"
import { formatDate, type BlogPost } from "@/lib/mock-data"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface RelatedReadingsProps {
  currentPostId: string
  category: string
  tags?: string[]
}

const categoryStyles: Record<string, string> = {
  Reflexão: "bg-primary/10 text-primary border-primary/20",
  Evento: "bg-accent/10 text-accent border-accent/20",
  Manifesto: "bg-foreground/5 text-foreground border-foreground/10",
  Notícia: "bg-[var(--ouro)]/10 text-foreground border-[var(--ouro)]/20",
}

export async function RelatedReadings({ currentPostId, category, tags = [] }: RelatedReadingsProps) {
  const relatedPosts = await getRelatedPosts(currentPostId, category, tags, 3)

  if (relatedPosts.length === 0) return null

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 md:px-8 border-t border-border mt-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Atravessamentos <span className="italic font-light text-primary">relacionados</span>
        </h2>
        <Link 
          href="/#diario" 
          className="text-sm font-medium text-foreground/50 hover:text-primary transition-colors flex items-center gap-1.5"
        >
          Ver todo o diário
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link 
            key={post.id} 
            href={`/diario/${(post as any).slug}`}
            className="group flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-4 bg-muted">
              {post.coverImage ? (
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/5">
                  <span className="font-display text-4xl font-black text-primary/10 italic">A</span>
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md",
                  categoryStyles[post.category] ?? "bg-muted text-foreground"
                )}>
                  {post.category}
                </span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col">
              <span className="text-[10px] font-medium text-foreground/40 mb-1.5 uppercase tracking-widest">
                {formatDate(post.date)}
              </span>
              <h3 className="font-display text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/60 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
