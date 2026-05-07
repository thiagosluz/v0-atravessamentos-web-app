"use client"

import { useEffect } from "react"
import { ErrorLayout } from "@/components/ui/error-layout"
import { RefreshCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log do erro para monitoramento (Sentry ou console em dev)
    console.error("Erro capturado:", error)
  }, [error])

  return (
    <ErrorLayout
      code="500"
      title="Travessia Interrompida"
      message="Ocorreu um imprevisto técnico no processamento desta página. Nossas conexões estão sendo revisadas."
      action={{
        label: "Tentar novamente",
        onClick: () => reset()
      }}
    />
  )
}
