# 🏋️ FITRACK — Complete Wger Clone + Indian Diet Planner + Supabase

> **The ultimate athletic strength training and culturally authentic nutrition system.**  
> Built with React 19, TypeScript, Tailwind CSS v4, Web Audio Synthesizer, and Supabase PostgreSQL.

---

## 🌟 What is FITRACK?

FITRACK is a full-featured workout, nutrition, and body measurement platform inspired by the open-source **Wger** fitness tracker, supercharged with a dedicated **Indian Diet Planner** and seamless **Supabase Cloud Sync**.

It solves the primary challenges faced by Indian gym-goers:
1. Accurately tracking desi home-cooked meals (Roti, Dal, Paneer, Soya Chunks, Sattu, Eggs, Chicken) with genuine raw & cooked macro measurements.
2. Logging sets, reps, RPE, weights, and rest timers with audio cues during heavy gym sessions.
3. Tracking physique transformations with weight graphs, tape measurements, and US Navy Body Fat % estimates.
4. Seamlessly working **100% offline out-of-the-box** using LocalStorage, with 1-click **Supabase cloud backup**.

---

## 🚀 Key Modules & Features

### 1. 🦾 Workouts & Live Session Tracker (Wger Core)
- **Active Workout Logger**:
  - Live session stopwatch with animated active badge
  - Set-by-set logging: Weight (kg), Reps, RPE (6-10 scale), and checkmark completion
  - **Automated Rest Timer**: Triggers upon set completion with synthesized audio chimes (Web Audio API: 3-2-1 countdown & victory fanfare)
  - Exercise picker with category filters to dynamically add exercises during the workout
  - Workout Finish celebration with **Confetti effect** and volume summary stats
- **Routines & Splits**:
  - Push / Pull / Legs (PPL) 6-Day Split
  - Upper / Lower 4-Day Power Split
  - Desi Pehlwan Full Body Compound Split
  - Custom Routine Builder with custom sets and rep ranges
- **Workout History & Volume Tracking**:
  - Completed sessions log with sets breakdown and total tonnage lifted (kg)

### 2. 📖 Exercise Library (60+ Exercises)
- Categorized by muscle group: Chest, Back, Shoulders, Biceps, Triceps, Quads, Hamstrings, Glutes, Calves, Core, Forearms
- Equipment filters: Barbell, Dumbbell, Cable, Machine, Bodyweight
- Detailed execution steps, common mistakes, target muscle diagrams, and Coach Pro Tips
- **Custom Exercise Creator**: Add personal gym variations and equipment

### 3. 🥗 Daily Nutrition & Macros Tracker
- Calorie Budget Counter with consumed vs. remaining kcal
- Macro breakdown bars: Protein, Carbs, Fats, and Fiber
- Meal-by-meal logging: Breakfast, Morning Snack, Lunch, Evening Snack, Dinner, Post-Workout
- **Water Hydration Tracker**: One-tap +250ml (glass) and +500ml (bottle) tracking
- **Mifflin-St Jeor TDEE & Macro Calculator**: Generates personalized target calories and protein (2g/kg body weight)

### 4. 🇮🇳 Indian Diet Planner (Desi Superpower)
- **Curated Indian Diet Plans**:
  - *High-Protein Vegetarian (135g Protein)* — Powered by Soya Chunks, Paneer, Dahi & Dals
  - *Desi Fat Loss & Cutting (1650 kcal)* — High volume salads, egg whites, low-fat paneer, and rotis
  - *Lean Bulk Non-Veg Machine (2600 kcal)* — Chicken curry, tandoori breast, basmati rice, eggs
  - *Student / Hostel Budget Diet (₹120/day)* — Eggs, Sattu, Soya Chunks, Roasted Chana, Peanuts
- **Smart Diet Plan Generator**:
  - Generates custom day schedules based on calorie target, budget (Student ₹, Standard ₹₹, Premium ₹₹₹), dietary preference (Pure Veg, Eggetarian, Non-Veg, Jain, Vegan), and meal frequency
- **Desi Food Database**:
  - 40+ authentic staples (Soya Chunks, Malai/Low-Fat Paneer, Sattu, Besan Chilla, Moong Dal, Kala Chana, Roti, Rice, Poha, Chaas, Makhana) with Hindi names and verified nutritional data
- **Indian Smart Swaps**:
  - Side-by-side nutritional comparisons (e.g. Paratha ➔ Besan Paneer Chilla, Samosa ➔ Bhuna Chana, Butter Chicken ➔ Tandoori Chicken, Sweet Chai ➔ Spiced Chaas)

### 5. ⚖️ Body Tracker & Physique Analytics
- **Weight Progression Chart**:
  - Interactive SVG line chart with 7-day, 30-day, and all-time views
  - Weekly rate of change indicator (+/- kg vs last weigh-in)
- **Circumference Measurements**:
  - Chest, Shoulders, Left/Right Bicep, Waist, Hips, Thighs, Calves, and Neck with delta comparisons
- **US Navy Body Fat % Estimator**:
  - Tape measurement formula for men and women with body composition classification
- **Progress Photos Gallery**:
  - Front, side, and back pose tracking with date and weight stamps

### 6. ⚡ Gym Math Tools
- **1RM Calculator**: Brzycki & Epley formulas with percentage breakdown (95%, 90%, 85%, 80%, 75%, 70%)
- **Barbell Plate Calculator**: Calculates exact plates (25kg, 20kg, 15kg, 10kg, 5kg, 2.5kg, 1.25kg) for each sleeve on an Olympic 20kg bar
- **Warmup Generator**: 4-stage neural potentiation progression before heavy working sets

### 7. ☁️ Supabase Cloud Database Integration
- Full SQL migration script provided in `supabase/schema.sql`
- Complete tables for `profiles`, `exercises`, `workout_routines`, `routine_exercises`, `workout_sessions`, `workout_sets`, `food_items`, `meal_logs`, `weight_logs`, `body_measurements`, `progress_photos`, and `diet_plans`
- Row Level Security (RLS) policies configured for multi-user isolation
- Dual Mode: Instant offline local storage fallback + optional 1-click cloud sync

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Obsidian & Amber/Orange athletic dark theme
- **Icons**: Lucide React
- **Audio**: Web Audio API Synthesizer (Zero external audio file latency)
- **Database & Auth**: Supabase PostgreSQL (`@supabase/supabase-js`)
- **Build Tool**: Vite 8

---

## 🏁 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🗄️ Setting Up Supabase (Optional)

1. Create a free project on [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase Dashboard.
3. Copy and run the SQL script located in `supabase/schema.sql` (or copy it from the in-app *Calculators & Cloud* tab).
4. In the FITRACK app, click the **Supabase** pill in the top navbar and paste your:
   - **Project URL** (e.g. `https://your-project.supabase.co`)
   - **Public Anon Key** (from *Settings > API*)
5. Click **Save & Test Connection**. Your data will now backup to the cloud!
