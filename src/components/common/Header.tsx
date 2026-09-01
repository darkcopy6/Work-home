import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LANGUAGES } from '../../i18n/translations';
import { UserRole, LanguageCode } from '../../types';
import {
  Briefcase,
  Search,
  Clock,
  Wallet,
  MessageSquare,
  Bell,
  Sun,
  Moon,
  Smartphone,
  Monitor,
  Globe,
  ShieldCheck,
  Compass,
  Users,
  Layers,
  ChevronDown,
  LogOut,
  User,
  PlusCircle,
  Menu,
  X,
  Sparkles,
  LifeBuoy
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    language,
    isDarkMode,
    isMobileSimulator,
    currentScreen,
    notifications,
    activeTimerState,
    t,
    setLanguage,
    toggleDarkMode,
    toggleMobileSimulator,
    navigateTo,
    openAuthModal,
    logoutUser,
    switchRole,
    markAllNotificationsAsRead,
  } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    setIsUserMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: t('appName'), icon: Briefcase },
    { id: 'jobs', label: t('findWork'), icon: Search },
    { id: 'talent', label: t('findTalent'), icon: Users },
    { id: 'location_radar', label: t('radarMap'), icon: Compass },
    { id: 'social', label: t('socialFeed'), icon: Layers },
    { id: 'time', label: t('activeTimer'), icon: Clock, badge: activeTimerState.isRunning ? 'LIVE' : undefined },
    { id: 'payments', label: t('wallet'), icon: Wallet },
    { id: 'messages', label: t('messages'), icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo & Tag */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-500/20 group-hover:bg-teal-700 transition-all">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  work<span className="text-teal-600 dark:text-teal-400">home</span>
                </span>
                <span className="inline-flex items-center rounded-full bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none">
                Global Marketplace
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons & User Control */}
        <div className="flex items-center gap-2">
          
          {/* Post Job Quick CTA (if Employer or general) */}
          <button
            onClick={() => {
              if (currentUser.role !== 'employer') {
                switchRole('employer');
              }
              navigateTo('create_job');
            }}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>{t('postJob')}</span>
          </button>

          {/* Role Pill Switcher */}
          <div className="hidden sm:flex items-center rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => handleRoleSwitch('job_seeker')}
              className={`px-2 py-1 rounded-md transition-all ${
                currentUser.role === 'job_seeker'
                  ? 'bg-white text-teal-700 shadow-xs font-semibold dark:bg-slate-900 dark:text-teal-300'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Seeker
            </button>
            <button
              onClick={() => handleRoleSwitch('employer')}
              className={`px-2 py-1 rounded-md transition-all ${
                currentUser.role === 'employer'
                  ? 'bg-white text-teal-700 shadow-xs font-semibold dark:bg-slate-900 dark:text-teal-300'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Employer
            </button>
            <button
              onClick={() => handleRoleSwitch('admin')}
              className={`px-2 py-1 rounded-md transition-all ${
                currentUser.role === 'admin'
                  ? 'bg-white text-amber-700 shadow-xs font-semibold dark:bg-slate-900 dark:text-amber-300'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Mobile Simulator Toggle */}
          <button
            onClick={toggleMobileSimulator}
            title={isMobileSimulator ? 'Switch to Web Desktop View' : 'Switch to Mobile App Simulator'}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
              isMobileSimulator
                ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {isMobileSimulator ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            title="Toggle theme"
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-teal-600" />
              <span>{LANGUAGES.find(l => l.code === language)?.flag}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Language
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      language === lang.code
                        ? 'bg-teal-50 text-teal-700 font-bold dark:bg-teal-950/60 dark:text-teal-300'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </span>
                    {lang.dir === 'rtl' && (
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-500">
                        RTL
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{t('notifications')}</span>
                    {unreadNotifs.length > 0 && (
                      <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                        {unreadNotifs.length} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {notifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (notif.actionScreen) navigateTo(notif.actionScreen);
                        setIsNotifOpen(false);
                      }}
                      className={`p-3 text-left transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                        !notif.read ? 'bg-teal-50/40 dark:bg-teal-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-100 p-2 text-center dark:border-slate-800">
                  <button
                    onClick={() => {
                      navigateTo('notifications');
                      setIsNotifOpen(false);
                    }}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 rounded-full p-0.5 border-2 border-transparent hover:border-teal-500 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </span>
                    {currentUser.verified && (
                      <ShieldCheck className="h-3.5 w-3.5 text-teal-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-teal-50 px-2 py-1 dark:bg-teal-950/40">
                    <span className="text-[11px] text-teal-800 dark:text-teal-300 font-medium">Balance:</span>
                    <span className="text-xs font-bold text-teal-900 dark:text-teal-200">
                      ${currentUser.walletBalance.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="py-1 text-xs">
                  <button
                    onClick={() => {
                      if (currentUser.role === 'job_seeker') navigateTo('dashboard_seeker');
                      else if (currentUser.role === 'employer') navigateTo('dashboard_employer');
                      else navigateTo('dashboard_admin');
                      setIsUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <User className="h-4 w-4 text-teal-600" />
                    <span>{t('myDashboard')}</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('payments');
                      setIsUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Wallet className="h-4 w-4 text-emerald-600" />
                    <span>{t('wallet')}</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('settings');
                      setIsUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>{t('settings')}</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('support');
                      setIsUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <LifeBuoy className="h-4 w-4 text-blue-500" />
                    <span>{t('support')}</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    onClick={() => {
                      openAuthModal('login');
                      setIsUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('logout')} / Switch Account</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileNavOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 shadow-xl">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => {
                handleRoleSwitch('job_seeker');
                setIsMobileNavOpen(false);
              }}
              className={`py-2 text-xs font-semibold rounded-lg border ${
                currentUser.role === 'job_seeker' ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300' : 'border-slate-200 text-slate-600'
              }`}
            >
              Job Seeker Role
            </button>
            <button
              onClick={() => {
                handleRoleSwitch('employer');
                setIsMobileNavOpen(false);
              }}
              className={`py-2 text-xs font-semibold rounded-lg border ${
                currentUser.role === 'employer' ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300' : 'border-slate-200 text-slate-600'
              }`}
            >
              Employer Role
            </button>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigateTo(item.id);
                    setIsMobileNavOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-teal-600" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
