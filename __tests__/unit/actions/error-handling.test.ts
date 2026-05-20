import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createProject } from '@/lib/actions/projects-admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { ensureAdmin } from '@/lib/utils/auth-guard'

// Mock de dependências
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn()
}))

vi.mock('@/lib/utils/auth-guard', () => ({
  ensureAdmin: vi.fn()
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}))

describe('Server Actions Error Handling', () => {
  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(createAdminClient as any).mockReturnValue(mockSupabase)
    ;(ensureAdmin as any).mockResolvedValue(true)
  })

  it('should return Zod validation error for invalid data', async () => {
    const formData = new FormData()
    // Título faltando (obrigatório no schema)
    formData.append('category', 'Teste')
    
    const result = await createProject(formData)
    expect(result).toHaveProperty('error')
    expect(result.error).toContain('Dados inválidos')
  })

  it('should propagate Supabase error message via safeAction', async () => {
    const formData = new FormData()
    formData.append('title', 'Projeto Teste')
    formData.append('category', 'Educação')
    formData.append('excerpt', 'Resumo longo o suficiente para passar na validação do schema Zod.')
    formData.append('description', 'Descrição longa')
    formData.append('year', '2024')
    formData.append('status', 'Rascunho')

    mockSupabase.single.mockResolvedValue({
      data: null,
      error: { message: 'Failed to fetch', code: 'PGRST301' }
    })

    const result = await createProject(formData)
    // safeAction propaga a mensagem original do erro do Supabase
    expect(result.error).toBe('Failed to fetch')
  })

  it('should catch unexpected exceptions', async () => {
    const formData = new FormData()
    formData.append('title', 'Projeto Teste')
    formData.append('category', 'Educação')
    formData.append('year', '2024')
    formData.append('status', 'Rascunho')

    ;(ensureAdmin as any).mockRejectedValue(new Error('Auth failed'))

    const result = await createProject(formData)
    expect(result.error).toBe('Auth failed')
  })
})
