import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MuscleGroup, Equipment, DifficultyLevel } from '../../types/workout';
import { X, Plus, Dumbbell } from 'lucide-react';

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExerciseModal: React.FC<AddExerciseModalProps> = ({ isOpen, onClose }) => {
  const { addCustomExercise } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<MuscleGroup>('chest');
  const [equipment, setEquipment] = useState<Equipment>('barbell');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  const [instructionsText, setInstructionsText] = useState('');
  const [tipsText, setTipsText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter an exercise name');
      return;
    }

    const instructions = instructionsText.trim()
      ? instructionsText.split('\n').filter(s => s.trim().length > 0)
      : ['Perform with controlled tempo and full range of motion.'];

    const tips = tipsText.trim()
      ? tipsText.split('\n').filter(s => s.trim().length > 0)
      : undefined;

    addCustomExercise({
      name: name.trim(),
      category,
      equipment,
      difficulty,
      instructions,
      tips
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-500/15 text-orange-400">
              <Dumbbell className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-white">Add Custom Exercise</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Exercise Name *</label>
            <input
              type="text"
              placeholder="e.g. Bulgarian Split Squat or Desi Baithak"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:border-orange-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Target Muscle</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MuscleGroup)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:border-orange-500 focus:outline-none capitalize"
              >
                {['chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves', 'core', 'forearms', 'cardio'].map(m => (
                  <option key={m} value={m} className="capitalize">{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Equipment</label>
              <select
                value={equipment}
                onChange={(e) => setEquipment(e.target.value as Equipment)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:border-orange-500 focus:outline-none capitalize"
              >
                {['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'kettlebell', 'smith_machine', 'resistance_band', 'other'].map(eq => (
                  <option key={eq} value={eq} className="capitalize">{eq.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Execution Steps (1 per line)</label>
            <textarea
              rows={3}
              placeholder="Step 1: Set up with feet shoulder-width&#10;Step 2: Lower hips with control&#10;Step 3: Drive up explosively"
              value={instructionsText}
              onChange={(e) => setInstructionsText(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Coach Pro Tip (Optional)</label>
            <textarea
              rows={2}
              placeholder="e.g. Squeeze glutes at top lockout and keep core tight"
              value={tipsText}
              onChange={(e) => setTipsText(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/20"
            >
              Save Exercise
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
