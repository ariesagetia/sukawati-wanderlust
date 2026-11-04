-- ==============================================================================
-- SQL SETUP: FITUR KHUSUS SUPER ADMIN (ariesagetia@gmail.com & ariesagetia@pnb.ac.id)
-- Jalankan skrip ini di: Supabase Dashboard > SQL Editor > New Query > Run
-- ==============================================================================

-- 1. Pastikan ekstensi pgcrypto aktif untuk enkripsi password bcrypt
create extension if not exists pgcrypto with schema extensions;

-- 2. Pastikan ariesagetia@gmail.com dan ariesagetia@pnb.ac.id memiliki role admin
insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role from auth.users
where lower(email) in ('ariesagetia@gmail.com', 'ariesagetia@pnb.ac.id')
on conflict (user_id, role) do nothing;

-- 3. Fungsi untuk mengambil daftar semua admin (Bebas dari ambiguitas kolom)
create or replace function public.get_all_admins()
returns table (
  id uuid,
  email text,
  role text,
  created_at timestamptz,
  last_sign_in_at timestamptz
) language plpgsql security definer set search_path = public, auth as $$
#variable_conflict use_column
declare
  _caller_email text;
begin
  select lower(u.email) into _caller_email from auth.users u where u.id = auth.uid();
  if _caller_email is null or _caller_email not in ('ariesagetia@gmail.com', 'ariesagetia@pnb.ac.id') then
    raise exception 'Akses ditolak: Hanya Super Admin (ariesagetia@gmail.com / ariesagetia@pnb.ac.id) yang dapat melihat daftar admin.';
  end if;

  return query
  select 
    u.id,
    u.email::text,
    r.role::text,
    u.created_at,
    u.last_sign_in_at
  from auth.users u
  join public.user_roles r on r.user_id = u.id
  where r.role = 'admin'::public.app_role
  order by u.created_at desc;
end;
$$;
grant execute on function public.get_all_admins() to authenticated;

-- 4. Fungsi untuk membuat akun admin baru langsung
create or replace function public.admin_create_user(_email text, _password text)
returns json language plpgsql security definer set search_path = public, auth, extensions as $$
#variable_conflict use_column
declare
  _caller_email text;
  _new_user_id uuid;
  _encrypted_pw text;
begin
  select lower(u.email) into _caller_email from auth.users u where u.id = auth.uid();
  if _caller_email is null or _caller_email not in ('ariesagetia@gmail.com', 'ariesagetia@pnb.ac.id') then
    raise exception 'Akses ditolak: Hanya Super Admin yang dapat membuat akun admin.';
  end if;

  if _email is null or length(trim(_email)) = 0 then
    raise exception 'Email tidak boleh kosong.';
  end if;

  if _password is null or length(_password) < 6 then
    raise exception 'Kata sandi minimal 6 karakter.';
  end if;

  -- Jika user sudah terdaftar sebelumnya di auth.users:
  if exists (select 1 from auth.users u where lower(u.email) = lower(trim(_email))) then
    select u.id into _new_user_id from auth.users u where lower(u.email) = lower(trim(_email));
    
    insert into public.user_roles (user_id, role)
    values (_new_user_id, 'admin'::public.app_role)
    on conflict (user_id, role) do nothing;

    update auth.users
    set encrypted_password = extensions.crypt(_password, extensions.gen_salt('bf')),
        email_confirmed_at = coalesce(email_confirmed_at, now()),
        updated_at = now()
    where id = _new_user_id;

    return json_build_object(
      'success', true,
      'message', 'Akun ' || _email || ' sudah ada; berhasil dijadikan admin dan kata sandi diperbarui.',
      'user_id', _new_user_id
    );
  end if;

  _encrypted_pw := extensions.crypt(_password, extensions.gen_salt('bf'));
  _new_user_id := gen_random_uuid();

  insert into auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role,
    aud,
    confirmation_token
  ) values (
    _new_user_id,
    '00000000-0000-0000-0000-000000000000',
    lower(trim(_email)),
    _encrypted_pw,
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    'authenticated',
    'authenticated',
    ''
  );

  insert into auth.identities (
    id,
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    _new_user_id,
    _new_user_id::text,
    _new_user_id,
    json_build_object('sub', _new_user_id::text, 'email', lower(trim(_email))),
    'email',
    now(),
    now(),
    now()
  );

  insert into public.user_roles (user_id, role)
  values (_new_user_id, 'admin'::public.app_role)
  on conflict (user_id, role) do nothing;

  return json_build_object('success', true, 'message', 'Akun admin berhasil dibuat.', 'user_id', _new_user_id);
end;
$$;
grant execute on function public.admin_create_user(text, text) to authenticated;

-- 5. Fungsi untuk mereset kata sandi admin langsung
create or replace function public.admin_reset_password(_target_email text, _new_password text)
returns json language plpgsql security definer set search_path = public, auth, extensions as $$
#variable_conflict use_column
declare
  _caller_email text;
  _target_id uuid;
begin
  select lower(u.email) into _caller_email from auth.users u where u.id = auth.uid();
  if _caller_email is null or _caller_email not in ('ariesagetia@gmail.com', 'ariesagetia@pnb.ac.id') then
    raise exception 'Akses ditolak: Hanya Super Admin yang dapat mereset kata sandi.';
  end if;

  if _new_password is null or length(_new_password) < 6 then
    raise exception 'Kata sandi baru minimal 6 karakter.';
  end if;

  select u.id into _target_id from auth.users u where lower(u.email) = lower(trim(_target_email));
  if _target_id is null then
    raise exception 'User dengan email % tidak ditemukan.', _target_email;
  end if;

  update auth.users
  set encrypted_password = extensions.crypt(_new_password, extensions.gen_salt('bf')),
      email_confirmed_at = coalesce(email_confirmed_at, now()),
      updated_at = now()
  where id = _target_id;

  return json_build_object('success', true, 'message', 'Kata sandi untuk ' || _target_email || ' berhasil diubah.');
end;
$$;
grant execute on function public.admin_reset_password(text, text) to authenticated;

-- 6. Fungsi untuk menghapus admin
create or replace function public.admin_delete_admin(_target_email text)
returns json language plpgsql security definer set search_path = public, auth as $$
#variable_conflict use_column
declare
  _caller_email text;
  _target_id uuid;
begin
  select lower(u.email) into _caller_email from auth.users u where u.id = auth.uid();
  if _caller_email is null or _caller_email not in ('ariesagetia@gmail.com', 'ariesagetia@pnb.ac.id') then
    raise exception 'Akses ditolak: Hanya Super Admin yang dapat menghapus admin.';
  end if;

  if lower(trim(_target_email)) in ('ariesagetia@gmail.com', 'ariesagetia@pnb.ac.id') then
    raise exception 'Tidak dapat menghapus akun Super Admin utama.';
  end if;

  select u.id into _target_id from auth.users u where lower(u.email) = lower(trim(_target_email));
  if _target_id is not null then
    delete from public.user_roles where user_id = _target_id;
    delete from auth.identities where user_id = _target_id;
    delete from auth.users where id = _target_id;
  end if;

  return json_build_object('success', true, 'message', 'Akun admin berhasil dihapus.');
end;
$$;
grant execute on function public.admin_delete_admin(text) to authenticated;
