import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';
import {
  Search,
  MapPin,
  Star,
  CheckCircle2,
  Filter,
  DollarSign,
  Briefcase,
  Globe,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';

export const TalentSearch: React.FC = () => {
  const {
    talents,
    setSelectedTalentForProfile,
    navigateTo,
    startOrOpenConversationWithUser,
    t,
  } = useApp();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('All');
  const [maxHourlyRate, setMaxHourlyRate] = useState<number>(200);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const skillsList = ['All', 'React', 'TypeScript', 'Node.js', 'UI/UX', 'Figma', 'Python', 'AWS', 'Flutter', 'Go'];

  const filteredTalents = useMemo(() => {
    return talents.filter((talent) => {
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchesName = talent.name.toLowerCase().includes(q);
        const matchesTitle = talent.title.toLowerCase().includes(q);
        const matchesBio = talent.bio.toLowerCase().includes(q);
        const matchesSkill = talent.skills.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesTitle && !matchesBio && !matchesSkill) return false;
      }

      if (selectedSkillFilter !== 'All' && !talent.skills.includes(selectedSkillFilter)) {
        return false;
      }

      if (talent.hourlyRate > maxHourlyRate) return false;
      if (onlyVerified && !talent.verified) return false;
      if (onlyAvailable && talent.availability !== 'available') return false;

      return true;
    });
  }, [talents, searchKeyword, selectedSkillFilter, maxHourlyRate, onlyVerified, onlyAvailable]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t('findTalent')}</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {filteredTalents.length} verified experts
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hire vetted freelancers with 5-criteria verified ratings and secure escrow milestones
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search by skill, developer title, designer role, or name..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs sm:text-sm font-medium shadow-xs focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Vetted Only</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Available Now</span>
            </label>
          </div>
        </div>

        {/* Skills Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {skillsList.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkillFilter(skill)}
              className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedSkillFilter === skill
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Talent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTalents.map((talent) => (
          <div
            key={talent.id}
            onClick={() => {
              setSelectedTalentForProfile(talent);
              navigateTo('worker_profile');
            }}
            className="cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:border-teal-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4">
                <img
                  src={talent.avatar}
                  alt={talent.name}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-teal-500/20"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {talent.name}
                    </h3>
                    {talent.verified && (
                      <CheckCircle2 className="h-4 w-4 text-teal-600" />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                    {talent.title}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-400" />
                      {talent.rating.overall.toFixed(1)}
                    </span>
                    <span>({talent.rating.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {talent.bio}
              </p>

              {/* Skills */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {talent.skills.slice(0, 5).map((s) => (
                  <span
                    key={s}
                    className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Row */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <div>
                <span className="text-xs text-slate-400">Hourly Rate</span>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                  ${talent.hourlyRate}/hr
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startOrOpenConversationWithUser(talent.id, undefined, 'Direct Freelance Opportunity');
                  }}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 transition-colors"
                >
                  Message
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTalentForProfile(talent);
                    navigateTo('worker_profile');
                  }}
                  className="rounded-xl bg-teal-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
