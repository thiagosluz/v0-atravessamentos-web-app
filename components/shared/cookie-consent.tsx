"use client"

import * as React from "react"
import { Cookie, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import Link from "next/link"

export function CookieConsent() {
  const [isOpen, setIsOpen] = React.useState(false)
  const shouldReduceMotion = useReducedMotion()

  React.useEffect(() => {
    // Verifica se já existe o consentimento no localStorage
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Pequeno delay para não assustar o usuário logo no carregamento
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setIsOpen(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 50, scale: 0.9 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-40 max-w-sm w-[calc(100vw-3rem)]"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/70 p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/70">
            {/* Efeito de brilho de fundo */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Cookie className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold tracking-tight text-foreground dark:text-white">
                    Atravessamos com cookies
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    Utilizamos cookies para entender como você atravessa nosso conteúdo e melhorar sua experiência. Tudo bem para você?
                  </p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-foreground hover:text-foreground transition-colors"
                  aria-label="Fechar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Button 
                  onClick={handleAccept}
                  className="flex-1 rounded-full bg-primary font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Aceitar e navegar
                </Button>
              </div>
              
              <div className="mt-4 text-center">
                <Link 
                  href="/privacidade" 
                  className="text-[10px] font-medium uppercase tracking-widest text-foreground hover:text-primary transition-colors"
                >
                  Política de Privacidade
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
