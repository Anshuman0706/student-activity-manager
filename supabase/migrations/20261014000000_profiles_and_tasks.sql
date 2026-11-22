create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(btrim(full_name)) between 2 and 100),
  branch text not null check (char_length(btrim(branch)) between 1 and 80),
  semester integer not null check (semester between 1 and 8),
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 99),
  due_date date not null,
  created_at timestamptz not null default now()
);

create index if not exists tasks_student_due_date_idx
  on public.tasks (student_id, due_date);
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;

drop policy if exists "Profiles are readable by their owner or admins"
  on public.profiles;
create policy "Profiles are readable by their owner or admins"
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Students read their own tasks" on public.tasks;
create policy "Students read their own tasks"
  on public.tasks
  for select
  to authenticated
  using (student_id = (select auth.uid()));

drop policy if exists "Students create their own tasks" on public.tasks;
create policy "Students create their own tasks"
  on public.tasks
  for insert
  to authenticated
  with check (student_id = (select auth.uid()));

grant select on public.profiles to authenticated;
grant select, insert on public.tasks to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, branch, semester)
  values (
    new.id,
    btrim(coalesce(new.raw_user_meta_data ->> 'full_name', '')),
    btrim(coalesce(new.raw_user_meta_data ->> 'branch', '')),
    nullif(new.raw_user_meta_data ->> 'semester', '')::integer
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
