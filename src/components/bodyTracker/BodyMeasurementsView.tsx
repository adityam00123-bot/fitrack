import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Ruler, TrendingUp, TrendingDown, Calendar, X, Check, History } from 'lucide-react';

export const BodyMeasurementsView: React.FC = () => {
  const { measurements, logMeasurements } = useApp();
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [chest, setChest] = useState<string>('');
  const [waist, setWaist] = useState<string>('');
  const [shoulders, setShoulders] = useState<string>('');
  const [leftBicep, setLeftBicep] = useState<string>('');
  const [rightBicep, setRightBicep] = useState<string>('');
  const [hips, setHips] = useState<string>('');
  const [thighs, setThighs] = useState<string>('');
  const [neck, setNeck] = useState<string>('');
  const [calves, setCalves] = useState<string>('');

  const latest = measurements[measurements.length - 1];
  const previous = measurements.length > 1 ? measurements[measurements.length - 2] : null;

  // Conversion helper
  const formatVal = (valCm?: number) => {
    if (valCm === undefined || valCm === null) return '--';
    if (unit === 'in') {
      return (valCm / 2.54).toFixed(1);
    }
    return valCm.toFixed(1);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert to cm if user entered in inches
    const toCm = (valStr: string) => {
      if (!valStr) return undefined;
      const num = parseFloat(valStr);
      if (isNaN(num)) return undefined;
      return unit === 'in' ? parseFloat((num * 2.54).toFixed(1)) : num;
    };

    logMeasurements({
      chestCm: toCm(chest),
      waistCm: toCm(waist),
      shouldersCm: toCm(shoulders),
      leftBicepCm: toCm(leftBicep),
      rightBicepCm: toCm(rightBicep),
      hipsCm: toCm(hips),
      leftThighCm: toCm(thighs),
      neckCm: toCm(neck),
      calvesCm: toCm(calves)
    });

    setIsModalOpen(false);
    setChest('');
    setWaist('');
    setShoulders('');
    setLeftBicep('');
    setRightBicep('');
    setHips('');
    setThighs('');
    setNeck('');
    setCalves('');
  };

  const metrics: { label: string; hindi: string; key: keyof typeof latest }[] = [
    { label: 'Chest', hindi: 'छाती', key: 'chestCm' },
    { label: 'Waist', hindi: 'कमर', key: 'waistCm' },
    { label: 'Shoulders', hindi: 'कंधे', key: 'shouldersCm' },
    { label: 'Left Bicep', hindi: 'बायां डोला', key: 'leftBicepCm' },
    { label: 'Right Bicep', hindi: 'दायां डोला', key: 'rightBicepCm' },
    { label: 'Hips', hindi: 'हिप्स', key: 'hipsCm' },
    { label: 'Thigh', hindi: 'जांघ', key: 'leftThighCm' },
    { label: 'Neck', hindi: 'गर्दन', key: 'neckCm' },
    { label: 'Calves', hindi: 'पिंडली', key: 'calvesCm' }
  ];

  return (
    <div className="space-y-4">
      {/* Top Header & Unit Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Ruler className="w-4 h-4 text-orange-400" />
            <span>Body Circumference Tracking</span>
          </h3>
          <p className="text-xs text-gray-400">Track muscle hypertrophy and waist slimming over time</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Unit Toggle */}
          <div className="flex bg-gray-800 rounded-2xl p-1 text-xs">
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-colors ${
                unit === 'cm' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Centimeters (cm)
            </button>
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-colors ${
                unit === 'in' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Inches (in)
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Measurement</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {metrics.map((m) => {
          const rawVal = latest ? (latest[m.key] as number | undefined) : undefined;
          const prevRawVal = previous ? (previous[m.key] as number | undefined) : undefined;
          const displayVal = formatVal(rawVal);

          let diffDisplay: string | null = null;
          let isPositive = false;

          if (rawVal !== undefined && prevRawVal !== undefined) {
            const rawDiff = rawVal - prevRawVal;
            const diffInUnit = unit === 'in' ? rawDiff / 2.54 : rawDiff;
            if (Math.abs(diffInUnit) >= 0.05) {
              isPositive = diffInUnit > 0;
              diffDisplay = `${isPositive ? '+' : ''}${diffInUnit.toFixed(1)} ${unit}`;
            }
          }

          return (
            <div
              key={m.label}
              className="p-4 rounded-3xl bg-gray-900/90 border border-gray-800 hover:border-gray-700/80 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-gray-300">{m.label}</span>
                  <span className="text-gray-500 text-[10px]">{m.hindi}</span>
                </div>

                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {displayVal}
                  </span>
                  <span className="text-xs text-orange-400 font-bold">{unit}</span>
                </div>
              </div>

              {diffDisplay ? (
                <div
                  className={`mt-2.5 text-[11px] font-bold flex items-center gap-1 ${
                    m.key === 'waistCm'
                      ? isPositive ? 'text-amber-400' : 'text-emerald-400'
                      : isPositive ? 'text-emerald-400' : 'text-cyan-400'
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{diffDisplay} vs last</span>
                </div>
              ) : (
                <div className="mt-2.5 text-[10px] text-gray-500">First record / unchanged</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Measurement History Table */}
      <div className="p-5 rounded-3xl bg-gray-900/90 border border-gray-800 shadow-sm space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <History className="w-4 h-4 text-orange-400" />
          <span>Measurement History ({measurements.length} logged)</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 uppercase text-[10px] font-bold">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Chest</th>
                <th className="py-2.5 px-3">Waist</th>
                <th className="py-2.5 px-3">Shoulders</th>
                <th className="py-2.5 px-3">Left Bicep</th>
                <th className="py-2.5 px-3">Right Bicep</th>
                <th className="py-2.5 px-3">Thigh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {measurements.slice(-5).reverse().map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-850/50 transition-colors">
                  <td className="py-2 px-3 text-white font-medium">{rec.date}</td>
                  <td className="py-2 px-3 text-gray-300 font-semibold">{formatVal(rec.chestCm)} {unit}</td>
                  <td className="py-2 px-3 text-orange-400 font-semibold">{formatVal(rec.waistCm)} {unit}</td>
                  <td className="py-2 px-3 text-gray-300">{formatVal(rec.shouldersCm)} {unit}</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold">{formatVal(rec.leftBicepCm)} {unit}</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold">{formatVal(rec.rightBicepCm)} {unit}</td>
                  <td className="py-2 px-3 text-cyan-400">{formatVal(rec.leftThighCm)} {unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md p-6 shadow-2xl max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Record Body Circumference</h3>
                <p className="text-xs text-gray-400">Values in selected unit ({unit})</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Chest ({unit})</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder={unit === 'cm' ? '102' : '40'}
                    value={chest}
                    onChange={(e) => setChest(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Waist ({unit})</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder={unit === 'cm' ? '81' : '32'}
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Shoulders ({unit})</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder={unit === 'cm' ? '120' : '47'}
                    value={shoulders}
                    onChange={(e) => setShoulders(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Hips ({unit})</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder={unit === 'cm' ? '96' : '38'}
                    value={hips}
                    onChange={(e) => setHips(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Left Bicep ({unit})</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder={unit === 'cm' ? '38' : '15'}
                    value={leftBicep}
                    onChange={(e) => setLeftBicep(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Right Bicep ({unit})</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder={unit === 'cm' ? '38.5' : '15.2'}
                    value={rightBicep}
                    onChange={(e) => setRightBicep(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Thigh ({unit})</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder={unit === 'cm' ? '58' : '23'}
                    value={thighs}
                    onChange={(e) => setThighs(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Calves ({unit})</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder={unit === 'cm' ? '38' : '15'}
                    value={calves}
                    onChange={(e) => setCalves(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 active:scale-95 transition-all"
                >
                  Save Measurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
