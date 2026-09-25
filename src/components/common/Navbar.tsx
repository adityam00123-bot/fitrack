import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Dumbbell,
  Flame,
  Plus,
  Cloud,
  CheckCircle2,
  Clock,
  Globe,
  ChevronDown,
  Calculator,
  Scale
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../../i18n/translations';

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
    macroTargets,
    language,
    setLanguage,
    weightUnit,
    setWeightUnit,
    t
  } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate calories consumed today
  const todayMeals = mealLogs.filter((m) => m.date === selectedDate);
  const totalCals = todayMeals.reduce((acc, m) => acc + m.totalCalories, 0);
  const remainingCals = macroTargets.calories - totalCals;

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0d14]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-white">
                  FIT<span className="text-blue-500">RACK</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block font-medium">
                Professional Fitness & Nutrition System
              </p>
            </div>
          </div>
        </div>

        {/* Quick Calorie & Macro pill (desktop) */}
        <div className="hidden md:flex items-center gap-4 bg-[#121622] border border-slate-800/80 px-3.5 py-1.5 rounded-full text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Calories:</span>
            <strong className="text-white font-mono">{totalCals}</strong>
            <span className="text-slate-500">/ {macroTargets.calories} kcal</span>
          </div>
          <span className="w-1 h-3 bg-slate-700 rounded-full" />
          <div className="text-xs">
            <span className={remainingCals >= 0 ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
              {remainingCals >= 0 ? `${remainingCals} kcal remaining` : `${Math.abs(remainingCals)} kcal over`}
            </span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Active Workout Live Pill */}
          {activeWorkout && (
            <button
              onClick={() => setActiveTab('workouts')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs font-semibold animate-pulse hover:bg-blue-600/30 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-blue-400 animate-spin" />
              <span className="hidden sm:inline">Active:</span>
              <span className="max-w-[90px] truncate">{activeWorkout.routineName}</span>
            </button>
          )}

          {/* KG / LBS Unit Switcher */}
          <button
            onClick={() => setWeightUnit(weightUnit === 'kg' ? 'lbs' : 'kg')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#121622] hover:bg-[#161B28] border border-slate-800 text-xs font-bold text-slate-300 transition-colors"
            title="Toggle weight unit"
          >
            <Scale className="w-3.5 h-3.5 text-slate-400" />
            <span className="uppercase text-[11px] text-blue-400">{weightUnit}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#121622] hover:bg-[#161B28] border border-slate-800 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              title="Select Language"
            >
              <span className="text-sm leading-none">{currentLang.flag}</span>
              <span className="hidden sm:inline text-xs">{currentLang.code.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-[#121622] border border-slate-700/80 rounded-2xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Select Language
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                      language === lang.code
                        ? 'bg-blue-600/20 text-blue-400 font-bold'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                    {language === lang.code && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Gym Tools */}
          <button
            onClick={() => setIsToolsModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#121622] hover:bg-[#161B28] text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
            title="1RM & Plate Calculator"
          >
            <Calculator className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden xl:inline">Tools</span>
          </button>

          {/* Quick Add Button */}
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log</span>
          </button>

          {/* Supabase Status Button */}
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              supabaseConfig.isConnected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-[#121622] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Supabase Cloud Synchronization"
          >
            <Cloud className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline text-[11px]">
              {supabaseConfig.isConnected ? 'Cloud' : 'Backup'}
            </span>
            {supabaseConfig.isConnected && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
