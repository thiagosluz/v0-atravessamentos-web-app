"use client"

import { motion } from "motion/react"
import { type Member } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const tagColors: Record<string, string> = {
  Educadoras: "bg-primary/15 text-primary border-primary/30",
  Artistas: "bg-accent/20 text-accent border-accent/30",
  Pesquisadoras: "bg-[var(--ouro)]/25 text-foreground border-[var(--ouro)]/40",
}

const cardShapes = [
  "border-organic",
  "rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-xl rounded-bl-xl",
  "border-organic-2",
  "rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-xl rounded-br-xl",
  "border-organic-3",
  "rounded-3xl",
]

interface MembersSectionProps {
  initialMembers: Member[]
}

export function MembersSection({ initialMembers }: MembersSectionProps) {
  return (
    <section id="coletivo" className="relative scroll-mt-24 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="md:col-span-4"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary" />
              Quem somos
            </span>
            <h2 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl text-balance">
              Um coletivo que se faz de muitas{" "}
              <span className="italic font-light text-primary">vozes</span>.
            </h2>
            <p className="mt-5 text-lg text-foreground/75 md:text-xl">
              Educadoras, artistas e pesquisadoras que tecem juntas as travessias do coletivo.
              Encontre quem caminha conosco.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {Object.keys(tagColors).map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium",
                    tagColors[tag],
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="md:col-span-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
              {initialMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: index * 0.06 }}
                  className="group"
                >
                  <div
                    className={cn(
                      "relative aspect-[4/5] overflow-hidden bg-muted transition-all duration-500",
                      cardShapes[index % cardShapes.length],
                    )}
                  >
                    <img
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="text-xs leading-snug text-background line-clamp-3">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 px-1">
                    <h3 className="font-display text-lg font-bold leading-tight tracking-tight">
                      {member.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-foreground/65">{member.role}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {member.tags.map((tag) => (
                        <span
                          key={tag}
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                            tagColors[tag] || "border-foreground/20 text-foreground/70",
                          )}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
