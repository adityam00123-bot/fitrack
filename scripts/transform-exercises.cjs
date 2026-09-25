/**
 * Transform 876 exercises from yuhonas/free-exercise-db
 * into FITRACK's Exercise[] TypeScript format
 */
const fs = require('fs');
const path = require('path');

const raw = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'exercises_raw.json'), 'utf8')
);

const IMAGE_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

// Map free-exercise-db primaryMuscles → FITRACK MuscleGroup
const muscleMapping = {
  'abdominals': 'core',
  'abductors': 'glutes',    // hip abductors → glutes group
  'adductors': 'quads',     // inner thigh → quads group
  'biceps': 'biceps',
  'calves': 'calves',
  'chest': 'chest',
  'forearms': 'forearms',
  'glutes': 'glutes',
  'hamstrings': 'hamstrings',
  'lats': 'back',
  'lower back': 'back',
  'middle back': 'back',
  'neck': 'shoulders',      // neck → shoulders group
  'quadriceps': 'quads',
  'shoulders': 'shoulders',
  'traps': 'back',          // traps → back group
  'triceps': 'triceps',
};

// Map free-exercise-db equipment → FITRACK Equipment
const equipmentMapping = {
  'barbell': 'barbell',
  'dumbbell': 'dumbbell',
  'cable': 'cable',
  'machine': 'machine',
  'body only': 'bodyweight',
  'kettlebells': 'kettlebell',
  'bands': 'resistance_band',
  'e-z curl bar': 'barbell',       // EZ curl bar → barbell
  'exercise ball': 'other',
  'foam roll': 'other',
  'medicine ball': 'other',
  'other': 'other',
  null: 'bodyweight',              // null equipment → bodyweight
  undefined: 'bodyweight',
};

// Map free-exercise-db level → FITRACK DifficultyLevel
const levelMapping = {
  'beginner': 'beginner',
  'intermediate': 'intermediate',
  'expert': 'advanced',
};

function transformExercise(ex) {
  // Map primary muscle (take first)
  const primaryMuscleName = ex.primaryMuscles[0] || 'chest';
  const category = muscleMapping[primaryMuscleName] || 'other';

  // Map secondary muscles (deduplicate, exclude primary)
  const secondaryMuscles = [...new Set(
    [...(ex.secondaryMuscles || []), ...(ex.primaryMuscles.slice(1) || [])]
      .map(m => muscleMapping[m])
      .filter(m => m && m !== category)
  )];

  // Map equipment
  const equipment = equipmentMapping[ex.equipment] || 'other';

  // Map difficulty
  const difficulty = levelMapping[ex.level] || 'intermediate';

  // Build image URLs
  const imageUrl = ex.images && ex.images.length > 0
    ? `${IMAGE_BASE}/${ex.images[0]}`
    : undefined;

  const gifUrl = ex.images && ex.images.length > 1
    ? `${IMAGE_BASE}/${ex.images[1]}`
    : undefined;

  const images = (ex.images && ex.images.length > 0)
    ? ex.images.map(img => `${IMAGE_BASE}/${img}`)
    : (imageUrl ? [imageUrl] : undefined);

  return {
    id: `fdb-${ex.id}`,
    name: ex.name,
    category,
    secondaryMuscles: secondaryMuscles.length > 0 ? secondaryMuscles : undefined,
    equipment,
    difficulty,
    instructions: ex.instructions || ['Perform the exercise with proper form.'],
    imageUrl,
    gifUrl,
    images,
  };
}

const exercises = raw.map(transformExercise);

// Generate TypeScript
let ts = `// Auto-generated from yuhonas/free-exercise-db (876 exercises)
// Generated at: ${new Date().toISOString()}
// DO NOT EDIT MANUALLY — run scripts/transform-exercises.cjs to regenerate

import { Exercise } from '../types/workout';

export const EXERCISES_DATABASE: Exercise[] = ${JSON.stringify(exercises, null, 2)
  .replace(/"id"/g, 'id')
  .replace(/"name"/g, 'name')
  .replace(/"category"/g, 'category')
  .replace(/"secondaryMuscles"/g, 'secondaryMuscles')
  .replace(/"equipment"/g, 'equipment')
  .replace(/"difficulty"/g, 'difficulty')
  .replace(/"instructions"/g, 'instructions')
  .replace(/"imageUrl"/g, 'imageUrl')
  .replace(/"gifUrl"/g, 'gifUrl')
  .replace(/"images"/g, 'images')
  .replace(/"tips"/g, 'tips')
};
`;

// Fix: replace the JSON string values with proper TypeScript string literals
// Also need to handle the type assertion

const outputPath = path.join(__dirname, '..', 'src', 'data', 'exercisesDatabase.ts');
fs.writeFileSync(outputPath, ts);

console.log(`✅ Generated ${exercises.length} exercises → ${outputPath}`);

// Stats
const stats = {};
exercises.forEach(e => {
  stats[e.category] = (stats[e.category] || 0) + 1;
});
console.log('\nMuscle group distribution:');
Object.entries(stats).sort((a,b) => b[1] - a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));

const eqStats = {};
exercises.forEach(e => {
  eqStats[e.equipment] = (eqStats[e.equipment] || 0) + 1;
});
console.log('\nEquipment distribution:');
Object.entries(eqStats).sort((a,b) => b[1] - a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));
