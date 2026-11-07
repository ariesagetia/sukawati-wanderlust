import { createClient } from "@supabase/supabase-js";

// Publishable key is safe to ship in the browser; RLS protects the data.
export const supabase = createClient(
  "https://tcmjodqyalbonhcddkxy.supabase.co",
  "sb_publishable_Wx9Eigxb3lOESpgkMdUMSA_W02AcCx2",
  { auth: { persistSession: typeof window !== "undefined" } },
);

export type Destination = {
  id: string;
  slug: string;
  name: string;
  group_type: string;
  category: string;
  short_description: string | null;
  description: string | null;
  address: string | null;
  maps_url: string | null;
  opening_hours: string | null;
  tour_schedule?: string | null;
  tour_duration?: string | null;
  tour_phase?: string | null;
  price: string | null;
  contact: string | null;
  instagram: string | null;
  photo_url: string | null;
  video_url: string | null;
  gallery_urls?: string[] | null;
  sort_order: number;
  is_published: boolean;
};

export const GROUPS: Record<string, string> = {
  akomodasi: "Akomodasi & Homestay",
  budaya: "Seni, Budaya & Tradisi",
  kerajinan: "Kerajinan Tradisional",
  kuliner: "Kuliner, Alam & Rekreasi",
  sejarah: "Sejarah & Pertunjukan",
  // Kompatibilitas data sebelumnya
  destinasi: "Daya Tarik Wisata",
  seni: "Seni & Budaya",
  festival: "Event & Festival",
};

export const ROUTE_SCHEDULES: Record<number, { timeEst: string; duration: string; phase: string; recommendedHours: string }> = {
  1: { timeEst: "08:00 - 08:45 WITA", duration: "45 Menit", phase: "Pagi", recommendedHours: "24 Jam (Check-in 14:00, Check-out 12:00)" },
  2: { timeEst: "09:00 - 09:45 WITA", duration: "45 Menit", phase: "Pagi", recommendedHours: "08:00 - 18:00 WITA" },
  3: { timeEst: "10:00 - 10:45 WITA", duration: "45 Menit", phase: "Pagi", recommendedHours: "08:00 - 17:00 WITA" },
  4: { timeEst: "11:00 - 11:45 WITA", duration: "45 Menit", phase: "Pagi", recommendedHours: "09:00 - 17:00 WITA" },
  5: { timeEst: "12:00 - 12:45 WITA", duration: "45 Menit", phase: "Siang", recommendedHours: "09:00 - 17:00 WITA" },
  6: { timeEst: "13:00 - 13:30 WITA", duration: "30 Menit", phase: "Siang", recommendedHours: "09:00 - 18:00 WITA" },
  7: { timeEst: "13:45 - 15:00 WITA", duration: "75 Menit", phase: "Siang", recommendedHours: "10:00 - 21:00 WITA" },
  8: { timeEst: "15:15 - 16:00 WITA", duration: "45 Menit", phase: "Sore", recommendedHours: "24 Jam (Setiap Hari)" },
  9: { timeEst: "16:15 - 17:00 WITA", duration: "45 Menit", phase: "Sore", recommendedHours: "06:00 - 18:00 WITA" },
  10: { timeEst: "17:15 - 18:15 WITA", duration: "60 Menit", phase: "Sore", recommendedHours: "07:00 - 18:00 WITA" },
  11: { timeEst: "18:30 - 19:15 WITA", duration: "45 Menit", phase: "Malam", recommendedHours: "08:00 - 20:00 WITA" },
  12: { timeEst: "19:30 - 20:30 WITA", duration: "60 Menit", phase: "Malam", recommendedHours: "19:00 - 21:00 WITA (Jadwal Pertunjukan)" },
};

export const OFFICIAL_DESTINATIONS: Destination[] = [
  {
    id: "homestay-wayan-rutawan",
    slug: "homestay-wayan-rutawan",
    name: "Homestay Wayan Rutawan – Banjar Kebalian",
    group_type: "akomodasi",
    category: "Akomodasi dan Penginapan",
    short_description: "Pengalaman menginap di homestay lokal Desa Sukawati yang asri dan ramah.",
    description: "Nikmati pengalaman menginap di Homestay Wayan Rutawan yang berlokasi di Banjar Kebalian, Desa Sukawati. Homestay ini menjadi salah satu rekomendasi akomodasi bagi wisatawan yang ingin berkunjung dan menjelajahi berbagai daya tarik wisata di Sukawati.\n\nDengan memilih homestay lokal, wisatawan juga berkesempatan merasakan suasana lingkungan pedesaan dan keramahan masyarakat setempat.",
    address: "Banjar Kebalian, Desa Sukawati, Gianyar, Bali",
    maps_url: null,
    opening_hours: "24 Jam (Check-in 14:00, Check-out 12:00)",
    price: "Sesuai tipe kamar",
    contact: "+62 812-3456-7890",
    instagram: null,
    photo_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    video_url: null,
    gallery_urls: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80",
    ],
    sort_order: 1,
    is_published: true,
  },
  {
    id: "pura-desa-lan-puseh",
    slug: "pura-desa-lan-puseh",
    name: "Pura Desa lan Puseh – Desa Sukawati",
    group_type: "budaya",
    category: "Seni, Budaya, dan Warisan Tradisi",
    short_description: "Pusat spiritual dan warisan budaya penting masyarakat adat Sukawati.",
    description: "Pura Desa lan Puseh merupakan bagian penting dari kehidupan spiritual masyarakat Hindu Bali. Pura ini memiliki nilai religius, budaya, dan sejarah yang erat kaitannya dengan kehidupan masyarakat adat Sukawati.",
    address: "Desa Sukawati, Gianyar, Bali",
    maps_url: null,
    opening_hours: "08:00 - 18:00 WITA",
    price: "Donasi sukarela",
    contact: null,
    instagram: null,
    photo_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    video_url: null,
    gallery_urls: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=1000&q=80",
    ],
    sort_order: 2,
    is_published: true,
  },
  {
    id: "perajin-pandai-besi-wayan-balik-suanda",
    slug: "perajin-pandai-besi-wayan-balik-suanda",
    name: "Perajin Pandai Besi Wayan Balik Suanda – Banjar Dlodpangkung",
    group_type: "kerajinan",
    category: "Seni, Budaya, dan Warisan Tradisi",
    short_description: "Keterampilan tradisional pandai besi dalam pembuatan peralatan logam.",
    description: "Kenali keterampilan tradisional pandai besi melalui proses pembuatan berbagai peralatan berbahan logam. Wisatawan dapat melihat bagaimana keterampilan, ketelitian, dan pengalaman diwariskan dalam kegiatan kerajinan.",
    address: "Banjar Dlodpangkung, Desa Sukawati, Gianyar, Bali",
    maps_url: null,
    opening_hours: "08:00 - 17:00 WITA",
    price: "Gratis kunjungan / Workshop tersedia",
    contact: null,
    instagram: null,
    photo_url: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80",
    video_url: null,
    gallery_urls: [
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1530639834083-9a21b4474326?auto=format&fit=crop&w=1000&q=80",
    ],
    sort_order: 3,
    is_published: true,
  },
  {
    id: "sanggar-tari-dan-seni",
    slug: "sanggar-tari-dan-seni",
    name: "Sanggar Tari dan Seni Sukawati",
    group_type: "budaya",
    category: "Seni, Budaya, dan Warisan Tradisi",
    short_description: "Ruang pengembangan tari, seni rupa, dan vokal generasi muda (Ciwa Nataraja, Ganapati, Crescendo).",
    description: "Sukawati memiliki ruang pengembangan seni bagi generasi muda melalui beberapa sanggar:\n• Sanggar Tari Ciwa Nataraja – Pradnya Larasari\n• Ganapati Art Studio – Wayan Gede Aditya Pratita\n• Sanggar Vokal Anak-Anak Crescendo – Komang Darmayuda, S.Sn., M.Si., Banjar Tameng\n\nBerbagai kegiatan seperti latihan tari, seni rupa, dan vokal menjadi wadah untuk mengembangkan kreativitas sekaligus melestarikan seni budaya Bali.",
    address: "Banjar Tameng & Desa Sukawati, Gianyar, Bali",
    maps_url: null,
    opening_hours: "09:00 - 17:00 WITA",
    price: "Sesuai program kelas / pertunjukan",
    contact: null,
    instagram: null,
    photo_url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80",
    video_url: null,
    gallery_urls: [
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80",
    ],
    sort_order: 4,
    is_published: true,
  },
  {
    id: "kerajinan-wayang-dan-gender-wayang",
    slug: "kerajinan-wayang-dan-gender-wayang",
    name: "Kerajinan Wayang dan Gender Wayang – Ketut Sudiana",
    group_type: "kerajinan",
    category: "Seni, Budaya, dan Warisan Tradisi",
    short_description: "Kekayaan seni pewayangan Bali, alat musik gender wayang, dan pertunjukan wayang.",
    description: "Temukan kekayaan seni pewayangan Bali melalui kerajinan wayang, alat musik gender wayang, serta seni pertunjukan wayang. Destinasi ini memperkenalkan proses kreatif dan nilai budaya yang terkandung dalam kesenian tradisional Bali.",
    address: "Banjar Babakan, Desa Sukawati, Gianyar, Bali",
    maps_url: null,
    opening_hours: "09:00 - 17:00 WITA",
    price: "Kunjungan & pembelian kerajinan",
    contact: null,
    instagram: null,
    photo_url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    video_url: null,
    gallery_urls: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1000&q=80",
    ],
    sort_order: 5,
    is_published: true,
  },
  {
    id: "kerajinan-pakaian-bali-nyoman-parsa",
    slug: "kerajinan-pakaian-bali-nyoman-parsa",
    name: "Kerajinan Pakaian Bali – Nyoman Parsa",
    group_type: "kerajinan",
    category: "Seni, Budaya, dan Warisan Tradisi",
    short_description: "Produk kerajinan pakaian tradisional Bali untuk kegiatan adat dan keagamaan.",
    description: "Kenali kerajinan pakaian tradisional Bali yang menjadi bagian dari identitas dan budaya masyarakat. Wisatawan dapat mengenal lebih dekat produk pakaian Bali serta penggunaannya dalam berbagai kegiatan adat dan keagamaan.",
    address: "Banjar Telabah, Desa Sukawati, Gianyar, Bali",
    maps_url: null,
    opening_hours: "09:00 - 18:00 WITA",
    price: "Sesuai produk pakaian / kain",
    contact: null,
    instagram: null,
    photo_url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80",
    video_url: null,
    gallery_urls: [
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80",
    ],
    sort_order: 6,
    is_published: true,
  },
  {
    id: "dsanga-bistro-pool-space",
    slug: "dsanga-bistro-pool-space",
    name: "D'Sanga Bistro, Pool & Space – Desa Sukawati",
    group_type: "kuliner",
    category: "Kuliner, Alam, dan Rekreasi",
    short_description: "Kuliner, rekreasi kolam renang, dan ruang berkumpul di tepi Sungai Petanu.",
    description: "Nikmati waktu bersantai di D'Sanga Bistro, Pool & Space, tempat yang memadukan pengalaman kuliner, rekreasi kolam renang, dan ruang berkumpul dengan pemandangan Sungai Petanu. Tempat ini dapat menjadi pilihan untuk menikmati makan siang sekaligus bersantai bersama keluarga dan teman.",
    address: "Desa Sukawati, Gianyar, Bali",
    maps_url: null,
    opening_hours: "10:00 - 21:00 WITA",
    price: "Menu kuliner mulai Rp 25.000",
    contact: null,
    instagram: null,
    photo_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    video_url: null,
    gallery_urls: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80",
    ],
    sort_order: 7,
    is_published: true,
  },
  {
    id: "pantai-purnama",
    slug: "pantai-purnama",
    name: "Pantai Purnama – Desa Sukawati",
    group_type: "kuliner",
    category: "Kuliner, Alam, dan Rekreasi",
    short_description: "Hamparan pasir hitam vulkanik dengan panorama laut yang menenangkan.",
    description: "Pantai Purnama menawarkan suasana pesisir yang khas dengan hamparan pasir berwarna gelap dan panorama laut yang menenangkan. Wisatawan dapat menikmati pemandangan pantai, berjalan santai, serta merasakan suasana alam pesisir Bali.",
    address: "Pantai Purnama, Desa Sukawati, Gianyar, Bali",
    maps_url: null,
    opening_hours: "Setiap hari (24 Jam)",
    price: "Tiket masuk sukarela / parkir",
    contact: null,
    instagram: null,
    photo_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    video_url: null,
    gallery_urls: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1000&q=80",
    ],
    sort_order: 8,
    is_published: true,
  },
  {
    id: "jogging-track-sudamala-art-painting",
    slug: "jogging-track-sudamala-art-painting",
    name: "Jogging Track Sudamala & Art Painting – Wayan Wirawan",
    group_type: "kuliner",
    category: "Kuliner, Alam, dan Rekreasi",
    short_description: "Jalur jogging pertanian pedesaan dan aktivitas seni lukis Wayan Wirawan.",
    description: "Jogging Track Sudamala dikembangkan dengan tiga fungsi utama, yaitu memudahkan masyarakat dalam mengangkut bahan pertanian dan hasil panen, menyediakan fasilitas aktivitas fisik dan kesehatan masyarakat, serta mendukung pengembangan Desa Sukawati sebagai destinasi wisata. Di kawasan ini, wisatawan juga dapat mengenal aktivitas seni lukis melalui karya Wayan Wirawan.",
    address: "Sudamala, Desa Sukawati, Gianyar, Bali",
    maps_url: null,
    opening_hours: "06:00 - 18:00 WITA",
    price: "Gratis",
    contact: null,
    instagram: null,
    photo_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    video_url: null,
    gallery_urls: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80",
    ],
    sort_order: 9,
    is_published: true,
  },
  {
    id: "pasar-seni-sukawati-jajan-pan-kladi",
    slug: "pasar-seni-sukawati-jajan-pan-kladi",
    name: "Pasar Seni & Oleh-Oleh Khas Sukawati – Wayan Sumerta",
    group_type: "kuliner",
    category: "Kuliner, Alam, dan Rekreasi",
    short_description: "Belanja kerajinan seni khas Bali dan mencicipi jajanan lokal legendaris Jajan Pan Kladi.",
    description: "Lengkapi perjalanan dengan berbelanja di Pasar Seni Sukawati dan mengenal berbagai produk kerajinan serta oleh-oleh khas Bali. Wisatawan juga dapat mencicipi jajanan lokal, termasuk Jajan Pan Kladi yang berkaitan dengan Wayan Sumerta.",
    address: "Banjar Gelulung, Desa Sukawati, Gianyar, Bali",
    maps_url: null,
    opening_hours: "07:00 - 18:00 WITA",
    price: "Sesuai belanjaan",
    contact: null,
    instagram: null,
    photo_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    video_url: null,
    gallery_urls: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80",
    ],
    sort_order: 10,
    is_published: true,
  },
  {
    id: "puri-ageng-sukawati",
    slug: "puri-ageng-sukawati",
    name: "Puri Ageng Sukawati – Banjar Mudita",
    group_type: "sejarah",
    category: "Sejarah dan Seni Pertunjukan",
    short_description: "Warisan sejarah dan perjalanan Kerajaan Sukawati serta kehidupan adat Bali.",
    description: "Puri Ageng Sukawati merupakan salah satu tempat yang memiliki keterkaitan dengan sejarah Kerajaan Sukawati. Destinasi ini menjadi bagian dari warisan sejarah dan budaya yang memperkenalkan perjalanan kerajaan serta kehidupan tradisional masyarakat Bali.",
    address: "Banjar Mudita, Desa Sukawati, Gianyar, Bali",
    maps_url: null,
    opening_hours: "08:00 - 20:00 WITA",
    price: "Donasi pelestarian cagar budaya",
    contact: null,
    instagram: null,
    photo_url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    video_url: null,
    gallery_urls: [
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1000&q=80",
    ],
    sort_order: 11,
    is_published: true,
  },
  {
    id: "pertunjukan-tari-kecak-dan-tari-legong",
    slug: "pertunjukan-tari-kecak-dan-tari-legong",
    name: "Pertunjukan Tari Kecak & Tari Legong – Pura Penataran Agung",
    group_type: "sejarah",
    category: "Sejarah dan Seni Pertunjukan",
    short_description: "Puncak keindahan seni pertunjukan tari Bali yang magis dan kaya nilai tradisi.",
    description: "Akhiri perjalanan dengan menyaksikan keindahan seni pertunjukan Bali melalui Tari Kecak dan Tari Legong. Gerakan tari, iringan musik, kostum, dan ekspresi para penari menghadirkan pengalaman budaya yang kaya akan nilai tradisi.",
    address: "Pura Penataran Agung Sukawati, Desa Sukawati, Gianyar, Bali",
    maps_url: null,
    opening_hours: "19:00 - 21:00 WITA (Jadwal Pertunjukan)",
    price: "Sesuai tiket pertunjukan",
    contact: null,
    instagram: null,
    photo_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    video_url: null,
    gallery_urls: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80",
    ],
    sort_order: 12,
    is_published: true,
  },
];

export function getYouTubeEmbedUrl(url?: string | null): string | null {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match && match[1] ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0` : null;
}

export async function fetchTourSchedules(): Promise<Record<string, { timeEst?: string; duration?: string; phase?: string }>> {
  try {
    const { data } = await supabase.from("settings").select("value").eq("key", "tour_schedules").maybeSingle();
    if (data?.value) {
      return JSON.parse(data.value);
    }
  } catch (err) {
    console.warn("fetchTourSchedules error:", err);
  }
  return {};
}

export async function saveDestinationTourSchedule(
  slugOrId: string, 
  schedule: { timeEst?: string | null; duration?: string | null; phase?: string | null }
) {
  try {
    const current = await fetchTourSchedules();
    current[slugOrId] = {
      timeEst: schedule.timeEst || "",
      duration: schedule.duration || "45 Menit",
      phase: schedule.phase || "Pagi",
    };
    return await supabase.from("settings").upsert({
      key: "tour_schedules",
      value: JSON.stringify(current),
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("saveDestinationTourSchedule error:", err);
    throw err;
  }
}

export async function fetchDestinations(all = false) {
  try {
    let q = supabase.from("destinations").select("*").order("sort_order", { ascending: true });
    if (!all) q = q.eq("is_published", true);
    
    // Ambil daftar destinasi dan pengaturan jadwal tur sekaligus
    const [destResult, customSchedules] = await Promise.all([
      q,
      fetchTourSchedules(),
    ]);

    const data = destResult.data;
    if (!destResult.error && data && data.length > 0) {
      // Urutkan berdasarkan sort_order
      const sorted = [...data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      return (sorted as Destination[]).map(d => {
        const officialMatch = OFFICIAL_DESTINATIONS.find(o => o.slug === d.slug);
        const custom = customSchedules[d.slug] || customSchedules[d.id];
        const defaultSched = ROUTE_SCHEDULES[d.sort_order];

        return {
          ...d,
          photo_url: d.photo_url || officialMatch?.photo_url || null,
          gallery_urls: (d.gallery_urls && d.gallery_urls.length > 0) ? d.gallery_urls : (officialMatch?.gallery_urls || []),
          tour_schedule: custom?.timeEst || (d as any).tour_schedule || defaultSched?.timeEst || null,
          tour_duration: custom?.duration || (d as any).tour_duration || defaultSched?.duration || "45 Menit",
          tour_phase: custom?.phase || (d as any).tour_phase || defaultSched?.phase || "Pagi",
        };
      });
    }

    return OFFICIAL_DESTINATIONS.map(d => {
      const custom = customSchedules[d.slug] || customSchedules[d.id];
      const defaultSched = ROUTE_SCHEDULES[d.sort_order];
      return {
        ...d,
        tour_schedule: custom?.timeEst || defaultSched?.timeEst || null,
        tour_duration: custom?.duration || defaultSched?.duration || "45 Menit",
        tour_phase: custom?.phase || defaultSched?.phase || "Pagi",
      };
    });
  } catch (err) {
    console.warn("fetchDestinations exception, using official list:", err);
    return OFFICIAL_DESTINATIONS;
  }
}

export async function fetchDestination(slug: string) {
  try {
    const [destResult, customSchedules] = await Promise.all([
      supabase.from("destinations").select("*").eq("slug", slug).maybeSingle(),
      fetchTourSchedules(),
    ]);

    const data = destResult.data;
    if (data) {
      // Pastikan jika photo_url di db kosong, gunakan fallback photo resmi
      const officialMatch = OFFICIAL_DESTINATIONS.find(o => o.slug === slug);
      const gallery = (data.gallery_urls && Array.isArray(data.gallery_urls) && data.gallery_urls.length > 0)
        ? data.gallery_urls
        : (officialMatch?.gallery_urls || []);
      const custom = customSchedules[slug] || customSchedules[data.id];
      const defaultSched = ROUTE_SCHEDULES[data.sort_order];

      return {
        ...data,
        photo_url: data.photo_url || officialMatch?.photo_url || null,
        gallery_urls: gallery,
        tour_schedule: custom?.timeEst || (data as any).tour_schedule || defaultSched?.timeEst || null,
        tour_duration: custom?.duration || (data as any).tour_duration || defaultSched?.duration || "45 Menit",
        tour_phase: custom?.phase || (data as any).tour_phase || defaultSched?.phase || "Pagi",
      } as Destination;
    }
    if (destResult.error) console.warn("Supabase fetchDestination error:", destResult.error);
  } catch (err) {
    console.warn("fetchDestination exception:", err);
  }
  const found = OFFICIAL_DESTINATIONS.find((d) => d.slug === slug);
  return found ?? null;
}

export async function fetchSetting(key: string) {
  try {
    const { data, error } = await supabase.from("settings").select("value").eq("key", key).maybeSingle();
    if (error) {
      return null;
    }
    return data?.value as string | null;
  } catch {
    return null;
  }
}
