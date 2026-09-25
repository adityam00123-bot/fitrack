import React, { useState, useEffect, useRef } from 'react';
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
  Sparkles,
  Info,
  Clock,
  Eye,
  Camera
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

  const hasRealPhotos = Boolean(exercise.images && exercise.images.length > 0);
  const [viewMode, setViewMode] = useState<'3d_anatomy' | 'real_photos'>('3d_anatomy');

  const [isFrozen, setIsFrozen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Freeze/Pause GIF by capturing the current frame to canvas
  const handleToggleFreeze = () => {
    if (!isFrozen && imgRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const img = imgRef.current;
      canvas.width = img.naturalWidth || img.width || 400;
      canvas.height = img.naturalHeight || img.height || 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setIsFrozen(true);
      }
    } else {
      setIsFrozen(false);
    }
  };

  useEffect(() => {
    setIsFrozen(false);
    setImageLoaded(false);
    setImageError(false);
    setActivePhotoIndex(0);
    setViewMode('3d_anatomy');
  }, [exercise.id]);

  const gifUrl = exercise.gifUrl || exercise.imageUrl;
  const currentPhotoUrl = exercise.images && exercise.images[activePhotoIndex];

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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* View Mode Switcher (3D Anatomy Hevy Style vs Real Gym Photos) */}
          {hasRealPhotos && (
            <div className="flex items-center justify-between bg-gray-850 p-1.5 rounded-2xl border border-gray-750 text-xs">
              <span className="text-[11px] font-bold text-gray-400 pl-2">Display Style:</span>
              <div className="flex gap-1 font-bold">
                <button
                  onClick={() => {
                    setViewMode('3d_anatomy');
                    setIsFrozen(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    viewMode === '3d_anatomy'
                      ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3D Anatomy (Hevy Style)</span>
                </button>

                <button
                  onClick={() => {
                    setViewMode('real_photos');
                    setIsFrozen(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    viewMode === 'real_photos'
                      ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Real Gym Photos</span>
                </button>
              </div>
            </div>
          )}

          {/* Media Player Box */}
          <div className="rounded-3xl overflow-hidden border border-gray-800 bg-gray-950/90 shadow-inner relative group flex flex-col items-center">
            <div className="w-full aspect-[4/3] sm:aspect-video max-h-80 flex items-center justify-center p-2 relative bg-black/50">
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-900/80">
                  <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-gray-400 font-semibold">Loading animation...</span>
                </div>
              )}

              {/* Mode 1: 3D Anatomy GIF (Hevy Style) */}
              {viewMode === '3d_anatomy' && gifUrl && !imageError && (
                <>
                  <img
                    ref={imgRef}
                    src={gifUrl}
                    alt={`${exercise.name} full motion guide`}
                    className={`w-full h-full object-contain rounded-2xl transition-opacity duration-300 ${
                      imageLoaded && !isFrozen ? 'opacity-100' : isFrozen ? 'hidden' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    loading="eager"
                  />

                  {/* Frozen Frame Canvas */}
                  <canvas
                    ref={canvasRef}
                    className={`w-full h-full object-contain rounded-2xl ${isFrozen ? 'block' : 'hidden'}`}
                  />
                </>
              )}

              {/* Mode 2: Real Gym Photos (Start vs Lockout) */}
              {viewMode === 'real_photos' && currentPhotoUrl && (
                <img
                  src={currentPhotoUrl}
                  alt={`${exercise.name} photo phase ${activePhotoIndex + 1}`}
                  className="w-full h-full object-contain rounded-2xl"
                  loading="eager"
                />
              )}

              {/* Status Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur text-[11px] font-bold text-orange-400 border border-orange-500/30 flex items-center gap-1.5 shadow-md">
                <span className={`w-2 h-2 rounded-full ${isFrozen ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
                <span>
                  {viewMode === '3d_anatomy'
                    ? isFrozen
                      ? 'Frame Paused (Inspect Form)'
                      : 'Hevy 3D Anatomy Model'
                    : `Real Photo: ${activePhotoIndex === 0 ? 'Starting Stretch' : 'Peak Contraction'}`}
                </span>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="w-full px-4 py-2.5 bg-gray-900/90 border-t border-gray-800 flex items-center justify-between gap-3 text-xs">
              {viewMode === '3d_anatomy' ? (
                <>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleToggleFreeze}
                      className="px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-bold border border-orange-500/30 flex items-center gap-1.5 transition-colors"
                    >
                      {isFrozen ? (
                        <>
                          <Play className="w-3.5 h-3.5 fill-orange-400" />
                          <span>Resume Loop</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause / Freeze Frame</span>
                        </>
                      )}
                    </button>
                  </div>

                  <span className="text-[11px] text-gray-400 italic">
                    Tap Pause anytime to inspect joint alignment
                  </span>
                </>
              ) : (
                <div className="w-full flex items-center justify-between">
                  <span className="text-gray-400 font-medium">Select Position:</span>
                  <div className="flex items-center gap-1.5">
                    {exercise.images?.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePhotoIndex(i)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          activePhotoIndex === i
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {i === 0 ? 'Phase 1: Setup' : 'Phase 2: Lockout'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bar-Path & Kinetic Chain Note */}
          <div className="p-3.5 rounded-2xl bg-gray-850/60 border border-gray-800 flex items-start gap-2.5 text-xs text-gray-400">
            <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-200 block mb-0.5">Why the motion blur / ghosting in the middle?</strong>
              <p className="leading-relaxed">
                Just like in <strong>Hevy</strong> and <strong>FitNotes</strong>, 3D anatomical models use ghosting motion blur between the starting position and peak contraction to visualize the <strong>Bar Path trajectory</strong> while keeping the animation ultra-lightweight and smooth on mobile networks.
              </p>
            </div>
          </div>

          {/* Pro Lifting Cadence (Tempo Breakdown) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-850 to-gray-900 border border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-orange-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Recommended Rep Tempo (3-1-1-0 Cadence)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-gray-950/60 border border-gray-800">
                <span className="text-[10px] text-gray-500 font-semibold block uppercase">Eccentric</span>
                <strong className="text-white text-sm">2–3 Sec</strong>
                <span className="text-[10px] text-gray-400 block mt-0.5">Controlled stretch</span>
              </div>
              <div className="p-2 rounded-xl bg-gray-950/60 border border-gray-800">
                <span className="text-[10px] text-gray-500 font-semibold block uppercase">Isometric</span>
                <strong className="text-white text-sm">1 Sec</strong>
                <span className="text-[10px] text-gray-400 block mt-0.5">Full bottom pause</span>
              </div>
              <div className="p-2 rounded-xl bg-gray-950/60 border border-gray-800">
                <span className="text-[10px] text-gray-500 font-semibold block uppercase">Concentric</span>
                <strong className="text-white text-sm">1 Sec</strong>
                <span className="text-[10px] text-gray-400 block mt-0.5">Explosive pull/press</span>
              </div>
              <div className="p-2 rounded-xl bg-gray-950/60 border border-gray-800">
                <span className="text-[10px] text-gray-500 font-semibold block uppercase">Peak Contraction</span>
                <strong className="text-white text-sm">1 Sec</strong>
                <span className="text-[10px] text-gray-400 block mt-0.5">Hard muscle squeeze</span>
              </div>
            </div>
          </div>

          {/* Primary & Secondary Target Muscles Card */}
          <div className="p-4 rounded-2xl bg-gray-850/80 border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2.5 text-xs">
              <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Target className="w-4 h-4" />
              </span>
              <div>
                <span className="text-gray-400 block text-[11px] font-semibold uppercase">Target Agonist:</span>
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
