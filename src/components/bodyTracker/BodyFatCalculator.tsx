import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Calculator, Check, Flame } from 'lucide-react';

export const BodyFatCalculator: React.FC = () => {
  const { profile, logWeight } = useApp();

  const [gender, setGender] = useState<'male' | 'female'>(profile.gender === 'female' ? 'female' : 'male');
  const [heightCm, setHeightCm] = useState(profile.heightCm || 178);
  const [waistCm, setWaistCm] = useState(82);
  const [neckCm, setNeckCm] = useState(38);
  const [hipsCm, setHipsCm] = useState(96); // Needed for females
  const [calculatedBf, setCalculatedBf] = useState<number | null>(null);

  const calculateNavyBf = (e: React.FormEvent) => {
    e.preventDefault();
    let bf = 0;

    // US Navy formula:
    // Men: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
    // Women: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
    try {
      if (gender === 'male') {
        const diff = waistCm - neckCm;
        if (diff <= 0) return;
        const val = 1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(heightCm);
        bf = 495 / val - 450;
      } else {
        const sum = waistCm + hipsCm - neckCm;
        if (sum <= 0) return;
        const val = 1.29579 - 0.35004 * Math.log10(sum) + 0.221 * Math.log10(heightCm);
        bf = 495 / val - 450;
      }

      const rounded = parseFloat(Math.max(4, Math.min(50, bf)).toFixed(1));
      setCalculatedBf(rounded);
    } catch {
      // ignore
    }
  };

  const getBfCategory = (bf: number, gen: 'male' | 'female') => {
    if (gen === 'male') {
      if (bf < 6) return { label: 'Essential Fat (Stage Shredded)', color: 'text-rose-400' };
      if (bf <= 13) return { label: 'Athletic / Visible Abs', color: 'text-emerald-400' };
      if (bf <= 17) return { label: 'Fitness / Lean', color: 'text-cyan-400' };
      if (bf <= 24) return { label: 'Average', color: 'text-amber-400' };
      return { label: 'Overweight', color: 'text-rose-400' };
    } else {
      if (bf < 14) return { label: 'Essential Fat', color: 'text-rose-400' };
      if (bf <= 20) return { label: 'Athletic / Lean', color: 'text-emerald-400' };
      if (bf <= 24) return { label: 'Fitness', color: 'text-cyan-400' };
      if (bf <= 31) return { label: 'Average', color: 'text-amber-400' };
      return { label: 'Overweight', color: 'text-rose-400' };
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 shadow-xl max-w-2xl">
      <div className="flex items-center gap-2 mb-2">
        <span className="p-1.5 rounded-lg bg-orange-500/15 text-orange-400">
          <Calculator className="w-4 h-4" />
        </span>
        <h3 className="text-lg font-bold text-white">US Navy Body Fat % Estimator</h3>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        Calculates lean mass ratio using tape measurement circumference without needing expensive DEXA scans.
      </p>

      <form onSubmit={calculateNavyBf} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-300 block mb-1">Gender</label>
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
            <label className="text-xs text-gray-300 block mb-1">Height (cm)</label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(parseFloat(e.target.value) || 170)}
              className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Waist Circumference (cm) *</label>
            <input
              type="number"
              step="0.5"
              value={waistCm}
              onChange={(e) => setWaistCm(parseFloat(e.target.value) || 80)}
              className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Neck Circumference (cm) *</label>
            <input
              type="number"
              step="0.5"
              value={neckCm}
              onChange={(e) => setNeckCm(parseFloat(e.target.value) || 38)}
              className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
              required
            />
          </div>

          {gender === 'female' && (
            <div className="col-span-2">
              <label className="text-xs text-gray-300 block mb-1">Hips Circumference (cm) *</label>
              <input
                type="number"
                step="0.5"
                value={hipsCm}
                onChange={(e) => setHipsCm(parseFloat(e.target.value) || 95)}
                className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
                required
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all"
        >
          Calculate Body Fat %
        </button>
      </form>

      {/* Result Card */}
      {calculatedBf !== null && (
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-gray-850 to-gray-900 border border-orange-500/30 text-center animate-fade-in">
          <span className="text-xs text-gray-400 block mb-1">Estimated Body Fat</span>
          <div className="text-3xl font-black text-orange-400">{calculatedBf}%</div>
          <div className={`text-xs font-bold mt-1 ${getBfCategory(calculatedBf, gender).color}`}>
            {getBfCategory(calculatedBf, gender).label}
          </div>

          <button
            onClick={() => {
              logWeight(profile.currentWeightKg, calculatedBf, 'Estimated via US Navy Formula');
              alert(`Saved ${calculatedBf}% body fat to your weight history!`);
            }}
            className="mt-3 px-4 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white border border-gray-700 transition-colors"
          >
            Save to Today's Log
          </button>
        </div>
      )}
    </div>
  );
};
