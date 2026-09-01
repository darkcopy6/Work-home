import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job } from '../../types';
import {
  Compass,
  MapPin,
  Search,
  Navigation,
  Sliders,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const LocationRadar: React.FC = () => {
  const { jobs, setSelectedJobForDetails, navigateTo, t } = useApp();

  const [radarRadius, setRadarRadius] = useState<number>(5); // 1, 2, 5, 10 km
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLocationName, setActiveLocationName] = useState<string>('San Francisco Financial District');
  const [selectedRadarJob, setSelectedRadarJob] = useState<Job | null>(null);

  const locationsList = [
    'San Francisco Financial District',
    'Silicon Valley Tech Park',
    'Downtown London, Soho',
    'Dubai Internet City & Marina',
    'Berlin Mitte Tech Hub'
  ];

  // Map jobs to radar coordinates (angle + distance)
  const radarJobs = jobs
    .filter(j => j.locationType !== 'remote' || (j.distanceKm && j.distanceKm <= radarRadius))
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300 mb-2">
            <Compass className="h-3.5 w-3.5 text-teal-600 animate-spin" />
            <span>GPS Proximity Detection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('locationRadar')} (1km - 10km Radius)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Detect on-site and local contract opportunities near your current physical coordinates
          </p>
        </div>

        {/* Current GPS Anchor Selector */}
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-rose-500 flex-shrink-0" />
          <select
            value={activeLocationName}
            onChange={(e) => setActiveLocationName(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold shadow-xs focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            {locationsList.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Radar Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Interactive Radar Visual Display */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-slate-900 p-6 sm:p-8 text-white shadow-xl dark:border-slate-800 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
          
          {/* Radar Background Grids & Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            {/* Concentric rings */}
            <div className="h-96 w-96 rounded-full border border-teal-500/30 flex items-center justify-center">
              <div className="h-72 w-72 rounded-full border border-teal-500/40 flex items-center justify-center">
                <div className="h-48 w-48 rounded-full border border-teal-500/50 flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full border border-teal-500/60 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-teal-400 animate-ping" />
                  </div>
                </div>
              </div>
            </div>

            {/* Crosshairs */}
            <div className="absolute h-full w-[1px] bg-teal-500/20" />
            <div className="absolute w-full h-[1px] bg-teal-500/20" />

            {/* Sweeping Beam */}
            <div className="absolute h-48 w-48 rounded-full bg-gradient-to-tr from-transparent via-teal-500/20 to-teal-400/40 origin-bottom-right animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          {/* Radar Rings Distance Labels */}
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-1 text-[11px] text-teal-300 font-mono">
            <span>● Radar Scan Active: {activeLocationName}</span>
            <span>● Range: 0 km ➔ {radarRadius} km</span>
            <span>● Local Targets: {radarJobs.length} detected</span>
          </div>

          {/* Interactive Job Pins on Radar */}
          <div className="relative h-80 w-80 sm:h-96 sm:w-96 flex items-center justify-center z-20">
            
            {/* Center User Dot */}
            <div className="absolute z-30 flex flex-col items-center">
              <div className="h-5 w-5 rounded-full bg-rose-500 ring-4 ring-rose-500/30 shadow-lg flex items-center justify-center">
                <Navigation className="h-2.5 w-2.5 text-white" />
              </div>
              <span className="text-[9px] font-bold text-rose-300 mt-1 bg-black/60 px-1.5 py-0.5 rounded">You (Center)</span>
            </div>

            {/* Job Nodes on simulated orbital offsets */}
            {radarJobs.map((job, idx) => {
              // Calculate pseudo position
              const angle = (idx * (360 / Math.max(radarJobs.length, 1)) * Math.PI) / 180;
              const radiusPercent = 35 + ((idx % 3) * 20); // spread across 35% to 85% radius
              const x = Math.cos(angle) * (radiusPercent * 1.5);
              const y = Math.sin(angle) * (radiusPercent * 1.5);

              const isSelected = selectedRadarJob?.id === job.id;

              return (
                <button
                  key={job.id}
                  onClick={() => setSelectedRadarJob(job)}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  className={`absolute z-20 flex flex-col items-center transition-all transform hover:scale-125 focus:outline-none ${
                    isSelected ? 'scale-125 z-40' : ''
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-2xl border-2 font-bold text-xs shadow-md transition-all ${
                    isSelected
                      ? 'border-white bg-teal-500 text-white shadow-teal-500/50'
                      : 'border-teal-400/80 bg-slate-800 text-teal-300 hover:bg-teal-600 hover:text-white'
                  }`}>
                    {job.type === 'hourly' ? `$${job.budget}` : 'Fix'}
                  </div>
                  <span className="text-[9px] font-semibold text-slate-200 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700 mt-1 truncate max-w-[90px]">
                    {job.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Job Mini Card Overlay on Bottom */}
          {selectedRadarJob && (
            <div className="relative z-30 mt-6 w-full max-w-md rounded-2xl border border-teal-500/40 bg-slate-800/95 p-4 backdrop-blur-md text-slate-200 animate-slideUp">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">
                    {selectedRadarJob.distanceKm ? `${selectedRadarJob.distanceKm.toFixed(1)} km away` : '1.2 km away'} • {selectedRadarJob.location}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5">
                    {selectedRadarJob.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedRadarJob.employerCompany || selectedRadarJob.employerName}
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-1 rounded-lg">
                  {selectedRadarJob.type === 'hourly' ? `$${selectedRadarJob.budget}/hr` : `$${selectedRadarJob.budget} Fixed`}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-700 pt-3">
                <button
                  onClick={() => setSelectedRadarJob(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Dismiss
                </button>

                <button
                  onClick={() => {
                    setSelectedJobForDetails(selectedRadarJob);
                    navigateTo('job_details');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-teal-400 transition-colors"
                >
                  <span>View Details & Apply</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Proximity Controls & Nearby Listings */}
        <div className="space-y-6">
          
          {/* Radius Selector Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Radar Search Radius
            </h2>

            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 5, 10].map((radius) => (
                <button
                  key={radius}
                  onClick={() => setRadarRadius(radius)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    radarRadius === radius
                      ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                      : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                  }`}
                >
                  {radius} km
                </button>
              ))}
            </div>

            <div className="rounded-2xl bg-teal-50/70 p-3 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 text-xs text-teal-800 dark:text-teal-300">
              <span className="font-bold">Fast On-Demand Matching:</span> Handshake locally, sign digital escrow contracts, and execute on-site with live GPS clock-in.
            </div>
          </div>

          {/* List of Closest Jobs */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Closest Open Contracts
            </h3>

            <div className="space-y-2.5">
              {radarJobs.map((j) => (
                <div
                  key={j.id}
                  onClick={() => {
                    setSelectedJobForDetails(j);
                    navigateTo('job_details');
                  }}
                  className="cursor-pointer rounded-2xl border border-slate-100 bg-slate-50/60 p-3 hover:border-teal-500 hover:bg-white dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                    <span className="truncate max-w-[180px]">{j.title}</span>
                    <span className="text-teal-600">
                      {j.type === 'hourly' ? `$${j.budget}/hr` : `$${j.budget}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>{j.employerCompany || j.employerName}</span>
                    <span className="font-semibold text-rose-500">
                      {j.distanceKm ? `${j.distanceKm.toFixed(1)} km` : '1.5 km'}
                    </span>
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
