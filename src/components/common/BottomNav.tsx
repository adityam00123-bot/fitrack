import React from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import {
  Dumbbell,
  BookOpen,
  UtensilsCrossed,
  Sparkles,
  Scale
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, activeWorkout } = useApp();

  const tabs: { id: NavTab; label: string; icon: React.ElementType; badge?: boolean }[] = [
    { id: 'workouts', label: 'Workouts', icon: Dumbbell, badge: !!activeWorkout },
    { id: 'exercises', label: 'Exercises', icon: BookOpen },
    { id: 'nutrition', label: 'Macros', icon: UtensilsCrossed },
    { id: 'indian_diet', label: 'Desi Diet', icon: Sparkles },
    { id: 'body_tracker', label: 'Tracker', icon: Scale }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d0f17]/95 backdrop-blur border-t border-gray-800/80 px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive
                  ? 'text-orange-400 font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-orange-400' : ''}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
