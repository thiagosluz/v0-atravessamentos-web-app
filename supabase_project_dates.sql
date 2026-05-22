-- Migração: Adicionando Controle de Ciclo de Vida aos Projetos (Datas Híbridas)
-- Tabela: projects

-- 1. Adicionar novas colunas opcionais para datas precisas
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS start_date DATE NULL,
ADD COLUMN IF NOT EXISTS end_date DATE NULL;

-- 2. Atualizar o cache de schema para o PostgREST (se aplicável)
NOTIFY pgrst, 'reload schema';

-- Observação: A coluna `year` original foi mantida intocada 
-- para garantir compatibilidade reversa total com os projetos legados.
