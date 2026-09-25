import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Exercise, MuscleGroup, Equipment } from '../../types/workout';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { AddExerciseModal } from './AddExerciseModal';
import {
  Search,
  Plus,
  Filter,
  Dumbbell,
  Target,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';

export const ExerciseList: React.FC = () => {
  const { exercises, activeWorkout, addExerciseToActiveWorkout } = useApp();

  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [activeModalExercise, setActiveModalExercise] = useState<Exercise | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const muscleGroups = [
    { id: 'all', label: 'All Muscles' },
    { id: 'chest', label: 'Chest' },
    { id: 'back', label: 'Back & Lats' },
    { id: 'shoulders', label: 'Shoulders' },
    { id: 'biceps', label: 'Biceps' },
    { id: 'triceps', label: 'Triceps' },
    { id: 'quads', label: 'Quads' },
    { id: 'hamstrings', label: 'Hamstrings' },
    { id: 'glutes', label: 'Glutes' },
    { id: 'calves', label: 'Calves' },
    { id: 'core', label: 'Abs & Core' }
  ];

  const equipments = [
    { id: 'all', label: 'All Gear' },
    { id: 'barbell', label: 'Barbell' },
    { id: 'dumbbell', label: 'Dumbbell' },
    { id: 'cable', label: 'Cable' },
    { id: 'machine', label: 'Machine' },
    { id: 'bodyweight', label: 'Bodyweight' }
  ];

  const filtered = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase()) ||
                          ex.category.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = selectedMuscle === 'all' || ex.category === selectedMuscle;
    const matchesEquip = selectedEquipment === 'all' || ex.equipment === selectedEquipment;
    return matchesSearch && matchesMuscle && matchesEquip;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span>Exercise Library</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
              {exercises.length} Exercises
            </span>
          </h1>
          <p className="text-xs text-gray-400">Complete Wger exercise catalog with muscle diagrams & form cues</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Exercise</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-3 bg-gray-900/90 border border-gray-800 p-4 rounded-2xl">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search exercises by name or muscle group (e.g. Incline Bench, Squat, Pull-Up)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:border-orange-500 focus:outline-none"
          />
        </div>

        {/* Muscle group chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
          {muscleGroups.map((mg) => (
            <button
              key={mg.id}
              onClick={() => setSelectedMuscle(mg.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                selectedMuscle === mg.id
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-200'
              }`}
            >
              {mg.label}
            </button>
          ))}
        </div>

        {/* Equipment chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-gray-800 text-xs">
          <span className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider mr-1">Gear:</span>
          {equipments.map((eq) => (
            <button
              key={eq.id}
              onClick={() => setSelectedEquipment(eq.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedEquipment === eq.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-gray-800/60 text-gray-400 hover:text-gray-200'
              }`}
            >
              {eq.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map((exercise) => (
          <div
            key={exercise.id}
            onClick={() => setActiveModalExercise(exercise)}
            className="rounded-2xl bg-gray-900/90 border border-gray-800 hover:border-orange-500/40 p-4 transition-all hover:shadow-lg hover:shadow-orange-950/20 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-wider">
                  {exercise.category}
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider px-2 py-0.5 rounded bg-gray-800 font-semibold">
                  {exercise.equipment}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-orange-300 transition-colors">
                {exercise.name}
              </h3>

              <p className="text-xs text-gray-400 line-clamp-2 mt-1.5">
                {exercise.instructions[0]}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between">
              <span className="text-[11px] text-gray-400 flex items-center gap-1 group-hover:text-orange-400 transition-colors font-medium">
                <Info className="w-3.5 h-3.5" /> View Form Cues
              </span>

              {activeWorkout && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addExerciseToActiveWorkout(exercise);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-xs font-bold border border-orange-500/30 transition-colors"
                >
                  + Add to Session
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        exercise={activeModalExercise}
        onClose={() => setActiveModalExercise(null)}
        onAddToWorkout={activeWorkout ? (ex) => addExerciseToActiveWorkout(ex) : undefined}
      />

      {/* Add Custom Exercise Modal */}
      <AddExerciseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
