import { describe, it, expect } from 'vitest'
import { cn, stripHtml } from '@/lib/utils'

describe('Utils Performance Benchmarks', () => {
  it('cn should be extremely fast for multiple classes', () => {
    const start = performance.now()
    for (let i = 0; i < 1000; i++) {
      cn('class-1', 'class-2', { 'class-3': true }, ['class-4', 'class-5'])
    }
    const end = performance.now()
    const duration = end - start
    
    // 1000 execuções devem levar menos de 50ms em ambiente de teste
    expect(duration).toBeLessThan(50)
    console.log(`cn (1000 runs): ${duration.toFixed(4)}ms`)
  })

  it('stripHtml should handle large strings efficiently', () => {
    const largeHtml = '<div>' + '<p>Texto de teste</p>'.repeat(100) + '</div>'
    const start = performance.now()
    const result = stripHtml(largeHtml)
    const end = performance.now()
    const duration = end - start

    expect(result).not.toContain('<p>')
    expect(duration).toBeLessThan(10) // Deve processar em menos de 10ms
    console.log(`stripHtml (large string): ${duration.toFixed(4)}ms`)
  })
})
