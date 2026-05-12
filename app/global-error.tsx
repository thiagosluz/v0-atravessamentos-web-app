"use client"

import * as Sentry from "@sentry/nextjs"
import { useEffect } from "react"
import { ErrorLayout } from "@/components/ui/error-layout"

// global-error.tsx deve ter tags html e body, pois substitui o RootLayout
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ErrorLayout
          code="!!!"
          title="Falha Sistêmica"
          message="Uma falha crítica interrompeu a estrutura base da plataforma. Estamos trabalhando para restaurar o acesso."
          action={{
            label: "Recarregar aplicação",
            onClick: () => reset()
          }}
        />
      </body>
    </html>
  )
}
