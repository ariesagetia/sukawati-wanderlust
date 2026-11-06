-- =====================================================================================
-- SKRIP PENAMBAHAN FITUR GALERI FOTO DESTINASI SUKAWATI HUB
-- Jalankan skrip ini di Supabase Dashboard > SQL Editor > Run
-- =====================================================================================

-- 1. Tambahkan kolom gallery_urls (array teks untuk daftar URL foto) ke tabel destinations jika belum ada
ALTER TABLE public.destinations 
ADD COLUMN IF NOT EXISTS gallery_urls text[] DEFAULT '{}'::text[];

-- 2. Pastikan bucket 'destination-photos' sudah memiliki kebijakan akses RLS yang lengkap
INSERT INTO storage.buckets (id, name, public) 
VALUES ('destination-photos', 'destination-photos', true) 
ON CONFLICT (id) DO NOTHING;
