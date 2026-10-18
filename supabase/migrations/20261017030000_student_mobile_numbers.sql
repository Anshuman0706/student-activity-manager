alter table public.profiles
  add column if not exists mobile_number text;

alter table public.profiles
  drop constraint if exists profiles_mobile_number_check;

alter table public.profiles
  add constraint profiles_mobile_number_check
  check (
    mobile_number is null
    or (
      mobile_number ~ '^\+?[0-9 ()-]+$'
      and char_length(regexp_replace(mobile_number, '[^0-9]', '', 'g')) between 7 and 15
    )
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, mobile_number, branch, semester)
  values (
    new.id,
    btrim(coalesce(new.raw_user_meta_data ->> 'full_name', '')),
    btrim(coalesce(new.raw_user_meta_data ->> 'mobile_number', '')),
    btrim(coalesce(new.raw_user_meta_data ->> 'branch', '')),
    nullif(new.raw_user_meta_data ->> 'semester', '')::integer
  );

  return new;
end;
$$;

create or replace function public.update_own_profile_mobile_number(
  p_mobile_number text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication is required';
  end if;

  if p_mobile_number is null
    or p_mobile_number !~ '^\+?[0-9 ()-]+$'
    or char_length(regexp_replace(p_mobile_number, '[^0-9]', '', 'g')) not between 7 and 15
  then
    raise exception 'Mobile number must contain 7 to 15 digits';
  end if;

  update public.profiles
  set mobile_number = btrim(p_mobile_number)
  where id = (select auth.uid());

  return found;
end;
$$;

revoke all on function public.update_own_profile_mobile_number(text) from public;
grant execute on function public.update_own_profile_mobile_number(text) to authenticated;






