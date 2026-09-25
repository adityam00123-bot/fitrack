export type MealType =
  | 'breakfast'
  | 'morning_snack'
  | 'lunch'
  | 'evening_snack'
  | 'dinner'
  | 'post_workout';

export interface FoodItem {
  id: string;
  name: string;
  hindiName?: string;
  category: 'grain' | 'dairy' | 'dal_legume' | 'meat_poultry' | 'egg' | 'vegetable' | 'fruit' | 'snack_desi' | 'supplement' | 'fats_oils';
  dietType: 'veg' | 'non_veg' | 'egg' | 'vegan';
  servingUnit: string; // e.g. "100g", "1 medium katori (150g)", "1 roti (40g)", "1 scoop (30g)"
  servingSizeGrams: number;
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  fiber?: number;  // in grams
  isIndianSpecialty?: boolean;
  budgetRating?: 'budget' | 'moderate' | 'premium'; // e.g. Soya chunks = budget, Salmon = premium
  mandiPricePer100g?: number; // Estimated local Mandi / retail price in INR per 100g
  pricePerServing?: number;   // Estimated cost in INR for 1 serving
  proteinPerRupee?: number;   // Grams of protein delivered per 1 INR spent (g/₹)
  benefits?: string;
  commonBrand?: string;
}

export interface LoggedFoodItem {
  id: string;
  foodId: string;
  foodName: string;
  hindiName?: string;
  quantity: number; // multiplier of servingSize
  servingUnit: string;
  servingSizeGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  estimatedCost?: number; // INR
}

export interface MealLog {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  items: LoggedFoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalCost?: number; // Estimated INR for this meal
}

export interface DailyMacroTarget {
  calories: number;
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
  fiber: number;   // grams
  waterMl: number; // ml
}

export interface DailyNutritionSummary {
  date: string;
  target: DailyMacroTarget;
  consumed: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    waterMl: number;
    totalCost?: number;
  };
  meals: Record<MealType, LoggedFoodItem[]>;
}
