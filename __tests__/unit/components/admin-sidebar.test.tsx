import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AdminSidebar } from '@/components/admin/layout/admin-sidebar'
import { LayoutDashboard, FolderOpen } from 'lucide-react'

describe('AdminSidebar Component', () => {
  const mockNavigation = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'projects', label: 'Projetos', icon: FolderOpen },
  ]
  
  const mockProps = {
    active: 'overview',
    setActive: vi.fn(),
    navigation: mockNavigation,
    user: { email: 'admin@test.com', user_metadata: { full_name: 'Admin User' } } as any,
    projectsCount: 12
  }

  it('should render navigation items', () => {
    render(<AdminSidebar {...mockProps} />)
    expect(screen.getByText('Visão Geral')).toBeDefined()
    expect(screen.getByText('Projetos')).toBeDefined()
  })

  it('should show project count badge', () => {
    render(<AdminSidebar {...mockProps} />)
    expect(screen.getByText('12')).toBeDefined()
  })

  it('should call setActive when a link is clicked', () => {
    render(<AdminSidebar {...mockProps} />)
    fireEvent.click(screen.getByText('Projetos'))
    expect(mockProps.setActive).toHaveBeenCalledWith('projects')
  })

  it('should apply active styles to the current item', () => {
    const { rerender } = render(<AdminSidebar {...mockProps} />)
    const overviewBtn = screen.getByRole('button', { name: /Visão Geral/i })
    
    // Verifica classe de destaque (padrão do shadcn/sidebar ou custom)
    expect(overviewBtn.className).toContain('bg-sidebar-primary')
    expect(overviewBtn.getAttribute('aria-current')).toBe('page')

    // Rerender com outro item ativo
    rerender(<AdminSidebar {...mockProps} active="projects" />)
    const projectsBtn = screen.getByRole('button', { name: /Projetos/i })
    expect(projectsBtn.className).toContain('bg-sidebar-primary')
    expect(projectsBtn.getAttribute('aria-current')).toBe('page')
    expect(overviewBtn.getAttribute('aria-current')).toBeNull()
  })
})
