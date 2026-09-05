-- ============================================================
-- CALORIE TRACKER (SUPABASE DATABASE SCHEMA)
-- Ushbu SQL kodni Supabase -> SQL Editor bo'limiga nusxalab, 'RUN' tugmasini bosing
-- ============================================================

-- 1. PROFILES (Foydalanuvchi profili va TDEE)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  gender TEXT DEFAULT 'Erkak',
  age INTEGER DEFAULT 25,
  height_cm NUMERIC DEFAULT 175,
  weight_kg NUMERIC DEFAULT 70,
  activity_level NUMERIC DEFAULT 1.55,
  tdee_goal INTEGER DEFAULT 2200,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MEALS (Kunlik taomlar ro'yxati)
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  portion_g NUMERIC DEFAULT 200,
  calories INTEGER NOT NULL,
  protein_g NUMERIC DEFAULT 0,
  carbs_g NUMERIC DEFAULT 0,
  fat_g NUMERIC DEFAULT 0,
  emoji TEXT DEFAULT '🍽️',
  eaten_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DAILY STATS (Qadamlar, suv, uyqu)
CREATE TABLE IF NOT EXISTS public.daily_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE DEFAULT CURRENT_DATE NOT NULL,
  steps INTEGER DEFAULT 0,
  steps_goal INTEGER DEFAULT 10000,
  water_ml INTEGER DEFAULT 0,
  water_goal_ml INTEGER DEFAULT 2500,
  sleep_minutes INTEGER DEFAULT 480,
  UNIQUE(user_id, log_date)
);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "meals_select" ON public.meals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "meals_insert" ON public.meals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "meals_delete" ON public.meals FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "daily_stats_all" ON public.daily_stats FOR ALL USING (auth.uid() = user_id);

-- TRIGGER: Yangi user ro'yxatdan o'tganda avtomatik profil ochish
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Foydalanuvchi'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
