import { describe, it, expect, vi, beforeEach } from 'vitest'
import { globalSearch } from '@/lib/actions/search'
import { createAdminClient } from '@/lib/supabase/admin'

// Mock do Supabase
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn()
}))

describe('globalSearch logic', () => {
  const mockSupabase: any = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    // Torna o mock "thenable" para o Promise.all
    then: vi.fn().mockImplementation((onFulfilled) => {
      return Promise.resolve({ data: [] }).then(onFulfilled)
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(createAdminClient as any).mockReturnValue(mockSupabase)
  })

  it('should return empty array for short queries', async () => {
    const results = await globalSearch('a')
    expect(results).toEqual([])
    expect(createAdminClient).not.toHaveBeenCalled()
  })

  it('should call supabase with correct filters for authenticated users', async () => {
    await globalSearch('teste', true)
    
    // Verifica se NÃO chamou .eq("status", "Publicado") pois é admin
    expect(mockSupabase.eq).not.toHaveBeenCalledWith('status', 'Publicado')
  })

  it('should call supabase with public filters for non-admin users', async () => {
    await globalSearch('teste', false)
    
    // Verifica se chamou .eq("status", "Publicado") para projetos e blog
    expect(mockSupabase.eq).toHaveBeenCalledWith('status', 'Publicado')
  })

  it('should handle special characters in query', async () => {
    await globalSearch('teste@#$', true)
    expect(mockSupabase.or).toHaveBeenCalledWith(expect.stringContaining('%teste@#$%'))
  })
})
