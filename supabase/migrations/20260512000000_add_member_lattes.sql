-- Adicionar coluna lattes_url na tabela members
ALTER TABLE members ADD COLUMN IF NOT EXISTS lattes_url TEXT;
