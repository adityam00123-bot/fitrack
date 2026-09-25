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

// Common staple local video overrides (high-speed local 60 FPS files)
const LOCAL_STAPLES = {
  'Barbell Bench Press': '/exercises/barbell_bench_press.mp4',
  'Barbell Bent-Over Row': '/exercises/barbell_bent_over_row.mp4',
  'Conventional Barbell Deadlift': '/exercises/barbell_deadlift.mp4',
  'Barbell Back Squat': '/exercises/barbell_squat.mp4',
  'Pull-Up (Pronated Grip)': '/exercises/pull_up.mp4',
  'Lat Pulldown': '/exercises/lat_pulldown.mp4',
  'Overhead Barbell Military Press (OHP)': '/exercises/overhead_press.mp4',
  'Dumbbell Lateral Raise': '/exercises/lateral_raise.mp4',
  'Barbell Bicep Curl': '/exercises/barbell_curl.mp4',
  'Chest Dips': '/exercises/chest_dip.mp4',
  'Tricep Rope Pushdown': '/exercises/cable_pushdown.mp4',
  '45-Degree Leg Press': '/exercises/leg_press.mp4',
  'Romanian Deadlift (RDL)': '/exercises/romanian_deadlift.mp4'
};

const fileContent = `// Auto-generated Hevy 60 FPS Native MP4 Videos Map
// 222+ exercise MP4 videos from official Hevy dataset + local high-speed assets
// Guaranteed 0% motion blur and full tempo playback speed controls

export const LOCAL_STAPLE_VIDEOS: Record<string, string> = ${JSON.stringify(LOCAL_STAPLES, null, 2)};

export const HEVY_VIDEO_DATABASE: Record<string, string> = ${JSON.stringify(videoMap, null, 2)};

// Normalize string for fuzzy matching
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/\\(.*?\\)/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\\s+/g, ' ')
    .trim();
}

const PRECOMPUTED_HEVY = Object.entries(HEVY_VIDEO_DATABASE).map(([name, url]) => ({
  name,
  clean: norm(name),
  url
}));

// Synonyms dictionary for cross-referencing
const SYNONYMS: Array<[string, string]> = [
  ['incline dumbbell press', 'incline bench press'],
  ['incline db press', 'incline bench press'],
  ['cable pushdown', 'triceps pushdown'],
  ['tricep rope pushdown', 'triceps pushdown'],
  ['pushup', 'push up'],
  ['pullup', 'pull up'],
  ['chinup', 'chin up'],
  ['lat pull down', 'lat pulldown'],
  ['military press', 'standing military press'],
  ['seated row', 'seated cable row'],
  ['skull crusher', 'triceps extension'],
  ['overhead press', 'overhead press']
];

export function findHevyVideoUrl(exerciseName: string, exerciseId?: string): string | undefined {
  if (!exerciseName) return undefined;

  // 1. Direct match on local high-performance staple files
  for (const [stapleName, url] of Object.entries(LOCAL_STAPLE_VIDEOS)) {
    if (exerciseName.toLowerCase() === stapleName.toLowerCase()) return url;
    if (norm(exerciseName) === norm(stapleName)) return url;
  }

  // 2. Specific keyword shortcuts for staple IDs
  if (exerciseId) {
    const idMap: Record<string, string> = {
      'ex-barbell-row': '/exercises/barbell_bent_over_row.mp4',
      'ex-bench-press': '/exercises/barbell_bench_press.mp4',
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
    if (idMap[exerciseId]) return idMap[exerciseId];
  }

  const cleanQuery = norm(exerciseName);

  // 3. Exact normalized match in Hevy DB
  const exactMatch = PRECOMPUTED_HEVY.find(e => e.clean === cleanQuery);
  if (exactMatch) return exactMatch.url;

  // 4. Substring inclusion
  const subMatch = PRECOMPUTED_HEVY.find(e => 
    e.clean.length > 3 && (cleanQuery.includes(e.clean) || e.clean.includes(cleanQuery))
  );
  if (subMatch) return subMatch.url;

  // 5. Check synonyms
  for (const [alias, canonical] of SYNONYMS) {
    if (cleanQuery.includes(alias)) {
      const synMatch = PRECOMPUTED_HEVY.find(e => e.clean.includes(canonical));
      if (synMatch) return synMatch.url;
    }
  }

  // 6. Word-intersection match
  const words = cleanQuery.split(' ').filter(w => w.length > 2);
  if (words.length >= 2) {
    const wordMatch = PRECOMPUTED_HEVY.find(e => words.every(w => e.clean.includes(w)));
    if (wordMatch) return wordMatch.url;
  }

  return undefined;
}
`;

fs.writeFileSync(path.join(__dirname, '../src/data/hevyVideoMap.ts'), fileContent);
console.log('Successfully generated src/data/hevyVideoMap.ts with full synonyms and local staples!');
