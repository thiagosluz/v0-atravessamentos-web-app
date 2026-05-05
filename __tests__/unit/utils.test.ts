import { describe, it, expect } from 'vitest'
import { getCategoryStyle, cn } from '@/lib/utils'
import { type Category } from '@/lib/actions/categories'

describe('cn utility', () => {
  it('should merge tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'bg-red-500', { 'mt-4': true, 'mb-2': false })
    expect(result).toContain('px-2')
    expect(result).toContain('py-1')
    expect(result).toContain('bg-red-500')
    expect(result).toContain('mt-4')
    expect(result).not.toContain('mb-2')
  })

  it('should handle tailwind conflicts with twMerge', () => {
    const result = cn('p-2', 'p-4')
    expect(result).toBe('p-4') // twMerge should prefer the last one
  })
})

describe('getCategoryStyle', () => {
  const mockCategories: Category[] = [
    { id: '1', name: 'Educação', slug: 'educacao', type: 'post', color: 'amber', sort_order: 0, created_at: '' },
    { id: '2', name: 'Artistas', slug: 'artistas', type: 'member', color: 'rose', sort_order: 1, created_at: '' },
    { id: '3', name: 'Geral', slug: 'geral', type: 'project', color: 'primary', sort_order: 2, created_at: '' },
  ]

  it('should return primary colors when category is not found', () => {
    const style = getCategoryStyle('NonExistent', mockCategories, 'post')
    expect(style).toContain('bg-primary-500/10') // Default fallback for post
  })

  it('should return correct style for post variant (default)', () => {
    const style = getCategoryStyle('Educação', mockCategories)
    expect(style).toBe('bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20')
  })

  it('should return correct style for project variant', () => {
    const style = getCategoryStyle('Educação', mockCategories, 'project')
    expect(style).toBe('bg-amber-500 text-white')
  })

  it('should return correct style for project variant with primary color', () => {
    const style = getCategoryStyle('Geral', mockCategories, 'project')
    expect(style).toBe('bg-primary text-primary-foreground')
  })

  it('should return correct style for member variant', () => {
    const style = getCategoryStyle('Artistas', mockCategories, 'member')
    expect(style).toBe('bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30')
  })

  it('should return correct style for member variant with primary color', () => {
    const categoriesWithPrimary: Category[] = [
      { id: '3', name: 'Geral', slug: 'geral', type: 'member', color: 'primary', sort_order: 0, created_at: '' }
    ]
    const style = getCategoryStyle('Geral', categoriesWithPrimary, 'member')
    expect(style).toBe('bg-primary/15 text-primary border-primary/30')
  })
})
