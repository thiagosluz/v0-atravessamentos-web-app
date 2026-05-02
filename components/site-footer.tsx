"use client"

import { Instagram, Mail, MapPin, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const socials = [
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
  { label: "E-mail", icon: Mail, href: "mailto:contato@atravessamentos.org" },
]

const footerLinks = [
  {
    title: "Coletivo",
    links: ["Sobre", "Manifesto", "Membros", "Imprensa"],
  },
  {
    title: "Ações",
    links: ["Projetos", "Audiovisual", "Educação", "Eventos"],
  },
  {
    title: "Contato",
    links: ["Parcerias", "Editais", "Colabore", "Trabalhe conosco"],
  },
]

export function SiteFooter() {
  return (
    <footer
      id="contato"
      className="relative scroll-mt-24 overflow-hidden bg-foreground text-background"
    >
      {/* Big typographic mark */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-12 select-none text-center">
        <span className="font-display text-[clamp(6rem,22vw,22rem)] font-bold leading-none tracking-[-0.05em] text-stroke text-background opacity-15">
          atravessar
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        {/* Top: CTA + newsletter */}
        <div className="grid gap-12 border-b border-background/15 pb-16 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl text-balance">
              Vamos atravessar <span className="italic font-light">juntas</span>?
            </h2>
            <p className="mt-5 max-w-xl text-lg text-background/75 md:text-xl">
              Receba notícias, editais e ensaios do coletivo direto no seu e-mail. Sem spam, com
              afeto.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col justify-end gap-3 md:col-span-5"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              E-mail
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id="newsletter-email"
                type="email"
                required
                placeholder="seu@email.com"
                className="h-12 flex-1 rounded-full border-background/20 bg-background/5 text-background placeholder:text-background/50 focus-visible:ring-primary"
              />
              <Button
                type="submit"
                size="lg"
                className="h-12 rounded-full bg-primary px-7 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Assinar
              </Button>
            </div>
            <p className="text-xs text-background/55">
              Ao assinar, você concorda com nossa política de privacidade.
            </p>
          </form>
        </div>

        {/* Middle: links + brand */}
        <div className="grid gap-12 py-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <a href="#topo" className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground border-organic">
                <span className="font-display text-2xl font-bold leading-none">A</span>
              </span>
              <span className="font-display text-2xl font-bold tracking-tight">
                atravessamentos
              </span>
            </a>
            <p className="mt-5 max-w-md text-base text-background/70">
              Coletivo de educação, arte e justiça social nascido em Jataí — Goiás.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-background/60">
              <MapPin className="h-4 w-4" />
              Jataí — GO, Brasil · Cerrado
            </p>

            <div className="mt-6 flex gap-2">
              {socials.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-background/20 transition-colors hover:bg-background hover:text-foreground"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title} className="md:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-background/50">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-base text-background/85 transition-colors hover:text-primary"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom: legal */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-background/15 pt-8 text-xs text-background/55 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Coletivo Atravessamentos. Feito com afeto e disputa.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <a href="#" className="hover:text-background">
              Política de privacidade
            </a>
            <a href="#" className="hover:text-background">
              Termos
            </a>
            <a href="#" className="hover:text-background">
              Acessibilidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
