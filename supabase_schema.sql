-- ==============================================================================
-- RAMMOHAN MURMU PORTFOLIO - COMPLETE FRESH SUPABASE DATABASE & STORAGE SETUP
-- ==============================================================================
-- This SQL script cleanly sets up or resets your Supabase PostgreSQL database,
-- storage bucket for images/videos, and Row-Level Security (RLS) policies.
--
-- HOW TO RUN IN SUPABASE:
-- 1. Open your Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Select your project -> Click "SQL Editor" in the left sidebar
-- 3. Click "+ New query"
-- 4. Paste this ENTIRE script and click "RUN" (green button)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLE CREATION: portfolio_data
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portfolio_data (
    id TEXT PRIMARY KEY DEFAULT 'main',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_by TEXT DEFAULT 'admin'
);

COMMENT ON TABLE public.portfolio_data IS 'Central CMS data store for Rammohan Murmu portfolio projects, services, profile, and reviews.';

-- ------------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY (RLS) ON portfolio_data
-- ------------------------------------------------------------------------------
ALTER TABLE public.portfolio_data ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public visitors) to READ portfolio content
DROP POLICY IF EXISTS "Allow Public Read Access" ON public.portfolio_data;
CREATE POLICY "Allow Public Read Access" 
ON public.portfolio_data 
FOR SELECT 
USING (true);

-- Allow authenticated users full read/write access
DROP POLICY IF EXISTS "Allow Authenticated Admin Full Access" ON public.portfolio_data;
CREATE POLICY "Allow Authenticated Admin Full Access" 
ON public.portfolio_data 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Allow anon key (Admin PIN or public reviews) full access to insert & update
DROP POLICY IF EXISTS "Allow Anon Update and Insert" ON public.portfolio_data;
CREATE POLICY "Allow Anon Update and Insert" 
ON public.portfolio_data 
FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 3. REALTIME SYNCHRONIZATION
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'portfolio_data'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_data;
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 4. STORAGE BUCKET: portfolio-media
-- ------------------------------------------------------------------------------
-- Create the public storage bucket for images and videos if it does not exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio-media', 
    'portfolio-media', 
    true, 
    52428800, -- 50MB max file size
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'video/mp4', 'video/webm'];

-- Storage Policy 1: Public SELECT (anyone can view images/media)
DROP POLICY IF EXISTS "Public Media View" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_media_select" ON storage.objects;
CREATE POLICY "portfolio_media_select" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'portfolio-media');

-- Storage Policy 2: INSERT (allow uploading files for both anon & authenticated users)
DROP POLICY IF EXISTS "Public / Auth Media Upload" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_media_insert" ON storage.objects;
CREATE POLICY "portfolio_media_insert" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'portfolio-media');

-- Storage Policy 3: UPDATE (allow updating existing files)
DROP POLICY IF EXISTS "Public / Auth Media Update" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_media_update" ON storage.objects;
CREATE POLICY "portfolio_media_update" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'portfolio-media')
WITH CHECK (bucket_id = 'portfolio-media');

-- Storage Policy 4: DELETE (allow deleting files from storage when deleted in CMS)
DROP POLICY IF EXISTS "Public / Auth Media Delete" ON storage.objects;
DROP POLICY IF EXISTS "portfolio_media_delete" ON storage.objects;
CREATE POLICY "portfolio_media_delete" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'portfolio-media');

-- ------------------------------------------------------------------------------
-- 5. TRIGGER: Automatically update updated_at timestamp
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 6. CLEAN INITIAL ROW (ZERO DEMO DATA - READY FOR YOUR FRESH CONTENT)
-- ------------------------------------------------------------------------------
INSERT INTO public.portfolio_data (id, data, updated_by)
VALUES (
    'main',
    '{
      "activeTheme": "cyber-dark",
      "profile": {
        "name": "Rammohan Murmu",
        "title": "Creative Graphics & Web Designer | Video Editor",
        "tagline": "Transforming ideas into high-impact visuals, modern 3D web experiences & cinematic videos.",
        "shortBio": "Specializing in High-End Branding, UI/UX Design, Modern Web Development, and Viral Video Editing.",
        "fullBio": "Hello! I am Rammohan Murmu, a passionate multidisciplinary designer and creative video editor based in India. I craft distinctive visual identities, intuitive user experiences, responsive modern websites, and engaging motion content.",
        "phone": "8250550062",
        "displayPhone": "+91 8250550062",
        "whatsapp": "8250550060",
        "displayWhatsapp": "+91 8250550060",
        "email": "rammohanmurmu0@gmail.com",
        "location": "West Bengal, India",
        "availability": "Available for Freelance & Full-time",
        "yearsExp": "3+",
        "projectsDone": "50+",
        "happyClients": "40+",
        "clientSatisfaction": "99%",
        "avatar": "",
        "aboutImage": "",
        "resumeLink": "#contact",
        "socials": {
          "youtube": "https://www.youtube.com/@rammohanmurmu",
          "facebook": "https://www.facebook.com/",
          "instagram": "https://www.instagram.com/",
          "whatsapp": "https://wa.me/918250550060"
        },
        "customSocials": []
      },
      "socialHub": {
        "youtubeTitle": "Rammohan Murmu - Creative Studio",
        "youtubeHandle": "@rammohanmurmu_design",
        "youtubeUrl": "https://www.youtube.com/@rammohanmurmu",
        "subscribersCount": "10K+",
        "featuredVideoEmbed": "",
        "featuredVideoTitle": "Showreel 2026: 3D Branding & Cinematic Motion Editing",
        "instagramHandle": "@rammohan_creates",
        "instagramUrl": "https://www.instagram.com/",
        "behanceUrl": "https://www.behance.net/",
        "dribbbleUrl": "https://dribbble.com/",
        "telegramUrl": "https://t.me/rammohanmurmu",
        "whatsappUrl": "https://wa.me/918250550060"
      },
      "adminPin": "1234",
      "services": [],
      "projects": [],
      "skills": [
        { "name": "Adobe Photoshop", "level": 95 },
        { "name": "Adobe Illustrator", "level": 90 },
        { "name": "Premiere Pro & After Effects", "level": 92 },
        { "name": "Figma & UI/UX Design", "level": 88 },
        { "name": "HTML5, CSS3 & JavaScript", "level": 85 }
      ],
      "testimonials": []
    }'::jsonb,
    'clean_setup'
)
ON CONFLICT (id) DO UPDATE SET 
    data = EXCLUDED.data,
    updated_at = timezone('utc'::text, now()),
    updated_by = 'clean_reset';

-- ==============================================================================
-- DONE! Your Supabase Database & Storage Bucket are 100% configured and clean!
-- ==============================================================================
