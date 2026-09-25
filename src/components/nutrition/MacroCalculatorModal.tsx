import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calculator, Sparkles, Check, Flame } from 'lucide-react';

interface MacroCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MacroCalculatorModal: React.FC<MacroCalculatorModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateMacroTargets, updateProfile } = useApp();

  const [weightKg, setWeightKg] = useState(profile.currentWeightKg || 75);
  const [heightCm, setHeightCm] = useState(profile.heightCm || 175);
  const [age, setAge] = useState(profile.age || 24);
  const [gender, setGender] = useState<'male' | 'female'>(profile.gender === 'female' ? 'female' : 'male');
  const [activity, setActivity] = useState<number>(1.45); // Moderate
  const [goal, setGoal] = useState<'fat_loss' | 'maintenance' | 'muscle_gain'>('muscle_gain');

  if (!isOpen) return null;

  // Mifflin-St Jeor Formula
  const bmr = gender === 'male'
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const tdee = Math.round(bmr * activity);

  // Goal adjustment
  let calculatedCalories = tdee;
  if (goal === 'fat_loss') calculatedCalories = Math.max(1300, tdee - 450);
  if (goal === 'muscle_gain') calculatedCalories = tdee + 350;

  // Macro splits
  // Protein: 2.0g per kg of bodyweight
  const calculatedProtein = Math.round(weightKg * 2.0);
  // Fats: ~25% of calories (9 cals per g)
  const calculatedFat = Math.round((calculatedCalories * 0.25) / 9);
  // Carbs: remainder calories (4 cals per g)
  const remainingCals = calculatedCalories - (calculatedProtein * 4 + calculatedFat * 9);
  const calculatedCarbs = Math.max(50, Math.round(remainingCals / 4));

  const handleApply = () => {
    updateMacroTargets({
      calories: calculatedCalories,
      protein: calculatedProtein,
      carbs: calculatedCarbs,
      fat: calculatedFat
    });
    updateProfile({
      currentWeightKg: weightKg,
      heightCm,
      age,
      gender,
      dailyCalorieTarget: calculatedCalories,
      dailyProteinTarget: calculatedProtein,
      dailyCarbTarget: calculatedCarbs,
      dailyFatTarget: calculatedFat
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-500/15 text-orange-400">
              <Calculator className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Macro & TDEE Calculator</h3>
              <p className="text-xs text-gray-400">Science-based calorie & macronutrient targets</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
              >
                <option value="male">Male (पुरुष)</option>
                <option value="female">Female (महिला)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 20)}
                className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 60)}
                className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(parseInt(e.target.value) || 170)}
                className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Weekly Activity Level</label>
            <select
              value={activity}
              onChange={(e) => setActivity(parseFloat(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
            >
              <option value={1.2}>Sedentary (Desk job, little workout)</option>
              <option value={1.375}>Lightly Active (Workout 1-3 days/wk)</option>
              <option value={1.55}>Moderately Active (Workout 4-5 days/wk)</option>
              <option value={1.725}>Very Active (Hard workout 6-7 days/wk)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Fitness Goal</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setGoal('fat_loss')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                  goal === 'fat_loss'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                Fat Loss (-450 kcal)
              </button>
              <button
                type="button"
                onClick={() => setGoal('maintenance')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                  goal === 'maintenance'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                Maintain
              </button>
              <button
                type="button"
                onClick={() => setGoal('muscle_gain')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                  goal === 'muscle_gain'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                Lean Bulk (+350 kcal)
              </button>
            </div>
          </div>

          {/* Results Preview Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-950/40 via-gray-850 to-gray-900 border border-orange-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300">Target Calories:</span>
              <span className="text-2xl font-black text-orange-400">{calculatedCalories} kcal</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-gray-900/80 border border-gray-800">
                <span className="text-gray-400 block text-[10px]">Protein (2g/kg)</span>
                <span className="font-extrabold text-emerald-400 text-sm">{calculatedProtein}g</span>
              </div>
              <div className="p-2 rounded-xl bg-gray-900/80 border border-gray-800">
                <span className="text-gray-400 block text-[10px]">Carbs</span>
                <span className="font-extrabold text-cyan-400 text-sm">{calculatedCarbs}g</span>
              </div>
              <div className="p-2 rounded-xl bg-gray-900/80 border border-gray-800">
                <span className="text-gray-400 block text-[10px]">Fats (25%)</span>
                <span className="font-extrabold text-amber-400 text-sm">{calculatedFat}g</span>
              </div>
            </div>
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
            onClick={handleApply}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/20"
          >
            Apply Targets to App
          </button>
        </div>
      </div>
    </div>
  );
};
