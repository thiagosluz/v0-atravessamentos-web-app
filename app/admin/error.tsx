"use client"

import * as React from "react"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error("Admin Route Error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9F6F1] p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100 text-red-600 shadow-xl shadow-red-600/10">
        <AlertTriangle className="h-10 w-10" />
      </div>
      
      <h1 className="font-display text-3xl font-black uppercase italic tracking-tighter text-[#333] md:text-4xl">
        Erro no Painel
      </h1>
      
      <p className="mt-4 max-w-md text-lg text-foreground">
        Ocorreu um problema inesperado ao carregar as informações do sistema.
      </p>
      
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-foreground">
          ID do erro: {error.digest}
        </p>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Button
          onClick={() => reset()}
          className="h-12 rounded-full bg-[#A65A3C] px-8 font-bold text-white shadow-lg shadow-[#A65A3C]/20 transition-all hover:bg-[#8B4A30]"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Tentar novamente
        </Button>
        
        <Button
          variant="outline"
          asChild
          className="h-12 rounded-full border-none bg-white px-8 font-bold text-foreground shadow-md transition-all hover:bg-muted"
        >
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Voltar ao Início
          </Link>
        </Button>
      </div>
    </div>
  )
}
