import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { SiteChrome } from "@/components/SiteChrome";
import { supabase, fetchDestinations, fetchSetting, GROUPS, type Destination, getYouTubeEmbedUrl } from "@/lib/supabase";
import { Shield, UserPlus, KeyRound, Trash2, Mail, CheckCircle2, AlertCircle, Copy, Check, Lock, RefreshCw, X, Video, Play, Film, Image as ImageIcon, Eye, EyeOff, Images, ChevronLeft, ChevronRight, Star } from "lucide-react";

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

const input = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors";
const btn = "rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors cursor-pointer";

const SUPER_ADMIN_EMAILS = [
  "ariesagetia@gmail.com",
  "ariesagetia@pnb.ac.id",
  "admin@sukawatihub.com",
];
const isSuperAdminEmail = (email?: string | null) =>
  !!email && SUPER_ADMIN_EMAILS.includes(email.toLowerCase().trim());

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
    if (isSuperAdminEmail(session.user.email)) {
      setIsAdmin(true);
      return;
    }
    supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" })
      .then(({ data, error }) => {
        if (error) {
          console.error("has_role error:", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      })
      .catch((err) => {
        console.error("has_role catch:", err);
        setIsAdmin(false);
      });
  }, [session]);

  return (
    <SiteChrome>
      <div className="mx-auto max-w-6xl px-5 py-12 pt-28">
        {!session ? (
          <Login />
        ) : isAdmin === null ? (
          <div className="flex items-center justify-center py-20 text-neutral-500 gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
            <span>Memeriksa hak akses admin...</span>
          </div>
        ) : !isAdmin ? (
          <div className="max-w-md mx-auto text-center py-16 bg-card border border-border rounded-xl p-8">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Akses Terbatas</h2>
            <p className="text-sm text-neutral-600 mb-6">Akun ({session.user.email}) belum terdaftar sebagai admin.</p>
            <button className={btn} onClick={() => supabase.auth.signOut()}>Keluar</button>
          </div>
        ) : (
          <Dashboard email={session.user.email ?? ""} />
        )}
      </div>
    </SiteChrome>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setErr(""); setMsg("");
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPassword });
    if (error) {
      console.error("Login error:", error);
      setErr("Email atau kata sandi salah. Silakan periksa kembali.");
    }
    setBusy(false);
  }

  async function handleForgot(e: FormEvent) {
    e.preventDefault(); setBusy(true); setErr(""); setMsg("");
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
      redirectTo: typeof window !== "undefined" ? window.location.origin + "/admin" : undefined,
    });
    setBusy(false);
    if (error) {
      setErr(error.message);
    } else {
      setMsg("Tautan reset kata sandi berhasil dikirim ke " + forgotEmail + ". Silakan periksa kotak masuk atau spam email Anda.");
    }
  }

  if (showForgot) {
    return (
      <form onSubmit={handleForgot} className="mx-auto max-w-sm space-y-4 rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-700">
          <KeyRound className="w-6 h-6" />
          <h1 className="text-2xl font-semibold">Reset Kata Sandi</h1>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Masukkan alamat email Anda yang terdaftar sebagai admin. Kami akan mengirimkan tautan untuk membuat kata sandi baru.
        </p>
        <input className={input} type="email" placeholder="contoh@gmail.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
        {err && <p className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-md">{err}</p>}
        {msg && <p className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-md border border-emerald-200">{msg}</p>}
        <button className={`${btn} w-full`} disabled={busy}>{busy ? "Mengirim..." : "Kirim Tautan Pemulihan"}</button>
        <button type="button" className="w-full text-center text-xs text-muted-foreground hover:text-foreground mt-2 cursor-pointer" onClick={() => { setShowForgot(false); setErr(""); setMsg(""); }}>
          ← Kembali ke halaman Masuk
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-sm space-y-4 rounded-xl border border-border bg-card p-8 shadow-sm">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Masuk Admin</h1>
        <p className="text-xs text-muted-foreground mt-1">Sukawati Hub · Portal Pengelola</p>
      </div>
      <label className="block text-xs font-medium text-neutral-700">
        Email
        <input className={`${input} mt-1`} type="email" placeholder="admin@sukawatihub.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label className="block text-xs font-medium text-neutral-700">
        Kata Sandi
        <div className="relative mt-1">
          <input
            className={`${input} pr-10`}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors p-0.5 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </label>
      {err && <p className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-md">{err}</p>}
      <button className={`${btn} w-full`} disabled={busy}>{busy ? "Memproses..." : "Masuk"}</button>
      <div className="text-center pt-2">
        <button type="button" className="text-xs text-muted-foreground hover:text-emerald-700 transition-colors cursor-pointer" onClick={() => { setShowForgot(true); setForgotEmail(email); }}>
          Lupa kata sandi?
        </button>
      </div>
    </form>
  );
}

const empty: Partial<Destination> = { name: "", slug: "", group_type: "destinasi", category: "", is_published: true, sort_order: 0, photo_url: null, video_url: null, gallery_urls: [] };
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function Dashboard({ email }: { email: string }) {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["admin-destinations"], queryFn: () => fetchDestinations(true) });
  const [editing, setEditing] = useState<Partial<Destination> | null>(null);
  const [tab, setTab] = useState("destinasi");

  const isSuperAdmin = isSuperAdminEmail(email);

  async function remove(d: Destination) {
    if (!confirm(`Hapus "${d.name}"?`)) return;
    const { error } = await supabase.from("destinations").delete().eq("id", d.id);
    if (error) return alert(error.message);
    qc.invalidateQueries();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">Dashboard Pengelola</h1>
            {isSuperAdmin && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 border border-emerald-300">
                <Shield className="w-3.5 h-3.5" /> Super Admin
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-500 mt-1">{email}</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 font-medium transition-colors cursor-pointer" onClick={() => supabase.auth.signOut()}>
            Keluar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-border">
        <button
          className={`pb-3 px-4 text-sm font-semibold transition-colors cursor-pointer ${
            tab === "destinasi" ? "border-b-2 border-emerald-600 text-emerald-700" : "text-neutral-500 hover:text-neutral-900"
          }`}
          onClick={() => setTab("destinasi")}
        >
          Destinasi & Konten
        </button>

        <button
          className={`pb-3 px-4 text-sm font-semibold transition-colors cursor-pointer ${
            tab === "pengaturan" ? "border-b-2 border-emerald-600 text-emerald-700" : "text-neutral-500 hover:text-neutral-900"
          }`}
          onClick={() => setTab("pengaturan")}
        >
          Pengaturan Kontak & Banner
        </button>

        {isSuperAdmin && (
          <button
            className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              tab === "kelola-admin" ? "border-b-2 border-emerald-600 text-emerald-700" : "text-neutral-500 hover:text-neutral-900"
            }`}
            onClick={() => setTab("kelola-admin")}
          >
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Kelola Admin & Kata Sandi</span>
            <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full">Khusus</span>
          </button>
        )}
      </div>

      {/* Konten Tab Destinasi */}
      {tab === "destinasi" && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-800">Daftar Destinasi & Kategori</h2>
            <button className={btn} onClick={() => setEditing({ ...empty })}>+ Tambah Destinasi</button>
          </div>
          <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            {data.map((d) => (
              <div key={d.id} className="flex items-center gap-4 p-4 hover:bg-neutral-50/60 transition-colors">
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-md bg-muted relative">
                  {d.photo_url ? (
                    <img src={d.photo_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">No image</div>
                  )}
                  {d.video_url && (
                    <div className="absolute bottom-1 right-1 bg-black/75 backdrop-blur-xs text-white rounded p-0.5 shadow-sm" title="Memiliki Video">
                      <Play className="w-2.5 h-2.5 fill-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-neutral-900 truncate">{d.name}</p>
                    {!d.is_published && <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">(draf)</span>}
                    {d.video_url && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0 font-medium">
                        <Film className="w-3 h-3" /> Ada Video
                      </span>
                    )}
                    {(d.gallery_urls?.length ?? 0) > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full shrink-0 font-medium">
                        <Images className="w-3 h-3" /> {d.gallery_urls?.length} Foto
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5 truncate">{GROUPS[d.group_type] ?? d.group_type} · {d.category}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button className="text-sm font-medium text-emerald-600 hover:underline cursor-pointer" onClick={() => setEditing(d)}>Ubah</button>
                  <button className="text-sm font-medium text-destructive hover:underline cursor-pointer" onClick={() => remove(d)}>Hapus</button>
                </div>
              </div>
            ))}
            {data.length === 0 && (
              <div className="py-12 text-center text-sm text-neutral-500">Belum ada destinasi yang ditambahkan.</div>
            )}
          </div>
        </div>
      )}

      {/* Konten Tab Pengaturan */}
      {tab === "pengaturan" && <SettingsPanel />}

      {/* Konten Tab Khusus Super Admin (Kelola Admin) */}
      {tab === "kelola-admin" && isSuperAdmin && <SuperAdminAdminsPanel currentEmail={email} />}

      {editing && <Editor value={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); qc.invalidateQueries(); }} />}
    </div>
  );
}

// -------------------------------------------------------------------------------------------------
// TAB SUPER ADMIN: KELOLA AKUN ADMIN & RESET PASSWORD
// -------------------------------------------------------------------------------------------------

type AdminUser = {
  id: string;
  email: string;
  role: string;
  created_at?: string;
  last_sign_in_at?: string;
};

function SuperAdminAdminsPanel({ currentEmail }: { currentEmail: string }) {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [rpcError, setRpcError] = useState<string | null>(null);

  // Modal Tambah Admin
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [addBusy, setAddBusy] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  // Modal Reset Password
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  // Bantuan SQL
  const [showSql, setShowSql] = useState(false);
  const [copied, setCopied] = useState(false);

  const SQL_SCRIPT = `-- Jalankan skrip ini di Supabase Dashboard > SQL Editor:
create extension if not exists pgcrypto with schema extensions;

insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role from auth.users where lower(email) in ('ariesagetia@gmail.com', 'ariesagetia@pnb.ac.id', 'admin@sukawatihub.com')
on conflict (user_id, role) do nothing;

create or replace function public.get_all_admins()
returns table (id uuid, email text, role text, created_at timestamptz, last_sign_in_at timestamptz)
language plpgsql security definer set search_path = public, auth as $$
#variable_conflict use_column
declare _caller text;
begin
  select lower(u.email) into _caller from auth.users u where u.id = auth.uid();
  if _caller is null or _caller not in ('ariesagetia@gmail.com', 'ariesagetia@pnb.ac.id', 'admin@sukawatihub.com') then
    raise exception 'Akses ditolak: Hanya Super Admin yang berhak.';
  end if;
  return query select u.id, u.email::text, r.role::text, u.created_at, u.last_sign_in_at
  from auth.users u join public.user_roles r on r.user_id = u.id where r.role = 'admin'::public.app_role order by u.created_at desc;
end;
$$;
grant execute on function public.get_all_admins() to authenticated;

create or replace function public.admin_create_user(_email text, _password text)
returns json language plpgsql security definer set search_path = public, auth, extensions as $$
#variable_conflict use_column
declare _new_id uuid; _caller text;
begin
  select lower(u.email) into _caller from auth.users u where u.id = auth.uid();
  if _caller is null or _caller not in ('ariesagetia@gmail.com', 'ariesagetia@pnb.ac.id', 'admin@sukawatihub.com') then
    raise exception 'Akses ditolak: Hanya Super Admin yang berhak.';
  end if;
  if exists (select 1 from auth.users u where lower(u.email) = lower(trim(_email))) then
    select u.id into _new_id from auth.users u where lower(u.email) = lower(trim(_email));
    insert into public.user_roles (user_id, role) values (_new_id, 'admin'::public.app_role) on conflict do nothing;
    update auth.users set encrypted_password = extensions.crypt(_password, extensions.gen_salt('bf')), email_confirmed_at = coalesce(email_confirmed_at, now()) where id = _new_id;
    return json_build_object('success', true, 'message', 'Akun diperbarui menjadi admin.');
  end if;
  _new_id := gen_random_uuid();
  insert into auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
  values (_new_id, '00000000-0000-0000-0000-000000000000', lower(trim(_email)), extensions.crypt(_password, extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), 'authenticated', 'authenticated');
  insert into auth.identities (id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (_new_id, _new_id::text, _new_id, json_build_object('sub', _new_id::text, 'email', lower(trim(_email))), 'email', now(), now(), now());
  insert into public.user_roles (user_id, role) values (_new_id, 'admin'::public.app_role) on conflict do nothing;
  return json_build_object('success', true);
end;
$$;
grant execute on function public.admin_create_user(text, text) to authenticated;

create or replace function public.admin_reset_password(_target_email text, _new_password text)
returns json language plpgsql security definer set search_path = public, auth, extensions as $$
#variable_conflict use_column
declare _caller text;
begin
  select lower(u.email) into _caller from auth.users u where u.id = auth.uid();
  if _caller is null or _caller not in ('ariesagetia@gmail.com', 'ariesagetia@pnb.ac.id', 'admin@sukawatihub.com') then
    raise exception 'Akses ditolak.';
  end if;
  update auth.users set encrypted_password = extensions.crypt(_new_password, extensions.gen_salt('bf')), email_confirmed_at = coalesce(email_confirmed_at, now()), updated_at = now()
  where lower(email) = lower(trim(_target_email));
  return json_build_object('success', true);
end;
$$;
grant execute on function public.admin_reset_password(text, text) to authenticated;

create or replace function public.admin_delete_admin(_target_email text)
returns json language plpgsql security definer set search_path = public, auth as $$
#variable_conflict use_column
declare _tid uuid; _caller text;
begin
  select lower(u.email) into _caller from auth.users u where u.id = auth.uid();
  if _caller is null or _caller not in ('ariesagetia@gmail.com', 'ariesagetia@pnb.ac.id', 'admin@sukawatihub.com') then
    raise exception 'Akses ditolak.';
  end if;
  if lower(trim(_target_email)) in ('ariesagetia@gmail.com', 'ariesagetia@pnb.ac.id', 'admin@sukawatihub.com') then
    raise exception 'Tidak dapat menghapus Super Admin.';
  end if;
  select u.id into _tid from auth.users u where lower(u.email) = lower(trim(_target_email));
  if _tid is not null then
    delete from public.user_roles where user_id = _tid;
    delete from auth.identities where user_id = _tid;
    delete from auth.users where id = _tid;
  end if;
  return json_build_object('success', true);
end;
$$;
grant execute on function public.admin_delete_admin(text) to authenticated;`;

  async function loadAdmins() {
    setLoading(true);
    setRpcError(null);
    try {
      const { data, error } = await supabase.rpc("get_all_admins");
      if (error) {
        setRpcError(error.message);
        // Fallback default list if RPC isn't set up yet
        setAdmins([
          {
            id: "super-admin-1",
            email: "ariesagetia@gmail.com",
            role: "admin",
            created_at: new Date().toISOString(),
          },
          {
            id: "super-admin-2",
            email: "ariesagetia@pnb.ac.id",
            role: "admin",
            created_at: new Date().toISOString(),
          },
          {
            id: "super-admin-3",
            email: "admin@sukawatihub.com",
            role: "admin",
            created_at: new Date().toISOString(),
          },
        ]);
      } else {
        setAdmins((data as AdminUser[]) ?? []);
      }
    } catch (err) {
      setRpcError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  async function handleAddAdminSubmit(e: FormEvent) {
    e.preventDefault();
    setAddBusy(true);
    setAddError("");
    setAddSuccess("");

    try {
      // 1. Daftarkan akun melalui Supabase Auth API dengan temporary client (tanpa mengganggu sesi Super Admin)
      // Ini memastikan struktur data schema internal Supabase Auth (GoTrue) dibuat 100% lengkap dan resmi
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const tempAuth = createClient(
          "https://tcmjodqyalbonhcddkxy.supabase.co",
          "sb_publishable_Wx9Eigxb3lOESpgkMdUMSA_W02AcCx2",
          { auth: { persistSession: false, autoRefreshToken: false } }
        );
        await tempAuth.auth.signUp({
          email: newEmail.trim(),
          password: newPassword,
        });
      } catch (signupErr) {
        console.warn("Auth signUp notice:", signupErr);
      }

      // 2. Berikan role admin, konfirmasi email, dan perbarui password secara instan via RPC
      const { data, error } = await supabase.rpc("admin_create_user", {
        _email: newEmail.trim(),
        _password: newPassword,
      });

      if (error) throw error;

      setAddSuccess(`Berhasil! Akun admin "${newEmail}" telah aktif dan siap digunakan.`);
      setNewEmail("");
      setNewPassword("");
      setTimeout(() => {
        setShowAddModal(false);
        setAddSuccess("");
        loadAdmins();
      }, 1500);
    } catch (err: unknown) {
      setAddError(
        (err as Error).message ||
          "Gagal membuat akun admin. Pastikan skrip SQL helper telah dijalankan di Supabase Dashboard."
      );
    } finally {
      setAddBusy(false);
    }
  }

  async function handleDirectResetSubmit(e: FormEvent) {
    e.preventDefault();
    if (!resetTarget) return;
    setResetBusy(true);
    setResetError("");
    setResetSuccess("");

    try {
      const { data, error } = await supabase.rpc("admin_reset_password", {
        _target_email: resetTarget.email,
        _new_password: resetPassword,
      });

      if (error) throw error;

      setResetSuccess(`Kata sandi untuk ${resetTarget.email} berhasil diubah!`);
      setResetPassword("");
      setTimeout(() => {
        setResetTarget(null);
        setResetSuccess("");
      }, 1500);
    } catch (err: unknown) {
      setResetError(
        (err as Error).message ||
          "Gagal mereset kata sandi langsung. Pastikan skrip SQL helper telah dijalankan di Supabase."
      );
    } finally {
      setResetBusy(false);
    }
  }

  async function handleSendResetEmail() {
    if (!resetTarget) return;
    setResetBusy(true);
    setResetError("");
    setResetSuccess("");

    const { error } = await supabase.auth.resetPasswordForEmail(resetTarget.email, {
      redirectTo: typeof window !== "undefined" ? window.location.origin + "/admin" : undefined,
    });

    setResetBusy(false);
    if (error) {
      setResetError(error.message);
    } else {
      setResetSuccess(`Tautan reset kata sandi telah dikirim ke email ${resetTarget.email}.`);
    }
  }

  async function handleDeleteAdmin(targetEmail: string) {
    if (isSuperAdminEmail(targetEmail)) {
      alert("Akun Super Admin utama tidak dapat dihapus.");
      return;
    }
    if (!confirm(`Apakah Anda yakin ingin mencabut hak akses dan menghapus admin "${targetEmail}"?`)) {
      return;
    }

    try {
      const { error } = await supabase.rpc("admin_delete_admin", {
        _target_email: targetEmail,
      });
      if (error) throw error;
      alert(`Admin ${targetEmail} berhasil dihapus.`);
      loadAdmins();
    } catch (err: unknown) {
      alert((err as Error).message || "Gagal menghapus admin.");
    }
  }

  function copySql() {
    navigator.clipboard.writeText(SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Banner Identitas Super Admin */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-full bg-emerald-600 text-white shrink-0 mt-0.5">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-emerald-950 text-base">Hak Akses Super Admin: {currentEmail}</h3>
            <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
              Akun <strong>ariesagetia@gmail.com</strong>, <strong>ariesagetia@pnb.ac.id</strong>, dan <strong>admin@sukawatihub.com</strong> memiliki wewenang eksklusif untuk <strong>menambahkan akun admin baru</strong>, 
              <strong> mereset kata sandi admin</strong>, dan mengelola seluruh hak akses staf website Sukawati Hub.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2.5 rounded-md shadow-sm transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            + Tambah Admin Baru
          </button>
        </div>
      </div>

      {/* Peringatan jika RPC SQL perlu diperbarui atau belum dieksekusi di Supabase */}
      {rpcError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Pemberitahuan:</strong> {rpcError}. Jalankan skrip SQL terbaru di bawah pada Supabase SQL Editor untuk memperbaikinya.
            </span>
          </div>
          <button
            onClick={() => setShowSql(!showSql)}
            className="text-xs font-semibold bg-amber-200 hover:bg-amber-300 text-amber-950 px-3 py-1.5 rounded-md transition-colors shrink-0 cursor-pointer"
          >
            {showSql ? "Sembunyikan SQL" : "Lihat Skrip SQL"}
          </button>
        </div>
      )}

      {/* Box Penampil Skrip SQL */}
      {showSql && (
        <div className="rounded-xl border border-border bg-neutral-900 text-neutral-100 p-4 text-xs font-mono relative">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-700">
            <span className="text-neutral-400 font-sans font-bold">Skrip SQL Supabase (Cukup jalankan sekali di Supabase SQL Editor):</span>
            <button
              onClick={copySql}
              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1 rounded font-sans transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Tersalin!" : "Salin SQL"}
            </button>
          </div>
          <pre className="max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed text-[11px] text-emerald-300">
            {SQL_SCRIPT}
          </pre>
        </div>
      )}

      {/* Tabel Daftar Admin */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-neutral-900 text-sm">Daftar Akun Admin Terdaftar</h3>
          <button
            onClick={loadAdmins}
            className="text-xs text-neutral-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Perbarui Daftar
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-neutral-400">Memuat daftar admin...</div>
        ) : (
          <div className="divide-y divide-border">
            {admins.map((adm) => {
              const isMain = isSuperAdminEmail(adm.email);
              return (
                <div key={adm.id || adm.email} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-sm">
                      {adm.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900 text-sm">{adm.email}</span>
                        {isMain ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-300">
                            Super Admin
                          </span>
                        ) : (
                          <span className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full font-medium">
                            Admin Staf
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {adm.created_at ? `Terdaftar sejak ${new Date(adm.created_at).toLocaleDateString("id-ID")}` : "Akun Admin Terverifikasi"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => {
                        setResetTarget(adm);
                        setResetPassword("");
                        setResetError("");
                        setResetSuccess("");
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-300 bg-white hover:border-emerald-600 hover:text-emerald-700 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                      Reset Kata Sandi
                    </button>

                    {!isMain && (
                      <button
                        onClick={() => handleDeleteAdmin(adm.email)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-transparent text-destructive hover:bg-destructive/10 text-xs font-semibold transition-colors cursor-pointer"
                        title="Hapus akun admin"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {admins.length === 0 && (
              <div className="p-8 text-center text-sm text-neutral-400">
                Belum ada data admin lain. Klik "+ Tambah Admin Baru" untuk menambahkan staf.
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: TAMBAH ADMIN BARU */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-card rounded-xl border border-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2 text-emerald-700">
                <UserPlus className="w-5 h-5" />
                <h3 className="font-bold text-lg text-neutral-900">Tambah Akun Admin Baru</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              Akun yang Anda buatkan di sini akan langsung aktif dan otomatis memiliki hak akses masuk ke dashboard admin Sukawati Hub.
            </p>

            <form onSubmit={handleAddAdminSubmit} className="space-y-4">
              <label className="block text-xs font-semibold text-neutral-700">
                Email Admin Baru
                <input
                  type="email"
                  className={`${input} mt-1`}
                  placeholder="staf@sukawatihub.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </label>

              <label className="block text-xs font-semibold text-neutral-700">
                Kata Sandi Awal (Minimal 6 karakter)
                <div className="relative mt-1">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className={`${input} pr-10`}
                    placeholder="Minimal 6 karakter"
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showNewPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors p-0.5 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </label>

              {addError && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addError}</span>
                </div>
              )}

              {addSuccess && (
                <div className="p-3 rounded-md bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{addSuccess}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  Batal
                </button>
                <button type="submit" disabled={addBusy} className={btn}>
                  {addBusy ? "Membuat..." : "Simpan & Buat Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET KATA SANDI ADMIN */}
      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-card rounded-xl border border-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2 text-emerald-700">
                <KeyRound className="w-5 h-5" />
                <h3 className="font-bold text-lg text-neutral-900">Reset Kata Sandi</h3>
              </div>
              <button
                onClick={() => setResetTarget(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-neutral-50 rounded-lg p-3 text-xs border border-neutral-200">
              <span className="text-neutral-500">Akun Admin yang direset:</span>
              <p className="font-bold text-neutral-900 text-sm mt-0.5">{resetTarget.email}</p>
            </div>

            {/* Opsi 1: Set Kata Sandi Baru Langsung */}
            <form onSubmit={handleDirectResetSubmit} className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-neutral-700">
                Masukkan Kata Sandi Baru (Langsung Aktif)
                <div className="relative mt-1">
                  <input
                    type={showResetPassword ? "text" : "password"}
                    className={`${input} pr-10`}
                    placeholder="Ketik kata sandi baru (min 6 karakter)"
                    minLength={6}
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showResetPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors p-0.5 cursor-pointer"
                  >
                    {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </label>

              {resetError && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              {resetSuccess && (
                <div className="p-3 rounded-md bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{resetSuccess}</span>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <button type="submit" disabled={resetBusy || !resetPassword} className={btn}>
                  {resetBusy ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
                </button>

                <div className="relative my-2 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200"></div>
                  </div>
                  <span className="relative bg-card px-2 text-[10px] uppercase tracking-wider text-neutral-400">
                    atau kirim email
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSendResetEmail}
                  disabled={resetBusy}
                  className="w-full py-2 px-4 rounded-md border border-neutral-300 hover:border-emerald-600 hover:text-emerald-700 text-xs font-semibold text-neutral-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Kirim Tautan Reset ke Email ({resetTarget.email})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsPanel() {
  const { data: whatsapp, isLoading: isLoadingWa, refetch: refetchWa } = useQuery({ queryKey: ["setting", "whatsapp"], queryFn: () => fetchSetting("whatsapp") });
  const { data: emailSetting, isLoading: isLoadingEmail, refetch: refetchEmail } = useQuery({ queryKey: ["setting", "email"], queryFn: () => fetchSetting("email") });
  const { data: heroImageSetting, isLoading: isLoadingHero, refetch: refetchHero } = useQuery({ queryKey: ["setting", "hero_image"], queryFn: () => fetchSetting("hero_image") });
  
  const [wa, setWa] = useState("");
  const [email, setEmail] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (whatsapp) setWa(whatsapp);
  }, [whatsapp]);

  useEffect(() => {
    if (emailSetting) setEmail(emailSetting);
  }, [emailSetting]);

  useEffect(() => {
    if (heroImageSetting) setHeroImage(heroImageSetting);
  }, [heroImageSetting]);

  async function save() {
    setBusy(true);
    setSaveError(null);
    setSaveSuccess(null);
    const { error: err1 } = await supabase.from("settings").upsert({ key: "whatsapp", value: wa }, { onConflict: "key" });
    const { error: err2 } = await supabase.from("settings").upsert({ key: "email", value: email }, { onConflict: "key" });
    const { error: err3 } = await supabase.from("settings").upsert({ key: "hero_image", value: heroImage }, { onConflict: "key" });
    
    setBusy(false);
    const err = err1 || err2 || err3;
    if (err) {
      setSaveError(err.message || "Gagal menyimpan perubahan.");
    } else {
      setSaveSuccess("Pengaturan website berhasil disimpan!");
      refetchWa();
      refetchEmail();
      refetchHero();
    }
  }

  if (isLoadingWa || isLoadingEmail || isLoadingHero) return <p className="mt-8 text-muted-foreground">Memuat pengaturan...</p>;

  return (
    <div className="mt-8 max-w-lg space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">Pengaturan Kontak & Banner</h2>
        <p className="text-xs text-neutral-500 mt-1">Sesuaikan informasi kontak dan gambar banner utama di halaman beranda.</p>
      </div>

      {saveError && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-3 rounded-md bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}
      
      <label className="block text-xs font-semibold text-neutral-700 pt-2">
        Nomor WhatsApp Resmi
        <input className={`${input} mt-1`} value={wa} onChange={e => setWa(e.target.value)} placeholder="+62 812-3456-7890" />
        <span className="text-[11px] text-muted-foreground font-normal">Tampil di footer dan tombol WhatsApp mengambang.</span>
      </label>
      
      <label className="block text-xs font-semibold text-neutral-700">
        Alamat Email Resmi
        <input className={`${input} mt-1`} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="info@sukawatihub.com" />
        <span className="text-[11px] text-muted-foreground font-normal">Tampil di kolom kontak pada footer website.</span>
      </label>
      
      <label className="block text-xs font-semibold text-neutral-700">
        URL Foto Header Beranda
        <input className={`${input} mt-1`} type="url" value={heroImage} onChange={e => setHeroImage(e.target.value)} placeholder="https://..." />
        <span className="text-[11px] text-muted-foreground font-normal">Kosongkan jika ingin menggunakan foto default Sukawati.</span>
      </label>
      
      <div className="pt-2">
        <button className={btn} onClick={save} disabled={busy}>{busy ? "Menyimpan..." : "Simpan Perubahan"}</button>
      </div>
    </div>
  );
}

function Editor({ value, onClose, onSaved }: { value: Partial<Destination>; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState<Partial<Destination>>(value);
  
  // State Foto Utama
  const [file, setFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // State Galeri Foto (Multiple)
  const [gallery, setGallery] = useState<string[]>(Array.isArray(value.gallery_urls) ? value.gallery_urls.filter(Boolean) : []);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // State Video
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [busy, setBusy] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const set = (k: keyof Destination, v: unknown) => setF((p) => ({ ...p, [k]: v }));

  // Pratinjau Foto saat file baru dipilih
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPhotoPreview(null);
    }
  }, [file]);

  // Pratinjau Foto Galeri Baru
  useEffect(() => {
    if (newGalleryFiles.length > 0) {
      const urls = newGalleryFiles.map((file) => URL.createObjectURL(file));
      setNewGalleryPreviews(urls);
      return () => urls.forEach((u) => URL.revokeObjectURL(u));
    } else {
      setNewGalleryPreviews([]);
    }
  }, [newGalleryFiles]);

  // Pratinjau Video saat file baru dipilih
  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setVideoPreview(null);
    }
  }, [videoFile]);

  // Fungsi Hapus Foto Utama
  function handleRemovePhoto() {
    setFile(null);
    set("photo_url", null);
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  }

  // Fungsi Galeri Foto: Tambah dari input file multiple
  function handleAddGalleryFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setNewGalleryFiles((prev) => [...prev, ...selected]);
    }
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }

  // Fungsi Galeri Foto: Tambah dari tautan URL
  function handleAddPhotoUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      alert("Masukkan tautan gambar yang valid (diawali https:// atau http://)");
      return;
    }
    setGallery((prev) => [...prev, trimmed]);
    setUrlInput("");
  }

  // Fungsi Galeri Foto: Hapus foto tersimpan
  function handleRemoveExistingGalleryPhoto(index: number) {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  }

  // Fungsi Galeri Foto: Batalkan foto baru yang dipilih
  function handleRemoveNewGalleryFile(index: number) {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  }

  // Fungsi Galeri Foto: Ubah urutan foto (geser kiri/kanan)
  function handleMoveGalleryPhoto(index: number, direction: -1 | 1) {
    setGallery((prev) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  }

  // Fungsi Galeri Foto: Jadikan sebagai foto utama (Cover)
  function handleSetAsMainPhoto(url: string) {
    set("photo_url", url);
    alert("Foto ini berhasil dipilih sebagai Foto Utama (Cover) destinasi.");
  }

  // Fungsi Hapus Video
  function handleRemoveVideo() {
    setVideoFile(null);
    set("video_url", null);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setUploadStatus("Menyiapkan data...");
    try {
      // 1. Tangani Foto Utama Destinasi
      let photo_url = f.photo_url ?? null;
      if (file) {
        setUploadStatus("Mengunggah foto utama...");
        const path = `${Date.now()}-${slugify(file.name)}`;
        const up = await supabase.storage.from("destination-photos").upload(path, file, { contentType: file.type });
        if (up.error) throw up.error;
        photo_url = supabase.storage.from("destination-photos").getPublicUrl(path).data.publicUrl;
      }

      // 2. Tangani Unggah Foto Galeri Baru (Multiple)
      let uploadedGalleryUrls: string[] = [];
      if (newGalleryFiles.length > 0) {
        for (let i = 0; i < newGalleryFiles.length; i++) {
          const gFile = newGalleryFiles[i];
          setUploadStatus(`Mengunggah foto galeri (${i + 1}/${newGalleryFiles.length})...`);
          const path = `gallery-${Date.now()}-${i}-${slugify(gFile.name)}`;
          const up = await supabase.storage.from("destination-photos").upload(path, gFile, {
            contentType: gFile.type || "image/jpeg",
          });
          if (up.error) throw up.error;
          const url = supabase.storage.from("destination-photos").getPublicUrl(path).data.publicUrl;
          uploadedGalleryUrls.push(url);
        }
      }

      const finalGalleryUrls = [...gallery, ...uploadedGalleryUrls];

      // 3. Tangani Video Destinasi
      let video_url = f.video_url?.trim() || null;
      if (videoFile) {
        setUploadStatus("Mengunggah file video...");
        const path = `video-${Date.now()}-${slugify(videoFile.name)}`;
        
        let up = await supabase.storage.from("destination-videos").upload(path, videoFile, {
          contentType: videoFile.type || "video/mp4",
          upsert: true,
        });

        if (up.error && (up.error.message.includes("not found") || (up.error as any).statusCode === "404" || up.error.message.includes("NoSuchBucket") || up.error.message.includes("does not exist"))) {
          up = await supabase.storage.from("destination-photos").upload(path, videoFile, {
            contentType: videoFile.type || "video/mp4",
            upsert: true,
          });
          if (up.error) throw up.error;
          video_url = supabase.storage.from("destination-photos").getPublicUrl(path).data.publicUrl;
        } else if (up.error) {
          throw up.error;
        } else {
          video_url = supabase.storage.from("destination-videos").getPublicUrl(path).data.publicUrl;
        }
      }

      setUploadStatus("Menyimpan ke database...");
      const { id, ...rest } = f as Destination;
      const row = {
        ...rest,
        slug: f.slug || slugify(f.name ?? ""),
        photo_url,
        video_url,
        gallery_urls: finalGalleryUrls,
        updated_at: new Date().toISOString()
      };
      delete (row as Record<string, unknown>)["created_at"];

      const res = id
        ? await supabase.from("destinations").update(row).eq("id", id)
        : await supabase.from("destinations").insert(row);

      if (res.error) {
        if (res.error.message.includes("gallery_urls") || res.error.code === "42703") {
          throw new Error(
            "Kolom 'gallery_urls' belum ada di database Supabase Anda.\n\n" +
            "Silakan buka Supabase Dashboard > SQL Editor dan jalankan:\n" +
            "ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS gallery_urls text[] DEFAULT '{}'::text[];"
          );
        }
        if (res.error.message.includes("video_url") || res.error.code === "42703") {
          throw new Error(
            "Kolom 'video_url' belum ada di database Supabase Anda.\n\n" +
            "Silakan buka Supabase Dashboard > SQL Editor dan jalankan:\n" +
            "ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS video_url text;"
          );
        }
        throw res.error;
      }
      onSaved();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusy(false);
      setUploadStatus("");
    }
  }

  const field = (k: keyof Destination, label: string, area = false) => (
    <label className="block text-xs font-semibold text-neutral-700">
      {label}
      {area ? (
        <textarea className={`${input} mt-1 min-h-28`} value={(f[k] as string) ?? ""} onChange={(e) => set(k, e.target.value)} />
      ) : (
        <input className={`${input} mt-1`} value={(f[k] as string) ?? ""} onChange={(e) => set(k, e.target.value)} />
      )}
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4">
      <form onSubmit={save} className="my-8 w-full max-w-2xl space-y-4 rounded-xl bg-card border border-border p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-neutral-900">{f.id ? "Ubah" : "Tambah"} Destinasi</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("name", "Nama Destinasi *")}
          {field("slug", "Slug URL (otomatis jika kosong)")}
          <label className="block text-xs font-semibold text-neutral-700">
            Kelompok
            <select className={`${input} mt-1`} value={f.group_type} onChange={(e) => set("group_type", e.target.value)}>
              {Object.entries(GROUPS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          {field("category", "Kategori *")}
        </div>
        {field("short_description", "Deskripsi Singkat")}
        {field("description", "Deskripsi Lengkap", true)}
        <div className="grid gap-4 sm:grid-cols-2">
          {field("address", "Alamat")}
          {field("maps_url", "Tautan Google Maps")}
          {field("opening_hours", "Jam Buka")}
          {field("price", "Harga Tiket / Biaya")}
          {field("contact", "Nomor Kontak / WhatsApp")}
          {field("instagram", "Akun Instagram")}
        </div>

        {/* ── BAGIAN FOTO DESTINASI (BISA DIUNGGAH & DIHAPUS) ── */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Foto Destinasi</span>
            </div>
            {(f.photo_url || file) && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-xs text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" /> Hapus Foto
              </button>
            )}
          </div>

          <p className="text-xs text-neutral-500 leading-relaxed">
            Foto utama yang akan tampil pada kartu explore dan header halaman destinasi.
          </p>

          {/* Pratinjau Foto */}
          {(photoPreview || f.photo_url) ? (
            <div className="relative inline-block group">
              <div className="h-36 w-56 rounded-lg overflow-hidden border border-neutral-300 bg-neutral-200 shadow-sm relative">
                <img
                  src={photoPreview || f.photo_url || ""}
                  alt="Pratinjau Foto Destinasi"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  title="Hapus foto ini"
                  className="absolute top-2 right-2 bg-rose-600/90 hover:bg-rose-700 text-white rounded-full p-1.5 shadow-md transition-all hover:scale-110 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="block mt-1 text-[11px] text-neutral-500">
                {photoPreview ? "Foto baru dipilih (akan disimpan)" : "Foto saat ini tersimpan"}
              </span>
            </div>
          ) : (
            <div className="py-2 text-xs text-neutral-400 italic">
              Belum ada foto yang dipilih / foto telah dihapus.
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              {(photoPreview || f.photo_url) ? "Ganti Berkas Foto Utama:" : "Pilih Berkas Foto Utama:"}
            </label>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="block w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        {/* ── BAGIAN GALERI FOTO DESTINASI (TAMBAH, HAPUS, EDIT / GESER URUTAN) ── */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Images className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Galeri Foto Destinasi ({gallery.length + newGalleryFiles.length} Foto)
              </span>
            </div>
            {(gallery.length > 0 || newGalleryFiles.length > 0) && (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Kosongkan semua foto galeri destinasi ini?")) {
                    setGallery([]);
                    setNewGalleryFiles([]);
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" /> Hapus Semua
              </button>
            )}
          </div>

          <p className="text-xs text-neutral-500 leading-relaxed">
            Foto-foto ini akan tampil sebagai galeri foto interaktif di halaman destinasi. Anda bisa mengunggah berkas foto (bisa banyak sekaligus), mengubah urutan, menjadikannya foto utama, atau menghapus foto.
          </p>

          {/* Daftar Foto Saat Ini & Foto Baru */}
          {(gallery.length > 0 || newGalleryPreviews.length > 0) ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
              {/* Foto yang sudah tersimpan */}
              {gallery.map((url, idx) => (
                <div key={`existing-${idx}`} className="group relative rounded-xl overflow-hidden border border-neutral-300 bg-neutral-200 shadow-sm aspect-square">
                  <img src={url} alt={`Galeri ${idx + 1}`} className="w-full h-full object-cover" />
                  
                  {/* Badge Nomor */}
                  <span className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                    #{idx + 1}
                  </span>

                  {/* Overlay Kontrol Edit, Geser, Hapus */}
                  <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingGalleryPhoto(idx)}
                        title="Hapus foto ini dari galeri"
                        className="bg-rose-600 text-white rounded p-1 hover:bg-rose-700 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveGalleryPhoto(idx, -1)}
                          title="Geser ke kiri / ke atas"
                          className="bg-white/20 hover:bg-white/40 disabled:opacity-20 text-white rounded p-1 transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === gallery.length - 1}
                          onClick={() => handleMoveGalleryPhoto(idx, 1)}
                          title="Geser ke kanan / ke bawah"
                          className="bg-white/20 hover:bg-white/40 disabled:opacity-20 text-white rounded p-1 transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSetAsMainPhoto(url)}
                        title="Jadikan Foto Utama (Cover)"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-medium px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 shadow"
                      >
                        <Star className="w-3 h-3 fill-white text-white" /> Cover
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Foto baru yang dipilih (Pending upload) */}
              {newGalleryPreviews.map((url, idx) => (
                <div key={`new-${idx}`} className="group relative rounded-xl overflow-hidden border-2 border-emerald-500 bg-neutral-200 shadow-sm aspect-square">
                  <img src={url} alt={`Baru ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                    Baru
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveNewGalleryFile(idx)}
                    title="Batalkan foto ini"
                    className="absolute top-1.5 right-1.5 bg-rose-600 text-white rounded-full p-1 shadow hover:bg-rose-700 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-5 text-center rounded-lg border border-dashed border-neutral-300 bg-white/60 text-xs text-neutral-400">
              Belum ada foto di galeri. Pilih beberapa foto dari perangkat Anda atau tambahkan tautan gambar di bawah ini.
            </div>
          )}

          {/* Kontrol Tambah Foto Galeri */}
          <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-neutral-200/80">
            {/* Opsi 1: Unggah Berkas Foto (Multiple) */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                + Unggah Berkas Foto Galeri (Bisa Banyak Sekaligus):
              </label>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="block w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                onChange={handleAddGalleryFiles}
              />
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Pilih satu atau beberapa foto (JPG, PNG, WebP). Akan otomatis diunggah saat disimpan.
              </span>
            </div>

            {/* Opsi 2: Tambah via URL Gambar */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Atau Tambah Tautan / URL Foto:
              </label>
              <div className="flex gap-1.5">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... atau tautan gambar"
                  className={`${input} text-xs flex-1`}
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddPhotoUrl();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddPhotoUrl}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shrink-0"
                >
                  + Tambah
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── BAGIAN VIDEO DESTINASI (BISA DIUNGGAH & DIHAPUS) ── */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Video Destinasi (Opsional)</span>
            </div>
            {(f.video_url || videoFile) && (
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="text-xs text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" /> Hapus Video
              </button>
            )}
          </div>

          <p className="text-xs text-neutral-500 leading-relaxed">
            Unggah file video (MP4/WebM) ATAU masukkan tautan video YouTube / link video eksternal. Video akan ditampilkan di halaman detail destinasi.
          </p>

          {/* Pratinjau Video */}
          {(videoPreview || f.video_url) ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-neutral-600">
                  {videoPreview ? "Video baru dipilih (akan disimpan):" : "Video terpasang saat ini:"}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="text-[11px] text-rose-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <X className="w-3 h-3" /> Batalkan / Hapus
                </button>
              </div>
              <div className="max-w-md aspect-video rounded-lg overflow-hidden bg-black border border-neutral-300 shadow-inner relative group">
                {videoPreview ? (
                  <video src={videoPreview} controls className="w-full h-full object-contain" />
                ) : f.video_url ? (
                  getYouTubeEmbedUrl(f.video_url) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(f.video_url)!}
                      title="Pratinjau Video"
                      className="w-full h-full border-0"
                      allowFullScreen
                    />
                  ) : (
                    <video src={f.video_url} controls className="w-full h-full object-contain">
                      Format video tidak didukung.
                    </video>
                  )
                ) : null}
              </div>
            </div>
          ) : (
            <div className="py-2 text-xs text-neutral-400 italic">
              Belum ada video yang dipilih / video telah dihapus.
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 pt-1">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                {(videoPreview || f.video_url) ? "Ganti File Video (MP4 / WebM):" : "Unggah File Video (MP4 / WebM):"}
              </label>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/*"
                className="block w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 cursor-pointer"
                onChange={(e) => {
                  const selected = e.target.files?.[0] ?? null;
                  if (selected) {
                    if (selected.size > 52428800) {
                      alert("Peringatan: Ukuran video melebihi 50MB. Disarankan mengompres video atau menggunakan link YouTube jika terjadi kendala saat upload.");
                    }
                    setVideoFile(selected);
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Atau Tautan Video (YouTube / Link Langsung):
              </label>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                className={`${input} text-xs`}
                value={(f.video_url as string) ?? ""}
                onChange={(e) => {
                  set("video_url", e.target.value);
                  if (e.target.value) {
                    setVideoFile(null);
                    if (videoInputRef.current) videoInputRef.current.value = "";
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-neutral-700 pt-2">
          <label className="flex items-center gap-2 cursor-pointer font-medium">
            <input type="checkbox" checked={!!f.is_published} onChange={(e) => set("is_published", e.target.checked)} className="rounded" />
            Tampilkan di website publik
          </label>
          <label className="flex items-center gap-2 font-medium">
            Urutan Tampil
            <input type="number" className={`${input} w-20 py-1`} value={f.sort_order ?? 0} onChange={(e) => set("sort_order", Number(e.target.value))} />
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <button type="button" className="rounded-md border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer" onClick={onClose}>
            Batal
          </button>
          <button className={btn} disabled={busy || !f.name || !f.category}>
            {busy ? (uploadStatus || "Menyimpan...") : "Simpan Destinasi"}
          </button>
        </div>
      </form>
    </div>
  );
}
