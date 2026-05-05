-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id BIGINT PRIMARY KEY DEFAULT 1,
  footer_description TEXT NOT NULL DEFAULT 'Coletivo de educação, arte e justiça social nascido em Jataí — Goiás.',
  location_text TEXT NOT NULL DEFAULT 'Jataí — GO, Brasil · Cerrado',
  location_url TEXT NOT NULL DEFAULT 'https://maps.google.com/?q=Jataí+GO',
  instagram_url TEXT,
  youtube_url TEXT,
  contact_email TEXT NOT NULL DEFAULT 'contato@atravessamentos.org',
  whatsapp_number TEXT,
  privacy_policy_url TEXT DEFAULT '#',
  terms_url TEXT DEFAULT '#',
  accessibility_url TEXT DEFAULT '#',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default settings if not exists
INSERT INTO site_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON site_settings
  FOR SELECT USING (true);

-- Allow authenticated update access
CREATE POLICY "Allow authenticated update access" ON site_settings
  FOR UPDATE USING (auth.role() = 'authenticated');
