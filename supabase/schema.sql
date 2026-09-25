-- ====================================================================
-- 🏋️ FITRACK MASTER DATABASE SCHEMA (POSTGRESQL & SUPABASE)
-- Complete Wger Core + Indian Diet Engine + Supabase Cloud Sync
-- ====================================================================

-- Enable UUID extension (gen_random_uuid is standard in modern Postgres)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 1. USER PROFILES & FITNESS METRICS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT 'Desi Lifter',
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  height_cm NUMERIC(5,2),
  weight_kg NUMERIC(5,2),
  current_weight_kg NUMERIC(5,2),
  target_weight_kg NUMERIC(5,2),
  activity_level TEXT DEFAULT 'moderately_active',
  fitness_goal TEXT DEFAULT 'muscle_gain',
  dietary_preference TEXT DEFAULT 'pure_veg',
  unit_system TEXT DEFAULT 'metric',
  daily_calorie_target INTEGER DEFAULT 2200,
  daily_protein_target NUMERIC(5,1) DEFAULT 140.0,
  daily_carb_target NUMERIC(5,1) DEFAULT 240.0,
  daily_fat_target NUMERIC(5,1) DEFAULT 60.0,
  weekly_grocery_budget NUMERIC(7,2) DEFAULT 1200.0,
  water_goal_ml INTEGER DEFAULT 3500,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 2. EXERCISES DATABASE (850+ Exercise Catalog)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for global system exercises
  name TEXT NOT NULL,
  category TEXT NOT NULL,          -- 'chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', etc.
  target_muscle TEXT,              -- Primary anatomical target (e.g., 'Pectoralis Major', 'Latissimus Dorsi')
  secondary_muscles TEXT[],        -- e.g., ARRAY['triceps', 'front_delts']
  equipment TEXT NOT NULL,         -- 'barbell', 'dumbbell', 'cable', 'machine', 'bodyweight'
  difficulty TEXT DEFAULT 'intermediate', -- 'beginner', 'intermediate', 'advanced'
  instructions TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  tips TEXT[] DEFAULT ARRAY[]::TEXT[],
  image_url TEXT,                  -- Image or animated form preview
  gif_url TEXT,                    -- Looping animated form GIF
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 3. WORKOUT ROUTINE TEMPLATES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.workout_routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,              -- e.g., 'Push Day A (Chest Focus)'
  title TEXT,                      -- alias for PRD compatibility
  description TEXT,
  category TEXT DEFAULT 'Custom',  -- 'PPL', 'Upper/Lower', 'Bro Split', 'Full Body', 'Desi Strength'
  days_per_week INTEGER DEFAULT 4,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.routine_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id UUID NOT NULL REFERENCES public.workout_routines(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL,
  exercise_name TEXT NOT NULL,
  category TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  target_sets INTEGER NOT NULL DEFAULT 3,
  target_reps TEXT NOT NULL DEFAULT '8-12',
  rest_seconds INTEGER DEFAULT 90,
  notes TEXT
);

-- ====================================================================
-- 4. LIVE GYM SESSIONS & LOGGED SETS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  routine_id UUID REFERENCES public.workout_routines(id) ON DELETE SET NULL,
  routine_name TEXT NOT NULL,
  title TEXT,                      -- PRD alias
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  duration_seconds INTEGER DEFAULT 0,
  total_volume_kg NUMERIC(8,2) DEFAULT 0,
  total_sets INTEGER DEFAULT 0,
  total_reps INTEGER DEFAULT 0,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL,
  exercise_name TEXT NOT NULL,
  set_number INTEGER NOT NULL,
  weight_kg NUMERIC(6,2) NOT NULL,
  reps INTEGER NOT NULL,
  rpe NUMERIC(3,1),               -- Rate of Perceived Exertion (6.0 - 10.0)
  completed BOOLEAN DEFAULT TRUE,
  is_warmup BOOLEAN DEFAULT FALSE,
  is_drop_set BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 5. INDIAN FOOD DATABASE & LOCAL MANDI RATES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for verified public staples
  name TEXT NOT NULL,
  hindi_name TEXT,
  category TEXT NOT NULL,          -- 'dal_legume', 'dairy', 'grain', 'meat_poultry', 'egg', 'snack_desi'
  diet_type TEXT NOT NULL,         -- 'veg', 'non_veg', 'egg', 'vegan'
  serving_unit TEXT NOT NULL,      -- '100g', '1 medium katori (150g)', '1 roti (40g)'
  serving_size_grams NUMERIC(6,2) NOT NULL,
  calories NUMERIC(6,1) NOT NULL,
  protein NUMERIC(5,1) NOT NULL,
  carbs NUMERIC(5,1) NOT NULL,
  fat NUMERIC(5,1) NOT NULL,
  fiber NUMERIC(5,1) DEFAULT 0,
  local_price_per_100g NUMERIC(6,2) DEFAULT 20.0,
  protein_per_rupee NUMERIC(5,2) GENERATED ALWAYS AS (protein / NULLIF(local_price_per_100g, 0)) STORED,
  is_indian_specialty BOOLEAN DEFAULT TRUE,
  budget_rating TEXT DEFAULT 'moderate', -- 'budget', 'moderate', 'premium'
  benefits TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 6. DAILY NUTRITION & MEAL LOGS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type TEXT NOT NULL,         -- 'breakfast', 'lunch', 'snack', 'dinner', 'post_workout'
  food_item_id UUID REFERENCES public.food_items(id) ON DELETE SET NULL,
  food_name TEXT NOT NULL,
  hindi_name TEXT,
  quantity NUMERIC(6,2) NOT NULL DEFAULT 1,
  serving_unit TEXT NOT NULL,
  calories NUMERIC(6,1) NOT NULL,
  protein NUMERIC(5,1) NOT NULL,
  carbs NUMERIC(5,1) NOT NULL,
  fat NUMERIC(5,1) NOT NULL,
  fiber NUMERIC(5,1) DEFAULT 0,
  estimated_cost NUMERIC(6,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 7. BODY MEASUREMENTS & PHYSIQUE PROGRESSION
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC(5,2) NOT NULL,
  body_fat_percentage NUMERIC(4,1),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  chest_cm NUMERIC(5,2),
  shoulders_cm NUMERIC(5,2),
  left_bicep_cm NUMERIC(4,2),
  right_bicep_cm NUMERIC(4,2),
  waist_cm NUMERIC(5,2),
  hips_cm NUMERIC(5,2),
  left_thigh_cm NUMERIC(4,2),
  right_thigh_cm NUMERIC(4,2),
  calves_cm NUMERIC(4,2),
  neck_cm NUMERIC(4,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT,
  image_url TEXT NOT NULL,
  photo_type TEXT CHECK (photo_type IN ('front', 'side', 'back')),
  weight_at_time NUMERIC(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 8. INDIAN DIET PLANS & MEAL SCHEDULES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.diet_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  hindi_name TEXT,
  tagline TEXT,
  goal TEXT NOT NULL,              -- 'muscle_gain', 'fat_loss', 'budget_bulk', 'maintenance'
  diet_type TEXT NOT NULL,         -- 'pure_veg', 'eggetarian', 'non_veg', 'jain', 'vegan'
  budget_level TEXT DEFAULT 'moderate', -- 'student_budget', 'moderate', 'premium'
  target_calories INTEGER NOT NULL,
  target_protein INTEGER NOT NULL,
  target_carbs INTEGER NOT NULL,
  target_fat INTEGER NOT NULL,
  description TEXT,
  grocery_list TEXT[],
  tips_for_success TEXT[],
  plan_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 9. PERFORMANCE INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_exercises_category ON public.exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON public.exercises(equipment);
CREATE INDEX IF NOT EXISTS idx_routine_exercises_routine ON public.routine_exercises(routine_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_date ON public.workout_sessions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_workout_sets_session ON public.workout_sets(session_id);
CREATE INDEX IF NOT EXISTS idx_food_items_category ON public.food_items(category);
CREATE INDEX IF NOT EXISTS idx_meal_logs_user_date ON public.meal_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date ON public.weight_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_body_measurements_user_date ON public.body_measurements(user_id, date DESC);

-- ====================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
CREATE POLICY "Users can manage their own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- 2. Exercises (Public read for global system exercises, private for user customs)
DROP POLICY IF EXISTS "Public read exercises" ON public.exercises;
CREATE POLICY "Public read exercises" ON public.exercises
  FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert custom exercises" ON public.exercises;
CREATE POLICY "Users can insert custom exercises" ON public.exercises
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their custom exercises" ON public.exercises;
CREATE POLICY "Users can update their custom exercises" ON public.exercises
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their custom exercises" ON public.exercises;
CREATE POLICY "Users can delete their custom exercises" ON public.exercises
  FOR DELETE USING (auth.uid() = user_id);

-- 3. Workout Routines & Routine Exercises
DROP POLICY IF EXISTS "Users can manage routines" ON public.workout_routines;
CREATE POLICY "Users can manage routines" ON public.workout_routines
  FOR ALL USING (user_id IS NULL OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage routine exercises" ON public.routine_exercises;
CREATE POLICY "Users can manage routine exercises" ON public.routine_exercises
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.workout_routines WHERE id = routine_exercises.routine_id AND (user_id IS NULL OR user_id = auth.uid()))
  );

-- 4. Workout Sessions & Workout Sets
DROP POLICY IF EXISTS "Users can manage workout sessions" ON public.workout_sessions;
CREATE POLICY "Users can manage workout sessions" ON public.workout_sessions
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage workout sets" ON public.workout_sets;
CREATE POLICY "Users can manage workout sets" ON public.workout_sets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.workout_sessions WHERE id = workout_sets.session_id AND user_id = auth.uid())
  );

-- 5. Food Items
DROP POLICY IF EXISTS "Public read foods" ON public.food_items;
CREATE POLICY "Public read foods" ON public.food_items
  FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage custom foods" ON public.food_items;
CREATE POLICY "Users can manage custom foods" ON public.food_items
  FOR ALL USING (auth.uid() = user_id);

-- 6. Meal Logs
DROP POLICY IF EXISTS "Users can manage meal logs" ON public.meal_logs;
CREATE POLICY "Users can manage meal logs" ON public.meal_logs
  FOR ALL USING (auth.uid() = user_id);

-- 7. Weight & Measurements
DROP POLICY IF EXISTS "Users can manage weight logs" ON public.weight_logs;
CREATE POLICY "Users can manage weight logs" ON public.weight_logs
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage body measurements" ON public.body_measurements;
CREATE POLICY "Users can manage body measurements" ON public.body_measurements
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage progress photos" ON public.progress_photos;
CREATE POLICY "Users can manage progress photos" ON public.progress_photos
  FOR ALL USING (auth.uid() = user_id);

-- 8. Diet Plans
DROP POLICY IF EXISTS "Users can view and manage diet plans" ON public.diet_plans;
CREATE POLICY "Users can view and manage diet plans" ON public.diet_plans
  FOR ALL USING (user_id IS NULL OR auth.uid() = user_id);

-- ====================================================================
-- 11. AUTOMATIC PROFILE CREATION TRIGGER
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    daily_calorie_target,
    daily_protein_target,
    daily_carb_target,
    daily_fat_target,
    water_goal_ml
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Desi Lifter'),
    2200,
    140.0,
    240.0,
    60.0,
    3500
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
