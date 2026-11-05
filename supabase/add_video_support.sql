-- =====================================================================================
-- SKRIP PENAMBAHAN FITUR VIDEO DESTINASI SUKAWATI HUB
-- Jalankan skrip ini di Supabase Dashboard > SQL Editor
-- =====================================================================================

-- 1. Tambahkan kolom video_url ke tabel destinations jika belum ada
ALTER TABLE public.destinations 
ADD COLUMN IF NOT EXISTS video_url text;

-- 2. Buat bucket penyimpanan khusus video 'destination-videos' (Public)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('destination-videos', 'destination-videos', true) 
ON CONFLICT (id) DO NOTHING;

-- 3. Kebijakan akses (RLS Policies) untuk storage bucket 'destination-videos'
-- Publik dapat melihat/memutar video:
DROP POLICY IF EXISTS "Public read videos" ON storage.objects;
CREATE POLICY "Public read videos" ON storage.objects 
FOR SELECT USING (bucket_id = 'destination-videos');

-- Admin dapat mengunggah video:
DROP POLICY IF EXISTS "Admin upload videos" ON storage.objects;
CREATE POLICY "Admin upload videos" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'destination-videos' AND public.has_role(auth.uid(), 'admin'));

-- Admin dapat memperbarui video:
DROP POLICY IF EXISTS "Admin update videos" ON storage.objects;
CREATE POLICY "Admin update videos" ON storage.objects 
FOR UPDATE TO authenticated 
USING (bucket_id = 'destination-videos' AND public.has_role(auth.uid(), 'admin'));

-- Admin dapat menghapus video:
DROP POLICY IF EXISTS "Admin delete videos" ON storage.objects;
CREATE POLICY "Admin delete videos" ON storage.objects 
FOR DELETE TO authenticated 
USING (bucket_id = 'destination-videos' AND public.has_role(auth.uid(), 'admin'));
