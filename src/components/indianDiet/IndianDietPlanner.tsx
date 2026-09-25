import React, { useState } from 'react';
import { PrebuiltPlansView } from './PrebuiltPlansView';
import { SmartDietGenerator } from './SmartDietGenerator';
import { DesiFoodDatabaseView } from './DesiFoodDatabaseView';
import { DesiFoodSwaps } from './DesiFoodSwaps';
import {
  Sparkles,
  BookOpen,
  Wand2,
  Database,
  ArrowRightLeft,
  Flame
} from 'lucide-react';

export const IndianDietPlanner: React.FC = () => {
  const [subTab, setSubTab] = useState<'plans' | 'generator' | 'database' | 'swaps'>('plans');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-white">
              <Flame className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-orange-400">
              Desi Superpower • Indian Diet Planner
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Indian Nutrition & Muscle System
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Tailored for Indian gym-goers: Soya, Paneer, Dals, Sattu, Eggs, Chicken & Roti
          </p>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-800 text-xs sm:text-sm">
        <button
          onClick={() => setSubTab('plans')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
            subTab === 'plans'
              ? 'bg-gradient-to-r from-orange-500/20 to-rose-500/10 border border-orange-500/40 text-orange-400 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Pre-Built Indian Plans</span>
        </button>

        <button
          onClick={() => setSubTab('generator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
            subTab === 'generator'
              ? 'bg-gradient-to-r from-orange-500/20 to-rose-500/10 border border-orange-500/40 text-orange-400 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Wand2 className="w-4 h-4" />
          <span>Diet Plan Generator</span>
        </button>

        <button
          onClick={() => setSubTab('swaps')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
            subTab === 'swaps'
              ? 'bg-gradient-to-r from-orange-500/20 to-rose-500/10 border border-orange-500/40 text-orange-400 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Smart Food Swaps</span>
        </button>

        <button
          onClick={() => setSubTab('database')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
            subTab === 'database'
              ? 'bg-gradient-to-r from-orange-500/20 to-rose-500/10 border border-orange-500/40 text-orange-400 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Desi Food Database</span>
        </button>
      </div>

      {/* Sub-tab view */}
      {subTab === 'plans' && <PrebuiltPlansView />}
      {subTab === 'generator' && <SmartDietGenerator />}
      {subTab === 'swaps' && <DesiFoodSwaps />}
      {subTab === 'database' && <DesiFoodDatabaseView />}
    </div>
  );
};
