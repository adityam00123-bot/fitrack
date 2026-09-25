import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WeightLog } from '../../types/bodyTracker';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Scale,
  Calendar,
  Target,
  Activity,
  Trash2,
  X,
  Info
} from 'lucide-react';

export const WeightLogChart: React.FC = () => {
  const { weightLogs, logWeight, profile } = useApp();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState(profile.currentWeightKg || 74);
  const [newBodyFat, setNewBodyFat] = useState<string>('');
  const [newNotes, setNewNotes] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; log: WeightLog } | null>(null);

  // Sort logs by date ascending
  const sortedLogs = [...weightLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Filter based on timeRange
  const now = Date.now();
  const filteredLogs = sortedLogs.filter(l => {
    const diffDays = (now - new Date(l.date).getTime()) / (1000 * 3600 * 24);
    if (timeRange === '7d') return diffDays <= 7;
    if (timeRange === '30d') return diffDays <= 30;
    if (timeRange === '90d') return diffDays <= 90;
    return true;
  });

  const latestLog = sortedLogs[sortedLogs.length - 1];
  const firstLog = filteredLogs[0];
  const previousLog = sortedLogs.length > 1 ? sortedLogs[sortedLogs.length - 2] : null;
  const weightChangeVsLast = previousLog && latestLog ? latestLog.weightKg - previousLog.weightKg : 0;
  const totalChangeInRange = firstLog && latestLog ? latestLog.weightKg - firstLog.weightKg : 0;

  // Rate of change (kg / week)
  const rangeDays = firstLog && latestLog
    ? Math.max(1, (new Date(latestLog.date).getTime() - new Date(firstLog.date).getTime()) / (1000 * 3600 * 24))
    : 7;
  const weeklyRate = parseFloat(((totalChangeInRange / rangeDays) * 7).toFixed(2));

  // Target Goal
  const targetWeight = profile.targetWeightKg || 70.0;
  const toGoal = latestLog ? Math.abs(latestLog.weightKg - targetWeight).toFixed(1) : '0';

  // Chart coordinate calculations
  const weights = filteredLogs.map(l => l.weightKg);
  const minW = weights.length > 0 ? Math.min(...weights, targetWeight) - 1.5 : 65;
  const maxW = weights.length > 0 ? Math.max(...weights, targetWeight) + 1.5 : 85;
  const range = maxW - minW || 1;

  const chartWidth = 640;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 25;

  const points = filteredLogs.map((l, idx) => {
    const x = filteredLogs.length > 1
      ? paddingX + (idx / (filteredLogs.length - 1)) * (chartWidth - paddingX * 2)
      : chartWidth / 2;
    const y = chartHeight - paddingY - ((l.weightKg - minW) / range) * (chartHeight - paddingY * 2);
    return { x, y, log: l };
  });

  // Calculate 7-day Moving Average points
  const movingAvgPoints = filteredLogs.map((l, idx) => {
    // take up to 7 previous items
    const slice = filteredLogs.slice(Math.max(0, idx - 6), idx + 1);
    const avg = slice.reduce((sum, item) => sum + item.weightKg, 0) / slice.length;
    const x = points[idx].x;
    const y = chartHeight - paddingY - ((avg - minW) / range) * (chartHeight - paddingY * 2);
    return { x, y, avg };
  });

  const pathD = points.length > 1
    ? points.reduce((acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '')
    : '';

  const movingAvgPathD = movingAvgPoints.length > 1
    ? movingAvgPoints.reduce((acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '')
    : '';

  // Target reference line y
  const targetY = chartHeight - paddingY - ((targetWeight - minW) / range) * (chartHeight - paddingY * 2);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight || newWeight <= 0) return;
    logWeight(newWeight, newBodyFat ? parseFloat(newBodyFat) : undefined, newNotes.trim() || undefined);
    setIsLogModalOpen(false);
    setNewNotes('');
  };

  return (
    <div className="space-y-4">
      {/* Top Stats Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gray-900/90 border border-gray-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block mb-1">
              Body Weight Analytics
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {latestLog ? latestLog.weightKg : profile.currentWeightKg} kg
              </span>
              {previousLog && (
                <div
                  className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-xl border ${
                    weightChangeVsLast <= 0
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                  }`}
                >
                  {weightChangeVsLast <= 0 ? <TrendingDown className="w-3.5 h-3.5 mr-1" /> : <TrendingUp className="w-3.5 h-3.5 mr-1" />}
                  <span>{Math.abs(weightChangeVsLast).toFixed(1)} kg vs last</span>
                </div>
              )}
            </div>

            {/* Sub statistics: Weekly Rate & Target Distance */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Rate: <strong className={weeklyRate <= 0 ? 'text-emerald-400' : 'text-orange-400'}>{weeklyRate > 0 ? `+${weeklyRate}` : weeklyRate} kg/wk</strong></span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-orange-400" />
                <span>Goal ({targetWeight} kg): <strong className="text-white">{toGoal} kg remaining</strong></span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Time range buttons */}
            <div className="flex bg-gray-800 rounded-2xl p-1 text-xs">
              {(['7d', '30d', '90d', 'all'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-3 py-1.5 rounded-xl font-bold uppercase transition-colors ${
                    timeRange === t ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsLogModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/25 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Log Weight</span>
            </button>
          </div>
        </div>

        {/* Legend indicator */}
        <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-2 border-t border-gray-800/80">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>Daily Weigh-In</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-cyan-400 border-dashed" />
            <span>7-Day Rolling Trend</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-emerald-400 border-dashed" />
            <span>Target Goal ({targetWeight} kg)</span>
          </span>
        </div>

        {/* SVG Interactive Weight Curve */}
        <div className="w-full overflow-x-auto relative">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-56 overflow-visible select-none"
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <defs>
              <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="#374151" strokeDasharray="3 3" opacity="0.3" />
            <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="#374151" strokeDasharray="3 3" opacity="0.3" />
            <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#374151" strokeDasharray="3 3" opacity="0.3" />

            {/* Target Weight Reference Line */}
            {targetY >= paddingY && targetY <= chartHeight - paddingY && (
              <g>
                <line
                  x1={paddingX}
                  y1={targetY}
                  x2={chartWidth - paddingX}
                  y2={targetY}
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.7"
                />
                <text
                  x={chartWidth - paddingX - 4}
                  y={targetY - 5}
                  textAnchor="end"
                  fill="#10b981"
                  fontSize="9"
                  fontWeight="bold"
                >
                  Goal: {targetWeight} kg
                </text>
              </g>
            )}

            {/* Area fill */}
            {points.length > 1 && (
              <path
                d={`${pathD} L ${points[points.length - 1].x},${chartHeight - paddingY} L ${points[0].x},${chartHeight - paddingY} Z`}
                fill="url(#weightGrad)"
              />
            )}

            {/* 7-day Moving Average smooth line */}
            {movingAvgPoints.length > 1 && (
              <path
                d={movingAvgPathD}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="3 3"
                opacity="0.85"
              />
            )}

            {/* Main Weight line stroke */}
            {points.length > 1 && (
              <path
                d={pathD}
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
                strokeLinecap="round"
                className="drop-shadow-md"
              />
            )}

            {/* Interactive Points */}
            {points.map((pt, i) => (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt)}
                onClick={() => setHoveredPoint(pt)}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill="#f97316"
                  stroke="#111827"
                  strokeWidth="2"
                  className="hover:r-7 transition-all duration-150"
                />
              </g>
            ))}
          </svg>

          {/* Hover Tooltip Popup */}
          {hoveredPoint && (
            <div
              className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-gray-950/95 border border-orange-500/40 px-3 py-2 rounded-xl text-xs shadow-2xl backdrop-blur-md transition-all duration-100"
              style={{
                left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                top: `${(hoveredPoint.y / chartHeight) * 100 - 8}%`
              }}
            >
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="text-orange-400 font-black text-sm">{hoveredPoint.log.weightKg} kg</span>
                {hoveredPoint.log.bodyFatPercentage && (
                  <span className="text-cyan-400 text-[10px]">({hoveredPoint.log.bodyFatPercentage}% BF)</span>
                )}
              </div>
              <div className="text-[10px] text-gray-400">{hoveredPoint.log.date}</div>
              {hoveredPoint.log.notes && (
                <div className="text-[10px] text-amber-300 mt-0.5 max-w-xs">{hoveredPoint.log.notes}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent Weigh-in History Table */}
      <div className="p-5 rounded-3xl bg-gray-900/90 border border-gray-800 shadow-sm space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-orange-400" />
          <span>Recent Weigh-In Records</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 uppercase text-[10px] font-bold">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Weight</th>
                <th className="py-2 px-3">Body Fat</th>
                <th className="py-2 px-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {sortedLogs.slice(-7).reverse().map((log) => (
                <tr key={log.id} className="hover:bg-gray-850/50 transition-colors">
                  <td className="py-2 px-3 text-white font-medium">{log.date}</td>
                  <td className="py-2 px-3 text-orange-400 font-bold">{log.weightKg} kg</td>
                  <td className="py-2 px-3 text-cyan-400">
                    {log.bodyFatPercentage ? `${log.bodyFatPercentage}%` : '--'}
                  </td>
                  <td className="py-2 px-3 text-gray-400">{log.notes || '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Weight Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white">Record Morning Weigh-In</h3>
              <button onClick={() => setIsLogModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">Weigh yourself first thing in the morning post-restroom for best accuracy</p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Current Weight (kg) *</label>
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
                <label className="text-xs font-bold text-gray-300 block mb-1">Body Fat % (Optional)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 15.5"
                  value={newBodyFat}
                  onChange={(e) => setNewBodyFat(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Notes / Cues</label>
                <input
                  type="text"
                  placeholder="e.g. Post high carb refeed, slept 8 hrs"
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 active:scale-95 transition-all"
                >
                  Save Weigh-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
