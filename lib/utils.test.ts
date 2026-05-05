import { describe, it, expect } from 'vitest'
import { formatDate } from './mock-data'

describe('formatDate', () => {
  it('deve formatar uma data ISO corretamente para pt-BR', () => {
    const isoDate = '2025-05-20T10:00:00Z'
    // Nota: toLocaleDateString depende da localidade do sistema em testes, 
    // mas esperamos algo como "20 de maio de 2025"
    const result = formatDate(isoDate)
    expect(result).toContain('20')
    expect(result).toContain('maio')
    expect(result).toContain('2025')
  })

  it('deve lidar com datas inválidas retornando "Invalid Date" ou similar', () => {
    const result = formatDate('invalid-date')
    expect(result).toBe('Invalid Date')
  })
})
