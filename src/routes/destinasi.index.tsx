import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteChrome } from "@/components/SiteChrome";
import { fetchDestinations, GROUPS } from "@/lib/supabase";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/destinasi/")({
  head: () => ({
    meta: [
      { title: "Explore — Sukawati Hub" },
      { name: "description", content: "Explore all destinations, art, culture, crafts, and culinary at Sukawati." },
    ],
  }),
  component: DestinasiIndex,
});

function DestinasiIndex() {
  const [group, setGroup] = useState("all");
  const { data, isLoading, error } = useQuery({ queryKey: ["destinations"], queryFn: () => fetchDestinations() });
  const items = (data ?? []).filter((d) => group === "all" || d.group_type === group);

  return (
    <SiteChrome>
      <div className="bg-white min-h-screen pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900">Explore Sukawati</h1>
            <p className="mt-4 text-neutral-600 max-w-3xl text-sm md:text-base">
              Discover all the exciting spots, events, and communities around Sukawati Hub. Filter by your interests and start exploring!
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

          {isLoading && <p className="text-center text-neutral-500 py-12">Memuat destinasi...</p>}
          {error && <p className="text-center text-red-500 py-12">Gagal memuat data.</p>}

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
                  <div className="flex flex-col gap-1 drop-shadow-md">
                    <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">{GROUPS[d.group_type] ?? d.group_type}</span>
                    <h3 className="text-white text-lg font-bold uppercase tracking-wider leading-tight">
                      {d.name}
                    </h3>
                  </div>
                  <div className="h-10 w-10 shrink-0 rounded-full border-[1.5px] border-white/80 text-white flex items-center justify-center transition-colors group-hover:bg-white group-hover:text-black">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
            {items.length === 0 && !isLoading && (
              <div className="col-span-full text-center py-12 text-neutral-500">
                Data belum tersedia untuk kategori ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
