import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Dumbbell,
  Flame,
  Plus,
  Cloud,
  CheckCircle2,
  Clock,
  Sparkles,
  Calculator
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeWorkout,
    setActiveTab,
    setIsQuickAddOpen,
    setIsToolsModalOpen,
    setIsSupabaseModalOpen,
    supabaseConfig,
    mealLogs,
    selectedDate,
    macroTargets
  } = useApp();

  // Calculate calories consumed today
  const todayMeals = mealLogs.filter(m => m.date === selectedDate);
  const totalCals = todayMeals.reduce((acc, m) => acc + m.totalCalories, 0);
  const remainingCals = macroTargets.calories - totalCals;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d0f17]/95 backdrop-blur border-b border-gray-800/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('workouts')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  FI<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">TRACK</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  Desi + Wger
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">Pro Workout & Indian Diet System</p>
            </div>
          </div>
        </div>

        {/* Quick Calorie & Macro pill (desktop) */}
        <div className="hidden md:flex items-center gap-4 bg-gray-900/80 border border-gray-800 px-3.5 py-1.5 rounded-full text-xs">
          <div className="flex items-center gap-1.5 text-gray-300">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Today:</span>
            <strong className="text-white">{totalCals}</strong>
            <span className="text-gray-400">/ {macroTargets.calories} kcal</span>
          </div>
          <span className="w-1 h-3 bg-gray-700 rounded-full" />
          <div className="text-gray-400">
            <span className={remainingCals >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {remainingCals >= 0 ? `${remainingCals} kcal left` : `${Math.abs(remainingCals)} kcal over`}
            </span>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Workout live pill */}
          {activeWorkout && (
            <button
              onClick={() => setActiveTab('workouts')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold animate-pulse hover:bg-rose-500/25 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-rose-400 animate-spin" />
              <span className="hidden sm:inline">Active Workout:</span>
              <span className="max-w-[100px] truncate">{activeWorkout.routineName}</span>
            </button>
          )}

          {/* Tools & Calculators */}
          <button
            onClick={() => setIsToolsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 border border-gray-700 text-xs font-medium transition-colors"
            title="1RM & Plate Calculator"
          >
            <Calculator className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">Gym Tools</span>
          </button>

          {/* Quick Add (+) */}
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-semibold shadow-md shadow-orange-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Log Quick</span>
          </button>

          {/* Supabase status / config */}
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              supabaseConfig.isConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-gray-800/80 border-gray-700 text-gray-400 hover:text-gray-200'
            }`}
            title="Supabase Cloud Backup"
          >
            <Cloud className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">
              {supabaseConfig.isConnected ? 'Cloud Synced' : 'Supabase'}
            </span>
            {supabaseConfig.isConnected && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
