-- Jalankan sekali di Supabase Dashboard > SQL Editor

create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create table public.destinations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  group_type text not null default 'destinasi', -- destinasi | seni | kerajinan | kuliner
  category text not null,
  short_description text,
  description text,
  address text,
  maps_url text,
  opening_hours text,
  price text,
  contact text,
  instagram text,
  photo_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.destinations to anon, authenticated;
grant insert, update, delete on public.destinations to authenticated;
grant all on public.destinations to service_role;
alter table public.destinations enable row level security;
create policy "Public reads published" on public.destinations for select to anon, authenticated using (is_published or public.has_role(auth.uid(), 'admin'));
create policy "Admin insert" on public.destinations for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admin update" on public.destinations for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admin delete" on public.destinations for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Penyimpanan foto
insert into storage.buckets (id, name, public) values ('destination-photos', 'destination-photos', true) on conflict do nothing;
create policy "Public read photos" on storage.objects for select using (bucket_id = 'destination-photos');
create policy "Admin upload photos" on storage.objects for insert to authenticated with check (bucket_id = 'destination-photos' and public.has_role(auth.uid(), 'admin'));
create policy "Admin update photos" on storage.objects for update to authenticated using (bucket_id = 'destination-photos' and public.has_role(auth.uid(), 'admin'));
create policy "Admin delete photos" on storage.objects for delete to authenticated using (bucket_id = 'destination-photos' and public.has_role(auth.uid(), 'admin'));

-- Data awal (dari dokumen Potensi Desa Sukawati)
insert into public.destinations (slug, name, group_type, category, short_description, description, sort_order) values
('pura-puseh-desa-sukawati','Pura Puseh Desa Sukawati','destinasi','Heritage & Cultural Tourism','Pura desa bersejarah dengan arsitektur Bali klasik.','Pura Puseh merupakan salah satu pura utama Kahyangan Tiga Desa Sukawati, pusat kegiatan upacara dan warisan budaya masyarakat.',1),
('pasar-seni-desa-sukawati','Pasar Seni Desa Sukawati','destinasi','Art & Shopping Tourism','Pusat belanja kerajinan dan seni khas Bali.','Pasar Seni Sukawati dikenal sebagai tempat berburu lukisan, kain, ukiran, dan cendera mata khas Bali.',2),
('jogging-track-desa-sukawati','Jogging Track Desa Sukawati','destinasi','Recreation','Jalur rekreasi di tengah suasana desa.','Jalur jogging yang menjadi ruang rekreasi dan olahraga bagi warga maupun wisatawan.',3),
('puri-sukawati','Puri Sukawati','destinasi','Heritage & Cultural Tourism','Istana kerajaan bersejarah Sukawati.','Puri Sukawati adalah kediaman keluarga kerajaan dengan nilai sejarah dan arsitektur tradisional Bali.',4),
('pantai-purnama','Pantai Purnama','destinasi','Nature & Coastal Tourism','Pantai pasir hitam yang tenang.','Pantai Purnama menawarkan pasir hitam vulkanik, ombak, dan suasana matahari terbit yang indah.',5),
('tukad-petanu','Tukad Petanu','destinasi','Nature Tourism','Sungai alami dengan lanskap hijau.','Tukad Petanu adalah sungai dengan lembah hijau yang menyimpan potensi wisata alam dan legenda lokal.',6),
('sanggar-tari-laras','Sanggar Tari Laras','seni','Tari','Sanggar tari tradisional Bali.','Tempat belajar dan pertunjukan tari Bali.',10),
('sanggar-gender-wayang-pak-tut-buda','Sanggar Gender & Wayang Pak Tut Buda','seni','Gender & Wayang','Kesenian gender dan wayang.','Sanggar kesenian gender wayang dan pertunjukan wayang kulit.',11),
('sanggar-tabuh','Sanggar Tabuh','seni','Tabuh/Gamelan','Kesenian tabuh dan gamelan.','Sanggar latihan dan pertunjukan gamelan Bali.',12),
('sanggar-vokal-musik-cressendo','Sanggar Vokal & Musik Cressendo','seni','Vokal & Musik','Sanggar vokal dan musik.','Kegiatan pelatihan vokal dan musik.',13),
('pande-besi','Pande Besi','kerajinan','Kerajinan Logam','Melihat proses pembuatan kerajinan logam.','Wisatawan dapat melihat proses dan mengenal teknik kerajinan pande besi.',20),
('ukir-wayang','Ukir Wayang','kerajinan','Seni Ukir','Proses ukir wayang dan workshop.','Melihat proses ukir wayang dan kemungkinan mengikuti workshop.',21),
('kamen-prada','Membuat Kamen Prada','kerajinan','Tekstil/Seni','Pembuatan kain prada khas Bali.','Melihat proses pembuatan kamen prada dan pengenalan produk.',22),
('nasi-lawar-sukawati-moning','Nasi Lawar Sukawati (Moning)','kuliner','Kuliner Lokal','Nasi lawar legendaris Sukawati.','Kuliner khas lawar Bali yang populer di Sukawati.',30),
('nasi-tahu-khas-sukawati','Nasi Tahu Khas Sukawati','kuliner','Kuliner Lokal','Nasi tahu khas Sukawati.','Hidangan sederhana khas Sukawati yang digemari.',31);

-- SETELAH membuat akun admin di Authentication > Users, jalankan:
-- insert into public.user_roles (user_id, role) select id, 'admin' from auth.users where email = 'EMAIL_ADMIN_ANDA';
