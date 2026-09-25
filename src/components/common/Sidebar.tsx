import React from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  Dumbbell,
  BookOpen,
  UtensilsCrossed,
  Sparkles,
  Scale,
  Settings2,
  ChevronRight,
  Flame
} from 'lucide-react';

interface NavItem {
  id: NavTab;
  labelKey: 'home' | 'workouts' | 'exercises' | 'nutrition' | 'indianDiet' | 'bodyTracker' | 'tools';
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, activeWorkout, activeDietPlan, t } = useApp();

  const navItems: NavItem[] = [
    {
      id: 'home',
      labelKey: 'home',
      icon: LayoutDashboard
    },
    {
      id: 'workouts',
      labelKey: 'workouts',
      icon: Dumbbell,
      badge: activeWorkout ? 'Active' : undefined
    },
    {
      id: 'exercises',
      labelKey: 'exercises',
      icon: BookOpen
    },
    {
      id: 'nutrition',
      labelKey: 'nutrition',
      icon: UtensilsCrossed
    },
    {
      id: 'indian_diet',
      labelKey: 'indianDiet',
      icon: Sparkles
    },
    {
      id: 'body_tracker',
      labelKey: 'bodyTracker',
      icon: Scale
    },
    {
      id: 'tools',
      labelKey: 'tools',
      icon: Settings2
    }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0a0d14] border-r border-slate-800/80 p-4 shrink-0 min-h-[calc(100vh-57px)]">
      {/* Navigation Links */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-medium text-sm transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#121622]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'bg-[#141A28] text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold leading-tight text-white">
                    {t(item.labelKey)}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Selected Diet Plan Card */}
      {activeDietPlan && (
        <div className="mt-4 p-3.5 rounded-2xl bg-[#121622] border border-slate-800/80">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded-lg bg-blue-500/20 text-blue-400">
              <Flame className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold text-slate-200">Active Diet Plan</span>
          </div>
          <div className="text-xs font-semibold text-white truncate">{activeDietPlan.name}</div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
            <span>{activeDietPlan.targetCalories} kcal</span>
            <span className="text-emerald-400 font-bold">{activeDietPlan.targetProtein}g Protein</span>
          </div>
          <button
            onClick={() => setActiveTab('indian_diet')}
            className="mt-2.5 w-full flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors cursor-pointer"
          >
            <span>View Meal Plan</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </aside>
  );
};
