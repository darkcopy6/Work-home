import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Clock,
  DollarSign,
  CheckCircle2,
  FileText,
  Bookmark,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Play
} from 'lucide-react';

export const JobSeekerDashboard: React.FC = () => {
  const {
    currentUser,
    contracts,
    applications,
    jobs,
    walletBalance,
    escrowBalance,
    navigateTo,
    setSelectedJobForDetails,
    t,
  } = useApp();

  const myContracts = contracts.filter(c => c.workerId === currentUser.id);
  const myApplications = applications.filter(a => a.applicantId === currentUser.id);
  const savedJobs = jobs.filter(j => currentUser.savedJobIds.includes(j.id));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300 mb-2">
            <Briefcase className="h-3.5 w-3.5 text-teal-600" />
            <span>Job Seeker Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor active contracts, log live stopwatch hours, track submitted proposals, and manage payouts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('time')}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Launch Live Time Tracker</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase">Active Contracts</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{myContracts.length}</p>
          <span className="text-[11px] text-teal-600 font-medium">In progress</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase">Active Proposals</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{myApplications.length}</p>
          <span className="text-[11px] text-blue-600 font-medium">Under review</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase">Wallet Balance</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">${walletBalance.toFixed(2)}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Ready for payout</span>
        </div>

        <div className="rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent p-5 dark:border-teal-900 dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-teal-800 dark:text-teal-300 font-bold uppercase">Escrow Locked</span>
          <p className="text-2xl font-black text-teal-900 dark:text-white mt-1">${escrowBalance.toFixed(2)}</p>
          <span className="text-[11px] text-teal-600 font-medium">Pre-funded milestone pool</span>
        </div>
      </div>

      {/* Main Split: Active Contracts + Proposals & Saved */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Active Contracts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal-600" />
                <span>My Active Work Contracts</span>
              </h2>
              <button
                onClick={() => navigateTo('time')}
                className="text-xs font-bold text-teal-600 hover:underline"
              >
                Open Stopwatch ➔
              </button>
            </div>

            <div className="space-y-4">
              {myContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-950/40 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {contract.jobTitle}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Client: <strong className="text-slate-700 dark:text-slate-300">{contract.employerName}</strong> • Rate: ${contract.rate}/hr
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                      ${contract.totalEscrowAmount} in Escrow
                    </span>
                  </div>

                  {/* Milestones Progress */}
                  <div className="space-y-1.5 pt-2">
                    <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Milestones Deliverables:</p>
                    {contract.milestones.map((m) => (
                      <div key={m.id} className="flex items-center justify-between text-xs rounded-xl bg-white p-2.5 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{m.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">${m.amount}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            m.status === 'released' ? 'bg-emerald-50 text-emerald-700' : 'bg-teal-50 text-teal-700'
                          }`}>
                            {m.status === 'released' ? 'Paid' : 'Escrow Funded'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => navigateTo('time')}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 flex items-center gap-1.5"
                    >
                      <Play className="h-3.5 w-3.5 fill-white" />
                      <span>Log Hours Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submitted Proposals */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-teal-600" />
                <span>Submitted Proposals</span>
              </h2>
              <span className="text-xs text-slate-400">{myApplications.length} proposals</span>
            </div>

            <div className="space-y-3">
              {myApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/40 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{app.jobTitle}</h4>
                    <p className="text-slate-500 mt-0.5">
                      Bid: ${app.proposedRate} • Submitted on {app.submittedDate}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1 font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full text-[10px] w-fit">
                    <Sparkles className="h-3 w-3" />
                    Pending Employer Review
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Saved Jobs & Verification */}
        <div className="space-y-6">
          
          {/* Identity Verification Status */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Identity Badge</h3>
                <p className="text-[11px] text-slate-400">KYC Government ID Verified</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your identity is verified. You qualify for instant escrow payouts and priority matching in search results.
            </p>
          </div>

          {/* Bookmarked Jobs */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Saved Jobs ({savedJobs.length})</span>
              <Bookmark className="h-4 w-4 text-rose-500 fill-rose-500" />
            </h3>

            <div className="space-y-2.5">
              {savedJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJobForDetails(job);
                    navigateTo('job_details');
                  }}
                  className="cursor-pointer rounded-2xl border border-slate-100 bg-slate-50 p-3 hover:border-teal-500 dark:border-slate-800 dark:bg-slate-950 transition-colors"
                >
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{job.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>{job.type === 'hourly' ? `$${job.budget}/hr` : `$${job.budget}`}</span>
                    <span className="text-teal-600 font-semibold">View Details ➔</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
