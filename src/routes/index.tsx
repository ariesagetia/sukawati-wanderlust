import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import hero from "@/assets/hero.jpg";
import { SiteChrome } from "@/components/SiteChrome";
import { fetchDestinations, GROUPS } from "@/lib/supabase";

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
  const items = (data ?? []).filter((d) => group === "all" || d.group_type === group);

  return (
    <SiteChrome>
      <section className="relative h-[78vh] min-h-[480px] overflow-hidden">
        <img src={hero} alt="Gerbang candi bentar di Sukawati saat senja" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-16 text-primary-foreground">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Desa Sukawati · Gianyar · Bali</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-tight md:text-7xl">Tempat seni, budaya, dan alam bertemu.</h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-4xl font-semibold">Jelajahi Sukawati</h2>
          <div className="flex flex-wrap gap-2">
            {[...Object.entries(GROUPS), ["all", "Semua"]].map(([k, v]) => (
              <button key={k} onClick={() => setGroup(k)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${group === k ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {isLoading && <p className="mt-10 text-muted-foreground">Memuat...</p>}
        {error && <p className="mt-10 text-destructive">Gagal memuat data. Pastikan tabel database sudah dibuat.</p>}

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <Link key={d.id} to="/destinasi/$slug" params={{ slug: d.slug }} className="group block">
              <div className="aspect-[4/3] overflow-hidden rounded-sm bg-muted">
                {d.photo_url ? (
                  <img src={d.photo_url} alt={d.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-secondary font-display text-3xl text-secondary-foreground/70">{d.name.charAt(0)}</div>
                )}
              </div>
              <p className="mt-4 text-xs uppercase tracking-widest text-primary">{d.category}</p>
              <h3 className="mt-1 text-2xl font-semibold group-hover:text-primary">{d.name}</h3>
              {d.short_description && <p className="mt-1 text-sm text-muted-foreground">{d.short_description}</p>}
            </Link>
          ))}
        </div>
      </section>
    </SiteChrome>
  );
}
