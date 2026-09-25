import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Dumbbell,
  UtensilsCrossed,
  Scale,
  Droplets,
  Plus,
  Flame,
  Check
} from 'lucide-react';

export const QuickAddModal: React.FC = () => {
  const {
    isQuickAddOpen,
    setIsQuickAddOpen,
    startWorkout,
    setActiveTab,
    logWeight,
    addWater,
    profile
  } = useApp();

  const [activeAction, setActiveAction] = useState<'menu' | 'weight' | 'water'>('menu');
  const [quickWeight, setQuickWeight] = useState(profile.currentWeightKg || 74);
  const [waterSuccess, setWaterSuccess] = useState(false);

  if (!isQuickAddOpen) return null;

  const handleStartWorkout = () => {
    setIsQuickAddOpen(false);
    startWorkout();
    setActiveTab('workouts');
  };

  const handleLogFood = () => {
    setIsQuickAddOpen(false);
    setActiveTab('nutrition');
  };

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickWeight > 0) {
      logWeight(quickWeight);
      setIsQuickAddOpen(false);
      setActiveAction('menu');
    }
  };

  const handleAddWaterQuick = (amount: number) => {
    addWater(amount);
    setWaterSuccess(true);
    setTimeout(() => {
      setWaterSuccess(false);
      setIsQuickAddOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/15 text-orange-400">
              <Plus className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white">Quick Log & Launch</h3>
          </div>
          <button
            onClick={() => {
              setIsQuickAddOpen(false);
              setActiveAction('menu');
            }}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {activeAction === 'menu' && (
          <div className="space-y-2.5">
            <button
              onClick={handleStartWorkout}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white flex items-center justify-between shadow-lg shadow-orange-500/20 active:scale-95 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <Dumbbell className="w-5 h-5" />
                <div>
                  <span className="font-bold text-sm block">Start Live Workout</span>
                  <span className="text-xs text-orange-100">Log sets, weights, and reps</span>
                </div>
              </div>
            </button>

            <button
              onClick={handleLogFood}
              className="w-full p-3.5 rounded-2xl bg-gray-850 hover:bg-gray-800 border border-gray-800 text-white flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <UtensilsCrossed className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="font-bold text-sm block">Log Food / Meal</span>
                  <span className="text-xs text-gray-400">Desi food & macro tracker</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveAction('weight')}
              className="w-full p-3.5 rounded-2xl bg-gray-850 hover:bg-gray-800 border border-gray-800 text-white flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-cyan-400" />
                <div>
                  <span className="font-bold text-sm block">Record Morning Weight</span>
                  <span className="text-xs text-gray-400">Track weight progression</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveAction('water')}
              className="w-full p-3.5 rounded-2xl bg-gray-850 hover:bg-gray-800 border border-gray-800 text-white flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-cyan-400" />
                <div>
                  <span className="font-bold text-sm block">Hydration (+250 / +500 ml)</span>
                  <span className="text-xs text-gray-400">One-tap water log</span>
                </div>
              </div>
            </button>
          </div>
        )}

        {activeAction === 'weight' && (
          <form onSubmit={handleSaveWeight} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Enter Today's Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={quickWeight}
                onChange={(e) => setQuickWeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-lg font-bold text-center focus:border-orange-500 focus:outline-none"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveAction('menu')}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 text-white text-xs font-bold shadow-md shadow-orange-500/20"
              >
                Save Weight
              </button>
            </div>
          </form>
        )}

        {activeAction === 'water' && (
          <div className="space-y-4 text-center">
            {waterSuccess ? (
              <div className="py-4 text-emerald-400 font-bold text-sm flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                <span>Water Logged Successfully!</span>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-400">Quickly add water to today's hydration target</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAddWaterQuick(250)}
                    className="p-4 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-bold text-sm active:scale-95 transition-all"
                  >
                    +250 ml (Glass)
                  </button>
                  <button
                    onClick={() => handleAddWaterQuick(500)}
                    className="p-4 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-bold text-sm active:scale-95 transition-all"
                  >
                    +500 ml (Bottle)
                  </button>
                </div>
              </>
            )}

            <button
              onClick={() => setActiveAction('menu')}
              className="text-xs text-gray-400 hover:text-white pt-2 block mx-auto"
            >
              Back to Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
