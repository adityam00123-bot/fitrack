export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'core'
  | 'forearms'
  | 'cardio';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'kettlebell'
  | 'smith_machine'
  | 'resistance_band'
  | 'other';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  category: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment: Equipment;
  difficulty: DifficultyLevel;
  instructions: string[];
  tips?: string[];
  imageUrl?: string;
  gifUrl?: string;
  videoUrl?: string;
  images?: string[];
  isCustom?: boolean;
}

export type SetType = 'normal' | 'warmup' | 'dropset' | 'failure';

export interface WorkoutSet {
  id: string;
  setNumber: number;
  weight: number; // in kg
  reps: number;
  rpe?: number; // 6 to 10
  completed: boolean;
  setType?: SetType;
  isWarmup?: boolean;
  isDropSet?: boolean;
  isPR?: boolean;
  notes?: string;
}

export interface ActiveExerciseSession {
  exerciseId: string;
  exerciseName: string;
  category: MuscleGroup;
  sets: WorkoutSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  routineId?: string;
  routineName: string;
  date: string; // ISO date string
  startTime: number; // timestamp
  endTime?: number;
  durationSeconds: number;
  exercises: ActiveExerciseSession[];
  totalVolumeKg: number;
  totalSets: number;
  totalReps: number;
  rating?: number; // 1-5
  notes?: string;
}

export interface RoutineExercise {
  exerciseId: string;
  exerciseName: string;
  category: MuscleGroup;
  targetSets: number;
  targetReps: string; // e.g. "8-12"
  restSeconds: number;
  notes?: string;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  description: string;
  category: 'PPL' | 'Upper/Lower' | 'Bro Split' | 'Full Body' | 'Desi Strength' | 'Custom';
  daysPerWeek: number;
  exercises: RoutineExercise[];
  isDefault?: boolean;
}
