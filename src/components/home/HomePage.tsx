import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job, UserProfile } from '../../types';
import {
  Search,
  MapPin,
  ShieldCheck,
  Clock,
  Wallet,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle2,
  Lock,
  Layers,
  Users,
  Briefcase,
  Compass,
  TrendingUp,
  Bookmark,
  ChevronRight,
  Globe,
  SlidersHorizontal
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    jobs,
    talents,
    posts,
    t,
    navigateTo,
    setSelectedJobForDetails,
    setSelectedTalentForProfile,
    toggleSaveJob,
    currentUser,
    switchRole,
    setSearchFilterKeyword,
    setSelectedCategoryFilter,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchTab, setActiveSearchTab] = useState<'jobs' | 'talents'>('jobs');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilterKeyword(searchQuery);
    if (activeSearchTab === 'jobs') {
      navigateTo('jobs');
    } else {
      navigateTo('talent');
    }
  };

  const featuredJobs = jobs.filter(j => j.featured || j.urgency === 'urgent').slice(0, 4);
  const topTalents = talents.slice(0, 3);

  const categories = [
    { name: 'Software & Tech', icon: '💻', count: '1,420 jobs', color: 'from-blue-500/10 to-indigo-500/10' },
    { name: 'Design & Creative', icon: '🎨', count: '890 jobs', color: 'from-pink-500/10 to-rose-500/10' },
    { name: 'Mobile Development', icon: '📱', count: '650 jobs', color: 'from-teal-500/10 to-emerald-500/10' },
    { name: 'AI & Data Science', icon: '🤖', count: '480 jobs', color: 'from-purple-500/10 to-violet-500/10' },
    { name: 'Writing & Translation', icon: '✍️', count: '320 jobs', color: 'from-amber-500/10 to-orange-500/10' },
    { name: 'On-site & Nearby', icon: '📍', count: '510 jobs', color: 'from-emerald-500/10 to-cyan-500/10' },
  ];

  return (
    <div className="min-h-screen pb-16 space-y-16 animate-fadeIn">
      
      {/* 1. Hero Bento Matrix */}
      <section className="relative overflow-hidden pt-8 pb-12 lg:pt-14 lg:pb-18 border-b border-slate-200/80 bg-gradient-to-b from-slate-100/60 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900/80 dark:to-slate-950 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Main Top Bento Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Primary Large Bento Search Card (Spans 8 columns on desktop) */}
            <div className="lg:col-span-8 rounded-3xl border border-slate-200/90 bg-white/90 p-6 sm:p-10 shadow-lg dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-md flex flex-col justify-between relative overflow-hidden bento-dot-grid">
              
              <div className="space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-teal-50/80 px-3.5 py-1 text-xs font-semibold text-teal-800 shadow-xs dark:border-teal-800/80 dark:bg-teal-950/60 dark:text-teal-300">
                  <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Next-Gen Global Employment & Escrow Marketplace</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Work from anywhere. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500 dark:from-teal-400 dark:via-emerald-400 dark:to-teal-300">
                    Earn with total escrow security.
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                  {t('heroSubtitle')}
                </p>
              </div>

              {/* Dual Search Engine inside Hero Bento */}
              <div className="pt-6 relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setActiveSearchTab('jobs')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      activeSearchTab === 'jobs'
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    Search Jobs ({jobs.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSearchTab('talents')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      activeSearchTab === 'talents'
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    Find Top Talent ({talents.length})
                  </button>
                </div>

                <form
                  onSubmit={handleHeroSearch}
                  className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl border border-slate-300/80 bg-white p-2 shadow-xl shadow-teal-900/5 dark:border-slate-700 dark:bg-slate-950"
                >
                  <div className="relative flex-1 w-full flex items-center">
                    <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        activeSearchTab === 'jobs'
                          ? 'Job title, required skill (e.g. React, UI/UX, Python)...'
                          : 'Expert role, developer, designer, copywriter...'
                      }
                      className="w-full rounded-xl bg-transparent py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium focus:outline-none dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto rounded-xl bg-teal-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search {activeSearchTab === 'jobs' ? 'Jobs' : 'Talents'}</span>
                  </button>
                </form>

                {/* Popular Tags */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-400">Popular:</span>
                  {['Remote Developer', 'UI/UX Design', 'Flutter Mobile', 'Cloud Security', 'Jobs Within 5km'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (tag.includes('5km')) {
                          navigateTo('location_radar');
                        } else {
                          setSearchFilterKeyword(tag);
                          navigateTo('jobs');
                        }
                      }}
                      className="rounded-lg bg-slate-100/80 px-2 py-1 border border-slate-200 hover:border-teal-500 hover:text-teal-600 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-300 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Bento Grid: Feature Tiles (Spans 4 columns on desktop) */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              
              {/* Bento Card: Live Radar Detection */}
              <div
                onClick={() => navigateTo('location_radar')}
                className="cursor-pointer rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-white shadow-lg transition-all hover:scale-[1.02] hover:border-teal-500 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 px-2.5 py-0.5 text-[10px] font-bold text-teal-300 border border-teal-500/30 font-mono">
                    <Compass className="h-3 w-3 animate-spin" />
                    LIVE GPS RADAR
                  </span>
                  <span className="text-xs text-teal-400 font-bold">1km - 10km</span>
                </div>

                <div className="my-4">
                  <h3 className="text-lg font-bold text-white">Local Job Radar</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Discover instant on-site and nearby freelance jobs with live distance filtering.
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-teal-300 font-bold pt-2 border-t border-slate-800">
                  <span>Explore Near You</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              {/* Bento Card: Live Time Tracker & Escrow Payouts */}
              <div
                onClick={() => navigateTo('time')}
                className="cursor-pointer rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-md transition-all hover:scale-[1.02] hover:border-emerald-500 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <Clock className="h-3 w-3 text-emerald-600" />
                    AUTOMATED STOPWATCH
                  </span>
                  <span className="text-xs font-black text-emerald-600">5% Fee</span>
                </div>

                <div className="my-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Time Tracking & Timesheets</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Log billable hours automatically with activity detection and verified timesheets.
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Launch Stopwatch</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>

            </div>
          </div>

          {/* Value Props Bento Quad Matrix */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 text-center dark:border-slate-800 dark:bg-slate-900/70 backdrop-blur-xs shadow-xs hover:border-teal-500 transition-all">
              <ShieldCheck className="mx-auto h-6 w-6 text-teal-600 mb-1" />
              <p className="text-base font-extrabold text-slate-900 dark:text-white">100% Escrow</p>
              <p className="text-xs text-slate-500">Zero fraud guarantee</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 text-center dark:border-slate-800 dark:bg-slate-900/70 backdrop-blur-xs shadow-xs hover:border-emerald-500 transition-all">
              <Clock className="mx-auto h-6 w-6 text-emerald-600 mb-1" />
              <p className="text-base font-extrabold text-slate-900 dark:text-white">Live Time Tracking</p>
              <p className="text-xs text-slate-500">Stopwatch & timesheets</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 text-center dark:border-slate-800 dark:bg-slate-900/70 backdrop-blur-xs shadow-xs hover:border-indigo-500 transition-all">
              <Wallet className="mx-auto h-6 w-6 text-indigo-600 mb-1" />
              <p className="text-base font-extrabold text-slate-900 dark:text-white">5% Low Commission</p>
              <p className="text-xs text-slate-500">Transparent fair pricing</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 text-center dark:border-slate-800 dark:bg-slate-900/70 backdrop-blur-xs shadow-xs hover:border-rose-500 transition-all">
              <Compass className="mx-auto h-6 w-6 text-rose-600 mb-1" />
              <p className="text-base font-extrabold text-slate-900 dark:text-white">1km - 10km Radar</p>
              <p className="text-xs text-slate-500">Local & global jobs</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Escrow Workflow Breakdown - Bento Card Chain */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 sm:p-10 shadow-lg dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800 mb-2">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                WorkHome Escrow Security Model
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Employer ➔ Platform Escrow Vault ➔ Worker
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-teal-600/10 px-4 py-2 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-500/20">
              <Lock className="h-4 w-4 text-teal-600" />
              <span>Funds Protected Until Deliverables Are Approved</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-950/70 shadow-xs hover:border-teal-500 transition-all flex flex-col justify-between">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600 text-white font-extrabold text-sm mb-4 shadow-sm">
                  1
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Upfront Escrow Deposit
                </h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  When an employer hires a worker or awards a milestone, payment is deposited securely into the WorkHome Vault before work begins.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 text-[11px] font-bold text-teal-600">
                100% Pre-funded Guarantee
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-950/70 shadow-xs hover:border-emerald-500 transition-all flex flex-col justify-between">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white font-extrabold text-sm mb-4 shadow-sm">
                  2
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Track Hours & Milestones
                </h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  The worker executes deliverables, uses the live session stopwatch, and submits progress or completed milestones directly in the dashboard.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 text-[11px] font-bold text-emerald-600">
                Live Stopwatch & Activity Logs
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-950/70 shadow-xs hover:border-indigo-500 transition-all flex flex-col justify-between">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white font-extrabold text-sm mb-4 shadow-sm">
                  3
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Approval & Instant Release
                </h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Upon review, the employer releases the funds. WorkHome deducts a transparent 5% platform commission and transfers 95% immediately to the worker.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 text-[11px] font-bold text-indigo-600">
                5% Low Platform Fee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured & Urgent Jobs - Bento Tiles */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Featured Opportunities
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified jobs with 100% pre-funded escrow security
            </p>
          </div>
          <button
            onClick={() => navigateTo('jobs')}
            className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400"
          >
            <span>View All ({jobs.length})</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featuredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => {
                setSelectedJobForDetails(job);
                navigateTo('job_details');
              }}
              className="group cursor-pointer rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-sm transition-all hover:border-teal-500 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/90 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={job.employerAvatar}
                      alt={job.employerName}
                      className="h-12 w-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {job.employerCompany || job.employerName}
                        </span>
                        {job.employerVerified && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <MapPin className="h-3 w-3 text-rose-500" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-black px-3 py-1 rounded-full ${
                      job.type === 'hourly'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200/60'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/60'
                    }`}>
                      {job.type === 'hourly' ? `$${job.budget}/hr` : `$${job.budget} Fixed`}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveJob(job.id);
                      }}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    >
                      <Bookmark
                        className={`h-4 w-4 ${currentUser.savedJobIds.includes(job.id) ? 'fill-rose-500 text-rose-500' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                <h3 className="mt-4 font-extrabold text-base text-slate-900 group-hover:text-teal-600 transition-colors dark:text-white">
                  {job.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.requiredSkills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-slate-100/80 px-2.5 py-1 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5 dark:border-slate-800 text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="h-3 w-3 text-slate-400" />
                  {job.datePosted}
                </span>
                <span className="font-bold text-teal-600 dark:text-teal-400">
                  {job.applicantsCount} proposals submitted
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Popular Categories Bento Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Explore by Category
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover opportunities across major industries and local zones
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => {
                setSelectedCategoryFilter(cat.name === 'On-site & Nearby' ? 'All' : cat.name);
                if (cat.name === 'On-site & Nearby') {
                  navigateTo('location_radar');
                } else {
                  navigateTo('jobs');
                }
              }}
              className="cursor-pointer rounded-2xl border border-slate-200/90 bg-white/90 p-5 text-center transition-all hover:border-teal-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 flex flex-col items-center justify-center hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-2.5">{cat.icon}</div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white truncate w-full">
                {cat.name}
              </h3>
              <p className="text-[10px] font-semibold text-slate-400 mt-1">{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Top Talent Spotlight Bento Tiles */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Top Verified Professionals
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              5-factor reviewed specialists ready for immediate hire
            </p>
          </div>
          <button
            onClick={() => navigateTo('talent')}
            className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400"
          >
            <span>Browse All Talents</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topTalents.map((talent) => (
            <div
              key={talent.id}
              onClick={() => {
                setSelectedTalentForProfile(talent);
                navigateTo('worker_profile');
              }}
              className="cursor-pointer rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-sm transition-all hover:border-teal-500 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/90 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <img
                    src={talent.avatar}
                    alt={talent.name}
                    className="h-14 w-14 rounded-2xl object-cover ring-2 ring-teal-500/20"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {talent.name}
                      </h3>
                      {talent.verified && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                      )}
                    </div>
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold mt-0.5">
                      {talent.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="h-3 w-3 fill-amber-400" />
                        {talent.rating.overall.toFixed(1)}
                      </span>
                      <span>({talent.rating.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="mt-3.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {talent.bio}
                </p>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {talent.skills.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="rounded-lg bg-slate-100/80 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5 dark:border-slate-800">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  ${talent.hourlyRate}/hr
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {talent.availability === 'available' ? 'Available Now' : 'Busy'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Community Showcase Snippet Bento Card */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900/90 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-teal-600" />
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                  Professional Community & Work Samples
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Employers showcase projects; freelancers share live design systems and code demos
              </p>
            </div>
            <button
              onClick={() => navigateTo('social')}
              className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 transition-colors"
            >
              Open Social Feed ({posts.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.slice(0, 2).map((post) => (
              <div
                key={post.id}
                onClick={() => navigateTo('social')}
                className="cursor-pointer rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 transition-all hover:bg-white hover:border-teal-500 hover:shadow-xs dark:border-slate-800/80 dark:bg-slate-950/40"
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="h-9 w-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {post.authorName}
                    </p>
                    <p className="text-[10px] text-slate-400">{post.authorTitle}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 mb-2 leading-relaxed">
                  {post.content}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold pt-2 border-t border-slate-200/50 dark:border-slate-800">
                  <span>❤️ {post.likes} likes</span>
                  <span>💬 {post.commentsCount} comments</span>
                  <span>🚀 {post.shares} shares</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA Bento Card */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-700 p-8 sm:p-12 text-center text-white shadow-xl shadow-teal-700/10 relative overflow-hidden bento-dot-grid">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to hire or start earning today?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-teal-100 max-w-xl mx-auto">
              Join the only freelance marketplace offering live time tracking, 1km-10km radar search, and 100% escrow fraud protection.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  switchRole('employer');
                  navigateTo('create_job');
                }}
                className="rounded-xl bg-white px-6 py-3 text-xs sm:text-sm font-extrabold text-teal-900 shadow-md hover:bg-teal-50 transition-colors"
              >
                Post a Job (Fund Escrow)
              </button>
              <button
                onClick={() => {
                  switchRole('job_seeker');
                  navigateTo('jobs');
                }}
                className="rounded-xl border border-white/80 bg-teal-800/40 px-6 py-3 text-xs sm:text-sm font-extrabold text-white hover:bg-teal-800/60 transition-colors"
              >
                Explore Open Jobs
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
