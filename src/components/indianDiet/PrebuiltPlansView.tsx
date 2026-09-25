import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IndianDietPlan } from '../../types/indianDiet';
import {
  Flame,
  CheckCircle,
  Clock,
  Sparkles,
  ShoppingBag,
  Info,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';

export const PrebuiltPlansView: React.FC = () => {
  const { dietPlans, activeDietPlan, setActiveDietPlan } = useApp();
  const [selectedPlanId, setSelectedPlanId] = useState<string>(activeDietPlan?.id || dietPlans[0]?.id);
  const [expandedMealIdx, setExpandedMealIdx] = useState<number | null>(0);

  const selectedPlan = dietPlans.find(p => p.id === selectedPlanId) || dietPlans[0];

  return (
    <div className="space-y-6">
      {/* Plan Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {dietPlans.map((plan) => {
          const isSelected = selectedPlan.id === plan.id;
          const isActive = activeDietPlan?.id === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-orange-950/40 via-gray-900 to-amber-950/20 border-orange-500/60 shadow-lg shadow-orange-950/30'
                  : 'bg-gray-900/80 hover:bg-gray-850 border-gray-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 font-bold text-[10px] uppercase tracking-wider">
                    {plan.dietType.replace('_', ' ')}
                  </span>
                  {isActive && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                      <Award className="w-3 h-3" /> Active Plan
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white leading-tight">
                  {plan.name}
                </h3>
                {plan.hindiName && (
                  <span className="text-[11px] text-gray-400 block mt-0.5">{plan.hindiName}</span>
                )}
                <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                  {plan.tagline}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs">
                <span className="text-orange-400 font-extrabold">{plan.targetCalories} kcal</span>
                <span className="text-emerald-400 font-bold">{plan.targetProtein}g Protein</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Plan In-depth View */}
      {selectedPlan && (
        <div className="rounded-3xl bg-gray-900/90 border border-gray-800 overflow-hidden shadow-xl">
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-r from-orange-950/50 via-gray-900 to-amber-950/30 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 text-xs font-bold uppercase tracking-wider">
                  {selectedPlan.goal.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-400">Budget: {selectedPlan.budgetLevel.replace('_', ' ')}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{selectedPlan.name}</h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl">{selectedPlan.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="grid grid-cols-3 gap-2 text-center bg-gray-850 p-2.5 rounded-2xl border border-gray-700/80 text-xs w-full sm:w-auto">
                <div className="px-2">
                  <span className="text-gray-400 block text-[10px]">Calories</span>
                  <strong className="text-orange-400 text-sm font-bold">{selectedPlan.targetCalories}</strong>
                </div>
                <div className="px-2 border-x border-gray-750">
                  <span className="text-gray-400 block text-[10px]">Protein</span>
                  <strong className="text-emerald-400 text-sm font-bold">{selectedPlan.targetProtein}g</strong>
                </div>
                <div className="px-2">
                  <span className="text-gray-400 block text-[10px]">Carbs</span>
                  <strong className="text-cyan-400 text-sm font-bold">{selectedPlan.targetCarbs}g</strong>
                </div>
              </div>

              <button
                onClick={() => setActiveDietPlan(selectedPlan)}
                className={`w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-md ${
                  activeDietPlan?.id === selectedPlan.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white shadow-orange-500/20 active:scale-95'
                }`}
              >
                {activeDietPlan?.id === selectedPlan.id ? '✓ Current Active Plan' : 'Adopt This Diet Plan'}
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Meal-by-Meal Schedule */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span>Meal-by-Meal Schedule ({selectedPlan.meals.length} Meals)</span>
              </h3>

              <div className="space-y-3">
                {selectedPlan.meals.map((meal, idx) => {
                  const isExpanded = expandedMealIdx === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl bg-gray-850/80 border border-gray-800 overflow-hidden"
                    >
                      <div
                        onClick={() => setExpandedMealIdx(isExpanded ? null : idx)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-800/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-orange-500/15 text-orange-400 font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{meal.title}</h4>
                              <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full font-semibold">
                                {meal.suggestedTime}
                              </span>
                            </div>
                            {meal.hindiTitle && (
                              <span className="text-[11px] text-gray-400 block">{meal.hindiTitle}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right text-xs">
                            <span className="font-bold text-orange-400 block">{meal.totalCalories} kcal</span>
                            <span className="text-emerald-400 text-[11px] font-semibold">{meal.totalProtein}g Protein</span>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-4 bg-gray-900/60 border-t border-gray-800 space-y-3 animate-fade-in">
                          {/* Desi Pro Tip */}
                          {meal.desiProTip && (
                            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-200 flex items-start gap-2">
                              <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                              <span>{meal.desiProTip}</span>
                            </div>
                          )}

                          {/* Food Ingredients */}
                          <div className="space-y-2">
                            {meal.items.map((it, itemIdx) => (
                              <div
                                key={itemIdx}
                                className="p-2.5 rounded-xl bg-gray-800/60 flex items-center justify-between text-xs"
                              >
                                <div>
                                  <span className="font-bold text-white">{it.foodItem.name}</span>
                                  <span className="text-gray-400 text-[11px] block">
                                    {it.preparationNote || `${it.quantity}× ${it.foodItem.servingUnit}`}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-gray-200 block">
                                    {Math.round(it.foodItem.calories * it.quantity)} kcal
                                  </span>
                                  <span className="text-emerald-400 font-semibold text-[11px]">
                                    {(it.foodItem.protein * it.quantity).toFixed(1)}g Protein
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grocery List & Success Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Grocery List */}
              <div className="p-4 rounded-2xl bg-gray-850/60 border border-gray-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-orange-400" />
                  <span>Desi Grocery Shopping List</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {selectedPlan.groceryList.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tips for success */}
              <div className="p-4 rounded-2xl bg-gray-850/60 border border-gray-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-400" />
                  <span>Diet Adherence & Cooking Tips</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {selectedPlan.tipsForSuccess.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
