import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodItem, MealType } from '../../types/nutrition';
import { Search, Plus, X, Flame, Sparkles, Filter } from 'lucide-react';

interface MealLoggerModalProps {
  isOpen: boolean;
  mealType: MealType;
  onClose: () => void;
}

export const MealLoggerModal: React.FC<MealLoggerModalProps> = ({
  isOpen,
  mealType,
  onClose
}) => {
  const { foods, addFoodToMeal } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  if (!isOpen) return null;

  const mealTypeLabels: Record<MealType, string> = {
    breakfast: 'Breakfast (नाश्ता)',
    morning_snack: 'Morning Snack',
    lunch: 'Lunch (दोपहर का खाना)',
    evening_snack: 'Evening Snack (शाम का नाश्ता)',
    dinner: 'Dinner (रात का खाना)',
    post_workout: 'Post-Workout Fuel'
  };

  const categories = [
    { id: 'all', label: 'All Foods' },
    { id: 'dal_legume', label: 'Dals & Soya' },
    { id: 'dairy', label: 'Paneer & Dahi' },
    { id: 'grain', label: 'Roti & Rice' },
    { id: 'egg', label: 'Eggs' },
    { id: 'meat_poultry', label: 'Chicken & Fish' },
    { id: 'snack_desi', label: 'Desi Snacks' },
    { id: 'supplement', label: 'Whey & Supplements' }
  ];

  const filteredFoods = foods.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
                          (f.hindiName && f.hindiName.includes(search));
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleLog = () => {
    if (!selectedFood || quantity <= 0) return;
    addFoodToMeal(mealType, selectedFood, quantity);
    setSelectedFood(null);
    setQuantity(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400">
              Log Food
            </span>
            <h3 className="text-lg font-bold text-white">
              {mealTypeLabels[mealType]}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-4 border-b border-gray-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Indian foods (e.g. Soya Chunks, Paneer, Roti, Dal)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Food List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredFoods.map((item) => {
            const isSelected = selectedFood?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedFood(item)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500/15 border-orange-500/50 shadow-md'
                    : 'bg-gray-850 hover:bg-gray-800 border-gray-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      {item.isIndianSpecialty && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                          Desi
                        </span>
                      )}
                    </div>
                    {item.hindiName && (
                      <span className="text-[11px] text-gray-400 block">{item.hindiName}</span>
                    )}
                    <span className="text-xs text-gray-400 mt-1 block">
                      Serving: <strong className="text-gray-200">{item.servingUnit}</strong>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-orange-400 block">
                      {item.calories} <span className="text-xs font-normal text-gray-400">kcal</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {item.protein}g <span className="text-[10px] font-normal text-gray-400">P</span>
                    </span>
                  </div>
                </div>

                {/* Macro pill summary */}
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-800/80 text-[11px] text-gray-400">
                  <span>Carbs: <strong className="text-white">{item.carbs}g</strong></span>
                  <span>Fat: <strong className="text-white">{item.fat}g</strong></span>
                  {item.fiber !== undefined && (
                    <span>Fiber: <strong className="text-white">{item.fiber}g</strong></span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected item quantity & confirmation bar */}
        {selectedFood && (
          <div className="p-4 bg-gray-950 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-semibold text-gray-400">Portion / Servings:</span>
              <div className="flex items-center gap-1.5">
                {[0.5, 1, 1.5, 2, 3].map((val) => (
                  <button
                    key={val}
                    onClick={() => setQuantity(val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      quantity === val
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {val}x
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="text-right text-xs">
                <span className="text-orange-400 font-bold block">
                  {Math.round(selectedFood.calories * quantity)} kcal
                </span>
                <span className="text-emerald-400 font-semibold">
                  {(selectedFood.protein * quantity).toFixed(1)}g Protein
                </span>
              </div>

              <button
                onClick={handleLog}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all"
              >
                Log to {mealType}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
