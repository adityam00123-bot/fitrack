import React from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import {
  Dumbbell,
  BookOpen,
  UtensilsCrossed,
  Sparkles,
  Scale,
  Settings2,
  Flame,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  id: NavTab;
  label: string;
  hindiSub?: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, activeWorkout, activeDietPlan } = useApp();

  const navItems: NavItem[] = [
    {
      id: 'workouts',
      label: 'Workouts & Sessions',
      hindiSub: 'कसरत और रूटीन',
      icon: Dumbbell,
      badge: activeWorkout ? 'Active' : undefined
    },
    {
      id: 'exercises',
      label: 'Exercise Database',
      hindiSub: 'व्यायाम लाइब्रेरी',
      icon: BookOpen
    },
    {
      id: 'nutrition',
      label: 'Nutrition & Macros',
      hindiSub: 'दैनिक मैक्रोज़ और मील',
      icon: UtensilsCrossed
    },
    {
      id: 'indian_diet',
      label: 'Indian Diet Planner',
      hindiSub: 'देसी डाइट प्लानर',
      icon: Sparkles,
      badge: 'Desi Super'
    },
    {
      id: 'body_tracker',
      label: 'Body Tracker',
      hindiSub: 'वजन और माप',
      icon: Scale
    },
    {
      id: 'tools',
      label: 'Calculators & Cloud',
      hindiSub: 'टूल्स और सेटिंग्स',
      icon: Settings2
    }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0d0f17] border-r border-gray-800/80 p-4 shrink-0 min-h-[calc(100vh-57px)]">
      {/* Navigation Links */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all text-left ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500/15 to-rose-500/10 text-orange-400 border border-orange-500/30 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-850/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                      : 'bg-gray-800/70 text-gray-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold leading-tight text-white">{item.label}</div>
                  {item.hindiSub && (
                    <div className="text-[11px] text-gray-400">{item.hindiSub}</div>
                  )}
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badge === 'Active'
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Indian Diet Spotlight Card */}
      {activeDietPlan && (
        <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-orange-950/40 via-gray-900 to-amber-950/30 border border-orange-500/25">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded-md bg-orange-500/20 text-orange-400">
              <Flame className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold text-orange-300">Selected Diet Plan</span>
          </div>
          <div className="text-xs font-semibold text-white truncate">{activeDietPlan.name}</div>
          <div className="text-[11px] text-gray-400 flex items-center justify-between mt-1">
            <span>{activeDietPlan.targetCalories} kcal</span>
            <span className="text-emerald-400 font-bold">{activeDietPlan.targetProtein}g Protein</span>
          </div>
          <button
            onClick={() => setActiveTab('indian_diet')}
            className="mt-2.5 w-full flex items-center justify-center gap-1 text-[11px] font-semibold text-orange-400 hover:text-orange-300 py-1 rounded bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 transition-colors"
          >
            <span>View Full Meal Plan</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </aside>
  );
};
