import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkoutRoutine } from '../../types/workout';
import {
  Play,
  Plus,
  Clock,
  Dumbbell,
  Trash2,
  Calendar,
  Edit3,
  Copy
} from 'lucide-react';

interface RoutineListProps {
  onOpenCreateRoutine: () => void;
  onEditRoutine?: (routine: WorkoutRoutine) => void;
}

export const RoutineList: React.FC<RoutineListProps> = ({
  onOpenCreateRoutine,
  onEditRoutine
}) => {
  const { routines, startWorkout, deleteRoutine, addRoutine, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'PPL', 'Upper/Lower', 'Full Body', 'Custom'];

  const filteredRoutines = routines.filter((r) => {
    if (selectedCategory === 'all') return true;
    return r.category === selectedCategory;
  });

  const handleDuplicate = (routine: WorkoutRoutine) => {
    addRoutine({
      name: `${routine.name} (Copy)`,
      description: routine.description,
      category: 'Custom',
      daysPerWeek: routine.daysPerWeek,
      exercises: routine.exercises.map((e) => ({ ...e }))
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Workout Routines</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30">
              {routines.length} Splits
            </span>
          </h2>
          <p className="text-xs text-slate-400">Select a pre-built split or launch a custom routine</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => startWorkout()}
            className="px-3.5 py-2 rounded-xl bg-[#161B28] hover:bg-[#1C2334] border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Dumbbell className="w-3.5 h-3.5 text-blue-400" />
            <span>Empty Workout</span>
          </button>

          <button
            onClick={onOpenCreateRoutine}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Routine</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'bg-[#121622] border border-slate-800 text-slate-400 hover:text-slate-200'
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
            className="rounded-3xl bg-[#121622] border border-slate-800/90 hover:border-blue-500/40 p-5 transition-all hover:shadow-lg hover:shadow-blue-950/20 flex flex-col justify-between group"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                    {routine.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {routine.daysPerWeek} days/wk
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Edit Routine button */}
                  {onEditRoutine && (
                    <button
                      type="button"
                      onClick={() => onEditRoutine(routine)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                      title="Edit routine"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Duplicate routine */}
                  <button
                    type="button"
                    onClick={() => handleDuplicate(routine)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                    title="Duplicate routine"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete button (if custom) */}
                  {!routine.isDefault && (
                    <button
                      type="button"
                      onClick={() => deleteRoutine(routine.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete routine"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                {routine.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                {routine.description}
              </p>

              {/* Exercises Preview Tags */}
              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Exercises ({routine.exercises.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {routine.exercises.slice(0, 4).map((ex) => (
                    <span
                      key={ex.exerciseId}
                      className="px-2 py-0.5 rounded-md bg-[#161B28] text-[11px] text-slate-300 font-medium"
                    >
                      {ex.exerciseName}
                    </span>
                  ))}
                  {routine.exercises.length > 4 && (
                    <span className="px-2 py-0.5 rounded-md bg-[#161B28] text-[11px] text-blue-400 font-medium">
                      +{routine.exercises.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Launch Workout button */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-blue-400 font-sans" />
                ~45-60 min
              </span>

              <button
                onClick={() => startWorkout(routine)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
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
