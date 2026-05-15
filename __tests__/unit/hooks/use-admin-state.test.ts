import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAdminState } from '@/hooks/admin/use-admin-state'
import { useToast } from '@/hooks/use-toast'
import * as projectsAdmin from '@/lib/actions/projects-admin'

// Mocks
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({ toast: vi.fn() }))
}))

vi.mock('@/lib/actions/projects-admin', () => ({
  deleteProject: vi.fn()
}))

vi.mock('@/lib/actions/members-admin', () => ({
  deleteMember: vi.fn()
}))

vi.mock('@/lib/actions/blog-admin', () => ({
  deleteBlogPost: vi.fn()
}))

describe('useAdminState Hook', () => {
  const mockProps = {
    user: { id: 'u1', email: 'test@test.com', user_metadata: {} } as any,
    projectsData: { data: [{ id: 'p1', title: 'Proj 1' }] as any, count: 1 },
    membersData: { data: [] as any, count: 0 },
    blogPostsData: { data: [] as any, count: 0 },
    initialCategories: [],
    siteSettings: {} as any,
    currentPage: { projects: 1, members: 1, blog: 1 }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with provided data', () => {
    const { result } = renderHook(() => useAdminState(mockProps))
    expect(result.current.localProjects).toHaveLength(1)
    expect(result.current.active).toBe('overview')
  })

  it('should change active tab', () => {
    const { result } = renderHook(() => useAdminState(mockProps))
    act(() => {
      result.current.setActive('projects')
    })
    expect(result.current.active).toBe('projects')
  })

  it('should handle optimistic project creation', () => {
    const { result } = renderHook(() => useAdminState(mockProps))
    const newProject = { id: 'p2', title: 'New Proj' } as any
    
    act(() => {
      result.current.handleProjectSuccess(newProject, false)
    })
    
    expect(result.current.localProjects).toHaveLength(2)
    expect(result.current.localProjects[0]).toEqual(newProject)
  })

  it('should trigger delete confirmation', () => {
    const { result } = renderHook(() => useAdminState(mockProps))
    
    act(() => {
      result.current.handleDeleteTrigger('project', 'p1')
    })
    
    expect(result.current.deleteConfirmation).toEqual({ type: 'project', id: 'p1' })
  })

  it('should successfully delete a project', async () => {
    const mockToast = vi.fn()
    ;(useToast as any).mockReturnValue({ toast: mockToast })
    ;(projectsAdmin.deleteProject as any).mockResolvedValue({ success: true })

    const { result } = renderHook(() => useAdminState(mockProps))
    
    act(() => {
      result.current.handleDeleteTrigger('project', 'p1')
    })

    await act(async () => {
      await result.current.confirmDelete()
    })

    expect(result.current.localProjects).toHaveLength(0)
    expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Item excluído com sucesso' }))
  })
})
