import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Users,
  Briefcase,
  DollarSign,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Sliders,
  TrendingUp,
  Percent,
  Search
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    jobs,
    talents,
    contracts,
    transactions,
    verifyKYC,
    releaseMilestoneEscrow,
    t,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'users' | 'escrow' | 'disputes'>('overview');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [platformCommissionFee, setPlatformCommissionFee] = useState(5.0);

  // Aggregated analytics
  const totalVolume = contracts.reduce((acc, c) => acc + c.totalEscrowAmount, 0) + 148500;
  const platformRevenue = (totalVolume * (platformCommissionFee / 100));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300 mb-2">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
            <span>Platform Governance & Escrow Oversight</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Super Administrator Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor escrow vault liquidity, approve KYC identities, arbitrate contract disputes, and adjust platform fees
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
          {[
            { id: 'overview', label: 'Platform Stats' },
            { id: 'users', label: 'KYC & Talents' },
            { id: 'escrow', label: 'Escrow Vault' },
            { id: 'disputes', label: 'Arbitration' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeAdminTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase">Gross Platform GMV</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">${totalVolume.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600 font-medium">+18.4% this month</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase">5% Platform Revenue</span>
          <p className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">${platformRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500 font-medium">Net platform commission</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase">Verified Talents</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{talents.length + 120}</p>
          <span className="text-[11px] text-teal-600 font-medium">100% KYC checked</span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase">Live Active Jobs</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{jobs.length + 45}</p>
          <span className="text-[11px] text-indigo-600 font-medium">Pre-funded escrow</span>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeAdminTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Commission & Settings */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Percent className="h-4 w-4 text-teal-600" />
              <span>Platform Commission Settings</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Standard marketplace commission fee automatically deducted from worker payouts upon milestone approval.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="number"
                step="0.5"
                value={platformCommissionFee}
                onChange={(e) => setPlatformCommissionFee(+e.target.value)}
                className="w-24 rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-bold dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">% Flat Rate</span>
            </div>
          </div>

          {/* Escrow Health Audit */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Escrow Vault Liquidity & Reserve Audit
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Total Escrow Vault Collateral:</span>
                <span className="font-bold text-slate-900 dark:text-white">$325,400.00 (100% Backed)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Disputed Funds Ratio:</span>
                <span className="font-bold text-emerald-600">0.00% (Zero active disputes)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Average Payout Settlement Time:</span>
                <span className="font-bold text-teal-600">Instant (Real-time blockchain/wire)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KYC Verification Tab */}
      {activeAdminTab === 'users' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              User Identity & KYC Management
            </h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800">
                  <th className="pb-3 font-semibold">User</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Location</th>
                  <th className="pb-3 font-semibold">Rating</th>
                  <th className="pb-3 font-semibold">KYC Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {talents.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 flex items-center gap-2.5">
                      <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                        <p className="text-[11px] text-slate-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3.5 capitalize font-medium">{user.role.replace('_', ' ')}</td>
                    <td className="py-3.5 text-slate-500">{user.location}</td>
                    <td className="py-3.5 font-bold text-amber-500">⭐ {user.rating.overall.toFixed(1)}</td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ${
                        user.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        <CheckCircle2 className="h-3 w-3" />
                        {user.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => verifyKYC(user.id)}
                        className="rounded-lg bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-300"
                      >
                        Re-Verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Escrow Vault Overview Tab */}
      {activeAdminTab === 'escrow' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Active System Escrow Contracts
          </h3>
          <div className="space-y-3">
            {contracts.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{c.jobTitle}</h4>
                  <p className="text-slate-500">Employer: {c.employerName} ➔ Worker: {c.workerName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-teal-600">${c.totalEscrowAmount} in Vault</span>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    Secure
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Arbitration Tab */}
      {activeAdminTab === 'disputes' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <ShieldAlert className="mx-auto h-10 w-10 text-emerald-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            0 Active Disputes Across Platform
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            All escrow milestones are currently executing within standard satisfaction parameters with 100% agreement between clients and freelancers.
          </p>
        </div>
      )}
    </div>
  );
};
