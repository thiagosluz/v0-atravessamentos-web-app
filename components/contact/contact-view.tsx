"use client"

import { motion } from "motion/react"
import { ContactForm } from "./contact-form"
import { Instagram, Mail, MapPin, Youtube, MessageCircle } from "lucide-react"
import { SiteSettings } from "@/lib/actions/settings"
import { cn } from "@/lib/utils"

interface ContactViewProps {
  settings: SiteSettings
}

export function ContactView({ settings }: ContactViewProps) {
  return (
    <div className="relative isolate">

      {/* Background Blobs (Opção B - Floating Blobs) */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] aspect-square bg-primary/10 border-organic blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 50, -30, 0],
            rotate: [0, -15, 15, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[20%] -right-[15%] w-[45%] aspect-square bg-accent/10 border-organic-2 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 20, -30, 0],
            y: [0, 30, -50, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute -bottom-[15%] left-[20%] w-[40%] aspect-square bg-[var(--ouro)]/10 border-organic-3 blur-3xl"
        />
      </div>

      <div className="container mx-auto max-w-7xl px-6 md:px-8">

        {/* Header Editorial */}
        <header className="max-w-3xl mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-6"
          >
            <span className="h-px w-8 bg-primary" />
            Canais de Escuta
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="font-display text-5xl md:text-8xl font-bold tracking-tight text-foreground leading-[0.95] mb-8"
          >
            Vamos <br />
            <em className="not-italic text-primary italic font-light">conversar</em>?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl text-foreground/70 leading-relaxed max-w-2xl text-pretty"
          >
            Toda travessia começa com um encontro. Use o formulário ou nossos canais diretos para propor parcerias, tirar dúvidas ou simplesmente dizer olá.
          </motion.p>
        </header>

        <div className="grid gap-12 lg:grid-cols-12 items-start">

          {/* Coluna de Informações (Esquerda) */}
          <div className="lg:col-span-5 space-y-8">

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {/* Card Social */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative bg-background/60 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border border-foreground/5 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
              >
                <div className="absolute top-4 right-6 w-12 h-12 bg-[var(--ouro)]/15 border-organic blur-md opacity-40" />
                <h3 className="font-display text-xs font-bold text-foreground/40 uppercase tracking-[0.2em] mb-6">Redes sociais</h3>
                <div className="flex gap-4 relative z-10">
                  <SocialLink href={settings.instagram_url} icon={Instagram} label="Instagram" />
                  <SocialLink href={settings.youtube_url} icon={Youtube} label="YouTube" />
                  <SocialLink href={settings.whatsapp_number ? `https://wa.me/${settings.whatsapp_number}` : "#"} icon={MessageCircle} label="WhatsApp" />
                </div>
              </motion.div>

              {/* Card Direto */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group relative bg-background/60 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border border-foreground/5 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
              >
                <div className="absolute bottom-4 right-6 w-12 h-12 bg-accent/15 border-organic-2 blur-md opacity-40" />
                <h3 className="font-display text-xs font-bold text-foreground/40 uppercase tracking-[0.2em] mb-6">Contato direto</h3>
                <div className="space-y-4 relative z-10">
                  <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-3 text-lg text-foreground/80 hover:text-primary transition-colors group/link">
                    <div className="size-10 rounded-full bg-foreground/5 flex items-center justify-center shrink-0 transition-colors group-hover/link:bg-primary/10">
                      <Mail className="size-5" />
                    </div>
                    <span className="break-all font-medium leading-tight">{settings.contact_email}</span>
                  </a>
                  <a href={settings.location_url} target="_blank" rel="noopener" className="flex items-start gap-3 text-lg text-foreground/80 hover:text-primary transition-colors group/link">
                    <div className="size-10 rounded-full bg-foreground/5 flex items-center justify-center shrink-0 transition-colors group-hover/link:bg-primary/10">
                      <MapPin className="size-5" />
                    </div>
                    <span className="font-medium">{settings.location_text}</span>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Quote / Info Box */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="p-6 md:p-8 border-l-2 border-primary/20 italic text-foreground/60 leading-relaxed bg-primary/5 rounded-r-[2rem]"
            >
              <p className="text-lg">
                "Atravessar é um gesto político. Respondemos a todas as mensagens com a calma que o encontro humano exige."
              </p>
            </motion.div>
          </div>

          {/* Coluna do Formulário (Direita) - Agora mais Clara */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="relative bg-background p-6 md:p-14 rounded-[3rem] border border-foreground/5 shadow-2xl shadow-foreground/5 overflow-hidden">
              {/* Elementos decorativos internos sutis */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-[60px] -ml-24 -mb-24 pointer-events-none" />

              <h2 className="font-display text-3xl md:text-4xl font-bold mb-10 tracking-tight text-foreground relative z-10">
                Envie sua <span className="italic font-light text-primary">mensagem</span>
              </h2>
              <div className="relative z-10">
                <ContactForm />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

function SocialLink({ href, icon: Icon, label }: { href: string | null; icon: any; label: string }) {
  if (!href || href === "#") return null
  
  return (
    <a 
      href={href} 
      aria-label={label}
      target="_blank"
      rel="noopener"
      className="size-14 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/70 hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110"
    >
      <Icon className="size-6" />
    </a>
  )
}
