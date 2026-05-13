import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProject, updateProject, deleteProject } from '@/lib/actions/projects-admin';
import { createBlogPost, updateBlogPost, deleteBlogPost, uploadBlogImage } from '@/lib/actions/blog-admin';
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

// Mock auth-guard
vi.mock('@/lib/utils/auth-guard', () => ({
  ensureAdmin: vi.fn().mockResolvedValue({ id: 'user_123' }),
}));

// Mock broadcast (usado no blog)
vi.mock('@/lib/actions/broadcast', () => ({
  broadcastNews: vi.fn().mockResolvedValue({ success: true }),
}));

describe('Server Actions - Business Logic Coverage', () => {
  let mockData: any = { id: '123' };
  let mockError: any = null;
  let mockStorageError: any = null;

  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockData = { id: '123' };
    mockError = null;
    mockStorageError = null;

    mockSupabase = {
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
        remove: vi.fn().mockResolvedValue({ error: null }),
      },
      then: (onFulfilled: any) => Promise.resolve({ data: mockData, error: mockError }).then(onFulfilled),
    };

    (createAdminClient as any).mockReturnValue(mockSupabase);
  });

  const validFDProject = () => {
    const fd = new FormData();
    fd.append('title', 'Projeto de Teste'); 
    fd.append('category', 'Cineclube'); 
    fd.append('year', '2024'); 
    fd.append('status', 'Publicado');
    fd.append('excerpt', 'Resumo do projeto para testes unitários.');
    fd.append('description', 'Esta é uma descrição de teste para o projeto.');
    return fd;
  };

  const validFDBlog = () => {
    const fd = new FormData();
    fd.append('title', 'Título do Post de Teste'); 
    fd.append('category', 'Manifesto'); 
    fd.append('author', 'Autor de Teste'); 
    fd.append('status', 'Publicado'); 
    fd.append('readTime', '5 min');
    fd.append('excerpt', 'Este é um resumo curto mas suficiente para o teste.');
    fd.append('content', 'Este é o conteúdo do post que deve ter pelo menos vinte caracteres para passar.');
    return fd;
  };

  const validFDMember = () => {
    const fd = new FormData();
    fd.append('name', 'N'); fd.append('role', 'R');
    return fd;
  };

  it('Projetos: CRUD e Validacoes', async () => {
    // Create
    const fd = validFDProject();
    const result = await createProject(fd);
    expect(result.success).toBe(true);
    expect(mockSupabase.from).toHaveBeenCalledWith('projects');
    expect(mockSupabase.insert).toHaveBeenCalled();

    // Update
    const updateResult = await updateProject('123', fd);
    expect(updateResult.success).toBe(true);
    expect(mockSupabase.update).toHaveBeenCalled();
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', '123');

    // Delete
    const deleteResult = await deleteProject('123');
    expect(deleteResult.success).toBe(true);
    expect(mockSupabase.delete).toHaveBeenCalled();

    // Error Case
    mockError = { message: 'DB Error' };
    const errResult = await createProject(fd);
    expect(errResult.success).toBeFalsy();
    expect(errResult.error).toBe('Erro ao salvar no banco de dados.');
  });

  it('Blog: CRUD e Validacoes', async () => {
    // Create
    const fd = validFDBlog();
    const result = await createBlogPost(fd);
    expect(result.success).toBe(true);
    expect(mockSupabase.from).toHaveBeenCalledWith('blog_posts');

    // Duplicate Slug Error
    mockError = { code: '23505' };
    const dupResult = await createBlogPost(fd);
    expect(dupResult.success).toBeFalsy();
    expect(dupResult.error?.toLowerCase()).toContain('já existe');

    // Generic Error
    mockError = { message: 'Unexpected' };
    const errResult = await updateBlogPost('id', fd);
    expect(errResult.success).toBeFalsy();
    expect(errResult.error).toBe('Não foi possível atualizar o post.');
  });

  it('Categorias e Membros: CRUD', async () => {
    // Categories
    const cats = await getCategories('project');
    expect(mockSupabase.from).toHaveBeenCalledWith('categories');
    expect(cats).toEqual(mockData);

    // Members
    const memberResult = await createMember(validFDMember());
    expect(memberResult.success).toBe(true);
    expect(mockSupabase.from).toHaveBeenCalledWith('members');

    // Error
    mockError = { message: 'Delete Failed' };
    const delResult = await deleteMember('id');
    expect(delResult.success).toBeFalsy();
    expect(delResult.error).toBe('Não foi possível excluir o membro.');
  });
});
