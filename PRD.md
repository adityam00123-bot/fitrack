# 🚀 FITRACK: Master Product Requirements Document (PRD)
**The Ultimate All-in-One Fitness & Nutrition Super-App for Indian Lifters**

---

## 1. Executive Summary & Core Mission

### Problem Statement
Modern lifters in India currently juggle 3–4 disconnected, frustrating tools:
1. **Hevy / Strong:** Great workout logging, but **zero diet/nutrition features** and heavy paywalls (Hevy Free limits you to only 4 routines).
2. **MyFitnessPal:** Western-centric, bloated with ads, expensive subscriptions, and missing desi staple pricing.
3. **Wger:** Feature-complete, but built on an old, complex monolithic Python/Django stack without modern mobile-first polish.
4. **No Financial Optimization:** Zero existing fitness apps calculate **Protein per Rupee ($g/₹$)** or generate meal plans adhering to weekly grocery budgets.

### Solution: FITRACK
**FITRACK** combines the best-in-class features of open-source gym trackers and commercial SaaS into one blazing-fast, mobile-friendly PWA (Progressive Web App) powered by Supabase and React/TypeScript:
- **From Hevy:** Frictionless in-gym set/rep logging, rest timer buzzer, previous set memory, 1RM calculator.
- **From Workout.Cool:** Interactive anatomical SVG body muscle map for visual exercise exploration.
- **From Wger:** Full Nutrition & Macro Diary (Calories, Protein, Carbs, Fats), Body Measurement graphs.
- **From Free-Exercise-DB:** 850+ gym exercises with **smooth looping animated GIFs**.
- **From Our Indian Engine:** Local Mandi price index, Protein per ₹ metric, and weekly budget-constrained diet generator.

---

## 2. Feature Matrix: Open-Source Source Strategy

| Feature | Target Experience | Open-Source Source / Repo to Steal From | Translation to FITRACK Stack |
| :--- | :--- | :--- | :--- |
| **Interactive Body Muscle Map** | Click on Chest / Lats / Quads to filter exercises | `workout-cool` (Next.js / SVG anatomy) | Extract SVG interactive body polygons $\rightarrow$ React component with Tailwind hover glow |
| **Exercise Database + Animations** | 850+ exercises with looping form GIFs, primary/secondary muscles | `yuhonas/free-exercise-db` + `wger-project/exercise-db` | Import JSON dataset into Supabase `exercises` table; stream GIFs via CDN / GitHub raw |
| **Live Workout Logger** | Sets × Reps × Weight, RPE, checkmarks, rest timer | `Hevy` UI pattern + `wger` set data model | React state machine + Supabase Realtime sync + Web Audio API buzzer |
| **Full Macro & Diet Diary** | Breakfast, Lunch, Snack, Dinner with Cal/P/C/F splits | `wger` Nutrition Diary | Supabase `nutrition_logs` + Recharts visual pie charts |
| **Body Weight & Tape Tracker** | Daily weight, Biceps, Chest, Waist, Body Fat % | `wger` Body Tracker | Supabase `body_measurements` + line charts |
| **Indian Mandi & Budget Engine** | Soya, Sattu, Chana, Dal, Eggs ($g/₹$ values) & ₹ Budget generator | Our verified Indian Nutrition Engine | Supabase `indian_foods` + dynamic portion optimizer |

---

## 3. Recommended Modern Tech Stack

To ensure blazing performance on both mobile phones and laptops without heavy Docker setups:

- **Frontend Framework:** `Vite + React 19 + TypeScript` (or `Next.js 15 App Router`)
  - *Why:* Ultra-lightweight, 0ms latency in gym with poor network, instant HMR, easily bundled as PWA.
- **Styling & UI Components:** `Tailwind CSS v4` + `Lucide React` icons + `Framer Motion` (micro-interactions).
- **Backend & Database:** `Supabase (PostgreSQL)`
  - *Why:* Instant REST & GraphQL APIs, Built-in Auth (Email/Password or Google), Row Level Security (RLS), Realtime sync, and Free Tier Cloud Hosting.
- **Client State & Cache:** `TanStack Query (React Query) v5` + `Zustand` (for active workout timer & session persistence).
- **Data Visualization:** `Recharts` (Clean, responsive SVG charts for weight trends and macro rings).
- **Audio & Haptics:** Native Web Audio API + Navigator Vibration API (phone vibrates when rest timer ends!).

---

## 4. Supabase Database Schema Architecture

```sql
-- 1. Profiles & Fitness Goals
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT NOT NULL,
  gender TEXT,
  weight_kg NUMERIC(5,2),
  height_cm NUMERIC(5,2),
  activity_level TEXT DEFAULT 'Moderate',
  daily_calorie_target INT DEFAULT 2200,
  daily_protein_target NUMERIC(5,1) DEFAULT 120.0,
  daily_carb_target NUMERIC(5,1) DEFAULT 250.0,
  daily_fat_target NUMERIC(5,1) DEFAULT 60.0,
  weekly_grocery_budget NUMERIC(7,2) DEFAULT 1200.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Exercises Catalog (850+ Items with Animations)
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  target_muscle TEXT NOT NULL, -- e.g., 'Chest', 'Lats', 'Quads'
  secondary_muscles TEXT[],    -- e.g., ['Triceps', 'Front Delts']
  equipment TEXT NOT NULL,     -- 'Barbell', 'Dumbbell', 'Cable', 'Bodyweight'
  gif_url TEXT NOT NULL,       -- Animated form guide
  instructions TEXT[],
  is_custom BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES profiles(id)
);

-- 3. Routine Templates (Push, Pull, Legs, etc.)
CREATE TABLE routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,         -- e.g., 'Push Day A (Chest Focus)'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE routine_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id UUID REFERENCES routines(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id),
  order_index INT NOT NULL,
  target_sets INT DEFAULT 3,
  target_reps INT DEFAULT 10
);

-- 4. Active Workouts & Completed Sets
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  routine_id UUID REFERENCES routines(id),
  title TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  notes TEXT
);

CREATE TABLE workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id),
  set_number INT NOT NULL,
  weight_kg NUMERIC(6,2) NOT NULL,
  reps INT NOT NULL,
  rpe NUMERIC(3,1),
  is_completed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Complete Nutrition Diary (Foods & Logs)
CREATE TABLE indian_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,      -- 'Vegetarian', 'Eggitarian', 'Non-Veg'
  calories_per_100g NUMERIC(6,1) NOT NULL,
  protein_per_100g NUMERIC(5,1) NOT NULL,
  carbs_per_100g NUMERIC(5,1) NOT NULL,
  fats_per_100g NUMERIC(5,1) NOT NULL,
  local_price_per_100g NUMERIC(6,2) NOT NULL,
  protein_per_rupee NUMERIC(5,2) GENERATED ALWAYS AS (protein_per_100g / NULLIF(local_price_per_100g, 0)) STORED
);

CREATE TABLE nutrition_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  date DATE NOT NULL,
  meal_type TEXT NOT NULL,     -- 'Breakfast', 'Lunch', 'Snack', 'Dinner'
  food_name TEXT NOT NULL,
  quantity_grams NUMERIC(6,1) NOT NULL,
  calories NUMERIC(6,1) NOT NULL,
  protein NUMERIC(5,1) NOT NULL,
  carbs NUMERIC(5,1) NOT NULL,
  fats NUMERIC(5,1) NOT NULL,
  estimated_cost NUMERIC(6,2)
);

-- 6. Body Measurements History
CREATE TABLE body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  recorded_date DATE NOT NULL,
  weight_kg NUMERIC(5,2) NOT NULL,
  body_fat_pct NUMERIC(4,1),
  biceps_inch NUMERIC(4,2),
  chest_inch NUMERIC(4,2),
  waist_inch NUMERIC(4,2),
  thighs_inch NUMERIC(4,2)
);
```

---

## 5. Documentation Architecture (6 Required `.md` Files)

Inside the `FITRACK` repository, we will establish these 6 structured markdown documents:

1. **`PRD.md`**: This master specifications document.
2. **`ARCHITECTURE.md`**: Tech stack diagrams, state management flow, offline sync strategy, and PWA setup.
3. **`DATABASE_SCHEMA.md`**: Complete Supabase PostgreSQL schema, migrations, and Row-Level-Security (RLS) policies.
4. **`EXERCISES_DATASET.md`**: Mapping of 850+ exercises, muscle groups, equipment tags, and GIF hosting strategy.
5. **`INDIAN_NUTRITION_INDEX.md`**: Verified Mandi rates, ICMR protein guidelines, macro density tables, and budget algorithms.
6. **`ROADMAP.md`**: Sprints, checklist, and testing criteria.

---

## 6. Phased Implementation Plan (Sprint Roadmap)

### 🏁 Sprint 1: Project Scaffolding & Database Setup (Day 1)
- Initialize Vite + React 19 + TypeScript + Tailwind CSS in `FITRACK`.
- Set up Supabase project, execute `schema.sql`, configure `.env.local`.
- Build shared Layout: Dark-mode aesthetic bottom navbar for mobile, top bar for desktop.

### 🏋️ Sprint 2: Exercise Library & Workout.Cool Muscle Map (Day 2)
- Import 850+ exercises JSON with animated GIFs.
- Integrate Workout.Cool-inspired interactive SVG body heatmap (tap Chest $\rightarrow$ filter chest exercises).
- Search, filter by equipment (Dumbbell, Barbell, Cable, Bodyweight), and exercise detail view.

### ⏱️ Sprint 3: Hevy-Style Live Gym Workout Logger (Day 3)
- Routine Creator (Push/Pull/Legs pre-built templates + custom builder).
- Active Gym Session Mode:
  - Big numerical input for Weight (kg) & Reps.
  - Previous workout values auto-filled as placeholder.
  - One-tap set completion checkmark.
  - Sticky Rest Timer (60s, 90s, 120s) with audio beep and vibration.

### 🥑 Sprint 4: Full Macro & Indian Budget Diet Diary (Day 4)
- Meal logging (Breakfast, Lunch, Pre-workout, Dinner).
- Calories, Protein, Carbs, Fats live circular progress rings.
- Indian Food Database with live **Protein per Rupee ($g/₹$)** sorting.
- 7-Day Budget Diet Generator based on weekly grocery budget limit.

### 📏 Sprint 5: Body Measurements & Progress Analytics (Day 5)
- Weight progress line graph (7-day, 30-day, 90-day moving averages).
- Inch measurement tracker (Biceps, Waist, Chest).
- Workout volume & PR (Personal Record) dashboard.
- PWA deployment (installable on Android & iOS home screen).
