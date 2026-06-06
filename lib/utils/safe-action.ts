"use server"

import { z } from "zod"

export interface SafeActionResult<T = Record<string, any>> {
  success: boolean
  error?: string
  data?: T
}

interface SafeActionOptions<T> {
  action: () => Promise<T>
  errorMap?: Record<string, string>
}

/**
 * Wrapper universal para Server Actions.
 * Encapsula o padrão repetido de try/catch, validação Zod e retorno estruturado.
 *
 * @example
 * export async function createProject(formData: FormData) {
 *   return safeAction({
 *     action: async () => {
 *       await ensureAdmin()
 *       const validated = projectSchema.parse(rawData)
 *       // ... lógica de negócio
 *       return { id: data.id }
 *     },
 *     errorMap: { "23505": "Já existe um item com este título." }
 *   })
 * }
 */
export async function safeAction<T extends Record<string, any>>(
  options: SafeActionOptions<T>
): Promise<SafeActionResult<T>> {
  try {
    const result = await options.action()
    return { success: true, data: result }
  } catch (error: any) {
    // Erros de validação Zod
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Dados inválidos: " + error.issues.map((e) => e.message).join(", "),
      }
    }

    // Erros do Supabase/Postgres (com código)
    if (error?.code && options.errorMap?.[error.code]) {
      return { success: false, error: options.errorMap[error.code] }
    }

    // Erro genérico
    const message =
      error?.message || "Ocorreu um erro inesperado. Tente novamente."

    console.error("[safeAction]", message, error)
    return { success: false, error: message }
  }
}
