create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  subject text not null check (char_length(btrim(subject)) between 1 and 100),
  attended integer not null default 0 check (attended >= 0),
  total integer not null default 0 check (total >= attended),
  created_at timestamptz not null default now(),
  constraint attendance_student_subject_unique unique (student_id, subject)
);

create index if not exists attendance_student_subject_idx
  on public.attendance (student_id, subject);

alter table public.attendance enable row level security;

drop policy if exists "Students and admins read attendance" on public.attendance;
create policy "Students and admins read attendance"
  on public.attendance
  for select
  to authenticated
  using (student_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Students and admins create attendance" on public.attendance;
create policy "Students and admins create attendance"
  on public.attendance
  for insert
  to authenticated
  with check (student_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Students and admins update attendance" on public.attendance;
create policy "Students and admins update attendance"
  on public.attendance
  for update
  to authenticated
  using (student_id = (select auth.uid()) or (select public.is_admin()))
  with check (student_id = (select auth.uid()) or (select public.is_admin()));

grant select, insert, update on public.attendance to authenticated;
