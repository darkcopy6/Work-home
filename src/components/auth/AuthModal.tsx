import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  X,
  ShieldCheck,
  Key,
  Mail,
  Lock,
  User,
  Briefcase,
  Upload,
  CheckCircle2,
  AlertCircle,
  Phone,
  ArrowRight
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, loginUser, t, verifyKYC, currentUser } = useApp();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot' | 'verify2fa' | 'kyc'>(authModalMode || 'login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('job_seeker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [kycSuccess, setKycSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const updated = [...otpCode];
    updated[index] = val;
    setOtpCode(updated);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(selectedRole, email);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(selectedRole, email);
  };

  const handleKYCSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyKYC(currentUser.id);
    setKycSuccess(true);
    setTimeout(() => {
      setKycSuccess(false);
      closeAuthModal();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 mb-3 shadow-inner">
            {activeTab === 'kyc' ? <ShieldCheck className="h-6 w-6" /> : <Briefcase className="h-6 w-6" />}
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {activeTab === 'login' && 'Welcome Back to work home'}
            {activeTab === 'register' && 'Create Your Professional Account'}
            {activeTab === 'forgot' && 'Reset Your Password'}
            {activeTab === 'verify2fa' && 'Two-Factor Authentication'}
            {activeTab === 'kyc' && 'Verify Your Identity (KYC)'}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {activeTab === 'login' && 'Log in to manage contracts, log hours, and secure escrow payouts.'}
            {activeTab === 'register' && 'Join thousands of verified talents and employers worldwide.'}
            {activeTab === 'kyc' && 'Submit official government ID to obtain the verified badge & instant payouts.'}
          </p>
        </div>

        {/* Login Mode */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Account Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole('job_seeker')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    selectedRole === 'job_seeker'
                      ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                      : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                  }`}
                >
                  Job Seeker
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('employer')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    selectedRole === 'employer'
                      ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                      : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                  }`}
                >
                  Employer
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    selectedRole === 'admin'
                      ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={selectedRole === 'job_seeker' ? 'alex.rivera@workhome.io' : 'marcus@vancetech.io'}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setActiveTab('forgot')}
                  className="text-[11px] text-teal-600 hover:underline dark:text-teal-400"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-teal-600 py-3 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>Log In as {selectedRole.replace('_', ' ').toUpperCase()}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">Don't have an account yet? </span>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="text-xs font-bold text-teal-600 hover:underline dark:text-teal-400"
              >
                Sign up free
              </button>
            </div>
          </form>
        )}

        {/* Registration Mode */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                I want to register as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setSelectedRole('job_seeker')}
                  className={`cursor-pointer p-3 rounded-2xl border text-left transition-all ${
                    selectedRole === 'job_seeker'
                      ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-500/20 dark:bg-teal-950/40'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <User className="h-5 w-5 text-teal-600 mb-1" />
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Job Seeker</p>
                  <p className="text-[10px] text-slate-500">Find jobs, log hours & get paid</p>
                </div>

                <div
                  onClick={() => setSelectedRole('employer')}
                  className={`cursor-pointer p-3 rounded-2xl border text-left transition-all ${
                    selectedRole === 'employer'
                      ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-500/20 dark:bg-teal-950/40'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Briefcase className="h-5 w-5 text-teal-600 mb-1" />
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Employer</p>
                  <p className="text-[10px] text-slate-500">Hire talent & fund contracts</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@workhome.io"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number (for SMS 2FA)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-teal-600 py-3 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-colors"
            >
              Create {selectedRole === 'job_seeker' ? 'Worker' : 'Employer'} Account
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">Already registered? </span>
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-xs font-bold text-teal-600 hover:underline dark:text-teal-400"
              >
                Log in
              </button>
            </div>
          </form>
        )}

        {/* KYC Verification Mode */}
        {activeTab === 'kyc' && (
          <form onSubmit={handleKYCSubmit} className="space-y-4">
            <div className="rounded-2xl border border-dashed border-teal-300 bg-teal-50/50 p-4 text-center dark:border-teal-800 dark:bg-teal-950/30">
              <Upload className="mx-auto h-8 w-8 text-teal-600 mb-2" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Upload Passport, National ID, or Driver's License
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                PNG, JPG, or PDF up to 10MB
              </p>
              <button
                type="button"
                className="mt-3 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-teal-700 shadow-xs border border-teal-200 dark:bg-slate-900 dark:border-teal-800 dark:text-teal-300"
              >
                Choose File
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>All biometric and ID documents are encrypted with AES-256 bank-grade security.</span>
            </div>

            {kycSuccess && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-emerald-800 text-xs font-medium dark:bg-emerald-950 dark:text-emerald-200">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span>Identity verification approved! Verified badge unlocked.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-teal-600 py-3 text-xs font-bold text-white shadow-md hover:bg-teal-700 transition-colors"
            >
              Submit for Instant Verification
            </button>
          </form>
        )}

        {/* Forgot Password Mode */}
        {activeTab === 'forgot' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enter your registered email
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-xs focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('verify2fa')}
              className="w-full rounded-xl bg-teal-600 py-3 text-xs font-bold text-white shadow-md hover:bg-teal-700"
            >
              Send Password Reset Code
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-xs text-slate-500 hover:underline"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}

        {/* 2FA Verification Mode */}
        {activeTab === 'verify2fa' && (
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="h-12 w-10 text-center text-lg font-bold rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                loginUser(selectedRole);
              }}
              className="w-full rounded-xl bg-teal-600 py-3 text-xs font-bold text-white shadow-md hover:bg-teal-700"
            >
              Confirm 2FA Code & Enter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
