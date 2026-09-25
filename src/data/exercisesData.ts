import { Exercise } from '../types/workout';

export const INITIAL_EXERCISES: Exercise[] = [
  // CHEST
  {
    id: 'ex-bench-press',
    name: 'Barbell Bench Press',
    category: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: [
      'Lie flat on the bench with eyes directly under the bar.',
      'Grip the bar slightly wider than shoulder-width, wrists straight.',
      'Retract shoulder blades, arch lower back slightly, plant feet firmly.',
      'Unrack and lower the bar under control to mid-chest (nipple line).',
      'Press the bar explosively back up, locking out elbows without shrugging.'
    ],
    tips: [
      'Breathe in on the way down, exhale as you push.',
      'Keep your elbows tucked at roughly 45-75 degrees, not flared 90 degrees.'
    ]
  },
  {
    id: 'ex-incline-db-press',
    name: 'Incline Dumbbell Press',
    category: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    instructions: [
      'Set bench to 30-45 degree incline.',
      'Sit back and kick dumbbells up to shoulders.',
      'Press upwards in a slight inward arc without clanging dumbbells at top.',
      'Lower weights slowly until your chest gets a deep, comfortable stretch.'
    ],
    tips: ['Higher angles (over 45 deg) shift load heavily to front delts. Stick to 30 deg for upper chest focus.']
  },
  {
    id: 'ex-dips-chest',
    name: 'Chest Dips',
    category: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'bodyweight',
    difficulty: 'advanced',
    instructions: [
      'Hold onto parallel bars and hoist yourself up.',
      'Lean torso forward roughly 30 degrees to engage the lower pecs.',
      'Bend elbows and lower body until upper arms are parallel to the floor.',
      'Push through your palms to return to starting position.'
    ],
    tips: ['Keep chin tucked to preserve chest forward lean.']
  },
  {
    id: 'ex-cable-crossover',
    name: 'Cable Crossover / Flyes',
    category: 'chest',
    secondaryMuscles: ['shoulders'],
    equipment: 'cable',
    difficulty: 'beginner',
    instructions: [
      'Set pulleys at shoulder or high level.',
      'Step forward into a staggered stance with elbows slightly bent.',
      'Bring hands together in a hugging motion, squeezing pecs hard at peak.',
      'Slowly open arms wide to feel a deep chest stretch.'
    ],
    tips: ['Maintain constant elbow angle throughout the entire range.']
  },
  {
    id: 'ex-pushup',
    name: 'Standard Push-Up',
    category: 'chest',
    secondaryMuscles: ['triceps', 'core'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    instructions: [
      'Hands slightly wider than shoulder-width on the floor.',
      'Keep core braced, glutes squeezed, and body in a straight plank line.',
      'Lower chest until 2 inches from the floor, elbows tracking back.',
      'Push the ground away to return.'
    ],
    tips: ['Do not let your lower back sag.']
  },

  // BACK
  {
    id: 'ex-deadlift',
    name: 'Conventional Barbell Deadlift',
    category: 'back',
    secondaryMuscles: ['glutes', 'hamstrings', 'forearms', 'core'],
    equipment: 'barbell',
    difficulty: 'advanced',
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot.',
      'Hinge hips back and grip bar just outside knees.',
      'Pull chest up, engage lats, flatten back.',
      'Drive feet through floor, extending hips and knees simultaneously to lockout.'
    ],
    tips: ['Do not round your lumbar spine. Bar should travel straight up in a vertical path.']
  },
  {
    id: 'ex-barbell-row',
    name: 'Barbell Bent-Over Row',
    category: 'back',
    secondaryMuscles: ['biceps', 'shoulders', 'core'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: [
      'Hinge forward at the hips with knees slightly bent until torso is 45 degrees.',
      'Pull barbell towards lower ribcage/belly button.',
      'Squeeze shoulder blades together at the top.',
      'Lower bar with full lat stretch.'
    ],
    tips: ['Avoid using momentum or jerking with the lower back.']
  },
  {
    id: 'ex-pullup',
    name: 'Pull-Up (Pronated Grip)',
    category: 'back',
    secondaryMuscles: ['biceps', 'forearms'],
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    instructions: [
      'Hang from bar with hands overhand, wider than shoulders.',
      'Initiate by depressing and retracting shoulder blades.',
      'Drive elbows down towards hips until chin clears bar.',
      'Lower back down under full control to a dead hang.'
    ],
    tips: ['Engage core so body does not swing back and forth.']
  },
  {
    id: 'ex-lat-pulldown',
    name: 'Lat Pulldown',
    category: 'back',
    secondaryMuscles: ['biceps'],
    equipment: 'cable',
    difficulty: 'beginner',
    instructions: [
      'Sit comfortably with thigh pads locked snug over knees.',
      'Grip wide bar with an overhand grip.',
      'Lean back 10-15 degrees and pull bar down to upper chest.',
      'Control the weight as it rises back up.'
    ],
    tips: ['Think of pulling through your elbows rather than pulling with your forearms.']
  },
  {
    id: 'ex-seated-cable-row',
    name: 'Seated Cable Row',
    category: 'back',
    secondaryMuscles: ['biceps', 'shoulders'],
    equipment: 'cable',
    difficulty: 'beginner',
    instructions: [
      'Sit on bench with knees slightly bent and feet on footrests.',
      'Pull V-handle attachment into your navel while keeping back upright.',
      'Pause for a 1-second squeeze between shoulder blades.',
      'Extend arms slowly allowing lats to stretch forward.'
    ],
    tips: ['Keep chest proud and shoulders back at peak contraction.']
  },

  // SHOULDERS
  {
    id: 'ex-overhead-press',
    name: 'Overhead Barbell Military Press (OHP)',
    category: 'shoulders',
    secondaryMuscles: ['triceps', 'core'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: [
      'Stand with feet shoulder-width, bar resting across front delts.',
      'Brace core and squeeze glutes tight.',
      'Press bar vertically overhead, moving head slightly back to let bar pass chin.',
      'Lock out overhead with head pushed slightly through the window of arms.'
    ],
    tips: ['Never arch your lower back excessively to compensate for weight.']
  },
  {
    id: 'ex-db-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    category: 'shoulders',
    secondaryMuscles: ['forearms'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    instructions: [
      'Stand tall holding dumbbells at sides, palms facing inward.',
      'Raise arms out to sides with slight bend in elbows until parallel to floor.',
      'Pour slightly forward as if pouring water from pitchers.',
      'Lower slowly over 2 seconds.'
    ],
    tips: ['Do not shrug your traps up. Lead with your elbows.']
  },
  {
    id: 'ex-face-pull',
    name: 'Rope Face Pull',
    category: 'shoulders',
    secondaryMuscles: ['back'],
    equipment: 'cable',
    difficulty: 'beginner',
    instructions: [
      'Attach rope to cable at upper chest/face level.',
      'Hold rope with thumbs backward grip.',
      'Pull rope towards nose/forehead, pulling handles apart while rotating shoulders externally.',
      'Squeeze rear delts for 1 second before extending arms.'
    ],
    tips: ['Crucial exercise for shoulder health, posture, and rear delt hypertrophy.']
  },

  // LEGS - QUADS, HAMSTRINGS, GLUTES, CALVES
  {
    id: 'ex-barbell-squat',
    name: 'Barbell Back Squat',
    category: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings', 'core'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: [
      'Rest barbell securely across upper traps (high bar) or rear delts (low bar).',
      'Feet shoulder-width apart, toes flared slightly 15-30 degrees.',
      'Brace core with Valsalva maneuver, break at hips and knees simultaneously.',
      'Squat down until hip crease is below top of knees (parallel or below).',
      'Drive up through whole foot, keeping knees aligned over toes.'
    ],
    tips: ['Keep chest up and avoid knee cave (valgus).']
  },
  {
    id: 'ex-leg-press',
    name: '45-Degree Leg Press',
    category: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: 'machine',
    difficulty: 'beginner',
    instructions: [
      'Seat firmly with lower back pressed against backrest.',
      'Place feet hip-width on sled platform.',
      'Disengage safety levers and lower sled until knees form 90 degrees.',
      'Press through heels and mid-foot without locking out knees completely at top.'
    ],
    tips: ['Never allow your tailbone to roll up off the seat (butt wink on leg press).']
  },
  {
    id: 'ex-romanian-deadlift',
    name: 'Romanian Deadlift (RDL)',
    category: 'hamstrings',
    secondaryMuscles: ['glutes', 'back'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: [
      'Hold barbell at hip height with overhand grip.',
      'Keep knees soft (slightly bent, but fixed).',
      'Push hips backward towards the wall behind you as bar slides down thighs.',
      'Lower bar to mid-shin level until maximum hamstring stretch is reached.',
      'Drive hips forward and squeeze glutes to return to standing.'
    ],
    tips: ['This is a hip-hinge, not a squat. Feel tension in your hamstrings.']
  },
  {
    id: 'ex-leg-extension',
    name: 'Leg Extension',
    category: 'quads',
    secondaryMuscles: [],
    equipment: 'machine',
    difficulty: 'beginner',
    instructions: [
      'Align knee joints directly with machine pivot point.',
      'Extend legs upwards until quads are fully contracted.',
      'Hold peak squeeze for 1 second.',
      'Lower slowly over 3 seconds.'
    ],
    tips: ['Point toes forward or slightly inward to hit different quad heads.']
  },
  {
    id: 'ex-seated-leg-curl',
    name: 'Seated Leg Curl',
    category: 'hamstrings',
    secondaryMuscles: ['calves'],
    equipment: 'machine',
    difficulty: 'beginner',
    instructions: [
      'Adjust thigh pad firmly down over knees.',
      'Curl heels downwards towards your glutes.',
      'Squeeze hamstrings hard at bottom.',
      'Return to starting stretch slowly.'
    ],
    tips: ['Superior hamstring muscle activation over lying leg curl due to seated hip flexion.']
  },
  {
    id: 'ex-standing-calf-raise',
    name: 'Standing Calf Raise',
    category: 'calves',
    secondaryMuscles: [],
    equipment: 'machine',
    difficulty: 'beginner',
    instructions: [
      'Place balls of feet on block with heels hanging off.',
      'Lower heels as far down as possible to achieve full calf stretch.',
      'Explode upward onto tiptoes, squeezing calves hard.',
      'Hold top for 1 full second.'
    ],
    tips: ['Do not bounce quickly; calves respond best to controlled pauses.']
  },
  {
    id: 'ex-hip-thrust',
    name: 'Barbell Hip Thrust',
    category: 'glutes',
    secondaryMuscles: ['hamstrings', 'core'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: [
      'Sit on floor with upper back against flat bench, padded barbell over hips.',
      'Feet planted flat on floor, shins vertical at top of movement.',
      'Drive through heels, thrusting hips upward to align torso and thighs.',
      'Squeeze glutes intensely at top for 2 seconds, keeping chin tucked.'
    ],
    tips: ['Avoid overarching your lower back at peak lockout.']
  },

  // ARMS - BICEPS & TRICEPS
  {
    id: 'ex-barbell-curl',
    name: 'Barbell Bicep Curl',
    category: 'biceps',
    secondaryMuscles: ['forearms'],
    equipment: 'barbell',
    difficulty: 'beginner',
    instructions: [
      'Stand tall holding barbell with shoulder-width underhand grip.',
      'Keep elbows pinned at sides.',
      'Curl bar up towards shoulders, squeezing biceps at top.',
      'Lower with control over 2-3 seconds.'
    ],
    tips: ['Avoid swinging hips or leaning backward.']
  },
  {
    id: 'ex-incline-db-curl',
    name: 'Incline Dumbbell Bicep Curl',
    category: 'biceps',
    secondaryMuscles: ['forearms'],
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    instructions: [
      'Sit on bench set at 45-60 degree incline.',
      'Let arms hang straight down behind torso for deep long-head stretch.',
      'Curl dumbbells up while supinating wrists (turn pinky up).',
      'Lower all the way down to a complete dead stretch.'
    ],
    tips: ['Greatest isolation for bicep long head (the bicep peak).']
  },
  {
    id: 'ex-hammer-curl',
    name: 'Dumbbell Hammer Curl',
    category: 'biceps',
    secondaryMuscles: ['forearms'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    instructions: [
      'Hold dumbbells with neutral grip (palms facing each other).',
      'Curl dumbbells towards shoulders without rotating wrists.',
      'Squeeze brachialis and brachioradialis at top.'
    ],
    tips: ['Builds arm thickness and forearm size.']
  },
  {
    id: 'ex-tricep-pushdown',
    name: 'Cable Tricep Rope Pushdown',
    category: 'triceps',
    secondaryMuscles: [],
    equipment: 'cable',
    difficulty: 'beginner',
    instructions: [
      'Grip rope attachment with elbows tucked at ribs.',
      'Push rope downward until elbows are fully locked.',
      'Spread the rope ends apart at the bottom for maximal peak contraction.',
      'Allow hands to come up to chest level for full stretch.'
    ],
    tips: ['Keep upper arms stationary; only forearms should move.']
  },
  {
    id: 'ex-skull-crushers',
    name: 'EZ-Bar Skull Crushers (Lying Triceps Extension)',
    category: 'triceps',
    secondaryMuscles: [],
    equipment: 'barbell',
    difficulty: 'intermediate',
    instructions: [
      'Lie flat on bench holding EZ bar with narrow overhand grip above chest.',
      'Hinge at elbows to lower bar back towards forehead or just behind head.',
      'Extend elbows back up to lock out triceps.'
    ],
    tips: ['Angling upper arms slightly backwards keeps constant tension on triceps.']
  },

  // CORE / ABS
  {
    id: 'ex-hanging-leg-raise',
    name: 'Hanging Leg Raise',
    category: 'core',
    secondaryMuscles: ['forearms'],
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    instructions: [
      'Hang from pull-up bar with overhand grip.',
      'Brace core and curl knees or straight legs up towards chest.',
      'Rotate pelvis forward at top to fully contract rectus abdominis.',
      'Lower legs slowly without swinging.'
    ],
    tips: ['To avoid swinging, stop completely at bottom before the next rep.']
  },
  {
    id: 'ex-cable-woodchopper',
    name: 'Cable Woodchopper (Obliques)',
    category: 'core',
    secondaryMuscles: ['shoulders'],
    equipment: 'cable',
    difficulty: 'beginner',
    instructions: [
      'Set cable handle at high pulley.',
      'Grip with both hands and rotate torso diagonally downwards across body.',
      'Pivot on back foot and squeeze obliques.',
      'Return slowly to starting position.'
    ],
    tips: ['Engage your core to drive the rotational force, not your arms.']
  },
  {
    id: 'ex-plank',
    name: 'Forearm Plank',
    category: 'core',
    secondaryMuscles: ['shoulders', 'glutes'],
    equipment: 'bodyweight',
    difficulty: 'beginner',
    instructions: [
      'Rest on forearms and toes with elbows directly below shoulders.',
      'Squeeze glutes, pull belly button in towards spine.',
      'Maintain flat straight line from head to heels.',
      'Hold position with steady breathing.'
    ],
    tips: ['Do not let hips drop or pike upward.']
  }
];
