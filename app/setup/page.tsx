"use client"

import * as React from "react"
import { seedProjects } from "@/lib/actions/seed"
import { Button } from "@/components/ui/button"

export default function SetupPage() {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle")
  const [result, setResult] = React.useState<any>(null)

  async function handleSeed() {
    setStatus("loading")
    try {
      const res = await seedProjects()
      if (res.success) {
        setStatus("success")
        setResult(res)
      } else {
        setStatus("error")
        setResult(res.error)
      }
    } catch (err) {
      setStatus("error")
      setResult(err)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="font-display text-4xl font-bold">Configuração Supabase</h1>
      <p className="max-w-md text-center text-foreground/60">
        Clique no botão abaixo para migrar os dados do arquivo `mock-data.ts` para o seu banco de
        dados no Supabase.
      </p>

      <Button onClick={handleSeed} disabled={status === "loading"} size="lg" className="rounded-full">
        {status === "loading" ? "Migrando..." : "Migrar Dados (Seed)"}
      </Button>

      {status === "success" && (
        <div className="rounded-lg bg-green-500/10 p-4 text-green-600">
          Sucesso! {result.count} projetos migrados.
        </div>
      )}

      {status === "error" && (
        <div className="rounded-lg bg-red-500/10 p-4 text-red-600">
          Erro: {JSON.stringify(result)}
        </div>
      )}

      <a href="/" className="text-sm underline">
        Voltar para a Home
      </a>
    </div>
  )
}
