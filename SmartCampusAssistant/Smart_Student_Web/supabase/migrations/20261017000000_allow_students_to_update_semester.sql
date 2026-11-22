grant update (semester) on public.profiles to authenticated;

drop policy if exists "Students update their own semester"
  on public.profiles;
create policy "Students update their own semester"
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));
