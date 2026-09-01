export type UserRole = 'job_seeker' | 'employer' | 'admin';

export type LanguageCode = 'en' | 'ar' | 'es' | 'fr' | 'de';

export interface RatingBreakdown {
  overall: number;
  communication: number;
  professionalism: number;
  quality: number;
  reliability: number;
  reviewsCount: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  client?: string;
  link?: string;
  completedDate?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

export interface WorkExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  title: string;
  bio: string;
  location: string;
  coords: { lat: number; lng: number };
  languages: string[];
  skills: string[];
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  experienceYears: number;
  hourlyRate: number;
  availability: 'available' | 'busy' | 'not_available';
  rating: RatingBreakdown;
  portfolio: PortfolioItem[];
  education: EducationItem[];
  experience: WorkExperienceItem[];
  completedJobsCount: number;
  totalEarned: number;
  totalSpent: number;
  walletBalance: number;
  escrowBalance: number;
  verified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  idVerified: boolean;
  twoFactorEnabled: boolean;
  companyName?: string;
  companySize?: string;
  website?: string;
  hireRate?: number;
  activeContractsCount?: number;
  savedJobIds: string[];
  savedTalentIds: string[];
}

export interface JobMilestone {
  id: string;
  title: string;
  amount: number;
  status: 'pending' | 'funded' | 'submitted' | 'completed' | 'released';
  dueDate?: string;
}

export interface Job {
  id: string;
  employerId: string;
  employerName: string;
  employerAvatar: string;
  employerCompany?: string;
  employerRating: number;
  employerVerified: boolean;
  title: string;
  description: string;
  category: string;
  type: 'hourly' | 'fixed';
  budget: number;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  locationType: 'remote' | 'onsite' | 'hybrid';
  location: string;
  coords: { lat: number; lng: number };
  distanceKm?: number;
  requiredSkills: string[];
  duration: string;
  expectedHoursPerWeek?: number;
  datePosted: string;
  deadline?: string;
  applicantsCount: number;
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  milestones?: JobMilestone[];
  featured?: boolean;
  urgency?: 'normal' | 'urgent';
  aiMatchScore?: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar: string;
  applicantTitle: string;
  applicantRating: number;
  applicantLocation: string;
  applicantSkills: string[];
  proposedRate: number;
  rateType: 'hourly' | 'fixed';
  coverLetter: string;
  estimatedDuration: string;
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
  submittedAt: string;
  attachments?: string[];
}

export interface ActiveContract {
  id: string;
  jobId: string;
  jobTitle: string;
  workerId: string;
  workerName: string;
  workerAvatar: string;
  employerId: string;
  employerName: string;
  employerAvatar: string;
  type: 'hourly' | 'fixed';
  agreedRate: number;
  totalHoursWorked: number;
  totalBilled: number;
  escrowFunded: number;
  status: 'active' | 'completed' | 'disputed';
  startedAt: string;
  milestones: JobMilestone[];
}

export interface TimeEntry {
  id: string;
  contractId: string;
  jobTitle: string;
  workerId: string;
  workerName: string;
  employerId: string;
  employerName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  memo: string;
  hourlyRate: number;
  totalAmount: number;
  status: 'pending_approval' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'escrow_hold' | 'escrow_release' | 'withdrawal' | 'hourly_payment' | 'milestone_payment' | 'commission_fee';
  amount: number;
  fee: number;
  netAmount: number;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  contractId?: string;
  jobId?: string;
  jobTitle?: string;
  status: 'completed' | 'pending' | 'held_in_escrow';
  timestamp: string;
  invoiceNumber: string;
  paymentMethod: string;
  receiptUrl?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  type: 'text' | 'image' | 'file' | 'audio';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  audioDuration?: number;
  timestamp: string;
  read: boolean;
  translatedText?: Record<string, string>;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantDetails: Record<string, {
    name: string;
    avatar: string;
    title: string;
    online: boolean;
    lastSeen?: string;
  }>;
  lastMessage?: string;
  lastMessageType?: 'text' | 'image' | 'file' | 'audio';
  lastMessageTimestamp?: string;
  unreadCount: number;
  jobId?: string;
  jobTitle?: string;
}

export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: 'job_seeker' | 'employer';
  authorTitle: string;
  authorVerified: boolean;
  content: string;
  mediaType?: 'image' | 'video' | 'project';
  mediaUrl?: string;
  tags: string[];
  likes: number;
  likedByMe?: boolean;
  commentsCount: number;
  comments: PostComment[];
  shares: number;
  createdAt: string;
  translatedContent?: Record<string, string>;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'job' | 'application' | 'message' | 'payment' | 'timesheet' | 'review' | 'system' | 'social';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionScreen?: string;
}

export interface ReviewItem {
  id: string;
  jobId: string;
  jobTitle: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  fromUserRole: 'job_seeker' | 'employer';
  toUserId: string;
  overallRating: number;
  communication: number;
  professionalism: number;
  qualityOfWork: number;
  reliability: number;
  comment: string;
  date: string;
}

export interface PlatformSettings {
  commissionFeePercent: number; // e.g. 5%
  escrowProtectionEnabled: boolean;
  autoApproveTimesheetDays: number;
  withdrawalMinAmount: number;
  instantPayoutFeePercent: number;
}

export interface DisputeItem {
  id: string;
  contractId: string;
  jobTitle: string;
  initiatedByUserId: string;
  initiatedByUserName: string;
  opponentUserId: string;
  opponentUserName: string;
  reason: string;
  description: string;
  amountInDispute: number;
  status: 'under_review' | 'resolved_refunded' | 'resolved_released' | 'dismissed';
  filedAt: string;
  resolutionNotes?: string;
}
