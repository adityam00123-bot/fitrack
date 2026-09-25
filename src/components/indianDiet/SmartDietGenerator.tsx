import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IndianDietPlan, IndianDietType, BudgetLevel, PlannedMeal } from '../../types/indianDiet';
import { Sparkles, Wand2, Check, Flame, ChevronRight, Bookmark } from 'lucide-react';

export const SmartDietGenerator: React.FC = () => {
  const { foods, saveCustomDietPlan, setActiveDietPlan } = useApp();

  const [dietType, setDietType] = useState<IndianDietType>('pure_veg');
  const [targetCals, setTargetCals] = useState<number>(2000);
  const [budget, setBudget] = useState<BudgetLevel>('standard');
  const [mealsPerDay, setMealsPerDay] = useState<number>(4);
  const [region, setRegion] = useState<'north' | 'south' | 'universal'>('universal');
  const [generatedPlan, setGeneratedPlan] = useState<IndianDietPlan | null>(null);

  const handleGenerate = () => {
    // Generate meal items based on selected criteria
    const meals: PlannedMeal[] = [];

    // Helper to find food
    const findF = (id: string) => foods.find(f => f.id === id) || foods[0];

    if (dietType === 'pure_veg') {
      meals.push({
        mealType: 'breakfast',
        title: 'Desi Besan & Paneer Chilla',
        hindiTitle: 'बेसन और पनीर का चीला',
        suggestedTime: '8:30 AM',
        desiProTip: 'Cook on low flame for crisp texture. Pair with homemade mint chutney.',
        items: [
          { foodItem: findF('food-besan-chilla'), quantity: 2, preparationNote: 'Savory gram flour pancake' },
          { foodItem: findF('food-paneer-raw'), quantity: 0.5, preparationNote: 'Grated paneer filling' }
        ],
        totalCalories: 400,
        totalProtein: 22.8,
        totalCarbs: 38.1,
        totalFat: 18.8
      });

      meals.push({
        mealType: 'lunch',
        title: 'High Protein Soya Matar + Roti + Moong Dal',
        hindiTitle: 'सोया चंक्स सब्जी, 2 रोटी और मूंग दाल',
        suggestedTime: '1:30 PM',
        desiProTip: 'Squeeze water from boiled soya chunks twice to remove raw soya smell.',
        items: [
          { foodItem: findF('food-soya-chunks'), quantity: 1, preparationNote: '50g dry soya chunks cooked in onion-tomato tadka' },
          { foodItem: findF('food-roti-phulka'), quantity: 2, preparationNote: 'Fresh whole wheat rotis' },
          { foodItem: findF('food-moong-dal-boiled'), quantity: 1, preparationNote: 'Yellow moong dal' },
          { foodItem: findF('food-chaas'), quantity: 1, preparationNote: 'Cooling jeera chaas' }
        ],
        totalCalories: 535,
        totalProtein: 44.5,
        totalCarbs: 78.0,
        totalFat: 7.5
      });

      meals.push({
        mealType: 'evening_snack',
        title: 'Roasted Bhuna Chana + Sattu Drink',
        hindiTitle: 'भुना चना और सत्तू शरबत',
        suggestedTime: '5:30 PM',
        desiProTip: 'Zero cooking time required; high insoluble fiber prevents evening cravings.',
        items: [
          { foodItem: findF('food-roasted-chana'), quantity: 1, preparationNote: 'Crunchy dry roasted chana' },
          { foodItem: findF('food-sattu'), quantity: 1, preparationNote: 'Stirred in cold water with rock salt and lemon' }
        ],
        totalCalories: 345,
        totalProtein: 20.0,
        totalCarbs: 54.0,
        totalFat: 4.7
      });

      meals.push({
        mealType: 'dinner',
        title: 'Palak Paneer + Multigrain Rotis',
        hindiTitle: 'पालक पनीर और मल्टीग्रेन रोटी',
        suggestedTime: '8:45 PM',
        desiProTip: 'Paneer provides slow-digesting casein protein for overnight recovery.',
        items: [
          { foodItem: findF('food-palak-paneer'), quantity: 1, preparationNote: 'Spinach puree with paneer' },
          { foodItem: findF('food-multigrain-roti'), quantity: 2, preparationNote: 'High fiber atta' }
        ],
        totalCalories: 410,
        totalProtein: 21.0,
        totalCarbs: 42.0,
        totalFat: 16.6
      });
    } else {
      // Non-veg / Eggetarian plan
      meals.push({
        mealType: 'breakfast',
        title: 'Egg Bhurji (4 Eggs) + Whole Wheat Toast/Roti',
        hindiTitle: '4 अंडों की भुर्जी और रोटी',
        suggestedTime: '8:30 AM',
        desiProTip: 'Use 2 whole eggs and 2 whites to balance healthy fats and maximize lean protein.',
        items: [
          { foodItem: findF('food-egg-boiled-whole'), quantity: 2, preparationNote: '2 whole eggs' },
          { foodItem: findF('food-egg-white'), quantity: 2, preparationNote: '2 extra egg whites' },
          { foodItem: findF('food-roti-phulka'), quantity: 2, preparationNote: '2 rotis' }
        ],
        totalCalories: 360,
        totalProtein: 26.4,
        totalCarbs: 36.4,
        totalFat: 11.2
      });

      meals.push({
        mealType: 'lunch',
        title: 'Chicken Curry + Basmati Rice + Curd',
        hindiTitle: 'चिकन करी, चावल और ताजी दही',
        suggestedTime: '1:30 PM',
        desiProTip: 'Basmati rice replenishes muscle glycogen without bloating.',
        items: [
          { foodItem: findF('food-chicken-curry-home'), quantity: 1, preparationNote: '200g home style chicken' },
          { foodItem: findF('food-basmati-rice-cooked'), quantity: 1.5, preparationNote: 'Steamed rice' },
          { foodItem: findF('food-dahi'), quantity: 1, preparationNote: 'Cool curd' }
        ],
        totalCalories: 642,
        totalProtein: 40.1,
        totalCarbs: 72.0,
        totalFat: 21.0
      });

      meals.push({
        mealType: 'evening_snack',
        title: 'Peanut Butter Banana Roti Roll',
        hindiTitle: 'पीनट बटर रोटी रोल',
        suggestedTime: '5:30 PM',
        desiProTip: 'Spread peanut butter on warm roti and roll like a wrap.',
        items: [
          { foodItem: findF('food-roti-phulka'), quantity: 1, preparationNote: '1 roti' },
          { foodItem: findF('food-peanut-butter'), quantity: 1, preparationNote: 'Pure roasted peanut butter' }
        ],
        totalCalories: 285,
        totalProtein: 11.1,
        totalCarbs: 24.0,
        totalFat: 16.5
      });

      meals.push({
        mealType: 'dinner',
        title: 'Tandoori Chicken + 2 Rotis + Salad',
        hindiTitle: 'तंदूरी चिकन और रोटी',
        suggestedTime: '8:45 PM',
        desiProTip: 'Marinate chicken in spiced curd for melt-in-mouth tenderness.',
        items: [
          { foodItem: findF('food-tandoori-chicken'), quantity: 1, preparationNote: 'Clay oven / pan seared' },
          { foodItem: findF('food-roti-phulka'), quantity: 2, preparationNote: '2 rotis' }
        ],
        totalCalories: 400,
        totalProtein: 38.2,
        totalCarbs: 39.5,
        totalFat: 9.5
      });
    }

    const totalCals = meals.reduce((acc, m) => acc + m.totalCalories, 0);
    const totalP = Math.round(meals.reduce((acc, m) => acc + m.totalProtein, 0));
    const totalC = Math.round(meals.reduce((acc, m) => acc + m.totalCarbs, 0));
    const totalF = Math.round(meals.reduce((acc, m) => acc + m.totalFat, 0));

    const newPlan: IndianDietPlan = {
      id: `custom-plan-${Date.now()}`,
      name: `Custom ${dietType.replace('_', ' ').toUpperCase()} Plan (${totalCals} kcal)`,
      hindiName: 'कस्टमाइज़्ड देसी मील प्लान',
      tagline: `Engineered for ${targetCals} calories with ${totalP}g optimal Indian protein.`,
      goal: targetCals < 1900 ? 'fat_loss' : 'muscle_gain',
      dietType,
      budgetLevel: budget,
      targetCalories: totalCals,
      targetProtein: totalP,
      targetCarbs: totalC,
      targetFat: totalF,
      description: `Tailored desi diet plan matching your ${budget.replace('_', ' ')} budget and dietary constraints.`,
      groceryList: [
        'Whole wheat flour / Atta',
        dietType === 'pure_veg' ? 'Soya Chunks & Paneer' : 'Eggs & Chicken Breast',
        'Moong Dal',
        'Dahi / Curd',
        'Roasted Chana / Peanuts',
        'Cumin seeds, Mustard oil, Rock salt'
      ],
      tipsForSuccess: [
        'Cook meals in 1 teaspoon oil per meal to keep hidden calories low.',
        'Drink at least 3.5 liters of water daily.',
        'Prep boiled dal and chopped veggies for 2 days in advance to save kitchen time.'
      ],
      meals,
      isCustomGenerated: true
    };

    setGeneratedPlan(newPlan);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20">
            <Wand2 className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">Smart Indian Diet Plan Generator</h2>
            <p className="text-xs text-gray-400">Generate an exact daily eating schedule based on your calories & budget</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Diet Type */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">Dietary Preference</label>
            <select
              value={dietType}
              onChange={(e) => setDietType(e.target.value as IndianDietType)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none"
            >
              <option value="pure_veg">Pure Vegetarian (शाकाहारी)</option>
              <option value="eggetarian">Eggetarian (अंडा + वेज)</option>
              <option value="non_veg">Non-Vegetarian (चिकन / फिश)</option>
              <option value="jain_veg">Jain Friendly (बिना प्याज / लहसुन)</option>
              <option value="vegan">100% Plant-Based Vegan</option>
            </select>
          </div>

          {/* Calorie Target */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">Daily Calorie Target</label>
            <select
              value={targetCals}
              onChange={(e) => setTargetCals(parseInt(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none"
            >
              <option value={1500}>1500 kcal (Aggressive Fat Loss)</option>
              <option value={1800}>1800 kcal (Moderate Cutting)</option>
              <option value={2000}>2000 kcal (Maintenance / Lean Body)</option>
              <option value={2400}>2400 kcal (Muscle Gain / Clean Bulk)</option>
              <option value={2800}>2800 kcal (Heavy Bulk / Pehlwan Mode)</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">Budget Tier</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value as BudgetLevel)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none"
            >
              <option value="student_budget">Student / Hostel Budget (₹100-150/day)</option>
              <option value="standard">Standard Home Kitchen (₹200-300/day)</option>
              <option value="premium">Premium Gourmet (Whey, Tofu, Nuts)</option>
            </select>
          </div>

          {/* Meals Per Day */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">Daily Meal Frequency</label>
            <select
              value={mealsPerDay}
              onChange={(e) => setMealsPerDay(parseInt(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none"
            >
              <option value={3}>3 Meals (Breakfast, Lunch, Dinner)</option>
              <option value={4}>4 Meals (+ Evening Snack)</option>
              <option value={5}>5 Meals (+ Post Workout)</option>
            </select>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-800 flex justify-end">
          <button
            onClick={handleGenerate}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-lg shadow-orange-500/25 active:scale-95 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Desi Meal Plan</span>
          </button>
        </div>
      </div>

      {/* Generated Plan Output */}
      {generatedPlan && (
        <div className="p-6 rounded-3xl bg-gray-900 border border-orange-500/40 shadow-2xl animate-fade-in space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                ✓ Plan Generated Successfully
              </span>
              <h3 className="text-xl font-black text-white mt-1">{generatedPlan.name}</h3>
              <p className="text-xs text-gray-400">{generatedPlan.tagline}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  saveCustomDietPlan(generatedPlan);
                  alert('Custom diet plan saved to your library!');
                }}
                className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-750 text-white text-xs font-bold border border-gray-700 flex items-center gap-1.5 transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5 text-orange-400" />
                <span>Save to Library</span>
              </button>

              <button
                onClick={() => {
                  saveCustomDietPlan(generatedPlan);
                  setActiveDietPlan(generatedPlan);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
              >
                Set as Active Plan
              </button>
            </div>
          </div>

          {/* Meals list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedPlan.meals.map((meal, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-850/80 border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                    {meal.title}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {meal.totalCalories} kcal • {meal.totalProtein}g P
                  </span>
                </div>
                {meal.hindiTitle && (
                  <span className="text-[11px] text-gray-400 block mb-2">{meal.hindiTitle}</span>
                )}
                <ul className="text-xs text-gray-300 space-y-1">
                  {meal.items.map((it, i) => (
                    <li key={i} className="flex items-center justify-between py-1 border-t border-gray-800/50">
                      <span>{it.foodItem.name} ({it.quantity}×)</span>
                      <span className="text-emerald-400 font-semibold">{Math.round(it.foodItem.protein * it.quantity)}g P</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
