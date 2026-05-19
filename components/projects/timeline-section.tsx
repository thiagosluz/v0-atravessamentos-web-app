"use client"

import * as React from "react"
import { motion } from "motion/react"
import { type Project } from "@/lib/mock-data"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { SafeHTML } from "@/components/safe-html"

const ORGANIC_SHAPES = ["border-organic", "border-organic-2", "border-organic-3"] as const

import { type Category } from "@/lib/actions/categories"

interface TimelineSectionProps {
  year: number
  projects: Project[]
  isEven: boolean
  categories: Category[]
}

export function TimelineSection({ year, projects, isEven, categories }: TimelineSectionProps) {
  const getCategoryColor = (catName: string) => {
    const cat = categories.find(c => c.name === catName)
    const color = cat?.color || "primary"
    
    if (color === "primary") {
      return "bg-primary/10 text-primary border-primary/20"
    }
    
    return `bg-${color}-500/15 text-${color}-800 dark:text-${color}-400 border-${color}-500/30`
  }

  return (
    <section className="relative">
      {/* Year Marker */}
      <div className="absolute left-0 md:left-1/2 -top-12 md:-translate-x-1/2 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="bg-card border border-border px-6 py-2 rounded-full shadow-xl"
        >
          <span className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {year}
          </span>
        </motion.div>
      </div>

      <div className="space-y-24 md:space-y-32">
        {projects.map((project, index) => {
          const align = index % 2 === 0
            ? (isEven ? "right" : "left")
            : (isEven ? "left" : "right")
          const shape = ORGANIC_SHAPES[index % ORGANIC_SHAPES.length]
          return (
            <ProjectTimelineCard
              key={project.id}
              project={project}
              align={align}
              shape={shape}
              index={index}
              getCategoryColor={getCategoryColor}
            />
          )
        })}
      </div>
    </section>
  )
}

interface ProjectTimelineCardProps {
  project: Project
  align: "left" | "right"
  shape: typeof ORGANIC_SHAPES[number]
  index: number
  getCategoryColor: (catName: string) => string
}

function ProjectTimelineCard({ project, align, shape, index, getCategoryColor }: ProjectTimelineCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center w-full",
        align === "right" ? "md:flex-row-reverse" : "md:flex-row"
      )}
    >
      {/* Spacer — lado vazio no desktop */}
      <div className="hidden md:block w-1/2" />

      {/* Ponto na linha do tempo */}
      <div className="absolute left-4 md:left-1/2 h-4 w-4 rounded-full bg-primary border-4 border-background z-20 md:-translate-x-1/2" />

      {/* Conteúdo */}
      <motion.div
        initial={{ opacity: 0, x: align === "right" ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "w-full md:w-1/2 pl-12 md:pl-0",
          align === "right" ? "md:pr-16 text-left md:text-right" : "md:pl-16 text-left"
        )}
      >
        <Link href={`/projetos/${project.id}`} className="group block">
          {/*
            SOLUÇÃO DEFINITIVA: Nunca aplicar `transform: scale` em filho de
            `overflow: hidden + border-radius` complexo — o navegador cria uma
            GPU layer que ignora o clipping do pai.

            Usamos `filter` (brightness/saturation) como efeito de hover.
            Filters são aplicados DENTRO da layer existente, respeitando o clip.
          */}
          {/* Badge de categoria — fora do clip para não ser cortado */}
          <div className="mb-3">
            <span className={cn(
              "inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm",
              getCategoryColor(project.category)
            )}>
              {project.category}
            </span>
          </div>

          <div
            className={cn(
              "relative mb-6 aspect-video overflow-hidden shadow-2xl",
              "transition-shadow duration-500 group-hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.35)]",
              shape
            )}
          >
            <img
              src={project.coverImage || "/placeholder.svg"}
              alt={project.title}
              className={cn(
                "h-full w-full object-cover",
                "transition-filter duration-500",
                "brightness-90 saturate-90",
                "group-hover:brightness-110 group-hover:saturate-110"
              )}
            />

            {/* Gradiente sutil no hover para profundidade */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          <h3 className="font-display text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>

          <SafeHTML
            content={project.description}
            className="text-foreground line-clamp-3 mb-6 leading-relaxed text-sm md:text-base prose-sm"
          />

          <span
            className={cn(
              "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary",
              "group-hover:gap-4 transition-all duration-300",
              align === "right" ? "md:flex-row-reverse" : ""
            )}
          >
            Explorar projeto <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
      </motion.div>
    </div>
  )
}
