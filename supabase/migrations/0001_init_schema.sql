-- ============================================================================
-- MuseFit calorie tracker — initial schema
-- Run this in Supabase SQL Editor (or via `supabase db push` if using the CLI)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles
-- One row per authenticated user. Created automatically on signup via trigger.
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,

  age integer check (age is null or (age > 0 and age < 150)),
  gender text check (gender is null or gender in ('male', 'female', 'other', 'prefer_not_to_say')),

  height_cm numeric check (height_cm is null or height_cm > 0),
  weight_kg numeric check (weight_kg is null or weight_kg > 0),

  activity_level text check (
    activity_level is null or activity_level in ('sedentary', 'lightly_active', 'moderately_active', 'very_active')
  ),

  daily_calorie_goal integer check (daily_calorie_goal is null or daily_calorie_goal > 0),

  onboarding_completed boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One profile per authenticated user, 1:1 with auth.users.';

-- ----------------------------------------------------------------------------
-- meals
-- ----------------------------------------------------------------------------
create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  name text not null,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),

  calories numeric not null default 0 check (calories >= 0),
  protein numeric check (protein is null or protein >= 0),
  carbs numeric check (carbs is null or carbs >= 0),
  fat numeric check (fat is null or fat >= 0),
  fiber numeric check (fiber is null or fiber >= 0),

  image_url text,
  consumed_at timestamptz not null default now(),

  created_at timestamptz not null default now()
);

create index if not exists meals_user_id_consumed_at_idx on public.meals (user_id, consumed_at desc);

-- ----------------------------------------------------------------------------
-- water_logs
-- ----------------------------------------------------------------------------
create table if not exists public.water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  amount_ml integer not null check (amount_ml <> 0),

  logged_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists water_logs_user_id_logged_at_idx on public.water_logs (user_id, logged_at desc);

-- ----------------------------------------------------------------------------
-- exercise_logs
-- ----------------------------------------------------------------------------
create table if not exists public.exercise_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  exercise_name text not null,
  duration_minutes integer not null check (duration_minutes >= 0),
  calories_burned integer not null default 0 check (calories_burned >= 0),
  notes text,

  performed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists exercise_logs_user_id_performed_at_idx on public.exercise_logs (user_id, performed_at desc);

-- ----------------------------------------------------------------------------
-- sleep_logs
-- ----------------------------------------------------------------------------
create table if not exists public.sleep_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  sleep_duration_minutes integer not null check (sleep_duration_minutes >= 0),
  sleep_start timestamptz not null,
  sleep_end timestamptz not null,
  sleep_quality integer check (sleep_quality is null or (sleep_quality >= 1 and sleep_quality <= 5)),

  created_at timestamptz not null default now(),

  constraint sleep_end_after_start check (sleep_end > sleep_start)
);

create index if not exists sleep_logs_user_id_sleep_start_idx on public.sleep_logs (user_id, sleep_start desc);

-- ----------------------------------------------------------------------------
-- step_logs
-- One row per user per date — upsert on (user_id, logged_date).
-- ----------------------------------------------------------------------------
create table if not exists public.step_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  steps integer not null default 0 check (steps >= 0),
  logged_date date not null default current_date,

  created_at timestamptz not null default now(),

  constraint step_logs_user_date_unique unique (user_id, logged_date)
);

create index if not exists step_logs_user_id_logged_date_idx on public.step_logs (user_id, logged_date desc);

-- ----------------------------------------------------------------------------
-- daily_goals
-- One row per user per date — upsert on (user_id, date).
-- ----------------------------------------------------------------------------
create table if not exists public.daily_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  date date not null default current_date,

  calorie_goal integer check (calorie_goal is null or calorie_goal > 0),
  water_goal_ml integer check (water_goal_ml is null or water_goal_ml > 0),
  steps_goal integer check (steps_goal is null or steps_goal > 0),
  sleep_goal_minutes integer check (sleep_goal_minutes is null or sleep_goal_minutes > 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint daily_goals_user_date_unique unique (user_id, date)
);

create index if not exists daily_goals_user_id_date_idx on public.daily_goals (user_id, date desc);

-- ----------------------------------------------------------------------------
-- weight_logs
-- ----------------------------------------------------------------------------
create table if not exists public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  weight_kg numeric not null check (weight_kg > 0),

  logged_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists weight_logs_user_id_logged_at_idx on public.weight_logs (user_id, logged_at desc);

-- ============================================================================
-- updated_at triggers
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.daily_goals;
create trigger set_updated_at
  before update on public.daily_goals
  for each row execute function public.set_updated_at();

-- ============================================================================
-- auto-create a profile row when a new auth user is created
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.meals enable row level security;
alter table public.water_logs enable row level security;
alter table public.exercise_logs enable row level security;
alter table public.sleep_logs enable row level security;
alter table public.step_logs enable row level security;
alter table public.daily_goals enable row level security;
alter table public.weight_logs enable row level security;

-- profiles: id IS the user's own auth id
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

-- meals
create policy "meals_select_own" on public.meals
  for select using (auth.uid() = user_id);
create policy "meals_insert_own" on public.meals
  for insert with check (auth.uid() = user_id);
create policy "meals_update_own" on public.meals
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "meals_delete_own" on public.meals
  for delete using (auth.uid() = user_id);

-- water_logs
create policy "water_logs_select_own" on public.water_logs
  for select using (auth.uid() = user_id);
create policy "water_logs_insert_own" on public.water_logs
  for insert with check (auth.uid() = user_id);
create policy "water_logs_update_own" on public.water_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "water_logs_delete_own" on public.water_logs
  for delete using (auth.uid() = user_id);

-- exercise_logs
create policy "exercise_logs_select_own" on public.exercise_logs
  for select using (auth.uid() = user_id);
create policy "exercise_logs_insert_own" on public.exercise_logs
  for insert with check (auth.uid() = user_id);
create policy "exercise_logs_update_own" on public.exercise_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "exercise_logs_delete_own" on public.exercise_logs
  for delete using (auth.uid() = user_id);

-- sleep_logs
create policy "sleep_logs_select_own" on public.sleep_logs
  for select using (auth.uid() = user_id);
create policy "sleep_logs_insert_own" on public.sleep_logs
  for insert with check (auth.uid() = user_id);
create policy "sleep_logs_update_own" on public.sleep_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sleep_logs_delete_own" on public.sleep_logs
  for delete using (auth.uid() = user_id);

-- step_logs
create policy "step_logs_select_own" on public.step_logs
  for select using (auth.uid() = user_id);
create policy "step_logs_insert_own" on public.step_logs
  for insert with check (auth.uid() = user_id);
create policy "step_logs_update_own" on public.step_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "step_logs_delete_own" on public.step_logs
  for delete using (auth.uid() = user_id);

-- daily_goals
create policy "daily_goals_select_own" on public.daily_goals
  for select using (auth.uid() = user_id);
create policy "daily_goals_insert_own" on public.daily_goals
  for insert with check (auth.uid() = user_id);
create policy "daily_goals_update_own" on public.daily_goals
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "daily_goals_delete_own" on public.daily_goals
  for delete using (auth.uid() = user_id);

-- weight_logs
create policy "weight_logs_select_own" on public.weight_logs
  for select using (auth.uid() = user_id);
create policy "weight_logs_insert_own" on public.weight_logs
  for insert with check (auth.uid() = user_id);
create policy "weight_logs_update_own" on public.weight_logs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "weight_logs_delete_own" on public.weight_logs
  for delete using (auth.uid() = user_id);

-- ============================================================================
-- Storage: food-images bucket (used by Phase 11 — Gemini food photo analysis)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('food-images', 'food-images', true)
on conflict (id) do nothing;

-- Users may only manage files inside a folder named after their own user id,
-- e.g. food-images/<user_id>/<filename>.jpg
create policy "food_images_select_own"
  on storage.objects for select
  using (bucket_id = 'food-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "food_images_insert_own"
  on storage.objects for insert
  with check (bucket_id = 'food-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "food_images_update_own"
  on storage.objects for update
  using (bucket_id = 'food-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "food_images_delete_own"
  on storage.objects for delete
  using (bucket_id = 'food-images' and auth.uid()::text = (storage.foldername(name))[1]);
