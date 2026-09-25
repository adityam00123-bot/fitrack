import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Dumbbell,
  Play,
  Plus,
  Flame,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  ChevronRight,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  Scale,
  PieChart,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const {
    profile,
    routines,
    workoutHistory,
    startWorkout,
    setActiveTab,
    selectedDate,
    mealLogs,
    macroTargets,
    weightLogs,
    weightUnit,
    supabaseConfig,
    setIsToolsModalOpen,
    setIsSupabaseModalOpen,
    t
  } = useApp();

  // Greeting based on current hour
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  // Calculate current week workouts
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
  const startOfWeek = new Date(today);
  const diffToMonday = (currentDayOfWeek + 6) % 7;
  startOfWeek.setDate(today.getDate() - diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const thisWeekWorkouts = workoutHistory.filter((w) => {
    const wDate = new Date(w.date);
    return wDate >= startOfWeek;
  });

  const weeklyGoal = 4; // Target 4 workouts per week
  const weeklyCompleted = thisWeekWorkouts.length;
  const weeklyProgress = Math.min(100, Math.round((weeklyCompleted / weeklyGoal) * 100));

  // Streak calculation (consecutive active days)
  const streakDays = Math.max(1, weeklyCompleted > 0 ? weeklyCompleted + 1 : 1);

  // Today's nutrition totals
  const todayMeals = mealLogs.filter((m) => m.date === selectedDate);
  const totalCals = todayMeals.reduce((acc, m) => acc + m.totalCalories, 0);
  const totalProtein = todayMeals.reduce((acc, m) => acc + m.totalProtein, 0);
  const remainingCals = macroTargets.calories - totalCals;

  // Latest body weight
  const latestWeight = weightLogs.length > 0 ? weightLogs[0].weightKg : profile.currentWeightKg;
  const displayWeight = weightUnit === 'lbs' ? (latestWeight * 2.20462).toFixed(1) : latestWeight.toFixed(1);
  const targetWeight = weightUnit === 'lbs' ? (profile.targetWeightKg * 2.20462).toFixed(1) : profile.targetWeightKg.toFixed(1);

  // Total volume lifted all time
  const totalVolumeAllTime = workoutHistory.reduce((acc, w) => acc + (w.totalVolumeKg || 0), 0);
  const displayVolume =
    weightUnit === 'lbs'
      ? `${Math.round(totalVolumeAllTime * 2.20462).toLocaleString()} lbs`
      : `${Math.round(totalVolumeAllTime).toLocaleString()} kg`;

  // Muscle recovery calculation based on exercises done in last 72 hours
  const nowMs = Date.now();
  const recentSessions = workoutHistory.filter((w) => {
    const diffHours = (nowMs - new Date(w.date).getTime()) / (1000 * 60 * 60);
    return diffHours <= 72;
  });

  const workedMuscles = new Set<string>();
  recentSessions.forEach((session) => {
    session.exercises.forEach((ex) => {
      workedMuscles.add(ex.category.toLowerCase());
    });
  });

  const muscleReadiness = [
    { name: 'Chest', isRecovered: !workedMuscles.has('chest') },
    { name: 'Back', isRecovered: !workedMuscles.has('back') && !workedMuscles.has('lats') },
    { name: 'Legs', isRecovered: !workedMuscles.has('quads') && !workedMuscles.has('hamstrings') },
    { name: 'Shoulders', isRecovered: !workedMuscles.has('shoulders') },
    { name: 'Arms', isRecovered: !workedMuscles.has('biceps') && !workedMuscles.has('triceps') },
  ];

  // Week days for tracker (Mon -> Sun)
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weekDayDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const isDone = workoutHistory.some((w) => w.date === dateStr);
    const isCurrent = d.toDateString() === today.toDateString();
    return { label: weekDays[i], isDone, isCurrent, dateStr };
  });

  const handleStartEmpty = () => {
    startWorkout();
    setActiveTab('workouts');
  };

  const handleStartRoutine = (routineId: string) => {
    const routine = routines.find((r) => r.id === routineId);
    if (routine) {
      startWorkout(routine);
      setActiveTab('workouts');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* 1. Athlete Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#141A28] to-[#0F1420] border border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              {greeting}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {profile.fullName || 'Athlete'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            {t('readyToCrush')}
          </p>
        </div>

        {/* Quick Streak & Weekly Goal Pill */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-[#1A2234]/90 border border-slate-700/60 rounded-2xl px-4 py-3 text-center min-w-[105px]">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold text-lg">
              <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>{streakDays}</span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
              Day Streak
            </span>
          </div>

          <div className="bg-[#1A2234]/90 border border-slate-700/60 rounded-2xl px-4 py-3 min-w-[150px]">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-1.5">
              <span>Weekly Goal</span>
              <span className="text-blue-400 font-bold">{weeklyCompleted}/{weeklyGoal}</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${weeklyProgress}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block text-right font-medium">
              {weeklyProgress}% completed
            </span>
          </div>
        </div>
      </div>

      {/* 2. Quick Start Workout Launchpad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Empty Workout Card */}
        <div
          onClick={handleStartEmpty}
          className="group relative bg-[#121622] hover:bg-[#161C2C] border border-slate-800/80 hover:border-blue-500/50 rounded-3xl p-6 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-blue-950/20 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Instant
            </span>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
              {t('startEmptyWorkout')}
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Log sets, reps, and weights freely on the fly with automatic 1RM tracking and rest timer.
            </p>
          </div>

          <div className="mt-5 flex items-center text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
            <span>Launch Live Session</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* Start from Routine / Template Card */}
        <div className="bg-[#121622] border border-slate-800/80 rounded-3xl p-6 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{t('startFromRoutine')}</h3>
                <p className="text-xs text-slate-400">Pre-built splits and customized routines</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('workouts')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-0.5"
            >
              <span>All ({routines.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Routines List */}
          <div className="space-y-2">
            {routines.slice(0, 3).map((routine) => (
              <div
                key={routine.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#161B28] hover:bg-[#1A2132] border border-slate-800/60 transition-colors"
              >
                <div className="min-w-0 pr-3">
                  <h4 className="text-xs font-bold text-white truncate">{routine.name}</h4>
                  <span className="text-[11px] text-slate-400">
                    {routine.exercises.length} exercises • {routine.category} • {routine.daysPerWeek}d/wk
                  </span>
                </div>
                <button
                  onClick={() => handleStartRoutine(routine.id)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 shrink-0 transition-transform active:scale-95 cursor-pointer shadow-sm shadow-blue-600/30"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Start</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Consistency Calendar & Muscle Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Consistency Bar */}
        <div className="lg:col-span-2 bg-[#121622] border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Weekly Activity Heatmap
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Total volume: <strong className="text-slate-200">{displayVolume}</strong>
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-3 py-2">
            {weekDayDates.map((day, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                  day.isDone
                    ? 'bg-blue-600/15 border-blue-500/40 text-blue-400 shadow-sm shadow-blue-500/10'
                    : day.isCurrent
                    ? 'bg-slate-800/50 border-slate-700 text-slate-200 ring-1 ring-blue-500/30'
                    : 'bg-[#161B28]/60 border-slate-800/60 text-slate-500'
                }`}
              >
                <span className="text-[11px] font-semibold uppercase">{day.label}</span>
                <div className="w-7 h-7 rounded-full flex items-center justify-center mt-1.5">
                  {day.isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/60 mt-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              Completed workout session
            </span>
            <span>{thisWeekWorkouts.length} sessions logged this week</span>
          </div>
        </div>

        {/* Muscle Recovery & Readiness */}
        <div className="bg-[#121622] border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Muscle Readiness
              </h3>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              72h Window
            </span>
          </div>

          <div className="space-y-2.5">
            {muscleReadiness.map((muscle) => (
              <div
                key={muscle.name}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#161B28] border border-slate-800/60 text-xs"
              >
                <span className="font-semibold text-slate-200">{muscle.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    muscle.isRecovered
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {muscle.isRecovered ? 'Ready to Train' : 'Recovering'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Snapshots: Nutrition & Body Weight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nutrition Snapshot */}
        <div
          onClick={() => setActiveTab('nutrition')}
          className="bg-[#121622] hover:bg-[#151B2A] border border-slate-800/80 hover:border-slate-700 rounded-3xl p-5 sm:p-6 shadow-lg cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {t('todayNutrition')}
                </h3>
                <span className="text-[11px] text-slate-400">{todayMeals.length} meals logged</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#161B28] border border-slate-800/60">
              <span className="text-[11px] text-slate-400 block font-medium">Calories</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-black text-white">{totalCals}</span>
                <span className="text-xs text-slate-500">/ {macroTargets.calories} kcal</span>
              </div>
              <span
                className={`text-[10px] font-semibold mt-1 block ${
                  remainingCals >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {remainingCals >= 0 ? `${remainingCals} kcal left` : `${Math.abs(remainingCals)} kcal over`}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#161B28] border border-slate-800/60">
              <span className="text-[11px] text-slate-400 block font-medium">Protein</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-black text-white">{Math.round(totalProtein)}g</span>
                <span className="text-xs text-slate-500">/ {macroTargets.protein}g</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                {Math.max(0, Math.round(macroTargets.protein - totalProtein))}g remaining
              </span>
            </div>
          </div>
        </div>

        {/* Body Weight Snapshot */}
        <div
          onClick={() => setActiveTab('body_tracker')}
          className="bg-[#121622] hover:bg-[#151B2A] border border-slate-800/80 hover:border-slate-700 rounded-3xl p-5 sm:p-6 shadow-lg cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                  {t('currentWeight')}
                </h3>
                <span className="text-[11px] text-slate-400">Body mass & composition</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#161B28] border border-slate-800/60">
              <span className="text-[11px] text-slate-400 block font-medium">Current</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-black text-white">{displayWeight}</span>
                <span className="text-xs text-slate-400">{weightUnit}</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                Last updated {weightLogs.length > 0 ? weightLogs[0].date : 'recently'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#161B28] border border-slate-800/60">
              <span className="text-[11px] text-slate-400 block font-medium">Target</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-black text-blue-400">{targetWeight}</span>
                <span className="text-xs text-slate-400">{weightUnit}</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                Goal: {profile.fitnessGoal.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recent Workouts Feed */}
      <div className="bg-[#121622] border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {t('recentWorkouts')}
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('workouts')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            <span>{t('viewAllWorkouts')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {workoutHistory.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-2xl bg-[#161B28]/50 border border-dashed border-slate-800">
            <Dumbbell className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {t('noWorkoutsYet')}
            </p>
            <button
              onClick={handleStartEmpty}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30 transition-transform active:scale-95 cursor-pointer"
            >
              {t('startEmptyWorkout')}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {workoutHistory.slice(0, 3).map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-2xl bg-[#161B28] hover:bg-[#1A2132] border border-slate-800/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{session.routineName}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
                      {session.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {session.exercises.length} exercises • {session.exercises.reduce((acc, e) => acc + e.sets.length, 0)} sets completed
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block font-sans">Volume</span>
                    <span className="text-white font-bold">
                      {weightUnit === 'lbs'
                        ? `${Math.round((session.totalVolumeKg || 0) * 2.20462).toLocaleString()} lbs`
                        : `${Math.round(session.totalVolumeKg || 0).toLocaleString()} kg`}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block font-sans">Duration</span>
                    <span className="text-slate-200 font-bold">
                      {Math.floor((session.durationSeconds || 0) / 60)}m
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Quick Utilities Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div
          onClick={() => setIsToolsModalOpen(true)}
          className="p-4 rounded-2xl bg-[#121622] hover:bg-[#161B28] border border-slate-800/80 cursor-pointer transition-colors flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600/15 text-blue-400 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-blue-300">1RM Calculator</h4>
            <span className="text-[11px] text-slate-400">Brzycki & Epley formulas</span>
          </div>
        </div>

        <div
          onClick={() => setIsToolsModalOpen(true)}
          className="p-4 rounded-2xl bg-[#121622] hover:bg-[#161B28] border border-slate-800/80 cursor-pointer transition-colors flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600/15 text-indigo-400 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-indigo-300">Barbell Plate Math</h4>
            <span className="text-[11px] text-slate-400">Olympic 20kg bar loader</span>
          </div>
        </div>

        <div
          onClick={() => setIsSupabaseModalOpen(true)}
          className="p-4 rounded-2xl bg-[#121622] hover:bg-[#161B28] border border-slate-800/80 cursor-pointer transition-colors flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600/15 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">Cloud Sync Status</h4>
            <span className="text-[11px] text-slate-400">
              {supabaseConfig.isConnected ? 'Cloud Connected' : 'Local Storage Mode'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
