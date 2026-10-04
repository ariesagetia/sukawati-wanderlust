import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { SiteChrome } from "@/components/SiteChrome";
import { supabase, fetchDestinations, GROUPS, type Destination } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Explore Sukawati" },
      { name: "description", content: "Kelola data destinasi wisata Sukawati." },
      { property: "og:title", content: "Admin — Explore Sukawati" },
      { property: "og:description", content: "Panel admin Sukawati Tourism Hub." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const input = "w-full rounded-sm border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
const btn = "rounded-sm bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50";

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return setIsAdmin(null);
    supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" }).then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  return (
    <SiteChrome>
      <div className="mx-auto max-w-6xl px-5 py-12">
        {!session ? <Login /> : isAdmin === null ? <p>Memeriksa akses...</p> : !isAdmin ? (
          <div><p>Akun ini bukan admin.</p><button className={`${btn} mt-4`} onClick={() => supabase.auth.signOut()}>Keluar</button></div>
        ) : <Dashboard email={session.user.email ?? ""} />}
      </div>
    </SiteChrome>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErr("Email atau kata sandi salah.");
    setBusy(false);
  }
  return (
    <form onSubmit={submit} className="mx-auto max-w-sm space-y-4 rounded-sm border border-border bg-card p-8">
      <h1 className="text-3xl font-semibold">Masuk Admin</h1>
      <input className={input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className={input} type="password" placeholder="Kata sandi" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {err && <p className="text-sm text-destructive">{err}</p>}
      <button className={`${btn} w-full`} disabled={busy}>{busy ? "Memproses..." : "Masuk"}</button>
    </form>
  );
}

const empty: Partial<Destination> = { name: "", slug: "", group_type: "destinasi", category: "", is_published: true, sort_order: 0 };
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function Dashboard({ email }: { email: string }) {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["admin-destinations"], queryFn: () => fetchDestinations(true) });
  const [editing, setEditing] = useState<Partial<Destination> | null>(null);

  async function remove(d: Destination) {
    if (!confirm(`Hapus "${d.name}"?`)) return;
    const { error } = await supabase.from("destinations").delete().eq("id", d.id);
    if (error) return alert(error.message);
    qc.invalidateQueries();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-4xl font-semibold">Kelola Destinasi</h1><p className="text-sm text-muted-foreground">{email}</p></div>
        <div className="flex gap-2">
          <button className={btn} onClick={() => setEditing({ ...empty })}>+ Tambah</button>
          <button className="rounded-sm border border-border px-4 py-2 text-sm" onClick={() => supabase.auth.signOut()}>Keluar</button>
        </div>
      </div>

      {editing && <Editor value={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); qc.invalidateQueries(); }} />}

      <div className="mt-8 divide-y divide-border rounded-sm border border-border bg-card">
        {data.map((d) => (
          <div key={d.id} className="flex items-center gap-4 p-4">
            <div className="h-14 w-20 shrink-0 overflow-hidden rounded-sm bg-muted">{d.photo_url && <img src={d.photo_url} alt="" className="h-full w-full object-cover" />}</div>
            <div className="flex-1">
              <p className="font-medium">{d.name} {!d.is_published && <span className="ml-2 text-xs text-muted-foreground">(draf)</span>}</p>
              <p className="text-xs text-muted-foreground">{GROUPS[d.group_type] ?? d.group_type} · {d.category}</p>
            </div>
            <button className="text-sm text-primary" onClick={() => setEditing(d)}>Ubah</button>
            <button className="text-sm text-destructive" onClick={() => remove(d)}>Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Editor({ value, onClose, onSaved }: { value: Partial<Destination>; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState<Partial<Destination>>(value);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof Destination, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  async function save(e: FormEvent) {
    e.preventDefault(); setBusy(true);
    try {
      let photo_url = f.photo_url ?? null;
      if (file) {
        const path = `${Date.now()}-${slugify(file.name)}`;
        const up = await supabase.storage.from("destination-photos").upload(path, file, { contentType: file.type });
        if (up.error) throw up.error;
        photo_url = supabase.storage.from("destination-photos").getPublicUrl(path).data.publicUrl;
      }
      const { id, ...rest } = f as Destination;
      const row = { ...rest, slug: f.slug || slugify(f.name ?? ""), photo_url, updated_at: new Date().toISOString() };
      delete (row as Record<string, unknown>)["created_at"];
      const res = id ? await supabase.from("destinations").update(row).eq("id", id) : await supabase.from("destinations").insert(row);
      if (res.error) throw res.error;
      onSaved();
    } catch (err) {
      alert((err as Error).message);
    } finally { setBusy(false); }
  }

  const field = (k: keyof Destination, label: string, area = false) => (
    <label className="block text-sm"><span className="text-muted-foreground">{label}</span>
      {area ? <textarea className={`${input} mt-1 min-h-28`} value={(f[k] as string) ?? ""} onChange={(e) => set(k, e.target.value)} />
        : <input className={`${input} mt-1`} value={(f[k] as string) ?? ""} onChange={(e) => set(k, e.target.value)} />}
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/50 p-4">
      <form onSubmit={save} className="my-8 w-full max-w-2xl space-y-4 rounded-sm bg-background p-6">
        <h2 className="text-3xl font-semibold">{f.id ? "Ubah" : "Tambah"} Destinasi</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("name", "Nama *")}
          {field("slug", "Slug URL (otomatis jika kosong)")}
          <label className="block text-sm"><span className="text-muted-foreground">Kelompok</span>
            <select className={`${input} mt-1`} value={f.group_type} onChange={(e) => set("group_type", e.target.value)}>
              {Object.entries(GROUPS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          {field("category", "Kategori *")}
        </div>
        {field("short_description", "Deskripsi singkat")}
        {field("description", "Deskripsi lengkap", true)}
        <div className="grid gap-4 sm:grid-cols-2">
          {field("address", "Alamat")}
          {field("maps_url", "Link Google Maps")}
          {field("opening_hours", "Jam buka")}
          {field("price", "Harga")}
          {field("contact", "Kontak / WhatsApp")}
          {field("instagram", "Instagram")}
        </div>
        <label className="block text-sm"><span className="text-muted-foreground">Foto</span>
          {f.photo_url && !file && <img src={f.photo_url} alt="" className="mt-1 h-32 rounded-sm object-cover" />}
          <input type="file" accept="image/*" className="mt-1 block text-sm" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        <div className="flex items-center gap-6 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={!!f.is_published} onChange={(e) => set("is_published", e.target.checked)} /> Tampilkan di website</label>
          <label className="flex items-center gap-2">Urutan <input type="number" className={`${input} w-20`} value={f.sort_order ?? 0} onChange={(e) => set("sort_order", Number(e.target.value))} /></label>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="rounded-sm border border-border px-4 py-2 text-sm" onClick={onClose}>Batal</button>
          <button className={btn} disabled={busy || !f.name || !f.category}>{busy ? "Menyimpan..." : "Simpan"}</button>
        </div>
      </form>
    </div>
  );
}
