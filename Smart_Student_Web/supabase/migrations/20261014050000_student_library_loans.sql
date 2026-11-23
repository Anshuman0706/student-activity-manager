create table if not exists public.student_library_loans (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  book_name text not null check (char_length(btrim(book_name)) between 1 and 200),
  borrowed_on date not null,
  return_by date not null,
  created_at timestamptz not null default now(),
  constraint student_library_return_after_borrow
    check (return_by >= borrowed_on)
);

create index if not exists student_library_loans_owner_return_idx
  on public.student_library_loans (student_id, return_by);

alter table public.student_library_loans enable row level security;

drop policy if exists "Students read their own library reminders"
  on public.student_library_loans;
create policy "Students read their own library reminders"
  on public.student_library_loans
  for select
  to authenticated
  using (student_id = (select auth.uid()));

drop policy if exists "Students add their own library reminders"
  on public.student_library_loans;
create policy "Students add their own library reminders"
  on public.student_library_loans
  for insert
  to authenticated
  with check (student_id = (select auth.uid()));

grant select, insert on public.student_library_loans to authenticated;

notify pgrst, 'reload schema';
