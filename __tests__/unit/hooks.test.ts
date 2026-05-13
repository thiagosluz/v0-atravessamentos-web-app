import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdminForm } from '@/hooks/use-admin-form';
import { useToast } from '@/hooks/use-toast';

// Mock useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

describe('Hook: useAdminForm', () => {
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as any).mockReturnValue({ toast: mockToast });
  });

  it('deve gerenciar o estado de pending corretamente', async () => {
    const { result } = renderHook(() => useAdminForm());
    
    // Simular uma ação que demora
    const actionFn = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 50)));

    await act(async () => {
      await result.current.executeAction({
        actionFn,
        onSuccessCallback: (r) => r,
        successMessage: () => ({ title: 'Ok', description: 'Ok' }),
        onComplete: vi.fn(),
      });
    });

    expect(result.current.pending).toBe(false);
    expect(actionFn).toHaveBeenCalled();
  });

  it('deve capturar erros da actionFn', async () => {
    const { result } = renderHook(() => useAdminForm());
    
    const actionFn = vi.fn().mockResolvedValue({ error: 'Erro de Banco' });

    await act(async () => {
      await result.current.executeAction({
        actionFn,
        onSuccessCallback: vi.fn(),
        successMessage: vi.fn(),
        onComplete: vi.fn(),
      });
    });

    expect(result.current.error).toBe('Erro de Banco');
    expect(result.current.pending).toBe(false);
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('deve disparar toast e onComplete em caso de sucesso', async () => {
    const { result } = renderHook(() => useAdminForm());
    const onComplete = vi.fn();
    
    const actionFn = vi.fn().mockResolvedValue({ id: 'new-123' });

    await act(async () => {
      await result.current.executeAction({
        actionFn,
        onSuccessCallback: (r) => ({ ...r, optimistic: true }),
        successMessage: (data) => ({ title: 'Sucesso', description: `ID: ${data.id}` }),
        onComplete,
      });
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Sucesso',
      description: 'ID: new-123',
    });
    expect(onComplete).toHaveBeenCalledWith({ id: 'new-123', optimistic: true });
    expect(result.current.error).toBeNull();
  });
});
