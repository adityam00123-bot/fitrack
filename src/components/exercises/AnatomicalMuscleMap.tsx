import React, { useState } from 'react';
import { MuscleGroup } from '../../types/workout';
import { RefreshCw, Sparkles, Target, Eye } from 'lucide-react';

interface AnatomicalMuscleMapProps {
  selectedMuscle: string;
  onSelectMuscle: (muscle: string) => void;
  exerciseCounts?: Record<string, number>;
}

export const AnatomicalMuscleMap: React.FC<AnatomicalMuscleMapProps> = ({
  selectedMuscle,
  onSelectMuscle,
  exerciseCounts = {}
}) => {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

  // Helper to determine fill & glow classes based on selection & hover
  const getMuscleClasses = (muscle: string) => {
    const isSelected = selectedMuscle === muscle;
    const isHovered = hoveredMuscle === muscle;

    if (isSelected) {
      return 'fill-orange-500 stroke-amber-300 stroke-2 filter drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] cursor-pointer transition-all duration-200';
    }
    if (isHovered) {
      return 'fill-orange-500/70 stroke-orange-400 stroke-1.5 filter drop-shadow-[0_0_6px_rgba(249,115,22,0.5)] cursor-pointer transition-all duration-150';
    }
    return 'fill-gray-750/90 hover:fill-orange-500/50 stroke-gray-650 hover:stroke-orange-400 stroke-[1] cursor-pointer transition-all duration-150';
  };

  const getNeutralBoneClass = () => 'fill-gray-800/40 stroke-gray-700/60 stroke-[0.8]';

  return (
    <div className="bg-gradient-to-br from-gray-900/95 via-[#0f121d] to-gray-900/95 border border-gray-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title and Front/Back Flip Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Target className="w-4 h-4" />
            </span>
            <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Interactive Muscle Heatmap</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Workout.Cool Model
              </span>
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Click on any muscle group to instantly filter form guides & exercises
          </p>
        </div>

        {/* View Switcher Button */}
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-800/90 p-1 rounded-xl border border-gray-700/80 text-xs font-semibold">
            <button
              onClick={() => setView('front')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                view === 'front'
                  ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>Anterior (Front)</span>
            </button>
            <button
              onClick={() => setView('back')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                view === 'back'
                  ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>Posterior (Back)</span>
            </button>
          </div>

          {selectedMuscle !== 'all' && (
            <button
              onClick={() => onSelectMuscle('all')}
              className="px-2.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Reset to All Muscles"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Anatomy Graphic & Details Row */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative z-10 py-2">
        {/* SVG Anatomy Canvas */}
        <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[1/1.6] flex items-center justify-center">
          <svg
            viewBox="0 0 300 480"
            className="w-full h-full drop-shadow-2xl select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bodyBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e2330" />
                <stop offset="100%" stopColor="#141822" />
              </linearGradient>
            </defs>

            {/* Static Head & Neck Silhouette */}
            <circle cx="150" cy="42" r="22" className={getNeutralBoneClass()} />
            <path d="M142 63 L142 80 L158 80 L158 63 Z" className={getNeutralBoneClass()} />

            {view === 'front' ? (
              /* ================= FRONT ANATOMY ================= */
              <g id="anterior-muscles">
                {/* SHOULDERS / DELTOIDS */}
                <path
                  id="shoulders-left"
                  d="M106 82 C98 86 90 98 90 114 C90 126 95 132 101 130 C107 126 112 112 113 95 Z"
                  className={getMuscleClasses('shoulders')}
                  onMouseEnter={() => setHoveredMuscle('shoulders')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'shoulders' ? 'all' : 'shoulders')}
                />
                <path
                  id="shoulders-right"
                  d="M194 82 C202 86 210 98 210 114 C210 126 205 132 199 130 C193 126 188 112 187 95 Z"
                  className={getMuscleClasses('shoulders')}
                  onMouseEnter={() => setHoveredMuscle('shoulders')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'shoulders' ? 'all' : 'shoulders')}
                />

                {/* CHEST (PECTORALIS MAJOR) */}
                <path
                  id="chest-left"
                  d="M115 88 C128 86 146 88 147 105 C147 122 135 132 118 132 C110 132 106 122 108 108 Z"
                  className={getMuscleClasses('chest')}
                  onMouseEnter={() => setHoveredMuscle('chest')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'chest' ? 'all' : 'chest')}
                />
                <path
                  id="chest-right"
                  d="M185 88 C172 86 154 88 153 105 C153 122 165 132 182 132 C190 132 194 122 192 108 Z"
                  className={getMuscleClasses('chest')}
                  onMouseEnter={() => setHoveredMuscle('chest')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'chest' ? 'all' : 'chest')}
                />

                {/* BICEPS */}
                <path
                  id="biceps-left"
                  d="M93 128 C87 136 84 150 86 164 C88 172 94 172 98 165 C102 154 104 140 102 128 Z"
                  className={getMuscleClasses('biceps')}
                  onMouseEnter={() => setHoveredMuscle('biceps')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'biceps' ? 'all' : 'biceps')}
                />
                <path
                  id="biceps-right"
                  d="M207 128 C213 136 216 150 214 164 C212 172 206 172 202 165 C198 154 196 140 198 128 Z"
                  className={getMuscleClasses('biceps')}
                  onMouseEnter={() => setHoveredMuscle('biceps')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'biceps' ? 'all' : 'biceps')}
                />

                {/* FOREARMS */}
                <path
                  id="forearms-left"
                  d="M86 175 C80 188 74 206 72 224 C72 230 78 232 82 226 C88 214 94 198 96 182 Z"
                  className={getMuscleClasses('forearms')}
                  onMouseEnter={() => setHoveredMuscle('forearms')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'forearms' ? 'all' : 'forearms')}
                />
                <path
                  id="forearms-right"
                  d="M214 175 C220 188 226 206 228 224 C228 230 222 232 218 226 C212 214 206 198 204 182 Z"
                  className={getMuscleClasses('forearms')}
                  onMouseEnter={() => setHoveredMuscle('forearms')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'forearms' ? 'all' : 'forearms')}
                />

                {/* CORE / ABDOMINALS */}
                <path
                  id="core-abs"
                  d="M126 136 C138 135 162 135 174 136 C176 158 178 184 172 204 C162 212 138 212 128 204 C122 184 124 158 126 136 Z"
                  className={getMuscleClasses('core')}
                  onMouseEnter={() => setHoveredMuscle('core')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'core' ? 'all' : 'core')}
                />

                {/* QUADS (QUADRICEPS) */}
                <path
                  id="quads-left"
                  d="M120 226 C114 246 110 280 115 320 C124 326 138 322 144 300 C148 274 146 244 144 226 Z"
                  className={getMuscleClasses('quads')}
                  onMouseEnter={() => setHoveredMuscle('quads')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'quads' ? 'all' : 'quads')}
                />
                <path
                  id="quads-right"
                  d="M180 226 C186 246 190 280 185 320 C176 326 162 322 156 300 C152 274 154 244 156 226 Z"
                  className={getMuscleClasses('quads')}
                  onMouseEnter={() => setHoveredMuscle('quads')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'quads' ? 'all' : 'quads')}
                />

                {/* CALVES (FRONT SHINS / TIBIALIS) */}
                <path
                  id="calves-left"
                  d="M117 344 C112 370 114 410 118 436 C124 440 132 438 136 426 C140 406 138 368 136 344 Z"
                  className={getMuscleClasses('calves')}
                  onMouseEnter={() => setHoveredMuscle('calves')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'calves' ? 'all' : 'calves')}
                />
                <path
                  id="calves-right"
                  d="M183 344 C188 370 186 410 182 436 C176 440 168 438 164 426 C160 406 162 368 164 344 Z"
                  className={getMuscleClasses('calves')}
                  onMouseEnter={() => setHoveredMuscle('calves')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'calves' ? 'all' : 'calves')}
                />
              </g>
            ) : (
              /* ================= POSTERIOR / BACK ANATOMY ================= */
              <g id="posterior-muscles">
                {/* TRAPS / UPPER BACK */}
                <path
                  id="traps"
                  d="M136 70 C144 68 156 68 164 70 C178 82 192 94 186 112 C168 116 150 120 132 116 C126 94 130 82 136 70 Z"
                  className={getMuscleClasses('back')}
                  onMouseEnter={() => setHoveredMuscle('back')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'back' ? 'all' : 'back')}
                />

                {/* REAR DELTOIDS */}
                <path
                  id="rear-delts-left"
                  d="M106 84 C96 90 92 104 92 118 C98 122 108 116 114 100 Z"
                  className={getMuscleClasses('shoulders')}
                  onMouseEnter={() => setHoveredMuscle('shoulders')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'shoulders' ? 'all' : 'shoulders')}
                />
                <path
                  id="rear-delts-right"
                  d="M194 84 C204 90 208 104 208 118 C202 122 192 116 186 100 Z"
                  className={getMuscleClasses('shoulders')}
                  onMouseEnter={() => setHoveredMuscle('shoulders')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'shoulders' ? 'all' : 'shoulders')}
                />

                {/* LATS (LATISSIMUS DORSI) */}
                <path
                  id="lats-left"
                  d="M120 114 C112 130 110 156 122 186 C128 178 136 172 138 152 C140 132 134 118 120 114 Z"
                  className={getMuscleClasses('back')}
                  onMouseEnter={() => setHoveredMuscle('back')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'back' ? 'all' : 'back')}
                />
                <path
                  id="lats-right"
                  d="M180 114 C188 130 190 156 178 186 C172 178 164 172 162 152 C160 132 166 118 180 114 Z"
                  className={getMuscleClasses('back')}
                  onMouseEnter={() => setHoveredMuscle('back')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'back' ? 'all' : 'back')}
                />

                {/* TRICEPS */}
                <path
                  id="triceps-left"
                  d="M92 126 C86 136 84 150 86 166 C90 172 98 168 100 156 C102 142 100 132 92 126 Z"
                  className={getMuscleClasses('triceps')}
                  onMouseEnter={() => setHoveredMuscle('triceps')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'triceps' ? 'all' : 'triceps')}
                />
                <path
                  id="triceps-right"
                  d="M208 126 C214 136 216 150 214 166 C210 172 202 168 200 156 C198 142 200 132 208 126 Z"
                  className={getMuscleClasses('triceps')}
                  onMouseEnter={() => setHoveredMuscle('triceps')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'triceps' ? 'all' : 'triceps')}
                />

                {/* GLUTES (GLUTEUS MAXIMUS) */}
                <path
                  id="glutes-left"
                  d="M124 200 C114 204 112 226 118 244 C126 254 140 252 147 240 C149 220 144 204 124 200 Z"
                  className={getMuscleClasses('glutes')}
                  onMouseEnter={() => setHoveredMuscle('glutes')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'glutes' ? 'all' : 'glutes')}
                />
                <path
                  id="glutes-right"
                  d="M176 200 C186 204 188 226 182 244 C174 254 160 252 153 240 C151 220 156 204 176 200 Z"
                  className={getMuscleClasses('glutes')}
                  onMouseEnter={() => setHoveredMuscle('glutes')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'glutes' ? 'all' : 'glutes')}
                />

                {/* HAMSTRINGS */}
                <path
                  id="hamstrings-left"
                  d="M120 252 C114 274 112 300 118 326 C126 332 138 328 144 314 C148 290 146 268 144 252 Z"
                  className={getMuscleClasses('hamstrings')}
                  onMouseEnter={() => setHoveredMuscle('hamstrings')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'hamstrings' ? 'all' : 'hamstrings')}
                />
                <path
                  id="hamstrings-right"
                  d="M180 252 C186 274 188 300 182 326 C174 332 162 328 156 314 C152 290 154 268 156 252 Z"
                  className={getMuscleClasses('hamstrings')}
                  onMouseEnter={() => setHoveredMuscle('hamstrings')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'hamstrings' ? 'all' : 'hamstrings')}
                />

                {/* CALVES (GASTROCNEMIUS / SOLEUS) */}
                <path
                  id="calves-back-left"
                  d="M116 348 C110 374 112 408 116 432 C124 438 134 436 138 418 C142 396 142 368 138 348 Z"
                  className={getMuscleClasses('calves')}
                  onMouseEnter={() => setHoveredMuscle('calves')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'calves' ? 'all' : 'calves')}
                />
                <path
                  id="calves-back-right"
                  d="M184 348 C190 374 188 408 184 432 C176 438 166 436 162 418 C158 396 158 368 162 348 Z"
                  className={getMuscleClasses('calves')}
                  onMouseEnter={() => setHoveredMuscle('calves')}
                  onMouseLeave={() => setHoveredMuscle(null)}
                  onClick={() => onSelectMuscle(selectedMuscle === 'calves' ? 'all' : 'calves')}
                />
              </g>
            )}
          </svg>
        </div>

        {/* Dynamic Focus Card & Muscle Quick Pills */}
        <div className="flex-1 max-w-md space-y-4">
          {/* Active / Hovered Card */}
          <div className="p-4 rounded-2xl bg-gray-850/80 border border-gray-800 shadow-inner">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-gray-400">
                {hoveredMuscle ? 'Hovering Over' : selectedMuscle === 'all' ? 'Current Filter' : 'Selected Target'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold text-xs">
                {(hoveredMuscle ? exerciseCounts[hoveredMuscle] : exerciseCounts[selectedMuscle]) || 0} Exercises Found
              </span>
            </div>

            <div className="text-xl font-black text-white capitalize flex items-center gap-2">
              <span>{hoveredMuscle || (selectedMuscle === 'all' ? 'All Muscle Groups' : selectedMuscle)}</span>
              {(hoveredMuscle || selectedMuscle !== 'all') && (
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
              )}
            </div>

            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              {hoveredMuscle === 'chest' || selectedMuscle === 'chest'
                ? 'Pectoralis Major & Minor. Targeted with Barbell Bench, Incline DB Press, Cable Flyes and Dips.'
                : hoveredMuscle === 'back' || selectedMuscle === 'back'
                ? 'Latissimus Dorsi, Traps, Rhomboids & Erector Spinae. Built with Deadlifts, Barbell Rows, and Pull-Ups.'
                : hoveredMuscle === 'quads' || selectedMuscle === 'quads'
                ? 'Vastus Lateralis, Medialis & Rectus Femoris. Exploded with Barbell Back Squats and Bulgarian Split Squats.'
                : hoveredMuscle === 'biceps' || selectedMuscle === 'biceps'
                ? 'Biceps Brachii & Brachialis. Isolated with Barbell Curls, Incline Dumbbell Curls and Preacher Curls.'
                : hoveredMuscle === 'triceps' || selectedMuscle === 'triceps'
                ? 'Lateral, Long, and Medial Heads. Loaded with Tricep Pushdowns, Dips, and Skull Crushers.'
                : hoveredMuscle === 'hamstrings' || selectedMuscle === 'hamstrings'
                ? 'Posterior chain knee flexors. Hammered with Romanian Deadlifts and Seated Leg Curls.'
                : hoveredMuscle === 'glutes' || selectedMuscle === 'glutes'
                ? 'Gluteus Maximus and Medius. Targeted with Barbell Hip Thrusts, Deep Squats, and Lunges.'
                : hoveredMuscle === 'shoulders' || selectedMuscle === 'shoulders'
                ? 'Anterior, Lateral and Posterior Delts. Built with Overhead Presses and DB Lateral Raises.'
                : hoveredMuscle === 'core' || selectedMuscle === 'core'
                ? 'Rectus Abdominis, Obliques and Transverse Core. Strengthened with Hanging Leg Raises and Planks.'
                : hoveredMuscle === 'calves' || selectedMuscle === 'calves'
                ? 'Gastrocnemius and Soleus. Loaded with Standing and Seated Calf Raises.'
                : 'Click on any anatomical body part above or select from the quick badges below to filter the exercise library.'}
            </p>
          </div>

          {/* Quick Click Badges */}
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
              Fast Select:
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'chest', label: 'Chest' },
                { id: 'back', label: 'Back & Lats' },
                { id: 'shoulders', label: 'Shoulders' },
                { id: 'biceps', label: 'Biceps' },
                { id: 'triceps', label: 'Triceps' },
                { id: 'quads', label: 'Quads' },
                { id: 'hamstrings', label: 'Hamstrings' },
                { id: 'glutes', label: 'Glutes' },
                { id: 'calves', label: 'Calves' },
                { id: 'core', label: 'Abs & Core' }
              ].map((m) => {
                const isSelected = selectedMuscle === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => onSelectMuscle(m.id)}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white font-bold shadow-md shadow-orange-500/20 scale-105'
                        : 'bg-gray-800/80 text-gray-300 hover:text-white hover:bg-gray-750 border border-gray-700/60'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
