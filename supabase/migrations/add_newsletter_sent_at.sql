-- Adiciona controle de envio de newsletter na tabela de posts
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS newsletter_sent_at TIMESTAMPTZ DEFAULT NULL;

-- Comentário para documentação
COMMENT ON COLUMN blog_posts.newsletter_sent_at IS 'Data e hora em que a newsletter automática foi disparada para este post';
