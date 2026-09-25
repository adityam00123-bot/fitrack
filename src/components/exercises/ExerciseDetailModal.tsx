import React, { useState, useEffect, useRef } from 'react';
import { Exercise } from '../../types/workout';
import { findHevyVideoUrl } from '../../data/hevyVideoMap';
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
  Camera,
  Gauge,
  Sliders,
  Check
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

  // Resolve video URL: exercise.videoUrl first, then intelligent lookup in 222+ Hevy dataset & local files
  const effectiveVideoUrl = exercise.videoUrl || findHevyVideoUrl(exercise.name, exercise.id);
  const hasVideo = Boolean(effectiveVideoUrl);
  const hasGif = Boolean(exercise.gifUrl || exercise.imageUrl);
  const hasRealPhotos = Boolean(exercise.images && exercise.images.length > 0);

  const [viewMode, setViewMode] = useState<'video' | '3d_gif' | 'real_photos'>(
    hasVideo ? 'video' : hasGif ? '3d_gif' : 'real_photos'
  );

  const [isPlaying, setIsPlaying] = useState(true);
  const [videoSpeed, setVideoSpeed] = useState<number>(0.75); // 0.75x tempo is ideal for lifting study
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Synchronize video playback speed whenever speed, mode, or media load changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = videoSpeed;
    }
  }, [videoSpeed, viewMode, exercise.id, mediaLoaded]);

  // Handle Play/Pause toggle
  const togglePlayPause = () => {
    if (viewMode === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    } else if (viewMode === '3d_gif') {
      if (isPlaying && imgRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const img = imgRef.current;
        canvas.width = img.naturalWidth || img.width || 400;
        canvas.height = img.naturalHeight || img.height || 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setIsPlaying(false);
        }
      } else {
        setIsPlaying(true);
      }
    }
  };

  // Reset states on exercise change
  useEffect(() => {
    setIsPlaying(true);
    setMediaLoaded(false);
    setMediaError(false);
    setActivePhotoIndex(0);
    setCurrentTime(0);
    setDuration(0);
    setViewMode(hasVideo ? 'video' : hasGif ? '3d_gif' : 'real_photos');
  }, [exercise.id, hasVideo, hasGif]);

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
              {hasVideo && (
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black border border-cyan-500/40 flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-2.5 h-2.5" />
                  60 FPS HD • 0% Blur
                </span>
              )}
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
          {/* View Mode Switcher: Show when more than 1 mode is available */}
          {(hasVideo && (hasGif || hasRealPhotos)) || (hasGif && hasRealPhotos) ? (
            <div className="flex flex-wrap items-center justify-between bg-gray-850 p-1.5 rounded-2xl border border-gray-750 text-xs gap-2">
              <span className="text-[11px] font-bold text-gray-400 pl-2">Display Mode:</span>
              <div className="flex gap-1 font-bold flex-wrap">
                {hasVideo && (
                  <button
                    onClick={() => {
                      setViewMode('video');
                      setMediaLoaded(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'video'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>60 FPS Video</span>
                    <span className="px-1.5 py-0.2 text-[9px] bg-cyan-950 text-cyan-200 font-extrabold rounded-full uppercase border border-cyan-400/40">
                      0% Blur
                    </span>
                  </button>
                )}

                {hasGif && (
                  <button
                    onClick={() => {
                      setViewMode('3d_gif');
                      setMediaLoaded(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      viewMode === '3d_gif'
                        ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/20'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>3D Animated Model</span>
                  </button>
                )}

                {hasRealPhotos && (
                  <button
                    onClick={() => {
                      setViewMode('real_photos');
                      setMediaLoaded(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'real_photos'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Real Gym Photos</span>
                  </button>
                )}
              </div>
            </div>
          ) : null}

          {/* Media Player Box */}
          <div className="rounded-3xl overflow-hidden border border-gray-800 bg-gray-950/90 shadow-inner relative group flex flex-col items-center">
            <div className="w-full aspect-[4/3] sm:aspect-video max-h-80 flex items-center justify-center p-2 relative bg-black/50">
              {!mediaLoaded && !mediaError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-900/80 z-10">
                  <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-gray-400 font-semibold">Loading exercise visual...</span>
                </div>
              )}

              {/* View 1: 60 FPS Native MP4 Video (Exact Hevy Asset with 0% Motion Blur) */}
              {viewMode === 'video' && effectiveVideoUrl && (
                <video
                  ref={videoRef}
                  src={effectiveVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onLoadedData={() => {
                    setMediaLoaded(true);
                    if (videoRef.current) {
                      videoRef.current.playbackRate = videoSpeed;
                    }
                  }}
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      setDuration(videoRef.current.duration);
                    }
                  }}
                  onTimeUpdate={() => {
                    if (!isScrubbing && videoRef.current) {
                      setCurrentTime(videoRef.current.currentTime);
                    }
                  }}
                  onError={() => {
                    if (hasGif) setViewMode('3d_gif');
                  }}
                  className={`w-full h-full object-contain rounded-2xl transition-opacity duration-300 ${
                    mediaLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}

              {/* View 2: Fallback 3D Animated GIF */}
              {viewMode === '3d_gif' && (exercise.gifUrl || exercise.imageUrl) && (
                <>
                  <img
                    ref={imgRef}
                    src={exercise.gifUrl || exercise.imageUrl}
                    alt={`${exercise.name} demonstration`}
                    onLoad={() => setMediaLoaded(true)}
                    onError={() => setMediaError(true)}
                    className={`w-full h-full object-contain rounded-2xl transition-opacity duration-300 ${
                      mediaLoaded && isPlaying ? 'opacity-100' : !isPlaying ? 'hidden' : 'opacity-0'
                    }`}
                  />
                  <canvas
                    ref={canvasRef}
                    className={`w-full h-full object-contain rounded-2xl ${!isPlaying ? 'block' : 'hidden'}`}
                  />
                </>
              )}

              {/* View 3: Real Gym Photos */}
              {viewMode === 'real_photos' && exercise.images && (
                <img
                  src={exercise.images[activePhotoIndex]}
                  alt={`${exercise.name} photo phase ${activePhotoIndex + 1}`}
                  className="w-full h-full object-contain rounded-2xl"
                  onLoad={() => setMediaLoaded(true)}
                />
              )}

              {/* Status Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/85 backdrop-blur text-[11px] font-bold text-white border border-gray-700/80 flex items-center gap-1.5 shadow-md">
                <span
                  className={`w-2 h-2 rounded-full ${
                    !isPlaying
                      ? 'bg-amber-400'
                      : viewMode === 'video'
                      ? 'bg-cyan-400 animate-pulse'
                      : 'bg-emerald-400 animate-pulse'
                  }`}
                />
                <span>
                  {viewMode === 'video'
                    ? isPlaying
                      ? `60 FPS Video (${videoSpeed}x Speed)`
                      : 'Video Paused'
                    : viewMode === '3d_gif'
                    ? isPlaying
                      ? '3D Animated Model'
                      : 'Frame Paused'
                    : `Real Photo: ${activePhotoIndex === 0 ? 'Starting Stretch' : 'Peak Lockout'}`}
                </span>
              </div>
            </div>

            {/* Video Scrubber Timeline Bar (Active in video mode) */}
            {viewMode === 'video' && duration > 0 && (
              <div className="w-full px-4 pt-2 bg-gray-900/95 flex items-center gap-2">
                <span className="text-[10px] text-gray-400 font-mono w-7 text-right">
                  {currentTime.toFixed(1)}s
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration || 1}
                  step="0.05"
                  value={currentTime}
                  onMouseDown={() => setIsScrubbing(true)}
                  onTouchStart={() => setIsScrubbing(true)}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setCurrentTime(val);
                    if (videoRef.current) {
                      videoRef.current.currentTime = val;
                    }
                  }}
                  onMouseUp={() => setIsScrubbing(false)}
                  onTouchEnd={() => setIsScrubbing(false)}
                  className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400"
                />
                <span className="text-[10px] text-gray-500 font-mono w-7">
                  {duration.toFixed(1)}s
                </span>
              </div>
            )}

            {/* Bottom Playback & Speed Controls */}
            <div className="w-full px-4 py-3 bg-gray-900/90 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Play / Pause Button */}
                <button
                  onClick={togglePlayPause}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-bold border border-orange-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause movement' : 'Play movement'}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-orange-400" />
                      <span>Play</span>
                    </>
                  )}
                </button>

                {/* Speed Controls for 60fps Video: 0.5x Slow, 0.75x Tempo, 1.0x Normal */}
                {viewMode === 'video' && (
                  <div className="flex items-center gap-1 bg-gray-950 p-1 rounded-xl border border-gray-800 shadow-inner">
                    <Gauge className="w-3.5 h-3.5 text-orange-400 ml-1.5 mr-0.5" />
                    <span className="text-[11px] font-bold text-gray-400 mr-1 hidden sm:inline">Speed:</span>
                    {[
                      { speed: 0.5, label: '0.5x Slow' },
                      { speed: 0.75, label: '0.75x Tempo' },
                      { speed: 1.0, label: '1.0x Normal' }
                    ].map((s) => (
                      <button
                        key={s.speed}
                        onClick={() => {
                          setVideoSpeed(s.speed);
                          if (videoRef.current) {
                            videoRef.current.playbackRate = s.speed;
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                          videoSpeed === s.speed
                            ? 'bg-orange-500 text-white shadow-sm ring-1 ring-orange-400'
                            : 'text-gray-400 hover:text-white hover:bg-gray-850'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Real Photos Stepper */}
              {viewMode === 'real_photos' && exercise.images && (
                <div className="flex items-center gap-1.5">
                  {exercise.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhotoIndex(i)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activePhotoIndex === i
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'bg-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      {i === 0 ? 'Phase 1: Setup' : 'Phase 2: Lockout'}
                    </button>
                  ))}
                </div>
              )}

              {/* Status Note */}
              <div className="text-[11px] text-gray-400 flex items-center gap-1">
                {viewMode === 'video' ? (
                  <span className="text-cyan-400 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Hevy Native 60 FPS • Zero Blur
                  </span>
                ) : hasVideo ? (
                  <button
                    onClick={() => {
                      setViewMode('video');
                      setMediaLoaded(false);
                    }}
                    className="text-cyan-400 hover:underline cursor-pointer font-semibold"
                  >
                    Switch to 60 FPS Video →
                  </button>
                ) : (
                  <span className="italic text-gray-400">Looping movement demonstration</span>
                )}
              </div>
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
            className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-750 text-gray-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>

          {onAddToWorkout && (
            <button
              onClick={() => {
                onAddToWorkout(exercise);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
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
