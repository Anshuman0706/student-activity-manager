create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  subject text not null check (char_length(btrim(subject)) between 1 and 100),
  exam_date date not null,
  created_at timestamptz not null default now()
);

create index if not exists exams_student_exam_date_idx
  on public.exams (student_id, exam_date);

alter table public.exams enable row level security;

drop policy if exists "Students read their own exams" on public.exams;
create policy "Students read their own exams"
  on public.exams
  for select
  to authenticated
  using (student_id = (select auth.uid()));

drop policy if exists "Students create their own exams" on public.exams;
create policy "Students create their own exams"
  on public.exams
  for insert
  to authenticated
  with check (student_id = (select auth.uid()));

grant select, insert on public.exams to authenticated;
