import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveWorkoutLogger } from './ActiveWorkoutLogger';
import { RoutineList } from './RoutineList';
import { WorkoutHistory } from './WorkoutHistory';
import { RoutineEditorModal } from './RoutineEditorModal';
import {
  Dumbbell,
  History,
  TrendingUp,
  Sparkles,
  Trophy,
  Flame,
  Plus
} from 'lucide-react';

export const WorkoutDashboard: React.FC = () => {
  const { activeWorkout, workoutHistory, startWorkout } = useApp();
  const [subTab, setSubTab] = useState<'routines' | 'history'>('routines');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // If a workout session is currently active, render the live logger directly!
  if (activeWorkout) {
    return <ActiveWorkoutLogger />;
  }

  // Calculate high-level stats
  const totalWorkouts = workoutHistory.length;
  const totalVolume = workoutHistory.reduce((acc, w) => acc + w.totalVolumeKg, 0);

  return (
    <div className="space-y-6">
      {/* Hero Banner with Quick Start */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 p-6 sm:p-8 text-white shadow-xl shadow-orange-950/20">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm text-white">
              <Flame className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-100">
              Desi Iron Mode • Wger Clone
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
            Ready to Lift Today, Bhai?
          </h1>
          <p className="text-sm sm:text-base text-white/90 mb-6 font-medium">
            Track weights, reps, rest timer, and volume progression with zero distraction.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => startWorkout()}
              className="px-5 py-3 rounded-2xl bg-white text-gray-900 hover:bg-orange-50 font-bold text-sm shadow-lg shadow-black/20 flex items-center gap-2 active:scale-95 transition-all"
            >
              <Dumbbell className="w-4 h-4 text-orange-600" />
              <span>Start Free Workout</span>
            </button>

            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-4 py-3 rounded-2xl bg-black/30 hover:bg-black/40 border border-white/25 text-white font-semibold text-sm backdrop-blur-sm flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Routine</span>
            </button>
          </div>
        </div>

        {/* Athletic Background Accents */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none flex items-center justify-end pr-4">
          <Dumbbell className="w-72 h-72 transform rotate-12" />
        </div>
      </div>

      {/* Sub navigation bar */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('routines')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              subTab === 'routines'
                ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Routines & Splits</span>
          </button>

          <button
            onClick={() => setSubTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              subTab === 'history'
                ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Workout History ({workoutHistory.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {subTab === 'routines' ? (
        <RoutineList onOpenCreateRoutine={() => setIsEditorOpen(true)} />
      ) : (
        <WorkoutHistory />
      )}

      {/* Routine Creator Modal */}
      <RoutineEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </div>
  );
};
