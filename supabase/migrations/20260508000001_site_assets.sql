-- Migração: Adicionar campos de Assets Artísticos
-- Data: 2026-05-08

ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
ADD COLUMN IF NOT EXISTS about_images JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN site_settings.about_images IS 'Lista de URLs para a colagem da seção Sobre';
