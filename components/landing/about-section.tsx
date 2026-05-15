"use client"

import { motion } from "motion/react"
import { Quote } from "lucide-react"
import { OrganicImage } from "@/components/ui/organic-image"
import { type SiteSettings } from "@/lib/actions/settings"

export function AboutSection({ settings }: { settings?: SiteSettings }) {
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

          <div className="mt-10 space-y-6 text-lg leading-relaxed text-foreground md:text-xl">
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
            {settings?.stats_years && (
              <Stat number={settings.stats_years} label="anos de travessia" />
            )}
            {settings?.stats_projects && (
              <Stat number={settings.stats_projects} label="projetos realizados" />
            )}
            {settings?.stats_cities && (
              <Stat number={settings.stats_cities} label="cidades alcançadas" />
            )}
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
            <div className="col-span-4 row-span-2">
              <OrganicImage
                src={settings?.about_images?.[0] || ""}
                fallbackSrc="/images/landing/about-1.png"
                alt="Encontro do coletivo em roda"
                shape="organic"
                overlayColor="primary"
                sizes="(max-width: 768px) 66vw, 40vw"
              />
            </div>
            <div className="col-span-2">
              <OrganicImage
                src={settings?.about_images?.[1] || ""}
                fallbackSrc="/images/landing/about-2.png"
                alt="Mãos pintando uma obra coletiva"
                shape="rounded-3xl"
                overlayColor="accent"
                overlayOpacity={0.2}
                sizes="(max-width: 768px) 33vw, 20vw"
              />
            </div>
            <div className="col-span-2">
              <OrganicImage
                src={settings?.about_images?.[2] || ""}
                fallbackSrc="/images/landing/about-3.png"
                alt="Máquina de escrever com texto manifestário"
                shape="rounded-custom"
                overlayColor="ouro"
                overlayOpacity={0.3}
                sizes="(max-width: 768px) 33vw, 20vw"
              />
            </div>
            <div className="col-span-3">
              <OrganicImage
                src={settings?.about_images?.[3] || ""}
                fallbackSrc="/images/landing/about-4.png"
                alt="Marcha de protesto com cartazes"
                shape="organic-3"
                overlayColor="primary"
                overlayOpacity={0.1}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="col-span-3">
              <OrganicImage
                src={settings?.about_images?.[4] || ""}
                fallbackSrc="/images/landing/about-5.png"
                alt="Câmera de cinema em set de filmagem"
                shape="rounded-3xl"
                overlayColor="foreground"
                overlayOpacity={0.05}
                sizes="(max-width: 768px) 50vw, 25vw"
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
      <div className="mt-1 text-xs leading-tight text-foreground">{label}</div>
    </div>
  )
}
