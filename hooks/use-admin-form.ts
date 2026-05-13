import * as React from "react"
import { useToast } from "@/hooks/use-toast"

interface ExecuteActionOptions<T> {
  /**
   * A função assíncrona que realiza a mutação no backend.
   */
  actionFn: () => Promise<{ error?: string; [key: string]: any }>
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

      if (result?.error) {
        setError(result.error)
        setPending(false)
        return
      }

      const optimisticData = options.onSuccessCallback(result)
      const message = options.successMessage(optimisticData)

      toast({
        title: message.title,
        description: message.description,
      })
      
      options.onComplete(optimisticData)
    } catch (err: any) {
      setError(err.message || "Erro inesperado")
    } finally {
      // O pending false é garantido pelo finally
      setPending(false)
    }
  }

  return { executeAction, pending, error, setError }
}
