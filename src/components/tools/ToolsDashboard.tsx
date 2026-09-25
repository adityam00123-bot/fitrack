import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calculator,
  Cloud,
  Database,
  ShieldCheck,
  Disc,
  Flame,
  Layers,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

export const ToolsDashboard: React.FC = () => {
  const {
    supabaseConfig,
    saveSupabaseConfig,
    syncDataWithSupabase,
    setIsToolsModalOpen,
    profile,
    updateProfile
  } = useApp();

  const [url, setUrl] = useState(supabaseConfig.url || '');
  const [anonKey, setAnonKey] = useState(supabaseConfig.anonKey || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setSyncStatus(null);
    const success = await saveSupabaseConfig(url, anonKey);
    setIsSyncing(false);
    if (success) {
      setSyncStatus('Successfully verified & connected to your Supabase PostgreSQL Database!');
    } else {
      setSyncStatus('Connection failed. Please check the project URL and anon public key.');
    }
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    const res = await syncDataWithSupabase();
    setIsSyncing(false);
    setSyncStatus(res.message);
  };

  const schemaSnippet = `-- FITRACK Quick Schema Setup
-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  daily_calorie_target INT DEFAULT 2000,
  daily_protein_target INT DEFAULT 130
);

CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_volume_kg NUMERIC DEFAULT 0,
  duration_seconds INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type TEXT NOT NULL,
  food_name TEXT NOT NULL,
  calories NUMERIC NOT NULL,
  protein NUMERIC NOT NULL
);`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Tools, Calculators & Cloud Backup
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Gym math utilities, Supabase PostgreSQL synchronization, and user settings
        </p>
      </div>

      {/* Gym Tools Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setIsToolsModalOpen(true)}
          className="p-5 rounded-2xl bg-gray-900/90 border border-gray-800 hover:border-orange-500/40 cursor-pointer transition-all hover:shadow-lg hover:shadow-orange-950/20 group"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Calculator className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-orange-300">1RM Calculator</h3>
          <p className="text-xs text-gray-400 mt-1">
            Calculate your 1-Rep Max with Brzycki and Epley equations, plus working weight percentages.
          </p>
        </div>

        <div
          onClick={() => setIsToolsModalOpen(true)}
          className="p-5 rounded-2xl bg-gray-900/90 border border-gray-800 hover:border-orange-500/40 cursor-pointer transition-all hover:shadow-lg hover:shadow-orange-950/20 group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Disc className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-300">Barbell Plate Math</h3>
          <p className="text-xs text-gray-400 mt-1">
            Visual plate calculator for Olympic 20kg barbell. Shows exact plates for each sleeve.
          </p>
        </div>

        <div
          onClick={() => setIsToolsModalOpen(true)}
          className="p-5 rounded-2xl bg-gray-900/90 border border-gray-800 hover:border-orange-500/40 cursor-pointer transition-all hover:shadow-lg hover:shadow-orange-950/20 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-emerald-300">Warmup Generator</h3>
          <p className="text-xs text-gray-400 mt-1">
            Generate 4-stage neural acclimation warmups (Bar, 50%, 70%, 85%) before heavy sets.
          </p>
        </div>
      </div>

      {/* Supabase Cloud Sync Card */}
      <div className="p-6 rounded-3xl bg-gray-900/90 border border-gray-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Supabase Cloud Database Integration</h3>
              <p className="text-xs text-gray-400">Sync all workouts, diets, and measurements across devices</p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              supabaseConfig.isConnected
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-gray-800 text-gray-400 border-gray-700'
            }`}
          >
            {supabaseConfig.isConnected ? 'Cloud Connected' : 'Local Storage Mode'}
          </span>
        </div>

        <form onSubmit={handleSaveConfig} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://your-project.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs font-mono focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Supabase Public Anon Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs font-mono focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {syncStatus && (
            <div className="p-3 rounded-xl bg-gray-850 text-xs text-gray-300 border border-gray-800">
              {syncStatus}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSyncing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
            >
              {isSyncing ? 'Connecting...' : 'Save & Verify Connection'}
            </button>

            {supabaseConfig.isConnected && (
              <button
                type="button"
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-750 text-white text-xs font-semibold border border-gray-700 transition-colors"
              >
                Sync Data to Cloud
              </button>
            )}
          </div>
        </form>

        {/* SQL Schema Preview & Copy */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Supabase SQL Schema (Tables + RLS)
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(schemaSnippet);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-orange-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL'}</span>
            </button>
          </div>

          <pre className="p-3.5 rounded-2xl bg-black/60 border border-gray-800 text-[11px] text-gray-400 font-mono overflow-x-auto max-h-48">
            {schemaSnippet}
          </pre>
          <span className="text-[11px] text-gray-500 block mt-1">
            Complete database definition is saved at <code className="text-orange-400">supabase/schema.sql</code>.
          </span>
        </div>
      </div>
    </div>
  );
};
