alter table public.profiles
  drop constraint if exists profiles_semester_check;

alter table public.profiles
  add constraint profiles_semester_range_check
  check (semester between 1 and 8);
