import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Exercise, SetType, WorkoutSet } from '../../types/workout';
import { PlateCalculatorModal } from './PlateCalculatorModal';
import {
  calculate1RM,
  getPreviousSetsForExercise,
  getHistoricalBestForExercise,
  checkIfNewPR
} from '../../utils/oneRepMax';
import { soundEffects } from '../../services/audioService';
import {
  Clock,
  Plus,
  Trash2,
  Check,
  ChevronDown,
  Sparkles,
  Trophy,
  Search,
  X,
  Play,
  Scale,
  Flame,
  Star,
  Copy,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ActiveWorkoutLogger: React.FC = () => {
  const {
    activeWorkout,
    exercises,
    workoutHistory,
    updateSet,
    toggleSetCompleted,
    addSetToExercise,
    removeSetFromExercise,
    addExerciseToActiveWorkout,
    removeExerciseFromActiveWorkout,
    finishWorkout,
    cancelWorkout,
    startRestTimer
  } = useApp();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Plate Calculator State
  const [plateCalcWeight, setPlateCalcWeight] = useState<number | null>(null);

  // Set Type Popover State
  const [activeSetTypeDropdown, setActiveSetTypeDropdown] = useState<string | null>(null);

  // Workout Summary Celebration Modal State
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [workoutRating, setWorkoutRating] = useState<number>(5);
  const [workoutNotes, setWorkoutNotes] = useState<string>('');
  const [sessionPRs, setSessionPRs] = useState<Array<{ exerciseName: string; weight: number; reps: number; oneRepMax: number }>>([]);

  // Live timer tick
  useEffect(() => {
    if (!activeWorkout) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setElapsedSeconds(Math.floor((now - activeWorkout.startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout]);

  if (!activeWorkout) return null;

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      return `${hrs}:${(mins % 60).toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Compute live session stats
  const sessionStats = useMemo(() => {
    let volume = 0;
    let completedSets = 0;
    let totalReps = 0;

    activeWorkout.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.completed) {
          volume += (s.weight || 0) * (s.reps || 0);
          completedSets++;
          totalReps += s.reps || 0;
        }
      });
    });

    return { volume, completedSets, totalReps };
  }, [activeWorkout]);

  // Handle set completion checkmark tap
  const handleCheckmark = (exerciseId: string, set: WorkoutSet, exerciseName: string) => {
    const willBeCompleted = !set.completed;
    toggleSetCompleted(exerciseId, set.id);

    // If marking as completed, check for PR!
    if (willBeCompleted && set.weight > 0 && set.reps > 0) {
      const isPR = checkIfNewPR(exerciseId, set.weight, set.reps, workoutHistory);
      if (isPR) {
        updateSet(exerciseId, set.id, { isPR: true });
        soundEffects.playPRFanfare();
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch { /* ignore */ }

        // Track in session PR list
        const e1rm = calculate1RM(set.weight, set.reps);
        setSessionPRs((prev) => [
          ...prev.filter((p) => p.exerciseName !== exerciseName),
          { exerciseName, weight: set.weight, reps: set.reps, oneRepMax: e1rm }
        ]);
      }
    }
  };

  // Auto-fill a set from previous workout
  const handleApplyPrevious = (exerciseId: string, setId: string, prevWeight: number, prevReps: number) => {
    updateSet(exerciseId, setId, {
      weight: prevWeight,
      reps: prevReps
    });
    soundEffects.playTick();
  };

  // Auto-fill all sets for an exercise from previous session
  const handleAutoFillAllPrevious = (exerciseId: string, prevSets: WorkoutSet[]) => {
    const ex = activeWorkout.exercises.find((e) => e.exerciseId === exerciseId);
    if (!ex) return;

    ex.sets.forEach((s, idx) => {
      const matchPrev = prevSets[idx] || prevSets[prevSets.length - 1];
      if (matchPrev) {
        updateSet(exerciseId, s.id, {
          weight: matchPrev.weight,
          reps: matchPrev.reps
        });
      }
    });
    soundEffects.playTick();
  };

  // Cycle or set SetType
  const handleSetTypeSelect = (exerciseId: string, setId: string, type: SetType) => {
    updateSet(exerciseId, setId, {
      setType: type,
      isWarmup: type === 'warmup',
      isDropSet: type === 'dropset'
    });
    setActiveSetTypeDropdown(null);
    soundEffects.playTick();
  };

  // Trigger finish workout celebration
  const handleInitiateFinish = () => {
    // Check if at least one set is completed
    if (sessionStats.completedSets === 0) {
      const confirmFinish = window.confirm('You have not checked off any sets yet. Are you sure you want to finish?');
      if (!confirmFinish) return;
    }

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch { /* ignore */ }

    setShowSummaryModal(true);
  };

  // Confirm finish
  const handleFinalizeFinish = () => {
    const finished = finishWorkout();
    if (finished) {
      finished.rating = workoutRating;
      finished.notes = workoutNotes;
    }
    setShowSummaryModal(false);
  };

  // Filter exercises for picker
  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || ex.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24">
      {/* Active Session Header Card */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900 to-orange-950/40 border border-orange-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              <span className="text-xs uppercase font-extrabold tracking-wider text-rose-400">
                Live Gym Session
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {activeWorkout.routineName}
            </h1>
          </div>

          {/* Live Timer, Stats & Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gray-800/90 border border-gray-700 text-white font-mono text-base font-bold shadow-sm">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>

            <button
              onClick={() => startRestTimer(90)}
              className="px-3.5 py-2 rounded-2xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" /> 90s Rest
            </button>

            <button
              onClick={() => setPlateCalcWeight(60)}
              className="px-3.5 py-2 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Barbell Plate Calculator"
            >
              <Scale className="w-3.5 h-3.5" /> Plate Calc
            </button>
          </div>
        </div>

        {/* Live Volume & Sets Pill Bar */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-800/80 text-center">
          <div className="p-2 rounded-xl bg-gray-950/60 border border-gray-800">
            <span className="text-[10px] text-gray-400 font-semibold uppercase block">Volume Lifted</span>
            <strong className="text-sm sm:text-base font-black text-orange-400 font-mono">
              {sessionStats.volume.toLocaleString()} kg
            </strong>
          </div>
          <div className="p-2 rounded-xl bg-gray-950/60 border border-gray-800">
            <span className="text-[10px] text-gray-400 font-semibold uppercase block">Sets Done</span>
            <strong className="text-sm sm:text-base font-black text-emerald-400 font-mono">
              {sessionStats.completedSets} sets
            </strong>
          </div>
          <div className="p-2 rounded-xl bg-gray-950/60 border border-gray-800">
            <span className="text-[10px] text-gray-400 font-semibold uppercase block">Total Reps</span>
            <strong className="text-sm sm:text-base font-black text-cyan-400 font-mono">
              {sessionStats.totalReps} reps
            </strong>
          </div>
        </div>
      </div>

      {/* Exercises in Session */}
      <div className="space-y-5">
        {activeWorkout.exercises.length === 0 ? (
          <div className="text-center py-14 px-4 rounded-3xl border-2 border-dashed border-gray-800 bg-gray-900/40">
            <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-200">No exercises in this workout session</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1 mb-5">
              Add your first lift from the 1,350+ exercise library to start logging weights and sets.
            </p>
            <button
              onClick={() => setIsExercisePickerOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Exercise
            </button>
          </div>
        ) : (
          activeWorkout.exercises.map((ex, exIdx) => {
            // Find historical previous sets for ghost placeholders
            const prevSets = getPreviousSetsForExercise(ex.exerciseId, workoutHistory);
            const historicalBest = getHistoricalBestForExercise(ex.exerciseId, workoutHistory);

            // Compute current exercise best 1RM in this active session
            let sessionBest1RM = 0;
            ex.sets.forEach((s) => {
              if (s.completed && s.weight > 0 && s.reps > 0) {
                const e1 = calculate1RM(s.weight, s.reps);
                if (e1 > sessionBest1RM) sessionBest1RM = e1;
              }
            });

            return (
              <div
                key={ex.exerciseId}
                className="rounded-3xl bg-gray-900/90 border border-gray-800 overflow-hidden shadow-xl"
              >
                {/* Exercise Header */}
                <div className="p-4 bg-gray-850/70 border-b border-gray-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 font-black text-xs flex items-center justify-center shrink-0">
                      {exIdx + 1}
                    </span>
                    <div>
                      <h2 className="text-base font-black text-white">{ex.exerciseName}</h2>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[10px] uppercase tracking-wider text-orange-400 font-extrabold px-2 py-0.2 rounded-full bg-orange-500/10 border border-orange-500/20">
                          {ex.category}
                        </span>

                        {historicalBest && (
                          <span className="text-[10px] text-gray-400 font-medium">
                            All-Time Best: <strong className="text-white">{historicalBest.weight}kg × {historicalBest.reps}</strong> ({historicalBest.oneRepMax}kg 1RM)
                          </span>
                        )}

                        {sessionBest1RM > 0 && (
                          <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1 bg-amber-500/10 px-2 py-0.2 rounded-full border border-amber-500/30">
                            <Flame className="w-3 h-3 text-amber-400" />
                            Est 1RM Today: {sessionBest1RM}kg
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-1.5">
                    {/* Plate Calculator for this exercise */}
                    <button
                      onClick={() => {
                        const lastWeight = ex.sets.find((s) => s.weight > 0)?.weight || 60;
                        setPlateCalcWeight(lastWeight);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-gray-800 hover:bg-gray-750 text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1 border border-gray-700 transition-colors cursor-pointer"
                      title="Calculate Plates for this lift"
                    >
                      <Scale className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">Plates</span>
                    </button>

                    {/* Auto-fill all previous */}
                    {prevSets && prevSets.length > 0 && (
                      <button
                        onClick={() => handleAutoFillAllPrevious(ex.exerciseId, prevSets)}
                        className="px-2.5 py-1 rounded-xl bg-gray-800 hover:bg-gray-750 text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1 border border-gray-700 transition-colors cursor-pointer"
                        title="Auto-fill sets from previous workout"
                      >
                        <Copy className="w-3.5 h-3.5 text-orange-400" />
                        <span className="hidden sm:inline">Fill Prev</span>
                      </button>
                    )}

                    {/* Remove exercise */}
                    <button
                      onClick={() => removeExerciseFromActiveWorkout(ex.exerciseId)}
                      className="p-1.5 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Remove exercise from session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sets Table */}
                <div className="p-3 sm:p-4 overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-800/80 font-bold text-[11px] uppercase tracking-wider">
                        <th className="pb-2.5 pl-2 w-14">SET</th>
                        <th className="pb-2.5 w-24">PREVIOUS</th>
                        <th className="pb-2.5">KG (WEIGHT)</th>
                        <th className="pb-2.5">REPS</th>
                        <th className="pb-2.5 hidden sm:table-cell">1RM / RPE</th>
                        <th className="pb-2.5 text-center w-16">DONE</th>
                        <th className="pb-2.5 w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/40">
                      {ex.sets.map((s, idx) => {
                        const matchPrev = prevSets && prevSets[idx] ? prevSets[idx] : null;
                        const estimated1RM = s.weight > 0 && s.reps > 0 ? calculate1RM(s.weight, s.reps) : 0;
                        const setType = s.setType || (s.isWarmup ? 'warmup' : s.isDropSet ? 'dropset' : 'normal');

                        return (
                          <tr
                            key={s.id}
                            className={`transition-colors ${
                              s.completed
                                ? 'bg-emerald-950/20 text-emerald-200'
                                : 'hover:bg-gray-850/30'
                            }`}
                          >
                            {/* Set Type & Number with Dropdown */}
                            <td className="py-2.5 pl-2 font-mono relative">
                              <div className="relative inline-block">
                                <button
                                  onClick={() =>
                                    setActiveSetTypeDropdown(activeSetTypeDropdown === s.id ? null : s.id)
                                  }
                                  className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                                    setType === 'warmup'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                      : setType === 'dropset'
                                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                      : setType === 'failure'
                                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                      : 'bg-gray-800 text-gray-300 border border-gray-700'
                                  }`}
                                  title="Change set type (Normal, Warmup, Drop Set, Failure)"
                                >
                                  {setType === 'warmup' ? 'W' : setType === 'dropset' ? 'D' : setType === 'failure' ? 'F' : s.setNumber}
                                </button>

                                {/* Set Type Popover Menu */}
                                {activeSetTypeDropdown === s.id && (
                                  <div className="absolute top-8 left-0 z-30 bg-gray-900 border border-gray-750 shadow-2xl rounded-xl p-1 w-32 flex flex-col gap-1 text-xs">
                                    <button
                                      onClick={() => handleSetTypeSelect(ex.exerciseId, s.id, 'normal')}
                                      className="px-2.5 py-1.5 rounded-lg text-left hover:bg-gray-800 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <span className="w-4 h-4 rounded bg-gray-800 text-gray-300 text-[10px] flex items-center justify-center font-mono">1</span>
                                      <span>Normal</span>
                                    </button>
                                    <button
                                      onClick={() => handleSetTypeSelect(ex.exerciseId, s.id, 'warmup')}
                                      className="px-2.5 py-1.5 rounded-lg text-left hover:bg-gray-800 text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <span className="w-4 h-4 rounded bg-amber-500/20 text-amber-300 text-[10px] flex items-center justify-center font-mono">W</span>
                                      <span>Warmup</span>
                                    </button>
                                    <button
                                      onClick={() => handleSetTypeSelect(ex.exerciseId, s.id, 'dropset')}
                                      className="px-2.5 py-1.5 rounded-lg text-left hover:bg-gray-800 text-cyan-300 font-bold flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <span className="w-4 h-4 rounded bg-cyan-500/20 text-cyan-300 text-[10px] flex items-center justify-center font-mono">D</span>
                                      <span>Drop Set</span>
                                    </button>
                                    <button
                                      onClick={() => handleSetTypeSelect(ex.exerciseId, s.id, 'failure')}
                                      className="px-2.5 py-1.5 rounded-lg text-left hover:bg-gray-800 text-rose-300 font-bold flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <span className="w-4 h-4 rounded bg-rose-500/20 text-rose-300 text-[10px] flex items-center justify-center font-mono">F</span>
                                      <span>Failure</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Previous Set Values (Ghost Tap-to-Fill) */}
                            <td className="py-2.5 pr-2">
                              {matchPrev ? (
                                <button
                                  onClick={() => handleApplyPrevious(ex.exerciseId, s.id, matchPrev.weight, matchPrev.reps)}
                                  className="text-[11px] text-gray-500 hover:text-orange-400 font-mono transition-colors text-left group/prev cursor-pointer"
                                  title="Click to copy previous workout weight & reps"
                                >
                                  <span className="font-semibold text-gray-400 group-hover/prev:text-orange-300">
                                    {matchPrev.weight}kg × {matchPrev.reps}
                                  </span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-gray-600 font-mono">-</span>
                              )}
                            </td>

                            {/* Weight (kg) Input */}
                            <td className="py-2 pr-2">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  step="0.5"
                                  value={s.weight === 0 ? '' : s.weight}
                                  onChange={(e) =>
                                    updateSet(ex.exerciseId, s.id, {
                                      weight: parseFloat(e.target.value) || 0
                                    })
                                  }
                                  placeholder={matchPrev ? `${matchPrev.weight}` : '0'}
                                  className="w-16 sm:w-20 px-2.5 py-1.5 rounded-xl bg-gray-800 border border-gray-700 text-white font-mono font-bold text-center focus:border-orange-500 focus:outline-none transition-colors"
                                />
                                <span className="text-[11px] text-gray-500 font-medium">kg</span>
                              </div>
                            </td>

                            {/* Reps Input */}
                            <td className="py-2 pr-2">
                              <input
                                type="number"
                                value={s.reps === 0 ? '' : s.reps}
                                onChange={(e) =>
                                  updateSet(ex.exerciseId, s.id, {
                                    reps: parseInt(e.target.value) || 0
                                  })
                                }
                                placeholder={matchPrev ? `${matchPrev.reps}` : '10'}
                                className="w-14 sm:w-16 px-2.5 py-1.5 rounded-xl bg-gray-800 border border-gray-700 text-white font-mono font-bold text-center focus:border-orange-500 focus:outline-none transition-colors"
                              />
                            </td>

                            {/* 1RM & RPE Column */}
                            <td className="py-2 pr-2 hidden sm:table-cell">
                              <div className="flex items-center gap-2">
                                {estimated1RM > 0 ? (
                                  <span className="text-[11px] font-mono font-bold text-gray-300">
                                    {estimated1RM}kg <span className="text-[9px] text-gray-500">1RM</span>
                                  </span>
                                ) : (
                                  <span className="text-[11px] text-gray-600">-</span>
                                )}

                                {s.isPR && (
                                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-black border border-amber-500/40 flex items-center gap-0.5 animate-pulse">
                                    <Trophy className="w-2.5 h-2.5 text-amber-400" />
                                    <span>PR!</span>
                                  </span>
                                )}

                                <select
                                  value={s.rpe || ''}
                                  onChange={(e) =>
                                    updateSet(ex.exerciseId, s.id, {
                                      rpe: parseFloat(e.target.value) || undefined
                                    })
                                  }
                                  className="px-2 py-1 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-xs focus:border-orange-500 focus:outline-none cursor-pointer"
                                >
                                  <option value="">RPE -</option>
                                  <option value="6">RPE 6 (Easy)</option>
                                  <option value="7">RPE 7 (3 reps in tank)</option>
                                  <option value="8">RPE 8 (2 reps in tank)</option>
                                  <option value="9">RPE 9 (1 rep in tank)</option>
                                  <option value="10">RPE 10 (Failure / PR)</option>
                                </select>
                              </div>
                            </td>

                            {/* Set Complete Checkmark Button */}
                            <td className="py-2 text-center">
                              <button
                                onClick={() => handleCheckmark(ex.exerciseId, s, ex.exerciseName)}
                                className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto transition-all cursor-pointer ${
                                  s.completed
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105 ring-2 ring-emerald-400/50'
                                    : 'bg-gray-800 hover:bg-gray-750 text-gray-500 border border-gray-700 hover:border-gray-600'
                                }`}
                                title={s.completed ? 'Set completed' : 'Mark set as completed'}
                              >
                                <Check className="w-4 h-4 stroke-[3]" />
                              </button>
                            </td>

                            {/* Delete Set */}
                            <td className="py-2 text-right pr-2">
                              <button
                                onClick={() => removeSetFromExercise(ex.exerciseId, s.id)}
                                className="text-gray-600 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                                title="Delete set"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Add Set Button */}
                  <div className="mt-3 pt-2.5 border-t border-gray-800 flex justify-between items-center text-xs">
                    <span className="text-[11px] text-gray-500">
                      Tap set number to switch Warmup (W) / Drop Set (D)
                    </span>
                    <button
                      onClick={() => addSetToExercise(ex.exerciseId)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-750 text-gray-300 hover:text-white font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-orange-400" />
                      <span>Add Set</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action Footer Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-800">
        <button
          onClick={() => setIsExercisePickerOpen(true)}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gray-850 hover:bg-gray-800 border border-gray-750 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 text-orange-400" />
          <span>Add Another Exercise</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              if (window.confirm('Discard active workout session? All logged sets will be lost.')) {
                cancelWorkout();
              }
            }}
            className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-gray-800/80 hover:bg-rose-950/40 text-gray-400 hover:text-rose-300 border border-gray-700/80 text-xs font-bold transition-colors cursor-pointer"
          >
            Discard Workout
          </button>

          <button
            onClick={handleInitiateFinish}
            className="flex-1 sm:flex-initial px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>Finish Workout</span>
          </button>
        </div>
      </div>

      {/* Plate Calculator Modal */}
      {plateCalcWeight !== null && (
        <PlateCalculatorModal
          isOpen={true}
          onClose={() => setPlateCalcWeight(null)}
          initialWeight={plateCalcWeight}
        />
      )}

      {/* Exercise Picker Modal */}
      {isExercisePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Add Exercise to Workout</h3>
                <p className="text-xs text-gray-400">Search 1,350+ exercises with video/GIF form</p>
              </div>
              <button
                onClick={() => setIsExercisePickerOpen(false)}
                className="p-1.5 rounded-xl bg-gray-800 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Box */}
            <div className="p-4 border-b border-gray-800 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bench press, deadlift, squats, curls..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-orange-500 focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Muscle Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {['all', 'chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves', 'core'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-bold capitalize whitespace-nowrap text-[11px] transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1 max-h-96">
              {filteredExercises.slice(0, 50).map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => {
                    addExerciseToActiveWorkout(ex);
                    setIsExercisePickerOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-3 rounded-2xl bg-gray-850/60 hover:bg-gray-800 border border-gray-800 flex items-center justify-between cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    {ex.imageUrl && (
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-950 border border-gray-750 shrink-0">
                        <img src={ex.imageUrl} alt={ex.name} className="w-full h-full object-contain p-0.5" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                        {ex.name}
                      </h4>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">
                        {ex.category} • {ex.equipment}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-orange-500/10 text-orange-400 text-xs font-bold group-hover:bg-orange-500 group-hover:text-white transition-all">
                    + Add
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Workout Summary & Victory Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-gray-900 border border-emerald-500/40 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col animate-bounce-in">
            {/* Header with Trophy Banner */}
            <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Trophy className="w-9 h-9 text-amber-300" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Workout Crushed, Champion!</h2>
              <p className="text-xs text-white/90 font-medium mt-1">
                {activeWorkout.routineName} • {formatTimer(elapsedSeconds)} Total Time
              </p>
            </div>

            {/* Summary Stats Grid */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-2xl bg-gray-950 border border-gray-800">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Total Volume</span>
                  <strong className="text-lg font-black text-orange-400 font-mono">
                    {sessionStats.volume.toLocaleString()} kg
                  </strong>
                </div>
                <div className="p-3 rounded-2xl bg-gray-950 border border-gray-800">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Sets Done</span>
                  <strong className="text-lg font-black text-emerald-400 font-mono">
                    {sessionStats.completedSets}
                  </strong>
                </div>
                <div className="p-3 rounded-2xl bg-gray-950 border border-gray-800">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Reps</span>
                  <strong className="text-lg font-black text-cyan-400 font-mono">
                    {sessionStats.totalReps}
                  </strong>
                </div>
              </div>

              {/* Personal Records Highlight */}
              {sessionPRs.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Personal Records Shattered Today! ({sessionPRs.length})</span>
                  </div>
                  <div className="space-y-1">
                    {sessionPRs.map((pr, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-white font-bold">{pr.exerciseName}</span>
                        <span className="text-amber-300 font-mono font-bold">
                          {pr.weight}kg × {pr.reps} ({pr.oneRepMax}kg 1RM)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Workout Rating */}
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1.5 uppercase tracking-wider">
                  Rate Your Workout Intensity
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setWorkoutRating(star)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        workoutRating >= star
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-gray-800 text-gray-600 border-gray-700'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                  <span className="text-xs text-gray-400 font-semibold ml-2">
                    {workoutRating === 5
                      ? 'Explosive Beast Mode!'
                      : workoutRating === 4
                      ? 'Solid Session'
                      : workoutRating === 3
                      ? 'Decent Pump'
                      : 'Fatigued'}
                  </span>
                </div>
              </div>

              {/* Coach / Personal Notes */}
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1.5 uppercase tracking-wider">
                  Session Notes & Reflection
                </label>
                <textarea
                  value={workoutNotes}
                  onChange={(e) => setWorkoutNotes(e.target.value)}
                  placeholder="e.g. Bench press felt super explosive today! Form felt locked in on squats."
                  rows={2}
                  className="w-full p-3 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800 bg-gray-950 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-4 py-2 rounded-xl text-gray-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                Back to Session
              </button>

              <button
                onClick={handleFinalizeFinish}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                Save & Finish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
