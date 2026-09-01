import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  UserProfile,
  UserRole,
  LanguageCode,
  Job,
  JobApplication,
  ActiveContract,
  TimeEntry,
  Transaction,
  Conversation,
  ChatMessage,
  SocialPost,
  NotificationItem,
  ReviewItem,
  PlatformSettings,
  DisputeItem
} from '../types';
import {
  INITIAL_CURRENT_USER,
  INITIAL_EMPLOYER_USER,
  INITIAL_TALENTS,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_CONTRACTS,
  INITIAL_TIME_ENTRIES,
  INITIAL_TRANSACTIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_POSTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
  INITIAL_DISPUTES
} from '../data/mockData';
import { DICTIONARY, LANGUAGES } from '../i18n/translations';

interface ActiveTimerState {
  isRunning: boolean;
  contractId: string;
  jobTitle: string;
  startTime: number | null;
  elapsedSeconds: number;
  hourlyRate: number;
  memo: string;
}

interface AppContextType {
  currentUser: UserProfile;
  language: LanguageCode;
  isDarkMode: boolean;
  isMobileSimulator: boolean;
  currentScreen: string;
  jobs: Job[];
  talents: UserProfile[];
  applications: JobApplication[];
  contracts: ActiveContract[];
  timeEntries: TimeEntry[];
  transactions: Transaction[];
  conversations: Conversation[];
  chatMessages: Record<string, ChatMessage[]>;
  posts: SocialPost[];
  notifications: NotificationItem[];
  reviews: ReviewItem[];
  disputes: DisputeItem[];
  settings: PlatformSettings;
  activeTimerState: ActiveTimerState;
  
  // Modals & Navigation state
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'forgot' | 'verify2fa' | 'kyc';
  selectedJobForDetails: Job | null;
  selectedTalentForProfile: UserProfile | null;
  selectedContractForTime: ActiveContract | null;
  activeConversationId: string | null;
  searchFilterKeyword: string;
  selectedCategoryFilter: string;
  selectedLocationFilter: string;
  selectedDistanceRadius: number; // in km (e.g. 1, 5, 10, 50, 0 for any)
  
  // Actions
  t: (key: string) => string;
  setLanguage: (lang: LanguageCode) => void;
  toggleDarkMode: () => void;
  toggleMobileSimulator: () => void;
  navigateTo: (screen: string, payload?: any) => void;
  openAuthModal: (mode?: 'login' | 'register' | 'forgot' | 'verify2fa' | 'kyc') => void;
  closeAuthModal: () => void;
  loginUser: (role: UserRole, email?: string) => void;
  logoutUser: () => void;
  switchRole: (role: UserRole) => void;
  setSelectedJobForDetails: (job: Job | null) => void;
  setSelectedTalentForProfile: (talent: UserProfile | null) => void;
  setSearchFilterKeyword: (keyword: string) => void;
  setSelectedCategoryFilter: (category: string) => void;
  setSelectedLocationFilter: (location: string) => void;
  setSelectedDistanceRadius: (km: number) => void;
  
  // Core Feature Handlers
  postNewJob: (job: Partial<Job>) => string;
  applyToJob: (jobId: string, proposal: { proposedRate: number; rateType: 'hourly' | 'fixed'; coverLetter: string; estimatedDuration: string }) => boolean;
  acceptApplication: (applicationId: string) => void;
  rejectApplication: (applicationId: string) => void;
  fundMilestoneEscrow: (contractId: string, milestoneId: string) => void;
  releaseMilestoneEscrow: (contractId: string, milestoneId: string) => void;
  depositWallet: (amount: number, method: string) => void;
  withdrawWallet: (amount: number, method: string, isInstant?: boolean) => boolean;
  
  // Time Tracking Handlers
  startTimer: (contractId: string, memo?: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopAndLogTimer: (memo: string) => void;
  approveTimeEntry: (timeEntryId: string) => void;
  rejectTimeEntry: (timeEntryId: string) => void;
  
  // Messaging Handlers
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string, type?: 'text' | 'image' | 'file' | 'audio', fileUrl?: string, fileName?: string, audioDuration?: number) => void;
  startOrOpenConversationWithUser: (userId: string, jobId?: string, jobTitle?: string) => string;
  
  // Social Handlers
  createSocialPost: (content: string, mediaType?: 'image' | 'video' | 'project', mediaUrl?: string, tags?: string[]) => void;
  likePost: (postId: string) => void;
  addPostComment: (postId: string, text: string) => void;
  sharePost: (postId: string) => void;
  reportPost: (postId: string, reason: string) => void;
  
  // Ratings & Favorites
  submitReview: (review: Omit<ReviewItem, 'id' | 'date'>) => void;
  toggleSaveJob: (jobId: string) => void;
  toggleSaveTalent: (talentId: string) => void;
  
  // Notifications & Profile
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateCurrentUserProfile: (updates: Partial<UserProfile>) => void;
  verifyKYC: (userId: string) => void;
  
  // Admin & Disputes
  updatePlatformSettings: (updates: Partial<PlatformSettings>) => void;
  fileDispute: (contractId: string, reason: string, description: string, amount: number) => void;
  resolveDispute: (disputeId: string, action: 'refund' | 'release' | 'dismiss', notes?: string) => void;
  toggleUserBan: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Persisted state initializers
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('wh_current_user');
    return saved ? JSON.parse(saved) : INITIAL_CURRENT_USER;
  });

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('wh_language') as LanguageCode;
    return saved || 'en';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('wh_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  const [isMobileSimulator, setIsMobileSimulator] = useState<boolean>(() => {
    const saved = localStorage.getItem('wh_mobile_sim');
    return saved ? JSON.parse(saved) : false;
  });

  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot' | 'verify2fa' | 'kyc'>('login');

  // Filters & Selected State
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [selectedTalentForProfile, setSelectedTalentForProfile] = useState<UserProfile | null>(null);
  const [selectedContractForTime, setSelectedContractForTime] = useState<ActiveContract | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv_1');
  const [searchFilterKeyword, setSearchFilterKeyword] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('All');
  const [selectedDistanceRadius, setSelectedDistanceRadius] = useState<number>(0);

  // Collections
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('wh_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [talents, setTalents] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('wh_talents');
    return saved ? JSON.parse(saved) : INITIAL_TALENTS;
  });

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('wh_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [contracts, setContracts] = useState<ActiveContract[]>(() => {
    const saved = localStorage.getItem('wh_contracts');
    return saved ? JSON.parse(saved) : INITIAL_CONTRACTS;
  });

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => {
    const saved = localStorage.getItem('wh_time_entries');
    return saved ? JSON.parse(saved) : INITIAL_TIME_ENTRIES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('wh_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('wh_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('wh_chat_messages');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [posts, setPosts] = useState<SocialPost[]>(() => {
    const saved = localStorage.getItem('wh_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('wh_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    const saved = localStorage.getItem('wh_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [disputes, setDisputes] = useState<DisputeItem[]>(() => {
    const saved = localStorage.getItem('wh_disputes');
    return saved ? JSON.parse(saved) : INITIAL_DISPUTES;
  });

  const [settings, setSettings] = useState<PlatformSettings>(() => {
    const saved = localStorage.getItem('wh_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Active Timer state
  const [activeTimerState, setActiveTimerState] = useState<ActiveTimerState>(() => {
    const saved = localStorage.getItem('wh_active_timer');
    return saved ? JSON.parse(saved) : {
      isRunning: false,
      contractId: 'cnt_1',
      jobTitle: 'Senior Full-Stack React & Node.js Developer',
      startTime: null,
      elapsedSeconds: 0,
      hourlyRate: 65,
      memo: 'Developing real-time WebSockets logic'
    };
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('wh_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('wh_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('wh_talents', JSON.stringify(talents));
  }, [talents]);

  useEffect(() => {
    localStorage.setItem('wh_contracts', JSON.stringify(contracts));
  }, [contracts]);

  useEffect(() => {
    localStorage.setItem('wh_time_entries', JSON.stringify(timeEntries));
  }, [timeEntries]);

  useEffect(() => {
    localStorage.setItem('wh_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('wh_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('wh_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('wh_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('wh_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('wh_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('wh_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('wh_active_timer', JSON.stringify(activeTimerState));
  }, [activeTimerState]);

  // Handle Dark mode class on html
  useEffect(() => {
    localStorage.setItem('wh_dark_mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle RTL vs LTR on document
  useEffect(() => {
    localStorage.setItem('wh_language', language);
    const langObj = LANGUAGES.find(l => l.code === language);
    const dir = langObj?.dir || 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (activeTimerState.isRunning) {
      interval = setInterval(() => {
        setActiveTimerState(prev => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1,
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimerState.isRunning]);

  // Translation lookup helper
  const t = useCallback((key: string): string => {
    const langDict = DICTIONARY[language] || DICTIONARY['en'];
    return langDict[key] || DICTIONARY['en'][key] || key;
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const toggleMobileSimulator = () => {
    setIsMobileSimulator(prev => {
      const next = !prev;
      localStorage.setItem('wh_mobile_sim', JSON.stringify(next));
      return next;
    });
  };

  const navigateTo = (screen: string, payload?: any) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (payload?.job) setSelectedJobForDetails(payload.job);
    if (payload?.talent) setSelectedTalentForProfile(payload.talent);
    if (payload?.conversationId) setActiveConversationId(payload.conversationId);
  };

  const openAuthModal = (mode: 'login' | 'register' | 'forgot' | 'verify2fa' | 'kyc' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginUser = (role: UserRole, _email?: string) => {
    if (role === 'job_seeker') {
      setCurrentUser(INITIAL_CURRENT_USER);
    } else if (role === 'employer') {
      setCurrentUser(INITIAL_EMPLOYER_USER);
    } else {
      setCurrentUser({
        ...INITIAL_EMPLOYER_USER,
        id: 'usr_admin_1',
        role: 'admin',
        name: 'System Administrator',
        email: 'admin@workhome.io',
        title: 'Platform Master Admin',
      });
    }
    setIsAuthModalOpen(false);
  };

  const logoutUser = () => {
    // Demo reset to default guest or seeker
    setCurrentUser(INITIAL_CURRENT_USER);
    navigateTo('home');
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'job_seeker') {
      setCurrentUser({
        ...INITIAL_CURRENT_USER,
        role: 'job_seeker',
      });
      navigateTo('dashboard_seeker');
    } else if (newRole === 'employer') {
      setCurrentUser({
        ...INITIAL_EMPLOYER_USER,
        role: 'employer',
      });
      navigateTo('dashboard_employer');
    } else {
      setCurrentUser(prev => ({
        ...prev,
        role: 'admin',
        title: 'Platform Administrator',
      }));
      navigateTo('dashboard_admin');
    }
  };

  // Job Posting
  const postNewJob = (jobData: Partial<Job>): string => {
    const newId = `job_${Date.now()}`;
    const newJob: Job = {
      id: newId,
      employerId: currentUser.id,
      employerName: currentUser.name,
      employerCompany: currentUser.companyName || currentUser.name,
      employerAvatar: currentUser.avatar,
      employerRating: currentUser.rating.overall,
      employerVerified: currentUser.verified,
      title: jobData.title || 'Untitled Opportunity',
      description: jobData.description || '',
      category: jobData.category || 'Software & Tech',
      type: jobData.type || 'fixed',
      budget: jobData.budget || 500,
      hourlyRateMin: jobData.hourlyRateMin,
      hourlyRateMax: jobData.hourlyRateMax,
      experienceLevel: jobData.experienceLevel || 'intermediate',
      locationType: jobData.locationType || 'remote',
      location: jobData.location || currentUser.location,
      coords: currentUser.coords,
      requiredSkills: jobData.requiredSkills || [],
      duration: jobData.duration || '1 to 3 months',
      expectedHoursPerWeek: jobData.expectedHoursPerWeek || 30,
      datePosted: 'Just now',
      applicantsCount: 0,
      status: 'open',
      milestones: jobData.milestones || [],
      featured: jobData.featured || false,
      urgency: jobData.urgency || 'normal',
      aiMatchScore: 95,
    };

    setJobs(prev => [newJob, ...prev]);

    // Add social post announcement
    createSocialPost(
      `📢 We just posted a new opportunity: "${newJob.title}" with budget ${newJob.type === 'hourly' ? `$${newJob.budget}/hr` : `$${newJob.budget}`}. Check it out and apply on WorkHome!`,
      'project',
      undefined,
      ['JobAlert', newJob.category.replace(/\s+/g, ''), 'Hiring']
    );

    // Notification
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: currentUser.id,
      type: 'job',
      title: 'Job Published Successfully',
      message: `Your job "${newJob.title}" is now live and accepting applications.`,
      timestamp: 'Just now',
      read: false,
      actionScreen: 'jobs',
    };
    setNotifications(prev => [notif, ...prev]);

    return newId;
  };

  // Job Application
  const applyToJob = (jobId: string, proposal: { proposedRate: number; rateType: 'hourly' | 'fixed'; coverLetter: string; estimatedDuration: string }): boolean => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return false;

    const newApp: JobApplication = {
      id: `app_${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      applicantAvatar: currentUser.avatar,
      applicantTitle: currentUser.title,
      applicantRating: currentUser.rating.overall,
      applicantLocation: currentUser.location,
      applicantSkills: currentUser.skills,
      proposedRate: proposal.proposedRate,
      rateType: proposal.rateType,
      coverLetter: proposal.coverLetter,
      estimatedDuration: proposal.estimatedDuration,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    setApplications(prev => [newApp, ...prev]);
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j));

    // Send system message / notification to employer
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: job.employerId,
      type: 'application',
      title: 'New Application Received',
      message: `${currentUser.name} applied for "${job.title}" at $${proposal.proposedRate}${proposal.rateType === 'hourly' ? '/hr' : ''}.`,
      timestamp: 'Just now',
      read: false,
      actionScreen: 'dashboard_employer',
    };
    setNotifications(prev => [notif, ...prev]);

    return true;
  };

  // Employer Accept Application -> Creates active contract & triggers escrow deposit requirement
  const acceptApplication = (applicationId: string) => {
    const app = applications.find(a => a.id === applicationId);
    if (!app) return;

    setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: 'accepted' } : a));

    const newContract: ActiveContract = {
      id: `cnt_${Date.now()}`,
      jobId: app.jobId,
      jobTitle: app.jobTitle,
      workerId: app.applicantId,
      workerName: app.applicantName,
      workerAvatar: app.applicantAvatar,
      employerId: currentUser.id,
      employerName: currentUser.name,
      employerAvatar: currentUser.avatar,
      type: app.rateType,
      agreedRate: app.proposedRate,
      totalHoursWorked: 0,
      totalBilled: 0,
      escrowFunded: app.rateType === 'fixed' ? app.proposedRate : app.proposedRate * 10, // initial 10 hours for hourly
      status: 'active',
      startedAt: new Date().toISOString().split('T')[0],
      milestones: [
        {
          id: `m_${Date.now()}_1`,
          title: 'Milestone 1: Project Kickoff & Initial Deliverables',
          amount: app.rateType === 'fixed' ? Math.round(app.proposedRate * 0.5) : app.proposedRate * 10,
          status: 'funded',
        },
        {
          id: `m_${Date.now()}_2`,
          title: 'Milestone 2: Final Verification & Delivery',
          amount: app.rateType === 'fixed' ? Math.round(app.proposedRate * 0.5) : app.proposedRate * 10,
          status: 'pending',
        }
      ]
    };

    setContracts(prev => [newContract, ...prev]);

    // Record Escrow Hold Transaction
    const escrowTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'escrow_hold',
      amount: newContract.escrowFunded,
      fee: 0,
      netAmount: newContract.escrowFunded,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      toUserId: 'platform_escrow',
      toUserName: 'WorkHome Escrow Vault',
      contractId: newContract.id,
      jobTitle: newContract.jobTitle,
      status: 'held_in_escrow',
      timestamp: new Date().toISOString(),
      invoiceNumber: `ESC-${Date.now().toString().slice(-6)}`,
      paymentMethod: 'WorkHome Pre-Funded Escrow',
    };
    setTransactions(prev => [escrowTx, ...prev]);

    // Notify worker
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: app.applicantId,
      type: 'payment',
      title: 'Contract Awarded & Escrow Funded!',
      message: `${currentUser.name} accepted your proposal for "${app.jobTitle}". Escrow of $${newContract.escrowFunded} has been secured!`,
      timestamp: 'Just now',
      read: false,
      actionScreen: 'dashboard_seeker',
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const rejectApplication = (applicationId: string) => {
    setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: 'rejected' } : a));
  };

  // Escrow Fund Milestone
  const fundMilestoneEscrow = (contractId: string, milestoneId: string) => {
    setContracts(prev => prev.map(cnt => {
      if (cnt.id !== contractId) return cnt;
      const targetM = cnt.milestones.find(m => m.id === milestoneId);
      const amount = targetM?.amount || 500;
      
      const updatedMilestones = cnt.milestones.map(m => m.id === milestoneId ? { ...m, status: 'funded' as const } : m);
      return {
        ...cnt,
        escrowFunded: cnt.escrowFunded + amount,
        milestones: updatedMilestones,
      };
    }));

    // Record Transaction
    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'deposit',
      amount: 500,
      fee: 0,
      netAmount: 500,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      toUserId: 'platform_escrow',
      toUserName: 'WorkHome Escrow Vault',
      contractId,
      status: 'held_in_escrow',
      timestamp: new Date().toISOString(),
      invoiceNumber: `DEP-${Date.now().toString().slice(-6)}`,
      paymentMethod: 'Escrow Vault Top-Up',
    };
    setTransactions(prev => [tx, ...prev]);
  };

  // Escrow Release Milestone: Employer -> Platform (5% fee) -> Worker
  const releaseMilestoneEscrow = (contractId: string, milestoneId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return;
    const milestone = contract.milestones.find(m => m.id === milestoneId);
    const grossAmount = milestone ? milestone.amount : 500;
    const feeRate = settings.commissionFeePercent / 100; // e.g. 0.05
    const commissionFee = +(grossAmount * feeRate).toFixed(2);
    const workerNetPayout = +(grossAmount - commissionFee).toFixed(2);

    // Update contract milestone status
    setContracts(prev => prev.map(c => {
      if (c.id !== contractId) return c;
      const updatedMilestones = c.milestones.map(m => m.id === milestoneId ? { ...m, status: 'released' as const } : m);
      return {
        ...c,
        escrowFunded: Math.max(0, c.escrowFunded - grossAmount),
        totalBilled: c.totalBilled + grossAmount,
        milestones: updatedMilestones,
      };
    }));

    // Create Release Transaction
    const releaseTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'escrow_release',
      amount: grossAmount,
      fee: commissionFee,
      netAmount: workerNetPayout,
      fromUserId: contract.employerId,
      fromUserName: `${contract.employerName} (via Escrow)`,
      toUserId: contract.workerId,
      toUserName: contract.workerName,
      contractId,
      jobTitle: contract.jobTitle,
      status: 'completed',
      timestamp: new Date().toISOString(),
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      paymentMethod: 'WorkHome Escrow Release',
    };
    setTransactions(prev => [releaseTx, ...prev]);

    // Update user wallets
    if (currentUser.id === contract.workerId) {
      setCurrentUser(prev => ({
        ...prev,
        walletBalance: prev.walletBalance + workerNetPayout,
        totalEarned: prev.totalEarned + workerNetPayout,
      }));
    } else {
      setTalents(prev => prev.map(t => t.id === contract.workerId ? {
        ...t,
        walletBalance: t.walletBalance + workerNetPayout,
        totalEarned: t.totalEarned + workerNetPayout,
      } : t));
    }

    // Notification to worker
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: contract.workerId,
      type: 'payment',
      title: 'Payment Released!',
      message: `${contract.employerName} released $${workerNetPayout} for "${milestone?.title || contract.jobTitle}" (5% platform fee deducted: $${commissionFee}).`,
      timestamp: 'Just now',
      read: false,
      actionScreen: 'wallet',
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Wallet Deposit & Withdraw
  const depositWallet = (amount: number, method: string) => {
    setCurrentUser(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'deposit',
      amount,
      fee: 0,
      netAmount: amount,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      toUserId: currentUser.id,
      toUserName: `${currentUser.name} Wallet`,
      status: 'completed',
      timestamp: new Date().toISOString(),
      invoiceNumber: `DEP-${Date.now().toString().slice(-6)}`,
      paymentMethod: method,
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const withdrawWallet = (amount: number, method: string, isInstant: boolean = false): boolean => {
    if (amount > currentUser.walletBalance) return false;
    const instantFee = isInstant ? +(amount * (settings.instantPayoutFeePercent / 100)).toFixed(2) : 0;
    const netPayout = amount - instantFee;

    setCurrentUser(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - amount,
    }));

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'withdrawal',
      amount,
      fee: instantFee,
      netAmount: netPayout,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      toUserId: 'bank_payout',
      toUserName: method,
      status: 'completed',
      timestamp: new Date().toISOString(),
      invoiceNumber: `WTH-${Date.now().toString().slice(-6)}`,
      paymentMethod: `${method} ${isInstant ? '(Instant Transfer)' : '(Standard 1-2 Days)'}`,
    };
    setTransactions(prev => [tx, ...prev]);

    return true;
  };

  // Live Time Tracker
  const startTimer = (contractId: string, memo: string = '') => {
    const contract = contracts.find(c => c.id === contractId);
    setActiveTimerState({
      isRunning: true,
      contractId,
      jobTitle: contract?.jobTitle || 'Active Hourly Assignment',
      startTime: Date.now(),
      elapsedSeconds: 0,
      hourlyRate: contract?.agreedRate || 65,
      memo: memo || 'Working on assigned deliverables'
    });
  };

  const pauseTimer = () => {
    setActiveTimerState(prev => ({ ...prev, isRunning: false }));
  };

  const resumeTimer = () => {
    setActiveTimerState(prev => ({ ...prev, isRunning: true }));
  };

  const stopAndLogTimer = (memo: string) => {
    const elapsedMinutes = Math.max(1, Math.round(activeTimerState.elapsedSeconds / 60));
    const hours = elapsedMinutes / 60;
    const rate = activeTimerState.hourlyRate;
    const totalAmount = +(hours * rate).toFixed(2);
    const contract = contracts.find(c => c.id === activeTimerState.contractId);

    const newTimeEntry: TimeEntry = {
      id: `time_${Date.now()}`,
      contractId: activeTimerState.contractId,
      jobTitle: activeTimerState.jobTitle,
      workerId: currentUser.id,
      workerName: currentUser.name,
      employerId: contract?.employerId || 'usr_employer_1',
      employerName: contract?.employerName || 'Employer',
      date: new Date().toISOString().split('T')[0],
      startTime: new Date(Date.now() - activeTimerState.elapsedSeconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMinutes: elapsedMinutes,
      memo: memo || activeTimerState.memo || 'General work session',
      hourlyRate: rate,
      totalAmount,
      status: 'pending_approval',
      submittedAt: new Date().toISOString(),
    };

    setTimeEntries(prev => [newTimeEntry, ...prev]);
    setActiveTimerState({
      isRunning: false,
      contractId: '',
      jobTitle: '',
      startTime: null,
      elapsedSeconds: 0,
      hourlyRate: 65,
      memo: ''
    });

    // Notify Employer
    if (contract) {
      const notif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: contract.employerId,
        type: 'timesheet',
        title: 'New Working Session Submitted',
        message: `${currentUser.name} logged ${hours.toFixed(1)} hrs ($${totalAmount}) for "${contract.jobTitle}".`,
        timestamp: 'Just now',
        read: false,
        actionScreen: 'time',
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const approveTimeEntry = (timeEntryId: string) => {
    const entry = timeEntries.find(t => t.id === timeEntryId);
    if (!entry) return;

    setTimeEntries(prev => prev.map(t => t.id === timeEntryId ? { ...t, status: 'approved' } : t));

    // Release payout
    const feeRate = settings.commissionFeePercent / 100;
    const commissionFee = +(entry.totalAmount * feeRate).toFixed(2);
    const workerNet = +(entry.totalAmount - commissionFee).toFixed(2);

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'hourly_payment',
      amount: entry.totalAmount,
      fee: commissionFee,
      netAmount: workerNet,
      fromUserId: entry.employerId,
      fromUserName: entry.employerName,
      toUserId: entry.workerId,
      toUserName: entry.workerName,
      contractId: entry.contractId,
      jobTitle: entry.jobTitle,
      status: 'completed',
      timestamp: new Date().toISOString(),
      invoiceNumber: `TIM-${Date.now().toString().slice(-6)}`,
      paymentMethod: 'Hourly Auto-Billing Escrow',
    };
    setTransactions(prev => [tx, ...prev]);

    // Notify Worker
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: entry.workerId,
      type: 'timesheet',
      title: 'Timesheet Approved & Paid!',
      message: `Your session of ${(entry.durationMinutes / 60).toFixed(1)} hrs was approved. $${workerNet} has been added to your balance.`,
      timestamp: 'Just now',
      read: false,
      actionScreen: 'wallet',
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const rejectTimeEntry = (timeEntryId: string) => {
    setTimeEntries(prev => prev.map(t => t.id === timeEntryId ? { ...t, status: 'rejected' } : t));
  };

  // Messaging Handlers
  const sendMessage = (
    conversationId: string,
    text: string,
    type: 'text' | 'image' | 'file' | 'audio' = 'text',
    fileUrl?: string,
    fileName?: string,
    audioDuration?: number
  ) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text,
      type,
      fileUrl,
      fileName,
      audioDuration,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setChatMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    setConversations(prev => prev.map(c => {
      if (c.id !== conversationId) return c;
      return {
        ...c,
        lastMessage: type === 'audio' ? '🎤 Voice Message' : type === 'image' ? '📷 Image attachment' : type === 'file' ? `📎 ${fileName || 'Document'}` : text,
        lastMessageType: type,
        lastMessageTimestamp: 'Just now',
      };
    }));
  };

  const startOrOpenConversationWithUser = (targetUserId: string, jobId?: string, jobTitle?: string): string => {
    const existing = conversations.find(c => c.participants.includes(currentUser.id) && c.participants.includes(targetUserId));
    if (existing) {
      setActiveConversationId(existing.id);
      navigateTo('messages');
      return existing.id;
    }

    const targetUser = talents.find(t => t.id === targetUserId) || INITIAL_EMPLOYER_USER;
    const newConvId = `conv_${Date.now()}`;
    const newConv: Conversation = {
      id: newConvId,
      participants: [currentUser.id, targetUserId],
      participantDetails: {
        [currentUser.id]: {
          name: currentUser.name,
          avatar: currentUser.avatar,
          title: currentUser.title,
          online: true,
        },
        [targetUserId]: {
          name: targetUser.name,
          avatar: targetUser.avatar,
          title: targetUser.title,
          online: true,
        }
      },
      lastMessage: 'Started a new conversation',
      lastMessageType: 'text',
      lastMessageTimestamp: 'Just now',
      unreadCount: 0,
      jobId,
      jobTitle,
    };

    setConversations(prev => [newConv, ...prev]);
    setChatMessages(prev => ({
      ...prev,
      [newConvId]: [
        {
          id: `msg_init_${Date.now()}`,
          conversationId: newConvId,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text: `Hi ${targetUser.name}! I'm reaching out regarding ${jobTitle || 'freelance opportunities'}.`,
          type: 'text',
          timestamp: new Date().toISOString(),
          read: true,
        }
      ]
    }));

    setActiveConversationId(newConvId);
    navigateTo('messages');
    return newConvId;
  };

  // Social Community Handlers
  const createSocialPost = (content: string, mediaType?: 'image' | 'video' | 'project', mediaUrl?: string, tags: string[] = []) => {
    const newPost: SocialPost = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      authorTitle: currentUser.title,
      authorVerified: currentUser.verified,
      content,
      mediaType,
      mediaUrl,
      tags,
      likes: 0,
      likedByMe: false,
      commentsCount: 0,
      comments: [],
      shares: 0,
      createdAt: 'Just now',
    };

    setPosts(prev => [newPost, ...prev]);
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const isLiked = p.likedByMe;
      return {
        ...p,
        likedByMe: !isLiked,
        likes: isLiked ? p.likes - 1 : p.likes + 1,
      };
    }));
  };

  const addPostComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment = {
      id: `comm_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      text,
      createdAt: 'Just now',
    };

    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p,
        commentsCount: p.commentsCount + 1,
        comments: [...p.comments, newComment],
      };
    }));
  };

  const sharePost = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, shares: p.shares + 1 } : p));
  };

  const reportPost = (postId: string, reason: string) => {
    // Log report for admin
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: 'usr_admin_1',
      type: 'system',
      title: 'Content Report Filed',
      message: `User reported post #${postId} for: "${reason}". Pending moderation.`,
      timestamp: 'Just now',
      read: false,
      actionScreen: 'dashboard_admin',
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Reviews Submission
  const submitReview = (reviewData: Omit<ReviewItem, 'id' | 'date'>) => {
    const newReview: ReviewItem = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };

    setReviews(prev => [newReview, ...prev]);

    // Recalculate rating on target user
    setTalents(prev => prev.map(u => {
      if (u.id !== reviewData.toUserId) return u;
      const newCount = u.rating.reviewsCount + 1;
      const newOverall = +(((u.rating.overall * u.rating.reviewsCount) + reviewData.overallRating) / newCount).toFixed(2);
      return {
        ...u,
        rating: {
          ...u.rating,
          overall: newOverall,
          reviewsCount: newCount,
        }
      };
    }));

    // Notify reviewed user
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: reviewData.toUserId,
      type: 'review',
      title: 'New Review Received!',
      message: `${reviewData.fromUserName} rated you ${reviewData.overallRating.toFixed(1)} stars for "${reviewData.jobTitle}".`,
      timestamp: 'Just now',
      read: false,
      actionScreen: 'reviews',
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Saved / Favorites
  const toggleSaveJob = (jobId: string) => {
    setCurrentUser(prev => {
      const isSaved = prev.savedJobIds.includes(jobId);
      return {
        ...prev,
        savedJobIds: isSaved ? prev.savedJobIds.filter(id => id !== jobId) : [...prev.savedJobIds, jobId]
      };
    });
  };

  const toggleSaveTalent = (talentId: string) => {
    setCurrentUser(prev => {
      const isSaved = prev.savedTalentIds.includes(talentId);
      return {
        ...prev,
        savedTalentIds: isSaved ? prev.savedTalentIds.filter(id => id !== talentId) : [...prev.savedTalentIds, talentId]
      };
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateCurrentUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
    setTalents(prev => prev.map(t => t.id === currentUser.id ? { ...t, ...updates } : t));
  };

  const verifyKYC = (userId: string) => {
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({
        ...prev,
        verified: true,
        idVerified: true,
        emailVerified: true,
        phoneVerified: true,
      }));
    }
    setTalents(prev => prev.map(t => t.id === userId ? {
      ...t,
      verified: true,
      idVerified: true,
      emailVerified: true,
      phoneVerified: true,
    } : t));
  };

  // Admin & Disputes
  const updatePlatformSettings = (updates: Partial<PlatformSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const fileDispute = (contractId: string, reason: string, description: string, amount: number) => {
    const contract = contracts.find(c => c.id === contractId);
    const newDispute: DisputeItem = {
      id: `disp_${Date.now()}`,
      contractId,
      jobTitle: contract?.jobTitle || 'Active Contract',
      initiatedByUserId: currentUser.id,
      initiatedByUserName: currentUser.name,
      opponentUserId: currentUser.role === 'employer' ? (contract?.workerId || '') : (contract?.employerId || ''),
      opponentUserName: currentUser.role === 'employer' ? (contract?.workerName || '') : (contract?.employerName || ''),
      reason,
      description,
      amountInDispute: amount,
      status: 'under_review',
      filedAt: new Date().toISOString(),
    };

    setDisputes(prev => [newDispute, ...prev]);

    // Mark contract as disputed
    setContracts(prev => prev.map(c => c.id === contractId ? { ...c, status: 'disputed' } : c));
  };

  const resolveDispute = (disputeId: string, action: 'refund' | 'release' | 'dismiss', notes?: string) => {
    setDisputes(prev => prev.map(d => {
      if (d.id !== disputeId) return d;
      let newStatus: DisputeItem['status'] = 'dismissed';
      if (action === 'refund') newStatus = 'resolved_refunded';
      if (action === 'release') newStatus = 'resolved_released';
      return {
        ...d,
        status: newStatus,
        resolutionNotes: notes || `Admin mediation completed with resolution: ${action}.`,
      };
    }));
  };

  const toggleUserBan = (userId: string) => {
    setTalents(prev => prev.map(t => t.id === userId ? { ...t, availability: t.availability === 'not_available' ? 'available' : 'not_available' } : t));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        language,
        isDarkMode,
        isMobileSimulator,
        currentScreen,
        jobs,
        talents,
        applications,
        contracts,
        timeEntries,
        transactions,
        conversations,
        chatMessages,
        posts,
        notifications,
        reviews,
        disputes,
        settings,
        activeTimerState,
        isAuthModalOpen,
        authModalMode,
        selectedJobForDetails,
        selectedTalentForProfile,
        selectedContractForTime,
        activeConversationId,
        searchFilterKeyword,
        selectedCategoryFilter,
        selectedLocationFilter,
        selectedDistanceRadius,
        t,
        setLanguage,
        toggleDarkMode,
        toggleMobileSimulator,
        navigateTo,
        openAuthModal,
        closeAuthModal,
        loginUser,
        logoutUser,
        switchRole,
        setSelectedJobForDetails,
        setSelectedTalentForProfile,
        setSearchFilterKeyword,
        setSelectedCategoryFilter,
        setSelectedLocationFilter,
        setSelectedDistanceRadius,
        postNewJob,
        applyToJob,
        acceptApplication,
        rejectApplication,
        fundMilestoneEscrow,
        releaseMilestoneEscrow,
        depositWallet,
        withdrawWallet,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopAndLogTimer,
        approveTimeEntry,
        rejectTimeEntry,
        setActiveConversationId,
        sendMessage,
        startOrOpenConversationWithUser,
        createSocialPost,
        likePost,
        addPostComment,
        sharePost,
        reportPost,
        submitReview,
        toggleSaveJob,
        toggleSaveTalent,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateCurrentUserProfile,
        verifyKYC,
        updatePlatformSettings,
        fileDispute,
        resolveDispute,
        toggleUserBan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
