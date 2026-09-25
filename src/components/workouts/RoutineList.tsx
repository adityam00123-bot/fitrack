import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkoutRoutine } from '../../types/workout';
import {
  Play,
  Plus,
  Flame,
  Clock,
  Dumbbell,
  ChevronRight,
  Trash2,
  Calendar
} from 'lucide-react';

interface RoutineListProps {
  onOpenCreateRoutine: () => void;
}

export const RoutineList: React.FC<RoutineListProps> = ({ onOpenCreateRoutine }) => {
  const { routines, startWorkout, deleteRoutine } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'PPL', 'Upper/Lower', 'Desi Strength', 'Custom'];

  const filteredRoutines = routines.filter(r => {
    if (selectedCategory === 'all') return true;
    return r.category === selectedCategory;
  });

  return (
    <div className="space-y-4">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Workout Routines</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-semibold border border-orange-500/30">
              {routines.length} Splits
            </span>
          </h2>
          <p className="text-xs text-gray-400">Select a pre-built split or launch a custom routine</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => startWorkout()}
            className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-750 border border-gray-700 text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Dumbbell className="w-3.5 h-3.5 text-orange-400" />
            <span>Empty Workout</span>
          </button>

          <button
            onClick={onOpenCreateRoutine}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Routine</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-semibold capitalize whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRoutines.map((routine) => (
          <div
            key={routine.id}
            className="rounded-2xl bg-gray-900/90 border border-gray-800/90 hover:border-orange-500/40 p-4 transition-all hover:shadow-lg hover:shadow-orange-950/20 flex flex-col justify-between group"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-wider">
                    {routine.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {routine.daysPerWeek} days/wk
                  </span>
                </div>

                {!routine.isDefault && (
                  <button
                    onClick={() => deleteRoutine(routine.id)}
                    className="text-gray-500 hover:text-rose-400 p-1 rounded transition-colors"
                    title="Delete routine"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-white group-hover:text-orange-300 transition-colors">
                {routine.name}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                {routine.description}
              </p>

              {/* Exercises Preview Tags */}
              <div className="mt-3 pt-3 border-t border-gray-800/70">
                <span className="text-[11px] font-semibold text-gray-400 block mb-1.5">
                  Exercises ({routine.exercises.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {routine.exercises.slice(0, 4).map((ex) => (
                    <span
                      key={ex.exerciseId}
                      className="px-2 py-0.5 rounded-md bg-gray-800 text-[11px] text-gray-300 font-medium"
                    >
                      {ex.exerciseName}
                    </span>
                  ))}
                  {routine.exercises.length > 4 && (
                    <span className="px-2 py-0.5 rounded-md bg-gray-800 text-[11px] text-orange-400 font-medium">
                      +{routine.exercises.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Launch Workout button */}
            <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                ~45-60 min
              </span>

              <button
                onClick={() => startWorkout(routine)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Routine</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
