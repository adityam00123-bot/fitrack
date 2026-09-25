import { WorkoutSession, WorkoutSet } from '../types/workout';

// Calculate estimated 1 Rep Max using Epley / Brzycki Hybrid formula
export function calculate1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  if (reps > 30) return Math.round(weight * 1.5);
  // Brzycki formula
  return Math.round(weight * (36 / (37 - Math.min(30, reps))));
}

// Generate training percentage loads based on 1RM
export function getPercentageLoads(oneRepMax: number): Array<{ pct: number; weight: number }> {
  const pcts = [95, 90, 85, 80, 75, 70, 65, 60, 50];
  return pcts.map((pct) => ({
    pct,
    weight: Math.round((oneRepMax * (pct / 100)) * 2) / 2 // round to nearest 0.5kg
  }));
}

// Get the previous workout's sets for a specific exercise (most recent session containing this exercise)
export function getPreviousSetsForExercise(
  exerciseId: string,
  history: WorkoutSession[]
): WorkoutSet[] | null {
  for (const session of history) {
    const foundEx = session.exercises.find((e) => e.exerciseId === exerciseId);
    if (foundEx && foundEx.sets.length > 0) {
      return foundEx.sets;
    }
  }
  return null;
}

// Get all-time best 1RM set for an exercise from workout history
export function getHistoricalBestForExercise(
  exerciseId: string,
  history: WorkoutSession[]
): { weight: number; reps: number; oneRepMax: number } | null {
  let best1RM = 0;
  let bestWeight = 0;
  let bestReps = 0;

  for (const session of history) {
    const foundEx = session.exercises.find((e) => e.exerciseId === exerciseId);
    if (foundEx) {
      for (const set of foundEx.sets) {
        if (set.completed && set.weight > 0 && set.reps > 0) {
          const e1rm = calculate1RM(set.weight, set.reps);
          if (e1rm > best1RM) {
            best1RM = e1rm;
            bestWeight = set.weight;
            bestReps = set.reps;
          }
        }
      }
    }
  }

  if (best1RM === 0) return null;
  return { weight: bestWeight, reps: bestReps, oneRepMax: best1RM };
}

// Check if current weight and reps beats historical 1RM
export function checkIfNewPR(
  exerciseId: string,
  weight: number,
  reps: number,
  history: WorkoutSession[]
): boolean {
  if (weight <= 0 || reps <= 0) return false;
  const current1RM = calculate1RM(weight, reps);
  const best = getHistoricalBestForExercise(exerciseId, history);
  if (!best) return current1RM > 0;
  return current1RM > best.oneRepMax;
}
