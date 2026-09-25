import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkoutSession } from '../../types/workout';
import {
  Calendar,
  Clock,
  Dumbbell,
  Trophy,
  ChevronDown,
  ChevronUp,
  Trash2,
  TrendingUp
} from 'lucide-react';

export const WorkoutHistory: React.FC = () => {
  const { workoutHistory, deleteWorkoutSession } = useApp();
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedSessionId(prev => prev === id ? null : id);
  };

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins % 60}m`;
    }
    return `${mins}m`;
  };

  if (workoutHistory.length === 0) {
    return (
      <div className="text-center py-10 px-4 rounded-2xl bg-gray-900/50 border border-gray-800 text-gray-400">
        <Trophy className="w-10 h-10 text-gray-600 mx-auto mb-2" />
        <p className="text-sm font-semibold">No workout sessions recorded yet.</p>
        <p className="text-xs text-gray-500 mt-1">Complete your first workout to see your volume stats!</p>
      </div>
    );
  }

  // Calculate stats
  const totalVolume = workoutHistory.reduce((acc, w) => acc + w.totalVolumeKg, 0);
  const totalSessions = workoutHistory.length;

  return (
    <div className="space-y-4">
      {/* Mini Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
          <span className="text-[11px] text-gray-400 block">Total Workouts</span>
          <span className="text-lg font-black text-white">{totalSessions}</span>
        </div>
        <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
          <span className="text-[11px] text-gray-400 block">Lifetime Volume</span>
          <span className="text-lg font-black text-orange-400">{totalVolume.toLocaleString()} kg</span>
        </div>
        <div className="p-3 rounded-xl bg-gray-900/80 border border-gray-800 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-gray-400 block">Consistency Score</span>
          <span className="text-lg font-black text-emerald-400">Top 5%</span>
        </div>
      </div>

      {/* History Items */}
      <div className="space-y-3">
        {workoutHistory.map((session) => {
          const isExpanded = expandedSessionId === session.id;
          return (
            <div
              key={session.id}
              className="rounded-2xl bg-gray-900/90 border border-gray-800 hover:border-gray-700 transition-all overflow-hidden"
            >
              {/* Summary Row */}
              <div
                onClick={() => toggleExpand(session.id)}
                className="p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {session.date}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(session.durationSeconds)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {session.routineName}
                  </h3>

                  <div className="flex items-center gap-3 mt-1.5 text-xs">
                    <span className="text-orange-400 font-semibold">
                      {session.totalVolumeKg.toLocaleString()} kg lifted
                    </span>
                    <span className="text-gray-400">
                      {session.totalSets} sets
                    </span>
                    <span className="text-gray-400">
                      {session.totalReps} reps
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this workout from history?')) {
                        deleteWorkoutSession(session.id);
                      }
                    }}
                    className="p-2 text-gray-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="p-1 rounded-lg bg-gray-800 text-gray-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Set Details */}
              {isExpanded && (
                <div className="p-4 bg-gray-950/50 border-t border-gray-800 space-y-3">
                  {session.notes && (
                    <div className="p-2.5 rounded-lg bg-gray-800/60 text-xs text-gray-300 italic">
                      "{session.notes}"
                    </div>
                  )}

                  <div className="space-y-3">
                    {session.exercises.map((ex, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-gray-900 border border-gray-800/80">
                        <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
                          <span>{ex.exerciseName}</span>
                          <span className="text-orange-400 capitalize">{ex.category}</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          {ex.sets.map((s) => (
                            <div
                              key={s.id}
                              className={`p-1.5 rounded-lg text-xs font-mono text-center ${
                                s.completed
                                  ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-gray-800 text-gray-400'
                              }`}
                            >
                              <span className="text-gray-400 text-[10px]">S{s.setNumber}: </span>
                              <strong>{s.weight}kg</strong> × {s.reps}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
