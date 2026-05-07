import React from "react"
import { SafeHTML } from "@/components/safe-html"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface LegalPageLayoutProps {
  title: string
  subtitle?: string
  content: string
  lastUpdate?: string | Date
}

export function LegalPageLayout({
  title,
  subtitle,
  content,
  lastUpdate,
}: LegalPageLayoutProps) {

  // Format date to Brazilian full format
  const formattedDate = lastUpdate
    ? typeof lastUpdate === "string"
      ? format(parseISO(lastUpdate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
      : format(lastUpdate as Date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : null

  return (
    <article className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Voltar ao início
      </Link>
      <header className="mb-12">
        {subtitle && (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {subtitle}
          </span>
        )}
        <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight tracking-tight">
          {title}
        </h1>
      </header>

      <SafeHTML 
        content={content}
        className="prose prose-neutral dark:prose-invert max-w-none 
          prose-headings:font-display prose-headings:tracking-tight 
          prose-a:text-primary hover:prose-a:opacity-80
          prose-p:leading-relaxed prose-li:leading-relaxed
          prose-img:rounded-2xl prose-img:shadow-lg"
        as="section"
      />

      {formattedDate && (
        <div className="mt-12 pt-8 border-t border-border/50 italic text-sm text-foreground/50">
          Última atualização: {formattedDate}
        </div>
      )}
    </article>
  )
}
