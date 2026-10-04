import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import hero from "@/assets/hero.jpg";
import { SiteChrome } from "@/components/SiteChrome";
import { fetchDestinations, fetchSetting, GROUPS } from "@/lib/supabase";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Explore Sukawati — Destinasi Wisata Desa Sukawati, Bali" },
      { name: "description", content: "Jelajahi destinasi wisata, seni budaya, kerajinan, dan kuliner Desa Sukawati, Gianyar, Bali." },
      { property: "og:title", content: "Explore Sukawati — Destinasi Wisata Bali" },
      { property: "og:description", content: "Destinasi wisata, seni, kerajinan, dan kuliner Desa Sukawati." },
    ],
  }),
  component: Index,
});

function Index() {
  const [group, setGroup] = useState("destinasi");
  const { data, isLoading, error } = useQuery({ queryKey: ["destinations"], queryFn: () => fetchDestinations() });
  const { data: heroImage } = useQuery({ queryKey: ["setting", "hero_image"], queryFn: () => fetchSetting("hero_image") });
  
  const items = (data ?? []).filter((d) => group === "all" || d.group_type === group);
  const events = (data ?? []).filter((d) => d.group_type === "festival");

  return (
    <SiteChrome>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <img
          src={heroImage || hero}
          alt="Sukawati Hub"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark gradient overlay so the text is readable */}
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 flex flex-col items-center text-white mt-16">
          <p className="text-sm md:text-base uppercase tracking-[0.4em] font-semibold mb-4 text-emerald-300">
            Desa Sukawati · Gianyar · Bali
          </p>
          <h1 className="text-6xl md:text-8xl font-semibold max-w-5xl leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]" style={{ fontFamily: "var(--font-display)" }}>
            The Heart of Bali's Art & Culture
          </h1>
        </div>
      </section>

      {/* What is Sukawati Hub Section */}
      <section className="bg-gradient-to-r from-emerald-50 to-teal-100 text-teal-950 py-24 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-6 items-start">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">What is Sukawati Hub?</h2>
          <p className="text-lg md:text-xl max-w-3xl leading-relaxed text-teal-800">
            A contemporary village center in Gianyar where people and subcultures connect, learn, and grow together. Sukawati Hub is a home for events and activities: from traditional arts to culinary festivals. Here, we are fostering authenticity and creativity, empowering communities while keeping it sustainable. Get involved and create connections!
          </p>
          <Link to="/" className="mt-4 inline-flex items-center justify-center rounded-full bg-teal-900 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800">
            Learn More
          </Link>
        </div>
      </section>

      {/* Around Us Section */}
      <section id="around-us" className="bg-white text-neutral-900 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-400">Around Us</h2>
            <p className="mt-4 text-neutral-600 max-w-3xl text-sm md:text-base">
              From a skatepark to an art gallery, Sukawati Hub offers various activities you can do in our area. Explore your interests, join the circles, and grow yourself along with us!
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {[...Object.entries(GROUPS), ["all", "Semua"] as [string, string]].map(([k, v]) => (
              <button key={k} onClick={() => setGroup(k)}
                className={`rounded-full border px-5 py-2 text-sm font-medium transition ${group === k ? "border-emerald-600 bg-emerald-600 text-white" : "border-neutral-200 text-neutral-600 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"}`}>
                {v}
              </button>
            ))}
          </div>

          {isLoading && <p className="text-center text-neutral-500">Memuat...</p>}
          {error && <p className="text-center text-red-500">Gagal memuat data.</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((d) => (
              <Link key={d.id} to="/destinasi/$slug" params={{ slug: d.slug }} className="group relative aspect-[4/5] sm:aspect-square md:aspect-[4/5] rounded-xl overflow-hidden block">
                {d.photo_url ? (
                  <img src={d.photo_url} alt={d.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-neutral-200" />
                )}
                {/* Gradient overlay for text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                  <h3 className="text-white text-lg font-bold uppercase tracking-wider leading-tight max-w-[70%] drop-shadow-md">
                    {d.name}
                  </h3>
                  <div className="h-10 w-10 shrink-0 rounded-full border-[1.5px] border-white/80 text-white flex items-center justify-center transition-colors group-hover:bg-white group-hover:text-black">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              to="/destinasi"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 text-neutral-700 px-8 py-3 text-sm font-semibold hover:border-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
            >
              VIEW ALL WHAT'S AROUND US
            </Link>
          </div>
        </div>
      </section>
      
      {/* Event, Activities Section */}
      <section className="bg-neutral-50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900">Event, Activities, and Facilities</h2>
            <p className="mt-4 text-neutral-600 text-lg">Find the latest happenings in the Sukawati scene here!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((e) => (
              <Link key={e.id} to="/destinasi/$slug" params={{ slug: e.slug }} className="aspect-[4/5] bg-neutral-300 rounded-xl overflow-hidden relative group block">
                {e.photo_url ? (
                  <img src={e.photo_url} alt={e.name} className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                ) : (
                  <div className="absolute inset-0 bg-neutral-200" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white text-xl font-bold drop-shadow-md">{e.name}</h3>
                </div>
              </Link>
            ))}
            {events.length === 0 && (
              <div className="col-span-full text-center py-12 text-neutral-500">
                Data festival atau kegiatan belum tersedia.
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
