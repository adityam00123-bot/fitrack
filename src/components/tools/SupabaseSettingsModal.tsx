import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  X,
  Database,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface SupabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSettingsModal: React.FC<SupabaseSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    supabaseConfig,
    saveSupabaseConfig,
    syncDataWithSupabase
  } = useApp();

  const [url, setUrl] = useState(supabaseConfig.url || '');
  const [anonKey, setAnonKey] = useState(supabaseConfig.anonKey || '');
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'schema'>('config');

  if (!isOpen) return null;

  const handleSaveAndTest = async () => {
    setTesting(true);
    setTestResult(null);
    const success = await saveSupabaseConfig(url, anonKey);
    setTesting(false);
    if (success) {
      setTestResult({ success: true, message: 'Connected successfully to your Supabase PostgreSQL database!' });
    } else {
      setTestResult({
        success: false,
        message: 'Could not connect. Please ensure URL and Anon Key are valid, and the database schema is initialized.'
      });
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    const res = await syncDataWithSupabase();
    setSyncing(false);
    setTestResult(res);
  };

  const sampleSchema = `-- FITRACK Quick Schema Setup
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

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sampleSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <Cloud className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Supabase Cloud Sync</h3>
              <p className="text-xs text-gray-400">Real-time database backup, auth & multi-device sync</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-800 p-2 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
              activeTab === 'config' ? 'bg-orange-500 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Connection Settings
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
              activeTab === 'schema' ? 'bg-orange-500 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            SQL Database Schema
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'config' ? (
            <div className="space-y-4">
              {/* Connection Status Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  supabaseConfig.isConnected
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-gray-850 border-gray-800 text-gray-400'
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs">
                  {supabaseConfig.isConnected ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold block text-white">
                      {supabaseConfig.isConnected ? 'Connected to Supabase Cloud' : 'Local Storage Mode (Active)'}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {supabaseConfig.isConnected
                        ? 'Your workouts, diet logs, and measurements sync automatically.'
                        : 'FITRACK works 100% offline out-of-the-box! Add credentials below for cloud backup.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs font-mono focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Supabase Anon Public Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs font-mono focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Test Connection Result */}
              {testResult && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-start gap-2 ${
                    testResult.success
                      ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-950/30 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveAndTest}
                  disabled={testing}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
                  <span>{testing ? 'Testing...' : 'Save & Test Connection'}</span>
                </button>

                {supabaseConfig.isConnected && (
                  <button
                    type="button"
                    onClick={handleSync}
                    disabled={syncing}
                    className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-750 text-white text-xs font-semibold border border-gray-700 flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                    <span>Sync Now</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300 font-semibold">PostgreSQL DDL Migration Script</span>
                <button
                  onClick={copySqlToClipboard}
                  className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-orange-400 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-black/60 border border-gray-800 text-[11px] text-gray-300 font-mono overflow-x-auto max-h-64">
                {sampleSchema}
              </pre>

              <p className="text-xs text-gray-400">
                A full production SQL migration is also saved at <code className="text-orange-400">supabase/schema.sql</code> with all tables, triggers, and Row Level Security policies!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
