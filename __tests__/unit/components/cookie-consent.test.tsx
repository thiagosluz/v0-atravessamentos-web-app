import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { CookieConsent } from '@/components/shared/cookie-consent'

// Mock motion/react to avoid animation issues in tests
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}))

describe('CookieConsent Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should not show immediately', () => {
    render(<CookieConsent />)
    expect(screen.queryByText(/Atravessamos com cookies/i)).toBeNull()
  })

  it('should show after 2 seconds if no consent exists', () => {
    render(<CookieConsent />)
    
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    
    expect(screen.getByText(/Atravessamos com cookies/i)).toBeDefined()
  })

  it('should not show if consent already exists in localStorage', () => {
    localStorage.setItem('cookie-consent', 'accepted')
    render(<CookieConsent />)
    
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    
    expect(screen.queryByText(/Atravessamos com cookies/i)).toBeNull()
  })

  it('should save to localStorage and hide when accepted', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    render(<CookieConsent />)
    
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    const acceptBtn = screen.getByText(/Aceitar e navegar/i)
    
    fireEvent.click(acceptBtn)

    expect(setItemSpy).toHaveBeenCalledWith('cookie-consent', 'accepted')
    
    expect(screen.queryByText(/Atravessamos com cookies/i)).toBeNull()
  })
})
