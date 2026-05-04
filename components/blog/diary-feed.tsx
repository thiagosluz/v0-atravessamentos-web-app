"use client"

import { motion } from "motion/react"
import { type BlogPost, formatDate } from "@/lib/mock-data"
import Link from "next/link"
import { ArrowUpRight, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

import { type Category } from "@/lib/actions/categories"

interface DiaryFeedProps {
  posts: (BlogPost & { slug: string })[]
  categories: Category[]
}

export function DiaryFeed({ posts, categories }: DiaryFeedProps) {
  return (
    <div className="relative">
      {/* Linha do tempo vertical */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-border to-transparent" />

      <div className="space-y-0">
        {posts.map((post, index) => (
          <DiaryEntry key={post.id} post={post} index={index} categories={categories} />
        ))}
      </div>
    </div>
  )
}

function DiaryEntry({ 
  post, 
  index, 
  categories 
}: { 
  post: BlogPost & { slug: string }; 
  index: number;
  categories: Category[];
}) {
  const href = `/diario/${post.slug ?? post.id}`

  const getCategoryColor = (catName: string) => {
    const cat = categories.find(c => c.name === catName)
    const color = cat?.color || "primary"
    return `bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 border border-${color}-500/20`
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative pl-8 py-10 border-b border-border/50 last:border-0"
    >
      {/* Ponto na linha */}
      <div className="absolute left-0 top-[2.6rem] h-2.5 w-2.5 rounded-full border-2 border-primary bg-background -translate-x-[4.5px] group-hover:bg-primary transition-colors duration-300" />

      <Link href={href} className="block">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">

          {/* Coluna principal */}
          <div className="flex-1 min-w-0">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span
                className={cn(
                  "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
                  getCategoryColor(post.category)
                )}
              >
                {post.category}
              </span>
              <time className="text-xs text-foreground/50 tabular-nums">
                {formatDate(post.date)}
              </time>
              <span className="inline-flex items-center gap-1 text-xs text-foreground/40">
                <Clock className="h-3 w-3" />
                {post.readTime}
              </span>
            </div>

            {/* Título — tipografia display generosa */}
            <h2 className="font-display text-2xl md:text-3xl font-bold leading-[1.1] tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 text-balance mb-3">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-foreground/65 leading-relaxed line-clamp-3 text-sm md:text-base text-pretty">
              {post.excerpt}
            </p>

            {/* CTA */}
            <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary group-hover:gap-3 transition-all duration-300">
              Ler entrada <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Imagem de capa — lateral no desktop */}
          {post.coverImage && (
            <div className="w-full md:w-48 lg:w-56 shrink-0">
              <div className="aspect-[4/3] md:aspect-square overflow-hidden rounded-2xl border-organic bg-muted">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover brightness-95 saturate-95 group-hover:brightness-105 group-hover:saturate-105 transition-filter duration-500"
                />
              </div>
            </div>
          )}

        </div>
      </Link>
    </motion.article>
  )
}
