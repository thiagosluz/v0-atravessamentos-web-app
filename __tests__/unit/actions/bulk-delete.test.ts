import { describe, it, expect, vi, beforeEach } from 'vitest'
import { deleteProjectsBulk } from '@/lib/actions/projects-admin'
import { deleteBlogPostsBulk } from '@/lib/actions/blog-admin'
import { deleteMembersBulk } from '@/lib/actions/members-admin'
import { createAdminClient } from '@/lib/supabase/admin'

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('@/lib/utils/auth-guard', () => ({
  ensureAdmin: vi.fn().mockResolvedValue({ id: 'user_123' }),
}))

describe('Bulk Delete Actions', () => {
  let mockError: any = null
  let mockSupabase: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockError = null

    mockSupabase = {
      from: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      in: vi.fn().mockImplementation(() =>
        Promise.resolve({ data: null, error: mockError })
      ),
      storage: {
        from: vi.fn().mockReturnThis(),
        remove: vi.fn().mockResolvedValue({ error: null }),
      },
    }

    ;(createAdminClient as any).mockReturnValue(mockSupabase)
  })

  describe('deleteProjectsBulk', () => {
    it('deve excluir projetos em massa com sucesso', async () => {
      const ids = ['id-1', 'id-2', 'id-3']
      const result = await deleteProjectsBulk(ids)

      expect(result.success).toBe(true)
      expect(result.data?.deletedCount).toBe(3)
      expect(mockSupabase.from).toHaveBeenCalledWith('projects')
      expect(mockSupabase.in).toHaveBeenCalledWith('id', ids)
    })

    it('deve retornar erro para lista vazia', async () => {
      const result = await deleteProjectsBulk([])
      expect(result.success).toBe(false)
      expect(result.error).toContain('Nenhum ID')
    })

    it('deve propagar erro do Supabase', async () => {
      mockError = { message: 'Permission denied' }
      const result = await deleteProjectsBulk(['id-1'])
      expect(result.success).toBe(false)
      expect(result.error).toBe('Permission denied')
    })
  })

  describe('deleteBlogPostsBulk', () => {
    it('deve excluir posts em massa com sucesso', async () => {
      const ids = ['post-1', 'post-2']
      const result = await deleteBlogPostsBulk(ids)

      expect(result.success).toBe(true)
      expect(result.data?.deletedCount).toBe(2)
      expect(mockSupabase.from).toHaveBeenCalledWith('blog_posts')
      expect(mockSupabase.in).toHaveBeenCalledWith('id', ids)
    })

    it('deve retornar erro para lista vazia', async () => {
      const result = await deleteBlogPostsBulk([])
      expect(result.success).toBe(false)
      expect(result.error).toContain('Nenhum ID')
    })

    it('deve propagar erro do Supabase', async () => {
      mockError = { message: 'Table not found' }
      const result = await deleteBlogPostsBulk(['post-1'])
      expect(result.success).toBe(false)
      expect(result.error).toBe('Table not found')
    })
  })

  describe('deleteMembersBulk', () => {
    it('deve excluir membros em massa com cleanup de avatares', async () => {
      // Mock para select de avatares
      mockSupabase.in = vi.fn()
        .mockResolvedValueOnce({
          data: [
            { avatar: 'https://xxx.supabase.co/storage/avatars/abc.jpg' },
            { avatar: null },
            { avatar: 'https://external.com/photo.jpg' },
          ],
          error: null,
        })
        .mockResolvedValueOnce({ data: null, error: null })

      const ids = ['member-1', 'member-2', 'member-3']
      const result = await deleteMembersBulk(ids)

      expect(result.success).toBe(true)
      expect(result.data?.deletedCount).toBe(3)
      // Verificar que avatares do storage foram removidos
      expect(mockSupabase.storage.from).toHaveBeenCalledWith('avatars')
      expect(mockSupabase.storage.remove).toHaveBeenCalledWith(['abc.jpg'])
    })

    it('deve retornar erro para lista vazia', async () => {
      const result = await deleteMembersBulk([])
      expect(result.success).toBe(false)
      expect(result.error).toContain('Nenhum ID')
    })

    it('deve propagar erro do Supabase na deleção', async () => {
      // Mock para select de avatares (sucesso) + delete (erro)
      mockSupabase.in = vi.fn()
        .mockResolvedValueOnce({ data: [], error: null })
        .mockResolvedValueOnce({ data: null, error: { message: 'FK violation' } })

      const result = await deleteMembersBulk(['member-1'])
      expect(result.success).toBe(false)
      expect(result.error).toBe('FK violation')
    })
  })
})
