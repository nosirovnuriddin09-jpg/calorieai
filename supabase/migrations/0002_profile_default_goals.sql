-- ============================================================================
-- Adds standing per-user goal defaults to profiles.
-- These seed each day's daily_goals row; daily_goals stays the per-day
-- record (so a user can override "today" without changing their standing target).
-- ============================================================================

alter table public.profiles
  add column if not exists default_water_goal_ml integer check (default_water_goal_ml is null or default_water_goal_ml > 0),
  add column if not exists default_steps_goal integer check (default_steps_goal is null or default_steps_goal > 0),
  add column if not exists default_sleep_goal_minutes integer check (default_sleep_goal_minutes is null or default_sleep_goal_minutes > 0),
  add column if not exists goal_type text check (goal_type is null or goal_type in ('lose_weight', 'maintain_weight', 'gain_weight'));

comment on column public.profiles.default_water_goal_ml is 'Standing daily water target in ml; seeds new daily_goals rows.';
comment on column public.profiles.default_steps_goal is 'Standing daily step target; seeds new daily_goals rows.';
comment on column public.profiles.default_sleep_goal_minutes is 'Standing daily sleep target in minutes; seeds new daily_goals rows.';
comment on column public.profiles.goal_type is 'User''s selected weight goal from onboarding, used to compute daily_calorie_goal.';
