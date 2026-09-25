import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  IndianDietPlan,
  IndianDietType,
  BudgetLevel,
  PlannedMeal,
  ShoppingItem
} from '../../types/indianDiet';
import {
  Sparkles,
  Wand2,
  Check,
  Flame,
  ChevronRight,
  Bookmark,
  Coins,
  Calendar,
  ShoppingCart,
  Clock,
  Utensils,
  Award,
  Layers
} from 'lucide-react';

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Monday', hindi: 'सोमवार' },
  { id: 'tuesday', label: 'Tuesday', hindi: 'मंगलवार' },
  { id: 'wednesday', label: 'Wednesday', hindi: 'बुधवार' },
  { id: 'thursday', label: 'Thursday', hindi: 'गुरुवार' },
  { id: 'friday', label: 'Friday', hindi: 'शुक्रवार' },
  { id: 'saturday', label: 'Saturday', hindi: 'शनिवार' },
  { id: 'sunday', label: 'Sunday', hindi: 'रविवार' }
];

export const SmartDietGenerator: React.FC = () => {
  const { foods, saveCustomDietPlan, setActiveDietPlan } = useApp();

  const [dietType, setDietType] = useState<IndianDietType>('pure_veg');
  const [targetCals, setTargetCals] = useState<number>(2000);
  const [budget, setBudget] = useState<BudgetLevel>('student_budget');
  const [goal, setGoal] = useState<'muscle_gain' | 'fat_loss' | 'maintenance'>('muscle_gain');
  const [generatedPlan, setGeneratedPlan] = useState<IndianDietPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>('monday');
  const [activeViewTab, setActiveViewTab] = useState<'schedule' | 'grocery'>('schedule');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Helper to find food
  const findF = (id: string) => foods.find(f => f.id === id) || foods[0];

  const handleGenerate = () => {
    const weeklySchedule: Record<string, PlannedMeal[]> = {};

    // Daily recipes variations conditioned on dietType & budget
    DAYS_OF_WEEK.forEach((day, dayIdx) => {
      const meals: PlannedMeal[] = [];

      if (dietType === 'pure_veg' || dietType === 'vegan') {
        // Breakfast Variations
        if (dayIdx % 3 === 0) {
          meals.push({
            mealType: 'breakfast',
            title: 'Desi Besan & Paneer Chilla',
            hindiTitle: 'बेसन और पनीर का चीला',
            suggestedTime: '8:30 AM',
            desiProTip: 'Cook on low flame with 1/2 tsp mustard oil for a crisp texture.',
            estimatedCost: 28,
            items: [
              { foodItem: findF('food-besan-chilla'), quantity: 2, preparationNote: '2 savory gram flour pancakes' },
              { foodItem: findF('food-paneer-raw'), quantity: 0.5, preparationNote: '50g grated paneer filling' }
            ],
            totalCalories: 400,
            totalProtein: 22.8,
            totalCarbs: 38.1,
            totalFat: 18.8
          });
        } else if (dayIdx % 3 === 1) {
          meals.push({
            mealType: 'breakfast',
            title: 'Sprouted Moong Chaat + Chaas',
            hindiTitle: 'अंकुरित मूंग चाट और मसाला छाछ',
            suggestedTime: '8:30 AM',
            desiProTip: 'Add lemon juice, chopped onion, and rock salt for live digestive enzymes.',
            estimatedCost: 22,
            items: [
              { foodItem: findF('food-sprouted-moong'), quantity: 1.5, preparationNote: '150g raw sprouted moong' },
              { foodItem: findF('food-chaas'), quantity: 1, preparationNote: 'Spiced buttermilk' }
            ],
            totalCalories: 205,
            totalProtein: 15.2,
            totalCarbs: 33.0,
            totalFat: 2.2
          });
        } else {
          meals.push({
            mealType: 'breakfast',
            title: 'Desi Masala Oats with Paneer Cubes',
            hindiTitle: 'मसाला ओट्स और पनीर',
            suggestedTime: '8:30 AM',
            desiProTip: 'Toss diced paneer directly into simmering oats for creamy texture.',
            estimatedCost: 35,
            items: [
              { foodItem: findF('food-oats-masala'), quantity: 1, preparationNote: '50g oats with peas and carrots' },
              { foodItem: findF('food-paneer-raw'), quantity: 0.5, preparationNote: '50g paneer cubes' }
            ],
            totalCalories: 348,
            totalProtein: 16.7,
            totalCarbs: 37.1,
            totalFat: 14.9
          });
        }

        // Lunch Variations
        if (dayIdx % 2 === 0) {
          meals.push({
            mealType: 'lunch',
            title: 'High Protein Soya Matar + 2 Rotis + Dal',
            hindiTitle: 'सोया चंक्स सब्जी, रोटी और दाल',
            suggestedTime: '1:30 PM',
            desiProTip: 'Squeeze water from boiled soya twice to remove any raw taste.',
            estimatedCost: 26,
            items: [
              { foodItem: findF('food-soya-chunks'), quantity: 1, preparationNote: '50g dry soya chunks cooked in onion-tomato gravy' },
              { foodItem: findF('food-roti-phulka'), quantity: 2, preparationNote: 'Whole wheat rotis' },
              { foodItem: findF('food-moong-dal-boiled'), quantity: 1, preparationNote: 'Yellow moong dal' },
              { foodItem: findF('food-dahi'), quantity: 0.5, preparationNote: 'Fresh dahi' }
            ],
            totalCalories: 580,
            totalProtein: 47.5,
            totalCarbs: 76.5,
            totalFat: 9.5
          });
        } else {
          meals.push({
            mealType: 'lunch',
            title: 'Rajma Masala + Basmati Rice + Curd',
            hindiTitle: 'राजमा चावल और ताजी दही',
            suggestedTime: '1:30 PM',
            desiProTip: 'Classic Punjabi complete amino acid pairing.',
            estimatedCost: 34,
            items: [
              { foodItem: findF('food-rajma-cooked'), quantity: 1.5, preparationNote: 'Rich kidney bean curry' },
              { foodItem: findF('food-basmati-rice-cooked'), quantity: 1.5, preparationNote: 'Steamed basmati rice' },
              { foodItem: findF('food-dahi'), quantity: 1, preparationNote: 'Fresh cow milk dahi' }
            ],
            totalCalories: 660,
            totalProtein: 25.3,
            totalCarbs: 112.5,
            totalFat: 11.3
          });
        }

        // Snack Variations
        meals.push({
          mealType: 'evening_snack',
          title: dayIdx % 2 === 0 ? 'Roasted Bhuna Chana + Sattu Drink' : 'Peanuts Chaat + Chaas',
          hindiTitle: dayIdx % 2 === 0 ? 'भुना चना और सत्तू शरबत' : 'मूंगफली चाट और छाछ',
          suggestedTime: '5:30 PM',
          desiProTip: 'Zero cooking required; provides sustained energy for evening gym session.',
          estimatedCost: 16,
          items: dayIdx % 2 === 0 ? [
            { foodItem: findF('food-roasted-chana'), quantity: 1, preparationNote: '40g dry roasted chana with skin' },
            { foodItem: findF('food-sattu'), quantity: 1, preparationNote: '50g sattu stirred in cold water' }
          ] : [
            { foodItem: findF('food-peanuts-roasted'), quantity: 1, preparationNote: '30g roasted mungfali with onions' },
            { foodItem: findF('food-chaas'), quantity: 1, preparationNote: 'Refreshing cold chaas' }
          ],
          totalCalories: dayIdx % 2 === 0 ? 345 : 220,
          totalProtein: dayIdx % 2 === 0 ? 20.0 : 11.3,
          totalCarbs: dayIdx % 2 === 0 ? 54.0 : 9.0,
          totalFat: dayIdx % 2 === 0 ? 4.7 : 16.0
        });

        // Dinner Variations
        meals.push({
          mealType: 'dinner',
          title: dayIdx % 2 === 0 ? 'Palak Paneer + Multigrain Rotis' : 'Dal Khichdi + Roasted Papad + Curd',
          hindiTitle: dayIdx % 2 === 0 ? 'पालक पनीर और मल्टीग्रेन रोटी' : 'दाल खिचड़ी और दही',
          suggestedTime: '8:45 PM',
          desiProTip: 'Slow digesting casein protein aids overnight muscle repair.',
          estimatedCost: 38,
          items: dayIdx % 2 === 0 ? [
            { foodItem: findF('food-palak-paneer'), quantity: 1, preparationNote: 'Spinach puree with paneer' },
            { foodItem: findF('food-multigrain-roti'), quantity: 2, preparationNote: 'High fiber multigrain rotis' }
          ] : [
            { foodItem: findF('food-khichdi-moong'), quantity: 1.5, preparationNote: 'Comforting moong dal khichdi' },
            { foodItem: findF('food-dahi'), quantity: 1, preparationNote: 'Fresh bowl of dahi' }
          ],
          totalCalories: dayIdx % 2 === 0 ? 410 : 502,
          totalProtein: dayIdx % 2 === 0 ? 21.0 : 21.8,
          totalCarbs: dayIdx % 2 === 0 ? 42.0 : 78.8,
          totalFat: dayIdx % 2 === 0 ? 16.6 : 11.3
        });
      } else {
        // Eggetarian / Non-Veg Variations
        // Breakfast
        meals.push({
          mealType: 'breakfast',
          title: '4-Egg Desi Bhurji + Whole Wheat Rotis',
          hindiTitle: '4 अंडों की भुर्जी और फुल्के',
          suggestedTime: '8:30 AM',
          desiProTip: 'Use 2 whole eggs and 2 egg whites for optimal lean biological value.',
          estimatedCost: 32,
          items: [
            { foodItem: findF('food-egg-boiled-whole'), quantity: 2, preparationNote: '2 whole eggs' },
            { foodItem: findF('food-egg-white'), quantity: 2, preparationNote: '2 egg whites' },
            { foodItem: findF('food-roti-phulka'), quantity: 2, preparationNote: '2 rotis' }
          ],
          totalCalories: 362,
          totalProtein: 26.4,
          totalCarbs: 36.4,
          totalFat: 11.2
        });

        // Lunch
        meals.push({
          mealType: 'lunch',
          title: dayIdx % 2 === 0 ? 'Home-style Chicken Curry + Basmati Rice' : 'Soya Matar + Yellow Moong Dal + Rotis',
          hindiTitle: dayIdx % 2 === 0 ? 'घर की चिकन करी और चावल' : 'सोया चंक्स और मूंग दाल',
          suggestedTime: '1:30 PM',
          desiProTip: 'Lean chicken breast cooked in onion-ginger-garlic gravy.',
          estimatedCost: dayIdx % 2 === 0 ? 58 : 28,
          items: dayIdx % 2 === 0 ? [
            { foodItem: findF('food-chicken-curry-home'), quantity: 1, preparationNote: '200g tender chicken curry' },
            { foodItem: findF('food-basmati-rice-cooked'), quantity: 1.5, preparationNote: 'Steamed basmati rice' },
            { foodItem: findF('food-dahi'), quantity: 1, preparationNote: 'Cooling curd' }
          ] : [
            { foodItem: findF('food-soya-chunks'), quantity: 1, preparationNote: '50g soya chunks curry' },
            { foodItem: findF('food-roti-phulka'), quantity: 2, preparationNote: '2 rotis' },
            { foodItem: findF('food-moong-dal-boiled'), quantity: 1, preparationNote: 'Moong dal' }
          ],
          totalCalories: dayIdx % 2 === 0 ? 642 : 542,
          totalProtein: dayIdx % 2 === 0 ? 40.1 : 44.5,
          totalCarbs: dayIdx % 2 === 0 ? 72.0 : 76.0,
          totalFat: dayIdx % 2 === 0 ? 21.0 : 8.0
        });

        // Snack
        meals.push({
          mealType: 'evening_snack',
          title: 'Chana Sattu Drink + Roasted Peanuts',
          hindiTitle: 'चना सत्तू और भुनी मूंगफली',
          suggestedTime: '5:30 PM',
          desiProTip: 'Natural Indian pre-workout fuel with complex carbs and arginine.',
          estimatedCost: 15,
          items: [
            { foodItem: findF('food-sattu'), quantity: 1, preparationNote: '50g sattu in cold water with rock salt' },
            { foodItem: findF('food-peanuts-roasted'), quantity: 1, preparationNote: '30g crunchy peanuts' }
          ],
          totalCalories: 370,
          totalProtein: 19.3,
          totalCarbs: 36.5,
          totalFat: 17.0
        });

        // Dinner
        meals.push({
          mealType: 'dinner',
          title: dayIdx % 2 === 0 ? 'Tandoori Chicken + 2 Rotis + Salad' : 'Egg Curry (3 Eggs) + Rotis + Curd',
          hindiTitle: dayIdx % 2 === 0 ? 'तंदूरी चिकन और रोटी' : 'अंडा करी और रोटी',
          suggestedTime: '8:45 PM',
          desiProTip: 'Marinate chicken in spiced curd for succulent texture.',
          estimatedCost: dayIdx % 2 === 0 ? 60 : 35,
          items: dayIdx % 2 === 0 ? [
            { foodItem: findF('food-tandoori-chicken'), quantity: 1, preparationNote: 'Pan seared tandoori style chicken' },
            { foodItem: findF('food-roti-phulka'), quantity: 2, preparationNote: '2 rotis' }
          ] : [
            { foodItem: findF('food-egg-boiled-whole'), quantity: 2, preparationNote: '2 eggs in light curry' },
            { foodItem: findF('food-egg-white'), quantity: 1, preparationNote: '1 extra white' },
            { foodItem: findF('food-roti-phulka'), quantity: 2, preparationNote: '2 rotis' }
          ],
          totalCalories: dayIdx % 2 === 0 ? 400 : 435,
          totalProtein: dayIdx % 2 === 0 ? 38.2 : 24.5,
          totalCarbs: dayIdx % 2 === 0 ? 39.5 : 42.0,
          totalFat: dayIdx % 2 === 0 ? 9.5 : 17.5
        });
      }

      weeklySchedule[day.id] = meals;
    });

    // Compute weekly shopping list items
    const weeklyShoppingItems: ShoppingItem[] = [];
    if (dietType === 'pure_veg' || dietType === 'vegan') {
      weeklyShoppingItems.push({ item: 'Soya Chunks (Raw Dry)', quantity: '500g', estimatedPrice: 75, category: 'Protein Champion' });
      weeklyShoppingItems.push({ item: 'Chana Sattu (Roasted)', quantity: '1 kg', estimatedPrice: 120, category: 'Protein Champion' });
      weeklyShoppingItems.push({ item: 'Fresh Paneer (Malai/Low-fat)', quantity: '800g', estimatedPrice: 340, category: 'Dairy' });
      weeklyShoppingItems.push({ item: 'Fresh Dahi / Curd', quantity: '2 kg', estimatedPrice: 160, category: 'Dairy' });
      weeklyShoppingItems.push({ item: 'Yellow Moong Dal', quantity: '1 kg', estimatedPrice: 160, category: 'Dals & Legumes' });
      weeklyShoppingItems.push({ item: 'Roasted Bhuna Chana', quantity: '500g', estimatedPrice: 90, category: 'Desi Snacks' });
      weeklyShoppingItems.push({ item: 'Whole Wheat Atta & Rice', quantity: '3 kg', estimatedPrice: 150, category: 'Grains' });
      weeklyShoppingItems.push({ item: 'Vegetables (Palak, Onions, Tomatoes)', quantity: 'Assorted', estimatedPrice: 140, category: 'Produce' });
    } else {
      weeklyShoppingItems.push({ item: 'Eggs (Poultry/Desi)', quantity: '3 Dozen (36 Eggs)', estimatedPrice: 250, category: 'Eggitarian' });
      weeklyShoppingItems.push({ item: 'Chicken Breast (Boneless)', quantity: '1.5 kg', estimatedPrice: 420, category: 'Poultry' });
      weeklyShoppingItems.push({ item: 'Soya Chunks & Chana Sattu', quantity: '1 kg combined', estimatedPrice: 150, category: 'Plant Protein' });
      weeklyShoppingItems.push({ item: 'Fresh Dahi / Curd', quantity: '1.5 kg', estimatedPrice: 120, category: 'Dairy' });
      weeklyShoppingItems.push({ item: 'Whole Wheat Atta & Basmati Rice', quantity: '3 kg', estimatedPrice: 160, category: 'Grains' });
      weeklyShoppingItems.push({ item: 'Yellow Moong Dal & Chana', quantity: '1 kg', estimatedPrice: 140, category: 'Dals' });
      weeklyShoppingItems.push({ item: 'Produce & Spices', quantity: 'Weekly Batch', estimatedPrice: 150, category: 'Produce' });
    }

    const totalWeeklyGroceryBill = weeklyShoppingItems.reduce((acc, it) => acc + it.estimatedPrice, 0);
    const avgDailyCost = Math.round(totalWeeklyGroceryBill / 7);

    // Compute Monday's macros for high-level plan targets
    const monMeals = weeklySchedule['monday'];
    const totalCals = monMeals.reduce((acc, m) => acc + m.totalCalories, 0);
    const totalP = Math.round(monMeals.reduce((acc, m) => acc + m.totalProtein, 0));
    const totalC = Math.round(monMeals.reduce((acc, m) => acc + m.totalCarbs, 0));
    const totalF = Math.round(monMeals.reduce((acc, m) => acc + m.totalFat, 0));

    const newPlan: IndianDietPlan = {
      id: `budget-7day-${Date.now()}`,
      name: `7-Day ${dietType.replace('_', ' ').toUpperCase()} Budget Diet (₹${avgDailyCost}/day)`,
      hindiName: `7-दिवसीय संपूर्ण देसी बजट डाइट प्लान`,
      tagline: `Calculated for ~${targetCals} kcal with ${totalP}g optimal desi protein under ₹${totalWeeklyGroceryBill}/week!`,
      goal: targetCals < 1900 ? 'fat_loss' : 'muscle_gain',
      dietType,
      budgetLevel: budget,
      targetCalories: totalCals,
      targetProtein: totalP,
      targetCarbs: totalC,
      targetFat: totalF,
      estimatedDailyCost: avgDailyCost,
      weeklyGroceryBudget: totalWeeklyGroceryBill,
      description: `Complete 7-day Indian meal blueprint adhering to weekly grocery expenditure limits. Packed with Mandi staples.`,
      groceryList: weeklyShoppingItems.map(s => `${s.item} (${s.quantity})`),
      weeklyShoppingItems,
      weeklySchedule,
      meals: monMeals,
      tipsForSuccess: [
        'Shop at your local Mandi or Sabzi market on Sundays for best wholesale rates.',
        'Batch-boil Moong Dal and Rajma for 2-3 days in advance.',
        'Drink Sattu immediately after mixing in water before it settles.'
      ],
      isCustomGenerated: true
    };

    setGeneratedPlan(newPlan);
    setSelectedDay('monday');
    setActiveViewTab('schedule');
  };

  const handleSavePlan = () => {
    if (!generatedPlan) return;
    saveCustomDietPlan(generatedPlan);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSetActive = () => {
    if (!generatedPlan) return;
    setActiveDietPlan(generatedPlan);
    alert('Plan activated! Your daily targets have been updated to this 7-day schedule.');
  };

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gray-900/90 border border-gray-800 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20">
            <Wand2 className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>7-Day Budget Diet Generator</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                Mandi Optimized
              </span>
            </h2>
            <p className="text-xs text-gray-400">Generates full 7-day meal schedule + weekly grocery shopping list adhering to ₹ budget</p>
          </div>
        </div>

        {/* Input Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Diet Type */}
          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1.5 uppercase tracking-wider">
              Dietary Preference
            </label>
            <select
              value={dietType}
              onChange={(e) => setDietType(e.target.value as IndianDietType)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none"
            >
              <option value="pure_veg">Pure Vegetarian (शाकाहारी)</option>
              <option value="eggetarian">Eggetarian (अंडा + वेज)</option>
              <option value="non_veg">Non-Vegetarian (चिकन + अंडा)</option>
              <option value="vegan">100% Plant Vegan (सोया + दाल)</option>
            </select>
          </div>

          {/* Budget Tier */}
          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1.5 uppercase tracking-wider">
              Weekly Grocery Budget
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value as BudgetLevel)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none"
            >
              <option value="student_budget">Hostel / Student (₹120-150 / day)</option>
              <option value="standard">Standard Athlete (₹200-250 / day)</option>
              <option value="premium">Lean Muscle Pro (₹350-450 / day)</option>
            </select>
          </div>

          {/* Goal */}
          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1.5 uppercase tracking-wider">
              Training Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none"
            >
              <option value="muscle_gain">Lean Muscle Gain (Bulking)</option>
              <option value="fat_loss">Fat Loss / Cutting (कटिंग)</option>
              <option value="maintenance">Body Recomposition</option>
            </select>
          </div>

          {/* Daily Calorie Target */}
          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1.5 uppercase tracking-wider">
              Calorie Target ({targetCals} kcal)
            </label>
            <input
              type="range"
              min="1500"
              max="3200"
              step="50"
              value={targetCals}
              onChange={(e) => setTargetCals(parseInt(e.target.value))}
              className="w-full accent-orange-500 h-2 bg-gray-800 rounded-lg cursor-pointer mt-2"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-4 pt-3 border-t border-gray-800 flex justify-end">
          <button
            onClick={handleGenerate}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/25 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate 7-Day Budget Diet</span>
          </button>
        </div>
      </div>

      {/* Generated Plan Display */}
      {generatedPlan && (
        <div className="space-y-4 animate-fade-in">
          {/* Plan Header Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900 to-orange-950/40 border border-orange-500/40 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-orange-400 block mb-1">
                  Engineered 7-Day Indian Diet Plan
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {generatedPlan.name}
                </h3>
                <p className="text-xs text-gray-300 mt-1 max-w-xl">
                  {generatedPlan.tagline}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>~₹{generatedPlan.estimatedDailyCost}/day (₹{generatedPlan.weeklyGroceryBudget}/week)</span>
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    🔥 {generatedPlan.targetProtein}g Protein / day
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSavePlan}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    savedSuccess
                      ? 'bg-emerald-500 text-white border-emerald-400'
                      : 'bg-gray-800 hover:bg-gray-750 text-white border-gray-700'
                  }`}
                >
                  {savedSuccess ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  <span>{savedSuccess ? 'Saved to Plans!' : 'Save Plan'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSetActive}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/25 active:scale-95 transition-all"
                >
                  Set as Active Diet
                </button>
              </div>
            </div>

            {/* View Switcher: Daily Schedule vs Weekly Grocery List */}
            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setActiveViewTab('schedule')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  activeViewTab === 'schedule'
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>7-Day Schedule</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveViewTab('grocery')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  activeViewTab === 'grocery'
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Weekly Mandi Shopping List ({generatedPlan.weeklyShoppingItems?.length || 0})</span>
              </button>
            </div>
          </div>

          {/* View Tab 1: Day by Day Schedule */}
          {activeViewTab === 'schedule' && (
            <div className="space-y-4">
              {/* Day Selector Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                {DAYS_OF_WEEK.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDay(d.id)}
                    className={`px-4 py-2 rounded-2xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      selectedDay === d.id
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                        : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>{d.label}</span>
                    <span className="text-[10px] opacity-75 font-normal">({d.hindi})</span>
                  </button>
                ))}
              </div>

              {/* Meals for Selected Day */}
              {generatedPlan.weeklySchedule && generatedPlan.weeklySchedule[selectedDay] && (
                <div className="space-y-3">
                  {generatedPlan.weeklySchedule[selectedDay].map((meal, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-4 sm:p-5 rounded-3xl bg-gray-900/90 border border-gray-800 shadow-sm space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="p-2 rounded-xl bg-orange-500/15 text-orange-400">
                            <Utensils className="w-4 h-4" />
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm sm:text-base font-bold text-white">{meal.title}</h4>
                              {meal.hindiTitle && (
                                <span className="text-xs text-gray-400">({meal.hindiTitle})</span>
                              )}
                            </div>
                            <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-orange-400" />
                              {meal.suggestedTime}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-base font-black text-orange-400 block">
                            {meal.totalCalories} kcal
                          </span>
                          <span className="text-xs font-bold text-emerald-400">
                            {meal.totalProtein}g Protein
                          </span>
                          {meal.estimatedCost && (
                            <span className="text-[10px] text-amber-400 font-bold block">
                              ~₹{meal.estimatedCost}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Ingredients List */}
                      <div className="p-3 rounded-2xl bg-gray-850/80 border border-gray-800/80 divide-y divide-gray-800/50 text-xs">
                        {meal.items.map((it, idx) => (
                          <div key={idx} className="py-1.5 first:pt-0 last:pb-0 flex items-center justify-between">
                            <span className="font-semibold text-gray-200">
                              {it.quantity}× {it.foodItem.name}
                            </span>
                            <span className="text-gray-400 text-[11px]">
                              {it.preparationNote || it.foodItem.servingUnit}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Pro tip */}
                      {meal.desiProTip && (
                        <p className="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl leading-relaxed">
                          💡 <strong>Desi Pro Tip:</strong> {meal.desiProTip}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* View Tab 2: Weekly Grocery Mandi List */}
          {activeViewTab === 'grocery' && (
            <div className="p-5 sm:p-6 rounded-3xl bg-gray-900/90 border border-gray-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-orange-400" />
                    <span>Weekly Mandi Grocery Shopping List</span>
                  </h4>
                  <p className="text-xs text-gray-400">Take this list to your local market on Sunday to prep for the week</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Total Estimated Bill:</span>
                  <span className="text-lg font-black text-amber-400">
                    ₹{generatedPlan.weeklyGroceryBudget}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {generatedPlan.weeklyShoppingItems?.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-gray-850/80 border border-gray-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block text-sm">{s.item}</span>
                      <span className="text-[11px] text-gray-400">Quantity: <strong className="text-gray-200">{s.quantity}</strong></span>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-amber-400 text-sm">~₹{s.estimatedPrice}</span>
                      <span className="text-[10px] text-gray-500 block uppercase font-bold">{s.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
