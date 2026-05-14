"use client"

import { motion } from "motion/react"
import { ArrowDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OrganicImage } from "@/components/ui/organic-image"
import { type SiteSettings } from "@/lib/actions/settings"

export function HeroSection({ settings }: { settings?: SiteSettings }) {
  return (
    <section
      id="topo"
      className="relative isolate overflow-hidden pt-24 pb-12 md:min-h-[100svh] md:pt-32 md:pb-20"
    >
      {/* Decorative background shapes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] bg-primary/15 border-organic blur-2xl" />
        <div className="absolute top-1/2 -right-40 h-[26rem] w-[26rem] bg-accent/20 border-organic-2 blur-2xl" />
        <div className="absolute bottom-10 left-1/3 h-72 w-72 bg-[var(--ouro)]/20 border-organic-3 blur-2xl" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-12 md:gap-8 md:px-8">
        {/* Left content */}
        <div className="flex flex-col justify-center md:col-span-7 order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-foreground/15 bg-background/60 px-4 py-1.5 text-xs font-medium uppercase tracking-widest backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>{settings?.location_text || "Coletivo nascido em Jataí — GO"}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative z-20 font-display text-[clamp(2.2rem,11.5vw,9.5rem)] font-bold leading-[0.85] tracking-[-0.04em] md:-mr-48 lg:-mr-64"
          >
            <span className="block">COLETIVO</span>
            <span className="block italic font-light text-primary mt-2 md:[text-shadow:_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff]">
              Atravessamentos
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-foreground/80 md:text-xl text-pretty"
          >
            Corpo coletivo que escuta, sonha e age.
            <span className="block font-display italic text-foreground">
              Travessia, afeto, política e criação.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Button
              size="lg"
              asChild
              className="h-12 rounded-full bg-foreground px-7 text-base font-semibold text-background hover:bg-foreground/90"
            >
              <a href="#projetos">
                Conheça nossas ações
                <ArrowDown className="ml-2 h-4 w-4" />
              </a>
            </Button>
            {/* <Button
              variant="ghost"
              size="lg"
              asChild
              className="h-12 rounded-full px-5 text-base font-semibold text-foreground hover:bg-foreground/5"
            >
              <a href="#sobre">Manifesto</a>
            </Button> */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest text-foreground/60"
          >
            <span>Educação</span>
            <span className="h-1 w-1 rounded-full bg-foreground/40" />
            <span>Arte</span>
            <span className="h-1 w-1 rounded-full bg-foreground/40" />
            <span>Decolonialidade</span>
            <span className="h-1 w-1 rounded-full bg-foreground/40" />
            <span>Justiça social</span>
          </motion.div>
        </div>

        {/* Right visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative md:col-span-5 z-10 order-1 md:order-2"
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md md:max-w-none">
            <div className="relative h-full w-full">
              <OrganicImage
                src={settings?.hero_image_url || ""}
                fallbackSrc="/images/landing/hero.png"
                alt="Colagem artística representando o coletivo Atravessamentos"
                shape="organic"
                priority={true}
              />

            </div>
            {/* Floating accent shapes */}
            <motion.div
              animate={{ rotate: [0, 8, -4, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 hidden h-32 w-32 bg-[var(--ouro)] border-organic-2 md:block"
              aria-hidden
            />
            <motion.div
              animate={{ rotate: [0, -10, 6, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute -bottom-8 -left-8 hidden h-40 w-40 bg-accent border-organic-3 md:block"
              aria-hidden
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
