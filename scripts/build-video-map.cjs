const fs = require('fs');
const path = require('path');

const csvContent = fs.readFileSync(path.join(__dirname, '../src/data/hevy_exercises.csv'), 'utf8');
const lines = csvContent.split('\n');

const videoMap = {};

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || !trimmed.endsWith(',video')) continue;
  
  const lastCommaIndex = trimmed.lastIndexOf(',');
  const secondLastCommaIndex = trimmed.lastIndexOf(',', lastCommaIndex - 1);
  
  if (lastCommaIndex !== -1 && secondLastCommaIndex !== -1) {
    const url = trimmed.substring(secondLastCommaIndex + 1, lastCommaIndex).trim();
    const prefix = trimmed.substring(0, secondLastCommaIndex);
    let name = '';
    if (prefix.startsWith('"')) {
      const closingQuote = prefix.indexOf('"', 1);
      name = prefix.substring(1, closingQuote);
    } else {
      name = prefix.split(',')[0].trim();
    }
    
    if (name && url && url.startsWith('http')) {
      videoMap[name] = url;
    }
  }
}

// 13 High-performance local MP4 videos for primary staple lifts
const LOCAL_STAPLES = {
  'ex-bench-press': '/exercises/barbell_bench_press.mp4',
  'ex-barbell-row': '/exercises/barbell_bent_over_row.mp4',
  'ex-deadlift': '/exercises/barbell_deadlift.mp4',
  'ex-barbell-squat': '/exercises/barbell_squat.mp4',
  'ex-pull-up': '/exercises/pull_up.mp4',
  'ex-lat-pulldown': '/exercises/lat_pulldown.mp4',
  'ex-overhead-press': '/exercises/overhead_press.mp4',
  'ex-db-lateral-raise': '/exercises/lateral_raise.mp4',
  'ex-barbell-curl': '/exercises/barbell_curl.mp4',
  'ex-dips-chest': '/exercises/chest_dip.mp4',
  'ex-cable-pushdown': '/exercises/cable_pushdown.mp4',
  'ex-leg-press': '/exercises/leg_press.mp4',
  'ex-romanian-deadlift': '/exercises/romanian_deadlift.mp4'
};

const fileContent = `// Auto-generated Hevy 60 FPS Native MP4 Videos Map
// Strict 1-to-1 matching: each exercise only receives its EXACT video.
// If an exercise does NOT have a dedicated 60 FPS video, it returns undefined
// and cleanly renders its own authentic 3D Animated GIF or Real Gym Photos.

export const LOCAL_STAPLE_VIDEOS: Record<string, string> = ${JSON.stringify(LOCAL_STAPLES, null, 2)};

export const HEVY_VIDEO_DATABASE: Record<string, string> = ${JSON.stringify(videoMap, null, 2)};

// Strict normalizer
function cleanStr(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\\s+/g, ' ')
    .trim();
}

// Canonical 1-to-1 explicit dictionary (maps variations to exact Hevy video key)
const STRICT_CANONICAL_MAP: Record<string, string> = {
  // Flat Bench Press
  'barbell bench press': 'Bench Press (Barbell)',
  'flat barbell bench press': 'Bench Press (Barbell)',
  'bench press': 'Bench Press (Barbell)',
  'dumbbell bench press': 'Bench Press (Dumbbell)',
  'flat dumbbell bench press': 'Bench Press (Dumbbell)',
  'flat dumbbell press': 'Bench Press (Dumbbell)',
  'smith machine bench press': 'Bench Press (Smith Machine)',
  'cable bench press': 'Bench Press (Cable)',
  'close grip barbell bench press': 'Bench Press - Close Grip (Barbell)',
  'close grip bench press': 'Bench Press - Close Grip (Barbell)',
  'wide grip barbell bench press': 'Bench Press - Wide Grip (Barbell)',

  // Incline Bench Press (Distinct video)
  'incline barbell bench press': 'Incline Bench Press (Barbell)',
  'incline bench press barbell': 'Incline Bench Press (Barbell)',
  'incline dumbbell bench press': 'Incline Bench Press (Dumbbell)',
  'incline dumbbell press': 'Incline Bench Press (Dumbbell)',
  'incline db press': 'Incline Bench Press (Dumbbell)',
  'incline bench press smith machine': 'Incline Bench Press (Smith Machine)',
  'incline chest fly dumbbell': 'Incline Chest Fly (Dumbbell)',
  'incline dumbbell fly': 'Incline Chest Fly (Dumbbell)',
  'incline chest press machine': 'Incline Chest Press (Machine)',
  'incline push ups': 'Incline Push Ups',
  'incline pushup': 'Incline Push Ups',

  // Decline Bench Press (Distinct video)
  'decline barbell bench press': 'Decline Bench Press (Barbell)',
  'decline bench press barbell': 'Decline Bench Press (Barbell)',
  'decline dumbbell bench press': 'Decline Bench Press (Dumbbell)',
  'decline dumbbell press': 'Decline Bench Press (Dumbbell)',
  'decline db press': 'Decline Bench Press (Dumbbell)',
  'decline bench press smith machine': 'Decline Bench Press (Smith Machine)',
  'decline chest fly dumbbell': 'Decline Chest Fly (Dumbbell)',
  'decline push up': 'Decline Push Up',
  'decline pushup': 'Decline Push Up',

  // Rows (Distinct videos per equipment & variation)
  'barbell bent over row': 'Bent Over Row (Barbell)',
  'bent over row barbell': 'Bent Over Row (Barbell)',
  'dumbbell bent over row': 'Bent Over Row (Dumbbell)',
  'bent over row dumbbell': 'Bent Over Row (Dumbbell)',
  'chest supported incline row dumbbell': 'Chest Supported Incline Row (Dumbbell)',
  'chest supported row': 'Chest Supported Incline Row (Dumbbell)',
  'seated cable row': 'Seated Cable Row - V Grip (Cable)',
  'seated cable row v grip': 'Seated Cable Row - V Grip (Cable)',
  'seated cable row bar grip': 'Seated Cable Row - Bar Grip',
  't bar row': 'T Bar Row',
  'dumbbell row': 'Dumbbell Row',
  'one arm dumbbell row': 'Dumbbell Row',
  'single arm dumbbell row': 'Dumbbell Row',
  'inverted row': 'Inverted Row',

  // Triceps (Distinct videos)
  'tricep rope pushdown': 'Triceps Pushdown',
  'triceps rope pushdown': 'Triceps Pushdown',
  'tricep pushdown': 'Triceps Pushdown',
  'triceps pushdown': 'Triceps Pushdown',
  'cable pushdown': 'Triceps Pushdown',
  'single arm triceps pushdown cable': 'Single Arm Triceps Pushdown (Cable)',
  'single arm tricep pushdown': 'Single Arm Triceps Pushdown (Cable)',
  'triceps dip': 'Triceps Dip',
  'tricep dip': 'Triceps Dip',
  'bench dip': 'Bench Dip',
  'triceps kickback dumbbell': 'Triceps Kickback (Dumbbell)',
  'dumbbell tricep kickback': 'Triceps Kickback (Dumbbell)',
  'triceps extension barbell': 'Triceps Extension (Barbell)',
  'triceps extension dumbbell': 'Triceps Extension (Dumbbell)',
  'overhead tricep extension dumbbell': 'Triceps Extension (Dumbbell)',

  // Biceps (Distinct videos)
  'barbell bicep curl': 'Bicep Curl (Barbell)',
  'barbell curl': 'Bicep Curl (Barbell)',
  'dumbbell bicep curl': 'Bicep Curl (Dumbbell)',
  'dumbbell curl': 'Bicep Curl (Dumbbell)',
  'cable bicep curl': 'Bicep Curl (Cable)',
  'cable curl': 'Bicep Curl (Cable)',
  'hammer curl dumbbell': 'Hammer Curl (Dumbbell)',
  'dumbbell hammer curl': 'Hammer Curl (Dumbbell)',
  'hammer curl cable': 'Hammer Curl (Cable)',
  'concentration curl': 'Concentration Curl',
  'dumbbell concentration curl': 'Concentration Curl',
  'preacher curl barbell': 'Preacher Curl (Barbell)',
  'preacher curl dumbbell': 'Preacher Curl (Dumbbell)',
  'spider curl dumbbell': 'Spider Curl (Dumbbell)',
  'spider curl barbell': 'Spider Curl (Barbell)',
  'seated incline curl dumbbell': 'Seated Incline Curl (Dumbbell)',
  'incline dumbbell bicep curl': 'Seated Incline Curl (Dumbbell)',
  'incline dumbbell curl': 'Seated Incline Curl (Dumbbell)',
  'zottman curl dumbbell': 'Zottman Curl (Dumbbell)',
  'reverse curl barbell': 'Reverse Curl (Barbell)',
  'standing ez bar reverse curl': 'Reverse Curl (Barbell)',

  // Squats & Legs (Distinct videos)
  'barbell back squat': 'Squat (Barbell)',
  'barbell squat': 'Squat (Barbell)',
  'bodyweight squat': 'Squat (Bodyweight)',
  'front squat': 'Front Squat',
  'goblet squat': 'Goblet Squat',
  'hack squat': 'Hack Squat',
  'hack squat machine': 'Hack Squat (Machine)',
  'sumo squat': 'Sumo Squat',
  'sumo squat barbell': 'Sumo Squat (Barbell)',
  'sumo squat dumbbell': 'Sumo Squat (Dumbbell)',
  '45 degree leg press': 'Leg Press (Machine)',
  'leg press': 'Leg Press (Machine)',
  'leg extension': 'Leg Extension (Machine)',
  'seated leg curl': 'Seated Leg Curl (Machine)',
  'lying leg curl': 'Lying Leg Curl (Machine)',
  'standing calf raise': 'Standing Calf Raise (Machine)',
  'seated calf raise': 'Seated Calf Raise',

  // Deadlifts & Back
  'conventional barbell deadlift': 'Deadlift (Barbell)',
  'barbell deadlift': 'Deadlift (Barbell)',
  'deadlift barbell': 'Deadlift (Barbell)',
  'romanian deadlift rdl': 'Romanian Deadlift (Barbell)',
  'romanian deadlift': 'Romanian Deadlift (Barbell)',
  'dumbbell romanian deadlift': 'Romanian Deadlift (Dumbbell)',
  'romanian deadlift dumbbell': 'Romanian Deadlift (Dumbbell)',
  'stiff leg deadlift': 'Straight Leg Deadlift',
  'sumo deadlift': 'Sumo Deadlift',
  'trap bar deadlift': 'Deadlift (Trap bar)',
  'pull up pronated grip': 'Pull Up',
  'pull up': 'Pull Up',
  'pullup': 'Pull Up',
  'chin up': 'Chin Up',
  'chinup': 'Chin Up',
  'lat pulldown': 'Lat Pulldown (Cable)',
  'cable lat pulldown': 'Lat Pulldown (Cable)',

  // Shoulders & Chest
  'overhead barbell military press ohp': 'Standing Military Press (Barbell)',
  'overhead barbell military press': 'Standing Military Press (Barbell)',
  'standing military press barbell': 'Standing Military Press (Barbell)',
  'overhead press barbell': 'Overhead Press (Barbell)',
  'overhead press dumbbell': 'Overhead Press (Dumbbell)',
  'dumbbell shoulder press': 'Shoulder Press (Dumbbell)',
  'arnold press dumbbell': 'Arnold Press (Dumbbell)',
  'arnold press': 'Arnold Press (Dumbbell)',
  'dumbbell lateral raise': 'Lateral Raise (Dumbbell)',
  'lateral raise dumbbell': 'Lateral Raise (Dumbbell)',
  'lateral raise cable': 'Lateral Raise (Cable)',
  'cable lateral raise': 'Lateral Raise (Cable)',
  'chest dips': 'Chest Dip',
  'chest dip': 'Chest Dip',
  'cable fly crossovers': 'Cable Fly Crossovers',
  'cable crossover flyes': 'Cable Fly Crossovers',
  'cable crossover': 'Cable Fly Crossovers',
  'dumbbell fly': 'Chest Fly (Dumbbell)',
  'dumbbell chest fly': 'Chest Fly (Dumbbell)',
  'chest fly dumbbell': 'Chest Fly (Dumbbell)',
  'machine chest press': 'Chest Press (Machine)',
  'chest press machine': 'Chest Press (Machine)',
  'rear delt reverse fly': 'Rear Delt Reverse Fly (Machine)',
  'walking lunge': 'Walking Lunge',
  'walking lunge dumbbell': 'Walking Lunge (Dumbbell)',
  'dumbbell walking lunge': 'Walking Lunge (Dumbbell)',
  'barbell lunge': 'Lunge (Barbell)',
  'dumbbell lunge': 'Lunge (Dumbbell)',
  'split squat dumbbell': 'Split Squat (Dumbbell)',
  'dumbbell split squat': 'Split Squat (Dumbbell)',
  'hip thrust machine': 'Hip Thrust (Machine)',
  'machine hip thrust': 'Hip Thrust (Machine)',
  'standard push up': 'Push Up',
  'standard pushup': 'Push Up',
  'push up': 'Push Up',
  'pushup': 'Push Up',
  'hanging leg raise': 'Hanging Leg Raise',
  'cable crunch': 'Cable Crunch',
  'ab wheel': 'Ab Wheel',
  'ab wheel rollout': 'Ab Wheel'
};

export function findHevyVideoUrl(exerciseName: string, exerciseId?: string): string | undefined {
  if (!exerciseName) return undefined;

  // 1. Direct match on local 60 FPS staple lift ID
  if (exerciseId && LOCAL_STAPLE_VIDEOS[exerciseId]) {
    return LOCAL_STAPLE_VIDEOS[exerciseId];
  }

  const clean = cleanStr(exerciseName);

  // 2. Strict canonical mapping
  const mappedKey = STRICT_CANONICAL_MAP[clean];
  if (mappedKey && HEVY_VIDEO_DATABASE[mappedKey]) {
    return HEVY_VIDEO_DATABASE[mappedKey];
  }

  // 3. Exact matching in Hevy database (case-insensitive & clean)
  for (const [key, url] of Object.entries(HEVY_VIDEO_DATABASE)) {
    if (cleanStr(key) === clean) {
      return url;
    }
  }

  // 4. Do NOT perform greedy substring/word-intersection!
  // Return undefined so the exercise accurately uses its own 3D Animated GIF.
  return undefined;
}
`;

fs.writeFileSync(path.join(__dirname, '../src/data/hevyVideoMap.ts'), fileContent);
console.log('Successfully regenerated src/data/hevyVideoMap.ts with STRICT 1-to-1 resolver!');
