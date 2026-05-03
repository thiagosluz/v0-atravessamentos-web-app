-- Executar este script no SQL Editor do Supabase

-- 1. Adiciona colunas sociais na tabela members
ALTER TABLE public.members
ADD COLUMN IF NOT EXISTS instagram text,
ADD COLUMN IF NOT EXISTS linkedin text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS phone text;

-- 2. Cria o bucket para avatars se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Configura política de leitura pública para as imagens dos avatares
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

-- Nota: Como o upload está sendo feito usando createAdminClient (Service Role Key)
-- no server side (lib/actions/members-admin.ts), não precisamos criar
-- políticas de INSERT/UPDATE no storage para usuários normais ou autenticados
-- pois a service role key ignora o RLS.
