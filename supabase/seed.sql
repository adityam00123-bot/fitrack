-- ====================================================================
-- 🏋️ FITRACK STARTER SEED DATA
-- Default Exercises, Indian Nutrition Database & Workout Splits
-- ====================================================================

-- 1. POPULATE INITIAL CORE EXERCISES
INSERT INTO public.exercises (name, category, target_muscle, secondary_muscles, equipment, difficulty, instructions, tips)
VALUES
  (
    'Barbell Bench Press',
    'chest',
    'Pectoralis Major',
    ARRAY['triceps', 'shoulders']::TEXT[],
    'barbell',
    'intermediate',
    ARRAY[
      'Lie flat on the bench with your eyes directly under the racked bar.',
      'Grip the bar slightly wider than shoulder-width with wrists straight.',
      'Unrack, bring bar under control down to mid-chest touching lightly.',
      'Drive powerfully up through your palms until arms are extended.'
    ]::TEXT[],
    ARRAY['Keep shoulder blades retracted and pinched into the bench.', 'Keep feet firmly planted on the gym floor for leg drive.']::TEXT[]
  ),
  (
    'Barbell Back Squat',
    'quads',
    'Quadriceps',
    ARRAY['glutes', 'hamstrings', 'core']::TEXT[],
    'barbell',
    'advanced',
    ARRAY[
      'Step under the bar and rest it across your upper traps.',
      'Unrack with feet shoulder-width apart, toes pointing slightly outward.',
      'Brace your core, hinge hips back and descend until thighs are at or below parallel.',
      'Drive up through mid-foot back to standing lock.'
    ]::TEXT[],
    ARRAY['Never let your knees cave inwards.', 'Maintain a rigid braced torso with deep diaphragmatic breath.']::TEXT[]
  ),
  (
    'Conventional Deadlift',
    'back',
    'Erector Spinae & Posterior Chain',
    ARRAY['hamstrings', 'glutes', 'forearms', 'core']::TEXT[],
    'barbell',
    'advanced',
    ARRAY[
      'Stand with mid-foot directly under the barbell, shins 1 inch away.',
      'Hinge hips back and grip the bar just outside your knees.',
      'Pull your chest tall, pack lats, take the slack out of the bar.',
      'Drive the floor away with your legs and lock out hips tall.'
    ]::TEXT[],
    ARRAY['Do not round your lower back under heavy load.', 'The bar should travel in a dead-vertical line hugging your shins.']::TEXT[]
  ),
  (
    'Overhead Barbell Military Press',
    'shoulders',
    'Anterior & Lateral Deltoids',
    ARRAY['triceps', 'upper_chest', 'core']::TEXT[],
    'barbell',
    'intermediate',
    ARRAY[
      'Rack the bar at collarbone height. Grip just outside shoulders.',
      'Brace glutes and abs to avoid lumbar hyperextension.',
      'Press the bar straight up overhead, moving head slightly back then through.',
      'Lock out with the bar stacked over your spine and ears.'
    ]::TEXT[],
    ARRAY['Squeeze glutes tightly throughout the press to protect lower spine.', 'Do not use leg bounce unless performing push presses.']::TEXT[]
  ),
  (
    'Pull-Ups (Bodyweight / Weighted)',
    'back',
    'Latissimus Dorsi',
    ARRAY['biceps', 'rear_delts', 'forearms']::TEXT[],
    'bodyweight',
    'intermediate',
    ARRAY[
      'Hang from an overhead bar with an overhand grip slightly wider than shoulders.',
      'Engage shoulder blades down and back.',
      'Pull your elbows driving towards your hips until chin clears the bar.',
      'Lower under control to a dead hang.'
    ]::TEXT[],
    ARRAY['Do not kick or kipp your legs for strength reps.', 'Focus on leading with your chest to the bar.']::TEXT[]
  ),
  (
    'Incline Dumbbell Press',
    'chest',
    'Clavicular (Upper) Pectorals',
    ARRAY['front_delts', 'triceps']::TEXT[],
    'dumbbell',
    'intermediate',
    ARRAY[
      'Set bench to 30-degree incline.',
      'Kick dumbbells up to shoulder level with knees.',
      'Press weights up in an arc over upper chest without clanging them.',
      'Lower under control until you feel a deep stretch in the upper pecs.'
    ]::TEXT[],
    ARRAY['Do not set bench too steep (above 45 deg) or it becomes a shoulder press.', 'Tuck elbows at 45-degree angle.']::TEXT[]
  ),
  (
    'Romanian Deadlift (RDL)',
    'hamstrings',
    'Hamstrings & Glutes',
    ARRAY['erectors', 'lats', 'forearms']::TEXT[],
    'barbell',
    'intermediate',
    ARRAY[
      'Stand holding barbell at thighs with slight bend in knees.',
      'Push your hips backwards towards the back wall while keeping spine neutral.',
      'Lower barbell along your shins until you feel full hamstring stretch.',
      'Squeeze glutes and thrust hips forward back to starting posture.'
    ]::TEXT[],
    ARRAY['Knees stay soft-bent and static; this is a pure hip hinge, not a squat.', 'Keep bar glued against legs.']::TEXT[]
  ),
  (
    'Barbell Bicep Curl',
    'biceps',
    'Biceps Brachii',
    ARRAY['forearms', 'brachialis']::TEXT[],
    'barbell',
    'beginner',
    ARRAY[
      'Stand tall holding a barbell with underhand shoulder-width grip.',
      'Pin elbows to sides of your ribs.',
      'Curl bar up focusing on contracting biceps.',
      'Lower slowly over 2-3 seconds to full extension.'
    ]::TEXT[],
    ARRAY['Avoid swinging backwards with your lower back.', 'Squeeze biceps hard at the peak for 1 second.']::TEXT[]
  )
ON CONFLICT DO NOTHING;

-- 2. POPULATE CORE INDIAN FOOD DATABASE
INSERT INTO public.food_items (name, hindi_name, category, diet_type, serving_unit, serving_size_grams, calories, protein, carbs, fat, fiber, local_price_per_100g, is_indian_specialty, budget_rating, benefits)
VALUES
  ('Soya Chunks (Raw)', 'सोया चंक्स / वड़ी', 'dal_legume', 'vegan', '100g dry', 100, 345, 52.0, 33.0, 0.5, 13.0, 15.0, true, 'budget', 'The King of Veg Protein: 52g protein per 100g at ₹15-20/100g. Unbeatable protein per rupee ratio.'),
  ('Chana Sattu Powder', 'चना सत्तू', 'dal_legume', 'vegan', '100g', 100, 413, 25.0, 64.0, 5.0, 18.0, 12.0, true, 'budget', 'Desi superfood drink from roasted Bengal gram. Rich in insoluble fiber and cooling for the stomach.'),
  ('Boiled Whole Eggs', 'उबले अंडे', 'egg', 'egg', '2 large eggs (100g)', 100, 143, 12.6, 0.8, 9.5, 0.0, 14.0, false, 'budget', 'Gold standard biological value protein (BV 100). Loaded with choline, B12, and healthy lipids.'),
  ('Egg Whites (Boiled)', 'उबले अंडे की सफेदी', 'egg', 'egg', '3 egg whites (100g)', 100, 52, 11.0, 0.7, 0.2, 0.0, 14.0, false, 'budget', 'Pure zero-fat, zero-carb lean protein isolate straight from whole food.'),
  ('Paneer (Fresh Cottage Cheese)', 'ताज़ा पनीर', 'dairy', 'veg', '100g', 100, 265, 18.3, 1.2, 20.8, 0.0, 40.0, true, 'moderate', 'Slow-digesting casein protein matrix, calcium rich, and great for sustained overnight muscle protein synthesis.'),
  ('Low-Fat Paneer', 'लो-फैट पनीर', 'dairy', 'veg', '100g', 100, 160, 25.0, 4.0, 3.5, 0.0, 48.0, true, 'moderate', 'High-protein, low-fat alternative ideal for cutting and fat loss phases.'),
  ('Chicken Breast (Raw Boneless)', 'चिकन ब्रेस्ट', 'meat_poultry', 'non_veg', '100g', 100, 165, 31.0, 0.0, 3.6, 0.0, 28.0, false, 'budget', 'Ultimate bodybuilding staple: 31g pure complete protein with 0g carbs.'),
  ('Roasted Bhuna Chana', 'भुना चना', 'snack_desi', 'vegan', '100g', 100, 387, 18.6, 58.0, 5.2, 16.8, 14.0, true, 'budget', 'The original desi pocket snack. High satiety, crunchy, and zero prep needed.'),
  ('Moong Dal (Yellow / Green Split)', 'मूँग दाल', 'dal_legume', 'vegan', '100g raw', 100, 347, 24.0, 60.0, 1.2, 16.0, 16.0, true, 'budget', 'Lightest and most digestible dal with high lysine and branch-chained amino acids.'),
  ('Curd / Dahi (Fresh Cow Milk)', 'घर का बना दही', 'dairy', 'veg', '1 medium bowl (150g)', 150, 98, 5.2, 7.0, 4.5, 0.0, 10.0, true, 'budget', 'Natural gut probiotic that enhances protein assimilation and gut biome integrity.'),
  ('Whole Wheat Roti (No Ghee)', 'गेहूं की रोटी', 'grain', 'vegan', '1 medium roti (40g)', 40, 104, 3.2, 22.0, 0.4, 3.0, 3.0, true, 'budget', 'Traditional complex carbohydrate staple with low GI sustained energy release.')
ON CONFLICT DO NOTHING;

-- 3. POPULATE PRE-BUILT ROUTINES
INSERT INTO public.workout_routines (name, description, category, days_per_week, is_default)
VALUES
  (
    'Push Day A (Chest & Triceps Focus)',
    'Hypertrophy focused chest, front delts, and triceps blast with compound and isolation work.',
    'PPL',
    6,
    true
  ),
  (
    'Pull Day A (Back & Biceps Heavy)',
    'Thick lat builders, vertical pulls, rear delt flyes, and barbell curls.',
    'PPL',
    6,
    true
  ),
  (
    'Legs & Core Day A (Squat Dominant)',
    'Deep barbell back squats, Romanian deadlifts, walking lunges, and calf raises.',
    'PPL',
    6,
    true
  ),
  (
    'Desi Pehlwan Compound Power Routine',
    'Traditional high-density full body compound strength with squats, push presses, pullups, and deadlifts.',
    'Desi Strength',
    4,
    true
  )
ON CONFLICT DO NOTHING;
