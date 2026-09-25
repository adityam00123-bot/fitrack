import React from 'react';
import { useApp } from '../../context/AppContext';
import { Timer, Play, Pause, X, Plus, Minus, Volume2 } from 'lucide-react';

export const RestTimerWidget: React.FC = () => {
  const {
    restSecondsLeft,
    restTotalSeconds,
    isRestActive,
    pauseRestTimer,
    resumeRestTimer,
    stopRestTimer,
    adjustRestTimer
  } = useApp();

  if (restSecondsLeft <= 0 && !isRestActive) {
    return null;
  }

  const minutes = Math.floor(restSecondsLeft / 60);
  const seconds = restSecondsLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const progressPercent = restTotalSeconds > 0
    ? Math.max(0, Math.min(100, (restSecondsLeft / restTotalSeconds) * 100))
    : 0;

  return (
    <div className="fixed bottom-16 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 animate-bounce-in">
      <div className="bg-gray-900/95 backdrop-blur-md border border-orange-500/40 shadow-2xl shadow-orange-950/40 rounded-2xl p-4 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400">
              <Timer className="w-4 h-4 animate-spin" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Rest Timer</span>
            <Volume2 className="w-3.5 h-3.5 text-gray-400" />
          </div>

          <button
            onClick={stopRestTimer}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title="Skip Rest"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Countdown Display */}
        <div className="flex items-baseline justify-between my-2">
          <div className="text-3xl font-black font-mono tracking-tight text-white">
            {formattedTime}
          </div>
          <div className="text-xs text-gray-400">
            {isRestActive ? 'Take deep breaths & hydrate' : 'Timer Paused'}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => adjustRestTimer(-15)}
              className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Minus className="w-3 h-3" /> 15s
            </button>
            <button
              onClick={() => adjustRestTimer(15)}
              className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" /> 15s
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isRestActive ? (
              <button
                onClick={pauseRestTimer}
                className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Pause className="w-3.5 h-3.5" /> Pause
              </button>
            ) : (
              <button
                onClick={resumeRestTimer}
                className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5" /> Resume
              </button>
            )}

            <button
              onClick={stopRestTimer}
              className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 text-xs font-semibold transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
