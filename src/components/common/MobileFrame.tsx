import React, { ReactNode } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Search,
  Clock,
  MessageSquare,
  User,
  Compass,
  Wifi,
  Battery,
  Layers,
  Sparkles
} from 'lucide-react';

interface MobileFrameProps {
  children: ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const { isMobileSimulator, currentScreen, navigateTo, activeTimerState, t, currentUser } = useApp();

  if (!isMobileSimulator) {
    return <div className="w-full min-h-screen">{children}</div>;
  }

  const mobileTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'jobs', label: 'Explore', icon: Search },
    { id: 'time', label: 'Tracker', icon: Clock, badge: activeTimerState.isRunning ? '●' : undefined },
    { id: 'messages', label: 'Chat', icon: MessageSquare },
    {
      id: currentUser.role === 'job_seeker' ? 'dashboard_seeker' : currentUser.role === 'employer' ? 'dashboard_employer' : 'dashboard_admin',
      label: 'Me',
      icon: User,
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900/95 p-4 sm:p-8 backdrop-blur-lg">
      
      {/* Device Frame */}
      <div className="relative mx-auto flex h-[844px] w-[390px] flex-col overflow-hidden rounded-[50px] border-[10px] border-slate-800 bg-slate-50 shadow-2xl ring-1 ring-white/10 dark:bg-slate-950">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-0 right-0 z-50 flex h-10 items-center justify-between px-6 bg-transparent text-[11px] font-semibold text-slate-800 dark:text-slate-200">
          <span>9:41</span>
          <div className="h-5 w-28 rounded-full bg-black shadow-inner flex items-center justify-end px-2">
            <div className="h-2.5 w-2.5 rounded-full bg-teal-500/80 animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="h-3 w-3" />
            <Battery className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Device Content Scroll Area */}
        <div className="mt-10 flex-1 overflow-y-auto pb-20">
          {children}
        </div>

        {/* Native-style Bottom Tab Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-slate-200/80 bg-white/95 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/95 px-2">
          {mobileTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentScreen === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigateTo(tab.id)}
                className={`relative flex flex-col items-center justify-center w-14 py-1 transition-colors ${
                  isActive
                    ? 'text-teal-600 dark:text-teal-400 font-bold'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  {tab.badge && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </div>
                <span className="text-[10px] mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-32 rounded-full bg-slate-300 dark:bg-slate-700 z-50" />
      </div>
    </div>
  );
};
