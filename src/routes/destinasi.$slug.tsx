import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteChrome } from "@/components/SiteChrome";
import { fetchDestination } from "@/lib/supabase";

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

function Detail() {
  const { slug } = Route.useParams();
  const { data: d, isLoading } = useQuery({ queryKey: ["destination", slug], queryFn: () => fetchDestination(slug) });

  return (
    <SiteChrome>
      <div className="mx-auto max-w-5xl px-5 py-12">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Kembali</Link>
        {isLoading && <p className="mt-8">Memuat...</p>}
        {!isLoading && !d && <p className="mt-8">Destinasi tidak ditemukan.</p>}
        {d && (
          <>
            <p className="mt-8 text-xs uppercase tracking-widest text-primary">{d.category}</p>
            <h1 className="mt-2 text-5xl font-semibold md:text-6xl">{d.name}</h1>
            {d.photo_url && <img src={d.photo_url} alt={d.name} className="mt-8 aspect-[16/9] w-full rounded-sm object-cover" />}
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              <div className="md:col-span-2 whitespace-pre-line leading-relaxed text-lg">{d.description || d.short_description}</div>
              <aside className="space-y-4 rounded-sm border border-border bg-card p-6 text-sm">
                {[["Alamat", d.address], ["Jam Buka", d.opening_hours], ["Harga", d.price], ["Kontak", d.contact], ["Instagram", d.instagram]]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k}><p className="text-xs uppercase tracking-widest text-muted-foreground">{k}</p><p className="mt-1">{v}</p></div>
                  ))}
                {d.maps_url && <a href={d.maps_url} target="_blank" rel="noreferrer" className="inline-block rounded-sm bg-primary px-4 py-2 text-primary-foreground">Buka di Google Maps</a>}
              </aside>
            </div>
          </>
        )}
      </div>
    </SiteChrome>
  );
}
