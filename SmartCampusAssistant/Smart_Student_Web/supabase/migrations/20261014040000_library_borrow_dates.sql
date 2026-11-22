alter table public.books
  add column if not exists borrowed_on date,
  add column if not exists return_by date;

alter table public.books
  drop constraint if exists books_return_by_after_borrowed_on;

alter table public.books
  add constraint books_return_by_after_borrowed_on
  check (
    borrowed_on is null
    or return_by is null
    or return_by >= borrowed_on
  );

grant update (borrowed_on, return_by) on public.books to authenticated;

drop policy if exists "Students issue or return their own books" on public.books;
create policy "Students issue or return their own books"
  on public.books
  for update
  to authenticated
  using (issued_to is null or issued_to = (select auth.uid()))
  with check (
    (
      issued_to is null
      and borrowed_on is null
      and return_by is null
    )
    or (
      issued_to = (select auth.uid())
      and borrowed_on is not null
      and return_by is not null
      and return_by >= borrowed_on
    )
  );

notify pgrst, 'reload schema';
