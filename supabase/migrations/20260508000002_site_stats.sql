-- Migração: Adicionar campos de Estatísticas Gerenciáveis
-- Data: 2026-05-08

ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS stats_years TEXT,
ADD COLUMN IF NOT EXISTS stats_projects TEXT,
ADD COLUMN IF NOT EXISTS stats_cities TEXT;

COMMENT ON COLUMN site_settings.stats_years IS 'Número de anos de travessia (ex: 12)';
COMMENT ON COLUMN site_settings.stats_projects IS 'Número de projetos realizados (ex: 40+)';
COMMENT ON COLUMN site_settings.stats_cities IS 'Número de cidades alcançadas (ex: 6)';
