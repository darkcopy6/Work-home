import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job } from '../../types';
import { translateTextSimulated } from '../../i18n/translations';
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  Share2,
  Globe,
  Sparkles,
  Send,
  Building,
  UserCheck,
  Layers,
  Paperclip,
  Check,
  AlertCircle
} from 'lucide-react';

export const JobDetailsModal: React.FC = () => {
  const {
    selectedJobForDetails,
    currentUser,
    language,
    t,
    navigateTo,
    applyToJob,
    toggleSaveJob,
    startOrOpenConversationWithUser,
  } = useApp();

  const job = selectedJobForDetails;

  const [proposedRate, setProposedRate] = useState<number>(job?.budget || 65);
  const [estimatedDuration, setEstimatedDuration] = useState<string>(job?.duration || '1 to 3 months');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [isTranslated, setIsTranslated] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [proposalSubmitted, setProposalSubmitted] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!job) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-sm text-slate-500">No job selected.</p>
        <button
          onClick={() => navigateTo('jobs')}
          className="mt-4 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  const displayTitle = isTranslated ? translateTextSimulated(job.title, language) : job.title;
  const displayDesc = isTranslated ? translateTextSimulated(job.description, language) : job.description;

  // AI Proposal Enhancer Generator
  const handleGenerateAiProposal = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const generated = `Hi ${job.employerName},

I reviewed your requirements for "${job.title}" and would love to collaborate on this assignment. 

With over ${currentUser.experienceYears} years of deep experience in ${job.requiredSkills.slice(0, 3).join(', ')}, I have engineered similar high-throughput architectures and delivered production-grade solutions on schedule.

Key milestones I will deliver:
1. Complete architectural review & setup within week 1.
2. Rapid iterative delivery of the core features with robust unit testing.
3. Zero-downtime deployment, documentation handoff, and post-launch verification.

I am available to start immediately and commit ${job.expectedHoursPerWeek || 35}+ hours per week with live time tracking on WorkHome.

Best regards,
${currentUser.name}`;
      setCoverLetter(generated);
      setIsAiGenerating(false);
    }, 900);
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter.trim()) return;

    applyToJob(job.id, {
      proposedRate,
      rateType: job.type,
      coverLetter,
      estimatedDuration,
    });

    setProposalSubmitted(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Back Button & Action Controls */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateTo('jobs')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-600 dark:text-slate-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Job Search</span>
        </button>

        <div className="flex items-center gap-2">
          {language !== 'en' && (
            <button
              onClick={() => setIsTranslated(!isTranslated)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <Globe className="h-3.5 w-3.5 text-teal-600" />
              <span>{isTranslated ? 'Original Text' : `Translate to ${language.toUpperCase()}`}</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
            title="Share job"
          >
            {copySuccess ? <Check className="h-4 w-4 text-teal-600" /> : <Share2 className="h-4 w-4" />}
          </button>

          <button
            onClick={() => toggleSaveJob(job.id)}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
            title="Save job"
          >
            <Bookmark className={`h-4 w-4 ${currentUser.savedJobIds.includes(job.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Main Job Details & Proposal Box */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Job Overview Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
            
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  {job.category}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  Posted {job.datePosted}
                </span>
                {job.urgency === 'urgent' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                    ⚡ Urgent Hire
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {displayTitle}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-teal-600" />
                  {job.location}
                </span>
                <span>•</span>
                <span>Arrangement: <strong className="capitalize text-slate-800 dark:text-slate-200">{job.locationType}</strong></span>
                <span>•</span>
                <span>Experience: <strong className="capitalize text-slate-800 dark:text-slate-200">{job.experienceLevel}</strong></span>
              </div>
            </div>

            {/* Scope / Description */}
            <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Job Overview & Scope of Work
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {displayDesc}
              </p>
            </div>

            {/* Required Skills */}
            <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                Required Skills & Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Milestones (if fixed) */}
            {job.milestones && job.milestones.length > 0 && (
              <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                  Planned Project Milestones (Pre-Funded)
                </h2>
                <div className="space-y-2">
                  {job.milestones.map((m, idx) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/40 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-800 font-bold text-[10px] dark:bg-teal-950 dark:text-teal-300">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{m.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">${m.amount}</span>
                        <span className="text-[10px] uppercase font-bold text-teal-600 bg-teal-50 dark:bg-teal-950 px-1.5 py-0.5 rounded">
                          {m.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Proposal Application Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Apply for this Assignment
                </h2>
                <p className="text-xs text-slate-500">
                  Submit your custom bid, delivery timeline, and pitch
                </p>
              </div>

              {/* AI Proposal Generator Button */}
              <button
                type="button"
                onClick={handleGenerateAiProposal}
                disabled={isAiGenerating}
                className="inline-flex items-center gap-1.5 rounded-xl border border-teal-300 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800 hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                <span>{isAiGenerating ? 'Drafting proposal...' : '✨ AI Proposal Generator'}</span>
              </button>
            </div>

            {proposalSubmitted ? (
              <div className="rounded-2xl bg-emerald-50 p-6 text-center text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600 mb-2" />
                <h3 className="text-base font-bold">Proposal Submitted Successfully!</h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 max-w-md mx-auto">
                  {job.employerName} has been notified. When your proposal is accepted, escrow will automatically fund and create your contract.
                </p>
                <button
                  onClick={() => navigateTo('dashboard_seeker')}
                  className="mt-4 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700"
                >
                  View in My Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleProposalSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Your Proposed Rate ({job.type === 'hourly' ? '$/hour' : 'Total Fixed $'})
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="number"
                        required
                        value={proposedRate}
                        onChange={(e) => setProposedRate(+e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs font-semibold focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Platform fee (5%): ${(proposedRate * 0.05).toFixed(2)} • You receive: ${(proposedRate * 0.95).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Estimated Duration
                    </label>
                    <input
                      type="text"
                      required
                      value={estimatedDuration}
                      onChange={(e) => setEstimatedDuration(e.target.value)}
                      placeholder="e.g. 2 to 4 weeks"
                      className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3.5 text-xs font-semibold focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cover Letter & Pitch
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Explain why you are the best fit for this project, relevant achievements, and how you will approach the milestones..."
                    className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs leading-relaxed focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <ShieldCheck className="h-4 w-4 text-teal-600" />
                    <span>Protected by WorkHome Escrow Guarantee</span>
                  </div>

                  <button
                    type="submit"
                    className="rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-colors flex items-center gap-2"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Proposal</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right 1 Col: Employer Info & Budget Summary */}
        <div className="space-y-6">
          
          {/* Budget & Terms Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Payment & Engagement Terms
            </h3>

            <div className="rounded-2xl bg-teal-50/70 p-4 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60">
              <span className="text-xs text-teal-800 dark:text-teal-300 font-medium">Offered Budget</span>
              <p className="text-2xl font-black text-teal-900 dark:text-white">
                {job.type === 'hourly' ? `$${job.budget}/hr` : `$${job.budget.toLocaleString()}`}
              </p>
              <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-0.5">
                {job.type === 'hourly' ? 'Live time tracking with stopwatch' : 'Milestone-based escrow release'}
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Working Arrangement:</span>
                <span className="font-semibold text-slate-900 dark:text-white capitalize">{job.locationType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Expected Weekly Hours:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{job.expectedHoursPerWeek || 35} hrs/wk</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Proposals Received:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{job.applicantsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Platform Commission:</span>
                <span className="font-semibold text-teal-600">5% (Low Flat)</span>
              </div>
            </div>
          </div>

          {/* Employer Verification Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              About the Employer
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={job.employerAvatar}
                alt={job.employerName}
                className="h-12 w-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <div>
                <div className="flex items-center gap-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {job.employerCompany || job.employerName}
                  </h4>
                  {job.employerVerified && (
                    <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500">{job.employerName}</p>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Payment Verification:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Employer Rating:</span>
                <span className="font-bold text-amber-500">⭐ {job.employerRating.toFixed(1)} / 5.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Spent:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">$82,400+</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Hire Rate:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">88%</span>
              </div>
            </div>

            <button
              onClick={() => {
                startOrOpenConversationWithUser(job.employerId, job.id, job.title);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 transition-colors"
            >
              Direct Message Employer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
