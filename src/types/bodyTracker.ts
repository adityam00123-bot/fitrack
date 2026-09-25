export interface WeightLog {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  bodyFatPercentage?: number;
  notes?: string;
}

export interface BodyMeasurements {
  id: string;
  date: string; // YYYY-MM-DD
  chestCm?: number;
  shouldersCm?: number;
  leftBicepCm?: number;
  rightBicepCm?: number;
  waistCm?: number;
  hipsCm?: number;
  leftThighCm?: number;
  rightThighCm?: number;
  calvesCm?: number;
  neckCm?: number;
  notes?: string;
}

export interface ProgressPhoto {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  imageUrl: string; // base64 or storage url
  type?: 'front' | 'side' | 'back';
  photoType?: 'front' | 'side' | 'back';
  weightAtTime?: number;
  notes?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'athlete';
  fitnessGoal: 'fat_loss' | 'muscle_gain' | 'maintenance' | 'recomposition';
  dietaryPreference: 'pure_veg' | 'jain_veg' | 'eggetarian' | 'non_veg' | 'vegan';
  unitSystem: 'metric' | 'imperial';
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  dailyCarbTarget: number;
  dailyFatTarget: number;
  waterGoalMl: number;
}
