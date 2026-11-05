import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteChrome } from "@/components/SiteChrome";
import { fetchDestination, getYouTubeEmbedUrl } from "@/lib/supabase";
import { MapPin, Clock, Phone, Tag, Instagram, ExternalLink, ArrowLeft, Play } from "lucide-react";

export const Route = createFileRoute("/destinasi/$slug")({
  head: ({ params }) => {
    const name = params.slug.split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ");
    return {
      meta: [
        { title: `${name} — Explore Sukawati` },
        { name: "description", content: `Informasi, foto, dan deskripsi ${name} di Desa Sukawati, Bali.` },
        { property: "og:title", content: `${name} — Explore Sukawati` },
        { property: "og:description", content: `Informasi dan foto ${name} di Sukawati, Bali.` },
      ],
    };
  },
  component: Detail,
});

const INFO_ITEMS = [
  { key: "address",       label: "Alamat",    Icon: MapPin },
  { key: "opening_hours", label: "Jam Buka",  Icon: Clock },
  { key: "price",         label: "Harga",     Icon: Tag },
  { key: "contact",       label: "Kontak",    Icon: Phone },
  { key: "instagram",     label: "Instagram", Icon: Instagram },
] as const;

function Detail() {
  const { slug } = Route.useParams();
  const { data: d, isLoading } = useQuery({
    queryKey: ["destination", slug],
    queryFn: () => fetchDestination(slug),
  });

  return (
    <SiteChrome>
      {/* ── Hero foto full-width ── */}
      <div className="relative w-full h-[60vh] min-h-[380px] overflow-hidden bg-neutral-900">
        {d?.photo_url ? (
          <img
            src={d.photo_url}
            alt={d?.name}
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-neutral-900" />
        )}
        {/* overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        {/* Tombol kembali */}
        <div className="absolute top-24 left-6 z-10">
          <Link
            to="/destinasi"
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white border border-white/25 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/25 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </div>

        {/* Judul di atas foto */}
        {d && (
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 md:px-12">
            <div className="max-w-5xl mx-auto">
              <span className="inline-block bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                {d.category}
              </span>
              <h1
                className="text-4xl md:text-6xl font-semibold text-white leading-tight drop-shadow-lg"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {d.name}
              </h1>
            </div>
          </div>
        )}
      </div>

      {/* ── Konten utama ── */}
      <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Tidak ditemukan */}
        {!isLoading && !d && (
          <div className="text-center py-24">
            <p className="text-2xl font-semibold text-neutral-400">Destinasi tidak ditemukan.</p>
            <Link to="/destinasi" className="mt-6 inline-block text-emerald-600 hover:underline text-sm">
              ← Lihat semua destinasi
            </Link>
          </div>
        )}

        {/* Data destinasi */}
        {d && (
          <div className="grid gap-10 md:grid-cols-3">

            {/* Deskripsi & Video */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-xl font-bold text-neutral-800 mb-4 pb-3 border-b border-neutral-100">
                  Tentang Tempat Ini
                </h2>
                <p className="whitespace-pre-line leading-relaxed text-neutral-600 text-base">
                  {d.description || d.short_description || "Belum ada deskripsi untuk destinasi ini."}
                </p>
              </div>

              {/* Video Destinasi */}
              {d.video_url && (
                <div className="pt-6 border-t border-neutral-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                      <Play className="w-5 h-5 fill-emerald-600 text-emerald-600 ml-0.5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-neutral-900">
                        Video Destinasi
                      </h2>
                      <p className="text-xs text-neutral-500">
                        Cuplikan dokumentasi dan suasana di {d.name}
                      </p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-200/80 shadow-lg aspect-video relative group">
                    {getYouTubeEmbedUrl(d.video_url) ? (
                      <iframe
                        src={getYouTubeEmbedUrl(d.video_url)!}
                        title={`Video ${d.name}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <video
                        src={d.video_url}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-contain"
                      >
                        Peramban Anda tidak mendukung pemutar video.
                      </video>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar info */}
            <aside className="space-y-3">
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                {/* Header sidebar */}
                <div className="bg-emerald-600 px-5 py-4">
                  <h3 className="text-white font-bold text-xs uppercase tracking-widest">Informasi</h3>
                </div>

                {/* Info items */}
                <div className="divide-y divide-neutral-100">
                  {INFO_ITEMS
                    .filter(({ key }) => d[key])
                    .map(({ key, label, Icon }) => (
                      <div key={key} className="flex items-start gap-3 px-5 py-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-0.5">
                            {label}
                          </p>
                          <p className="text-sm font-medium text-neutral-800">{d[key]}</p>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Tombol Google Maps */}
                {d.maps_url && (
                  <div className="px-5 py-4 border-t border-neutral-100">
                    <a
                      href={d.maps_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
                    >
                      <MapPin className="w-4 h-4" />
                      Buka di Google Maps
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                  </div>
                )}
              </div>

              {/* Tombol kembali bawah */}
              <Link
                to="/destinasi"
                className="flex items-center justify-center gap-2 w-full border border-neutral-200 text-neutral-600 hover:border-emerald-500 hover:text-emerald-600 font-medium py-3 px-4 rounded-xl transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Lihat Destinasi Lainnya
              </Link>
            </aside>
          </div>
        )}
      </div>
    </SiteChrome>
  );
}
