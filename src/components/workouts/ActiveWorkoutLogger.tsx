import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Exercise } from '../../types/workout';
import {
  Clock,
  Plus,
  Trash2,
  Check,
  ChevronDown,
  Sparkles,
  Trophy,
  Search,
  X,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ActiveWorkoutLogger: React.FC = () => {
  const {
    activeWorkout,
    exercises,
    updateSet,
    toggleSetCompleted,
    addSetToExercise,
    removeSetFromExercise,
    addExerciseToActiveWorkout,
    removeExerciseFromActiveWorkout,
    finishWorkout,
    cancelWorkout,
    startRestTimer
  } = useApp();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completedSummary, setCompletedSummary] = useState<{
    volume: number;
    sets: number;
    reps: number;
    duration: number;
  } | null>(null);

  // Live timer tick
  useEffect(() => {
    if (!activeWorkout) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setElapsedSeconds(Math.floor((now - activeWorkout.startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout]);

  if (!activeWorkout) return null;

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      return `${hrs}:${(mins % 60).toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    const finished = finishWorkout();
    if (finished) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
      setCompletedSummary({
        volume: finished.totalVolumeKg,
        sets: finished.totalSets,
        reps: finished.totalReps,
        duration: finished.durationSeconds
      });
    }
  };

  // Filter exercises for the picker
  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || ex.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Active Session Header Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-900 to-orange-950/40 border border-orange-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              <span className="text-xs uppercase font-bold tracking-wider text-rose-400">Live Workout Session</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {activeWorkout.routineName}
            </h1>
          </div>

          {/* Live Timer and Quick Rest launch */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/90 border border-gray-700 text-white font-mono text-lg font-bold">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>

            <button
              onClick={() => startRestTimer(90)}
              className="px-3 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5" /> 90s Rest
            </button>
          </div>
        </div>
      </div>

      {/* Exercises in Session */}
      <div className="space-y-4">
        {activeWorkout.exercises.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-gray-800 bg-gray-900/40">
            <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-200">No exercises added yet</h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto mt-1 mb-4">
              Add your first exercise to start recording weights, reps, and RPE for each set.
            </p>
            <button
              onClick={() => setIsExercisePickerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-semibold text-sm shadow-md transition-all"
            >
              <Plus className="w-4 h-4" /> Add Exercise
            </button>
          </div>
        ) : (
          activeWorkout.exercises.map((ex, exIdx) => (
            <div
              key={ex.exerciseId}
              className="rounded-2xl bg-gray-900/90 border border-gray-800 overflow-hidden shadow-md"
            >
              {/* Exercise Header */}
              <div className="p-4 bg-gray-850/60 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 font-bold text-xs flex items-center justify-center">
                    {exIdx + 1}
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-white">{ex.exerciseName}</h2>
                    <span className="text-[11px] uppercase tracking-wider text-orange-400 font-semibold">
                      {ex.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeExerciseFromActiveWorkout(ex.exerciseId)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove exercise"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Sets Table */}
              <div className="p-3 sm:p-4 overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-800/80 font-semibold">
                      <th className="pb-2 pl-2 w-12">SET</th>
                      <th className="pb-2">KG (WEIGHT)</th>
                      <th className="pb-2">REPS</th>
                      <th className="pb-2 hidden sm:table-cell">RPE</th>
                      <th className="pb-2 text-center w-16">DONE</th>
                      <th className="pb-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {ex.sets.map((s) => (
                      <tr
                        key={s.id}
                        className={`transition-colors ${
                          s.completed ? 'bg-emerald-950/20 text-emerald-200' : 'hover:bg-gray-800/30'
                        }`}
                      >
                        <td className="py-2.5 pl-2 font-bold font-mono text-gray-400">
                          {s.setNumber}
                        </td>

                        {/* Weight input */}
                        <td className="py-2 pr-2">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="0.5"
                              value={s.weight === 0 ? '' : s.weight}
                              onChange={(e) =>
                                updateSet(ex.exerciseId, s.id, {
                                  weight: parseFloat(e.target.value) || 0
                                })
                              }
                              placeholder="0"
                              className="w-16 sm:w-20 px-2.5 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-white font-mono font-bold text-center focus:border-orange-500 focus:outline-none"
                            />
                            <span className="text-[11px] text-gray-500">kg</span>
                          </div>
                        </td>

                        {/* Reps input */}
                        <td className="py-2 pr-2">
                          <input
                            type="number"
                            value={s.reps === 0 ? '' : s.reps}
                            onChange={(e) =>
                              updateSet(ex.exerciseId, s.id, {
                                reps: parseInt(e.target.value) || 0
                              })
                            }
                            placeholder="0"
                            className="w-14 sm:w-16 px-2.5 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-white font-mono font-bold text-center focus:border-orange-500 focus:outline-none"
                          />
                        </td>

                        {/* RPE input */}
                        <td className="py-2 pr-2 hidden sm:table-cell">
                          <select
                            value={s.rpe || ''}
                            onChange={(e) =>
                              updateSet(ex.exerciseId, s.id, {
                                rpe: parseFloat(e.target.value) || undefined
                              })
                            }
                            className="px-2 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-xs focus:border-orange-500 focus:outline-none"
                          >
                            <option value="">RPE -</option>
                            <option value="6">6 (Easy)</option>
                            <option value="7">7 (3 reps left)</option>
                            <option value="8">8 (2 reps left)</option>
                            <option value="9">9 (1 rep left)</option>
                            <option value="10">10 (Max / Failure)</option>
                          </select>
                        </td>

                        {/* Set Complete Checkmark Button */}
                        <td className="py-2 text-center">
                          <button
                            onClick={() => toggleSetCompleted(ex.exerciseId, s.id)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-all ${
                              s.completed
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                                : 'bg-gray-800 hover:bg-gray-750 text-gray-500 border border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </td>

                        {/* Delete set */}
                        <td className="py-2 text-right pr-2">
                          <button
                            onClick={() => removeSetFromExercise(ex.exerciseId, s.id)}
                            className="text-gray-600 hover:text-rose-400 transition-colors p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Add Set Button */}
                <div className="mt-3 pt-2 border-t border-gray-800 flex justify-end">
                  <button
                    onClick={() => addSetToExercise(ex.exerciseId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-750 text-gray-300 hover:text-white text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-orange-400" />
                    <span>Add Set</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Footer Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-800">
        <button
          onClick={() => setIsExercisePickerOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-750 border border-gray-700 text-white font-semibold text-sm transition-all"
        >
          <Plus className="w-4 h-4 text-orange-400" />
          <span>Add Another Exercise</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              if (window.confirm('Discard this workout? Recorded sets will not be saved.')) {
                cancelWorkout();
              }
            }}
            className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-gray-900 hover:bg-rose-950/40 border border-gray-800 hover:border-rose-800 text-gray-400 hover:text-rose-400 text-sm font-semibold transition-all"
          >
            Discard
          </button>

          <button
            onClick={handleFinish}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
          >
            <Trophy className="w-4 h-4" />
            <span>Finish Workout</span>
          </button>
        </div>
      </div>

      {/* Exercise Picker Modal */}
      {isExercisePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Select Exercise</h3>
                <p className="text-xs text-gray-400">Choose an exercise to add to your active workout</p>
              </div>
              <button
                onClick={() => setIsExercisePickerOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Category Filter */}
            <div className="p-4 border-b border-gray-800 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exercise (e.g. Bench, Squat, Curl)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                {['all', 'chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'core'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg font-semibold capitalize whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  onClick={() => {
                    addExerciseToActiveWorkout(exercise);
                    setIsExercisePickerOpen(false);
                  }}
                  className="p-3 rounded-xl bg-gray-850 hover:bg-orange-500/10 border border-gray-800 hover:border-orange-500/40 flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-orange-300">
                      {exercise.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                      <span className="capitalize text-orange-400 font-semibold">{exercise.category}</span>
                      <span>•</span>
                      <span className="capitalize">{exercise.equipment}</span>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg bg-gray-800 group-hover:bg-orange-500 text-gray-300 group-hover:text-white transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Finished Workout Summary Modal */}
      {completedSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-emerald-500/40 rounded-3xl w-full max-w-md p-6 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
              <Trophy className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-white">Workout Crushed!</h2>
            <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mt-1">
              Shabash! Great consistency today
            </p>

            <div className="grid grid-cols-2 gap-3 my-6">
              <div className="p-3 rounded-2xl bg-gray-800/60 border border-gray-700/80">
                <span className="text-[11px] text-gray-400 block">Total Volume</span>
                <span className="text-xl font-black text-white">{completedSummary.volume} kg</span>
              </div>
              <div className="p-3 rounded-2xl bg-gray-800/60 border border-gray-700/80">
                <span className="text-[11px] text-gray-400 block">Duration</span>
                <span className="text-xl font-black text-white">{formatTimer(completedSummary.duration)}</span>
              </div>
              <div className="p-3 rounded-2xl bg-gray-800/60 border border-gray-700/80">
                <span className="text-[11px] text-gray-400 block">Completed Sets</span>
                <span className="text-xl font-black text-white">{completedSummary.sets}</span>
              </div>
              <div className="p-3 rounded-2xl bg-gray-800/60 border border-gray-700/80">
                <span className="text-[11px] text-gray-400 block">Total Reps</span>
                <span className="text-xl font-black text-white">{completedSummary.reps}</span>
              </div>
            </div>

            <button
              onClick={() => setCompletedSummary(null)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
