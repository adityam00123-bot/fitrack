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
  Coins,
  TrendingUp,
  PieChart,
  Copy,
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
  const totalCost = todaysMealLogs.reduce((acc, m) => acc + (m.totalCost || 0), 0);

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

  // Helper for Circular SVG Progress Rings
  const renderCircleRing = (percent: number, radius: number, strokeWidth: number, strokeColor: string, bgColor = '#1f2937') => {
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

    return (
      <>
        {/* Background track */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        {/* Active progress */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          transform="rotate(-90 70 70)"
        />
      </>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header & Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span>Daily Nutrition &amp; Macros</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              Desi Macros
            </span>
          </h1>
          <p className="text-xs text-gray-400">Track calories, protein, carbs, fats, water, and Mandi costs</p>
        </div>

        {/* Date Selector Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-gray-900 border border-gray-800 rounded-2xl p-1 shadow-sm">
            <button
              onClick={handlePrevDay}
              className="p-1.5 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              title="Previous Day"
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
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsCalculatorOpen(true)}
            className="p-2.5 rounded-2xl bg-gray-900 hover:bg-gray-850 border border-gray-800 text-gray-300 hover:text-orange-400 transition-colors"
            title="Recalculate Macros & TDEE"
          >
            <Calculator className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Macro Card with Concentric Rings + Stats */}
      <div className="rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900 to-orange-950/40 border border-orange-500/30 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Concentric Macro Rings */}
          <div className="flex items-center gap-5">
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg width="140" height="140" viewBox="0 0 140 140" className="transform">
                {/* Calories Ring (Outer: R=56) */}
                {renderCircleRing(calPercent, 56, 7, '#f97316')}
                {/* Protein Ring (R=44) */}
                {renderCircleRing(proteinPercent, 44, 7, '#10b981')}
                {/* Carbs Ring (R=32) */}
                {renderCircleRing(carbsPercent, 32, 7, '#06b6d4')}
                {/* Fats Ring (Inner: R=20) */}
                {renderCircleRing(fatPercent, 20, 6, '#f59e0b')}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <Flame className="w-5 h-5 text-orange-400 mb-0.5" />
                <span className="text-xs font-black text-white">{calPercent}%</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5 mb-1">
                <Flame className="w-3.5 h-3.5" /> Daily Calorie Goal
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white">{totalCalories}</span>
                <span className="text-sm font-semibold text-gray-400">/ {macroTargets.calories} kcal</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {macroTargets.calories - totalCalories >= 0
                  ? `${macroTargets.calories - totalCalories} kcal remaining today`
                  : `${Math.abs(macroTargets.calories - totalCalories)} kcal over target`}
              </p>

              {/* Mandi Cost Indicator */}
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-300 text-xs font-bold">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>Today&apos;s Mandi Cost: ₹{totalCost.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Right: Individual Macro Cards */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-96">
            {/* Protein */}
            <div className="p-3.5 rounded-2xl bg-gray-850/90 border border-emerald-500/25 shadow-sm">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-emerald-400">Protein</span>
                <span className="text-gray-400 font-semibold">{proteinPercent}%</span>
              </div>
              <div className="text-base font-black text-white">
                {Math.round(totalProtein)}g
              </div>
              <span className="text-[10px] text-gray-400 block mb-2">Goal: {macroTargets.protein}g</span>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${proteinPercent}%` }} />
              </div>
            </div>

            {/* Carbs */}
            <div className="p-3.5 rounded-2xl bg-gray-850/90 border border-cyan-500/25 shadow-sm">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-cyan-400">Carbs</span>
                <span className="text-gray-400 font-semibold">{carbsPercent}%</span>
              </div>
              <div className="text-base font-black text-white">
                {Math.round(totalCarbs)}g
              </div>
              <span className="text-[10px] text-gray-400 block mb-2">Goal: {macroTargets.carbs}g</span>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full transition-all duration-500" style={{ width: `${carbsPercent}%` }} />
              </div>
            </div>

            {/* Fats */}
            <div className="p-3.5 rounded-2xl bg-gray-850/90 border border-amber-500/25 shadow-sm">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-amber-400">Fats</span>
                <span className="text-gray-400 font-semibold">{fatPercent}%</span>
              </div>
              <div className="text-base font-black text-white">
                {Math.round(totalFat)}g
              </div>
              <span className="text-[10px] text-gray-400 block mb-2">Goal: {macroTargets.fat}g</span>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${fatPercent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Water Tracker Widget */}
      <div className="p-4 sm:p-5 rounded-3xl bg-cyan-950/20 border border-cyan-500/25 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Water Hydration</span>
              <span className="text-[11px] font-bold text-cyan-400">({waterPercent}% reached)</span>
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
            className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all active:scale-95"
          >
            +250 ml (Glass)
          </button>
          <button
            onClick={() => addWater(500)}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all active:scale-95"
          >
            +500 ml (Bottle)
          </button>
          <button
            onClick={resetWater}
            className="px-2.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs transition-colors"
            title="Reset Water Counter"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Meals of the Day */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-orange-400" />
            <span>Meals Logged for This Day</span>
          </h2>
          <span className="text-xs text-gray-400 font-medium">
            {todaysMealLogs.reduce((acc, m) => acc + m.items.length, 0)} items recorded
          </span>
        </div>

        {mealSlots.map((slot) => {
          const log = todaysMealLogs.find(m => m.mealType === slot.type);
          return (
            <div
              key={slot.type}
              className="rounded-3xl bg-gray-900/90 border border-gray-800 overflow-hidden shadow-sm"
            >
              {/* Slot Header */}
              <div className="p-4 bg-gray-850/60 border-b border-gray-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{slot.label}</h3>
                    <span className="text-[11px] text-gray-400">{slot.hindi}</span>
                  </div>
                  {log && (
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2 flex-wrap">
                      <strong className="text-orange-400">{log.totalCalories} kcal</strong>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">{log.totalProtein}g Protein</span>
                      <span>•</span>
                      <span>{log.totalCarbs}g Carbs</span>
                      <span>•</span>
                      <span>{log.totalFat}g Fat</span>
                      {log.totalCost !== undefined && log.totalCost > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-amber-400 font-bold">₹{log.totalCost.toFixed(1)}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveMealLogger(slot.type)}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-800 hover:bg-orange-500/20 text-gray-300 hover:text-orange-400 border border-gray-700 hover:border-orange-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-95"
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
                      className="p-2.5 flex items-center justify-between text-xs hover:bg-gray-850/40 rounded-2xl transition-colors"
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
                          <span className="text-emerald-400 text-[11px] font-semibold">{item.protein}g P</span>
                        </div>

                        {item.estimatedCost !== undefined && item.estimatedCost > 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/20">
                            ₹{item.estimatedCost.toFixed(1)}
                          </span>
                        )}

                        <button
                          onClick={() => removeFoodFromMeal(log.id, item.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-5 text-center text-xs text-gray-500">
                  No food logged for {slot.label}. Click &ldquo;+ Add Food&rdquo; to record.
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
