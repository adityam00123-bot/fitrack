import React, { useState, useMemo } from 'react';
import { X, Disc, Plus, Minus, Check, Scale } from 'lucide-react';

interface PlateCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWeight?: number;
}

interface PlateConfig {
  weight: number;
  color: string;
  borderColor: string;
  textColor: string;
  heightClass: string;
}

const AVAILABLE_PLATES: PlateConfig[] = [
  { weight: 25, color: 'bg-red-600', borderColor: 'border-red-400', textColor: 'text-white', heightClass: 'h-28' },
  { weight: 20, color: 'bg-blue-600', borderColor: 'border-blue-400', textColor: 'text-white', heightClass: 'h-26' },
  { weight: 15, color: 'bg-amber-500', borderColor: 'border-amber-300', textColor: 'text-gray-950', heightClass: 'h-24' },
  { weight: 10, color: 'bg-emerald-600', borderColor: 'border-emerald-400', textColor: 'text-white', heightClass: 'h-20' },
  { weight: 5, color: 'bg-gray-100', borderColor: 'border-gray-300', textColor: 'text-gray-900', heightClass: 'h-16' },
  { weight: 2.5, color: 'bg-rose-500', borderColor: 'border-rose-400', textColor: 'text-white', heightClass: 'h-13' },
  { weight: 1.25, color: 'bg-gray-400', borderColor: 'border-gray-300', textColor: 'text-gray-950', heightClass: 'h-10' }
];

export const PlateCalculatorModal: React.FC<PlateCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialWeight = 60
}) => {
  const [targetWeight, setTargetWeight] = useState<number>(initialWeight > 0 ? initialWeight : 60);
  const [barWeight, setBarWeight] = useState<number>(20); // 20kg Olympic standard

  // Calculate plates required per side
  const calculation = useMemo(() => {
    const weightToLoad = Math.max(0, targetWeight - barWeight);
    const weightPerSide = weightToLoad / 2;

    let remaining = weightPerSide;
    const loadedPlates: { plate: PlateConfig; count: number }[] = [];

    for (const plate of AVAILABLE_PLATES) {
      if (remaining >= plate.weight) {
        const count = Math.floor(remaining / plate.weight);
        loadedPlates.push({ plate, count });
        remaining = Math.round((remaining - count * plate.weight) * 100) / 100;
      }
    }

    const actualPerSide = weightPerSide - remaining;
    const actualTotal = barWeight + actualPerSide * 2;

    return {
      weightPerSide,
      loadedPlates,
      remainingPerSide: remaining,
      actualTotal
    };
  }, [targetWeight, barWeight]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between bg-gray-900/90">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Scale className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-black text-white">Barbell Plate Calculator</h3>
              <p className="text-xs text-gray-400">Exact bumper plates to load per side</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Target Weight Controls */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Target Lift Weight (Total Barbell + Plates)
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTargetWeight(prev => Math.max(barWeight, prev - 2.5))}
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex-1 relative">
                <input
                  type="number"
                  step="0.5"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
                  className="w-full text-center py-2.5 px-4 rounded-xl bg-gray-950 border border-gray-800 text-2xl font-black font-mono text-white focus:border-orange-500 focus:outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                  KG
                </span>
              </div>

              <button
                onClick={() => setTargetWeight(prev => prev + 2.5)}
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Jumps */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {[40, 60, 80, 100, 120, 140].map((w) => (
                <button
                  key={w}
                  onClick={() => setTargetWeight(w)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    targetWeight === w
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-850 text-gray-400 hover:text-white'
                  }`}
                >
                  {w}kg
                </button>
              ))}
            </div>
          </div>

          {/* Barbell Type Selector */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Select Bar Type
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              {[
                { label: 'Olympic 20kg', weight: 20 },
                { label: 'Women 15kg', weight: 15 },
                { label: 'EZ-Bar 10kg', weight: 10 }
              ].map((b) => (
                <button
                  key={b.weight}
                  onClick={() => setBarWeight(b.weight)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    barWeight === b.weight
                      ? 'bg-orange-500/15 border-orange-500/40 text-orange-400'
                      : 'bg-gray-850 border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <span>{b.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Barbell Loaded Sleeve Representation */}
          <div className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800 shadow-inner flex flex-col items-center">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">
              One Side Sleeve Loading Preview
            </span>

            {/* Sleeve Graphic */}
            <div className="flex items-center justify-center min-h-32 w-full overflow-x-auto py-2">
              {/* Barbell Shaft */}
              <div className="w-12 h-4 bg-gray-600 rounded-l shrink-0 border-y border-gray-400 shadow-sm" />
              {/* Collar */}
              <div className="w-4 h-12 bg-gray-400 rounded-sm shrink-0 border border-gray-300 shadow-md" />

              {/* Stacked Plates on Sleeve */}
              <div className="flex items-center gap-1 pl-1">
                {calculation.loadedPlates.flatMap(({ plate, count }) =>
                  Array.from({ length: count }).map((_, i) => (
                    <div
                      key={`${plate.weight}-${i}`}
                      className={`w-6 sm:w-8 ${plate.heightClass} ${plate.color} border-2 ${plate.borderColor} rounded flex items-center justify-center shadow-lg transition-transform hover:scale-105 shrink-0`}
                      title={`${plate.weight}kg plate`}
                    >
                      <span className={`text-[10px] font-black ${plate.textColor} transform -rotate-90 select-none`}>
                        {plate.weight}
                      </span>
                    </div>
                  ))
                )}
                {/* Empty Sleeve End */}
                <div className="w-10 h-3 bg-gray-600 rounded-r border-y border-gray-400 shrink-0" />
              </div>
            </div>

            {/* Per Side Breakdown Text */}
            <div className="mt-4 text-center">
              <span className="text-xs text-gray-400 block mb-1">Load on Each Side:</span>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {calculation.loadedPlates.length === 0 ? (
                  <span className="text-sm font-semibold text-gray-500">Empty Bar (0 kg plates)</span>
                ) : (
                  calculation.loadedPlates.map(({ plate, count }) => (
                    <span
                      key={plate.weight}
                      className="px-2.5 py-1 rounded-lg bg-gray-850 border border-gray-750 text-white font-mono text-xs font-bold flex items-center gap-1"
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${plate.color}`} />
                      <span>{count} × {plate.weight}kg</span>
                    </span>
                  ))
                )}
              </div>
              <span className="text-xs font-mono font-bold text-orange-400 block mt-2">
                Total Per Side: {calculation.weightPerSide} kg
              </span>
            </div>
          </div>

          {/* Quick Summary Pill */}
          <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-between text-xs">
            <span className="text-gray-300 font-medium">Bar ({barWeight}kg) + Plates ({calculation.weightPerSide * 2}kg)</span>
            <strong className="text-orange-400 font-black text-sm">{calculation.actualTotal} KG</strong>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
