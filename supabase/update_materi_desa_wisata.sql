-- =====================================================================================
-- SKRIP UPDATE DATA RESMI MATERI DESA WISATA SUKAWATI
-- Berdasarkan Dokumen Konsep Konten Rute Perjalanan Desa Wisata Sukawati
-- Jalankan di Supabase Dashboard > SQL Editor
-- =====================================================================================

-- 1. Pastikan kolom video_url ada
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS video_url text;

-- 2. Masukkan / Perbarui 12 Destinasi Resmi Sesuai Rute Perjalanan
INSERT INTO public.destinations (
  slug, name, group_type, category, short_description, description, address, sort_order, is_published, photo_url
) VALUES
(
  'homestay-wayan-rutawan',
  'Homestay Wayan Rutawan – Banjar Kebalian',
  'akomodasi',
  'Akomodasi dan Penginapan',
  'Pengalaman menginap di homestay lokal Desa Sukawati yang asri dan ramah.',
  'Nikmati pengalaman menginap di Homestay Wayan Rutawan yang berlokasi di Banjar Kebalian, Desa Sukawati. Homestay ini menjadi salah satu rekomendasi akomodasi bagi wisatawan yang ingin berkunjung dan menjelajahi berbagai daya tarik wisata di Sukawati.

Dengan memilih homestay lokal, wisatawan juga berkesempatan merasakan suasana lingkungan pedesaan dan keramahan masyarakat setempat.',
  'Banjar Kebalian, Desa Sukawati, Gianyar, Bali',
  1,
  true,
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
),
(
  'pura-desa-lan-puseh',
  'Pura Desa lan Puseh – Desa Sukawati',
  'budaya',
  'Seni, Budaya, dan Warisan Tradisi',
  'Pusat spiritual dan warisan budaya penting masyarakat adat Sukawati.',
  'Pura Desa lan Puseh merupakan bagian penting dari kehidupan spiritual masyarakat Hindu Bali. Pura ini memiliki nilai religius, budaya, dan sejarah yang erat kaitannya dengan kehidupan masyarakat adat Sukawati.',
  'Desa Sukawati, Gianyar, Bali',
  2,
  true,
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80'
),
(
  'perajin-pandai-besi-wayan-balik-suanda',
  'Perajin Pandai Besi Wayan Balik Suanda – Banjar Dlodpangkung',
  'kerajinan',
  'Seni, Budaya, dan Warisan Tradisi',
  'Keterampilan tradisional pandai besi dalam pembuatan peralatan logam.',
  'Kenali keterampilan tradisional pandai besi melalui proses pembuatan berbagai peralatan berbahan logam. Wisatawan dapat melihat bagaimana keterampilan, ketelitian, dan pengalaman diwariskan dalam kegiatan kerajinan.',
  'Banjar Dlodpangkung, Desa Sukawati, Gianyar, Bali',
  3,
  true,
  'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80'
),
(
  'sanggar-tari-dan-seni',
  'Sanggar Tari dan Seni Sukawati',
  'budaya',
  'Seni, Budaya, dan Warisan Tradisi',
  'Ruang pengembangan tari, seni rupa, dan vokal generasi muda (Ciwa Nataraja, Ganapati, Crescendo).',
  'Sukawati memiliki ruang pengembangan seni bagi generasi muda melalui beberapa sanggar:
• Sanggar Tari Ciwa Nataraja – Pradnya Larasari
• Ganapati Art Studio – Wayan Gede Aditya Pratita
• Sanggar Vokal Anak-Anak Crescendo – Komang Darmayuda, S.Sn., M.Si., Banjar Tameng

Berbagai kegiatan seperti latihan tari, seni rupa, dan vokal menjadi wadah untuk mengembangkan kreativitas sekaligus melestarikan seni budaya Bali.',
  'Banjar Tameng & Desa Sukawati, Gianyar, Bali',
  4,
  true,
  'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80'
),
(
  'kerajinan-wayang-dan-gender-wayang',
  'Kerajinan Wayang dan Gender Wayang – Ketut Sudiana',
  'kerajinan',
  'Seni, Budaya, dan Warisan Tradisi',
  'Kekayaan seni pewayangan Bali, alat musik gender wayang, dan pertunjukan wayang.',
  'Temukan kekayaan seni pewayangan Bali melalui kerajinan wayang, alat musik gender wayang, serta seni pertunjukan wayang. Destinasi ini memperkenalkan proses kreatif dan nilai budaya yang terkandung dalam kesenian tradisional Bali.',
  'Banjar Babakan, Desa Sukawati, Gianyar, Bali',
  5,
  true,
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80'
),
(
  'kerajinan-pakaian-bali-nyoman-parsa',
  'Kerajinan Pakaian Bali – Nyoman Parsa',
  'kerajinan',
  'Seni, Budaya, dan Warisan Tradisi',
  'Produk kerajinan pakaian tradisional Bali untuk kegiatan adat dan keagamaan.',
  'Kenali kerajinan pakaian tradisional Bali yang menjadi bagian dari identitas dan budaya masyarakat. Wisatawan dapat mengenal lebih dekat produk pakaian Bali serta penggunaannya dalam berbagai kegiatan adat dan keagamaan.',
  'Banjar Telabah, Desa Sukawati, Gianyar, Bali',
  6,
  true,
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80'
),
(
  'dsanga-bistro-pool-space',
  'D''Sanga Bistro, Pool & Space – Desa Sukawati',
  'kuliner',
  'Kuliner, Alam, dan Rekreasi',
  'Kuliner, rekreasi kolam renang, dan ruang berkumpul di tepi Sungai Petanu.',
  'Nikmati waktu bersantai di D''Sanga Bistro, Pool & Space, tempat yang memadukan pengalaman kuliner, rekreasi kolam renang, dan ruang berkumpul dengan pemandangan Sungai Petanu. Tempat ini dapat menjadi pilihan untuk menikmati makan siang sekaligus bersantai bersama keluarga dan teman.',
  'Desa Sukawati, Gianyar, Bali',
  7,
  true,
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
),
(
  'pantai-purnama',
  'Pantai Purnama – Desa Sukawati',
  'kuliner',
  'Kuliner, Alam, dan Rekreasi',
  'Hamparan pasir hitam vulkanik dengan panorama laut yang menenangkan.',
  'Pantai Purnama menawarkan suasana pesisir yang khas dengan hamparan pasir berwarna gelap dan panorama laut yang menenangkan. Wisatawan dapat menikmati pemandangan pantai, berjalan santai, serta merasakan suasana alam pesisir Bali.',
  'Pantai Purnama, Desa Sukawati, Gianyar, Bali',
  8,
  true,
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
),
(
  'jogging-track-sudamala-art-painting',
  'Jogging Track Sudamala & Art Painting – Wayan Wirawan',
  'kuliner',
  'Kuliner, Alam, dan Rekreasi',
  'Jalur jogging pertanian pedesaan dan aktivitas seni lukis Wayan Wirawan.',
  'Jogging Track Sudamala dikembangkan dengan tiga fungsi utama, yaitu memudahkan masyarakat dalam mengangkut bahan pertanian dan hasil panen, menyediakan fasilitas aktivitas fisik dan kesehatan masyarakat, serta mendukung pengembangan Desa Sukawati sebagai destinasi wisata. Di kawasan ini, wisatawan juga dapat mengenal aktivitas seni lukis melalui karya Wayan Wirawan.',
  'Sudamala, Desa Sukawati, Gianyar, Bali',
  9,
  true,
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
),
(
  'pasar-seni-sukawati-jajan-pan-kladi',
  'Pasar Seni & Oleh-Oleh Khas Sukawati – Wayan Sumerta',
  'kuliner',
  'Kuliner, Alam, dan Rekreasi',
  'Belanja kerajinan seni khas Bali dan mencicipi jajanan lokal legendaris Jajan Pan Kladi.',
  'Lengkapi perjalanan dengan berbelanja di Pasar Seni Sukawati dan mengenal berbagai produk kerajinan serta oleh-oleh khas Bali. Wisatawan juga dapat mencicipi jajanan lokal, termasuk Jajan Pan Kladi yang berkaitan dengan Wayan Sumerta.',
  'Banjar Gelulung, Desa Sukawati, Gianyar, Bali',
  10,
  true,
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
),
(
  'puri-ageng-sukawati',
  'Puri Ageng Sukawati – Banjar Mudita',
  'sejarah',
  'Sejarah dan Seni Pertunjukan',
  'Warisan sejarah dan perjalanan Kerajaan Sukawati serta kehidupan adat Bali.',
  'Puri Ageng Sukawati merupakan salah satu tempat yang memiliki keterkaitan dengan sejarah Kerajaan Sukawati. Destinasi ini menjadi bagian dari warisan sejarah dan budaya yang memperkenalkan perjalanan kerajaan serta kehidupan tradisional masyarakat Bali.',
  'Banjar Mudita, Desa Sukawati, Gianyar, Bali',
  11,
  true,
  'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
),
(
  'pertunjukan-tari-kecak-dan-tari-legong',
  'Pertunjukan Tari Kecak & Tari Legong – Pura Penataran Agung',
  'sejarah',
  'Sejarah dan Seni Pertunjukan',
  'Puncak keindahan seni pertunjukan tari Bali yang magis dan kaya nilai tradisi.',
  'Akhiri perjalanan dengan menyaksikan keindahan seni pertunjukan Bali melalui Tari Kecak dan Tari Legong. Gerakan tari, iringan musik, kostum, dan ekspresi para penari menghadirkan pengalaman budaya yang kaya akan nilai tradisi.',
  'Pura Penataran Agung Sukawati, Desa Sukawati, Gianyar, Bali',
  12,
  true,
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  group_type = EXCLUDED.group_type,
  category = EXCLUDED.category,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  address = EXCLUDED.address,
  sort_order = EXCLUDED.sort_order,
  is_published = EXCLUDED.is_published,
  photo_url = COALESCE(destinations.photo_url, EXCLUDED.photo_url),
  updated_at = now();
