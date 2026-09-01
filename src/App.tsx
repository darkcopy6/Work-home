import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { MobileFrame } from './components/common/MobileFrame';
import { AuthModal } from './components/auth/AuthModal';
import { HomePage } from './components/home/HomePage';
import { JobSearch } from './components/jobs/JobSearch';
import { JobDetailsModal } from './components/jobs/JobDetailsModal';
import { CreateJobModal } from './components/jobs/CreateJobModal';
import { TalentSearch } from './components/talent/TalentSearch';
import { WorkerProfileModal } from './components/talent/WorkerProfileModal';
import { LocationRadar } from './components/location/LocationRadar';
import { TimeTracker } from './components/tracker/TimeTracker';
import { WalletEscrow } from './components/wallet/WalletEscrow';
import { MessagesChat } from './components/chat/MessagesChat';
import { SocialFeed } from './components/social/SocialFeed';
import { JobSeekerDashboard } from './components/dashboard/JobSeekerDashboard';
import { EmployerDashboard } from './components/dashboard/EmployerDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import {
  ShieldCheck,
  Globe,
  Lock,
  Heart,
  Sparkles,
  Smartphone,
  Laptop
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentScreen, isMobileSimulator, toggleMobileSimulator, language, setLanguage, t, currentUser } = useApp();

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomePage />;
      case 'jobs':
        return <JobSearch />;
      case 'job_details':
        return <JobDetailsModal />;
      case 'create_job':
        return <CreateJobModal />;
      case 'talent':
        return <TalentSearch />;
      case 'worker_profile':
        return <WorkerProfileModal />;
      case 'location_radar':
        return <LocationRadar />;
      case 'time':
        return <TimeTracker />;
      case 'wallet':
        return <WalletEscrow />;
      case 'messages':
        return <MessagesChat />;
      case 'social':
        return <SocialFeed />;
      case 'dashboard_seeker':
        return <JobSeekerDashboard />;
      case 'dashboard_employer':
        return <EmployerDashboard />;
      case 'dashboard_admin':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      
      {/* Global Responsive Navigation Header */}
      <Header />

      {/* Main View Shell (Web vs Mobile Device Frame) */}
      <main className="flex-1">
        <MobileFrame>
          {renderCurrentScreen()}
        </MobileFrame>
      </main>

      {/* Global Modals */}
      <AuthModal />

      {/* Clean Global Footer (Hidden in Mobile Frame mode) */}
      {!isMobileSimulator && (
        <footer className="border-t border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900/60 py-10 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Brand Logo & Escrow Assurance */}
              <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 font-black text-white text-sm">
                  wh
                </div>
                <div>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">work home</span>
                  <p className="text-xs text-slate-500">Global Employment & Escrow Marketplace</p>
                </div>
              </div>

              {/* Escrow Guarantee Pill */}
              <div className="flex items-center gap-2 rounded-2xl bg-teal-50 px-4 py-2 text-xs font-semibold text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-900/60">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                <span>100% Escrow Fraud Protected • 5% Transparent Fee</span>
              </div>

              {/* View Switcher & Language */}
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <button
                  onClick={toggleMobileSimulator}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  <Smartphone className="h-3.5 w-3.5 text-teal-600" />
                  <span>Preview Mobile App</span>
                </button>

                <div className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                  <select
                    value={language}
                    onChange={(e: any) => setLanguage(e.target.value)}
                    aria-label="Select platform language"
                    className="bg-transparent font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option value="en">English (LTR)</option>
                    <option value="ar">العربية (RTL)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-100 dark:border-slate-800/80 pt-6 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} work home Inc. All rights reserved. Secure escrow arbitration & live time tracking.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
