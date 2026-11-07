import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteChrome } from "@/components/SiteChrome";
import { fetchDestinations, GROUPS, ROUTE_SCHEDULES } from "@/lib/supabase";
import { ChevronRight, Play, Sparkles, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/destinasi/")({
  head: () => ({
    meta: [
      { title: "Daya Tarik & Aktivitas — Desa Wisata Sukawati" },
      { name: "description", content: "Daftar lengkap daya tarik wisata, akomodasi homestay, seni budaya, kerajinan, kuliner, dan rute perjalanan Desa Sukawati, Gianyar, Bali." },
    ],
  }),
  component: DestinasiIndex,
});

export function DestinasiIndex() {
  const [group, setGroup] = useState("all");
  const { data, isLoading, error } = useQuery({ queryKey: ["destinations"], queryFn: () => fetchDestinations() });
  const items = (data ?? []).filter((d) => group === "all" || d.group_type === group);

  const filterTabs = [
    { key: "all", label: "Semua Daya Tarik" },
    { key: "akomodasi", label: "Akomodasi & Homestay" },
    { key: "budaya", label: "Seni, Budaya & Tradisi" },
    { key: "kerajinan", label: "Kerajinan Tradisional" },
    { key: "kuliner", label: "Kuliner, Alam & Rekreasi" },
    { key: "sejarah", label: "Sejarah & Pertunjukan" },
  ];

  return (
    <SiteChrome>
      <div className="bg-gradient-to-b from-white via-neutral-50/40 to-white min-h-screen pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-12 text-center flex flex-col items-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Katalog Wisata Budaya</span>
            </span>
            <h1 
              className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Daya Tarik Wisata dan Aktivitas
            </h1>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              Jelajahi keindahan tradisi, proses kreatif para perajin, warisan sejarah kerajaan, hingga kelezatan kuliner lokal di Desa Sukawati, Gianyar, Bali.
            </p>
          </div>

          {/* Filter Kategori */}
          <div className="flex flex-wrap gap-2.5 mb-12 justify-center">
            {filterTabs.map(({ key, label }) => (
              <button 
                key={key} 
                onClick={() => setGroup(key)}
                className={`rounded-full border px-5 py-2 text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  group === key 
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-sm" 
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/40"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {isLoading && <p className="text-center text-neutral-500 py-16">Memuat data destinasi...</p>}
          {error && <p className="text-center text-red-500 py-16">Gagal memuat data destinasi.</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((d) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15" />
                
                {/* Badge Nomor Rute (Urutan 1 s/d 12) */}
                <div className="absolute top-4 left-4 bg-emerald-700/95 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-emerald-500/40">
                  <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Titik Rute #{d.sort_order}</span>
                </div>

                {/* Video badge */}
                {d.video_url && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-full px-2.5 py-1 text-white text-[11px] font-medium flex items-center gap-1.5 border border-white/20 shadow-sm">
                    <Play className="w-3 h-3 fill-white" />
                    <span>Video</span>
                  </div>
                )}

                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                  <div className="flex flex-col gap-1 drop-shadow-md min-w-0">
                    <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                      {GROUPS[d.group_type] ?? d.group_type}
                    </span>
                    <h3 className="text-white text-lg font-bold leading-tight">
                      {d.name}
                    </h3>
                    
                    {/* Jam Terhubung: Jadwal Tur Rute & Jam Buka Operasional */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px]">
                      <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-xs text-emerald-200 px-2 py-0.5 rounded-md border border-white/10">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>Tur: {d.tour_schedule || ROUTE_SCHEDULES[d.sort_order]?.timeEst || "-"}</span>
                      </span>
                      {d.opening_hours && (
                        <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-xs text-neutral-300 px-2 py-0.5 rounded-md border border-white/10 truncate max-w-[180px]" title={d.opening_hours}>
                          <span>Buka: {d.opening_hours}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-10 w-10 shrink-0 rounded-full border border-white/80 text-white flex items-center justify-center transition-all group-hover:bg-white group-hover:text-black">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}

            {items.length === 0 && !isLoading && (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-neutral-200 p-8 text-neutral-500">
                Belum ada destinasi yang terdaftar untuk kategori ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
