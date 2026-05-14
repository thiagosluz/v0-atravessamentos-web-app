-- Adiciona campo de tags aos posts do diário
-- Data: 2026-05-14

ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Comentário para documentação no banco
COMMENT ON COLUMN public.blog_posts.tags IS 'Palavras-chave para recomendações de afinidade';
