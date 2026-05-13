-- Tabela para histórico de broadcasts de newsletter
CREATE TABLE IF NOT EXISTS newsletter_broadcasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    excerpt TEXT,
    category TEXT,
    slug TEXT,
    count INTEGER DEFAULT 0,
    batch_id TEXT,
    status TEXT DEFAULT 'sent'
);

-- Habilitar RLS
ALTER TABLE newsletter_broadcasts ENABLE ROW LEVEL SECURITY;

-- Nota: Operações de escrita e leitura administrativa são realizadas via 
-- Service Role (createAdminClient) no backend (lib/actions/newsletter.ts),
-- que ignora o RLS. Não são necessárias políticas adicionais para o app funcionar.
