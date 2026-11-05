import { useState, useEffect } from "react";
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
  CheckCircle2,
  Navigation,
  Home,
  Landmark,
  Hammer,
  Theater,
  ScrollText,
  Scissors,
  UtensilsCrossed,
  Waves,
  Palette,
  ShoppingBag,
  Crown,
  Flame,
  Play,
  Pause,
  RotateCcw,
  Map,
  Calendar,
  ExternalLink,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Layers,
  Info
} from "lucide-react";

export interface RoutePoint {
  step: number;
  slug: string;
  name: string;
  shortName: string;
  banjar: string;
  category: string;
  phase: "pagi" | "siang" | "sore" | "malam";
  phaseLabel: string;
  timeEst: string;
  duration: string;
  activity: string;
  desc: string;
  x: number; // Persentase X pada canvas peta (0 - 100)
  y: number; // Persentase Y pada canvas peta (0 - 100)
  iconKey: string;
}

export const PHASES = [
  { id: "all", label: "Semua Rute", icon: Compass, time: "1 Hari Penuh", count: 12 },
  { id: "pagi", label: "Pagi", icon: Sunrise, time: "08:00 - 11:45", count: 4, steps: [1, 2, 3, 4] },
  { id: "siang", label: "Siang", icon: Sun, time: "12:00 - 15:00", count: 3, steps: [5, 6, 7] },
  { id: "sore", label: "Sore", icon: Sunset, time: "15:15 - 18:15", count: 3, steps: [8, 9, 10] },
  { id: "malam", label: "Malam", icon: Moon, time: "18:30 - 20:30", count: 2, steps: [11, 12] },
] as const;

const ICONS_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Home,
  temple: Landmark,
  craft: Hammer,
  theater: Theater,
  scroll: ScrollText,
  scissors: Scissors,
  food: UtensilsCrossed,
  waves: Waves,
  palette: Palette,
  market: ShoppingBag,
  crown: Crown,
  flame: Flame,
};

function getPointIcon(key: string, className = "w-3.5 h-3.5") {
  const IconComp = ICONS_MAP[key] || Sparkles;
  return <IconComp className={className} />;
}

export const ROUTE_POINTS: RoutePoint[] = [
  {
    step: 1,
    slug: "homestay-wayan-rutawan",
    name: "Homestay Wayan Rutawan – Banjar Kebalian",
    shortName: "Homestay Wayan Rutawan",
    banjar: "Banjar Kebalian",
    phase: "pagi",
    phaseLabel: "Pagi Hari",
    category: "Akomodasi & Titik Awal",
    timeEst: "08:00 - 08:45 WITA",
    duration: "45 Menit",
    activity: "Check-in & Menikmati Suasana Pedesaan",
    desc: "Titik keberangkatan ideal dengan keramahan warga lokal dan suasana asri pedesaan Sukawati sebelum memulai eksplorasi.",
    x: 16,
    y: 20,
    iconKey: "home",
  },
  {
    step: 2,
    slug: "pura-desa-lan-puseh",
    name: "Pura Desa lan Puseh – Desa Sukawati",
    shortName: "Pura Desa lan Puseh",
    banjar: "Pusat Desa Sukawati",
    phase: "pagi",
    phaseLabel: "Pagi Hari",
    category: "Spiritual & Cagar Budaya",
    timeEst: "09:00 - 09:45 WITA",
    duration: "45 Menit",
    activity: "Mengenal Spiritualitas & Arsitektur Klasik Bali",
    desc: "Pusat kehidupan spiritual masyarakat adat Hindu Sukawati dengan nilai sejarah keagungan pura Kahyangan Tiga.",
    x: 36,
    y: 15,
    iconKey: "temple",
  },
  {
    step: 3,
    slug: "perajin-pandai-besi-wayan-balik-suanda",
    name: "Perajin Pandai Besi Wayan Balik Suanda",
    shortName: "Pandai Besi Wayan Balik",
    banjar: "Banjar Dlodpangkung",
    phase: "pagi",
    phaseLabel: "Pagi Hari",
    category: "Kerajinan Logam Tradisional",
    timeEst: "10:00 - 10:45 WITA",
    duration: "45 Menit",
    activity: "Melihat Proses Tempa Tradisional",
    desc: "Melihat langsung keterampilan tempa besi warisan leluhur dalam pembuatan perkakas tradisional bermutu tinggi.",
    x: 58,
    y: 16,
    iconKey: "craft",
  },
  {
    step: 4,
    slug: "sanggar-tari-dan-seni",
    name: "Sanggar Tari dan Seni Sukawati",
    shortName: "Sanggar Seni & Tari",
    banjar: "Banjar Tameng",
    phase: "pagi",
    phaseLabel: "Pagi Hari",
    category: "Seni Tari, Rupa & Vokal",
    timeEst: "11:00 - 11:45 WITA",
    duration: "45 Menit",
    activity: "Kreativitas Generasi Muda Sukawati",
    desc: "Sanggar Ciwa Nataraja, Ganapati Art Studio, dan Crescendo sebagai wadah pelatihan bakat seni anak-anak Bali.",
    x: 78,
    y: 22,
    iconKey: "theater",
  },
  {
    step: 5,
    slug: "kerajinan-wayang-dan-gender-wayang",
    name: "Kerajinan Wayang & Gender Wayang – Ketut Sudiana",
    shortName: "Wayang & Gender Wayang",
    banjar: "Banjar Babakan",
    phase: "siang",
    phaseLabel: "Siang Hari",
    category: "Seni Pewayangan Bali",
    timeEst: "12:00 - 12:45 WITA",
    duration: "45 Menit",
    activity: "Workshop Wayang Kulit & Gender",
    desc: "Pusat kreasi seni wayang kulit Bali dan bilah instrumen gender wayang dengan filosofi spiritual yang luhur.",
    x: 88,
    y: 35,
    iconKey: "scroll",
  },
  {
    step: 6,
    slug: "kerajinan-pakaian-bali-nyoman-parsa",
    name: "Kerajinan Pakaian Bali – Nyoman Parsa",
    shortName: "Pakaian Adat Nyoman Parsa",
    banjar: "Banjar Telabah",
    phase: "siang",
    phaseLabel: "Siang Hari",
    category: "Tekstil & Busana Adat",
    timeEst: "13:00 - 13:30 WITA",
    duration: "30 Menit",
    activity: "Mengenal Busana & Kain Kamen Prada",
    desc: "Kerajinan busana adat dan kain prada Bali yang menjadi identitas keanggunan budaya dalam kegiatan keagamaan.",
    x: 84,
    y: 50,
    iconKey: "scissors",
  },
  {
    step: 7,
    slug: "dsanga-bistro-pool-space",
    name: "D'Sanga Bistro, Pool & Space – Desa Sukawati",
    shortName: "D'Sanga Bistro & Pool",
    banjar: "Tepi Sungai Petanu",
    phase: "siang",
    phaseLabel: "Siang Hari",
    category: "Makan Siang & Relaksasi",
    timeEst: "13:45 - 15:00 WITA",
    duration: "75 Menit",
    activity: "Santap Siang Tepi Lembah Petanu",
    desc: "Makan siang dengan suasana asri pemandangan Sungai Petanu, kolam renang menyegarkan, dan kuliner lezat.",
    x: 72,
    y: 65,
    iconKey: "food",
  },
  {
    step: 8,
    slug: "pantai-purnama",
    name: "Pantai Purnama – Desa Sukawati",
    shortName: "Pantai Purnama",
    banjar: "Pesisir Selatan Sukawati",
    phase: "sore",
    phaseLabel: "Sore Hari",
    category: "Panorama Alam Pesisir",
    timeEst: "15:15 - 16:00 WITA",
    duration: "45 Menit",
    activity: "Menikmati Deburan Ombak Pasir Hitam",
    desc: "Hamparan pasir hitam vulkanik berkilau dengan deburan ombak laut selatan yang menyejukkan pikiran.",
    x: 54,
    y: 82,
    iconKey: "waves",
  },
  {
    step: 9,
    slug: "jogging-track-sudamala-art-painting",
    name: "Jogging Track Sudamala & Art Painting – Wayan Wirawan",
    shortName: "Jogging Track & Galeri Lukis",
    banjar: "Sudamala",
    phase: "sore",
    phaseLabel: "Sore Hari",
    category: "Agrowisata & Seni Lukis",
    timeEst: "16:15 - 17:00 WITA",
    duration: "45 Menit",
    activity: "Jalan Santai Persawahan & Studio Seni",
    desc: "Menyusuri jalur jogging pertanian pedesaan yang asri sekaligus mengagumi karya kanvas seni lukis Wayan Wirawan.",
    x: 34,
    y: 72,
    iconKey: "palette",
  },
  {
    step: 10,
    slug: "pasar-seni-sukawati-jajan-pan-kladi",
    name: "Pasar Seni Sukawati & Jajan Pan Kladi",
    shortName: "Pasar Seni & Jajan Pan Kladi",
    banjar: "Banjar Gelulung",
    phase: "sore",
    phaseLabel: "Sore Hari",
    category: "Belanja Seni & Jajanan Khas",
    timeEst: "17:15 - 18:15 WITA",
    duration: "60 Menit",
    activity: "Belanja Cendera Mata & Kuliner Legendaris",
    desc: "Berburu karya seni dan kerajinan khas Bali di Pasar Seni Sukawati sembari mencicipi legitnya Jajan Pan Kladi.",
    x: 18,
    y: 54,
    iconKey: "market",
  },
  {
    step: 11,
    slug: "puri-ageng-sukawati",
    name: "Puri Ageng Sukawati – Banjar Mudita",
    shortName: "Puri Ageng Sukawati",
    banjar: "Banjar Mudita",
    phase: "malam",
    phaseLabel: "Malam Hari",
    category: "Warisan Sejarah Kerajaan",
    timeEst: "18:30 - 19:15 WITA",
    duration: "45 Menit",
    activity: "Mengenal Sejarah Kerajaan Sukawati",
    desc: "Istana megah kediaman bangsawan Sukawati dengan keindahan arsitektur tradisional dan kisah masa kejayaan kerajaan.",
    x: 28,
    y: 36,
    iconKey: "crown",
  },
  {
    step: 12,
    slug: "pertunjukan-tari-kecak-dan-tari-legong",
    name: "Pertunjukan Tari Kecak & Tari Legong",
    shortName: "Tari Kecak & Legong",
    banjar: "Pura Penataran Agung",
    phase: "malam",
    phaseLabel: "Malam Hari",
    category: "Puncak Seni Budaya Malam",
    timeEst: "19:30 - 20:30 WITA",
    duration: "60 Menit",
    activity: "Menyaksikan Pagelaran Magis Tari Bali",
    desc: "Penutup perjalanan yang memukau: gerakan dinamis Tari Kecak dan keanggunan Tari Legong di pelataran pura suci.",
    x: 48,
    y: 38,
    iconKey: "flame",
  },
];

export function DenahRuteSukawati({ destinations }: { destinations?: Destination[] }) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"map" | "timeline">("map");
  const [showAllLabels, setShowAllLabels] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const activePoint = ROUTE_POINTS.find((p) => p.step === activeStep) || ROUTE_POINTS[0];
  
  // Ambil data foto dari destinations jika tersedia
  const destinationDetail = destinations?.find((d) => d.slug === activePoint.slug);
  const activePhoto = destinationDetail?.photo_url || 
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80";

  // Filter titik sesuai fase yang dipilih
  const filteredPoints = selectedPhase === "all" 
    ? ROUTE_POINTS 
    : ROUTE_POINTS.filter((p) => p.phase === selectedPhase);

  // Auto-Play Tour: maju otomatis setiap 3.5 detik
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (selectedPhase === "all") {
          return prev < 12 ? prev + 1 : 1;
        }
        const phaseObj = PHASES.find((p) => p.id === selectedPhase);
        if (!phaseObj || !("steps" in phaseObj)) return 1;
        const steps = phaseObj.steps as readonly number[];
        const currentIndex = steps.indexOf(prev);
        if (currentIndex === -1 || currentIndex === steps.length - 1) {
          return steps[0];
        }
        return steps[currentIndex + 1];
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlaying, selectedPhase]);

  // Navigasi keyboard (Arrow Left & Arrow Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") {
        setActiveStep((prev) => (prev < 12 ? prev + 1 : 1));
      } else if (e.key === "ArrowLeft") {
        setActiveStep((prev) => (prev > 1 ? prev - 1 : 12));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Tangani klik filter fase
  const handlePhaseChange = (phaseId: string) => {
    setSelectedPhase(phaseId);
    if (phaseId !== "all") {
      const phaseObj = PHASES.find((p) => p.id === phaseId);
      if (phaseObj && "steps" in phaseObj && phaseObj.steps.length > 0) {
        if (!phaseObj.steps.includes(activeStep as never)) {
          setActiveStep(phaseObj.steps[0]);
        }
      }
    }
  };

  // Google Maps Search URL
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    activePoint.name + " Sukawati Gianyar Bali"
  )}`;

  return (
    <div className="space-y-6">
      
      {/* ── 1. HEADER CONTROL BAR DENGAN FILTER FASE & TOGGLE VIEW ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Peta Jelajah Interaktif Sukawati
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              1 Hari Penuh · 12 Destinasi
            </span>
          </div>
          <h3 
            className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Alur Perjalanan Wisata Budaya
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
            Jelajahi titik perjalanan dari pagi hingga malam hari dengan panduan visual terpadu:
          </p>
        </div>

        {/* View Mode Switcher (Peta vs Garis Waktu) */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <div className="bg-neutral-100 p-1 rounded-2xl flex items-center border border-neutral-200/80 text-xs font-semibold">
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === "map"
                  ? "bg-white text-emerald-800 shadow-sm font-bold"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Denah Peta</span>
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === "timeline"
                  ? "bg-white text-emerald-800 shadow-sm font-bold"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Garis Waktu</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. FILTER WAKTU (PAGI / SIANG / SORE / MALAM) & TUR AUTO-PLAY ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-50/80 p-2.5 sm:p-3 rounded-2xl border border-neutral-200/80">
        
        {/* Tombol Fase Waktu */}
        <div className="flex flex-wrap items-center gap-1.5">
          {PHASES.map((ph) => {
            const isSelected = selectedPhase === ph.id;
            const Icon = ph.icon;
            return (
              <button
                key={ph.id}
                onClick={() => handlePhaseChange(ph.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-500/20"
                    : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/70"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{ph.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? "bg-emerald-800 text-emerald-100" : "bg-neutral-100 text-neutral-500"
                }`}>
                  {ph.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Kontrol Tur Otomatis & Toggle Label */}
        <div className="flex items-center gap-2">
          {viewMode === "map" && (
            <button
              onClick={() => setShowAllLabels(!showAllLabels)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                showAllLabels 
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800" 
                  : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              }`}
              title="Tampilkan semua nama lokasi pada peta secara bersamaan"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Label Lokasi:</span>
              <span>{showAllLabels ? "Semua" : "Fokus"}</span>
            </button>
          )}

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isPlaying
                ? "bg-amber-600 hover:bg-amber-700 text-white animate-pulse"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Jeda Tur</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Mulai Tur Rute</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── 3. TAMPILAN UTAMA (MODE PETA ATAU MODE TIMELINE) ── */}
      {viewMode === "map" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ── KANVAS DENAH PETA VISUAL (8 Kolom) ── */}
          <div className="lg:col-span-8 bg-white/95 rounded-3xl border-2 border-emerald-200/80 p-4 sm:p-5 shadow-sm select-none">
            
            {/* Bingkai Peta Interaktif (Semua elemen visual & overlay geografis terisolasi di dalam bingkai ini) */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] bg-gradient-to-b from-[#f2f7f4] via-[#eaf3ed] to-[#dfeee4] rounded-2xl border border-emerald-200/80 overflow-hidden shadow-inner">
              
              {/* Kompas Orientasi Modern */}
              <div className="absolute top-3 right-3 z-20 flex flex-col items-center bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-emerald-200/80">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shadow">
                  U
                </div>
                <span className="text-[8px] font-bold text-neutral-400 mt-0.5 tracking-tighter">UBUD</span>
                <div className="w-px h-2 bg-neutral-200 my-0.5" />
                <span className="text-[8px] font-bold text-neutral-400 tracking-tighter">LAUT</span>
                <span className="text-[9px] font-bold text-neutral-700">S</span>
              </div>

              {/* Label Wilayah Utara (Di dalam bingkai peta) */}
              <div className="absolute top-3 left-3 z-20 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 bg-white/85 backdrop-blur-sm px-2.5 py-1 rounded-full border border-emerald-200/70 pointer-events-none shadow-xs">
                Wilayah Utara · Sentra Hunian & Budaya
              </div>
              
              {/* Label Wilayah Selatan (Di dalam bingkai peta di atas pantai, tidak menumpuk kontrol tombol bawah) */}
              <div className="absolute bottom-3 left-3 z-20 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-teal-800/90 bg-white/85 backdrop-blur-sm px-2.5 py-1 rounded-full border border-teal-200/70 pointer-events-none shadow-xs">
                Wilayah Selatan · Pesisir Pantai Purnama
              </div>

              {/* Label Aliran Sungai Petanu (Di dalam bingkai peta) */}
              <div className="absolute top-1/2 right-2 -translate-y-1/2 z-20 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-teal-800/80 rotate-90 pointer-events-none origin-right flex items-center gap-1 bg-white/75 backdrop-blur-sm px-2 py-0.5 rounded-md border border-teal-200/60 shadow-xs">
                <span>Sungai Petanu</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </div>

              {/* SVG Canvas Map */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none" 
                viewBox="0 0 1000 650"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Gradient Garis Rute Utama */}
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="35%" stopColor="#0d9488" />
                    <stop offset="70%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>

                  {/* Gradient Sungai Petanu */}
                  <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#99f6e4" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#5eead4" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.9" />
                  </linearGradient>

                  {/* Pola latar belakang kontur pedesaan */}
                  <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(16, 185, 129, 0.05)" strokeWidth="1" />
                  </pattern>
                </defs>

                {/* Pola Garis Grid Halus */}
                <rect width="1000" height="650" fill="url(#gridPattern)" />

                {/* Kontur Sawah / Subak (Curves Ilustratif di Latar Belakang) */}
                <path
                  d="M 50 180 C 180 120, 260 220, 420 180 C 580 140, 680 200, 750 160"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="4 8"
                  opacity="0.25"
                />
                <path
                  d="M 80 420 C 220 380, 320 480, 520 430 C 660 390, 720 450, 800 410"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="4 8"
                  opacity="0.2"
                />

                {/* Garis Aliran Sungai Petanu di Sisi Timur */}
                <path
                  d="M 870 0 C 910 140, 760 280, 840 430 C 880 500, 830 580, 810 650"
                  fill="none"
                  stroke="url(#riverGradient)"
                  strokeWidth="24"
                  strokeLinecap="round"
                />

                {/* Arus Air Sungai (Garis Putus-Putus Halus di Tengah Sungai) */}
                <path
                  d="M 870 0 C 910 140, 760 280, 840 430 C 880 500, 830 580, 810 650"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeDasharray="10 14"
                  opacity="0.75"
                />

                {/* Pesisir Pantai Purnama di Sisi Selatan */}
                <path
                  d="M 380 650 C 550 580, 750 610, 1000 580 L 1000 650 Z"
                  fill="#99f6e4"
                  opacity="0.4"
                />
                <path
                  d="M 450 650 C 620 600, 820 625, 1000 605"
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="3"
                  strokeDasharray="6 8"
                  opacity="0.5"
                />

                {/* ── GARIS ALUR RUTE 1 S/D 12 ── */}
                {/* 1. Halo Garis Putih */}
                <path
                  d="M 160 130 C 260 100, 300 95, 360 98 C 470 100, 520 102, 580 104 C 680 110, 740 120, 780 143 C 840 170, 890 190, 880 228 C 870 270, 860 300, 840 325 C 800 370, 760 390, 720 423 C 650 480, 600 520, 540 533 C 440 520, 390 490, 340 468 C 260 430, 200 400, 180 351 C 160 290, 210 250, 280 234 C 360 240, 420 242, 480 247"
                  fill="none"
                  stroke="white"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.85"
                />

                {/* 2. Garis Rute Hijau Zamrud Beranimasi Putus-Putus */}
                <path
                  d="M 160 130 C 260 100, 300 95, 360 98 C 470 100, 520 102, 580 104 C 680 110, 740 120, 780 143 C 840 170, 890 190, 880 228 C 870 270, 860 300, 840 325 C 800 370, 760 390, 720 423 C 650 480, 600 520, 540 533 C 440 520, 390 490, 340 468 C 260 430, 200 400, 180 351 C 160 290, 210 250, 280 234 C 360 240, 420 242, 480 247"
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="4.5"
                  strokeDasharray="8 8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* ── 12 PIN TITIK RUTE PADA DENAH ── */}
              {ROUTE_POINTS.map((pt) => {
                const isActive = pt.step === activeStep;
                const isHovered = pt.step === hoveredStep;
                const isInSelectedPhase = selectedPhase === "all" || pt.phase === selectedPhase;

                // Warna badge fase
                const phaseBg = 
                  pt.phase === "pagi" ? "bg-emerald-600 text-white" :
                  pt.phase === "siang" ? "bg-amber-600 text-white" :
                  pt.phase === "sore" ? "bg-teal-700 text-white" :
                  "bg-purple-700 text-white";

                return (
                  <div
                    key={pt.step}
                    onClick={() => setActiveStep(pt.step)}
                    onMouseEnter={() => setHoveredStep(pt.step)}
                    onMouseLeave={() => setHoveredStep(null)}
                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-all duration-300 focus:outline-none ${
                      isInSelectedPhase ? "opacity-100 scale-100" : "opacity-35 hover:opacity-90 scale-95"
                    }`}
                  >
                    {/* Efek Lingkaran Aktif Berdenyut (Concentric Ring) */}
                    {isActive && (
                      <>
                        <span className="absolute -inset-3 rounded-full bg-emerald-500/30 animate-ping" />
                        <span className="absolute -inset-1.5 rounded-full bg-emerald-500/40 animate-pulse" />
                      </>
                    )}

                    {/* Pin Container Utama Modern */}
                    <div
                      className={`relative flex items-center justify-center rounded-2xl transition-all duration-300 shadow-md ${
                        isActive
                          ? "w-11 h-11 bg-emerald-700 text-white ring-4 ring-emerald-300 shadow-xl shadow-emerald-900/40 scale-110 rotate-0"
                          : isHovered
                          ? "w-10 h-10 bg-emerald-600 text-white scale-105 shadow-lg"
                          : "w-8 h-8 sm:w-9 sm:h-9 bg-white text-neutral-800 border-2 border-emerald-600/70 hover:border-emerald-700"
                      }`}
                    >
                      {/* Nomor Titik */}
                      <span className="font-extrabold text-xs sm:text-sm">
                        {pt.step}
                      </span>

                      {/* Micro Badge Vektor Icon di Sudut */}
                      <span className={`absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs border ${
                        isActive ? "bg-white text-emerald-800 border-emerald-500" : `${phaseBg} border-white`
                      }`}>
                        {getPointIcon(pt.iconKey, "w-2.5 h-2.5")}
                      </span>
                    </div>

                    {/* ── TOOLTIP NAMA LOKASI (CLEAN & NON-OVERLAPPING) ── */}
                    {/* Selalu tampil jika: (1) Active, atau (2) Sedang di-hover, atau (3) Mode showAllLabels aktif */}
                    {(isActive || isHovered || showAllLabels) && (
                      <div 
                        className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-xl text-[11px] font-bold shadow-lg transition-all pointer-events-none z-30 ${
                          pt.y > 60 ? "bottom-full mb-2" : "top-full mt-2"
                        } ${
                          isActive
                            ? "bg-neutral-900/95 backdrop-blur-md text-white ring-1 ring-emerald-400/50 shadow-emerald-950/30"
                            : "bg-white/95 backdrop-blur-md text-neutral-800 border border-neutral-200/90 shadow-md"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-400" : "bg-neutral-400"}`} />
                          <span>{pt.shortName}</span>
                          <span className="text-[9px] opacity-70 font-normal">· {pt.timeEst.split(" ")[0]}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── SEGMENTED TIMELINE TRACKER 1 - 12 (BAWAH PETA) ── */}
            <div className="mt-4 pt-4 border-t border-emerald-200/60">
              <div className="flex items-center justify-between text-xs text-neutral-600 mb-2 font-medium">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  Kemajuan Rute: Titik #{activePoint.step} dari 12 ({activePoint.phaseLabel})
                </span>
                <span className="text-[11px] text-neutral-500 font-bold">
                  {Math.round((activeStep / 12) * 100)}% Selesai
                </span>
              </div>

              {/* Bar Progress Rute */}
              <div className="w-full h-1.5 bg-neutral-200/80 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-700 transition-all duration-500 rounded-full"
                  style={{ width: `${(activeStep / 12) * 100}%` }}
                />
              </div>

              {/* Tombol Step 1 - 12 Mini */}
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                {ROUTE_POINTS.map((pt) => {
                  const isCurrent = pt.step === activeStep;
                  return (
                    <button
                      key={pt.step}
                      onClick={() => setActiveStep(pt.step)}
                      title={`${pt.step}. ${pt.name}`}
                      className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? "bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400 scale-105"
                          : "bg-white/80 hover:bg-white text-neutral-700 border border-neutral-200/60 hover:border-emerald-300"
                      }`}
                    >
                      <span className="text-[11px]">#{pt.step}</span>
                      <span className="text-[9px] font-normal truncate max-w-full hidden sm:inline">
                        {pt.timeEst.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── PANEL INSPEKTOR TITIK AKTIF (4 Kolom) ── */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200/90 shadow-md p-6 flex flex-col justify-between space-y-5">
            <div>
              {/* Header Card Titik Aktif */}
              <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  {getPointIcon(activePoint.iconKey, "w-3.5 h-3.5 text-emerald-700")}
                  <span>Titik #{activePoint.step} dari 12</span>
                </span>
                <span className="text-xs font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  {activePoint.duration}
                </span>
              </div>

              {/* Foto Destinasi Aktif */}
              <div className="mt-4 relative aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-inner group">
                <img
                  src={activePhoto}
                  alt={activePoint.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Badge Banjar */}
                <div className="absolute top-3 left-3 bg-neutral-900/75 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{activePoint.banjar}</span>
                </div>

                {/* Badge Waktu Kunjungan */}
                <div className="absolute bottom-3 right-3 bg-neutral-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/10">
                  {activePoint.timeEst}
                </div>
              </div>

              {/* Kategori & Nama */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                    {activePoint.category}
                  </span>
                  <span className="text-[11px] font-medium text-neutral-400">
                    Fase {activePoint.phaseLabel}
                  </span>
                </div>

                <h4 
                  className="text-xl font-bold text-neutral-900 leading-snug"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {activePoint.name}
                </h4>

                {/* Aktivitas Pengunjung */}
                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-100/90 text-xs text-emerald-900 leading-relaxed">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Aktivitas Utama:</span>
                  </div>
                  <p>{activePoint.activity}</p>
                </div>

                {/* Deskripsi */}
                <p className="text-xs text-neutral-600 leading-relaxed pt-1">
                  {activePoint.desc}
                </p>
              </div>
            </div>

            {/* Tombol Aksi & Navigasi */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-100">
              <Link
                to="/destinasi/$slug"
                params={{ slug: activePoint.slug }}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
              >
                <span>Buka Profil & Foto Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-2.5 px-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                <span>Navigasi via Google Maps</span>
              </a>

              {/* Tombol Sebelumnya & Berikutnya */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => setActiveStep((prev) => (prev > 1 ? prev - 1 : 12))}
                  className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-3 border border-neutral-200 hover:border-emerald-500 text-neutral-700 hover:text-emerald-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Sebelumnya</span>
                </button>
                <button
                  onClick={() => setActiveStep((prev) => (prev < 12 ? prev + 1 : 1))}
                  className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-3 border border-neutral-200 hover:border-emerald-500 text-neutral-700 hover:text-emerald-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* ── 4. TAMPILAN MODE GARIS WAKTU / TIMELINE ITINERARY ── */
        <div className="space-y-6">
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Berikut susunan jadwal kronologis rute perjalanan 1 hari penuh di Desa Wisata Sukawati:</span>
            </div>
            <button
              onClick={() => setViewMode("map")}
              className="font-bold underline text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              Kembali ke Denah Peta
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPoints.map((pt) => {
              const itemPhoto = destinations?.find((d) => d.slug === pt.slug)?.photo_url || 
                "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80";
              const isSelected = pt.step === activeStep;

              return (
                <div
                  key={pt.step}
                  onClick={() => setActiveStep(pt.step)}
                  className={`bg-white rounded-2xl border p-4 flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                      : "border-neutral-200 hover:border-emerald-300 hover:shadow-sm"
                  }`}
                >
                  <div>
                    {/* Header Item */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        {getPointIcon(pt.iconKey, "w-3 h-3 text-emerald-700")}
                        <span>Titik #{pt.step}</span>
                      </span>
                      <span className="text-neutral-500 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        {pt.timeEst}
                      </span>
                    </div>

                    {/* Thumbnail */}
                    <div className="aspect-[16/9] rounded-xl overflow-hidden bg-neutral-100 mb-3 relative">
                      <img
                        src={itemPhoto}
                        alt={pt.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md">
                        {pt.banjar}
                      </span>
                    </div>

                    <h4 className="font-bold text-neutral-900 text-sm leading-snug mb-1">
                      {pt.name}
                    </h4>
                    <p className="text-xs text-emerald-700 font-medium mb-2">
                      {pt.activity}
                    </p>
                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <Link
                      to="/destinasi/$slug"
                      params={{ slug: pt.slug }}
                      className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <span>Lihat Profil</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-neutral-400 font-medium">{pt.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
