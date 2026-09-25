import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, TrendingUp, TrendingDown, Scale, Calendar } from 'lucide-react';

export const WeightLogChart: React.FC = () => {
  const { weightLogs, logWeight, profile } = useApp();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState(profile.currentWeightKg || 74);
  const [newBodyFat, setNewBodyFat] = useState<string>('');
  const [newNotes, setNewNotes] = useState('');

  // Sort logs by date ascending
  const sortedLogs = [...weightLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Filter based on timeRange
  const now = Date.now();
  const filteredLogs = sortedLogs.filter(l => {
    const diffDays = (now - new Date(l.date).getTime()) / (1000 * 3600 * 24);
    if (timeRange === '7d') return diffDays <= 7;
    if (timeRange === '30d') return diffDays <= 30;
    return true;
  });

  const latestLog = sortedLogs[sortedLogs.length - 1];
  const previousLog = sortedLogs.length > 1 ? sortedLogs[sortedLogs.length - 2] : null;
  const weightChange = previousLog ? latestLog.weightKg - previousLog.weightKg : 0;

  // Chart coordinate calculations
  const weights = filteredLogs.map(l => l.weightKg);
  const minW = weights.length > 0 ? Math.min(...weights) - 1 : 65;
  const maxW = weights.length > 0 ? Math.max(...weights) + 1 : 85;
  const range = maxW - minW || 1;

  const chartWidth = 600;
  const chartHeight = 200;

  const points = filteredLogs.map((l, idx) => {
    const x = filteredLogs.length > 1 ? (idx / (filteredLogs.length - 1)) * (chartWidth - 60) + 30 : chartWidth / 2;
    const y = chartHeight - ((l.weightKg - minW) / range) * (chartHeight - 40) - 20;
    return { x, y, log: l };
  });

  const pathD = points.length > 1
    ? points.reduce((acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '')
    : '';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight || newWeight <= 0) return;
    logWeight(newWeight, newBodyFat ? parseFloat(newBodyFat) : undefined, newNotes.trim() || undefined);
    setIsLogModalOpen(false);
    setNewNotes('');
  };

  return (
    <div className="space-y-4">
      {/* Top Controls & Current Weight stat */}
      <div className="p-5 rounded-3xl bg-gray-900/90 border border-gray-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block mb-1">
              Weight Progression
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {latestLog ? latestLog.weightKg : profile.currentWeightKg} kg
              </span>
              {previousLog && (
                <div
                  className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-lg ${
                    weightChange <= 0
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                  }`}
                >
                  {weightChange <= 0 ? <TrendingDown className="w-3.5 h-3.5 mr-1" /> : <TrendingUp className="w-3.5 h-3.5 mr-1" />}
                  <span>{Math.abs(weightChange).toFixed(1)} kg vs last weigh-in</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Time range buttons */}
            <div className="flex bg-gray-800 rounded-xl p-1 text-xs">
              {(['7d', '30d', 'all'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-3 py-1 rounded-lg font-bold uppercase transition-colors ${
                    timeRange === t ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsLogModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Log Weight</span>
            </button>
          </div>
        </div>

        {/* SVG Interactive Weight Curve */}
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 overflow-visible">
            <defs>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="30" y1="20" x2={chartWidth - 30} y2="20" stroke="#374151" strokeDasharray="3 3" opacity="0.4" />
            <line x1="30" y1={chartHeight / 2} x2={chartWidth - 30} y2={chartHeight / 2} stroke="#374151" strokeDasharray="3 3" opacity="0.4" />
            <line x1="30" y1={chartHeight - 20} x2={chartWidth - 30} y2={chartHeight - 20} stroke="#374151" strokeDasharray="3 3" opacity="0.4" />

            {/* Area fill */}
            {points.length > 1 && (
              <path
                d={`${pathD} L ${points[points.length - 1].x},${chartHeight - 20} L ${points[0].x},${chartHeight - 20} Z`}
                fill="url(#weightGrad)"
              />
            )}

            {/* Line stroke */}
            {points.length > 1 && (
              <path d={pathD} fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
            )}

            {/* Points */}
            {points.map((pt, i) => (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r="4" fill="#f97316" className="hover:r-6 transition-all" />
                <text
                  x={pt.x}
                  y={pt.y - 8}
                  textAnchor="middle"
                  fill="#e5e7eb"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {pt.log.weightKg}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Log Weight Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Record Weigh-In</h3>
            <p className="text-xs text-gray-400 mb-4">Weigh yourself first thing in the morning for best accuracy</p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Current Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-base font-bold focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Body Fat % (Optional)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 15.5"
                  value={newBodyFat}
                  onChange={(e) => setNewBodyFat(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Post rest day, low sodium"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white text-xs font-bold shadow-md shadow-orange-500/20"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
