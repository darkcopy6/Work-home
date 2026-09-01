import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building,
  Plus,
  Users,
  Lock,
  Unlock,
  CheckCircle2,
  DollarSign,
  Briefcase,
  FileText,
  Clock,
  Sparkles,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export const EmployerDashboard: React.FC = () => {
  const {
    currentUser,
    jobs,
    applications,
    contracts,
    walletBalance,
    escrowBalance,
    navigateTo,
    setSelectedJobForDetails,
    acceptApplication,
    releaseMilestoneEscrow,
    startOrOpenConversationWithUser,
    t,
  } = useApp();

  const myJobs = jobs.filter(j => j.employerId === currentUser.id);
  const myContracts = contracts.filter(c => c.employerId === currentUser.id);
  const pendingApplications = applications.filter(a =>
    myJobs.some(j => j.id === a.jobId) && a.status === 'submitted'
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300 mb-2">
            <Building className="h-3.5 w-3.5 text-teal-600" />
            <span>Employer Management Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {currentUser.companyName || currentUser.name} Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage posted jobs, review incoming talent proposals, and approve escrow milestone disbursements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('create_job')}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{t('postJob')}</span>
          </button>
        </div>
      </div>

      {/* Metrics Bento */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase">Published Jobs</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{myJobs.length}</p>
          <span className="text-[11px] text-teal-600 font-medium">Active listings</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase">Incoming Proposals</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{pendingApplications.length}</p>
          <span className="text-[11px] text-blue-600 font-medium">Awaiting decision</span>
        </div>

        <div className="rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent p-5 dark:border-teal-900 dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-teal-800 dark:text-teal-300 font-bold uppercase">Escrow Vault Locked</span>
          <p className="text-2xl font-black text-teal-900 dark:text-white mt-1">${escrowBalance.toFixed(2)}</p>
          <span className="text-[11px] text-teal-600 font-medium">Pre-funded milestone pool</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase">Hired Freelancers</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{myContracts.length}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Active engagements</span>
        </div>
      </div>

      {/* Main Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Incoming Proposals & Published Jobs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pending Proposals Review */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-teal-600" />
                <span>Review Candidate Proposals</span>
              </h2>
              <span className="text-xs font-semibold text-teal-600 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-full">
                {pendingApplications.length} pending
              </span>
            </div>

            {pendingApplications.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No new proposals pending review at this moment.
              </p>
            ) : (
              <div className="space-y-4">
                {pendingApplications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-950/40 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.applicantAvatar}
                          alt={app.applicantName}
                          className="h-11 w-11 rounded-2xl object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                            {app.applicantName}
                          </h3>
                          <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                            Applying for: {app.jobTitle}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Bid: ${app.proposedRate} ({app.rateType})
                        </span>
                        <p className="text-[10px] text-slate-400">Duration: {app.estimatedDuration}</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white p-3 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      "{app.coverLetter}"
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => startOrOpenConversationWithUser(app.applicantId, app.jobId, app.jobTitle)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                      >
                        Chat Candidate
                      </button>

                      <button
                        onClick={() => acceptApplication(app.id)}
                        className="rounded-xl bg-teal-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Accept Proposal & Fund Escrow</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Published Job Listings */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-600" />
                <span>My Published Jobs</span>
              </h2>
              <button
                onClick={() => navigateTo('create_job')}
                className="text-xs font-bold text-teal-600 hover:underline"
              >
                + Post Another Job
              </button>
            </div>

            <div className="space-y-3">
              {myJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJobForDetails(job);
                    navigateTo('job_details');
                  }}
                  className="cursor-pointer rounded-2xl border border-slate-100 bg-slate-50/50 p-4 hover:border-teal-500 dark:border-slate-800 dark:bg-slate-950/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{job.title}</h4>
                    <span className="font-bold text-xs text-teal-600">
                      {job.type === 'hourly' ? `$${job.budget}/hr` : `$${job.budget}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>{job.category} • Posted {job.datePosted}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {job.applicantsCount} applicants received
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Active Contracts & Escrow Release */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Hired Contracts ({myContracts.length})</span>
              <Lock className="h-4 w-4 text-teal-600" />
            </h3>

            <div className="space-y-3">
              {myContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{contract.jobTitle}</h4>
                      <p className="text-[11px] text-slate-500">Worker: {contract.workerName}</p>
                    </div>
                    <span className="text-[11px] font-bold text-teal-600">${contract.totalEscrowAmount}</span>
                  </div>

                  {contract.milestones.map((m) => (
                    <div key={m.id} className="flex items-center justify-between text-[11px] border-t border-slate-200/60 pt-1.5 dark:border-slate-800">
                      <span className="truncate max-w-[130px]">{m.title}</span>
                      {m.status === 'funded' ? (
                        <button
                          onClick={() => releaseMilestoneEscrow(contract.id, m.id)}
                          className="rounded-lg bg-teal-600 px-2 py-0.5 font-bold text-white text-[10px] hover:bg-teal-700"
                        >
                          Release ${m.amount}
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-bold">Paid ✓</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
