import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  CreditCard,
  Building,
  Sparkles,
  Download,
  Filter
} from 'lucide-react';

export const WalletEscrow: React.FC = () => {
  const {
    currentUser,
    walletBalance,
    escrowBalance,
    transactions,
    contracts,
    depositToWallet,
    withdrawFromWallet,
    releaseMilestoneEscrow,
    t,
  } = useApp();

  const [depositAmount, setDepositAmount] = useState<number>(500);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(200);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedTxFilter, setSelectedTxFilter] = useState<'all' | 'escrow' | 'deposit' | 'withdrawal'>('all');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    depositToWallet(depositAmount);
    setShowDepositModal(false);
    setActionSuccess(`Successfully deposited $${depositAmount} into your WorkHome wallet!`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount > walletBalance) {
      alert('Withdrawal amount exceeds available balance.');
      return;
    }
    withdrawFromWallet(withdrawAmount);
    setShowWithdrawModal(false);
    setActionSuccess(`Withdrawal of $${withdrawAmount} initiated to your bank account!`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleMilestoneRelease = (contractId: string, milestoneId: string) => {
    releaseMilestoneEscrow(contractId, milestoneId);
    setActionSuccess('Milestone approved! Funds released to worker after 5% platform fee deduction.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (selectedTxFilter === 'all') return true;
    if (selectedTxFilter === 'escrow') return tx.type.includes('escrow');
    return tx.type === selectedTxFilter;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300 mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
            <span>Escrow Vault & Payouts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('walletEscrow')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your funds, monitor pre-funded escrow vaults, and execute instant payouts with 5% transparent commission
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDepositModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-colors"
          >
            <ArrowDownLeft className="h-4 w-4" />
            <span>Deposit Funds</span>
          </button>

          <button
            onClick={() => setShowWithdrawModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition-colors"
          >
            <ArrowUpRight className="h-4 w-4" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200 text-xs font-semibold animate-slideDown">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Balance Summary Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Available Balance */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Available Balance</span>
            <Wallet className="h-5 w-5 text-teal-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            ${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-2">
            Ready for instant bank withdrawal or funding new job contracts
          </p>
        </div>

        {/* Locked in Escrow */}
        <div className="rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent p-6 shadow-xs dark:border-teal-900/60 dark:bg-slate-900">
          <div className="flex items-center justify-between text-teal-800 dark:text-teal-300 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Locked in Escrow</span>
            <Lock className="h-5 w-5 text-teal-600" />
          </div>
          <p className="text-3xl font-black text-teal-900 dark:text-white">
            ${escrowBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-2">
            Protected in WorkHome Escrow Vault until deliverables are approved
          </p>
        </div>

        {/* Platform Transparency / Commission */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Commission</span>
            <Sparkles className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            5.0% <span className="text-xs font-medium text-slate-400">(Zero hidden fees)</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-2">
            Worker receives 95% net payout on every milestone or hourly invoice
          </p>
        </div>
      </div>

      {/* Active Escrow Contracts & Milestone Release Desk */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-teal-600" />
            <span>Active Escrow Vault Contracts</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review submitted work deliverables and authorize escrow payouts to freelancers
          </p>
        </div>

        <div className="space-y-4">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-950/40 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {contract.jobTitle}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span>Worker: <strong className="text-slate-800 dark:text-slate-200">{contract.workerName}</strong></span>
                    <span>•</span>
                    <span>Employer: <strong className="text-slate-800 dark:text-slate-200">{contract.employerName}</strong></span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500">Escrow Total:</span>
                  <span className="ml-1.5 font-bold text-teal-600">${contract.totalEscrowAmount}</span>
                </div>
              </div>

              {/* Milestones in this contract */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Contract Milestones:</p>
                {contract.milestones.map((m) => (
                  <div
                    key={m.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-white p-3.5 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{m.title}</p>
                      <p className="text-[11px] text-slate-400">
                        Amount: ${m.amount} (Worker net: ${(m.amount * 0.95).toFixed(2)} • 5% fee: ${(m.amount * 0.05).toFixed(2)})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        m.status === 'released'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : m.status === 'funded'
                          ? 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {m.status === 'released' ? '✓ Released & Paid' : m.status === 'funded' ? '🔒 Funded in Escrow' : 'Pending Funding'}
                      </span>

                      {m.status === 'funded' && (
                        <button
                          onClick={() => handleMilestoneRelease(contract.id, m.id)}
                          className="rounded-xl bg-teal-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition-colors flex items-center gap-1"
                        >
                          <Unlock className="h-3.5 w-3.5" />
                          <span>Approve & Release</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-teal-600" />
              <span>Full Audit Transaction History</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified cryptographic transaction receipts with timestamp and escrow references
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            {['all', 'deposit', 'escrow', 'withdrawal'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedTxFilter(filter as any)}
                className={`capitalize px-3 py-1 rounded-xl font-semibold transition-all ${
                  selectedTxFilter === filter
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800">
                <th className="pb-3 font-semibold">Transaction ID & Date</th>
                <th className="pb-3 font-semibold">Description</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Fee (5%)</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5">
                    <p className="font-mono font-bold text-slate-800 dark:text-slate-200">{tx.id}</p>
                    <p className="text-[11px] text-slate-400">{tx.date}</p>
                  </td>
                  <td className="py-3.5 font-medium text-slate-700 dark:text-slate-300">
                    {tx.description}
                  </td>
                  <td className="py-3.5">
                    <span className="capitalize text-slate-600 dark:text-slate-400">{tx.type.replace('_', ' ')}</span>
                  </td>
                  <td className="py-3.5 text-slate-500 font-mono">
                    {tx.platformFee ? `$${tx.platformFee.toFixed(2)}` : '$0.00'}
                  </td>
                  <td className="py-3.5 font-bold font-mono text-slate-900 dark:text-white">
                    {tx.type === 'deposit' || tx.type === 'escrow_release' ? `+$${tx.amount.toFixed(2)}` : `-$${tx.amount.toFixed(2)}`}
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full text-[10px]">
                      <CheckCircle2 className="h-3 w-3" />
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Deposit Funds into WorkHome Wallet
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add funds using credit card, ACH bank transfer, or crypto to fund contracts instantly.
            </p>

            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Amount in USD ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    min={10}
                    required
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(+e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-bold dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {[100, 250, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    className="flex-1 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:border-teal-500 dark:border-slate-800"
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-teal-700"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Withdraw Available Earnings
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Payout directly to your linked bank account or verified PayPal.
            </p>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Withdrawal Amount ($) (Available: ${walletBalance.toFixed(2)})
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    max={walletBalance}
                    min={10}
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(+e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-bold dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-teal-700"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
