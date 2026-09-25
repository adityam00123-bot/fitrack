import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoutineExercise } from '../../types/workout';
import { X, Plus, Trash2, Search, Dumbbell } from 'lucide-react';

interface RoutineEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoutineEditorModal: React.FC<RoutineEditorModalProps> = ({ isOpen, onClose }) => {
  const { exercises, addRoutine } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'PPL' | 'Upper/Lower' | 'Bro Split' | 'Full Body' | 'Desi Strength' | 'Custom'>('Custom');
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [selectedExercises, setSelectedExercises] = useState<RoutineExercise[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [search, setSearch] = useState('');

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
      restSeconds: 90
    };

    setSelectedExercises(prev => [...prev, newEx]);
    setIsPickerOpen(false);
  };

  const handleRemoveExercise = (idx: number) => {
    setSelectedExercises(prev => prev.filter((_, i) => i !== idx));
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

    addRoutine({
      name: name.trim(),
      description: description.trim() || 'Custom workout routine',
      category,
      daysPerWeek,
      exercises: selectedExercises
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-500/15 text-orange-400">
              <Dumbbell className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Create Workout Routine</h3>
              <p className="text-xs text-gray-400">Design your custom training day or split</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Routine Name *</label>
            <input
              type="text"
              placeholder="e.g. Chest & Triceps Blast or Legs Quad Focus"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Category / Split</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:border-orange-500 focus:outline-none"
              >
                <option value="Custom">Custom</option>
                <option value="PPL">Push / Pull / Legs</option>
                <option value="Upper/Lower">Upper / Lower</option>
                <option value="Bro Split">Bro Split</option>
                <option value="Full Body">Full Body</option>
                <option value="Desi Strength">Desi Strength</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Frequency (Days / Wk)</label>
              <input
                type="number"
                min="1"
                max="7"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(parseInt(e.target.value) || 4)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Notes / Description</label>
            <textarea
              rows={2}
              placeholder="e.g. Focus on progressive overload on compound lifts..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Exercises in routine */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Exercises ({selectedExercises.length})
              </span>
              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Exercise
              </button>
            </div>

            {selectedExercises.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-gray-800 rounded-2xl text-gray-500 text-xs">
                No exercises added to this routine yet. Click "+ Add Exercise" above.
              </div>
            ) : (
              <div className="space-y-2">
                {selectedExercises.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-gray-850 border border-gray-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{item.exerciseName}</span>
                      <span className="text-gray-400 capitalize">{item.category}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">Sets:</span>
                        <input
                          type="number"
                          value={item.targetSets}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 3;
                            setSelectedExercises(prev => prev.map((it, i) => i === idx ? { ...it, targetSets: val } : it));
                          }}
                          className="w-12 px-1.5 py-1 rounded bg-gray-800 border border-gray-700 text-white text-center"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">Reps:</span>
                        <input
                          type="text"
                          value={item.targetReps}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedExercises(prev => prev.map((it, i) => i === idx ? { ...it, targetReps: val } : it));
                          }}
                          placeholder="8-12"
                          className="w-16 px-1.5 py-1 rounded bg-gray-800 border border-gray-700 text-white text-center"
                        />
                      </div>

                      <button
                        onClick={() => handleRemoveExercise(idx)}
                        className="text-gray-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/20"
          >
            Save Routine
          </button>
        </div>
      </div>

      {/* Embedded Exercise Selector popover */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md max-h-[70vh] flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white">Select Exercise</h4>
              <button onClick={() => setIsPickerOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div className="overflow-y-auto space-y-1.5 flex-1">
              {exercises
                .filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
                .map(ex => (
                  <div
                    key={ex.id}
                    onClick={() => handleAddExercise(ex.id)}
                    className="p-2 rounded-lg bg-gray-800/60 hover:bg-orange-500/20 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <span className="font-semibold text-white">{ex.name}</span>
                    <span className="text-orange-400 capitalize text-[10px]">{ex.category}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
