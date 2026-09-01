import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Job } from '../../types';
import { translateTextSimulated } from '../../i18n/translations';
import {
  Search,
  MapPin,
  Filter,
  SlidersHorizontal,
  DollarSign,
  Clock,
  CheckCircle2,
  Sparkles,
  Bookmark,
  ChevronDown,
  Globe,
  Plus,
  ArrowUpDown,
  Building,
  ShieldCheck,
  Compass
} from 'lucide-react';

export const JobSearch: React.FC = () => {
  const {
    jobs,
    currentUser,
    language,
    t,
    navigateTo,
    setSelectedJobForDetails,
    toggleSaveJob,
    searchFilterKeyword,
    setSearchFilterKeyword,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
  } = useApp();

  const [selectedType, setSelectedType] = useState<'all' | 'hourly' | 'fixed'>('all');
  const [selectedLocationType, setSelectedLocationType] = useState<'all' | 'remote' | 'onsite' | 'hybrid'>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [maxDistanceRadius, setMaxDistanceRadius] = useState<number>(0); // 0 = any
  const [minBudget, setMinBudget] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'ai_match' | 'newest' | 'highest_pay'>('ai_match');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [translatedJobIds, setTranslatedJobIds] = useState<Record<string, boolean>>({});

  const categories = [
    'All',
    'Software & Tech',
    'Design & Creative',
    'Mobile Development',
    'AI & Data Science',
    'Writing & Translation',
    'Marketing & Growth'
  ];

  // Filtering Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Keyword filter
      if (searchFilterKeyword.trim()) {
        const query = searchFilterKeyword.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesDesc = job.description.toLowerCase().includes(query);
        const matchesSkill = job.requiredSkills.some(s => s.toLowerCase().includes(query));
        const matchesCompany = job.employerCompany?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesSkill && !matchesCompany) return false;
      }

      // Category filter
      if (selectedCategoryFilter !== 'All' && job.category !== selectedCategoryFilter) {
        return false;
      }

      // Job Type filter
      if (selectedType !== 'all' && job.type !== selectedType) {
        return false;
      }

      // Location Type filter
      if (selectedLocationType !== 'all' && job.locationType !== selectedLocationType) {
        return false;
      }

      // Experience Level filter
      if (selectedExperience !== 'all' && job.experienceLevel !== selectedExperience) {
        return false;
      }

      // Distance Radius filter (e.g. 1km, 5km, 10km)
      if (maxDistanceRadius > 0) {
        if (job.locationType === 'remote') {
          // Allow remote if radius selected or exclude? Let's allow local jobs within distance
        } else if (job.distanceKm && job.distanceKm > maxDistanceRadius) {
          return false;
        }
      }

      // Budget filter
      if (minBudget > 0 && job.budget < minBudget) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'ai_match') {
        return (b.aiMatchScore || 0) - (a.aiMatchScore || 0);
      }
      if (sortBy === 'highest_pay') {
        return b.budget - a.budget;
      }
      return 0; // default order
    });
  }, [
    jobs,
    searchFilterKeyword,
    selectedCategoryFilter,
    selectedType,
    selectedLocationType,
    selectedExperience,
    maxDistanceRadius,
    minBudget,
    sortBy,
  ]);

  const toggleJobTranslation = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTranslatedJobIds(prev => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Top Header & Search Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{t('findWork')}</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {filteredJobs.length} opportunities available
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Search verified listings with pre-funded escrow guarantee and live hourly billing
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('location_radar')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-700 hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300 transition-colors"
            >
              <Compass className="h-4 w-4" />
              <span>Jobs Radar (1km - 10km)</span>
            </button>

            {currentUser.role === 'employer' && (
              <button
                onClick={() => navigateTo('create_job')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>{t('postJob')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchFilterKeyword}
              onChange={(e) => setSearchFilterKeyword(e.target.value)}
              placeholder="Search by role, required skills (React, Figma, Docker), or company..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs sm:text-sm font-medium shadow-xs focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
            {searchFilterKeyword && (
              <button
                onClick={() => setSearchFilterKeyword('')}
                className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-48">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-3.5 pr-8 text-xs font-semibold shadow-xs focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                <option value="ai_match">✨ Best AI Match</option>
                <option value="highest_pay">💰 Highest Budget</option>
                <option value="newest">🕒 Recently Posted</option>
              </select>
              <ArrowUpDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-slate-400" />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="md:hidden flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <SlidersHorizontal className="h-4 w-4 text-teal-600" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedCategoryFilter === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Job Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filters */}
        <aside className={`lg:block ${isFilterDrawerOpen ? 'block' : 'hidden'} space-y-6 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 h-fit sticky top-24`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Filter className="h-4 w-4 text-teal-600" />
              Advanced Filters
            </span>
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedLocationType('all');
                setSelectedExperience('all');
                setMaxDistanceRadius(0);
                setMinBudget(0);
                setSelectedCategoryFilter('All');
              }}
              className="text-[11px] font-medium text-teal-600 hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Job Payment Type */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
              Payment Model
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'hourly', label: 'Hourly' },
                { id: 'fixed', label: 'Fixed' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedType(item.id as any)}
                  className={`py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
                    selectedType === item.id
                      ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                      : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location & Work Type */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
              Location Type
            </label>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              {[
                { id: 'all', label: 'All Work Arrangements' },
                { id: 'remote', label: '🌐 100% Remote' },
                { id: 'onsite', label: '📍 Physical On-site' },
                { id: 'hybrid', label: '🏢 Hybrid' },
              ].map((loc) => (
                <label key={loc.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="locType"
                    checked={selectedLocationType === loc.id}
                    onChange={() => setSelectedLocationType(loc.id as any)}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <span>{loc.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Proximity / Distance Radius */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Proximity Radius
              </label>
              <span className="text-[11px] font-bold text-teal-600">
                {maxDistanceRadius === 0 ? 'Any distance' : `Within ${maxDistanceRadius} km`}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-[11px]">
              {[
                { km: 0, label: 'Any' },
                { km: 1, label: '1 km' },
                { km: 5, label: '5 km' },
                { km: 10, label: '10 km' },
              ].map((d) => (
                <button
                  key={d.km}
                  onClick={() => setMaxDistanceRadius(d.km)}
                  className={`py-1 rounded-lg border font-semibold ${
                    maxDistanceRadius === d.km
                      ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                      : 'border-slate-200 text-slate-500 dark:border-slate-800'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
              Experience Level
            </label>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              {[
                { id: 'all', label: 'All Levels' },
                { id: 'entry', label: 'Entry Level ($)' },
                { id: 'intermediate', label: 'Intermediate ($$)' },
                { id: 'expert', label: 'Expert ($$$)' },
              ].map((exp) => (
                <label key={exp.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="expLevel"
                    checked={selectedExperience === exp.id}
                    onChange={() => setSelectedExperience(exp.id)}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <span>{exp.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Escrow Guarantee Highlight */}
          <div className="rounded-2xl bg-teal-50/70 p-3.5 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60">
            <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 text-xs font-bold mb-1">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              <span>Platform Escrow Safe</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              Every job listing requires employer pre-funding before work begins. 100% dispute protection guaranteed.
            </p>
          </div>
        </aside>

        {/* Right Listings Column */}
        <div className="lg:col-span-3 space-y-4">
          
          {filteredJobs.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
              <Search className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                No job opportunities match your criteria
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try widening your distance radius, removing skill keywords, or switching categories.
              </p>
              <button
                onClick={() => {
                  setSearchFilterKeyword('');
                  setSelectedCategoryFilter('All');
                  setSelectedType('all');
                  setMaxDistanceRadius(0);
                }}
                className="mt-4 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isTranslated = translatedJobIds[job.id];
              const displayTitle = isTranslated ? translateTextSimulated(job.title, language) : job.title;
              const displayDesc = isTranslated ? translateTextSimulated(job.description, language) : job.description;

              return (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJobForDetails(job);
                    navigateTo('job_details');
                  }}
                  className="group relative cursor-pointer rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all hover:border-teal-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  {/* Top Row: Employer Info, Badges & Bookmark */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={job.employerAvatar}
                        alt={job.employerName}
                        className="h-11 w-11 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {job.employerCompany || job.employerName}
                          </span>
                          {job.employerVerified && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                          )}
                          <span className="text-[10px] text-slate-400">
                            ⭐ {job.employerRating.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            {job.location}
                          </span>
                          {job.distanceKm && job.distanceKm < 100 && (
                            <span className="font-semibold text-teal-600 bg-teal-50 dark:bg-teal-950 px-1.5 py-0.2 rounded text-[10px]">
                              {job.distanceKm < 1 ? '0.8 km away' : `${job.distanceKm.toFixed(1)} km away`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rates & Save */}
                    <div className="flex items-center gap-2">
                      {job.aiMatchScore && job.aiMatchScore >= 90 && (
                        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <Sparkles className="h-3 w-3" />
                          {job.aiMatchScore}% Match
                        </span>
                      )}

                      <span className={`text-xs font-bold px-3 py-1 rounded-xl ${
                        job.type === 'hourly'
                          ? 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
                          : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                      }`}>
                        {job.type === 'hourly' ? `$${job.budget}/hr` : `$${job.budget.toLocaleString()} Fixed`}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(job.id);
                        }}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-500 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Bookmark
                          className={`h-4 w-4 ${
                            currentUser.savedJobIds.includes(job.id) ? 'fill-rose-500 text-rose-500' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Title & Translation */}
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <h2 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition-colors dark:text-white">
                      {displayTitle}
                    </h2>

                    {language !== 'en' && (
                      <button
                        onClick={(e) => toggleJobTranslation(job.id, e)}
                        className="flex-shrink-0 flex items-center gap-1 text-[11px] font-medium text-teal-600 hover:underline dark:text-teal-400"
                      >
                        <Globe className="h-3 w-3" />
                        <span>{isTranslated ? t('viewOriginal') : `${t('translate')} ${language.toUpperCase()}`}</span>
                      </button>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {displayDesc}
                  </p>

                  {/* Required Skills Badges */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                    {job.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Card Footer: Metadata */}
                  <div className="mt-4 flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800/80 text-[11px] text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {job.datePosted}
                      </span>
                      <span>•</span>
                      <span>Level: <strong className="capitalize text-slate-700 dark:text-slate-300">{job.experienceLevel}</strong></span>
                      <span>•</span>
                      <span>Duration: {job.duration}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-2 sm:mt-0">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">
                        {job.applicantsCount} applicants
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJobForDetails(job);
                          navigateTo('job_details');
                        }}
                        className="rounded-xl bg-teal-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition-colors"
                      >
                        {t('applyNow')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
