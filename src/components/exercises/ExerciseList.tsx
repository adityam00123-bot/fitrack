import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Exercise, MuscleGroup, Equipment } from '../../types/workout';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { AddExerciseModal } from './AddExerciseModal';
import { AnatomicalMuscleMap } from './AnatomicalMuscleMap';
import {
  Search,
  Plus,
  Filter,
  Dumbbell,
  Target,
  ChevronRight,
  Sparkles,
  Info,
  MapPin,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Flame,
  Play
} from 'lucide-react';

export const ExerciseList: React.FC = () => {
  const { exercises, activeWorkout, addExerciseToActiveWorkout } = useApp();

  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [activeModalExercise, setActiveModalExercise] = useState<Exercise | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(36);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(36);
  }, [search, selectedMuscle, selectedEquipment, selectedDifficulty]);

  // Compute live exercise counts per muscle group
  const exerciseCounts = useMemo(() => {
    const counts: Record<string, number> = { all: exercises.length };
    exercises.forEach((ex) => {
      counts[ex.category] = (counts[ex.category] || 0) + 1;
    });
    return counts;
  }, [exercises]);

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
    { id: 'core', label: 'Abs & Core' },
    { id: 'forearms', label: 'Forearms' }
  ];

  const equipments: { id: string; label: string }[] = [
    { id: 'all', label: 'All Gear' },
    { id: 'barbell', label: 'Barbell' },
    { id: 'dumbbell', label: 'Dumbbell' },
    { id: 'cable', label: 'Cable' },
    { id: 'machine', label: 'Machine' },
    { id: 'bodyweight', label: 'Bodyweight' },
    { id: 'kettlebell', label: 'Kettlebell' },
    { id: 'resistance_band', label: 'Bands' },
    { id: 'other', label: 'Other' }
  ];

  const difficulties = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' }
  ];

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        ex.name.toLowerCase().includes(q) ||
        ex.category.toLowerCase().includes(q) ||
        ex.equipment.toLowerCase().includes(q) ||
        (ex.secondaryMuscles && ex.secondaryMuscles.some((m) => m.toLowerCase().includes(q)));

      const matchesMuscle = selectedMuscle === 'all' || ex.category === selectedMuscle;
      const matchesEquip = selectedEquipment === 'all' || ex.equipment === selectedEquipment;
      const matchesDiff = selectedDifficulty === 'all' || ex.difficulty === selectedDifficulty;

      return matchesSearch && matchesMuscle && matchesEquip && matchesDiff;
    });
  }, [exercises, search, selectedMuscle, selectedEquipment, selectedDifficulty]);

  const visibleExercises = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <span>Exercise Library</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-rose-500/20 text-orange-400 font-extrabold border border-orange-500/30">
              {exercises.length} Exercises
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Workout.Cool interactive anatomical body heatmap & comprehensive form cues with animations
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Anatomy Map View */}
          <button
            onClick={() => setIsMapVisible((prev) => !prev)}
            className="px-3 py-2 rounded-xl bg-gray-850 hover:bg-gray-800 text-gray-300 border border-gray-750 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Target className="w-3.5 h-3.5 text-orange-400" />
            <span>{isMapVisible ? 'Hide Muscle Map' : 'Show Muscle Map'}</span>
            {isMapVisible ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Add Custom Exercise */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-2 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom</span>
          </button>
        </div>
      </div>

      {/* Interactive Workout.Cool Anatomical SVG Muscle Map */}
      {isMapVisible && (
        <AnatomicalMuscleMap
          selectedMuscle={selectedMuscle}
          onSelectMuscle={(m) => setSelectedMuscle(m)}
          exerciseCounts={exerciseCounts}
        />
      )}

      {/* Search and Filters Bar */}
      <div className="space-y-3.5 bg-gray-900/90 border border-gray-800 p-4 rounded-3xl shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search 870+ exercises by name, muscle (Chest, Lats, Quads) or gear (Barbell, Cable, Kettlebell)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-850 border border-gray-700/80 text-white text-sm focus:border-orange-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Muscle group chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {muscleGroups.map((mg) => {
            const count = exerciseCounts[mg.id] || 0;
            const isSelected = selectedMuscle === mg.id;
            return (
              <button
                key={mg.id}
                onClick={() => setSelectedMuscle(mg.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 scale-105'
                    : 'bg-gray-800/80 text-gray-400 hover:text-gray-200 hover:bg-gray-750'
                }`}
              >
                <span>{mg.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-gray-700/60 text-gray-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filters (Gear & Difficulty) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-800/80 text-xs">
          {/* Equipment filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider mr-1">Gear:</span>
            {equipments.map((eq) => (
              <button
                key={eq.id}
                onClick={() => setSelectedEquipment(eq.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedEquipment === eq.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-gray-850 text-gray-400 hover:text-gray-200'
                }`}
              >
                {eq.label}
              </button>
            ))}
          </div>

          {/* Difficulty filters */}
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider mr-1">Level:</span>
            {difficulties.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedDifficulty === diff.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-gray-850 text-gray-400 hover:text-gray-200'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between px-1 text-xs text-gray-400">
        <span>
          Showing <strong className="text-white">{Math.min(visibleCount, filtered.length)}</strong> of <strong className="text-white">{filtered.length}</strong> matching exercises
          {selectedMuscle !== 'all' && (
            <span> for <span className="text-orange-400 font-semibold capitalize">{selectedMuscle}</span></span>
          )}
        </span>

        {(selectedMuscle !== 'all' || selectedEquipment !== 'all' || selectedDifficulty !== 'all' || search) && (
          <button
            onClick={() => {
              setSelectedMuscle('all');
              setSelectedEquipment('all');
              setSelectedDifficulty('all');
              setSearch('');
            }}
            className="text-orange-400 hover:text-orange-300 font-semibold"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Exercises Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 px-4 bg-gray-900/50 rounded-3xl border border-gray-800">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No matching exercises found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
            Try adjusting your search terms, muscle category, or gear filters.
          </p>
          <button
            onClick={() => {
              setSelectedMuscle('all');
              setSelectedEquipment('all');
              setSelectedDifficulty('all');
              setSearch('');
            }}
            className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleExercises.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => setActiveModalExercise(exercise)}
              className="rounded-3xl bg-gray-900/90 border border-gray-800 hover:border-orange-500/40 p-4 sm:p-5 transition-all hover:shadow-xl hover:shadow-orange-950/20 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle top card glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/15 transition-all pointer-events-none" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-extrabold uppercase tracking-wider">
                    {exercise.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-800 font-semibold border border-gray-700/60">
                      {exercise.equipment}
                    </span>
                    {exercise.isCustom && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                        Custom
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  {exercise.imageUrl && (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-950 border border-gray-800 shrink-0 flex items-center justify-center relative group-hover:border-orange-500/30 transition-colors">
                      <img
                        src={exercise.imageUrl}
                        alt={exercise.name}
                        className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {(exercise.images && exercise.images.length > 1) && (
                        <div className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[8px] font-black text-orange-400 flex items-center gap-0.5 border border-orange-500/30">
                          <Play className="w-2 h-2 fill-orange-400" />
                          <span>GIF</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-orange-300 transition-colors leading-snug line-clamp-2">
                      {exercise.name}
                    </h3>

                    <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {exercise.instructions[0]}
                    </p>
                  </div>
                </div>

                {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-gray-500 font-semibold">Assists:</span>
                    {exercise.secondaryMuscles.map((sm, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800/80 text-gray-400 capitalize">
                        {sm}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between gap-2">
                <span className="text-[11px] text-gray-400 flex items-center gap-1 group-hover:text-orange-400 transition-colors font-medium">
                  <Info className="w-3.5 h-3.5" /> View Form Cues & Animation
                </span>

                {activeWorkout && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addExerciseToActiveWorkout(exercise);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-xs font-bold border border-orange-500/30 transition-colors flex items-center gap-1"
                  >
                    <span>+ Add to Session</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Load More */}
      {filtered.length > visibleCount && (
        <div className="text-center pt-4 pb-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + 36)}
            className="px-6 py-3 rounded-2xl bg-gray-850 hover:bg-gray-800 text-white font-extrabold text-xs border border-gray-750 transition-all shadow-md hover:border-orange-500/40 inline-flex items-center gap-2"
          >
            <span>Load More Exercises (+36)</span>
            <span className="text-gray-400 font-normal">
              ({filtered.length - visibleCount} remaining)
            </span>
          </button>
        </div>
      )}

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
