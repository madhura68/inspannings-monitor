create table if not exists public.activity_categories (
  id uuid primary key,
  key text not null unique,
  label_nl text not null,
  sort_order integer not null check (sort_order >= 1),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.skip_reasons (
  id uuid primary key,
  key text not null unique,
  label_nl text not null,
  sort_order integer not null check (sort_order >= 1),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  activity_date date not null,
  source text not null default 'planned',
  status text not null default 'planned',
  name text not null,
  category_id uuid not null references public.activity_categories (id),
  duration_minutes integer not null,
  impact_level text not null,
  priority_level text not null,
  skip_reason_id uuid references public.skip_reasons (id),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint activities_source_check
    check (source in ('planned', 'ad_hoc')),
  constraint activities_status_check
    check (status in ('planned', 'completed', 'skipped', 'adjusted')),
  constraint activities_name_check
    check (char_length(trim(name)) between 1 and 120),
  constraint activities_duration_minutes_check
    check (duration_minutes > 0 and duration_minutes <= 720),
  constraint activities_impact_level_check
    check (impact_level in ('laag', 'midden', 'hoog')),
  constraint activities_priority_level_check
    check (priority_level in ('laag', 'normaal', 'hoog'))
);

create index if not exists activities_user_date_idx
  on public.activities (user_id, activity_date);

create index if not exists activity_categories_sort_order_idx
  on public.activity_categories (sort_order);

create index if not exists skip_reasons_sort_order_idx
  on public.skip_reasons (sort_order);

grant select on table public.activity_categories to authenticated;
grant select on table public.skip_reasons to authenticated;
grant select, insert, update, delete on table public.activities to authenticated;

alter table public.activity_categories enable row level security;
alter table public.skip_reasons enable row level security;
alter table public.activities enable row level security;

drop trigger if exists set_activities_updated_at on public.activities;
create trigger set_activities_updated_at
before update on public.activities
for each row
execute function public.set_updated_at();

drop policy if exists "activity_categories_select_active" on public.activity_categories;
create policy "activity_categories_select_active"
on public.activity_categories
for select
to authenticated
using (is_active = true);

drop policy if exists "skip_reasons_select_active" on public.skip_reasons;
create policy "skip_reasons_select_active"
on public.skip_reasons
for select
to authenticated
using (is_active = true);

drop policy if exists "activities_select_own" on public.activities;
create policy "activities_select_own"
on public.activities
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "activities_insert_own" on public.activities;
create policy "activities_insert_own"
on public.activities
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "activities_update_own" on public.activities;
create policy "activities_update_own"
on public.activities
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "activities_delete_own" on public.activities;
create policy "activities_delete_own"
on public.activities
for delete
to authenticated
using ((select auth.uid()) = user_id);

insert into public.activity_categories (id, key, label_nl, sort_order, is_active)
values
  ('0d0d8b31-5e4c-4d1d-b5df-6b98df0a1001', 'huishouden', 'Huishouden', 1, true),
  ('0d0d8b31-5e4c-4d1d-b5df-6b98df0a1002', 'werk_studie', 'Werk of studie', 2, true),
  ('0d0d8b31-5e4c-4d1d-b5df-6b98df0a1003', 'administratie', 'Administratie', 3, true),
  ('0d0d8b31-5e4c-4d1d-b5df-6b98df0a1004', 'sociaal', 'Sociaal', 4, true),
  ('0d0d8b31-5e4c-4d1d-b5df-6b98df0a1005', 'beweging', 'Beweging', 5, true),
  ('0d0d8b31-5e4c-4d1d-b5df-6b98df0a1006', 'rust_herstel', 'Rust en herstel', 6, true),
  ('0d0d8b31-5e4c-4d1d-b5df-6b98df0a1007', 'reizen', 'Reizen', 7, true),
  ('0d0d8b31-5e4c-4d1d-b5df-6b98df0a1008', 'vrije_tijd', 'Vrije tijd', 8, true)
on conflict (key) do update
set
  label_nl = excluded.label_nl,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into public.skip_reasons (id, key, label_nl, sort_order, is_active)
values
  ('9f4f1b75-f2a4-4d20-b80c-6f89e8142001', 'energie_te_laag', 'Energie te laag', 1, true),
  ('9f4f1b75-f2a4-4d20-b80c-6f89e8142002', 'prioriteit_veranderd', 'Prioriteit veranderde', 2, true),
  ('9f4f1b75-f2a4-4d20-b80c-6f89e8142003', 'praktische_belemmering', 'Praktische belemmering', 3, true),
  ('9f4f1b75-f2a4-4d20-b80c-6f89e8142004', 'duurde_langer_dan_verwacht', 'Vorige activiteit duurde langer', 4, true),
  ('9f4f1b75-f2a4-4d20-b80c-6f89e8142005', 'te_belastend', 'Te belastend', 5, true),
  ('9f4f1b75-f2a4-4d20-b80c-6f89e8142006', 'vergeten', 'Vergeten', 6, true)
on conflict (key) do update
set
  label_nl = excluded.label_nl,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;
