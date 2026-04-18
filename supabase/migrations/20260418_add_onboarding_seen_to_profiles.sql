alter table public.profiles
add column if not exists onboarding_seen boolean not null default false;

update public.profiles
set onboarding_seen = true
where onboarding_completed = true
  and onboarding_seen = false;
