import * as React from "react"
import { useToast } from "@/hooks/use-toast"

interface ExecuteActionOptions<T> {
  /**
   * A função assíncrona que realiza a mutação no backend.
   * Suporta tanto o contrato legado { error?: string } quanto o novo { success, error?, data? }.
   */
  actionFn: () => Promise<{ error?: string; success?: boolean; data?: any; [key: string]: any }>
  /**
   * Função para gerar o objeto otimista caso a mutação tenha sucesso.
   * Recebe o retorno do backend (útil para pegar IDs recém-criados).
   */
  onSuccessCallback: (result: any) => T
  /**
   * Retorna os textos do toast de sucesso com base nos dados gerados.
   */
  successMessage: (data: T) => { title: string; description: string }
  /**
   * Callback disparado no final (útil para propagar o estado otimista e fechar o modal).
   */
  onComplete: (data: T) => void
}

export function useAdminForm() {
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const { toast } = useToast()

  const executeAction = async <T>(options: ExecuteActionOptions<T>) => {
    setPending(true)
    setError(null)

    try {
      const result = await options.actionFn()

      // Suporta ambos os contratos:
      // Legado: { error?: string }
      // safeAction: { success: boolean, error?: string, data?: T }
      const hasError = result?.error || (result?.success === false)

      if (hasError) {
        const errorMessage = result.error || "Erro inesperado ao processar a ação."
        setError(errorMessage)
        toast({
          title: "Erro na operação",
          description: errorMessage,
          variant: "destructive",
        })
        setPending(false)
        return
      }

      // Extrair dados do resultado (suporta ambos os contratos)
      const resultData = result?.data ?? result
      const optimisticData = options.onSuccessCallback(resultData)
      const message = options.successMessage(optimisticData)

      toast({
        title: message.title,
        description: message.description,
      })
      
      options.onComplete(optimisticData)
    } catch (err: any) {
      const errorMessage = err.message || "Erro inesperado"
      setError(errorMessage)
      toast({
        title: "Erro na operação",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setPending(false)
    }
  }

  return { executeAction, pending, error, setError }
}

