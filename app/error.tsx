"use client"

import { useEffect, useState } from "react"
import * as Sentry from "@sentry/nextjs"
import { ErrorLayout } from "@/components/ui/error-layout"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [eventId, setEventId] = useState<string | null>(null)

  useEffect(() => {
    // Log do erro local
    console.error("Erro capturado:", error)

    // Reportar erro para o Sentry
    Sentry.withScope((scope) => {
      if (error.digest) {
        scope.setTag("digest", error.digest)
      }
      scope.setTag("error_boundary", "route-level")
      const id = Sentry.captureException(error)
      setEventId(id)
    })
  }, [error])

  const handleFeedback = () => {
    if (eventId) {
      Sentry.showReportDialog({ eventId })
    }
  }

  return (
    <ErrorLayout
      code="500"
      title="Travessia Interrompida"
      message="Ocorreu um imprevisto técnico no processamento desta página. Nossas conexões estão sendo revisadas."
      action={{
        label: "Tentar novamente",
        onClick: () => reset()
      }}
      secondaryAction={
        eventId
          ? {
              label: "Reportar problema",
              onClick: handleFeedback,
            }
          : undefined
      }
    />
  )
}
