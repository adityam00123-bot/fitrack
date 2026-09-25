import { FoodItem, MealType } from './nutrition';

export type IndianDietGoal = 'fat_loss' | 'muscle_gain' | 'maintenance' | 'recomposition' | 'desi_bulk';
export type IndianDietType = 'pure_veg' | 'jain_veg' | 'eggetarian' | 'non_veg' | 'vegan';
export type BudgetLevel = 'student_budget' | 'standard' | 'premium';

export interface PlannedMealItem {
  foodItem: FoodItem;
  quantity: number;
  preparationNote?: string; // e.g. "Cook in 1/2 tsp mustard oil, no excess tadka"
}

export interface PlannedMeal {
  mealType: MealType;
  title: string;
  hindiTitle?: string;
  suggestedTime: string; // e.g. "8:30 AM"
  items: PlannedMealItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  desiProTip?: string;
}

export interface IndianDietPlan {
  id: string;
  name: string;
  hindiName?: string;
  tagline: string;
  goal: IndianDietGoal;
  dietType: IndianDietType;
  budgetLevel: BudgetLevel;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  description: string;
  groceryList: string[];
  meals: PlannedMeal[];
  tipsForSuccess: string[];
  isCustomGenerated?: boolean;
}

export interface FoodSwapItem {
  id: string;
  traditionalFood: string;
  traditionalHindi?: string;
  traditionalPortion: string;
  traditionalCalories: number;
  traditionalProtein: number;
  traditionalFat: number;
  smartSwapFood: string;
  smartSwapHindi?: string;
  smartSwapPortion: string;
  smartSwapCalories: number;
  smartSwapProtein: number;
  smartSwapFat: number;
  caloriesSaved: number;
  proteinGained: number;
  explanation: string;
  category: 'breakfast' | 'main_course' | 'snack' | 'drink' | 'sweet';
}
