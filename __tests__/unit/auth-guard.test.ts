import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ensureAdmin } from '@/lib/utils/auth-guard'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Mock Supabase SSR
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}))

// Mock Next.js Headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

describe('Auth Guard - ensureAdmin', () => {
  const mockGetUser = vi.fn()
  const mockSupabase = {
    auth: {
      getUser: mockGetUser,
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(createServerClient as any).mockReturnValue(mockSupabase)
    ;(cookies as any).mockResolvedValue({
      getAll: () => [],
    })
  })

  it('deve retornar o usuário quando autenticado com sucesso', async () => {
    const mockUser = { id: 'user_123', email: 'admin@teste.com' }
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null })

    const user = await ensureAdmin()
    
    expect(user).toEqual(mockUser)
    expect(mockGetUser).toHaveBeenCalled()
  })

  it('deve lançar erro quando não há usuário na sessão', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })

    await expect(ensureAdmin()).rejects.toThrow("Acesso negado: Autenticação necessária.")
  })

  it('deve lançar erro quando o Supabase retorna um erro de auth', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Auth session missing' } })

    await expect(ensureAdmin()).rejects.toThrow("Acesso negado: Autenticação necessária.")
  })
})
