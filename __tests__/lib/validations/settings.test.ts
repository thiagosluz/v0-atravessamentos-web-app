import { describe, it, expect } from 'vitest'
import { siteSettingsSchema } from '@/lib/validations'

describe('siteSettingsSchema', () => {
  const validData = {
    seo_title: 'Atravessamentos',
    seo_description: 'Coletivo de arte e educação nas frestas do cerrado.',
    footer_description: 'Um corpo coletivo que escuta, sonha e age.',
    contact_email: 'contato@exemplo.com',
    location_text: 'Jataí, Goiás, Brasil',
    location_url: 'https://maps.google.com',
    hero_image_url: 'https://exemplo.com/hero.jpg',
    about_images: ['https://exemplo.com/1.jpg', 'https://exemplo.com/2.jpg'],
    stats_years: '12',
    stats_projects: '40+',
    stats_cities: '6'
  }

  it('deve validar dados completos e corretos', () => {
    const result = siteSettingsSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('deve aceitar URLs nulas ou vazias (fallback mode)', () => {
    const data = {
      ...validData,
      hero_image_url: '',
      about_images: ['', null, 'https://exemplo.com/valid.jpg']
    }
    const result = siteSettingsSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  it('deve rejeitar URLs malformadas que não sejam vazias', () => {
    const data = {
      ...validData,
      hero_image_url: 'nao-e-uma-url'
    }
    const result = siteSettingsSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('deve aceitar estatísticas opcionais como nulas ou vazias', () => {
    const data = {
      ...validData,
      stats_years: '',
      stats_projects: null,
      stats_cities: '100'
    }
    const result = siteSettingsSchema.safeParse(data)
    expect(result.success).toBe(true)
  })
})
