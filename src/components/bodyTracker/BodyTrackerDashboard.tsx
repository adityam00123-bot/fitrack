import React, { useState } from 'react';
import { WeightLogChart } from './WeightLogChart';
import { BodyMeasurementsView } from './BodyMeasurementsView';
import { BodyFatCalculator } from './BodyFatCalculator';
import { ProgressPhotosView } from './ProgressPhotosView';
import { Scale, Ruler, Camera, Calculator, Activity } from 'lucide-react';

export const BodyTrackerDashboard: React.FC = () => {
  const [subTab, setSubTab] = useState<'weight' | 'measurements' | 'body_fat' | 'photos'>('weight');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-md bg-gradient-to-r from-orange-500 to-rose-500 text-white">
            <Scale className="w-4 h-4" />
          </span>
          <span className="text-xs uppercase font-bold tracking-wider text-orange-400">
            Wger Body Tracker
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Body Measurements & Physique Analytics
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Monitor scale weight, muscle circumferences, US Navy body fat %, and transformation photos
        </p>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-800 text-xs sm:text-sm">
        <button
          onClick={() => setSubTab('weight')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
            subTab === 'weight'
              ? 'bg-gradient-to-r from-orange-500/20 to-rose-500/10 border border-orange-500/40 text-orange-400 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Weight History</span>
        </button>

        <button
          onClick={() => setSubTab('measurements')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
            subTab === 'measurements'
              ? 'bg-gradient-to-r from-orange-500/20 to-rose-500/10 border border-orange-500/40 text-orange-400 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>Body Circumferences</span>
        </button>

        <button
          onClick={() => setSubTab('body_fat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
            subTab === 'body_fat'
              ? 'bg-gradient-to-r from-orange-500/20 to-rose-500/10 border border-orange-500/40 text-orange-400 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Navy Body Fat %</span>
        </button>

        <button
          onClick={() => setSubTab('photos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
            subTab === 'photos'
              ? 'bg-gradient-to-r from-orange-500/20 to-rose-500/10 border border-orange-500/40 text-orange-400 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Progress Photos</span>
        </button>
      </div>

      {/* Sub-tab view */}
      {subTab === 'weight' && <WeightLogChart />}
      {subTab === 'measurements' && <BodyMeasurementsView />}
      {subTab === 'body_fat' && <BodyFatCalculator />}
      {subTab === 'photos' && <ProgressPhotosView />}
    </div>
  );
};
