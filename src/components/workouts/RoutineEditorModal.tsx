import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RoutineExercise, WorkoutRoutine } from '../../types/workout';
import {
  X,
  Plus,
  Trash2,
  Search,
  Dumbbell,
  ChevronUp,
  ChevronDown,
  Clock,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';

interface RoutineEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  routineToEdit?: WorkoutRoutine | null;
}

const REST_PRESETS = [45, 60, 90, 120, 180];

export const RoutineEditorModal: React.FC<RoutineEditorModalProps> = ({
  isOpen,
  onClose,
  routineToEdit
}) => {
  const { exercises, addRoutine, updateRoutine } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'PPL' | 'Upper/Lower' | 'Bro Split' | 'Full Body' | 'Desi Strength' | 'Custom'>('Custom');
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [selectedExercises, setSelectedExercises] = useState<RoutineExercise[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterMuscle, setFilterMuscle] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      if (routineToEdit) {
        setName(routineToEdit.name);
        setDescription(routineToEdit.description || '');
        setCategory(routineToEdit.category || 'Custom');
        setDaysPerWeek(routineToEdit.daysPerWeek || 4);
        setSelectedExercises([...routineToEdit.exercises]);
      } else {
        setName('');
        setDescription('');
        setCategory('Custom');
        setDaysPerWeek(4);
        setSelectedExercises([]);
      }
      setSearch('');
      setFilterMuscle('all');
    }
  }, [isOpen, routineToEdit]);

  if (!isOpen) return null;

  const handleAddExercise = (exerciseId: string) => {
    const ex = exercises.find(e => e.id === exerciseId);
    if (!ex) return;

    const newEx: RoutineExercise = {
      exerciseId: ex.id,
      exerciseName: ex.name,
      category: ex.category,
      targetSets: 3,
      targetReps: '8-12',
      restSeconds: 90,
      notes: ''
    };

    setSelectedExercises(prev => [...prev, newEx]);
    setIsPickerOpen(false);
  };

  const handleRemoveExercise = (idx: number) => {
    setSelectedExercises(prev => prev.filter((_, i) => i !== idx));
  };

  const handleMoveExercise = (idx: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= selectedExercises.length) return;
    setSelectedExercises(prev => {
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(newIdx, 0, item);
      return copy;
    });
  };

  const handleUpdateExercise = (idx: number, updates: Partial<RoutineExercise>) => {
    setSelectedExercises(prev =>
      prev.map((item, i) => (i === idx ? { ...item, ...updates } : item))
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a routine name');
      return;
    }
    if (selectedExercises.length === 0) {
      alert('Please add at least one exercise to the routine');
      return;
    }

    if (routineToEdit) {
      updateRoutine(routineToEdit.id, {
        name: name.trim(),
        description: description.trim() || 'Custom workout routine',
        category,
        daysPerWeek,
        exercises: selectedExercises
      });
    } else {
      addRoutine({
        name: name.trim(),
        description: description.trim() || 'Custom workout routine',
        category,
        daysPerWeek,
        exercises: selectedExercises
      });
    }

    onClose();
  };

  const filteredPickerExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.category.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = filterMuscle === 'all' || ex.category === filterMuscle;
    return matchesSearch && matchesMuscle;
  });

  const muscleGroups = ['all', 'chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves', 'core'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between bg-gray-900/80">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-gradient-to-br from-orange-500/20 to-rose-500/20 border border-orange-500/30 text-orange-400">
              <Dumbbell className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{routineToEdit ? 'Edit Workout Routine' : 'Create Workout Routine'}</span>
                {routineToEdit && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
                    Editing
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-400">Configure exercises, sets, reps, rest timers, and order</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 scrollbar-thin scrollbar-thumb-gray-800">
          {/* Routine Name */}
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
              Routine Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Chest & Triceps Blast or Upper Power"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800/80 border border-gray-700 text-white text-sm focus:border-orange-500 focus:outline-none placeholder-gray-500 transition-colors font-medium"
            />
          </div>

          {/* Category & Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                Category / Split
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800/80 border border-gray-700 text-white text-sm focus:border-orange-500 focus:outline-none transition-colors"
              >
                <option value="Custom">Custom</option>
                <option value="PPL">Push / Pull / Legs (PPL)</option>
                <option value="Upper/Lower">Upper / Lower</option>
                <option value="Bro Split">Bro Split</option>
                <option value="Full Body">Full Body</option>
                <option value="Desi Strength">Desi Pehlwan Strength</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
                Target Frequency (Days / Wk)
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(Math.max(1, Math.min(7, parseInt(e.target.value) || 4)))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800/80 border border-gray-700 text-white text-sm focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">
              Routine Notes & Objective
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Progressive overload on compound barbell lifts, strict form on accessories..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-800/80 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none placeholder-gray-500 transition-colors"
            />
          </div>

          {/* Exercises Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-gray-300 uppercase tracking-wider">
                  Exercise Plan
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-800 text-orange-400 font-bold border border-gray-700">
                  {selectedExercises.length} Movements
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-orange-500/20 active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Exercise</span>
              </button>
            </div>

            {selectedExercises.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-gray-800 rounded-2xl text-gray-500 space-y-2">
                <Dumbbell className="w-8 h-8 mx-auto text-gray-600 opacity-60" />
                <p className="text-xs font-semibold text-gray-400">No exercises added to this routine yet</p>
                <p className="text-[11px] text-gray-600">Click &ldquo;+ Add Exercise&rdquo; above to select lifts from the library</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {selectedExercises.map((item, idx) => (
                  <div
                    key={`${item.exerciseId}-${idx}`}
                    className="p-3.5 rounded-2xl bg-gray-850 border border-gray-800/90 hover:border-gray-700/80 transition-all space-y-2.5"
                  >
                    {/* Top Row: Reorder buttons, Name & Remove */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Order controls */}
                        <div className="flex flex-col gap-0.5 bg-gray-800/80 rounded-lg p-0.5 border border-gray-700/60">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveExercise(idx, 'up')}
                            className={`p-1 rounded text-gray-400 hover:text-white transition-colors ${
                              idx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-700'
                            }`}
                            title="Move Up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === selectedExercises.length - 1}
                            onClick={() => handleMoveExercise(idx, 'down')}
                            className={`p-1 rounded text-gray-400 hover:text-white transition-colors ${
                              idx === selectedExercises.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-700'
                            }`}
                            title="Move Down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-gray-800 text-[10px] font-bold text-gray-300 flex items-center justify-center border border-gray-700">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-white text-sm">{item.exerciseName}</span>
                          </div>
                          <span className="text-[11px] text-orange-400 capitalize font-medium ml-7 block">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(idx)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove exercise"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Parameters Row: Target Sets, Target Reps, Rest Seconds */}
                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-800/60 text-xs">
                      {/* Sets */}
                      <div className="bg-gray-800/60 rounded-xl p-2 border border-gray-750">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">
                          Sets
                        </span>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={item.targetSets}
                          onChange={(e) => handleUpdateExercise(idx, { targetSets: Math.max(1, parseInt(e.target.value) || 1) })}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-center font-black text-white text-xs focus:border-orange-500 focus:outline-none"
                        />
                      </div>

                      {/* Reps */}
                      <div className="bg-gray-800/60 rounded-xl p-2 border border-gray-750">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">
                          Reps
                        </span>
                        <input
                          type="text"
                          value={item.targetReps}
                          placeholder="8-12"
                          onChange={(e) => handleUpdateExercise(idx, { targetReps: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-center font-black text-white text-xs focus:border-orange-500 focus:outline-none"
                        />
                      </div>

                      {/* Rest */}
                      <div className="bg-gray-800/60 rounded-xl p-2 border border-gray-750">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-orange-400" />
                          <span>Rest</span>
                        </span>
                        <select
                          value={item.restSeconds || 90}
                          onChange={(e) => handleUpdateExercise(idx, { restSeconds: parseInt(e.target.value) || 90 })}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-1 py-1 text-center font-bold text-white text-xs focus:border-orange-500 focus:outline-none"
                        >
                          {REST_PRESETS.map((sec) => (
                            <option key={sec} value={sec}>
                              {sec}s
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Notes input */}
                    <div className="pt-0.5">
                      <input
                        type="text"
                        placeholder="Coaching cues (e.g. 2s pause at bottom, RIR 2)..."
                        value={item.notes || ''}
                        onChange={(e) => handleUpdateExercise(idx, { notes: e.target.value })}
                        className="w-full px-2.5 py-1 rounded-lg bg-gray-900/60 border border-gray-800 text-gray-300 text-[11px] focus:border-orange-500/70 focus:outline-none placeholder-gray-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-800 flex items-center justify-between bg-gray-900/90">
          <span className="text-xs text-gray-400 font-medium">
            {selectedExercises.length} {selectedExercises.length === 1 ? 'exercise' : 'exercises'} configured
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-750 text-gray-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/25 active:scale-95 transition-all"
            >
              {routineToEdit ? 'Save Changes' : 'Create Routine'}
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Exercise Selector Modal */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-lg max-h-[75vh] flex flex-col p-4 sm:p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-orange-500/15 text-orange-400">
                  <Plus className="w-4 h-4" />
                </span>
                <h4 className="text-sm font-bold text-white">Add Exercise to Routine</h4>
              </div>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Box */}
            <div className="relative mb-2.5">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search exercise by name or muscle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none placeholder-gray-500"
              />
            </div>

            {/* Muscle Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none text-[11px]">
              {muscleGroups.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setFilterMuscle(m)}
                  className={`px-2.5 py-1 rounded-lg font-semibold capitalize whitespace-nowrap transition-colors ${
                    filterMuscle === m
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Exercise List */}
            <div className="overflow-y-auto space-y-1.5 flex-1 pr-1 scrollbar-thin scrollbar-thumb-gray-800">
              {filteredPickerExercises.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xs">
                  No matching exercises found for &ldquo;{search}&rdquo;
                </div>
              ) : (
                filteredPickerExercises.map((ex) => {
                  const isAlreadyAdded = selectedExercises.some(se => se.exerciseId === ex.id);
                  return (
                    <div
                      key={ex.id}
                      onClick={() => handleAddExercise(ex.id)}
                      className="p-2.5 rounded-xl bg-gray-800/60 hover:bg-orange-500/15 border border-gray-800 hover:border-orange-500/30 cursor-pointer flex items-center justify-between text-xs transition-colors group"
                    >
                      <div>
                        <span className="font-semibold text-white group-hover:text-orange-300 transition-colors block">
                          {ex.name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-orange-400 capitalize text-[10px] font-bold">
                            {ex.category}
                          </span>
                          <span className="text-gray-500 text-[10px] capitalize">
                            • {ex.equipment.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isAlreadyAdded && (
                          <span className="text-[10px] text-gray-500 px-1.5 py-0.5 rounded bg-gray-700/50">
                            Already in split
                          </span>
                        )}
                        <span className="p-1 rounded-lg bg-gray-700 group-hover:bg-orange-500 text-gray-300 group-hover:text-white transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
