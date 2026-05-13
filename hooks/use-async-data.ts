"use client"

import * as React from "react"
import { useToast } from "@/hooks/use-toast"
import { type ActionResponse } from "@/types/admin"

interface UseAsyncDataOptions<T> {
  /**
   * Identificador único para este conjunto de dados (opcional).
   * Útil para logs ou futuras implementações de cache local.
   */
  key?: string
  /**
   * Callback de erro customizado (opcional).
   */
  onError?: (error: string) => void
  /**
   * Se deve carregar os dados imediatamente no mount.
   * Default: true
   */
  immediate?: boolean
}

/**
 * Hook customizado para gerenciar o ciclo de vida de dados assíncronos no CMS.
 * Padroniza estados de Loading, Erro e Sucesso.
 */
export function useAsyncData<T>(
  fetchFn: () => Promise<T | ActionResponse<T> | T[]>,
  options: UseAsyncDataOptions<T> = {}
) {
  const { immediate = true, onError } = options
  const [data, setData] = React.useState<T | null>(null)
  const [isLoading, setIsLoading] = React.useState(immediate)
  const [error, setError] = React.useState<string | null>(null)
  const { toast } = useToast()

  const refresh = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      
      // Lidar com o padrão ActionResponse que usamos no projeto
      if (result && typeof result === 'object' && 'success' in result) {
        if (result.success) {
          setData(result.data as T)
        } else {
          const errMsg = result.error || "Ocorreu um erro ao carregar dados."
          setError(errMsg)
          toast({ title: "Erro", description: errMsg, variant: "destructive" })
          if (onError) onError(errMsg)
        }
      } else {
        // Lidar com retornos diretos (arrays ou objetos)
        setData(result as T)
      }
    } catch (err: any) {
      const errMsg = err.message || "Erro inesperado."
      setError(errMsg)
      toast({ title: "Erro de Conexão", description: errMsg, variant: "destructive" })
      if (onError) onError(errMsg)
    } finally {
      setIsLoading(false)
    }
  }, [fetchFn, toast, onError])

  React.useEffect(() => {
    if (immediate) {
      refresh()
    }
  }, [immediate, refresh])

  return { data, isLoading, error, refresh, setData }
}
