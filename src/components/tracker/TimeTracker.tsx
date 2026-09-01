import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Play,
  Pause,
  Square,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Activity,
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const TimeTracker: React.FC = () => {
  const {
    activeTimerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopAndSaveTimer,
    contracts,
    timeEntries,
    currentUser,
    t,
  } = useApp();

  const [selectedContractId, setSelectedContractId] = useState<string>(
    contracts[0]?.id || ''
  );
  const [memoText, setMemoText] = useState<string>('Refactoring frontend state & adding escrow guards');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const activeContract = contracts.find(c => c.id === selectedContractId) || contracts[0];
  const hourlyRate = activeContract ? activeContract.rate : 65;

  // Format HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Live session earnings
  const sessionEarnings = ((activeTimerState.elapsedSeconds / 3600) * hourlyRate).toFixed(2);

  const handleStart = () => {
    if (!activeContract) return;
    startTimer(activeContract.id, activeContract.jobTitle, hourlyRate, memoText);
  };

  const handleStop = () => {
    stopAndSaveTimer(memoText);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Calculate totals
  const totalLoggedHours = timeEntries.reduce((acc, curr) => acc + curr.durationMinutes, 0) / 60;
  const totalLoggedEarnings = timeEntries.reduce((acc, curr) => acc + curr.earnedAmount, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-2">
            <Clock className="h-3.5 w-3.5 text-emerald-600" />
            <span>Automatic Time Tracking & Timesheets</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('timeTracker')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track work hours in real-time with automated timesheets, activity logs, and escrow payouts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-right dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Logged Hours</span>
            <p className="text-base font-extrabold text-slate-900 dark:text-white">{totalLoggedHours.toFixed(1)} hrs</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-2 text-right dark:border-emerald-900 dark:bg-emerald-950/40 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Total Tracked Earned</span>
            <p className="text-base font-extrabold text-emerald-800 dark:text-emerald-300">${totalLoggedEarnings.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Main Stopwatch Console Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg dark:border-slate-800 dark:bg-slate-900 space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Col 1: Contract & Memo Selector */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Active Hourly Contract
              </label>
              <select
                disabled={activeTimerState.isRunning}
                value={selectedContractId}
                onChange={(e) => setSelectedContractId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                {contracts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.jobTitle} — ${c.rate}/hr ({c.employerName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Work Session Memo / Task Note
              </label>
              <input
                type="text"
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                placeholder="What specific task are you working on right now?"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white font-medium"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Activity className="h-4 w-4 text-emerald-600 animate-pulse" />
              <span>Activity Rate: <strong>96% (Active Keyboard & Cursor)</strong></span>
            </div>
          </div>

          {/* Col 2: Big Live Digits & Dynamic Earnings */}
          <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-950 text-white shadow-inner relative overflow-hidden">
            
            {/* Status Pill */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`h-2.5 w-2.5 rounded-full ${
                activeTimerState.isRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
              }`} />
              <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400 font-bold">
                {activeTimerState.isRunning ? 'Recording Live Session' : activeTimerState.elapsedSeconds > 0 ? 'Session Paused' : 'Timer Idle'}
              </span>
            </div>

            {/* Big Digital Clock */}
            <div className="text-4xl sm:text-5xl font-mono font-black tracking-widest text-emerald-400 drop-shadow-md">
              {formatTime(activeTimerState.elapsedSeconds)}
            </div>

            {/* Dynamic Real-time Earnings */}
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-300 font-mono">
              <span>Accrued:</span>
              <span className="text-base font-bold text-white font-sans">${sessionEarnings}</span>
              <span className="text-[10px] text-slate-500">(@ ${hourlyRate}/hr)</span>
            </div>

            {/* Audio/Activity Visualizer Bars */}
            <div className="mt-4 flex items-end gap-1 h-5">
              {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65].map((h, i) => (
                <div
                  key={i}
                  style={{ height: activeTimerState.isRunning ? `${h}%` : '20%' }}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    activeTimerState.isRunning ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Col 3: Controls */}
          <div className="flex flex-col gap-3 justify-center">
            {!activeTimerState.isRunning && activeTimerState.elapsedSeconds === 0 && (
              <button
                onClick={handleStart}
                className="w-full rounded-2xl bg-emerald-600 py-4 text-sm font-extrabold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
              >
                <Play className="h-5 w-5 fill-white" />
                <span>Start Time Tracker</span>
              </button>
            )}

            {activeTimerState.isRunning && (
              <div className="space-y-3">
                <button
                  onClick={pauseTimer}
                  className="w-full rounded-2xl bg-amber-500 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                >
                  <Pause className="h-4 w-4 fill-white" />
                  <span>Pause Timer</span>
                </button>

                <button
                  onClick={handleStop}
                  className="w-full rounded-2xl bg-rose-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
                >
                  <Square className="h-4 w-4 fill-white" />
                  <span>Stop & Save to Timesheet</span>
                </button>
              </div>
            )}

            {!activeTimerState.isRunning && activeTimerState.elapsedSeconds > 0 && (
              <div className="space-y-3">
                <button
                  onClick={resumeTimer}
                  className="w-full rounded-2xl bg-emerald-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Resume Session</span>
                </button>

                <button
                  onClick={handleStop}
                  className="w-full rounded-2xl bg-slate-800 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
                >
                  <Square className="h-4 w-4 fill-white" />
                  <span>Save Session ({formatTime(activeTimerState.elapsedSeconds)})</span>
                </button>
              </div>
            )}

            {saveSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
                <span>Time entry logged successfully to your weekly timesheet!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timesheets History Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-teal-600" />
              <span>Logged Work Sessions & Escrow Review</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Weekly verified timesheets automatically synchronized with your employer's escrow account
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              {timeEntries.length} entries recorded
            </span>
          </div>
        </div>

        {/* Entries Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800">
                <th className="pb-3 font-semibold">Date & Contract</th>
                <th className="pb-3 font-semibold">Task Memo</th>
                <th className="pb-3 font-semibold">Duration</th>
                <th className="pb-3 font-semibold">Activity %</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold text-right">Escrow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {timeEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5">
                    <p className="font-bold text-slate-900 dark:text-white">{entry.date}</p>
                    <p className="text-[11px] text-slate-500">{entry.jobTitle}</p>
                  </td>
                  <td className="py-3.5 max-w-xs">
                    <p className="font-medium text-slate-700 dark:text-slate-300 truncate">{entry.memo}</p>
                  </td>
                  <td className="py-3.5 font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {Math.floor(entry.durationMinutes / 60)}h {entry.durationMinutes % 60}m
                  </td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full text-[10px]">
                      {entry.activityPercent}%
                    </span>
                  </td>
                  <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                    ${entry.earnedAmount.toFixed(2)}
                  </td>
                  <td className="py-3.5 text-right">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      entry.status === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : entry.status === 'approved'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      <CheckCircle2 className="h-3 w-3" />
                      {entry.status === 'paid' ? 'Paid & Released' : entry.status === 'approved' ? 'Approved' : 'Pending Review'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
