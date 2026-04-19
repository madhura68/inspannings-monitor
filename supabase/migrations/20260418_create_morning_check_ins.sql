create table if not exists public.morning_check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  check_in_date date not null,
  energy_score integer not null check (energy_score between 1 and 10),
  sleep_quality text not null check (sleep_quality in ('goed', 'matig', 'slecht')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, check_in_date)
);

grant select, insert, update on table public.morning_check_ins to authenticated;

alter table public.morning_check_ins enable row level security;

drop trigger if exists set_morning_check_ins_updated_at on public.morning_check_ins;
create trigger set_morning_check_ins_updated_at
before update on public.morning_check_ins
for each row
execute function public.set_updated_at();

drop policy if exists "morning_check_ins_select_own" on public.morning_check_ins;
create policy "morning_check_ins_select_own"
on public.morning_check_ins
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "morning_check_ins_insert_own" on public.morning_check_ins;
create policy "morning_check_ins_insert_own"
on public.morning_check_ins
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "morning_check_ins_update_own" on public.morning_check_ins;
create policy "morning_check_ins_update_own"
on public.morning_check_ins
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
