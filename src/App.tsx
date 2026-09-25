import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { RestTimerWidget } from './components/common/RestTimerWidget';
import { QuickAddModal } from './components/common/QuickAddModal';
import { PwaInstallPrompt } from './components/common/PwaInstallPrompt';
import { WorkoutToolsModal } from './components/tools/WorkoutToolsModal';
import { SupabaseSettingsModal } from './components/tools/SupabaseSettingsModal';

import { WorkoutDashboard } from './components/workouts/WorkoutDashboard';
import { ExerciseList } from './components/exercises/ExerciseList';
import { NutritionDashboard } from './components/nutrition/NutritionDashboard';
import { IndianDietPlanner } from './components/indianDiet/IndianDietPlanner';
import { BodyTrackerDashboard } from './components/bodyTracker/BodyTrackerDashboard';
import { ToolsDashboard } from './components/tools/ToolsDashboard';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    isToolsModalOpen,
    setIsToolsModalOpen,
    isSupabaseModalOpen,
    setIsSupabaseModalOpen
  } = useApp();

  return (
    <div className="min-h-screen bg-[#0b0d13] text-gray-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-12 overflow-y-auto">
          {activeTab === 'workouts' && <WorkoutDashboard />}
          {activeTab === 'exercises' && <ExerciseList />}
          {activeTab === 'nutrition' && <NutritionDashboard />}
          {activeTab === 'indian_diet' && <IndianDietPlanner />}
          {activeTab === 'body_tracker' && <BodyTrackerDashboard />}
          {activeTab === 'tools' && <ToolsDashboard />}
        </main>
      </div>

      {/* Floating Rest Timer Widget */}
      <RestTimerWidget />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Modals & Prompts */}
      <QuickAddModal />
      <PwaInstallPrompt />
      <WorkoutToolsModal
        isOpen={isToolsModalOpen}
        onClose={() => setIsToolsModalOpen(false)}
      />
      <SupabaseSettingsModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
