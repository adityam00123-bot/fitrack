import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodItem, MealType } from '../../types/nutrition';
import { calculateProteinPerRupee } from '../../data/indianFoodDatabase';
import {
  Search,
  Flame,
  Sparkles,
  TrendingUp,
  Coins,
  ArrowUpDown,
  Plus,
  Check,
  X,
  Info,
  Award,
  Zap
} from 'lucide-react';

export const DesiFoodDatabaseView: React.FC = () => {
  const { foods, addFoodToMeal } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDietType, setSelectedDietType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'protein_per_rupee' | 'protein_high' | 'calories_low' | 'protein_density'>('protein_per_rupee');
  const [budgetFilter, setBudgetFilter] = useState<'all' | 'budget' | 'moderate' | 'premium'>('all');

  // Quick Log modal state
  const [loggingFood, setLoggingFood] = useState<FoodItem | null>(null);
  const [logMealType, setLogMealType] = useState<MealType>('breakfast');
  const [logQuantity, setLogQuantity] = useState<number>(1);
  const [logSuccess, setLogSuccess] = useState(false);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'dal_legume', label: 'Dals & Soya' },
    { id: 'dairy', label: 'Dairy & Paneer' },
    { id: 'grain', label: 'Rotis & Rice' },
    { id: 'egg', label: 'Egg Products' },
    { id: 'meat_poultry', label: 'Chicken & Fish' },
    { id: 'snack_desi', label: 'Desi Snacks' },
    { id: 'vegetable', label: 'Sabzis' },
    { id: 'supplement', label: 'Supplements' }
  ];

  // Filter & sort foods
  const processedFoods = foods
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                            (item.hindiName && item.hindiName.includes(search));
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesDiet = selectedDietType === 'all' || item.dietType === selectedDietType;
      const matchesBudget = budgetFilter === 'all' || item.budgetRating === budgetFilter;
      return matchesSearch && matchesCat && matchesDiet && matchesBudget;
    })
    .sort((a, b) => {
      if (sortBy === 'protein_per_rupee') {
        return calculateProteinPerRupee(b) - calculateProteinPerRupee(a);
      }
      if (sortBy === 'protein_high') {
        return b.protein - a.protein;
      }
      if (sortBy === 'calories_low') {
        return a.calories - b.calories;
      }
      if (sortBy === 'protein_density') {
        // Protein calories / total calories
        const densityA = (a.protein * 4) / Math.max(1, a.calories);
        const densityB = (b.protein * 4) / Math.max(1, b.calories);
        return densityB - densityA;
      }
      return 0;
    });

  // Calculate rank for protein-per-rupee leaderboard
  const allRankedByPPR = [...foods]
    .filter(f => f.protein > 0)
    .sort((a, b) => calculateProteinPerRupee(b) - calculateProteinPerRupee(a));

  const handleConfirmLog = () => {
    if (!loggingFood) return;
    addFoodToMeal(logMealType, loggingFood, logQuantity);
    setLogSuccess(true);
    setTimeout(() => {
      setLogSuccess(false);
      setLoggingFood(null);
      setLogQuantity(1);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with Protein per Rupee Explanation */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 p-6 sm:p-7 text-white shadow-xl shadow-orange-950/20">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm text-white">
              <Coins className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
              Desi Mandi Index • Protein Efficiency Engine
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Protein per Rupee ($g/₹$) Leaderboard
          </h2>
          <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed mb-4">
            Traditional fitness apps only look at calories. FITRACK calculates real-world
            <strong> economic protein efficiency</strong> using verified Indian Mandi and retail prices.
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/20 font-bold flex items-center gap-1.5">
              <span>🥇 1st: Soya Chunks (3.47 g/₹)</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/20 font-bold flex items-center gap-1.5">
              <span>🥈 2nd: Chana Sattu (1.92 g/₹)</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/20 font-bold flex items-center gap-1.5">
              <span>🥉 3rd: Moong Dal &amp; Besan (~1.50 g/₹)</span>
            </span>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none flex items-center justify-end pr-6">
          <Coins className="w-64 h-64 transform rotate-12" />
        </div>
      </div>

      {/* Search & Comprehensive Filters */}
      <div className="space-y-3.5 bg-gray-900/90 border border-gray-800 p-4 sm:p-5 rounded-3xl shadow-sm">
        {/* Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search desi foods (e.g. Soya Chunks, Sattu, Paneer, Dal, Chicken, Eggs)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs sm:text-sm focus:border-orange-500 focus:outline-none placeholder-gray-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 px-3 py-2 rounded-xl text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="protein_per_rupee" className="bg-gray-800">Protein per ₹ (Economic 🥇)</option>
                <option value="protein_high" className="bg-gray-800">Highest Protein (Grams)</option>
                <option value="calories_low" className="bg-gray-800">Lowest Calories</option>
                <option value="protein_density" className="bg-gray-800">Protein-to-Calorie Ratio</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Carousel */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Diet & Budget sub-filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-800 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 text-[10px] font-bold uppercase mr-1">Diet:</span>
            {['all', 'veg', 'non_veg', 'egg', 'vegan'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedDietType(t)}
                className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-colors font-medium ${
                  selectedDietType === t
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                    : 'bg-gray-800/60 text-gray-400 hover:text-gray-200'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 text-[10px] font-bold uppercase mr-1">Budget:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'budget', label: '₹ Budget' },
              { id: 'moderate', label: '₹₹ Moderate' },
              { id: 'premium', label: '₹₹₹ Premium' }
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => setBudgetFilter(b.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors font-medium ${
                  budgetFilter === b.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                    : 'bg-gray-800/60 text-gray-400 hover:text-gray-200'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Food Items with Mandi Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {processedFoods.map((item) => {
          const ppr = calculateProteinPerRupee(item);
          const rank = allRankedByPPR.findIndex(f => f.id === item.id) + 1;

          return (
            <div
              key={item.id}
              className="p-4 rounded-3xl bg-gray-900/90 border border-gray-800 hover:border-orange-500/40 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                {/* Top Badge: Rank & Protein per Rupee score */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {rank === 1 && (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-black flex items-center gap-1">
                        <span>🥇 #1 KING</span>
                      </span>
                    )}
                    {rank === 2 && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-300/20 border border-slate-300/30 text-slate-200 text-[10px] font-black flex items-center gap-1">
                        <span>🥈 #2 CHOP</span>
                      </span>
                    )}
                    {rank === 3 && (
                      <span className="px-2 py-0.5 rounded-lg bg-amber-700/20 border border-amber-600/30 text-amber-400 text-[10px] font-black flex items-center gap-1">
                        <span>🥉 #3 POWER</span>
                      </span>
                    )}

                    {/* Protein per rupee pill */}
                    <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-extrabold flex items-center gap-1">
                      <Coins className="w-3 h-3 text-emerald-400" />
                      <span>{ppr} g/₹</span>
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-orange-400 block">
                      {item.calories} <span className="text-[10px] font-normal text-gray-400">kcal</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {item.protein}g <span className="text-[10px] font-normal text-gray-400">Protein</span>
                    </span>
                  </div>
                </div>

                {/* Food Name & Hindi */}
                <div className="mt-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors leading-snug">
                    {item.name}
                  </h4>
                  {item.hindiName && (
                    <span className="text-[11px] text-gray-400 block mt-0.5">{item.hindiName}</span>
                  )}
                </div>

                {/* Portion & Mandi Price */}
                <div className="flex items-center justify-between text-xs text-gray-400 mt-2 py-1.5 px-2.5 rounded-xl bg-gray-850/80 border border-gray-800">
                  <span>
                    Portion: <strong className="text-gray-200">{item.servingUnit}</strong>
                  </span>
                  <span className="text-amber-400 font-bold">
                    {item.pricePerServing ? `₹${item.pricePerServing}/serving` : item.mandiPricePer100g ? `₹${item.mandiPricePer100g}/100g` : 'Mandi rate'}
                  </span>
                </div>

                {/* Benefits Cues */}
                {item.benefits && (
                  <p className="mt-2.5 text-[11px] text-gray-300/90 leading-relaxed line-clamp-2">
                    {item.benefits}
                  </p>
                )}
              </div>

              {/* Bottom Row: Macros & Quick Log Button */}
              <div className="mt-3 pt-3 border-t border-gray-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <span>C: <strong className="text-white">{item.carbs}g</strong></span>
                  <span>F: <strong className="text-white">{item.fat}g</strong></span>
                  {item.fiber !== undefined && (
                    <span>Fib: <strong className="text-white">{item.fiber}g</strong></span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setLoggingFood(item);
                    setLogQuantity(1);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-400 text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all"
                >
                  <Plus className="w-3 h-3" />
                  <span>Log Meal</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Meal Logging Modal */}
      {loggingFood && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400">
                  Quick Food Logger
                </span>
                <h3 className="text-base font-bold text-white">{loggingFood.name}</h3>
                {loggingFood.hindiName && (
                  <span className="text-xs text-gray-400 block">{loggingFood.hindiName}</span>
                )}
              </div>
              <button
                onClick={() => setLoggingFood(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select Meal Slot */}
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">
                Select Meal Slot
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { id: 'breakfast', label: 'Breakfast' },
                  { id: 'morning_snack', label: 'Snack 1' },
                  { id: 'lunch', label: 'Lunch' },
                  { id: 'evening_snack', label: 'Snack 2' },
                  { id: 'post_workout', label: 'Post-Workout' },
                  { id: 'dinner', label: 'Dinner' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setLogMealType(s.id as MealType)}
                    className={`p-2 rounded-xl text-center font-bold transition-colors ${
                      logMealType === s.id
                        ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Portion multiplier */}
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">
                Portion Multiplier ({loggingFood.servingUnit})
              </label>
              <div className="flex items-center gap-2">
                {[0.5, 1, 1.5, 2, 3].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setLogQuantity(val)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-colors ${
                      logQuantity === val
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {val}x
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Values Summary */}
            <div className="p-3 rounded-2xl bg-gray-850 border border-gray-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-gray-400 block text-[10px]">Total Fuel:</span>
                <span className="font-black text-orange-400 text-base">
                  {Math.round(loggingFood.calories * logQuantity)} kcal
                </span>
              </div>
              <div className="text-center">
                <span className="text-gray-400 block text-[10px]">Total Protein:</span>
                <span className="font-black text-emerald-400 text-base">
                  {(loggingFood.protein * logQuantity).toFixed(1)}g
                </span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 block text-[10px]">Estimated Mandi Cost:</span>
                <span className="font-black text-amber-400 text-base">
                  ₹{((loggingFood.pricePerServing || 15) * logQuantity).toFixed(1)}
                </span>
              </div>
            </div>

            {/* Confirm button */}
            <button
              type="button"
              onClick={handleConfirmLog}
              className={`w-full py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                logSuccess
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white shadow-orange-500/25 active:scale-95'
              }`}
            >
              {logSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Logged to {logMealType}!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Log Food to Today&apos;s Diet</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
