import React, { useState, useEffect } from 'react';
import { Exercise } from '../../types/workout';
import {
  X,
  Dumbbell,
  Target,
  CheckCircle,
  Flame,
  Play,
  Pause,
  RotateCw,
  Layers,
  Sparkles,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  onClose: () => void;
  onAddToWorkout?: (exercise: Exercise) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose,
  onAddToWorkout
}) => {
  if (!exercise) return null;

  // Build the list of frames for animated looping
  const frames = React.useMemo(() => {
    if (exercise.images && exercise.images.length > 0) {
      return exercise.images;
    }
    const list: string[] = [];
    if (exercise.imageUrl) list.push(exercise.imageUrl);
    if (exercise.gifUrl && exercise.gifUrl !== exercise.imageUrl) list.push(exercise.gifUrl);
    return list;
  }, [exercise]);

  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(900); // ms per frame
  const [imageError, setImageError] = useState(false);

  // Auto-looping animation effect between frames (simulates GIF with free-exercise-db 2-phase photos)
  useEffect(() => {
    if (!isPlaying || frames.length <= 1) return;

    const timer = setInterval(() => {
      setActiveFrameIndex((prev) => (prev + 1) % frames.length);
    }, playbackSpeed);

    return () => clearInterval(timer);
  }, [isPlaying, frames.length, playbackSpeed]);

  // Reset index when exercise changes
  useEffect(() => {
    setActiveFrameIndex(0);
    setImageError(false);
  }, [exercise.id]);

  const currentFrameUrl = frames[activeFrameIndex] || exercise.imageUrl || exercise.gifUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between bg-gray-900/90 backdrop-blur">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[11px] font-extrabold uppercase tracking-wider">
                {exercise.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-300 text-[11px] font-semibold uppercase tracking-wider border border-gray-700">
                {exercise.equipment}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-semibold capitalize border border-emerald-500/30">
                {exercise.difficulty}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{exercise.name}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Animated GIF / Multi-frame Form Visualizer */}
          {frames.length > 0 && !imageError ? (
            <div className="rounded-3xl overflow-hidden border border-gray-800 bg-gray-950/80 shadow-inner relative group flex flex-col items-center">
              <div className="w-full aspect-[4/3] sm:aspect-video max-h-72 flex items-center justify-center p-2 relative bg-black/40">
                <img
                  src={currentFrameUrl}
                  alt={`${exercise.name} phase ${activeFrameIndex + 1}`}
                  className="w-full h-full object-contain transition-opacity duration-300 rounded-2xl"
                  onError={() => setImageError(true)}
                  loading="eager"
                />

                {/* Looping Phase Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur text-[11px] font-bold text-orange-400 border border-orange-500/30 flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span>
                    {frames.length > 1
                      ? `Phase ${activeFrameIndex + 1} of ${frames.length}: ${
                          activeFrameIndex === 0 ? 'Starting Stretch' : 'Peak Contraction'
                        }`
                      : 'Form Illustration'}
                  </span>
                </div>
              </div>

              {/* Player Controls Bar */}
              {frames.length > 1 && (
                <div className="w-full px-4 py-2.5 bg-gray-900/90 border-t border-gray-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying((p) => !p)}
                      className="px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-bold border border-orange-500/30 flex items-center gap-1.5 transition-colors"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause Loop</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-orange-400" />
                          <span>Play Loop</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setPlaybackSpeed((s) => (s === 900 ? 1500 : 900))}
                      className="px-2.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-750 text-gray-300 font-semibold border border-gray-700 text-[11px] transition-colors"
                    >
                      Speed: {playbackSpeed === 900 ? '1x' : '0.6x Slow'}
                    </button>
                  </div>

                  {/* Frame switch buttons */}
                  <div className="flex items-center gap-1">
                    {frames.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setActiveFrameIndex(i);
                          setIsPlaying(false);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          activeFrameIndex === i
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {i === 0 ? '1 (Start)' : '2 (Lockout)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl p-5 bg-gradient-to-r from-orange-950/20 via-gray-900 to-amber-950/20 border border-orange-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block mb-1">
                  Biomechanical Execution Guide
                </span>
                <h4 className="text-sm font-semibold text-white">
                  Focus on full kinetic chain stretch & deliberate 2-second eccentric control.
                </h4>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
                <Dumbbell className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          )}

          {/* Primary & Secondary Target Muscles Card */}
          <div className="p-4 rounded-2xl bg-gray-850/80 border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2.5 text-xs">
              <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Target className="w-4 h-4" />
              </span>
              <div>
                <span className="text-gray-400 block text-[11px] font-semibold uppercase">Primary Agonist:</span>
                <strong className="text-white text-sm capitalize">{exercise.category}</strong>
              </div>
            </div>

            {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
              <div className="text-xs">
                <span className="text-gray-400 block text-[11px] font-semibold uppercase">Synergists & Stabilizers:</span>
                <div className="flex flex-wrap gap-1.5 mt-0.5">
                  {exercise.secondaryMuscles.map((muscle, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-gray-800 text-gray-300 text-[10px] font-medium capitalize border border-gray-700"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step-by-Step Form & Technique */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Step-by-Step Execution Cues</span>
            </h4>
            <ol className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              {exercise.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-850/50 border border-gray-800/80">
                  <span className="w-6 h-6 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 font-black text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Coach Pro Tips */}
          {exercise.tips && exercise.tips.length > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 via-gray-900 to-orange-950/20 border border-amber-500/30 shadow-md">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Coach Pro Tip for Maximum Hypertrophy</span>
              </h4>
              <ul className="text-xs sm:text-sm text-amber-100/90 space-y-1.5">
                {exercise.tips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-800 bg-gray-900/95 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-750 text-gray-300 text-xs font-semibold transition-colors"
          >
            Close
          </button>

          {onAddToWorkout && (
            <button
              onClick={() => {
                onAddToWorkout(exercise);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-transform active:scale-95"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Add to Active Workout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
