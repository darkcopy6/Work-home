import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  GraduationCap,
  Globe,
  Award,
  ShieldCheck,
  Send,
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const WorkerProfileModal: React.FC = () => {
  const {
    selectedTalentForProfile,
    currentUser,
    navigateTo,
    startOrOpenConversationWithUser,
    t,
  } = useApp();

  const talent = selectedTalentForProfile || currentUser;
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews' | 'experience'>('overview');

  const ratingMetrics = [
    { label: 'Quality of Work', score: talent.rating.qualityOfWork || 5.0 },
    { label: 'Communication', score: talent.rating.communication || 4.9 },
    { label: 'Timeliness / Deadlines', score: talent.rating.timeliness || 4.8 },
    { label: 'Technical Expertise', score: talent.rating.technicalExpertise || 5.0 },
    { label: 'Value for Budget', score: talent.rating.budgetRespect || 4.9 },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => navigateTo('talent')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-600 dark:text-slate-300"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Talent Search</span>
      </button>

      {/* Main Profile Header Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative">
              <img
                src={talent.avatar}
                alt={talent.name}
                className="h-24 w-24 rounded-3xl object-cover ring-4 ring-teal-500/20 shadow-md"
              />
              {talent.verified && (
                <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {talent.name}
                </h1>
                {talent.verified && (
                  <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                    KYC Verified
                  </span>
                )}
              </div>

              <p className="text-sm font-bold text-teal-600 dark:text-teal-400">
                {talent.title}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {talent.location}
                </span>
                <span>•</span>
                <span>{talent.experienceYears} Years Experience</span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  {talent.rating.overall.toFixed(1)} ({talent.rating.reviewsCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Rate & Action */}
          <div className="flex flex-col sm:items-end gap-3 text-center sm:text-right">
            <div>
              <span className="text-xs text-slate-400">Hourly Rate</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                ${talent.hourlyRate}/hr
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => startOrOpenConversationWithUser(talent.id, undefined, 'Freelance Direct Offer')}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 flex items-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="h-4 w-4 text-teal-600" />
                <span>Message</span>
              </button>

              <button
                onClick={() => {
                  startOrOpenConversationWithUser(talent.id, undefined, 'Project Proposal & Escrow Setup');
                }}
                className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 flex items-center gap-1.5"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Hire with Escrow</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800 text-xs font-bold">
          {[
            { id: 'overview', label: 'Overview & Skills' },
            { id: 'portfolio', label: `Portfolio (${talent.portfolio.length})` },
            { id: 'reviews', label: `5-Star Reviews (${talent.completedJobs.length})` },
            { id: 'experience', label: 'Experience & Degrees' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-xl px-4 py-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  Professional Biography
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {talent.bio}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                  Core Skills & Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {talent.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-xl bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-teal-600" />
                  <span>Languages Spoken</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {talent.languages.map((l) => (
                    <div key={l.language} className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-950 text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">{l.language}</span>
                      <span className="text-slate-400 ml-1.5">({l.level})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {talent.portfolio.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs dark:border-slate-800 dark:bg-slate-900 group"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-5 space-y-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.map((t) => (
                        <span key={t} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Completed Contracts & Verified Reviews
              </h3>

              <div className="space-y-4">
                {talent.completedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {job.title}
                      </h4>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        <span>{job.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Completed {job.completionDate}</span>
                      <span>•</span>
                      <span>Earned ${job.totalEarned.toLocaleString()} via Escrow</span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 italic pt-1">
                      "{job.reviewText}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience & Education Tab */}
          {activeTab === 'experience' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
              {/* Experience */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-teal-600" />
                  <span>Work History</span>
                </h3>
                <div className="space-y-4">
                  {talent.experience.map((exp) => (
                    <div key={exp.id} className="border-l-2 border-teal-500 pl-4 space-y-1">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{exp.role}</h4>
                      <p className="text-xs font-semibold text-teal-600">{exp.company} • {exp.period}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-teal-600" />
                  <span>Education & Degrees</span>
                </h3>
                <div className="space-y-3">
                  {talent.education.map((edu) => (
                    <div key={edu.id} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950 text-xs">
                      <h4 className="font-bold text-slate-900 dark:text-white">{edu.degree}</h4>
                      <p className="text-slate-500">{edu.institution} ({edu.year})</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Rating Criteria Breakdown & Safety */}
        <div className="space-y-6">
          
          {/* 5-Star Metric Breakdown */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              5-Criteria Performance Index
            </h3>

            <div className="space-y-3">
              {ratingMetrics.map((m) => (
                <div key={m.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{m.label}</span>
                    <span className="text-amber-500 font-bold">{m.score.toFixed(1)} / 5.0</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${(m.score / 5) * 100}%` }}
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Escrow Guarantee Box */}
          <div className="rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent p-6 shadow-xs dark:border-teal-900/60 dark:bg-slate-900 space-y-3">
            <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold text-xs">
              <ShieldCheck className="h-5 w-5 text-teal-600" />
              <span>Escrow Protected Hiring</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              When you hire {talent.name.split(' ')[0]}, your milestone deposit is held safely in escrow. Funds are only transferred after you review and approve the final work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
