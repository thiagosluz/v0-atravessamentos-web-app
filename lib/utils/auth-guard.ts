import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Verifica se o usuário atual está autenticado como administrador.
 * Deve ser chamado no topo de Server Actions que requerem proteção.
 * 
 * @throws {Error} Se o usuário não estiver autenticado.
 * @returns {Promise<User>} O objeto do usuário autenticado.
 */
export async function ensureAdmin() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    console.warn("Tentativa de acesso não autorizado detectada em Server Action.")
    throw new Error("Acesso negado: Autenticação necessária.")
  }

  return user
}
