-- ATRAVESSAMENTOS GALLERY SCHEMA
-- Data: 2026-05-08
-- Descrição: Tabelas para o Acervo Digital, Galeria Masonry e Curadoria de Exposições.

-- 1. ATUALIZAR CATEGORIAS PARA SUPORTAR TAGS DE GALERIA
-- Removemos a constraint antiga e adicionamos a nova com 'gallery_tag'
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_type_check;
ALTER TABLE categories ADD CONSTRAINT categories_type_check 
CHECK (type IN ('post', 'project', 'member', 'gallery_tag'));

-- 2. TABELA DE ATIVOS DA GALERIA (ACERVO)
CREATE TABLE IF NOT EXISTS gallery_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT, -- Título Poético
    description TEXT, -- Texto de contexto/manifesto
    image_url TEXT NOT NULL,
    location TEXT, -- Cidade/Estado
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL, -- Link opcional com projeto
    tags TEXT[] DEFAULT '{}', -- Array de nomes de tags (dinâmicas)
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE EXPOSIÇÕES (CURADORIA)
CREATE TABLE IF NOT EXISTS exhibitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT, -- Introdução poética da exposição
    cover_image TEXT,
    asset_ids UUID[] DEFAULT '{}', -- Array de referências para gallery_assets
    status TEXT DEFAULT 'Rascunho' CHECK (status IN ('Publicado', 'Rascunho')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RLS (ROW LEVEL SECURITY)
ALTER TABLE gallery_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública
CREATE POLICY "Leitura pública de ativos da galeria" ON gallery_assets FOR SELECT USING (true);
CREATE POLICY "Leitura pública de exposições" ON exhibitions FOR SELECT USING (status = 'Publicado');

-- 5. TRIGGER PARA UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gallery_assets_updated_at BEFORE UPDATE ON gallery_assets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_exhibitions_updated_at BEFORE UPDATE ON exhibitions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
