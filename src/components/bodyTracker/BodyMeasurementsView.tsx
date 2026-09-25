import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Ruler, TrendingUp, TrendingDown, Calendar, X } from 'lucide-react';

export const BodyMeasurementsView: React.FC = () => {
  const { measurements, logMeasurements } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [chest, setChest] = useState<string>('');
  const [waist, setWaist] = useState<string>('');
  const [shoulders, setShoulders] = useState<string>('');
  const [leftBicep, setLeftBicep] = useState<string>('');
  const [rightBicep, setRightBicep] = useState<string>('');
  const [hips, setHips] = useState<string>('');
  const [thighs, setThighs] = useState<string>('');
  const [neck, setNeck] = useState<string>('');

  const latest = measurements[measurements.length - 1];
  const previous = measurements.length > 1 ? measurements[measurements.length - 2] : null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    logMeasurements({
      chestCm: chest ? parseFloat(chest) : undefined,
      waistCm: waist ? parseFloat(waist) : undefined,
      shouldersCm: shoulders ? parseFloat(shoulders) : undefined,
      leftBicepCm: leftBicep ? parseFloat(leftBicep) : undefined,
      rightBicepCm: rightBicep ? parseFloat(rightBicep) : undefined,
      hipsCm: hips ? parseFloat(hips) : undefined,
      leftThighCm: thighs ? parseFloat(thighs) : undefined,
      neckCm: neck ? parseFloat(neck) : undefined
    });
    setIsModalOpen(false);
  };

  const metrics: { label: string; key: keyof typeof latest; unit: string }[] = [
    { label: 'Chest (छाती)', key: 'chestCm', unit: 'cm' },
    { label: 'Waist (कमर)', key: 'waistCm', unit: 'cm' },
    { label: 'Shoulders (कंधे)', key: 'shouldersCm', unit: 'cm' },
    { label: 'Left Bicep (बायां डोला)', key: 'leftBicepCm', unit: 'cm' },
    { label: 'Right Bicep (दायां डोला)', key: 'rightBicepCm', unit: 'cm' },
    { label: 'Hips (हिप्स)', key: 'hipsCm', unit: 'cm' },
    { label: 'Thigh (जांघ)', key: 'leftThighCm', unit: 'cm' },
    { label: 'Neck (गर्दन)', key: 'neckCm', unit: 'cm' }
  ];

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Ruler className="w-4 h-4 text-orange-400" />
            <span>Body Circumference Tracking</span>
          </h3>
          <p className="text-xs text-gray-400">Track muscle hypertrophy and waist slimming over time</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Measurement</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m) => {
          const val = latest ? (latest[m.key] as number | undefined) : undefined;
          const prevVal = previous ? (previous[m.key] as number | undefined) : undefined;
          const diff = val !== undefined && prevVal !== undefined ? val - prevVal : null;

          return (
            <div key={m.label} className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800">
              <span className="text-[11px] font-semibold text-gray-400 block mb-1">
                {m.label}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-white">
                  {val !== undefined ? val : '--'}
                </span>
                <span className="text-xs text-gray-400 font-mono">{m.unit}</span>
              </div>

              {diff !== null && (
                <div
                  className={`mt-2 text-[11px] font-bold flex items-center gap-0.5 ${
                    diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-cyan-400' : 'text-gray-400'
                  }`}
                >
                  {diff > 0 ? '+' : ''}{diff.toFixed(1)} cm
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Log Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
              <h3 className="text-base font-bold text-white">Record Measurements</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Chest (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 102"
                    value={chest}
                    onChange={(e) => setChest(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Waist (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 81"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Shoulders (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 120"
                    value={shoulders}
                    onChange={(e) => setShoulders(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Hips (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 96"
                    value={hips}
                    onChange={(e) => setHips(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Left Bicep (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 36"
                    value={leftBicep}
                    onChange={(e) => setLeftBicep(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Right Bicep (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 36.5"
                    value={rightBicep}
                    onChange={(e) => setRightBicep(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Thigh (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 58"
                    value={thighs}
                    onChange={(e) => setThighs(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Neck (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 38"
                    value={neck}
                    onChange={(e) => setNeck(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white text-xs font-bold shadow-md"
                >
                  Save Measurements
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
