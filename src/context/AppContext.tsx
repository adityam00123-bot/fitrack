import React, { createContext, useContext, useState, useEffect } from 'react';
import { Exercise, WorkoutRoutine, WorkoutSession, ActiveExerciseSession, WorkoutSet } from '../types/workout';
import { FoodItem, MealType, LoggedFoodItem, MealLog, DailyMacroTarget } from '../types/nutrition';
import { IndianDietPlan } from '../types/indianDiet';
import { WeightLog, BodyMeasurements, ProgressPhoto, UserProfile } from '../types/bodyTracker';
import { SupabaseConfig } from '../types/supabase';
import { INITIAL_EXERCISES } from '../data/exercisesData';
import { INDIAN_FOOD_DATABASE } from '../data/indianFoodDatabase';
import { DEFAULT_ROUTINES } from '../data/defaultRoutines';
import { PREBUILT_DIET_PLANS } from '../data/prebuiltDietPlans';
import { soundEffects } from '../services/audioService';
import { supabaseManager } from '../services/supabaseClient';
import { SupportedLanguage, TranslationKey, translations } from '../i18n/translations';

export type NavTab = 'home' | 'workouts' | 'exercises' | 'nutrition' | 'indian_diet' | 'body_tracker' | 'tools';

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  // Language & Localization
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey) => string;

  // Weight Unit
  weightUnit: 'kg' | 'lbs';
  setWeightUnit: (unit: 'kg' | 'lbs') => void;

  // Profile & Targets
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  macroTargets: DailyMacroTarget;
  updateMacroTargets: (targets: Partial<DailyMacroTarget>) => void;

  // Exercises
  exercises: Exercise[];
  addCustomExercise: (ex: Omit<Exercise, 'id'>) => void;
  deleteCustomExercise: (id: string) => void;

  // Routines
  routines: WorkoutRoutine[];
  addRoutine: (routine: Omit<WorkoutRoutine, 'id'>) => void;
  updateRoutine: (id: string, routine: Partial<WorkoutRoutine>) => void;
  deleteRoutine: (id: string) => void;

  // Active Workout
  activeWorkout: WorkoutSession | null;
  startWorkout: (routine?: WorkoutRoutine) => void;
  cancelWorkout: () => void;
  finishWorkout: () => WorkoutSession | null;
  addExerciseToActiveWorkout: (exercise: Exercise) => void;
  removeExerciseFromActiveWorkout: (exerciseId: string) => void;
  addSetToExercise: (exerciseId: string) => void;
  removeSetFromExercise: (exerciseId: string, setId: string) => void;
  updateSet: (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => void;
  toggleSetCompleted: (exerciseId: string, setId: string) => void;

  // Rest Timer
  restSecondsLeft: number;
  isRestActive: boolean;
  restTotalSeconds: number;
  startRestTimer: (seconds: number) => void;
  pauseRestTimer: () => void;
  resumeRestTimer: () => void;
  stopRestTimer: () => void;
  adjustRestTimer: (delta: number) => void;

  // Workout History
  workoutHistory: WorkoutSession[];
  deleteWorkoutSession: (id: string) => void;

  // Nutrition & Meals
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  foods: FoodItem[];
  addCustomFood: (food: Omit<FoodItem, 'id'>) => void;
  mealLogs: MealLog[];
  addFoodToMeal: (mealType: MealType, food: FoodItem, quantity: number) => void;
  removeFoodFromMeal: (mealLogId: string, itemId: string) => void;
  waterIntakeMl: number;
  addWater: (amountMl: number) => void;
  resetWater: () => void;

  // Indian Diet Plans
  dietPlans: IndianDietPlan[];
  activeDietPlan: IndianDietPlan | null;
  setActiveDietPlan: (plan: IndianDietPlan | null) => void;
  saveCustomDietPlan: (plan: IndianDietPlan) => void;

  // Body Tracker
  weightLogs: WeightLog[];
  logWeight: (weightKg: number, bodyFat?: number, notes?: string) => void;
  measurements: BodyMeasurements[];
  logMeasurements: (m: Omit<BodyMeasurements, 'id' | 'date'>) => void;
  progressPhotos: ProgressPhoto[];
  addProgressPhoto: (photo: Omit<ProgressPhoto, 'id' | 'date'>) => void;

  // Supabase
  supabaseConfig: SupabaseConfig;
  saveSupabaseConfig: (url: string, key: string) => Promise<boolean>;
  syncDataWithSupabase: () => Promise<{ success: boolean; message: string }>;

  // Modals & Popups
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  isToolsModalOpen: boolean;
  setIsToolsModalOpen: (open: boolean) => void;
  isSupabaseModalOpen: boolean;
  setIsSupabaseModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  // Localization (Default English)
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('fitrack_language') as SupportedLanguage;
    return saved && translations[saved] ? saved : 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('fitrack_language', lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  // Weight Unit (kg vs lbs)
  const [weightUnit, setWeightUnitState] = useState<'kg' | 'lbs'>(() => {
    const saved = localStorage.getItem('fitrack_weight_unit');
    return saved === 'lbs' ? 'lbs' : 'kg';
  });

  const setWeightUnit = (unit: 'kg' | 'lbs') => {
    setWeightUnitState(unit);
    localStorage.setItem('fitrack_weight_unit', unit);
  };

  // Modals
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fitrack_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      id: 'user-demo-1',
      fullName: 'Aditya',
      age: 24,
      gender: 'male',
      heightCm: 178,
      currentWeightKg: 74.5,
      targetWeightKg: 78.0,
      activityLevel: 'moderately_active',
      fitnessGoal: 'muscle_gain',
      dietaryPreference: 'pure_veg',
      unitSystem: 'metric',
      dailyCalorieTarget: 2200,
      dailyProteinTarget: 140,
      dailyCarbTarget: 240,
      dailyFatTarget: 60,
      waterGoalMl: 3500
    };
  });

  // Macro Targets
  const [macroTargets, setMacroTargets] = useState<DailyMacroTarget>(() => {
    return {
      calories: profile.dailyCalorieTarget,
      protein: profile.dailyProteinTarget,
      carbs: profile.dailyCarbTarget,
      fat: profile.dailyFatTarget,
      fiber: 35,
      waterMl: profile.waterGoalMl
    };
  });

  // Exercises (1,350+ smooth full-motion animated GIFs + curated staple lifts with 60FPS MP4 videos)
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('fitrack_exercises');
    const CACHE_VERSION_KEY = 'fitrack_exercises_v4_strict_videos';
    const hasV4 = localStorage.getItem(CACHE_VERSION_KEY);

    if (saved && hasV4) {
      try {
        const parsed: Exercise[] = JSON.parse(saved);
        // Ensure cache has 60fps videoUrl on staple lifts and full library size
        const hasVideos = Array.isArray(parsed) && parsed.length > 0 && parsed.some((e) => Boolean(e.videoUrl));
        if (hasVideos && parsed.length >= INITIAL_EXERCISES.length) {
          return parsed;
        }
      } catch { /* ignore */ }
    }

    // Auto-upgrade cache to ensure strict 60fps videos and full library are populated
    try {
      let custom: Exercise[] = [];
      if (saved) {
        const parsed: Exercise[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          custom = parsed.filter((e) => e.isCustom);
        }
      }
      const updated = [...INITIAL_EXERCISES, ...custom];
      localStorage.setItem('fitrack_exercises', JSON.stringify(updated));
      localStorage.setItem(CACHE_VERSION_KEY, 'true');
      return updated;
    } catch {
      return INITIAL_EXERCISES;
    }
  });

  // Routines
  const [routines, setRoutines] = useState<WorkoutRoutine[]>(() => {
    const saved = localStorage.getItem('fitrack_routines');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEFAULT_ROUTINES;
  });

  // Active Workout
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(() => {
    const saved = localStorage.getItem('fitrack_active_workout');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return null;
  });

  // Rest Timer State
  const [restSecondsLeft, setRestSecondsLeft] = useState(0);
  const [restTotalSeconds, setRestTotalSeconds] = useState(0);
  const [isRestActive, setIsRestActive] = useState(false);

  // Workout History
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>(() => {
    const saved = localStorage.getItem('fitrack_workout_history');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    // Seed with a sample completed workout
    return [
      {
        id: 'hist-1',
        routineName: 'Push Day (Chest, Shoulders, Triceps)',
        date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
        startTime: Date.now() - 86400000 * 2,
        durationSeconds: 3420,
        totalVolumeKg: 6450,
        totalSets: 18,
        totalReps: 168,
        rating: 5,
        notes: 'Felt explosive on bench press. 80kg felt like feathers!',
        exercises: [
          {
            exerciseId: 'ex-bench-press',
            exerciseName: 'Barbell Bench Press',
            category: 'chest',
            sets: [
              { id: 's1', setNumber: 1, weight: 60, reps: 10, rpe: 7, completed: true },
              { id: 's2', setNumber: 2, weight: 70, reps: 8, rpe: 8, completed: true },
              { id: 's3', setNumber: 3, weight: 80, reps: 6, rpe: 9, completed: true },
              { id: 's4', setNumber: 4, weight: 80, reps: 5, rpe: 9.5, completed: true }
            ]
          },
          {
            exerciseId: 'ex-incline-db-press',
            exerciseName: 'Incline Dumbbell Press',
            category: 'chest',
            sets: [
              { id: 's5', setNumber: 1, weight: 24, reps: 10, rpe: 8, completed: true },
              { id: 's6', setNumber: 2, weight: 26, reps: 8, rpe: 8.5, completed: true },
              { id: 's7', setNumber: 3, weight: 26, reps: 7, rpe: 9, completed: true }
            ]
          }
        ]
      }
    ];
  });

  // Food Items
  const [foods, setFoods] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem('fitrack_foods');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as FoodItem[];
        // Merge missing Mandi price & proteinPerRupee fields from updated database
        return parsed.map(p => {
          const defaultItem = INDIAN_FOOD_DATABASE.find(d => d.id === p.id);
          if (defaultItem) {
            return {
              ...p,
              mandiPricePer100g: p.mandiPricePer100g ?? defaultItem.mandiPricePer100g,
              pricePerServing: p.pricePerServing ?? defaultItem.pricePerServing,
              proteinPerRupee: p.proteinPerRupee ?? defaultItem.proteinPerRupee
            };
          }
          return p;
        });
      } catch { /* ignore */ }
    }
    return INDIAN_FOOD_DATABASE;
  });

  // Meal Logs
  const [mealLogs, setMealLogs] = useState<MealLog[]>(() => {
    const saved = localStorage.getItem('fitrack_meal_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    // Seed with today's meals
    const today = getTodayDateString();
    return [
      {
        id: 'ml-1',
        date: today,
        mealType: 'breakfast',
        items: [
          {
            id: 'li-1',
            foodId: 'food-besan-chilla',
            foodName: 'Besan Chilla (Gram Flour Savory Pancake)',
            hindiName: 'बेसन का चीला',
            quantity: 2,
            servingUnit: '1 medium chilla (60g)',
            servingSizeGrams: 60,
            calories: 270,
            protein: 13.6,
            carbs: 36,
            fat: 8.4,
            fiber: 6.4
          },
          {
            id: 'li-2',
            foodId: 'food-dahi',
            foodName: 'Fresh Dahi / Curd',
            hindiName: 'गाय के दूध की दही',
            quantity: 1,
            servingUnit: '1 medium bowl (150g)',
            servingSizeGrams: 150,
            calories: 90,
            protein: 6.0,
            carbs: 6.8,
            fat: 4.5,
            fiber: 0
          }
        ],
        totalCalories: 360,
        totalProtein: 19.6,
        totalCarbs: 42.8,
        totalFat: 12.9
      },
      {
        id: 'ml-2',
        date: today,
        mealType: 'lunch',
        items: [
          {
            id: 'li-3',
            foodId: 'food-soya-chunks',
            foodName: 'Soya Chunks (Raw Dry)',
            hindiName: 'सोया चंक्स',
            quantity: 1,
            servingUnit: '50g (Raw Dry)',
            servingSizeGrams: 50,
            calories: 172,
            protein: 26.0,
            carbs: 16.5,
            fat: 0.25,
            fiber: 6.5
          },
          {
            id: 'li-4',
            foodId: 'food-roti-phulka',
            foodName: 'Wheat Roti / Phulka (No Ghee)',
            hindiName: 'गेहूं की रोटी',
            quantity: 2,
            servingUnit: '1 medium roti',
            servingSizeGrams: 40,
            calories: 180,
            protein: 6.2,
            carbs: 36.0,
            fat: 1.0,
            fiber: 4.6
          },
          {
            id: 'li-5',
            foodId: 'food-moong-dal-boiled',
            foodName: 'Yellow Moong Dal (Cooked)',
            hindiName: 'पीली मूंग दाल',
            quantity: 1,
            servingUnit: '1 medium katori (150g)',
            servingSizeGrams: 150,
            calories: 130,
            protein: 8.5,
            carbs: 20.0,
            fat: 1.8,
            fiber: 5.2
          }
        ],
        totalCalories: 482,
        totalProtein: 40.7,
        totalCarbs: 72.5,
        totalFat: 3.05
      }
    ];
  });

  // Water Tracker
  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(() => {
    const saved = localStorage.getItem(`fitrack_water_${getTodayDateString()}`);
    return saved ? parseInt(saved, 10) : 1750;
  });

  // Indian Diet Plans
  const [dietPlans, setDietPlans] = useState<IndianDietPlan[]>(() => {
    const saved = localStorage.getItem('fitrack_diet_plans');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return PREBUILT_DIET_PLANS;
  });

  const [activeDietPlan, setActiveDietPlan] = useState<IndianDietPlan | null>(() => {
    return PREBUILT_DIET_PLANS[0];
  });

  // Body Tracker
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>(() => {
    const saved = localStorage.getItem('fitrack_weight_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    // Seed 14 days of progressive weight data
    const logs: WeightLog[] = [];
    const baseWeight = 73.2;
    for (let i = 14; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      const variance = (14 - i) * 0.09 + (Math.sin(i) * 0.2);
      logs.push({
        id: `wt-${i}`,
        date: d,
        weightKg: parseFloat((baseWeight + variance).toFixed(1)),
        bodyFatPercentage: parseFloat((15.8 - (14 - i) * 0.04).toFixed(1)),
        notes: i === 0 ? 'Today morning post bathroom weigh-in' : undefined
      });
    }
    return logs;
  });

  const [measurements, setMeasurements] = useState<BodyMeasurements[]>(() => {
    const saved = localStorage.getItem('fitrack_measurements');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      {
        id: 'meas-1',
        date: new Date(Date.now() - 86400000 * 20).toISOString().split('T')[0],
        chestCm: 99.5,
        shouldersCm: 118,
        leftBicepCm: 34.5,
        rightBicepCm: 35.0,
        waistCm: 82.5,
        hipsCm: 96,
        leftThighCm: 56.5,
        rightThighCm: 57.0,
        calvesCm: 36.5,
        neckCm: 38
      },
      {
        id: 'meas-2',
        date: getTodayDateString(),
        chestCm: 101.5,
        shouldersCm: 120,
        leftBicepCm: 35.8,
        rightBicepCm: 36.2,
        waistCm: 81.0,
        hipsCm: 96.5,
        leftThighCm: 58.0,
        rightThighCm: 58.2,
        calvesCm: 37.0,
        neckCm: 38.5
      }
    ];
  });

  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>(() => {
    const saved = localStorage.getItem('fitrack_progress_photos');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  // Supabase Config
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => {
    return supabaseManager.getConfig();
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('fitrack_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('fitrack_exercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem('fitrack_routines', JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    if (activeWorkout) {
      localStorage.setItem('fitrack_active_workout', JSON.stringify(activeWorkout));
    } else {
      localStorage.removeItem('fitrack_active_workout');
    }
  }, [activeWorkout]);

  useEffect(() => {
    localStorage.setItem('fitrack_workout_history', JSON.stringify(workoutHistory));
  }, [workoutHistory]);

  useEffect(() => {
    localStorage.setItem('fitrack_foods', JSON.stringify(foods));
  }, [foods]);

  useEffect(() => {
    localStorage.setItem('fitrack_meal_logs', JSON.stringify(mealLogs));
  }, [mealLogs]);

  useEffect(() => {
    localStorage.setItem(`fitrack_water_${getTodayDateString()}`, waterIntakeMl.toString());
  }, [waterIntakeMl]);

  useEffect(() => {
    localStorage.setItem('fitrack_weight_logs', JSON.stringify(weightLogs));
  }, [weightLogs]);

  useEffect(() => {
    localStorage.setItem('fitrack_measurements', JSON.stringify(measurements));
  }, [measurements]);

  useEffect(() => {
    localStorage.setItem('fitrack_diet_plans', JSON.stringify(dietPlans));
  }, [dietPlans]);

  // Rest Timer Interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRestActive && restSecondsLeft > 0) {
      interval = setInterval(() => {
        setRestSecondsLeft((prev) => {
          if (prev <= 1) {
            soundEffects.playBeep(true);
            setIsRestActive(false);
            return 0;
          }
          if (prev <= 4) {
            soundEffects.playBeep(false);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRestActive, restSecondsLeft]);

  // Profile methods
  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
  };

  const updateMacroTargets = (targets: Partial<DailyMacroTarget>) => {
    setMacroTargets(prev => ({ ...prev, ...targets }));
  };

  // Exercise methods
  const addCustomExercise = (ex: Omit<Exercise, 'id'>) => {
    const newEx: Exercise = {
      ...ex,
      id: `custom-ex-${Date.now()}`,
      isCustom: true
    };
    setExercises(prev => [newEx, ...prev]);
  };

  const deleteCustomExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  // Routine methods
  const addRoutine = (routine: Omit<WorkoutRoutine, 'id'>) => {
    const newRoutine: WorkoutRoutine = {
      ...routine,
      id: `routine-${Date.now()}`
    };
    setRoutines(prev => [...prev, newRoutine]);
  };

  const updateRoutine = (id: string, routineUpdates: Partial<WorkoutRoutine>) => {
    setRoutines(prev => prev.map(r => r.id === id ? { ...r, ...routineUpdates } : r));
  };

  const deleteRoutine = (id: string) => {
    setRoutines(prev => prev.filter(r => r.id !== id));
  };

  // Workout Session methods
  const startWorkout = (routine?: WorkoutRoutine) => {
    soundEffects.playTick();
    const newSession: WorkoutSession = {
      id: `workout-${Date.now()}`,
      routineId: routine?.id,
      routineName: routine ? routine.name : 'Custom Free Workout',
      date: getTodayDateString(),
      startTime: Date.now(),
      durationSeconds: 0,
      totalVolumeKg: 0,
      totalSets: 0,
      totalReps: 0,
      exercises: routine
        ? routine.exercises.map(re => ({
            exerciseId: re.exerciseId,
            exerciseName: re.exerciseName,
            category: re.category,
            sets: Array.from({ length: re.targetSets }).map((_, idx) => ({
              id: `set-${Date.now()}-${idx}`,
              setNumber: idx + 1,
              weight: 0,
              reps: parseInt(re.targetReps.split('-')[0]) || 10,
              completed: false
            }))
          }))
        : []
    };
    setActiveWorkout(newSession);
    setActiveTab('workouts');
  };

  const cancelWorkout = () => {
    setActiveWorkout(null);
    stopRestTimer();
  };

  const finishWorkout = (): WorkoutSession | null => {
    if (!activeWorkout) return null;

    soundEffects.playSuccessFanfare();
    const duration = Math.max(60, Math.floor((Date.now() - activeWorkout.startTime) / 1000));

    // Calculate volume
    let totalVol = 0;
    let completedSets = 0;
    let completedReps = 0;

    activeWorkout.exercises.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.completed) {
          totalVol += (s.weight || 0) * (s.reps || 0);
          completedSets++;
          completedReps += s.reps || 0;
        }
      });
    });

    const completedSession: WorkoutSession = {
      ...activeWorkout,
      endTime: Date.now(),
      durationSeconds: duration,
      totalVolumeKg: Math.round(totalVol),
      totalSets: completedSets,
      totalReps: completedReps,
      rating: 5
    };

    setWorkoutHistory(prev => [completedSession, ...prev]);
    setActiveWorkout(null);
    stopRestTimer();
    return completedSession;
  };

  const addExerciseToActiveWorkout = (exercise: Exercise) => {
    if (!activeWorkout) return;
    soundEffects.playTick();
    const newEx: ActiveExerciseSession = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      category: exercise.category,
      sets: [
        { id: `s-${Date.now()}-1`, setNumber: 1, weight: 0, reps: 10, completed: false },
        { id: `s-${Date.now()}-2`, setNumber: 2, weight: 0, reps: 10, completed: false },
        { id: `s-${Date.now()}-3`, setNumber: 3, weight: 0, reps: 10, completed: false }
      ]
    };
    setActiveWorkout(prev => prev ? { ...prev, exercises: [...prev.exercises, newEx] } : null);
  };

  const removeExerciseFromActiveWorkout = (exerciseId: string) => {
    setActiveWorkout(prev => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: prev.exercises.filter(e => e.exerciseId !== exerciseId)
      };
    });
  };

  const addSetToExercise = (exerciseId: string) => {
    soundEffects.playTick();
    setActiveWorkout(prev => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.exerciseId !== exerciseId) return ex;
          const lastSet = ex.sets[ex.sets.length - 1];
          const newSet: WorkoutSet = {
            id: `s-${Date.now()}-${ex.sets.length + 1}`,
            setNumber: ex.sets.length + 1,
            weight: lastSet ? lastSet.weight : 0,
            reps: lastSet ? lastSet.reps : 10,
            completed: false
          };
          return { ...ex, sets: [...ex.sets, newSet] };
        })
      };
    });
  };

  const removeSetFromExercise = (exerciseId: string, setId: string) => {
    setActiveWorkout(prev => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.exerciseId !== exerciseId) return ex;
          const filtered = ex.sets.filter(s => s.id !== setId).map((s, idx) => ({ ...s, setNumber: idx + 1 }));
          return { ...ex, sets: filtered };
        })
      };
    });
  };

  const updateSet = (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => {
    setActiveWorkout(prev => {
      if (!prev) return null;
      return {
        ...prev,
        exercises: prev.exercises.map(ex => {
          if (ex.exerciseId !== exerciseId) return ex;
          return {
            ...ex,
            sets: ex.sets.map(s => s.id === setId ? { ...s, ...updates } : s)
          };
        })
      };
    });
  };

  const toggleSetCompleted = (exerciseId: string, setId: string) => {
    soundEffects.playTick();
    setActiveWorkout(prev => {
      if (!prev) return null;
      let justCompleted = false;
      const updatedExercises = prev.exercises.map(ex => {
        if (ex.exerciseId !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map(s => {
            if (s.id === setId) {
              const nextVal = !s.completed;
              if (nextVal) justCompleted = true;
              return { ...s, completed: nextVal };
            }
            return s;
          })
        };
      });

      // Automatically trigger 90-second rest timer when a set is completed!
      if (justCompleted) {
        startRestTimer(90);
      }

      return { ...prev, exercises: updatedExercises };
    });
  };

  // Rest Timer
  const startRestTimer = (seconds: number) => {
    setRestTotalSeconds(seconds);
    setRestSecondsLeft(seconds);
    setIsRestActive(true);
  };

  const pauseRestTimer = () => setIsRestActive(false);
  const resumeRestTimer = () => setIsRestActive(true);
  const stopRestTimer = () => {
    setIsRestActive(false);
    setRestSecondsLeft(0);
  };
  const adjustRestTimer = (delta: number) => {
    setRestSecondsLeft(prev => Math.max(0, prev + delta));
  };

  const deleteWorkoutSession = (id: string) => {
    setWorkoutHistory(prev => prev.filter(w => w.id !== id));
  };

  // Nutrition
  const addCustomFood = (food: Omit<FoodItem, 'id'>) => {
    const newFood: FoodItem = {
      ...food,
      id: `food-custom-${Date.now()}`
    };
    setFoods(prev => [newFood, ...prev]);
  };

  const addFoodToMeal = (mealType: MealType, food: FoodItem, quantity: number) => {
    soundEffects.playTick();
    const costPerServing = food.pricePerServing ?? (food.mandiPricePer100g ? (food.mandiPricePer100g / 100) * food.servingSizeGrams : 0);
    const itemCost = parseFloat((costPerServing * quantity).toFixed(1));

    const itemToAdd: LoggedFoodItem = {
      id: `item-${Date.now()}`,
      foodId: food.id,
      foodName: food.name,
      hindiName: food.hindiName,
      quantity,
      servingUnit: food.servingUnit,
      servingSizeGrams: food.servingSizeGrams * quantity,
      calories: Math.round(food.calories * quantity),
      protein: parseFloat((food.protein * quantity).toFixed(1)),
      carbs: parseFloat((food.carbs * quantity).toFixed(1)),
      fat: parseFloat((food.fat * quantity).toFixed(1)),
      fiber: food.fiber ? parseFloat((food.fiber * quantity).toFixed(1)) : 0,
      estimatedCost: itemCost
    };

    setMealLogs(prev => {
      const existing = prev.find(m => m.date === selectedDate && m.mealType === mealType);
      if (existing) {
        const updatedItems = [...existing.items, itemToAdd];
        return prev.map(m => m.id === existing.id ? {
          ...m,
          items: updatedItems,
          totalCalories: updatedItems.reduce((acc, it) => acc + it.calories, 0),
          totalProtein: parseFloat(updatedItems.reduce((acc, it) => acc + it.protein, 0).toFixed(1)),
          totalCarbs: parseFloat(updatedItems.reduce((acc, it) => acc + it.carbs, 0).toFixed(1)),
          totalFat: parseFloat(updatedItems.reduce((acc, it) => acc + it.fat, 0).toFixed(1)),
          totalCost: parseFloat(updatedItems.reduce((acc, it) => acc + (it.estimatedCost || 0), 0).toFixed(1))
        } : m);
      } else {
        const newLog: MealLog = {
          id: `meal-${Date.now()}`,
          date: selectedDate,
          mealType,
          items: [itemToAdd],
          totalCalories: itemToAdd.calories,
          totalProtein: itemToAdd.protein,
          totalCarbs: itemToAdd.carbs,
          totalFat: itemToAdd.fat,
          totalCost: itemCost
        };
        return [...prev, newLog];
      }
    });
  };

  const removeFoodFromMeal = (mealLogId: string, itemId: string) => {
    setMealLogs(prev => {
      return prev.map(m => {
        if (m.id !== mealLogId) return m;
        const filtered = m.items.filter(it => it.id !== itemId);
        return {
          ...m,
          items: filtered,
          totalCalories: filtered.reduce((acc, it) => acc + it.calories, 0),
          totalProtein: parseFloat(filtered.reduce((acc, it) => acc + it.protein, 0).toFixed(1)),
          totalCarbs: parseFloat(filtered.reduce((acc, it) => acc + it.carbs, 0).toFixed(1)),
          totalFat: parseFloat(filtered.reduce((acc, it) => acc + it.fat, 0).toFixed(1)),
          totalCost: parseFloat(filtered.reduce((acc, it) => acc + (it.estimatedCost || 0), 0).toFixed(1))
        };
      }).filter(m => m.items.length > 0);
    });
  };

  const addWater = (amountMl: number) => {
    soundEffects.playTick();
    setWaterIntakeMl(prev => prev + amountMl);
  };

  const resetWater = () => setWaterIntakeMl(0);

  // Diet Plans
  const saveCustomDietPlan = (plan: IndianDietPlan) => {
    setDietPlans(prev => [plan, ...prev]);
    setActiveDietPlan(plan);
  };

  // Body Tracker
  const logWeight = (weightKg: number, bodyFat?: number, notes?: string) => {
    soundEffects.playTick();
    const newLog: WeightLog = {
      id: `wt-${Date.now()}`,
      date: getTodayDateString(),
      weightKg,
      bodyFatPercentage: bodyFat,
      notes
    };
    setWeightLogs(prev => [newLog, ...prev]);
    setProfile(prev => ({ ...prev, currentWeightKg: weightKg }));
  };

  const logMeasurements = (m: Omit<BodyMeasurements, 'id' | 'date'>) => {
    soundEffects.playTick();
    const newMeas: BodyMeasurements = {
      ...m,
      id: `meas-${Date.now()}`,
      date: getTodayDateString()
    };
    setMeasurements(prev => [newMeas, ...prev]);
  };

  const addProgressPhoto = (photo: Omit<ProgressPhoto, 'id' | 'date'>) => {
    soundEffects.playTick();
    const newPhoto: ProgressPhoto = {
      ...photo,
      id: `photo-${Date.now()}`,
      date: getTodayDateString(),
      weightAtTime: profile.currentWeightKg
    };
    setProgressPhotos(prev => [newPhoto, ...prev]);
  };

  // Supabase
  const saveSupabaseConfig = async (url: string, key: string): Promise<boolean> => {
    supabaseManager.saveConfig(url, key);
    const testResult = await supabaseManager.testConnection();
    setSupabaseConfig(supabaseManager.getConfig());
    return testResult.success;
  };

  const syncDataWithSupabase = async (): Promise<{ success: boolean; message: string }> => {
    const client = supabaseManager.getClient();
    if (!client) {
      return { success: false, message: 'Supabase client is not connected. Please enter URL and Anon Key in Settings.' };
    }

    try {
      const { data: { user } } = await client.auth.getUser();
      const userId = user?.id;

      // Sync weight logs if any exist
      if (weightLogs.length > 0 && userId) {
        const weightPayload = weightLogs.map(w => ({
          user_id: userId,
          date: w.date,
          weight_kg: w.weightKg,
          body_fat_percentage: w.bodyFatPercentage || null,
          notes: w.notes || null
        }));
        await client.from('weight_logs').upsert(weightPayload, { ignoreDuplicates: true });
      }

      // Sync measurements if any exist
      if (measurements.length > 0 && userId) {
        const measPayload = measurements.map(m => ({
          user_id: userId,
          date: m.date,
          chest_cm: m.chestCm || null,
          waist_cm: m.waistCm || null,
          left_bicep_cm: m.leftBicepCm || null,
          right_bicep_cm: m.rightBicepCm || null,
          notes: m.notes || null
        }));
        await client.from('body_measurements').upsert(measPayload, { ignoreDuplicates: true });
      }

      return {
        success: true,
        message: 'Successfully backed up local logs & measurements to your Supabase PostgreSQL cloud!'
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sync failed';
      return { success: false, message: msg };
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        t,
        weightUnit,
        setWeightUnit,
        profile,
        updateProfile,
        macroTargets,
        updateMacroTargets,
        exercises,
        addCustomExercise,
        deleteCustomExercise,
        routines,
        addRoutine,
        updateRoutine,
        deleteRoutine,
        activeWorkout,
        startWorkout,
        cancelWorkout,
        finishWorkout,
        addExerciseToActiveWorkout,
        removeExerciseFromActiveWorkout,
        addSetToExercise,
        removeSetFromExercise,
        updateSet,
        toggleSetCompleted,
        restSecondsLeft,
        isRestActive,
        restTotalSeconds,
        startRestTimer,
        pauseRestTimer,
        resumeRestTimer,
        stopRestTimer,
        adjustRestTimer,
        workoutHistory,
        deleteWorkoutSession,
        selectedDate,
        setSelectedDate,
        foods,
        addCustomFood,
        mealLogs,
        addFoodToMeal,
        removeFoodFromMeal,
        waterIntakeMl,
        addWater,
        resetWater,
        dietPlans,
        activeDietPlan,
        setActiveDietPlan,
        saveCustomDietPlan,
        weightLogs,
        logWeight,
        measurements,
        logMeasurements,
        progressPhotos,
        addProgressPhoto,
        supabaseConfig,
        saveSupabaseConfig,
        syncDataWithSupabase,
        isQuickAddOpen,
        setIsQuickAddOpen,
        isToolsModalOpen,
        setIsToolsModalOpen,
        isSupabaseModalOpen,
        setIsSupabaseModalOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
