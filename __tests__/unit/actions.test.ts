import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProject, updateProject, deleteProject } from '@/lib/actions/projects-admin';
import { createBlogPost, updateBlogPost, deleteBlogPost, updateBlogPostStatus } from '@/lib/actions/blog-admin';
import { upsertCategory, deleteCategory, getCategories } from '@/lib/actions/categories';
import { createMember, updateMember, deleteMember } from '@/lib/actions/members-admin';
import { createAdminClient } from '@/lib/supabase/admin';

// Mock Supabase
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}));

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Server Actions - Ultimate Coverage', () => {
  let mockData: any = { id: '123' };
  let mockError: any = null;

  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    storage: {
      from: vi.fn().mockReturnThis(),
      upload: vi.fn().mockResolvedValue({ data: { path: 'test.jpg' }, error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'http://test.com/test.jpg' } }),
    },
    then: vi.fn().mockImplementation((onFulfilled) => {
      return Promise.resolve({ data: mockData, error: mockError }).then(onFulfilled);
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createAdminClient as any).mockReturnValue(mockSupabase);
    mockData = { id: '123' };
    mockError = null;
  });

  describe('Projects Admin', () => {
    const formData = new FormData();
    formData.append('title', 'Projeto');
    formData.append('category', 'Cineclube');
    formData.append('year', '2024');
    formData.append('status', 'Publicado');

    it('Criação com sucesso', async () => {
      mockData = { id: 'p1' };
      const res = await createProject(formData);
      expect(res.success).toBe(true);
    });

    it('Criação com erro de validação', async () => {
      const empty = new FormData();
      const res = await createProject(empty);
      expect(res.error).toBeDefined();
    });

    it('Criação com erro de banco', async () => {
      mockError = { message: 'Erro' };
      const res = await createProject(formData);
      expect(res.error).toContain('Não foi possível criar o projeto');
    });

    it('Update com sucesso', async () => {
      const res = await updateProject('p1', formData);
      expect(res.success).toBe(true);
    });

    it('Update com erro de banco', async () => {
      mockError = { message: 'Erro' };
      const res = await updateProject('p1', formData);
      expect(res.error).toBeDefined();
    });

    it('Delete com sucesso', async () => {
      const res = await deleteProject('p1');
      expect(res.success).toBe(true);
    });
  });

  describe('Blog Admin', () => {
    const formData = new FormData();
    formData.append('title', 'Post');
    formData.append('category', 'Manifesto');
    formData.append('author', 'Autor');
    formData.append('status', 'Publicado');

    it('Criação com sucesso', async () => {
      mockData = { id: 'b1' };
      const res = await createBlogPost(formData);
      expect(res.success).toBe(true);
    });

    it('Lida com slug duplicado', async () => {
      mockError = { code: '23505' };
      const res = await createBlogPost(formData);
      expect(res.error).toContain('Já existe um post');
    });

    it('Update com sucesso', async () => {
      const res = await updateBlogPost('b1', formData);
      expect(res.success).toBe(true);
    });

    it('Delete com sucesso', async () => {
      const res = await deleteBlogPost('b1');
      expect(res.success).toBe(true);
    });

    it('Update Status com sucesso', async () => {
      const res = await updateBlogPostStatus('b1', 'Publicado');
      expect(res.success).toBe(true);
    });
  });

  describe('Categories Admin', () => {
    it('Busca', async () => {
      mockData = [{ id: 'c1' }];
      const res = await getCategories('project');
      expect(res).toHaveLength(1);
    });

    it('Upsert', async () => {
      mockData = { id: 'c1' };
      const res = await upsertCategory({ name: 'C1', type: 'project' });
      expect(res.data).toBeDefined();
    });

    it('Delete', async () => {
      const res = await deleteCategory('c1');
      expect(res.success).toBe(true);
    });
  });

  describe('Members Admin', () => {
    const formData = new FormData();
    formData.append('name', 'Membro');
    formData.append('role', 'Role');
    formData.append('category', 'Membro');

    it('Criação', async () => {
      mockData = { id: 'm1' };
      const res = await createMember(formData);
      expect(res.success).toBe(true);
    });

    it('Update', async () => {
      const res = await updateMember('m1', formData);
      expect(res.success).toBe(true);
    });

    it('Delete', async () => {
      const res = await deleteMember('m1');
      expect(res.success).toBe(true);
    });
  });
});
