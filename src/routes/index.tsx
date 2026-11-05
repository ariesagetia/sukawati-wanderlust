import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import hero from "@/assets/hero.jpg";
import { SiteChrome } from "@/components/SiteChrome";
import { DenahRuteSukawati } from "@/components/DenahRuteSukawati";
import { fetchDestinations, fetchSetting, GROUPS, type Destination } from "@/lib/supabase";
import { 
  ChevronRight, 
  Play, 
  Sparkles, 
  Compass, 
  MapPin, 
  Palette, 
  Utensils, 
  Waves, 
  Landmark, 
  Users, 
  HeartHandshake, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Desa Wisata Sukawati — Wisata Berbasis Budaya, Seni, Tradisi Bali" },
      { name: "description", content: "Discover the Culture, Art, and Authentic Life of Bali. Jelajahi 12 rute perjalanan budaya, seni tradisi, kerajinan, dan kuliner Desa Sukawati, Gianyar, Bali." },
      { property: "og:title", content: "Desa Wisata Sukawati — Discover the Culture, Art, and Authentic Life of Bali" },
      { property: "og:description", content: "Wisata berbasis budaya, seni, tradisi, kerajinan, dan kehidupan masyarakat lokal di Sukawati, Gianyar, Bali." },
    ],
  }),
  component: Index,
});

function Index() {
  const [selectedGroup, setSelectedGroup] = useState("all");
  const { data: destinations = [], isLoading, error } = useQuery({ 
    queryKey: ["destinations"], 
    queryFn: () => fetchDestinations() 
  });
  const { data: heroImage } = useQuery({ 
    queryKey: ["setting", "hero_image"], 
    queryFn: () => fetchSetting("hero_image") 
  });

  const filteredItems = destinations.filter((d) => {
    if (selectedGroup === "all") return true;
    return d.group_type === selectedGroup;
  });

  return (
    <SiteChrome>
      {/* ── 1. HERO SECTION (Halaman 1 & 2 Dokumen) ── */}
      <section className="relative min-h-[92vh] w-full overflow-hidden flex flex-col items-center justify-center text-center px-5 pt-28 pb-20">
        <img
          src={heroImage || hero}
          alt="Desa Wisata Sukawati"
          className="absolute inset-0 h-full w-full object-cover scale-105 animate-pulse duration-[8000ms]"
        />
        {/* Layer Gradient Elegan */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-black/40" />
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-white">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-xs md:text-sm font-semibold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Desa Wisata Sukawati · Gianyar, Bali</span>
          </div>

          <h1 
            className="text-5xl sm:text-6xl md:text-8xl font-bold leading-tight tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            DESA WISATA <br /><span className="text-emerald-400 font-light">SUKAWATI</span>
          </h1>

          <p className="mt-4 text-base sm:text-xl md:text-2xl text-emerald-200 font-serif italic tracking-wide">
            "Discover the Culture, Art, and Authentic Life of Bali."
          </p>

          <p className="mt-6 text-sm sm:text-base md:text-lg text-neutral-200 max-w-2xl leading-relaxed drop-shadow">
            Selamat datang di Desa Wisata Sukawati, sebuah destinasi wisata berbasis budaya di Kabupaten Gianyar, Bali. Menawarkan pengalaman wisata yang memadukan kekayaan seni, tradisi, kerajinan, spiritualitas, kuliner, serta kehidupan masyarakat lokal.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a 
              href="#rute" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-emerald-900/50 hover:shadow-emerald-700/60 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Lihat Denah Rute Wisata</span>
            </a>
            <Link 
              to="/destinasi" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all cursor-pointer"
            >
              <span>Semua Daya Tarik</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/60 text-[11px] uppercase tracking-widest gap-1">
          <span>Gulir ke bawah</span>
          <div className="w-4 h-7 rounded-full border border-white/40 flex items-start justify-center p-1">
            <div className="w-1 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── 2. TENTANG DESA WISATA SUKAWATI (Halaman 2 Dokumen) ── */}
      <section id="about" className="py-24 px-6 bg-gradient-to-b from-white to-emerald-50/40 text-neutral-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200">
                Profil & Warisan Budaya
              </span>
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Tentang Desa Wisata Sukawati
              </h2>
              <p className="text-neutral-700 leading-relaxed text-base sm:text-lg">
                Desa Sukawati merupakan salah satu kawasan yang dikenal memiliki kekayaan seni dan budaya di Kabupaten Gianyar. Identitas Sukawati tumbuh melalui keberadaan seniman, perajin, pelaku seni pertunjukan, serta masyarakat yang terus menjaga dan mengembangkan tradisi Bali.
              </p>
              <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
                Potensi wisata Desa Sukawati tidak hanya terletak pada objek wisata, tetapi juga pada aktivitas masyarakat yang menjadi bagian dari kehidupan sehari-hari. Mulai dari kerajinan tradisional, seni lukis, seni musik, seni tari, kuliner, hingga kawasan pasar seni yang telah dikenal luas.
              </p>
              <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm">
                <p className="text-emerald-900 font-medium text-sm leading-relaxed italic">
                  "Melalui pengembangan desa wisata berbasis budaya, Sukawati berupaya menghadirkan pengalaman wisata yang memberikan manfaat bagi masyarakat sekaligus memperkenalkan warisan budaya Bali kepada generasi mendatang."
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
                  🏛️
                </div>
                <h3 className="font-bold text-neutral-900 text-lg">Spiritual & Tradisi</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Pura Desa lan Puseh serta Puri Ageng Sukawati yang melambangkan keagungan cagar budaya dan spiritualitas Hindu Bali.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
                  🎭
                </div>
                <h3 className="font-bold text-neutral-900 text-lg">Seniman & Sanggar</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Pusat pelatihan tari, seni rupa, vokal, dan wayang kulit yang terus melestarikan kesenian Bali untuk generasi penerus.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
                  🔨
                </div>
                <h3 className="font-bold text-neutral-900 text-lg">Kerajinan Autentik</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Keahlian tempa pandai besi, seni ukir wayang, dan busana kamen prada Bali yang diwariskan turun-temurun.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
                  🍲
                </div>
                <h3 className="font-bold text-neutral-900 text-lg">Kuliner & Rekreasi</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Kenikmatan Jajan Pan Kladi legendaris, santap siang di tepi Sungai Petanu, hingga pesisir Pantai Purnama.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. PENGALAMAN YANG BISA DINIKMATI (Halaman 4 Dokumen, Butir 5) ── */}
      <section id="pengalaman" className="py-24 px-6 bg-neutral-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-3.5 py-1 rounded-full border border-emerald-800">
              Aktivitas Wisatawan
            </span>
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Pengalaman yang Bisa Dinikmati
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Ragam pengalaman budaya Bali yang autentik, berkesan, dan membawa Anda lebih dekat dengan kehidupan masyarakat Sukawati.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Cultural Experience */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/50 hover:bg-neutral-900 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Landmark className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Cultural Experience</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Mengenal tradisi, kerajinan, sejarah, dan kehidupan masyarakat lokal Sukawati secara langsung dari warga asli.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-800/80 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <span>Pura & Warisan Sejarah</span>
              </div>
            </div>

            {/* 2. Art & Performance */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/50 hover:bg-neutral-900 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Palette className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Art & Performance</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Menyaksikan dan mengenal seni tari, musik gender wayang, seni pertunjukan pewayangan, serta keindahan seni lukis.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-800/80 text-[11px] text-teal-400 font-semibold flex items-center gap-1">
                <span>Tari Kecak, Legong & Wayang</span>
              </div>
            </div>

            {/* 3. Local Culinary */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/50 hover:bg-neutral-900 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Utensils className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Local Culinary</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Menikmati kuliner dan jajanan khas masyarakat Sukawati, termasuk sajian legendaris Jajan Pan Kladi dan bistro tepi sungai.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-800/80 text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                <span>Kuliner Tradisional & Bistro</span>
              </div>
            </div>

            {/* 4. Nature & Recreation */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/50 hover:bg-neutral-900 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Waves className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Nature & Recreation</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Menikmati pantai pasir hitam Purnama, jogging track pemandangan sawah Sudamala, dan suasana asri pedesaan Bali.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-800/80 text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
                <span>Pantai Purnama & Jogging Track</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. RUTE PERJALANAN WISATA: KEMASAN DENAH VISUAL (Halaman 4 Dokumen) ── */}
      <section id="rute" className="py-24 px-6 bg-white text-neutral-900 border-b border-neutral-100">
        <div className="max-w-6xl mx-auto">
          {/* Komponen Denah Rute Interaktif Sukawati */}
          <DenahRuteSukawati destinations={destinations} />
        </div>
      </section>

      {/* ── 5. KATALOG DAYA TARIK WISATA DAN AKTIVITAS (Halaman 2 & 3 Dokumen) ── */}
      <section id="destinasi" className="py-24 px-6 bg-gradient-to-b from-neutral-50/70 to-white text-neutral-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Katalog Lengkap
            </span>
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mt-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Daya Tarik Wisata dan Aktivitas
            </h2>
            <p className="text-neutral-600 mt-3 text-sm sm:text-base leading-relaxed">
              Jelajahi 12 potensi unggulan Desa Sukawati berdasarkan kategori minat: akomodasi homestay, seni budaya, kerajinan, kuliner, dan pertunjukan tradisi.
            </p>
          </div>

          {/* Filter Pills Tematik */}
          <div className="flex flex-wrap gap-2.5 mb-12 justify-center">
            <button 
              onClick={() => setSelectedGroup("all")}
              className={`rounded-full border px-5 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                selectedGroup === "all" 
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-sm" 
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/40"
              }`}
            >
              Semua Daya Tarik ({destinations.length})
            </button>
            {Object.entries(GROUPS)
              .filter(([k]) => ["akomodasi", "budaya", "kerajinan", "kuliner", "sejarah"].includes(k))
              .map(([k, v]) => {
                const count = destinations.filter(d => d.group_type === k).length;
                return (
                  <button 
                    key={k} 
                    onClick={() => setSelectedGroup(k)}
                    className={`rounded-full border px-5 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                      selectedGroup === k 
                        ? "border-emerald-600 bg-emerald-600 text-white shadow-sm" 
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/40"
                    }`}
                  >
                    {v} {count > 0 ? `(${count})` : ""}
                  </button>
                );
            })}
          </div>

          {isLoading && <p className="text-center text-neutral-500 py-12">Memuat daftar destinasi...</p>}
          {error && <p className="text-center text-red-500 py-12">Gagal memuat data.</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((d) => (
              <Link 
                key={d.id} 
                to="/destinasi/$slug" 
                params={{ slug: d.slug }} 
                className="group relative aspect-[4/5] sm:aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden block shadow-sm border border-neutral-200/60"
              >
                {d.photo_url ? (
                  <img 
                    src={d.photo_url} 
                    alt={d.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-800" />
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
                
                {/* Route Order Badge di Kiri Atas */}
                <div className="absolute top-4 left-4 bg-emerald-700/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-emerald-500/40">
                  <MapPin className="w-3 h-3 text-emerald-300" />
                  <span>Rute #{d.sort_order}</span>
                </div>

                {/* Video Badge di Kanan Atas jika ada */}
                {d.video_url && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-full px-2.5 py-1 text-white text-[11px] font-medium flex items-center gap-1.5 border border-white/20 shadow-sm">
                    <Play className="w-3 h-3 fill-white" />
                    <span>Video</span>
                  </div>
                )}

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                  <div className="flex flex-col gap-1 drop-shadow-md">
                    <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                      {GROUPS[d.group_type] ?? d.group_type}
                    </span>
                    <h3 className="text-white text-lg font-bold leading-tight">
                      {d.name}
                    </h3>
                  </div>
                  <div className="h-10 w-10 shrink-0 rounded-full border border-white/80 text-white flex items-center justify-center transition-all group-hover:bg-white group-hover:text-black">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link 
              to="/destinasi"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-800 px-8 py-3 text-sm font-semibold hover:border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm cursor-pointer"
            >
              Buka Direktori Lengkap Semua Daya Tarik
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. MENGAPA BERKUNJUNG (Halaman 4 Dokumen, Butir 6) ── */}
      <section id="why-visit" className="py-24 px-6 bg-white text-neutral-900 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Nilai & Keunggulan
            </span>
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Mengapa Berkunjung ke Desa Wisata Sukawati?
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base">
              Empat alasan utama yang menjadikan perjalanan ke Sukawati penuh makna dan berkesan:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-5 p-6 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-lg text-neutral-900">Authentic Cultural Experience</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Mengenal budaya Bali langsung dari masyarakat dan pelaku seni asli di desa, bukan sekadar atraksi buatan.
                </p>
              </div>
            </div>

            <div className="flex gap-5 p-6 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-lg text-neutral-900">Local Community Empowerment</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Mendukung usaha, kerajinan, sanggar, dan aktivitas ekonomi masyarakat lokal demi keberlanjutan tradisi.
                </p>
              </div>
            </div>

            <div className="flex gap-5 p-6 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-lg text-neutral-900">Diverse Attractions</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Menikmati kombinasi lengkap wisata budaya, sejarah kerajaan, seni rupa, pertunjukan tari, kuliner khas, dan keindahan alam.
                </p>
              </div>
            </div>

            <div className="flex gap-5 p-6 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-md">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-lg text-neutral-900">Meaningful Journey</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Mendapatkan pengalaman dan wawasan berharga yang lebih dekat dengan filosofi dan keharmonisan hidup masyarakat Bali.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. PENUTUP WEBSITE (Halaman 4 & 5 Dokumen, Butir 7) ── */}
      <section className="bg-gradient-to-br from-emerald-800 via-teal-900 to-neutral-950 text-white py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <span className="text-xs uppercase font-bold tracking-[0.3em] text-emerald-300">
            Sukawati – Where Culture Comes Alive
          </span>
          <h2 
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Come, Explore, Experience, and Celebrate Sukawati!
          </h2>
          <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-light">
            Setiap sudut Desa Sukawati menyimpan cerita, kreativitas, dan tradisi yang patut dikenal. Melalui perjalanan wisata ini, mari bersama-sama menjaga warisan budaya, mendukung masyarakat lokal, dan memperkenalkan keunikan Sukawati kepada dunia.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <a 
              href="https://wa.me/6281234567890?text=Halo%20Desa%20Wisata%20Sukawati,%20saya%20ingin%20reservasi%20dan%20informasi%20rute%20wisata."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold px-8 py-3.5 rounded-full shadow-lg transition-all cursor-pointer text-sm"
            >
              <span>Reservasi & Informasi Kunjungan</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link 
              to="/destinasi"
              className="inline-flex items-center gap-2 border border-white/40 hover:bg-white/10 text-white font-medium px-8 py-3.5 rounded-full transition-all text-sm"
            >
              <span>Telusuri Destinasi</span>
            </Link>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
