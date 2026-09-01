import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job, JobMilestone } from '../../types';
import {
  ArrowLeft,
  Sparkles,
  DollarSign,
  MapPin,
  Clock,
  Plus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Building,
  Layers,
  AlertCircle
} from 'lucide-react';

export const CreateJobModal: React.FC = () => {
  const { postNewJob, navigateTo, currentUser, setSelectedJobForDetails } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Software & Tech');
  const [type, setType] = useState<'hourly' | 'fixed'>('hourly');
  const [budget, setBudget] = useState<number>(65);
  const [hourlyMin, setHourlyMin] = useState<number>(55);
  const [hourlyMax, setHourlyMax] = useState<number>(75);
  const [experienceLevel, setExperienceLevel] = useState<'entry' | 'intermediate' | 'expert'>('expert');
  const [locationType, setLocationType] = useState<'remote' | 'onsite' | 'hybrid'>('remote');
  const [location, setLocation] = useState('San Francisco, CA (or Remote)');
  const [expectedHours, setExpectedHours] = useState<number>(35);
  const [duration, setDuration] = useState('3 to 6 months');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js']);
  const [description, setDescription] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  const [milestones, setMilestones] = useState<Array<{ title: string; amount: number }>>([
    { title: 'Milestone 1: Project Setup & Architecture Review', amount: 800 },
    { title: 'Milestone 2: Core Feature Implementation', amount: 1500 },
    { title: 'Milestone 3: Final Delivery & Launch Deployment', amount: 1200 },
  ]);

  const categories = [
    'Software & Tech',
    'Design & Creative',
    'Mobile Development',
    'AI & Data Science',
    'Writing & Translation',
    'Marketing & Growth'
  ];

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleAddMilestone = () => {
    setMilestones([...milestones, { title: `Milestone ${milestones.length + 1}`, amount: 500 }]);
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  // AI Job Description Improver
  const handleAiImprove = () => {
    if (!title.trim()) {
      setTitle('Senior Full-Stack Engineer for Cloud Architecture');
    }
    setIsAiGenerating(true);
    setTimeout(() => {
      setDescription(`We are seeking an exceptional ${title || 'Professional'} to join our project for ${duration}. 

Key Responsibilities:
• Lead technical design and implementation of responsive, accessible user interfaces.
• Build and maintain robust APIs with real-time data pipelines and PostgreSQL.
• Perform thorough code reviews, automated integration tests, and optimize cold starts.

Required Qualifications:
• Demonstrated proficiency in ${skills.join(', ') || 'modern industry standards'}.
• Excellent written communication and proactive progress logging.
• Available for ${expectedHours} hours per week with live session tracking on WorkHome.

Escrow funding is pre-approved for all agreed milestones upon contract award.`);
      setIsAiGenerating(false);
    }, 1000);
  };

  const handleSubmitJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const formattedMilestones: JobMilestone[] = milestones.map((m, idx) => ({
      id: `m_new_${Date.now()}_${idx}`,
      title: m.title,
      amount: m.amount,
      status: 'pending',
    }));

    const newJobId = postNewJob({
      title,
      category,
      type,
      budget,
      hourlyRateMin: type === 'hourly' ? hourlyMin : undefined,
      hourlyRateMax: type === 'hourly' ? hourlyMax : undefined,
      experienceLevel,
      locationType,
      location,
      expectedHoursPerWeek: expectedHours,
      duration,
      requiredSkills: skills,
      description,
      milestones: formattedMilestones,
      urgency: isUrgent ? 'urgent' : 'normal',
      featured: true,
    });

    navigateTo('dashboard_employer');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-600 dark:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Cancel & Back</span>
        </button>

        <span className="text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full">
          Employer Escrow Protected
        </span>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 border-b border-slate-100 pb-4 dark:border-slate-800">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Publish New Job Opportunity
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Specify job requirements, hourly rate or fixed milestones, location proximity, and required skills.
          </p>
        </div>

        <form onSubmit={handleSubmitJob} className="space-y-6">
          
          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Full-Stack Engineer, Product Designer..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Model: Hourly vs Fixed */}
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
              Payment Model & Compensation
            </label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div
                onClick={() => setType('hourly')}
                className={`cursor-pointer rounded-xl border p-3 text-left transition-all ${
                  type === 'hourly'
                    ? 'border-teal-500 bg-white shadow-xs dark:bg-slate-900 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <Clock className="h-5 w-5 text-teal-600 mb-1" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">Hourly Rate</p>
                <p className="text-[10px] text-slate-500">Live stopwatch tracking & weekly approval</p>
              </div>

              <div
                onClick={() => setType('fixed')}
                className={`cursor-pointer rounded-xl border p-3 text-left transition-all ${
                  type === 'fixed'
                    ? 'border-teal-500 bg-white shadow-xs dark:bg-slate-900 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <DollarSign className="h-5 w-5 text-teal-600 mb-1" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">Fixed Price / Milestones</p>
                <p className="text-[10px] text-slate-500">Deposit escrow before milestone kicks off</p>
              </div>
            </div>

            {type === 'hourly' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Target Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(+e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Expected Weekly Hours
                  </label>
                  <input
                    type="number"
                    value={expectedHours}
                    onChange={(e) => setExpectedHours(+e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 3 to 6 months"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Total Project Budget ($)
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(+e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold dark:border-slate-800 dark:bg-slate-900 dark:text-white mb-3"
                />

                {/* Milestone Builder */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Project Milestones (Pre-Funded in Escrow)</span>
                    <button
                      type="button"
                      onClick={handleAddMilestone}
                      className="text-teal-600 hover:underline text-[11px]"
                    >
                      + Add Milestone
                    </button>
                  </div>
                  {milestones.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => {
                          const updated = [...milestones];
                          updated[idx].title = e.target.value;
                          setMilestones(updated);
                        }}
                        className="flex-1 rounded-xl border border-slate-200 bg-white p-2 text-xs dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      />
                      <div className="w-24 relative">
                        <input
                          type="number"
                          value={m.amount}
                          onChange={(e) => {
                            const updated = [...milestones];
                            updated[idx].amount = +e.target.value;
                            setMilestones(updated);
                          }}
                          className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location & Experience Level */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Work Arrangement
              </label>
              <select
                value={locationType}
                onChange={(e: any) => setLocationType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                <option value="remote">🌐 Remote Worldwide</option>
                <option value="onsite">📍 Physical On-site</option>
                <option value="hybrid">🏢 Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Location / City
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA or Remote"
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e: any) => setExperienceLevel(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              >
                <option value="entry">Entry Level</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert Specialist</option>
              </select>
            </div>
          </div>

          {/* Required Skills Tagging */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Required Skills & Technologies (Press Enter or click Add)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(e); } }}
                placeholder="Type skill (e.g. React, Flutter, Figma, Python, Docker)..."
                className="flex-1 rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-300"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-teal-600 hover:text-rose-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Description & AI Generator */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Detailed Job Description *
              </label>
              <button
                type="button"
                onClick={handleAiImprove}
                disabled={isAiGenerating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-300"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isAiGenerating ? 'Generating Description...' : '✨ AI Job Description Improver'}</span>
              </button>
            </div>
            <textarea
              rows={8}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe deliverables, team context, communication preferences, and milestones..."
              className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs sm:text-sm leading-relaxed focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {/* Urgent Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="urgentCheck"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="urgentCheck" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              Mark as ⚡ Urgent Hire (Highlighted at top of search results)
            </label>
          </div>

          {/* Escrow note & Publish Button */}
          <div className="border-t border-slate-100 pt-5 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-5 w-5 text-teal-600 flex-shrink-0" />
              <span>
                Standard 5% platform commission applies upon completed milestone release.
              </span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto rounded-xl bg-teal-600 px-8 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-colors"
            >
              Publish Job & Enable Escrow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
