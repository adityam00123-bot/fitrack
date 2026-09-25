import { WorkoutRoutine } from '../types/workout';

export const DEFAULT_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'routine-ppl-push',
    name: 'Push Day (Chest, Shoulders, Triceps)',
    description: 'Hypertrophy and strength focused pushing workout. Targets upper/lower pecs, lateral delts, and triceps long/lateral heads.',
    category: 'PPL',
    daysPerWeek: 6,
    isDefault: true,
    exercises: [
      { exerciseId: 'ex-bench-press', exerciseName: 'Barbell Bench Press', category: 'chest', targetSets: 4, targetReps: '6-8', restSeconds: 120, notes: 'Heavy compound, 2 RIR' },
      { exerciseId: 'ex-incline-db-press', exerciseName: 'Incline Dumbbell Press', category: 'chest', targetSets: 3, targetReps: '8-12', restSeconds: 90, notes: 'Focus on upper clavicular stretch' },
      { exerciseId: 'ex-overhead-press', exerciseName: 'Overhead Barbell Military Press (OHP)', category: 'shoulders', targetSets: 3, targetReps: '8-10', restSeconds: 90, notes: 'Strict form, no leg bounce' },
      { exerciseId: 'ex-db-lateral-raise', exerciseName: 'Dumbbell Lateral Raise', category: 'shoulders', targetSets: 4, targetReps: '12-15', restSeconds: 60, notes: 'Control eccentric, slow negatives' },
      { exerciseId: 'ex-tricep-pushdown', exerciseName: 'Cable Tricep Rope Pushdown', category: 'triceps', targetSets: 3, targetReps: '12-15', restSeconds: 60, notes: 'Squeeze triceps at lockout' },
      { exerciseId: 'ex-skull-crushers', exerciseName: 'EZ-Bar Skull Crushers', category: 'triceps', targetSets: 3, targetReps: '10-12', restSeconds: 60, notes: 'Elbows slightly back for deep stretch' }
    ]
  },
  {
    id: 'routine-ppl-pull',
    name: 'Pull Day (Back, Rear Delts, Biceps)',
    description: 'Complete back builder targeting lat width, mid-back thickness, rear delts, and bicep peaks.',
    category: 'PPL',
    daysPerWeek: 6,
    isDefault: true,
    exercises: [
      { exerciseId: 'ex-deadlift', exerciseName: 'Conventional Barbell Deadlift', category: 'back', targetSets: 3, targetReps: '5', restSeconds: 180, notes: 'Heavy strength pull, reset between reps' },
      { exerciseId: 'ex-pullup', exerciseName: 'Pull-Up (Pronated Grip)', category: 'back', targetSets: 3, targetReps: '6-10', restSeconds: 90, notes: 'Full dead hang to chin over bar' },
      { exerciseId: 'ex-barbell-row', exerciseName: 'Barbell Bent-Over Row', category: 'back', targetSets: 3, targetReps: '8-10', restSeconds: 90, notes: 'Pull into lower stomach' },
      { exerciseId: 'ex-seated-cable-row', exerciseName: 'Seated Cable Row', category: 'back', targetSets: 3, targetReps: '10-12', restSeconds: 75, notes: '1 sec squeeze at peak' },
      { exerciseId: 'ex-face-pull', exerciseName: 'Rope Face Pull', category: 'shoulders', targetSets: 4, targetReps: '15-20', restSeconds: 60, notes: 'External rotation focus' },
      { exerciseId: 'ex-barbell-curl', exerciseName: 'Barbell Bicep Curl', category: 'biceps', targetSets: 3, targetReps: '8-10', restSeconds: 60, notes: 'Strict elbows pinned' },
      { exerciseId: 'ex-hammer-curl', exerciseName: 'Dumbbell Hammer Curl', category: 'biceps', targetSets: 3, targetReps: '10-12', restSeconds: 60, notes: 'Brachialis hypertrophy' }
    ]
  },
  {
    id: 'routine-ppl-legs',
    name: 'Legs & Core Day (Quads, Hams, Glutes, Abs)',
    description: 'High-octane lower body session covering quads, hamstrings, glutes, calves, and deep core stabilization.',
    category: 'PPL',
    daysPerWeek: 6,
    isDefault: true,
    exercises: [
      { exerciseId: 'ex-barbell-squat', exerciseName: 'Barbell Back Squat', category: 'quads', targetSets: 4, targetReps: '6-8', restSeconds: 150, notes: 'Hit parallel or deeper with control' },
      { exerciseId: 'ex-romanian-deadlift', exerciseName: 'Romanian Deadlift (RDL)', category: 'hamstrings', targetSets: 3, targetReps: '8-10', restSeconds: 120, notes: 'Deep hamstring stretch, hip hinge' },
      { exerciseId: 'ex-leg-press', exerciseName: '45-Degree Leg Press', category: 'quads', targetSets: 3, targetReps: '10-12', restSeconds: 90, notes: 'Feet shoulder width, full depth' },
      { exerciseId: 'ex-seated-leg-curl', exerciseName: 'Seated Leg Curl', category: 'hamstrings', targetSets: 3, targetReps: '12-15', restSeconds: 60, notes: 'Keep hips locked down' },
      { exerciseId: 'ex-standing-calf-raise', exerciseName: 'Standing Calf Raise', category: 'calves', targetSets: 4, targetReps: '12-15', restSeconds: 45, notes: '1-second pause at stretch and peak' },
      { exerciseId: 'ex-hanging-leg-raise', exerciseName: 'Hanging Leg Raise', category: 'core', targetSets: 3, targetReps: '12-15', restSeconds: 60, notes: 'Avoid momentum swing' }
    ]
  },
  {
    id: 'routine-upper-body',
    name: 'Upper Body Power & Pump',
    description: 'Perfect for 4-day Upper/Lower splits. Targets all major torso muscles with heavy compounds and isolations.',
    category: 'Upper/Lower',
    daysPerWeek: 4,
    isDefault: true,
    exercises: [
      { exerciseId: 'ex-bench-press', exerciseName: 'Barbell Bench Press', category: 'chest', targetSets: 4, targetReps: '6-8', restSeconds: 120, notes: 'Chest strength primary' },
      { exerciseId: 'ex-barbell-row', exerciseName: 'Barbell Bent-Over Row', category: 'back', targetSets: 4, targetReps: '6-8', restSeconds: 90, notes: 'Back strength primary' },
      { exerciseId: 'ex-overhead-press', exerciseName: 'Overhead Barbell Military Press (OHP)', category: 'shoulders', targetSets: 3, targetReps: '8-10', restSeconds: 90, notes: 'Vertical push' },
      { exerciseId: 'ex-lat-pulldown', exerciseName: 'Lat Pulldown', category: 'back', targetSets: 3, targetReps: '10-12', restSeconds: 75, notes: 'Vertical pull' },
      { exerciseId: 'ex-dips-chest', exerciseName: 'Chest Dips', category: 'chest', targetSets: 3, targetReps: '8-12', restSeconds: 75, notes: 'Lower chest & triceps' },
      { exerciseId: 'ex-incline-db-curl', exerciseName: 'Incline Dumbbell Bicep Curl', category: 'biceps', targetSets: 3, targetReps: '10-12', restSeconds: 60, notes: 'Long head isolation' }
    ]
  },
  {
    id: 'routine-lower-body',
    name: 'Lower Body Strength & Calves',
    description: 'Lower half of the 4-day Upper/Lower split. Builds quad power, hamstring elasticity, and calf density.',
    category: 'Upper/Lower',
    daysPerWeek: 4,
    isDefault: true,
    exercises: [
      { exerciseId: 'ex-barbell-squat', exerciseName: 'Barbell Back Squat', category: 'quads', targetSets: 4, targetReps: '6-8', restSeconds: 150, notes: 'Full depth, explosive ascent' },
      { exerciseId: 'ex-romanian-deadlift', exerciseName: 'Romanian Deadlift (RDL)', category: 'hamstrings', targetSets: 4, targetReps: '8-10', restSeconds: 120, notes: 'Hinge back, feel posterior tension' },
      { exerciseId: 'ex-leg-press', exerciseName: '45-Degree Leg Press', category: 'quads', targetSets: 3, targetReps: '10-12', restSeconds: 90, notes: 'High volume quad burner' },
      { exerciseId: 'ex-seated-leg-curl', exerciseName: 'Seated Leg Curl', category: 'hamstrings', targetSets: 3, targetReps: '12-15', restSeconds: 60, notes: 'Controlled eccentric 3s' },
      { exerciseId: 'ex-standing-calf-raise', exerciseName: 'Standing Calf Raise', category: 'calves', targetSets: 4, targetReps: '15-20', restSeconds: 45, notes: '2s stretch at bottom' }
    ]
  },
  {
    id: 'routine-desi-strength',
    name: 'Desi Pehlwan Full Body Strength',
    description: 'Traditional Indian wrestler inspired full-body compound routine. Heavy functional power, grip, endurance, and core resilience.',
    category: 'Desi Strength',
    daysPerWeek: 3,
    isDefault: true,
    exercises: [
      { exerciseId: 'ex-barbell-squat', exerciseName: 'Barbell Back Squat', category: 'quads', targetSets: 5, targetReps: '5', restSeconds: 150, notes: 'Building Pehlwani leg power' },
      { exerciseId: 'ex-overhead-press', exerciseName: 'Overhead Barbell Military Press (OHP)', category: 'shoulders', targetSets: 5, targetReps: '5', restSeconds: 120, notes: 'Shoulder stability & press power' },
      { exerciseId: 'ex-deadlift', exerciseName: 'Conventional Barbell Deadlift', category: 'back', targetSets: 3, targetReps: '5', restSeconds: 180, notes: 'Posterior chain pillar' },
      { exerciseId: 'ex-pullup', exerciseName: 'Pull-Up (Pronated Grip)', category: 'back', targetSets: 4, targetReps: 'Max reps', restSeconds: 90, notes: 'Upper body pulling stamina' },
      { exerciseId: 'ex-pushup', exerciseName: 'Standard Push-Up (Dand style)', category: 'chest', targetSets: 4, targetReps: '20-25', restSeconds: 60, notes: 'Desi pushup endurance finisher' },
      { exerciseId: 'ex-plank', exerciseName: 'Forearm Plank', category: 'core', targetSets: 3, targetReps: '60s hold', restSeconds: 60, notes: 'Steel core bracing' }
    ]
  }
];
