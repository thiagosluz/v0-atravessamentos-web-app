import { describe, it, expect } from 'vitest'
import { getCategoryStyle } from '@/lib/utils'
import { type Category } from '@/lib/actions/categories'

describe('getCategoryStyle', () => {
  const mockCategories: Category[] = [
    { id: '1', name: 'Educação', slug: 'educacao', type: 'post', color: 'amber', sort_order: 0, created_at: '' },
    { id: '2', name: 'Artistas', slug: 'artistas', type: 'member', color: 'rose', sort_order: 1, created_at: '' },
  ]

  it('should return primary colors when category is not found', () => {
    const style = getCategoryStyle('NonExistent', mockCategories, 'post')
    expect(style).toContain('bg-primary-500/10') // Default fallback for post
  })

  it('should return correct style for post variant', () => {
    const style = getCategoryStyle('Educação', mockCategories, 'post')
    expect(style).toBe('bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20')
  })

  it('should return correct style for project variant', () => {
    const style = getCategoryStyle('Educação', mockCategories, 'project')
    expect(style).toBe('bg-amber-500 text-white')
  })

  it('should return correct style for member variant', () => {
    const style = getCategoryStyle('Artistas', mockCategories, 'member')
    expect(style).toBe('bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30')
  })

  it('should handle primary color explicitly', () => {
    const categoriesWithPrimary: Category[] = [
      { id: '3', name: 'Geral', slug: 'geral', type: 'project', color: 'primary', sort_order: 0, created_at: '' }
    ]
    const style = getCategoryStyle('Geral', categoriesWithPrimary, 'project')
    expect(style).toBe('bg-primary text-primary-foreground')
  })
})
