import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { SiteChrome } from "@/components/SiteChrome";
import { fetchDestination, getYouTubeEmbedUrl } from "@/lib/supabase";
import { MapPin, Clock, Phone, Tag, Instagram, ExternalLink, ArrowLeft, Play, Images, Camera, ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

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

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const gallery = d?.gallery_urls?.filter(Boolean) || [];

  // Navigasi keyboard & scroll lock untuk Lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowLeft") {
        setLightboxIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : gallery.length - 1));
      }
      if (e.key === "ArrowRight") {
        setLightboxIdx((prev) => (prev !== null && prev < gallery.length - 1 ? prev + 1 : 0));
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIdx, gallery.length]);

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

              {/* ── GALERI FOTO DESTINASI ── */}
              {gallery.length > 0 && (
                <div className="pt-6 border-t border-neutral-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                      <Images className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-neutral-900">
                        Galeri Foto Destinasi
                      </h2>
                      <p className="text-xs text-neutral-500">
                        Dokumentasi visual dan pesona di {d.name} ({gallery.length} foto)
                      </p>
                    </div>
                  </div>

                  {/* Grid Galeri */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                    {gallery.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setLightboxIdx(idx)}
                        className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100 border border-neutral-200/70 shadow-sm hover:shadow-md transition-all cursor-pointer text-left"
                      >
                        <img
                          src={imgUrl}
                          alt={`${d.name} - Foto ${idx + 1}`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                          <span className="text-[11px] font-semibold text-white drop-shadow">
                            Foto #{idx + 1}
                          </span>
                          <span className="p-1.5 rounded-full bg-white/25 backdrop-blur-md text-white shadow">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

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

      {/* ── MODAL LIGHTBOX FOTO FULLSCREEN ── */}
      {lightboxIdx !== null && gallery[lightboxIdx] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 transition-all"
          onClick={() => setLightboxIdx(null)}
        >
          {/* Header Kontrol */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10 px-2">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium border border-white/10 shadow-lg">
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>Foto {lightboxIdx + 1} dari {gallery.length}</span>
              <span className="text-white/40">·</span>
              <span className="text-white/70 max-w-[200px] sm:max-w-xs truncate">{d?.name}</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx(null);
              }}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/10 shadow-lg"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tombol Sebelumnya */}
          {gallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : gallery.length - 1));
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-105 z-10 cursor-pointer shadow-xl"
              title="Foto sebelumnya (Panah Kiri)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Gambar Utama */}
          <div
            className="max-h-[80vh] max-w-[92vw] flex items-center justify-center relative select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={gallery[lightboxIdx]}
              alt={`${d?.name} - Foto ${lightboxIdx + 1}`}
              className="max-h-[80vh] max-w-[92vw] object-contain rounded-xl shadow-2xl"
            />
          </div>

          {/* Tombol Selanjutnya */}
          {gallery.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((prev) => (prev !== null && prev < gallery.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all hover:scale-105 z-10 cursor-pointer shadow-xl"
              title="Foto selanjutnya (Panah Kanan)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Thumbnail Strip di Bawah */}
          {gallery.length > 1 && (
            <div
              className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto py-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-2 p-1.5 rounded-2xl bg-black/70 backdrop-blur-lg border border-white/10 max-w-full overflow-x-auto">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setLightboxIdx(i)}
                    className={`h-12 w-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      i === lightboxIdx ? "border-emerald-400 scale-105 opacity-100" : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </SiteChrome>
  );
}
