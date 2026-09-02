-- ==============================================================================
-- RAMMOHAN MURMU PORTFOLIO - SUPABASE DATABASE SCHEMA & SETUP SCRIPT
-- ==============================================================================
-- This SQL script creates the necessary table, row-level security (RLS) policies,
-- realtime synchronization, and initial data row for your portfolio website.
--
-- HOW TO RUN:
-- 1. Open your Supabase Dashboard (https://supabase.com/dashboard).
-- 2. Go to the "SQL Editor" tab from the left sidebar.
-- 3. Click "New query", paste this entire script, and click "Run".
-- ==============================================================================

-- 1. Create the portfolio_data table
CREATE TABLE IF NOT EXISTS public.portfolio_data (
    id TEXT PRIMARY KEY DEFAULT 'main',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_by TEXT DEFAULT 'admin'
);

-- Add helpful comment
COMMENT ON TABLE public.portfolio_data IS 'Central data store for Rammohan Murmu portfolio projects, services, profile, and reviews.';

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_data ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies:
-- Allow anyone (public visitors & search engines) to READ portfolio content
DROP POLICY IF EXISTS "Allow Public Read Access" ON public.portfolio_data;
CREATE POLICY "Allow Public Read Access" 
ON public.portfolio_data 
FOR SELECT 
USING (true);

-- Allow authenticated admins to INSERT, UPDATE, and DELETE data
DROP POLICY IF EXISTS "Allow Authenticated Admin Full Access" ON public.portfolio_data;
CREATE POLICY "Allow Authenticated Admin Full Access" 
ON public.portfolio_data 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Allow public review submissions and updates if needed (using anon key)
DROP POLICY IF EXISTS "Allow Anon Update and Insert" ON public.portfolio_data;
CREATE POLICY "Allow Anon Update and Insert" 
ON public.portfolio_data 
FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);

-- 4. Enable Supabase Realtime for live cross-browser instant updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'portfolio_data'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_data;
  END IF;
END $$;

-- 5. Optional: Create Storage Bucket for Portfolio Media (Images & Videos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public Read, Authenticated / Anon Upload
DROP POLICY IF EXISTS "Public Media View" ON storage.objects;
CREATE POLICY "Public Media View" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "Public / Auth Media Upload" ON storage.objects;
CREATE POLICY "Public / Auth Media Upload" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "Public / Auth Media Delete" ON storage.objects;
CREATE POLICY "Public / Auth Media Delete" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'portfolio-media');

-- Allow updating/overwriting existing objects (needed for profile photo upsert)
DROP POLICY IF EXISTS "Public / Auth Media Update" ON storage.objects;
CREATE POLICY "Public / Auth Media Update" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'portfolio-media')
WITH CHECK (bucket_id = 'portfolio-media');

-- 6. Trigger to automatically update `updated_at` column timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_portfolio_data_updated ON public.portfolio_data;
CREATE TRIGGER on_portfolio_data_updated
  BEFORE UPDATE ON public.portfolio_data
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- SUCCESS: Your Supabase database is now ready for your Portfolio Website!
-- ==============================================================================
