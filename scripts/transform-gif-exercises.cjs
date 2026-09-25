const fs = require('fs');
const path = require('path');

function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let current = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i+1];
    
    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current);
      current = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && next === '\n') i++;
      row.push(current);
      if (row.some(x => x.trim())) lines.push(row);
      row = [];
      current = '';
    } else {
      current += char;
    }
  }
  if (row.length > 0) {
    row.push(current);
    if (row.some(x => x.trim())) lines.push(row);
  }
  return lines;
}

const content = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'exercises_gifs.csv'), 'utf8');
const rows = parseCSV(content);
const headers = rows[0];

// Map target / bodyPart to FITRACK MuscleGroup
function mapMuscle(bodyPart, target) {
  const t = (target || '').toLowerCase();
  const bp = (bodyPart || '').toLowerCase();

  if (t === 'pectorals' || bp === 'chest') return 'chest';
  if (t === 'biceps') return 'biceps';
  if (t === 'triceps') return 'triceps';
  if (t === 'forearms' || bp === 'lower arms') return 'forearms';
  if (t === 'delts' || bp === 'shoulders' || t === 'neck' || t === 'levator scapulae') return 'shoulders';
  if (t === 'lats' || t === 'upper back' || t === 'spine' || t === 'traps' || bp === 'back') return 'back';
  if (t === 'quads' || t === 'adductors') return 'quads';
  if (t === 'hamstrings') return 'hamstrings';
  if (t === 'glutes' || t === 'abductors') return 'glutes';
  if (t === 'calves' || bp === 'lower legs') return 'calves';
  if (t === 'abs' || bp === 'waist' || t === 'serratus anterior') return 'core';
  if (bp === 'cardio' || t === 'cardiovascular system') return 'cardio';

  if (bp === 'upper legs') return 'quads';
  if (bp === 'upper arms') return 'biceps';

  return 'core';
}

function mapEquipment(equip) {
  const e = (equip || '').toLowerCase();
  if (e.includes('barbell')) return 'barbell';
  if (e.includes('dumbbell')) return 'dumbbell';
  if (e.includes('cable')) return 'cable';
  if (e.includes('kettlebell')) return 'kettlebell';
  if (e.includes('band')) return 'resistance_band';
  if (e.includes('body weight') || e.includes('assisted')) return 'bodyweight';
  if (e.includes('machine') || e.includes('bike') || e.includes('skierg') || e.includes('hammer')) return 'machine';
  return 'other';
}

function capitalizeWords(str) {
  if (!str) return '';
  return str
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function inferDifficulty(name, equip, category) {
  const n = (name || '').toLowerCase();
  if (n.includes('clean') || n.includes('snatch') || n.includes('muscle up') || n.includes('one arm') || n.includes('advanced')) {
    return 'advanced';
  }
  if (equip === 'barbell' || category === 'quads' || category === 'back') {
    return 'intermediate';
  }
  if (equip === 'bodyweight' || equip === 'machine' || equip === 'cable') {
    return 'beginner';
  }
  return 'intermediate';
}

const exercises = [];

for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  const bodyPart = r[0];
  const equipmentRaw = r[1];
  const id = r[2];
  const nameRaw = r[3];
  const target = r[4];

  if (!id || !nameRaw) continue;

  const category = mapMuscle(bodyPart, target);
  const equipment = mapEquipment(equipmentRaw);
  const difficulty = inferDifficulty(nameRaw, equipment, category);

  // Collect instructions
  const instructions = [];
  // Headers index: 7=inst0, 8=inst1, 9=inst2, 10=inst3, 11=inst4, 12=inst5, 14=inst6, 15=inst7, 17=inst8, 19=inst9, 21=inst10
  const instIndices = [7, 8, 9, 10, 11, 12, 14, 15, 17, 19, 21];
  for (const idx of instIndices) {
    if (r[idx] && r[idx].trim()) {
      instructions.push(r[idx].trim());
    }
  }

  // Collect secondary muscles
  // 5=sec0, 6=sec1, 13=sec2, 16=sec3, 18=sec4, 20=sec5
  const secIndices = [5, 6, 13, 16, 18, 20];
  const secondaryMuscles = [];
  for (const idx of secIndices) {
    if (r[idx] && r[idx].trim()) {
      const mapped = mapMuscle('', r[idx].trim());
      if (mapped && mapped !== category && !secondaryMuscles.includes(mapped)) {
        secondaryMuscles.push(mapped);
      }
    }
  }

  const gifUrl = `https://raw.githubusercontent.com/omercotkd/exercises-gifs/main/assets/${id}.gif`;

  exercises.push({
    id: `gif-${id}`,
    name: capitalizeWords(nameRaw),
    category,
    secondaryMuscles: secondaryMuscles.length > 0 ? secondaryMuscles : undefined,
    equipment,
    difficulty,
    instructions: instructions.length > 0 ? instructions : ['Perform exercise with controlled technique and full range of motion.'],
    imageUrl: gifUrl,
    gifUrl: gifUrl,
  });
}

console.log(`Successfully transformed ${exercises.length} animated GIF exercises!`);

// Print distribution
const catCounts = {};
exercises.forEach(e => {
  catCounts[e.category] = (catCounts[e.category] || 0) + 1;
});
console.log('\nMuscle categories:');
Object.entries(catCounts).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));

const eqCounts = {};
exercises.forEach(e => {
  eqCounts[e.equipment] = (eqCounts[e.equipment] || 0) + 1;
});
console.log('\nEquipment categories:');
Object.entries(eqCounts).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));

// Write to TypeScript file
const outTs = `// Auto-generated from omercotkd/exercises-gifs (1,324 full-motion animated GIFs)
// Generated at: ${new Date().toISOString()}

import { Exercise } from '../types/workout';

export const ANIMATED_EXERCISES_DATABASE: Exercise[] = ${JSON.stringify(exercises, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'src', 'data', 'animatedExercisesDatabase.ts');
fs.writeFileSync(outputPath, outTs);
console.log(`\nWritten to ${outputPath}`);
