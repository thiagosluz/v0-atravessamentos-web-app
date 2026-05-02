"use client"

import { motion } from "motion/react"
import { Quote } from "lucide-react"

export function AboutSection() {
  return (
    <section id="sobre" className="relative scroll-mt-24 py-20 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-12 md:gap-16 md:px-8">
        {/* Left: manifesto text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="md:col-span-7"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Sobre o coletivo
          </span>
          <h2 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl text-balance">
            Habitar as <span className="italic font-light">frestas</span>, romper as fronteiras.
          </h2>

          <div className="mt-10 space-y-6 text-lg leading-relaxed text-foreground/85 md:text-xl">
            <p>
              Atravessamentos é um corpo coletivo. Somos professoras, artistas, pesquisadoras, mães,
              cineastas, dissidentes — gente que se recusou a caber no que estava posto.
            </p>
            <p>
              Nascemos em <strong className="text-foreground">Jataí, sudoeste de Goiás</strong>, no encontro
              entre a sala de aula e a rua, entre o cerrado e a tela. Trabalhamos onde a educação
              encontra a arte, a decolonialidade pisa o chão e a política se faz com afeto.
            </p>
            <p className="relative pl-6 border-l-2 border-primary font-display italic text-foreground">
              <Quote
                className="absolute -left-3 -top-1 h-5 w-5 text-primary bg-background"
                aria-hidden
              />
              Atravessar é escolher a fresta como lugar de escuta. É recusar o centro para criar
              outro centro — coletivo, plural, vivo.
            </p>
            <p>
              Nossas ações se cruzam com a cultura afro-brasileira, com os movimentos feminista e
              LGBTQIAPN+, e com as pedagogias que nascem nas margens. Trabalho lento. Trabalho de
              urgência.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            <Stat number="12" label="anos de travessia" />
            <Stat number="40+" label="projetos realizados" />
            <Stat number="6" label="cidades alcançadas" />
          </div>
        </motion.div>

        {/* Right: collage grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="md:col-span-5"
        >
          <div className="grid h-full grid-cols-6 gap-3 md:gap-4">
            <div className="col-span-4 row-span-2 overflow-hidden border-organic bg-primary/15">
              <img
                src="/placeholder.svg?width=900&height=900&query=community-gathering-people-in-circle-warm-light"
                alt="Encontro do coletivo em roda"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="col-span-2 overflow-hidden rounded-3xl bg-accent/20">
              <img
                src="/placeholder.svg?width=400&height=400&query=hands-painting-bright-colors-close-up-texture"
                alt="Mãos pintando uma obra coletiva"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="col-span-2 overflow-hidden rounded-tl-[3rem] rounded-br-[3rem] bg-[var(--ouro)]/30">
              <img
                src="/placeholder.svg?width=400&height=400&query=typewriter-text-on-paper-vintage-warm-tones"
                alt="Máquina de escrever com texto manifestário"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="col-span-3 overflow-hidden border-organic-3 bg-primary/10">
              <img
                src="/placeholder.svg?width=600&height=400&query=protest-march-banners-flags-people-walking"
                alt="Marcha de protesto com cartazes"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="col-span-3 overflow-hidden rounded-3xl bg-foreground/5">
              <img
                src="/placeholder.svg?width=600&height=400&query=film-camera-clapper-on-set-cinematic-lighting"
                alt="Câmera de cinema em set de filmagem"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="border-t-2 border-foreground/20 pt-3">
      <div className="font-display text-3xl font-bold tracking-tight md:text-4xl">{number}</div>
      <div className="mt-1 text-xs leading-tight text-foreground/70">{label}</div>
    </div>
  )
}
