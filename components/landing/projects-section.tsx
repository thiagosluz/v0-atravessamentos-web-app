"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { type Project } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const categoryStyles: Record<string, string> = {
  Audiovisual: "bg-primary text-primary-foreground",
  Educação: "bg-accent text-accent-foreground",
  Evento: "bg-[var(--ouro)] text-foreground",
  Pesquisa: "bg-foreground text-background",
  Editorial: "bg-secondary text-secondary-foreground border border-foreground/20",
}

interface ProjectsSectionProps {
  initialProjects: Project[]
}

export function ProjectsSection({ initialProjects }: ProjectsSectionProps) {
  return (
    <section
      id="projetos"
      className="relative scroll-mt-24 bg-foreground text-background py-20 md:py-32"
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
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--ouro)]">
              <span className="h-px w-8 bg-[var(--ouro)]" />
              Projetos em destaque
            </span>
            <h2 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl text-balance">
              Travessias que viraram obra.
            </h2>
            <p className="mt-5 text-lg text-background/75 md:text-xl">
              Audiovisual, educação popular, eventos e pesquisa. Cada projeto é um exercício de
              escuta, criação e disputa de narrativa.
            </p>
          </div>
          <Link
            href="/projetos"
            className="inline-flex items-center gap-2 rounded-full border border-background/30 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-background hover:text-foreground"
          >
            Ver todos os projetos
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="mt-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {initialProjects
                .filter((p) => p.status === "Publicado")
                .map((project, index) => (
                  <CarouselItem key={project.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <ProjectCard project={project} index={index} />
                  </CarouselItem>
                ))}
            </CarouselContent>
            <div className="mt-8 flex justify-end gap-2">
              <CarouselPrevious
                className="static size-12 translate-x-0 translate-y-0 border-background/30 bg-transparent text-background hover:bg-background hover:text-foreground"
                aria-label="Projeto anterior"
              />
              <CarouselNext
                className="static size-12 translate-x-0 translate-y-0 border-background/30 bg-transparent text-background hover:bg-background hover:text-foreground"
                aria-label="Próximo projeto"
              />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group relative h-full overflow-hidden rounded-3xl bg-background/5 border border-background/10 transition-all hover:border-background/30"
    >
      <Link href={`/projetos/${project.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={project.coverImage || "/placeholder.svg"}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent" />

          <div className="absolute top-4 left-4">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                categoryStyles[project.category],
              )}
            >
              {project.category}
            </span>
          </div>

          <div className="absolute top-4 right-4 text-xs font-mono text-background/70">
            {project.year}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
            <h3 className="font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl text-balance">
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-background/80 line-clamp-2 text-pretty">
              {project.description}
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold opacity-0 transition-opacity group-hover:opacity-100">
              Ver projeto
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
