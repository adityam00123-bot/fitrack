import React from 'react';
import { Exercise } from '../../types/workout';
import { X, Dumbbell, Target, AlertCircle, CheckCircle, Flame } from 'lucide-react';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  onClose: () => void;
  onAddToWorkout?: (exercise: Exercise) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose,
  onAddToWorkout
}) => {
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[10px] font-bold uppercase tracking-wider">
                {exercise.category}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-gray-800 text-gray-300 text-[10px] font-semibold uppercase tracking-wider">
                {exercise.equipment}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold capitalize">
                {exercise.difficulty}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">{exercise.name}</h3>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Target Muscles */}
          <div className="p-3.5 rounded-2xl bg-gray-850 border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <Target className="w-4 h-4 text-orange-400" />
              <span className="text-gray-400">Primary Target:</span>
              <strong className="text-white capitalize">{exercise.category}</strong>
            </div>

            {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
              <div className="text-xs text-gray-400">
                <span>Secondary: </span>
                <span className="text-gray-200 capitalize">
                  {exercise.secondaryMuscles.join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Step-by-Step Form & Technique</span>
            </h4>
            <ol className="space-y-2 text-xs sm:text-sm text-gray-300">
              {exercise.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-gray-800 text-orange-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Pro Tips */}
          {exercise.tips && exercise.tips.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1.5 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Coach Pro Tip</span>
              </h4>
              <ul className="text-xs text-amber-100 space-y-1">
                {exercise.tips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 flex justify-end gap-2">
          {onAddToWorkout && (
            <button
              onClick={() => {
                onAddToWorkout(exercise);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/20"
            >
              Add to Active Session
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-750 text-gray-300 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
