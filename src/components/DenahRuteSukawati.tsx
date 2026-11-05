import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Destination } from "@/lib/supabase";
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight,
  Eye,
  CheckCircle2,
  Navigation
} from "lucide-react";

export interface RoutePoint {
  step: number;
  slug: string;
  name: string;
  shortName: string;
  banjar: string;
  category: string;
  timeEst: string;
  activity: string;
  desc: string;
  x: number; // Persentase X pada canvas peta (0 - 100)
  y: number; // Persentase Y pada canvas peta (0 - 100)
  icon: string;
}

export const ROUTE_POINTS: RoutePoint[] = [
  {
    step: 1,
    slug: "homestay-wayan-rutawan",
    name: "Homestay Wayan Rutawan – Banjar Kebalian",
    shortName: "Homestay Wayan Rutawan",
    banjar: "Banjar Kebalian",
    category: "Akomodasi & Titik Awal",
    timeEst: "08:00 - 08:45 WITA",
    activity: "Check-in & Menikmati Suasana Pedesaan",
    desc: "Titik keberangkatan ideal dengan keramahan warga lokal dan suasana asri pedesaan Sukawati sebelum memulai eksplorasi.",
    x: 18,
    y: 18,
    icon: "🏡",
  },
  {
    step: 2,
    slug: "pura-desa-lan-puseh",
    name: "Pura Desa lan Puseh – Desa Sukawati",
    shortName: "Pura Desa lan Puseh",
    banjar: "Pusat Desa Sukawati",
    category: "Spiritual & Cagar Budaya",
    timeEst: "09:00 - 09:45 WITA",
    activity: "Mengenal Spiritualitas & Arsitektur Klasik Bali",
    desc: "Pusat kehidupan spiritual masyarakat adat Hindu Sukawati dengan nilai sejarah keagungan pura Kahyangan Tiga.",
    x: 38,
    y: 14,
    icon: "🛕",
  },
  {
    step: 3,
    slug: "perajin-pandai-besi-wayan-balik-suanda",
    name: "Perajin Pandai Besi Wayan Balik Suanda",
    shortName: "Pandai Besi Wayan Balik",
    banjar: "Banjar Dlodpangkung",
    category: "Kerajinan Logam Tradisional",
    timeEst: "10:00 - 10:45 WITA",
    activity: "Melihat Proses Tempa Tradisional",
    desc: "Melihat langsung keterampilan tempa besi warisan leluhur dalam pembuatan perkakas tradisional bermutu tinggi.",
    x: 58,
    y: 16,
    icon: "🔨",
  },
  {
    step: 4,
    slug: "sanggar-tari-dan-seni",
    name: "Sanggar Tari dan Seni Sukawati",
    shortName: "Sanggar Seni & Tari",
    banjar: "Banjar Tameng",
    category: "Seni Tari, Rupa & Vokal",
    timeEst: "11:00 - 11:45 WITA",
    activity: "Kreativitas Generasi Muda Sukawati",
    desc: "Sanggar Ciwa Nataraja, Ganapati Art Studio, dan Crescendo sebagai wadah pelatihan bakat seni anak-anak Bali.",
    x: 76,
    y: 20,
    icon: "🎭",
  },
  {
    step: 5,
    slug: "kerajinan-wayang-dan-gender-wayang",
    name: "Kerajinan Wayang & Gender Wayang – Ketut Sudiana",
    shortName: "Wayang & Gender Wayang",
    banjar: "Banjar Babakan",
    category: "Seni Pewayangan Bali",
    timeEst: "12:00 - 12:45 WITA",
    activity: "Workshop Wayang Kulit & Gender",
    desc: "Pusat kreasi seni wayang kulit Bali dan bilah instrumen gender wayang dengan filosofi spiritual yang luhur.",
    x: 88,
    y: 32,
    icon: "📜",
  },
  {
    step: 6,
    slug: "kerajinan-pakaian-bali-nyoman-parsa",
    name: "Kerajinan Pakaian Bali – Nyoman Parsa",
    shortName: "Pakaian Adat Nyoman Parsa",
    banjar: "Banjar Telabah",
    category: "Tekstil & Busana Adat",
    timeEst: "13:00 - 13:30 WITA",
    activity: "Mengenal Busana & Kain Kamen Prada",
    desc: "Kerajinan busana adat dan kain prada Bali yang menjadi identitas keanggunan budaya dalam kegiatan keagamaan.",
    x: 84,
    y: 48,
    icon: "👘",
  },
  {
    step: 7,
    slug: "dsanga-bistro-pool-space",
    name: "D'Sanga Bistro, Pool & Space – Desa Sukawati",
    shortName: "D'Sanga Bistro & Pool",
    banjar: "Tepi Sungai Petanu",
    category: "Makan Siang & Relaksasi",
    timeEst: "13:45 - 15:00 WITA",
    activity: "Santap Siang Tepi Lembah Petanu",
    desc: "Makan siang dengan suasana asri pemandangan Sungai Petanu, kolam renang menyegarkan, dan kuliner lezat.",
    x: 72,
    y: 60,
    icon: "🍲",
  },
  {
    step: 8,
    slug: "pantai-purnama",
    name: "Pantai Purnama – Desa Sukawati",
    shortName: "Pantai Purnama",
    banjar: "Pesisir Selatan Sukawati",
    category: "Panorama Alam Pesisir",
    timeEst: "15:15 - 16:00 WITA",
    activity: "Menikmati Deburan Ombak Pasir Hitam",
    desc: "Hamparan pasir hitam vulkanik berkilau dengan deburan ombak laut selatan yang menyejukkan pikiran.",
    x: 58,
    y: 78,
    icon: "🌊",
  },
  {
    step: 9,
    slug: "jogging-track-sudamala-art-painting",
    name: "Jogging Track Sudamala & Art Painting – Wayan Wirawan",
    shortName: "Jogging Track & Galeri Lukis",
    banjar: "Sudamala",
    category: "Agrowisata & Seni Lukis",
    timeEst: "16:15 - 17:00 WITA",
    activity: "Jalan Santai Persawahan & Studio Seni",
    desc: "Menyusuri jalur jogging pertanian pedesaan yang asri sekaligus mengagumi karya kanvas seni lukis Wayan Wirawan.",
    x: 36,
    y: 68,
    icon: "🎨",
  },
  {
    step: 10,
    slug: "pasar-seni-sukawati-jajan-pan-kladi",
    name: "Pasar Seni Sukawati & Jajan Pan Kladi",
    shortName: "Pasar Seni & Jajan Pan Kladi",
    banjar: "Banjar Gelulung",
    category: "Belanja Seni & Jajanan Khas",
    timeEst: "17:15 - 18:15 WITA",
    activity: "Belanja Cendera Mata & Kuliner Legendaris",
    desc: "Berburu karya seni dan kerajinan khas Bali di Pasar Seni Sukawati sembari mencicipi legitnya Jajan Pan Kladi.",
    x: 20,
    y: 52,
    icon: "🛍️",
  },
  {
    step: 11,
    slug: "puri-ageng-sukawati",
    name: "Puri Ageng Sukawati – Banjar Mudita",
    shortName: "Puri Ageng Sukawati",
    banjar: "Banjar Mudita",
    category: "Warisan Sejarah Kerajaan",
    timeEst: "18:30 - 19:15 WITA",
    activity: "Mengenal Sejarah Kerajaan Sukawati",
    desc: "Istana megah kediaman bangsawan Sukawati dengan keindahan arsitektur tradisional dan kisah masa kejayaan kerajaan.",
    x: 28,
    y: 36,
    icon: "👑",
  },
  {
    step: 12,
    slug: "pertunjukan-tari-kecak-dan-tari-legong",
    name: "Pertunjukan Tari Kecak & Tari Legong",
    shortName: "Tari Kecak & Legong",
    banjar: "Pura Penataran Agung",
    category: "Puncak Seni Budaya Malam",
    timeEst: "19:30 - 20:30 WITA",
    activity: "Menyaksikan Pagelaran Magis Tari Bali",
    desc: "Penutup perjalanan yang memukau: gerakan dinamis Tari Kecak dan keanggunan Tari Legong di pelataran pura suci.",
    x: 48,
    y: 38,
    icon: "🔥",
  },
];

export function DenahRuteSukawati({ destinations }: { destinations?: Destination[] }) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const activePoint = ROUTE_POINTS.find((p) => p.step === activeStep) || ROUTE_POINTS[0];
  
  // Ambil data foto dari destinations jika tersedia
  const destinationDetail = destinations?.find((d) => d.slug === activePoint.slug);
  const activePhoto = destinationDetail?.photo_url || 
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="space-y-8">
      {/* ── KEPALA DENAH DENGAN BADGE INFO ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Denah Interaktif & Alur Kunjungan
            </span>
          </div>
          <h3 
            className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Peta Rute Wisata Budaya Sukawati
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
            Klik nomor titik pada denah di bawah untuk melihat rute dari pagi hingga malam hari:
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-neutral-600">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            12 Titik Terpadu
          </span>
          <span className="bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            Durasi: 1 Hari Penuh
          </span>
        </div>
      </div>

      {/* ── KANVAS DENAH RUTE INTERAKTIF (ILUSTRASI PETA BALI MODERN) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Kolom Peta Denah Visual (8 Kolom) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#f8faf8] via-[#eef6f1] to-[#e4f0e8] rounded-3xl border-2 border-emerald-100 p-4 sm:p-6 shadow-inner relative overflow-hidden select-none">
          
          {/* Kompas Orientasi */}
          <div className="absolute top-4 right-4 z-20 flex flex-col items-center bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-emerald-100/80">
            <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shadow">
              U
            </div>
            <span className="text-[9px] font-bold text-neutral-400 mt-1 tracking-tighter">KE UBUD</span>
            <div className="w-px h-3 bg-neutral-200 my-0.5" />
            <span className="text-[9px] font-bold text-neutral-400 tracking-tighter">PANTAI</span>
            <span className="text-[10px] font-bold text-neutral-700">S</span>
          </div>

          {/* Label Area Wilayah Sukawati */}
          <div className="absolute top-4 left-6 text-[11px] font-bold uppercase tracking-wider text-emerald-800/60 pointer-events-none">
            Wilayah Utara · Sentra Hunian & Adat
          </div>
          <div className="absolute bottom-4 left-6 text-[11px] font-bold uppercase tracking-wider text-emerald-800/60 pointer-events-none">
            Wilayah Selatan · Pesisir & Samudera
          </div>
          <div className="absolute top-1/2 right-4 -translate-y-1/2 text-[11px] font-bold uppercase tracking-wider text-teal-800/60 rotate-90 pointer-events-none origin-right">
            Sungai Petanu ➔
          </div>

          {/* SVG Canvas Map */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/11]">
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              viewBox="0 0 1000 650"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Gradient untuk garis rute */}
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="50%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>

                {/* Pola latar belakang kontur pedesaan */}
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(16, 185, 129, 0.05)" strokeWidth="1" />
                </pattern>
              </defs>

              {/* Latar Belakang Garis Halus */}
              <rect width="1000" height="650" fill="url(#grid)" />

              {/* Garis Aliran Sungai Petanu di Sisi Timur */}
              <path
                d="M 850 0 C 890 150, 750 300, 830 450 C 870 520, 820 600, 800 650"
                fill="none"
                stroke="#a7f3d0"
                strokeWidth="18"
                strokeLinecap="round"
                opacity="0.6"
              />

              {/* Area Pesisir Pantai Purnama di Sisi Bawah */}
              <path
                d="M 400 650 C 600 580, 800 620, 1000 590 L 1000 650 Z"
                fill="#d1fae5"
                opacity="0.5"
              />

              {/* ── GARIS ALUR RUTE 1 S/D 12 ── */}
              {/* Garis bayangan lembut */}
              <path
                d="M 180 117 C 280 90, 320 90, 380 91 C 480 100, 520 100, 580 104 C 670 110, 720 120, 760 130 C 820 150, 880 200, 880 208 C 880 260, 860 300, 840 312 C 800 370, 750 380, 720 390 C 650 450, 600 500, 580 507 C 480 500, 420 460, 360 442 C 280 400, 220 370, 200 338 C 180 280, 220 240, 280 234 C 380 240, 440 240, 480 247"
                fill="none"
                stroke="white"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />

              {/* Garis rute utama hijau putus-putus */}
              <path
                d="M 180 117 C 280 90, 320 90, 380 91 C 480 100, 520 100, 580 104 C 670 110, 720 120, 760 130 C 820 150, 880 200, 880 208 C 880 260, 860 300, 840 312 C 800 370, 750 380, 720 390 C 650 450, 600 500, 580 507 C 480 500, 420 460, 360 442 C 280 400, 220 370, 200 338 C 180 280, 220 240, 280 234 C 380 240, 440 240, 480 247"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="4"
                strokeDasharray="8 8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* ── 12 PIN TITIK RUTE PADA DENAH ── */}
            {ROUTE_POINTS.map((pt) => {
              const isActive = pt.step === activeStep;
              return (
                <div
                  key={pt.step}
                  onClick={() => setActiveStep(pt.step)}
                  style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform hover:scale-125 focus:outline-none"
                  title={`${pt.step}. ${pt.name}`}
                >
                  {/* Efek Lingkaran Aktif Berkedip */}
                  {isActive && (
                    <span className="absolute -inset-2.5 rounded-full bg-emerald-500/40 animate-ping" />
                  )}

                  {/* Pin Container */}
                  <div
                    className={`relative flex items-center justify-center rounded-full transition-all duration-300 shadow-md ${
                      isActive
                        ? "w-10 h-10 bg-emerald-600 text-white ring-4 ring-emerald-300 shadow-lg shadow-emerald-700/40 scale-110"
                        : "w-7 h-7 sm:w-8 sm:h-8 bg-white hover:bg-emerald-50 text-neutral-800 border-2 border-emerald-600/70"
                    }`}
                  >
                    <span className="font-bold text-xs sm:text-sm">
                      {pt.step}
                    </span>

                    {/* Small category icon badge */}
                    <span className="absolute -top-1 -right-1 text-[10px]">
                      {pt.icon}
                    </span>
                  </div>

                  {/* Label Nama Lokasi Singkat */}
                  <div 
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm transition-all pointer-events-none ${
                      isActive
                        ? "bg-emerald-900 text-white shadow-md z-30"
                        : "bg-white/95 text-neutral-700 border border-neutral-200/80 hidden sm:block opacity-85"
                    }`}
                  >
                    {pt.shortName}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stepper Timeline Navigasi Cepat 1 - 12 di Bawah Denah */}
          <div className="mt-4 pt-4 border-t border-emerald-100 flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
            {ROUTE_POINTS.map((pt) => {
              const isCurrent = pt.step === activeStep;
              return (
                <button
                  key={pt.step}
                  onClick={() => setActiveStep(pt.step)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "bg-white/80 text-neutral-600 hover:bg-white hover:text-emerald-700 border border-neutral-200/60"
                  }`}
                >
                  <span className="text-[11px] font-bold">#{pt.step}</span>
                  <span className="hidden md:inline">{pt.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Kolom Informasi Titik Aktif (Inspector Card) (4 Kolom) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200 shadow-lg p-6 flex flex-col justify-between space-y-6">
          <div>
            {/* Header Card Titik Aktif */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Pemberhentian #{activePoint.step} dari 12
              </span>
              <span className="text-xs font-medium text-neutral-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                {activePoint.timeEst}
              </span>
            </div>

            {/* Foto Destinasi */}
            <div className="mt-4 relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-inner group">
              <img
                src={activePhoto}
                alt={activePoint.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{activePoint.banjar}</span>
              </div>
            </div>

            {/* Nama & Kategori */}
            <div className="mt-4 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {activePoint.category}
              </span>
              <h4 
                className="text-xl font-bold text-neutral-900 leading-snug"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {activePoint.name}
              </h4>
              <p className="text-xs font-medium text-emerald-800 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100 flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Aktivitas:</strong> {activePoint.activity}</span>
              </p>
              <p className="text-xs text-neutral-600 leading-relaxed pt-1">
                {activePoint.desc}
              </p>
            </div>
          </div>

          {/* Tombol Aksi & Navigasi Step */}
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <Link
              to="/destinasi/$slug"
              params={{ slug: activePoint.slug }}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-colors shadow-sm"
            >
              <span>Buka Profil & Foto Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveStep((prev) => (prev > 1 ? prev - 1 : 12))}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 border border-neutral-200 hover:border-emerald-500 text-neutral-700 hover:text-emerald-700 rounded-xl text-xs font-medium transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Sebelumnya</span>
              </button>
              <button
                onClick={() => setActiveStep((prev) => (prev < 12 ? prev + 1 : 1))}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 border border-neutral-200 hover:border-emerald-500 text-neutral-700 hover:text-emerald-700 rounded-xl text-xs font-medium transition-colors"
              >
                <span>Berikutnya</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
