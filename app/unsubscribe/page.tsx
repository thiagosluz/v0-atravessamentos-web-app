"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { unsubscribeFromNewsletter } from "@/lib/actions/newsletter"
import { Loader2, MailCheck, MailX } from "lucide-react"
import Link from "next/link"

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const handleUnsubscribe = async () => {
    if (!email) return

    setIsSubmitting(true)
    try {
      const result = await unsubscribeFromNewsletter(email)
      if (result.success) {
        setIsSuccess(true)
        toast({
          title: "Descadastramento concluído",
          description: "Você não receberá mais nossos e-mails.",
        })
      } else {
        toast({
          title: "Erro ao descadastrar",
          description: result.error || "Tente novamente mais tarde.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Não foi possível processar seu pedido agora.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-sm md:p-12">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary border-organic">
          {isSuccess ? <MailX className="h-10 w-10" /> : <MailCheck className="h-10 w-10" />}
        </div>

        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          {isSuccess ? "Sentiremos sua falta" : "Confirmar saída"}
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">
          {isSuccess
            ? "Seu e-mail foi removido da nossa lista com sucesso."
            : email 
              ? `Deseja parar de receber as novidades do coletivo no e-mail ${email}?`
              : "Deseja parar de receber as novidades do coletivo?"}
        </p>

        {!isSuccess ? (
          <div className="mt-8 flex w-full flex-col gap-3">
            <Button
              onClick={handleUnsubscribe}
              disabled={isSubmitting || !email}
              size="lg"
              className="h-12 rounded-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Confirmar descadastramento"
              )}
            </Button>
            <Link href="/">
              <Button variant="ghost" className="w-full rounded-full h-12">
                Mudei de ideia, quero ficar
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 w-full">
            <Link href="/">
              <Button variant="outline" className="w-full rounded-full h-12 border-primary text-primary hover:bg-primary/5">
                Voltar para o site
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <React.Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      }>
        <UnsubscribeContent />
      </React.Suspense>
    </main>
  )
}
