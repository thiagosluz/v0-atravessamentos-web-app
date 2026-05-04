"use client"

import { motion } from "motion/react"
import { ArrowUpRight, Clock } from "lucide-react"
import { type BlogPost, formatDate } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import Link from "next/link"

const categoryStyles: Record<string, string> = {
  Reflexão: "bg-primary/15 text-primary",
  Evento: "bg-accent/20 text-accent",
  Manifesto: "bg-foreground text-background",
  Notícia: "bg-[var(--ouro)]/30 text-foreground",
}

interface BlogSectionProps {
  initialPosts: (BlogPost & { slug?: string })[]
}

export function BlogSection({ initialPosts }: BlogSectionProps) {
  const [featured, ...rest] = initialPosts

  return (
    <section
      id="diario"
      className="relative scroll-mt-24 bg-secondary py-20 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary" />
              Diário de travessia
            </span>
            <h2 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl text-balance">
              Palavras que atravessam.
            </h2>
            <p className="mt-5 text-lg text-foreground/75 md:text-xl">
              Ensaios, manifestos, crônicas e chamadas para os encontros que estão por vir.
            </p>
          </div>
          <Link
            href="/diario"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/85"
          >
            Ler o diário completo
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-12">
          {/* Featured */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="group md:col-span-7"
          >
            <Link href={`/diario/${(featured as any).slug ?? featured.id}`} className="block overflow-hidden rounded-3xl bg-background">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={featured.coverImage || "/placeholder.svg"}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 font-semibold uppercase tracking-wide",
                      categoryStyles[featured.category],
                    )}
                  >
                    {featured.category}
                  </span>
                  <span className="text-foreground/60">{formatDate(featured.date)}</span>
                  <span className="inline-flex items-center gap-1 text-foreground/60">
                    <Clock className="h-3 w-3" />
                    {featured.readTime}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold leading-tight tracking-tight md:text-4xl text-balance">
                  {featured.title}
                </h3>
                <p className="mt-3 text-base text-foreground/75 md:text-lg text-pretty">
                  {featured.excerpt}
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Ler texto completo
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          </motion.article>

          {/* Sidebar list */}
          <div className="space-y-4 md:col-span-5">
            {rest.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group"
              >
                <Link
                  href={`/diario/${(post as any).slug ?? post.id}`}
                  className="flex gap-4 overflow-hidden rounded-2xl bg-background p-4 transition-colors hover:bg-background/70"
                >
                  <div className="relative aspect-square h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                    <img
                      src={post.coverImage || "/placeholder.svg"}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        categoryStyles[post.category],
                      )}
                    >
                      {post.category}
                    </span>
                    <h3 className="mt-1.5 font-display text-base font-bold leading-snug tracking-tight line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-1 text-xs text-foreground/60">
                      {formatDate(post.date)} · {post.readTime}
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
