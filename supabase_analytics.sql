-- SQL para Módulo de Analytics "Radar do Coletivo"

CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL, -- Ex: 'like', 'unlike', 'view'
    asset_id VARCHAR(255) NOT NULL, -- ID da imagem, projeto ou membro
    user_hash VARCHAR(255), -- Hash anônimo (IP + UserAgent) para rastreio não identificável
    metadata JSONB DEFAULT '{}'::jsonb, -- Dados extras, como categoria da obra
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices de alta performance
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_asset_id ON public.analytics_events(asset_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at);

-- Otimização para relatórios agregados (ex: quantos likes por dia)
CREATE INDEX IF NOT EXISTS idx_analytics_type_date ON public.analytics_events(event_type, created_at);

-- Adicionar permissões RLS (Row Level Security) - Permite inserção anônima se a Role for anon
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for anonymous users" 
ON public.analytics_events 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated admins only" 
ON public.analytics_events 
FOR SELECT 
TO authenticated 
USING (true);
