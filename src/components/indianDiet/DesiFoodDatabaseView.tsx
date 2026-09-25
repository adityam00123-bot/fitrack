import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FoodItem } from '../../types/nutrition';
import { Search, Flame, Sparkles, Filter, Info, Plus } from 'lucide-react';

export const DesiFoodDatabaseView: React.FC = () => {
  const { foods } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDietType, setSelectedDietType] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'dal_legume', label: 'Dals & Legumes' },
    { id: 'dairy', label: 'Dairy & Paneer' },
    { id: 'grain', label: 'Rotis & Rice' },
    { id: 'egg', label: 'Egg Products' },
    { id: 'meat_poultry', label: 'Chicken & Fish' },
    { id: 'snack_desi', label: 'Desi Snacks' },
    { id: 'vegetable', label: 'Sabzis' }
  ];

  const filtered = foods.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          (item.hindiName && item.hindiName.includes(search));
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesDiet = selectedDietType === 'all' || item.dietType === selectedDietType;
    return matchesSearch && matchesCat && matchesDiet;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="space-y-3 bg-gray-900/90 border border-gray-800 p-4 rounded-3xl">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search desi foods (e.g. Soya Chunks, Sattu, Paneer, Dal, Fish, Roti)..."
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

        <div className="flex items-center gap-1.5 pt-1 border-t border-gray-800 text-xs">
          <span className="text-gray-500 text-[11px] font-semibold uppercase mr-1">Diet:</span>
          {['all', 'veg', 'non_veg', 'egg', 'vegan'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedDietType(t)}
              className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-colors ${
                selectedDietType === t
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-gray-800/60 text-gray-400 hover:text-gray-200'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Food Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 hover:border-orange-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{item.name}</h4>
                  {item.hindiName && (
                    <span className="text-[11px] text-gray-400 block mt-0.5">{item.hindiName}</span>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-extrabold text-orange-400 block">
                    {item.calories} <span className="text-[10px] font-normal text-gray-400">kcal</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {item.protein}g <span className="text-[10px] font-normal text-gray-400">P</span>
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-400 mt-1">
                Portion: <strong className="text-gray-200">{item.servingUnit}</strong>
              </div>

              {item.benefits && (
                <div className="mt-2.5 p-2 rounded-xl bg-gray-850 text-[11px] text-gray-300 leading-relaxed">
                  {item.benefits}
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400">
              <span>Carbs: <strong className="text-white">{item.carbs}g</strong></span>
              <span>Fat: <strong className="text-white">{item.fat}g</strong></span>
              {item.fiber !== undefined && (
                <span>Fiber: <strong className="text-white">{item.fiber}g</strong></span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
