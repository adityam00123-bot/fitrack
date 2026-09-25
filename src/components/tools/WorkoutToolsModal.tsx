import React, { useState } from 'react';
import { X, Calculator, Disc, Flame, Sparkles, Layers } from 'lucide-react';

interface WorkoutToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkoutToolsModal: React.FC<WorkoutToolsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'1rm' | 'plates' | 'warmup'>('1rm');

  // 1RM State
  const [liftWeight, setLiftWeight] = useState<number>(80);
  const [liftReps, setLiftReps] = useState<number>(5);

  // Plate Calculator State
  const [targetBarbellWeight, setTargetBarbellWeight] = useState<number>(100);
  const [barWeight, setBarWeight] = useState<number>(20); // 20kg Olympic bar

  // Warmup Generator State
  const [workingWeight, setWorkingWeight] = useState<number>(100);

  if (!isOpen) return null;

  // 1RM Calculations
  // Brzycki formula: weight / (1.0278 - 0.0278 * reps)
  // Epley formula: weight * (1 + 0.0333 * reps)
  const oneRmEpley = Math.round(liftWeight * (1 + 0.0333 * liftReps));
  const oneRmBrzycki = Math.round(liftWeight / (1.0278 - 0.0278 * liftReps));
  const averageOneRm = Math.round((oneRmEpley + oneRmBrzycki) / 2);

  const percentages = [
    { pct: 95, reps: '2 reps' },
    { pct: 90, reps: '3-4 reps' },
    { pct: 85, reps: '5-6 reps' },
    { pct: 80, reps: '7-8 reps' },
    { pct: 75, reps: '9-10 reps' },
    { pct: 70, reps: '11-12 reps' }
  ];

  // Plate calculations
  const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
  const weightPerSide = Math.max(0, (targetBarbellWeight - barWeight) / 2);

  const calculatedPlates: { weight: number; count: number; color: string }[] = [];
  let remainingSide = weightPerSide;

  const plateColors: Record<number, string> = {
    25: 'bg-red-600 border-red-500',
    20: 'bg-blue-600 border-blue-500',
    15: 'bg-yellow-500 border-yellow-400 text-black',
    10: 'bg-green-600 border-green-500',
    5: 'bg-white border-gray-300 text-black',
    2.5: 'bg-black border-gray-600',
    1.25: 'bg-gray-400 border-gray-300 text-black'
  };

  availablePlates.forEach((plate) => {
    if (remainingSide >= plate) {
      const count = Math.floor(remainingSide / plate);
      calculatedPlates.push({
        weight: plate,
        count,
        color: plateColors[plate] || 'bg-gray-600'
      });
      remainingSide = parseFloat((remainingSide - count * plate).toFixed(2));
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
              <Calculator className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Gym Math & Calculators</h3>
              <p className="text-xs text-gray-400">1RM strength predictor, plate math, and warmup sets</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-800 p-2 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('1rm')}
            className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
              activeTab === '1rm' ? 'bg-orange-500 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            1RM Calculator
          </button>
          <button
            onClick={() => setActiveTab('plates')}
            className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
              activeTab === 'plates' ? 'bg-orange-500 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Plate Calculator
          </button>
          <button
            onClick={() => setActiveTab('warmup')}
            className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
              activeTab === 'warmup' ? 'bg-orange-500 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Warmup Generator
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === '1rm' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Weight Lifted (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={liftWeight}
                    onChange={(e) => setLiftWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Reps Performed</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={liftReps}
                    onChange={(e) => setLiftReps(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm"
                  />
                </div>
              </div>

              {/* 1RM Result Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-950/40 via-gray-850 to-gray-900 border border-orange-500/30 text-center">
                <span className="text-xs font-semibold text-gray-400 block mb-1">Estimated 1 Rep Max</span>
                <div className="text-4xl font-black text-orange-400 font-mono">{averageOneRm} kg</div>
                <span className="text-[11px] text-gray-400 block mt-1">
                  (Epley: {oneRmEpley} kg • Brzycki: {oneRmBrzycki} kg)
                </span>
              </div>

              {/* Training Percentages */}
              <div>
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Training Weight Percentages
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {percentages.map((p) => (
                    <div key={p.pct} className="p-2.5 rounded-xl bg-gray-850 border border-gray-800 text-center">
                      <span className="text-gray-400 text-[11px] block">{p.pct}% ({p.reps})</span>
                      <strong className="text-white text-sm font-mono">
                        {Math.round((averageOneRm * p.pct) / 100)} kg
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'plates' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Target Barbell Weight (kg)</label>
                  <input
                    type="number"
                    step="2.5"
                    value={targetBarbellWeight}
                    onChange={(e) => setTargetBarbellWeight(parseFloat(e.target.value) || 20)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Barbell Weight</label>
                  <select
                    value={barWeight}
                    onChange={(e) => setBarWeight(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
                  >
                    <option value={20}>20 kg (Olympic Standard Bar)</option>
                    <option value={15}>15 kg (Women's Olympic Bar)</option>
                    <option value={10}>10 kg (EZ Curl Bar / Training Bar)</option>
                  </select>
                </div>
              </div>

              {/* Per side summary */}
              <div className="p-4 rounded-2xl bg-gray-850 border border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400">Total Plates Weight:</span>
                  <span className="text-lg font-black text-white ml-2">
                    {Math.max(0, targetBarbellWeight - barWeight)} kg
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400">On EACH side:</span>
                  <span className="text-lg font-black text-orange-400 ml-2 font-mono">
                    {weightPerSide} kg
                  </span>
                </div>
              </div>

              {/* Visual Plate Stack */}
              <div>
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2.5">
                  Plates to load on each sleeve:
                </h4>

                {calculatedPlates.length === 0 ? (
                  <div className="py-6 text-center text-xs text-gray-400 bg-gray-850 rounded-2xl">
                    No plates needed! Just the empty bar ({barWeight} kg).
                  </div>
                ) : (
                  <div className="space-y-2">
                    {calculatedPlates.map((pl, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-gray-850 border border-gray-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${pl.color}`}>
                            {pl.weight}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {pl.weight} kg Olympic Plate
                          </span>
                        </div>
                        <span className="px-3 py-1 rounded-lg bg-gray-800 text-orange-400 font-bold font-mono text-sm">
                          × {pl.count} {pl.count === 1 ? 'plate' : 'plates'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'warmup' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Your Working Set Weight (kg)</label>
                <input
                  type="number"
                  step="2.5"
                  value={workingWeight}
                  onChange={(e) => setWorkingWeight(parseFloat(e.target.value) || 40)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-base font-bold focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-gray-850 border border-gray-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Set 1: Empty Bar Warmup</span>
                    <span className="text-gray-400">Wake up nervous system & groove technique</span>
                  </div>
                  <strong className="text-emerald-400 font-mono text-sm">20 kg × 10 reps</strong>
                </div>

                <div className="p-3 rounded-xl bg-gray-850 border border-gray-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Set 2: 50% Working Weight</span>
                    <span className="text-gray-400">Light blood flow</span>
                  </div>
                  <strong className="text-emerald-400 font-mono text-sm">
                    {Math.round(workingWeight * 0.5)} kg × 5 reps
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-gray-850 border border-gray-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Set 3: 70% Working Weight</span>
                    <span className="text-gray-400">Moderate speed reps</span>
                  </div>
                  <strong className="text-emerald-400 font-mono text-sm">
                    {Math.round(workingWeight * 0.7)} kg × 3 reps
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-gray-850 border border-gray-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Set 4: 85% Acclimation Potentiation</span>
                    <span className="text-gray-400">Feel heavy weight without fatiguing muscles</span>
                  </div>
                  <strong className="text-emerald-400 font-mono text-sm">
                    {Math.round(workingWeight * 0.85)} kg × 1 rep
                  </strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-between text-xs text-orange-200">
                  <div>
                    <span className="font-bold text-orange-300 block">Working Sets Ready!</span>
                    <span className="text-orange-200/80">Rest 2-3 mins, then hit heavy sets</span>
                  </div>
                  <strong className="text-orange-400 font-mono text-base">{workingWeight} kg</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
