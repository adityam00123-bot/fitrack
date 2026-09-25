import React, { useState } from 'react';
import { INDIAN_FOOD_SWAPS } from '../../data/foodSwapsData';
import { ArrowRight, Flame, TrendingUp, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export const DesiFoodSwaps: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Smart Swaps' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'main_course', label: 'Main Curries' },
    { id: 'snack', label: 'Chai Time Snacks' },
    { id: 'drink', label: 'Drinks & Chai' },
    { id: 'sweet', label: 'Mithai & Sweets' }
  ];

  const filtered = INDIAN_FOOD_SWAPS.filter(item => {
    return selectedCategory === 'all' || item.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Introduction Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-950/40 via-gray-900 to-amber-950/30 border border-orange-500/30 shadow-lg">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="text-xs uppercase font-bold tracking-wider text-orange-400">Desi Smart Swaps</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">Eat What You Love, Just Smarter!</h2>
        <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl">
          You don't need to abandon Indian home food to get shredded. Simple ingredient tweaks save hundreds of empty calories and multiply your protein intake.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === c.id
                ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Swaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((swap) => (
          <div
            key={swap.id}
            className="p-5 rounded-3xl bg-gray-900/90 border border-gray-800 hover:border-orange-500/40 transition-all flex flex-col justify-between shadow-md"
          >
            <div>
              {/* Top Side-by-side comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-gray-800">
                {/* Traditional High Calorie item */}
                <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/20">
                  <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Traditional Habit
                  </div>
                  <h4 className="text-xs font-bold text-white leading-tight">{swap.traditionalFood}</h4>
                  {swap.traditionalHindi && (
                    <span className="text-[10px] text-gray-400 block">{swap.traditionalHindi}</span>
                  )}
                  <div className="mt-2 text-xs">
                    <span className="text-rose-400 font-extrabold">{swap.traditionalCalories} kcal</span>
                    <span className="text-gray-400 text-[11px] block">{swap.traditionalProtein}g Protein • {swap.traditionalFat}g Fat</span>
                  </div>
                </div>

                {/* Smart High Protein swap */}
                <div className="p-3 rounded-2xl bg-emerald-950/25 border border-emerald-500/30">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Fit Smart Swap
                  </div>
                  <h4 className="text-xs font-bold text-white leading-tight">{swap.smartSwapFood}</h4>
                  {swap.smartSwapHindi && (
                    <span className="text-[10px] text-emerald-300 block">{swap.smartSwapHindi}</span>
                  )}
                  <div className="mt-2 text-xs">
                    <span className="text-emerald-400 font-extrabold">{swap.smartSwapCalories} kcal</span>
                    <span className="text-emerald-200 text-[11px] block">{swap.smartSwapProtein}g Protein • {swap.smartSwapFat}g Fat</span>
                  </div>
                </div>
              </div>

              {/* Rationale explanation */}
              <p className="text-xs text-gray-300 mt-3 leading-relaxed">
                {swap.explanation}
              </p>
            </div>

            {/* Impact Badges */}
            <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs font-bold">
              <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                Save {swap.caloriesSaved} kcal
              </span>
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                +{swap.proteinGained}g Extra Protein!
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
