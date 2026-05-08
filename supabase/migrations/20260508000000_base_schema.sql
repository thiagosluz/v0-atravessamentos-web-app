-- ATRAVESSAMENTOS BASE SCHEMA
-- Data: 2026-05-08
-- Descrição: Esquema inicial consolidado incluindo tabelas, RLS e Storage.

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELAS NUCLEARES

-- Categorias
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('post', 'project', 'member')),
    color TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts do Diário
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT, -- HTML do Tiptap
    category TEXT, -- Referência por nome para flexibilidade
    author TEXT,
    read_time TEXT,
    status TEXT DEFAULT 'Rascunho' CHECK (status IN ('Publicado', 'Rascunho')),
    published_at TIMESTAMPTZ DEFAULT NOW(),
    cover_image TEXT,
    newsletter_sent_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projetos
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    year INT,
    status TEXT CHECK (status IN ('Ativo', 'Concluído', 'Em Desenvolvimento', 'Publicado', 'Rascunho')),
    category TEXT,
    cover_image TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Membros do Coletivo
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT,
    bio TEXT,
    avatar TEXT,
    tags TEXT[] DEFAULT '{}',
    instagram TEXT,
    linkedin TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configurações Globais (Tabela de Linha Única)
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY CHECK (id = 1), -- Garante registro único
    footer_description TEXT,
    location_text TEXT,
    location_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    contact_email TEXT,
    whatsapp_number TEXT,
    privacy_policy_url TEXT,
    terms_url TEXT,
    accessibility_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mensagens de Contato
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    category TEXT CHECK (category IN ('Parceria', 'Edital', 'Colaboração', 'Trabalho', 'Outros')),
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Lido' CHECK (status IN ('Lido', 'Respondido'))
);

-- 3. POLÍTICAS DE SEGURANÇA (RLS)

-- Habilitar RLS em tudo
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública (Permitir que qualquer um veja o conteúdo publicado)
CREATE POLICY "Leitura pública de categorias" ON categories FOR SELECT USING (true);
CREATE POLICY "Leitura pública de posts publicados" ON blog_posts FOR SELECT USING (status = 'Publicado');
CREATE POLICY "Leitura pública de projetos" ON projects FOR SELECT USING (true);
CREATE POLICY "Leitura pública de membros" ON members FOR SELECT USING (true);
CREATE POLICY "Leitura pública de configurações" ON site_settings FOR SELECT USING (true);

-- Nota: Operações de escrita são realizadas via Service Role (Admin Client) no backend,
-- que ignora RLS. Caso queira usar autenticação via Supabase Auth para admin direto no banco,
-- políticas adicionais seriam necessárias aqui.

-- 4. STORAGE BUCKETS (Simulação SQL para referência - No Supabase isso é feito via UI ou API de Storage)
-- Para efeito de documentação executável, os nomes usados no app são:
-- blog-media, avatars, site-assets

-- 5. DADOS INICIAIS (Opcional - Seed)
INSERT INTO site_settings (id, footer_description) 
VALUES (1, 'Coletivo de educação, arte e justiça social.')
ON CONFLICT (id) DO NOTHING;
