import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock de variáveis de ambiente do Next.js se necessário
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key'
