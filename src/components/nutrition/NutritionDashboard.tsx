import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MealType } from '../../types/nutrition';
import { MealLoggerModal } from './MealLogger';
import { MacroCalculatorModal } from './MacroCalculatorModal';
import {
  UtensilsCrossed,
  Droplets,
  Plus,
  Trash2,
  Calendar,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
  Info
} from 'lucide-react';

export const NutritionDashboard: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    mealLogs,
    removeFoodFromMeal,
    macroTargets,
    waterIntakeMl,
    addWater,
    resetWater
  } = useApp();

  const [activeMealLogger, setActiveMealLogger] = useState<MealType | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Filter logs for selected date
  const todaysMealLogs = mealLogs.filter(m => m.date === selectedDate);

  // Aggregate totals
  const totalCalories = todaysMealLogs.reduce((acc, m) => acc + m.totalCalories, 0);
  const totalProtein = todaysMealLogs.reduce((acc, m) => acc + m.totalProtein, 0);
  const totalCarbs = todaysMealLogs.reduce((acc, m) => acc + m.totalCarbs, 0);
  const totalFat = todaysMealLogs.reduce((acc, m) => acc + m.totalFat, 0);

  const calPercent = Math.min(100, Math.round((totalCalories / macroTargets.calories) * 100));
  const proteinPercent = Math.min(100, Math.round((totalProtein / macroTargets.protein) * 100));
  const carbsPercent = Math.min(100, Math.round((totalCarbs / macroTargets.carbs) * 100));
  const fatPercent = Math.min(100, Math.round((totalFat / macroTargets.fat) * 100));
  const waterPercent = Math.min(100, Math.round((waterIntakeMl / macroTargets.waterMl) * 100));

  // Date controls
  const handlePrevDay = () => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() - 1);
    setSelectedDate(cur.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + 1);
    setSelectedDate(cur.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  const mealSlots: { type: MealType; label: string; hindi: string; iconTime: string }[] = [
    { type: 'breakfast', label: 'Breakfast', hindi: 'नाश्ता', iconTime: '8:00 AM' },
    { type: 'morning_snack', label: 'Morning Snack', hindi: 'हल्का नाश्ता', iconTime: '11:00 AM' },
    { type: 'lunch', label: 'Lunch', hindi: 'दोपहर का भोजन', iconTime: '1:30 PM' },
    { type: 'evening_snack', label: 'Evening Snack', hindi: 'शाम का नाश्ता', iconTime: '5:00 PM' },
    { type: 'post_workout', label: 'Post-Workout Fuel', hindi: 'वर्कआउट बाद', iconTime: '7:30 PM' },
    { type: 'dinner', label: 'Dinner', hindi: 'रात का खाना', iconTime: '8:45 PM' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header & Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span>Daily Nutrition & Macros</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              Desi Macros
            </span>
          </h1>
          <p className="text-xs text-gray-400">Track protein, calories, water, and home cooked meals</p>
        </div>

        {/* Date Selector Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-gray-900 border border-gray-800 rounded-2xl p-1 shadow-sm">
            <button
              onClick={handlePrevDay}
              className="p-1.5 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              {isToday ? `Today (${selectedDate})` : selectedDate}
            </span>
            <button
              onClick={handleNextDay}
              className="p-1.5 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsCalculatorOpen(true)}
            className="p-2.5 rounded-2xl bg-gray-900 hover:bg-gray-850 border border-gray-800 text-gray-300 hover:text-orange-400 transition-colors"
            title="Recalculate Macros"
          >
            <Calculator className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Macro Rings & Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Calories Card */}
        <div className="md:col-span-4 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900 to-orange-950/40 border border-orange-500/30 p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5 mb-1">
                <Flame className="w-4 h-4" /> Calorie Balance
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white">{totalCalories}</span>
                <span className="text-sm font-semibold text-gray-400">/ {macroTargets.calories} kcal</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {macroTargets.calories - totalCalories >= 0
                  ? `${macroTargets.calories - totalCalories} calories remaining today`
                  : `${Math.abs(macroTargets.calories - totalCalories)} calories over target`}
              </p>
            </div>

            {/* Visual macro breakdown bars */}
            <div className="grid grid-cols-3 gap-3 sm:w-80">
              {/* Protein */}
              <div className="p-3 rounded-2xl bg-gray-850 border border-gray-800">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-emerald-400">Protein</span>
                  <span className="text-gray-400">{proteinPercent}%</span>
                </div>
                <div className="text-sm font-black text-white">
                  {Math.round(totalProtein)}g <span className="text-[10px] text-gray-400 font-normal">/ {macroTargets.protein}g</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${proteinPercent}%` }} />
                </div>
              </div>

              {/* Carbs */}
              <div className="p-3 rounded-2xl bg-gray-850 border border-gray-800">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-cyan-400">Carbs</span>
                  <span className="text-gray-400">{carbsPercent}%</span>
                </div>
                <div className="text-sm font-black text-white">
                  {Math.round(totalCarbs)}g <span className="text-[10px] text-gray-400 font-normal">/ {macroTargets.carbs}g</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${carbsPercent}%` }} />
                </div>
              </div>

              {/* Fats */}
              <div className="p-3 rounded-2xl bg-gray-850 border border-gray-800">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-amber-400">Fats</span>
                  <span className="text-gray-400">{fatPercent}%</span>
                </div>
                <div className="text-sm font-black text-white">
                  {Math.round(totalFat)}g <span className="text-[10px] text-gray-400 font-normal">/ {macroTargets.fat}g</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${fatPercent}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Water Tracker Widget */}
      <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/25 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Water Hydration</span>
              <span className="text-[11px] font-semibold text-cyan-400">({waterPercent}% reached)</span>
            </div>
            <span className="text-xs text-gray-400">
              {waterIntakeMl} ml logged of {macroTargets.waterMl} ml goal
            </span>
          </div>
        </div>

        {/* Quick Water Add buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => addWater(250)}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all active:scale-95"
          >
            +250 ml (Glass)
          </button>
          <button
            onClick={() => addWater(500)}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all active:scale-95"
          >
            +500 ml (Bottle)
          </button>
          <button
            onClick={resetWater}
            className="px-2.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs transition-colors"
            title="Reset"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Meals of the Day */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <UtensilsCrossed className="w-4 h-4 text-orange-400" />
          <span>Meals Logged for This Day</span>
        </h2>

        {mealSlots.map((slot) => {
          const log = todaysMealLogs.find(m => m.mealType === slot.type);
          return (
            <div
              key={slot.type}
              className="rounded-2xl bg-gray-900/90 border border-gray-800 overflow-hidden shadow-sm"
            >
              {/* Slot Header */}
              <div className="p-4 bg-gray-850/60 border-b border-gray-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{slot.label}</h3>
                    <span className="text-[11px] text-gray-400">{slot.hindi}</span>
                  </div>
                  {log && (
                    <div className="text-xs text-gray-400 mt-0.5">
                      <strong className="text-orange-400">{log.totalCalories} kcal</strong> • {log.totalProtein}g Protein • {log.totalCarbs}g Carbs • {log.totalFat}g Fat
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveMealLogger(slot.type)}
                  className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-orange-500/20 text-gray-300 hover:text-orange-400 border border-gray-700 hover:border-orange-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Food</span>
                </button>
              </div>

              {/* Logged Items */}
              {log && log.items.length > 0 ? (
                <div className="divide-y divide-gray-800/50 p-2">
                  {log.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 flex items-center justify-between text-xs hover:bg-gray-850/40 rounded-xl transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{item.foodName}</span>
                          <span className="text-gray-400 text-[11px]">
                            ({item.quantity}× {item.servingUnit})
                          </span>
                        </div>
                        {item.hindiName && (
                          <span className="text-[10px] text-gray-400 block">{item.hindiName}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="font-bold text-orange-400 block">{item.calories} kcal</span>
                          <span className="text-emerald-400 text-[11px]">{item.protein}g P</span>
                        </div>

                        <button
                          onClick={() => removeFoodFromMeal(log.id, item.id)}
                          className="p-1 rounded-lg text-gray-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-gray-500">
                  No food logged for {slot.label}. Click "+ Add Food" to record.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Meal Logger Modal */}
      {activeMealLogger && (
        <MealLoggerModal
          isOpen={!!activeMealLogger}
          mealType={activeMealLogger}
          onClose={() => setActiveMealLogger(null)}
        />
      )}

      {/* Macro Calculator Modal */}
      <MacroCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
};
