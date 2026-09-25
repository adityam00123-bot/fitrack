import React, { useState, useMemo } from 'react';
import Model, { Muscle } from 'react-body-highlighter';
import { MuscleGroup } from '../../types/workout';
import { Target, RefreshCw, Eye, Sparkles, ChevronRight } from 'lucide-react';

interface AnatomicalMuscleMapProps {
  selectedMuscle: string;
  onSelectMuscle: (muscle: string) => void;
  exerciseCounts?: Record<string, number>;
}

// Map FITRACK MuscleGroup -> react-body-highlighter Muscle slugs
const GROUP_TO_SLUGS: Record<string, Muscle[]> = {
  chest: ['chest'],
  back: ['trapezius', 'upper-back', 'lower-back'],
  shoulders: ['front-deltoids', 'back-deltoids', 'neck'],
  biceps: ['biceps'],
  triceps: ['triceps'],
  quads: ['quadriceps', 'adductor'],
  hamstrings: ['hamstring'],
  glutes: ['gluteal', 'abductors'],
  calves: ['calves', 'left-soleus', 'right-soleus'],
  core: ['abs', 'obliques'],
  forearms: ['forearm'],
};

// Map react-body-highlighter Muscle slugs -> FITRACK MuscleGroup
const SLUG_TO_GROUP: Record<string, MuscleGroup> = {
  chest: 'chest',
  trapezius: 'back',
  'upper-back': 'back',
  'lower-back': 'back',
  'front-deltoids': 'shoulders',
  'back-deltoids': 'shoulders',
  neck: 'shoulders',
  biceps: 'biceps',
  triceps: 'triceps',
  quadriceps: 'quads',
  adductor: 'quads',
  hamstring: 'hamstrings',
  gluteal: 'glutes',
  abductors: 'glutes',
  calves: 'calves',
  'left-soleus': 'calves',
  'right-soleus': 'calves',
  abs: 'core',
  obliques: 'core',
  forearm: 'forearms',
};

// Anatomical descriptions matching Workout.Cool UX
const MUSCLE_DETAILS: Record<string, { title: string; latin: string; desc: string; keyLifts: string }> = {
  chest: {
    title: 'Chest',
    latin: 'Pectoralis Major & Minor',
    desc: 'Primary pushing muscles responsible for transverse horizontal adduction and shoulder flexion.',
    keyLifts: 'Barbell Bench Press, Incline DB Press, Dips, Cable Crossover'
  },
  back: {
    title: 'Back & Lats',
    latin: 'Latissimus Dorsi, Trapezius, Rhomboids & Erector Spinae',
    desc: 'Massive pulling complex responsible for vertical and horizontal scapular retraction and spinal stability.',
    keyLifts: 'Deadlift, Barbell Bent-Over Row, Pull-Ups, Lat Pulldowns'
  },
  shoulders: {
    title: 'Shoulders',
    latin: 'Anterior, Lateral & Posterior Deltoids',
    desc: 'Multi-directional muscle group providing 3D overhead pressing power and arm abduction.',
    keyLifts: 'Overhead Barbell Military Press, DB Lateral Raise, Face Pulls'
  },
  biceps: {
    title: 'Biceps',
    latin: 'Biceps Brachii & Brachialis',
    desc: 'Forearm flexors and supinators key for upper arm pulling and peak hypertrophy.',
    keyLifts: 'Barbell Bicep Curl, Incline DB Curl, Preacher Curl, Hammer Curls'
  },
  triceps: {
    title: 'Triceps',
    latin: 'Triceps Brachii (Lateral, Long & Medial Heads)',
    desc: 'Comprises 60% of upper arm mass, driving elbow extension and pressing lockouts.',
    keyLifts: 'Close-Grip Bench Press, Cable Pushdowns, Skull Crushers, Dips'
  },
  quads: {
    title: 'Quadriceps',
    latin: 'Rectus Femoris, Vastus Lateralis, Medialis & Intermedius',
    desc: 'Massive front leg powerhouses executing knee extension in heavy squatting.',
    keyLifts: 'Barbell Back Squat, Front Squat, Leg Press, Bulgarian Split Squat'
  },
  hamstrings: {
    title: 'Hamstrings',
    latin: 'Biceps Femoris, Semitendinosus & Semimembranosus',
    desc: 'Posterior chain knee flexors and hip extensors vital for sprint speed and hinge power.',
    keyLifts: 'Romanian Deadlift (RDL), Seated Leg Curl, Nordic Curls'
  },
  glutes: {
    title: 'Glutes',
    latin: 'Gluteus Maximus, Medius & Minimus',
    desc: 'The single strongest muscle in human body driving hip extension and external rotation.',
    keyLifts: 'Barbell Hip Thrust, Heavy Squats, Romanian Deadlifts, Cable Kickbacks'
  },
  calves: {
    title: 'Calves',
    latin: 'Gastrocnemius & Soleus',
    desc: 'Plantar flexors driving ankle stability, explosive jumping, and athletic propulsion.',
    keyLifts: 'Standing Calf Raise, Seated Calf Raise (Soleus), Donkey Calf Raise'
  },
  core: {
    title: 'Abs & Core',
    latin: 'Rectus Abdominis, Obliques & Transverse Abdominis',
    desc: 'Torso stabilizer resisting spinal flexion and rotation, transmitting force from lower to upper body.',
    keyLifts: 'Hanging Leg Raise, Cable Woodchoppers, Ab Wheel Rollout, Planks'
  },
  forearms: {
    title: 'Forearms & Grip',
    latin: 'Brachioradialis, Wrist Flexors & Extensors',
    desc: 'Grip foundation and wrist articulators essential for heavy deadlifts and arm thickness.',
    keyLifts: 'Farmer’s Walk, Reverse Barbell Curls, Wrist Curls, Dead Hangs'
  }
};

export const AnatomicalMuscleMap: React.FC<AnatomicalMuscleMapProps> = ({
  selectedMuscle,
  onSelectMuscle,
  exerciseCounts = {}
}) => {
  const [activeView, setActiveView] = useState<'anterior' | 'posterior' | 'both'>('both');
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  // Convert selectedMuscle to react-body-highlighter data array
  const highlightedData = useMemo(() => {
    if (!selectedMuscle || selectedMuscle === 'all') {
      return [];
    }
    const slugs = GROUP_TO_SLUGS[selectedMuscle] || [];
    if (slugs.length === 0) return [];
    return [
      {
        name: selectedMuscle,
        muscles: slugs,
        frequency: 1
      }
    ];
  }, [selectedMuscle]);

  const handleMuscleClick = (stats: { muscle: Muscle }) => {
    const clickedSlug = stats.muscle;
    const mappedGroup = SLUG_TO_GROUP[clickedSlug];
    if (mappedGroup) {
      if (selectedMuscle === mappedGroup) {
        onSelectMuscle('all');
      } else {
        onSelectMuscle(mappedGroup);
      }
    }
  };

  const hoveredGroup = hoveredSlug ? SLUG_TO_GROUP[hoveredSlug] : null;
  const activeDetailKey = hoveredGroup || (selectedMuscle !== 'all' ? selectedMuscle : null);
  const activeDetail = activeDetailKey ? MUSCLE_DETAILS[activeDetailKey] : null;

  return (
    <div className="bg-gradient-to-br from-gray-900/95 via-gray-900/98 to-[#0b0f19] border border-gray-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 relative z-10 border-b border-gray-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Target className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>Interactive Anatomical Heatmap</span>
              <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500/20 to-rose-500/20 text-orange-400 border border-orange-500/30">
                Workout.Cool Model
              </span>
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Click on any muscle to filter from 870+ exercises with form cues & animations
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex bg-gray-850 p-1 rounded-2xl border border-gray-750 text-xs font-bold">
            <button
              onClick={() => setActiveView('both')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeView === 'both'
                  ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Dual View
            </button>
            <button
              onClick={() => setActiveView('anterior')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeView === 'anterior'
                  ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Anterior (Front)
            </button>
            <button
              onClick={() => setActiveView('posterior')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeView === 'posterior'
                  ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Posterior (Back)
            </button>
          </div>

          {selectedMuscle !== 'all' && (
            <button
              onClick={() => onSelectMuscle('all')}
              className="px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-750 border border-gray-700 text-gray-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Reset selection"
            >
              <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Body Model Canvas & Info Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* SVG Models Column */}
        <div className="lg:col-span-7 flex flex-wrap sm:flex-nowrap items-center justify-center gap-4 sm:gap-8 bg-gray-950/60 p-4 sm:p-6 rounded-3xl border border-gray-800/80 shadow-inner">
          {/* Anterior (Front) Model */}
          {(activeView === 'anterior' || activeView === 'both') && (
            <div className="flex flex-col items-center">
              <div className="w-36 sm:w-44 h-80 sm:h-96 flex items-center justify-center transition-all">
                <Model
                  type="anterior"
                  data={highlightedData}
                  bodyColor="#1f293d"
                  highlightedColors={['#f97316', '#ff5722']}
                  onClick={handleMuscleClick}
                  style={{ width: '100%', height: '100%' }}
                  svgStyle={{
                    width: '100%',
                    height: '100%',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
                    cursor: 'pointer'
                  }}
                />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mt-2 bg-gray-850 px-2.5 py-0.5 rounded-full border border-gray-750">
                Anterior (Front)
              </span>
            </div>
          )}

          {/* Posterior (Back) Model */}
          {(activeView === 'posterior' || activeView === 'both') && (
            <div className="flex flex-col items-center">
              <div className="w-36 sm:w-44 h-80 sm:h-96 flex items-center justify-center transition-all">
                <Model
                  type="posterior"
                  data={highlightedData}
                  bodyColor="#1f293d"
                  highlightedColors={['#f97316', '#ff5722']}
                  onClick={handleMuscleClick}
                  style={{ width: '100%', height: '100%' }}
                  svgStyle={{
                    width: '100%',
                    height: '100%',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
                    cursor: 'pointer'
                  }}
                />
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mt-2 bg-gray-850 px-2.5 py-0.5 rounded-full border border-gray-750">
                Posterior (Back)
              </span>
            </div>
          )}
        </div>

        {/* Anatomical Details & Fast Select Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Muscle Info Card */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gray-850/90 border border-gray-750 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-orange-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                {selectedMuscle === 'all' ? 'Anatomical Navigator' : 'Targeted Muscle Focus'}
              </span>

              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-extrabold text-xs border border-orange-500/30">
                {(exerciseCounts[selectedMuscle] ?? exerciseCounts.all) || 0} Exercises
              </span>
            </div>

            <div className="text-xl sm:text-2xl font-black text-white capitalize flex items-center gap-2">
              <span>{activeDetail ? activeDetail.title : 'All Muscle Groups'}</span>
              {selectedMuscle !== 'all' && (
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
              )}
            </div>

            {activeDetail ? (
              <div className="space-y-2 mt-2">
                <p className="text-[11px] font-bold text-gray-400 italic">
                  {activeDetail.latin}
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {activeDetail.desc}
                </p>
                <div className="pt-2 border-t border-gray-750">
                  <span className="text-[10px] uppercase font-bold text-orange-400 block mb-0.5">
                    Signature Compound Lifts:
                  </span>
                  <p className="text-xs text-gray-300 font-medium">
                    {activeDetail.keyLifts}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Click directly on any muscle in the 3D body models (Chest, Quads, Lats, Deltoids, Hamstrings) to filter the 870+ exercise library, view execution form cues, and inspect muscle synergies.
              </p>
            )}
          </div>

          {/* Quick-Filter Badge Buttons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                Quick Select:
              </span>
              {selectedMuscle !== 'all' && (
                <button
                  onClick={() => onSelectMuscle('all')}
                  className="text-[11px] text-orange-400 hover:text-orange-300 font-bold"
                >
                  Show All ({exerciseCounts.all || 0})
                </button>
              )}
            </div>

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
                { id: 'core', label: 'Abs & Core' },
                { id: 'forearms', label: 'Forearms' }
              ].map((m) => {
                const isSelected = selectedMuscle === m.id;
                const count = exerciseCounts[m.id] || 0;
                return (
                  <button
                    key={m.id}
                    onClick={() => onSelectMuscle(m.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/25 scale-105 border border-orange-400/40'
                        : 'bg-gray-850 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-750'
                    }`}
                  >
                    <span>{m.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                        isSelected ? 'bg-black/30 text-white' : 'bg-gray-750 text-gray-400'
                      }`}
                    >
                      {count}
                    </span>
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
