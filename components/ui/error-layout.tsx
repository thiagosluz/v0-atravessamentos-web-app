"use client"

import * as React from "react"
import { motion } from "motion/react"
import { ArrowLeft, Home, RefreshCcw, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorLayoutProps {
  code: string
  title: string
  message: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
  secondaryAction?: {
    label: string
    onClick?: () => void
    href?: string
  }
}

export function ErrorLayout({ code, title, message, action, secondaryAction }: ErrorLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background flex items-center justify-center p-6">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--ouro)]/10 blur-[120px] animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-accent/5 blur-[150px]" />
      </div>

      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="glass-morphism border-white/10 dark:border-white/5 p-8 md:p-12 text-center rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="relative inline-block mb-6">
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              className="font-display text-8xl md:text-[10rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/20 leading-none"
            >
              {code}
            </motion.span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-primary rounded-full blur-sm opacity-50" />
          </div>

          <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
            {title}
          </h1>
          
          <p className="text-lg text-foreground max-w-md mx-auto mb-10 leading-relaxed font-medium">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {action?.href ? (
              <Button asChild size="lg" className="rounded-full px-8 h-12 bg-primary text-primary-foreground hover:scale-105 transition-transform">
                <Link href={action.href} className="flex items-center gap-2">
                  {code === "404" ? <Search className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                  {action.label}
                </Link>
              </Button>
            ) : action?.onClick ? (
              <Button onClick={action.onClick} size="lg" className="rounded-full px-8 h-12 bg-primary text-primary-foreground hover:scale-105 transition-transform flex items-center gap-2">
                {code === "500" || code === "!!!" ? <RefreshCcw className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                {action.label}
              </Button>
            ) : null}

            {secondaryAction?.href ? (
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 border-foreground/10 hover:bg-foreground/5 transition-colors">
                <Link href={secondaryAction.href} className="flex items-center gap-2">
                  {secondaryAction.label}
                </Link>
              </Button>
            ) : secondaryAction?.onClick ? (
              <Button onClick={secondaryAction.onClick} variant="outline" size="lg" className="rounded-full px-8 h-12 border-foreground/10 hover:bg-foreground/5 transition-colors flex items-center gap-2">
                {secondaryAction.label}
              </Button>
            ) : null}

            <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 border-foreground/10 hover:bg-foreground/5 transition-colors">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar ao início
              </Link>
            </Button>
          </div>
        </div>

        {/* Decorative path indicator */}
        <div className="mt-12 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-foreground">
          <div className="h-[1px] w-8 bg-current" />
          <span>Atravessamentos Interrompidos</span>
          <div className="h-[1px] w-8 bg-current" />
        </div>
      </motion.div>
    </div>
  )
}
