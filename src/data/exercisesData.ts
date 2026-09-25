import { Exercise } from '../types/workout';
import { ANIMATED_EXERCISES_DATABASE } from './animatedExercisesDatabase';
import { EXERCISES_DATABASE } from './exercisesDatabase';
import { findHevyVideoUrl } from './hevyVideoMap';

export const CURATED_EXERCISES: Exercise[] = [
  // CHEST
  {
    id: 'ex-bench-press',
    videoUrl: '/exercises/barbell_bench_press.mp4',
    name: 'Barbell Bench Press',
    category: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0025.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0025.gif',
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
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0314.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0314.gif',
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
    videoUrl: '/exercises/chest_dip.mp4',
    name: 'Chest Dips',
    category: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'bodyweight',
    difficulty: 'advanced',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0251.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0251.gif',
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
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0150.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0150.gif',
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
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0662.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0662.gif',
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
    videoUrl: '/exercises/barbell_deadlift.mp4',
    name: 'Conventional Barbell Deadlift',
    category: 'back',
    secondaryMuscles: ['glutes', 'hamstrings', 'forearms', 'core'],
    equipment: 'barbell',
    difficulty: 'advanced',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0032.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0032.gif',
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
    videoUrl: '/exercises/barbell_bent_over_row.mp4',
    name: 'Barbell Bent-Over Row',
    category: 'back',
    secondaryMuscles: ['biceps', 'shoulders', 'core'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0027.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0027.gif',
    instructions: [
      'Hinge forward at the hips with knees slightly bent until torso is 45 degrees.',
      'Grip barbell overhand slightly wider than shoulder-width.',
      'Pull bar towards your belly button, driving elbows back and up.',
      'Squeeze shoulder blades together at the top, then lower with control.'
    ],
    tips: ['Avoid using momentum or jerking torso upright during pull.']
  },
  {
    id: 'ex-pull-up',
    videoUrl: '/exercises/pull_up.mp4',
    name: 'Pull-Up (Pronated Grip)',
    category: 'back',
    secondaryMuscles: ['biceps', 'forearms'],
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0652.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0652.gif',
    instructions: [
      'Hang from bar with hands overhand, wider than shoulders.',
      'Retract scapulae and pull chest up towards the bar.',
      'Lead with elbows until chin clears the bar.',
      'Lower under control to full dead-hang stretch.'
    ],
    tips: ['Focus on pulling your elbows down into your back pockets.']
  },
  {
    id: 'ex-lat-pulldown',
    videoUrl: '/exercises/lat_pulldown.mp4',
    name: 'Lat Pulldown',
    category: 'back',
    secondaryMuscles: ['biceps'],
    equipment: 'cable',
    difficulty: 'beginner',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/2330.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/2330.gif',
    instructions: [
      'Sit comfortably with thigh pads locked snug over knees.',
      'Grip wide bar overhand.',
      'Lean back slightly (10-15 degrees), pull bar down to upper chest.',
      'Squeeze lats at bottom for 1 second, then control bar up.'
    ],
    tips: ['Do not yank weight down with torso swing.']
  },
  {
    id: 'ex-cable-row',
    name: 'Seated Cable Row',
    category: 'back',
    secondaryMuscles: ['biceps', 'shoulders'],
    equipment: 'cable',
    difficulty: 'beginner',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0861.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0861.gif',
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
    videoUrl: '/exercises/overhead_press.mp4',
    name: 'Overhead Barbell Military Press (OHP)',
    category: 'shoulders',
    secondaryMuscles: ['triceps', 'core'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/1457.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/1457.gif',
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
    videoUrl: '/exercises/lateral_raise.mp4',
    name: 'Dumbbell Lateral Raise',
    category: 'shoulders',
    secondaryMuscles: ['forearms'],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0334.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0334.gif',
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
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0212.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0212.gif',
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
    videoUrl: '/exercises/barbell_squat.mp4',
    name: 'Barbell Back Squat',
    category: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings', 'core'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0043.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0043.gif',
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
    videoUrl: '/exercises/leg_press.mp4',
    name: '45-Degree Leg Press',
    category: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: 'machine',
    difficulty: 'beginner',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0586.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0586.gif',
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
    videoUrl: '/exercises/romanian_deadlift.mp4',
    name: 'Romanian Deadlift (RDL)',
    category: 'hamstrings',
    secondaryMuscles: ['glutes', 'back'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0085.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0085.gif',
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
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0585.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0585.gif',
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
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/3235.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/3235.gif',
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
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0598.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0598.gif',
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
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0056.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0056.gif',
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
    videoUrl: '/exercises/barbell_curl.mp4',
    name: 'Barbell Bicep Curl',
    category: 'biceps',
    secondaryMuscles: ['forearms'],
    equipment: 'barbell',
    difficulty: 'beginner',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0031.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0031.gif',
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
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0315.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0315.gif',
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
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0313.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0313.gif',
    instructions: [
      'Stand holding dumbbells with neutral grip (palms facing each other).',
      'Keep upper arms stationary, curl weight up towards shoulders.',
      'Squeeze brachialis and forearms at the top.',
      'Lower slowly under tension.'
    ],
    tips: ['Builds upper arm width and outer bicep fullness.']
  },
  {
    id: 'ex-cable-pushdown',
    videoUrl: '/exercises/cable_pushdown.mp4',
    name: 'Tricep Rope Pushdown',
    category: 'triceps',
    secondaryMuscles: ['forearms'],
    equipment: 'cable',
    difficulty: 'beginner',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0201.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0201.gif',
    instructions: [
      'Attach rope to high pulley.',
      'Pin elbows to ribcage, lean forward slightly from hips.',
      'Push rope straight down, spreading rope ends apart at full lockout.',
      'Allow forearms to come up to parallel before next rep.'
    ],
    tips: ['Do not let elbows drift forward and backward; keep them locked in place.']
  },
  {
    id: 'ex-skull-crushers',
    name: 'EZ-Bar Skull Crushers (Lying Triceps Extension)',
    category: 'triceps',
    secondaryMuscles: ['shoulders'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0060.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0060.gif',
    instructions: [
      'Lie flat on bench holding EZ bar with close overhand grip above chest.',
      'Angle upper arms slightly backwards (towards head) to keep constant tension.',
      'Bend elbows to lower bar towards forehead/crown of head.',
      'Extend elbows to press weight back up to start.'
    ],
    tips: ['Incredible mass builder for triceps long head.']
  },

  // CORE / ABS
  {
    id: 'ex-hanging-leg-raise',
    name: 'Hanging Leg Raise',
    category: 'core',
    secondaryMuscles: ['forearms'],
    equipment: 'bodyweight',
    difficulty: 'advanced',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0472.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0472.gif',
    instructions: [
      'Hang from pull-up bar with overhand grip, body still.',
      'Brace core and raise legs straight out in front until parallel to floor (or higher).',
      'Roll pelvis slightly upward at top to engage lower abs.',
      'Lower legs slowly without swinging.'
    ],
    tips: ['Avoid swinging; if too difficult, bend knees 90 degrees (hanging knee raises).']
  },
  {
    id: 'ex-cable-woodchopper',
    name: 'Cable Woodchopper (Rotational Core)',
    category: 'core',
    secondaryMuscles: ['shoulders'],
    equipment: 'cable',
    difficulty: 'intermediate',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0246.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0246.gif',
    instructions: [
      'Set cable pulley at high position, hold handle with both hands.',
      'Stand sideways to cable with feet shoulder-width.',
      'Rotate torso downward and across body towards opposite knee.',
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
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0469.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0469.gif',
    instructions: [
      'Rest on forearms and toes with elbows directly below shoulders.',
      'Squeeze glutes, pull belly button in towards spine.',
      'Maintain flat straight line from head to heels.',
      'Hold position with steady breathing.'
    ],
    tips: ['Do not let hips drop or pike upward.']
  },

  // FOREARMS
  {
    id: 'ex-wrist-curls',
    name: 'Seated Barbell Wrist Curl',
    category: 'forearms',
    secondaryMuscles: ['biceps'],
    equipment: 'barbell',
    difficulty: 'beginner',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0125.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0125.gif',
    instructions: [
      'Sit on bench resting forearms on thighs with wrists hanging off knees palms up.',
      'Allow barbell to roll down fingers, then curl fingers and wrists upward.',
      'Squeeze forearms hard at peak contraction.',
      'Lower slowly over 2 seconds.'
    ],
    tips: ['Do not lift forearms off thighs during movement.']
  },
  {
    id: 'ex-reverse-curl',
    name: 'Standing EZ-Bar Reverse Curl',
    category: 'forearms',
    secondaryMuscles: ['biceps'],
    equipment: 'barbell',
    difficulty: 'intermediate',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0080.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0080.gif',
    instructions: [
      'Hold EZ bar with pronated (overhand) grip shoulder width.',
      'Pin elbows to sides and curl bar upwards using brachioradialis.',
      'Pause at top for 1 second before slow controlled descent.'
    ],
    tips: ['Target brachioradialis for forearm thickness and elbow stability.']
  },
  {
    id: 'ex-farmers-walk',
    name: 'Heavy Dumbbell Farmer’s Walk',
    category: 'forearms',
    secondaryMuscles: ['core', 'shoulders'],
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0306.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0306.gif',
    instructions: [
      'Deadlift two heavy dumbbells to standing position.',
      'Brace core, pack lats, look forward.',
      'Walk forward with short, measured heel-to-toe steps for 40-60 seconds.',
      'Maintain upright posture without swaying.'
    ],
    tips: ['Incredible grip strength and forearm endurance builder.']
  },

  // GLUTES & ACCESSORIES
  {
    id: 'ex-cable-kickback',
    name: 'Glute Cable Kickback',
    category: 'glutes',
    secondaryMuscles: ['hamstrings'],
    equipment: 'cable',
    difficulty: 'beginner',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0209.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0209.gif',
    instructions: [
      'Attach ankle cuff to low pulley cable.',
      'Hinge forward slightly holding machine frame for balance.',
      'Kick working leg back in an arc, squeezing glute at full extension.',
      'Control return without letting weight stack touch.'
    ],
    tips: ['Keep hips square to the cable tower without rotating pelvis.']
  },
  {
    id: 'ex-seated-calf-raise',
    name: 'Seated Dumbbell / Machine Calf Raise (Soleus)',
    category: 'calves',
    secondaryMuscles: [],
    equipment: 'dumbbell',
    difficulty: 'beginner',
    imageUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0388.gif',
    gifUrl: 'https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/0388.gif',
    instructions: [
      'Sit on bench with knees bent 90 degrees, resting dumbbells across knees.',
      'Elevate balls of feet on block or plate.',
      'Lower heels for deep stretch, then press high onto toes.'
    ],
    tips: ['Bent knee position isolates the deeper soleus calf muscle.']
  }
];

// Merge curated exercises, full 1324 animated GIF database, and 876 free-exercise-db
// Deduplicating by ID
const seenIds = new Set<string>();
const mergedList: Exercise[] = [];

// 1. First add curated lifts with verified GIFs
for (const ex of CURATED_EXERCISES) {
  if (!seenIds.has(ex.id)) {
    seenIds.add(ex.id);
    mergedList.push(ex);
  }
}

// 2. Add 1,324 full-motion animated GIF exercises
for (const ex of ANIMATED_EXERCISES_DATABASE) {
  if (!seenIds.has(ex.id)) {
    seenIds.add(ex.id);
    mergedList.push(ex);
  }
}

// 3. Fallback: Add any remaining from free-exercise-db
for (const ex of EXERCISES_DATABASE) {
  if (!seenIds.has(ex.id)) {
    seenIds.add(ex.id);
    mergedList.push(ex);
  }
}

// 4. Enrich exercises with Hevy 60 FPS MP4 videos (0% blur, smooth tempo)
for (const ex of mergedList) {
  if (!ex.videoUrl) {
    const video = findHevyVideoUrl(ex.name, ex.id);
    if (video) {
      ex.videoUrl = video;
    }
  }
}

export const INITIAL_EXERCISES: Exercise[] = mergedList;
