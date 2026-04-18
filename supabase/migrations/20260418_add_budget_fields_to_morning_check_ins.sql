alter table public.morning_check_ins
add column if not exists energy_level text;

alter table public.morning_check_ins
add column if not exists daily_budget integer;

alter table public.morning_check_ins
add column if not exists budget_formula_version integer;

update public.morning_check_ins
set
  energy_level = case
    when energy_score between 1 and 2 then 'zeer_laag'
    when energy_score between 3 and 4 then 'laag'
    when energy_score between 5 and 6 then 'midden'
    when energy_score between 7 and 8 then 'redelijk'
    else 'hoog'
  end,
  daily_budget = energy_score,
  budget_formula_version = 1
where energy_level is null
   or daily_budget is null
   or budget_formula_version is null;

alter table public.morning_check_ins
alter column energy_level set not null;

alter table public.morning_check_ins
alter column daily_budget set not null;

alter table public.morning_check_ins
alter column budget_formula_version set not null;

alter table public.morning_check_ins
add constraint morning_check_ins_energy_level_check
check (energy_level in ('zeer_laag', 'laag', 'midden', 'redelijk', 'hoog'));

alter table public.morning_check_ins
add constraint morning_check_ins_daily_budget_check
check (daily_budget >= 1);

alter table public.morning_check_ins
add constraint morning_check_ins_budget_formula_version_check
check (budget_formula_version >= 1);
