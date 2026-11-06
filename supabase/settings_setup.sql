-- ==============================================================================
-- SQL SETUP: TABEL PENGATURAN WEBSITE (public.settings)
-- Jalankan skrip ini di: Supabase Dashboard > SQL Editor > New Query > Run
-- ==============================================================================

-- 1. Buat tabel settings jika belum ada
create table if not exists public.settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

-- 2. Berikan hak akses (grants)
grant select on public.settings to anon, authenticated;
grant insert, update, delete on public.settings to authenticated;
grant all on public.settings to service_role;

-- 3. Aktifkan Row Level Security (RLS)
alter table public.settings enable row level security;

-- 4. Kebijakan Keamanan RLS
-- Publik dan pengunjung dapat membaca pengaturan (No WA, Email, Foto Header)
drop policy if exists "Public reads settings" on public.settings;
create policy "Public reads settings"
  on public.settings
  for select
  to anon, authenticated
  using (true);

-- Pengguna yang telah login (admin) dapat menambah dan memperbarui pengaturan
drop policy if exists "Admin upsert settings" on public.settings;
create policy "Admin upsert settings"
  on public.settings
  for all
  to authenticated
  using (true)
  with check (true);

-- 5. Masukkan data nilai default
insert into public.settings (key, value) values
  ('whatsapp', '+6281381440325'),
  ('email', 'info@sukawatihub.com'),
  ('hero_image', '')
on conflict (key) do update set 
  value = excluded.value,
  updated_at = now();
