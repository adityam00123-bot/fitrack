import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveWorkoutLogger } from './ActiveWorkoutLogger';
import { RoutineList } from './RoutineList';
import { WorkoutHistory } from './WorkoutHistory';
import { RoutineEditorModal } from './RoutineEditorModal';
import { WorkoutRoutine } from '../../types/workout';
import {
  Dumbbell,
  History,
  TrendingUp,
  Flame,
  Plus,
  Zap,
  Layers
} from 'lucide-react';

export const WorkoutDashboard: React.FC = () => {
  const { activeWorkout, workoutHistory, startWorkout, weightUnit, t } = useApp();
  const [subTab, setSubTab] = useState<'routines' | 'history'>('routines');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [routineToEdit, setRoutineToEdit] = useState<WorkoutRoutine | null>(null);

  // If a workout session is currently active, render the live logger directly
  if (activeWorkout) {
    return <ActiveWorkoutLogger />;
  }

  // Calculate high-level stats
  const totalWorkouts = workoutHistory.length;
  const totalVolume = workoutHistory.reduce((acc, w) => acc + (w.totalVolumeKg || 0), 0);
  const displayVolume =
    weightUnit === 'lbs'
      ? `${Math.round(totalVolume * 2.20462).toLocaleString()} lbs`
      : `${Math.round(totalVolume).toLocaleString()} kg`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Sleek Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#141A28] to-[#0F1420] border border-slate-800/80 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-md bg-blue-600/20 text-blue-400">
              <Zap className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Gym Logger & Progression
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Workout Session Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 font-medium leading-relaxed">
            Execute routines, record working sets and RPE, monitor rest intervals, and track progressive overload.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => startWorkout()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Dumbbell className="w-4 h-4 text-white" />
              <span>{t('startEmptyWorkout')}</span>
            </button>

            <button
              onClick={() => {
                setRoutineToEdit(null);
                setIsEditorOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#1A2132] hover:bg-[#20293E] border border-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-400" />
              <span>{t('createRoutine')}</span>
            </button>
          </div>
        </div>

        {/* High-level stats counter on right */}
        <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 items-center gap-6">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
              Completed
            </span>
            <span className="text-2xl font-black text-white">{totalWorkouts}</span>
            <span className="text-xs text-slate-400 block">sessions</span>
          </div>
          <div className="w-px h-10 bg-slate-800" />
          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
              Total Tonnage
            </span>
            <span className="text-2xl font-black text-blue-400">{displayVolume}</span>
            <span className="text-xs text-slate-400 block">lifted</span>
          </div>
        </div>
      </div>

      {/* Sub-navigation bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('routines')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'routines'
                ? 'bg-blue-600/15 border border-blue-500/30 text-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t('routines')}</span>
          </button>

          <button
            onClick={() => setSubTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'history'
                ? 'bg-blue-600/15 border border-blue-500/30 text-blue-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Workout History ({workoutHistory.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {subTab === 'routines' ? (
        <RoutineList
          onOpenCreateRoutine={() => {
            setRoutineToEdit(null);
            setIsEditorOpen(true);
          }}
          onEditRoutine={(r) => {
            setRoutineToEdit(r);
            setIsEditorOpen(true);
          }}
        />
      ) : (
        <WorkoutHistory />
      )}

      {/* Routine Creator / Editor Modal */}
      <RoutineEditorModal
        isOpen={isEditorOpen}
        routineToEdit={routineToEdit}
        onClose={() => {
          setIsEditorOpen(false);
          setRoutineToEdit(null);
        }}
      />
    </div>
  );
};
