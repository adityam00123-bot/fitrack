import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodItem, MealType } from '../../types/nutrition';
import { calculateProteinPerRupee } from '../../data/indianFoodDatabase';
import { Search, Plus, X, Flame, Sparkles, Coins, Check, Utensils } from 'lucide-react';

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
  const { foods, addFoodToMeal, addCustomFood } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Custom food fields
  const [customName, setCustomName] = useState('');
  const [customHindi, setCustomHindi] = useState('');
  const [customServing, setCustomServing] = useState('100g');
  const [customCals, setCustomCals] = useState<number>(150);
  const [customProtein, setCustomProtein] = useState<number>(10);
  const [customCarbs, setCustomCarbs] = useState<number>(15);
  const [customFat, setCustomFat] = useState<number>(5);
  const [customPrice, setCustomPrice] = useState<number>(20);

  if (!isOpen) return null;

  const mealTypeLabels: Record<MealType, string> = {
    breakfast: 'Breakfast (नाश्ता)',
    morning_snack: 'Morning Snack',
    lunch: 'Lunch (दोपहर का भोजन)',
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

  const handleCreateAndLogCustom = () => {
    if (!customName.trim()) {
      alert('Please enter a food name');
      return;
    }
    const newFood: Omit<FoodItem, 'id'> = {
      name: customName.trim(),
      hindiName: customHindi.trim() || undefined,
      category: 'grain',
      dietType: 'veg',
      servingUnit: customServing.trim() || '100g',
      servingSizeGrams: 100,
      calories: customCals,
      protein: customProtein,
      carbs: customCarbs,
      fat: customFat,
      pricePerServing: customPrice,
      mandiPricePer100g: customPrice,
      proteinPerRupee: customPrice > 0 ? parseFloat((customProtein / customPrice).toFixed(2)) : 0
    };

    addCustomFood(newFood);
    // Also log directly to current meal
    addFoodToMeal(mealType, { ...newFood, id: `custom-${Date.now()}` }, 1);
    setIsCustomMode(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between bg-gray-900/80">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400">
              Log Meal Items
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {mealTypeLabels[mealType]}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCustomMode(!isCustomMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                isCustomMode
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {isCustomMode ? 'Search Library' : '+ Custom Food'}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Custom Food Creation Mode */}
        {isCustomMode ? (
          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Utensils className="w-4 h-4 text-orange-400" />
              <h4 className="text-sm font-bold text-white">Add Custom Home Recipe</h4>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Food Name *</label>
              <input
                type="text"
                placeholder="e.g. Mummy's Paneer Bhurji or Oats Shake"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Hindi / Local Name</label>
                <input
                  type="text"
                  placeholder="e.g. पनीर भुर्जी"
                  value={customHindi}
                  onChange={(e) => setCustomHindi(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Serving Unit</label>
                <input
                  type="text"
                  placeholder="e.g. 1 medium bowl (150g)"
                  value={customServing}
                  onChange={(e) => setCustomServing(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="bg-gray-850 p-2.5 rounded-xl border border-gray-800">
                <span className="text-[10px] text-gray-400 font-bold block mb-1">Calories</span>
                <input
                  type="number"
                  value={customCals}
                  onChange={(e) => setCustomCals(parseInt(e.target.value) || 0)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-1 text-center font-bold text-white text-xs"
                />
              </div>

              <div className="bg-gray-850 p-2.5 rounded-xl border border-gray-800">
                <span className="text-[10px] text-emerald-400 font-bold block mb-1">Protein (g)</span>
                <input
                  type="number"
                  step="0.5"
                  value={customProtein}
                  onChange={(e) => setCustomProtein(parseFloat(e.target.value) || 0)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-1 text-center font-bold text-white text-xs"
                />
              </div>

              <div className="bg-gray-850 p-2.5 rounded-xl border border-gray-800">
                <span className="text-[10px] text-cyan-400 font-bold block mb-1">Carbs (g)</span>
                <input
                  type="number"
                  step="0.5"
                  value={customCarbs}
                  onChange={(e) => setCustomCarbs(parseFloat(e.target.value) || 0)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-1 text-center font-bold text-white text-xs"
                />
              </div>

              <div className="bg-gray-850 p-2.5 rounded-xl border border-gray-800">
                <span className="text-[10px] text-amber-400 font-bold block mb-1">Fat (g)</span>
                <input
                  type="number"
                  step="0.5"
                  value={customFat}
                  onChange={(e) => setCustomFat(parseFloat(e.target.value) || 0)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-1 text-center font-bold text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Estimated Cost (₹ per serving)</label>
              <input
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleCreateAndLogCustom}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/25 active:scale-95 transition-all"
            >
              Save Custom Food &amp; Log to {mealType}
            </button>
          </div>
        ) : (
          <>
            {/* Search & Categories */}
            <div className="p-4 border-b border-gray-800 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Indian foods (e.g. Soya Chunks, Paneer, Roti, Dal, Chicken)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs sm:text-sm focus:border-orange-500 focus:outline-none placeholder-gray-500"
                />
              </div>

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
            </div>

            {/* Food List */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-800">
              {filteredFoods.map((item) => {
                const isSelected = selectedFood?.id === item.id;
                const ppr = calculateProteinPerRupee(item);

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedFood(item)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-orange-500/15 border-orange-500/50 shadow-md'
                        : 'bg-gray-850/80 hover:bg-gray-800/90 border-gray-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white">{item.name}</h4>
                          {item.isIndianSpecialty && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                              Desi
                            </span>
                          )}
                          {ppr > 1.2 && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold flex items-center gap-0.5">
                              <Coins className="w-2.5 h-2.5" />
                              {ppr} g/₹
                            </span>
                          )}
                        </div>

                        {item.hindiName && (
                          <span className="text-[11px] text-gray-400 block">{item.hindiName}</span>
                        )}

                        <span className="text-xs text-gray-400 mt-1 block">
                          Serving: <strong className="text-gray-200">{item.servingUnit}</strong>
                          {item.pricePerServing && (
                            <span className="text-amber-400 ml-2 font-medium">
                              (₹{item.pricePerServing})
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
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
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <span className="text-xs font-bold text-gray-400">Portions:</span>
                  <div className="flex items-center gap-1">
                    {[0.5, 1, 1.5, 2, 3].map((val) => (
                      <button
                        key={val}
                        onClick={() => setQuantity(val)}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                          quantity === val
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {val}x
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(0.1, parseFloat(e.target.value) || 1))}
                    className="w-12 px-1 py-1 rounded-lg bg-gray-800 border border-gray-700 text-white text-center text-xs font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <div className="text-right text-xs">
                    <span className="text-orange-400 font-bold block">
                      {Math.round(selectedFood.calories * quantity)} kcal
                    </span>
                    <span className="text-emerald-400 font-semibold block">
                      {(selectedFood.protein * quantity).toFixed(1)}g Protein
                    </span>
                    {selectedFood.pricePerServing && (
                      <span className="text-amber-400 text-[10px] font-bold">
                        ₹{(selectedFood.pricePerServing * quantity).toFixed(1)}
                      </span>
                    )}
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
          </>
        )}
      </div>
    </div>
  );
};
