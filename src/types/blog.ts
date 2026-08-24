export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'gold' | 'glass';
export type ButtonIconType = 'play' | 'external' | 'info' | 'ticket' | 'download' | 'netflix' | 'star' | 'heart';

export interface CtaButton {
  id: string;
  label: string;
  url: string;
  variant: ButtonVariant;
  icon: ButtonIconType;
  openInNewTab: boolean;
}

export interface SidebarPage {
  id: string;
  name: string;
  tagline: string;
  color: string;
  badge?: string;
  icon?: string;
  description?: string;
  highlights?: string[];
  popularFeatures?: string[];
  pageContent?: string;
  externalUrl?: string;
  isBuiltIn?: boolean;
  createdAt: string;
}

export type StreamingService = string;

export type BlogCategory = 
  | 'All'
  | 'Web Series'
  | 'Movies'
  | 'How to Use & Setup'
  | 'Streaming Tech'
  | 'Behind The Scenes'
  | 'Reviews'
  | 'Upcoming Releases';

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  service: string;
  author: string;
  authorRole: string;
  authorAvatar?: string;
  date: string;
  readTime: string;
  category: Exclude<BlogCategory, 'All'>;
  coverImage: string;
  excerpt: string;
  content: string;
  ctaButtons: CtaButton[];
  tags: string[];
  isFeatured: boolean;
  likesCount: number;
  viewsCount: number;
  status: 'published' | 'draft';
  createdAt: string;

  // Account Analysis & Diagnostics Fields
  accountEmail?: string;
  planTier?: string;
  countryCode?: string;
  paymentMethod?: string;
  nextBillingCycle?: string;
  memberSince?: string;
  phoneConnection?: string;
  profileSubsystem?: string[];
  pcLink?: string;
  mobileLink?: string;
  tvLink?: string;
  netscapeConfig?: string;
  cardFormat?: 'links' | 'cookie';
  accountType?: 'Prime' | 'Free';
  expiryDays?: number; // Auto-delete card after N days from creation
}

export interface AdminStats {
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  totalLikes: number;
  activeCtaButtons: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  accountTier: 'Free' | 'Prime';
  createdAt: string;
  isBanned?: boolean;
  unlockedServices?: string[];
  vipExpiryDate?: string;
  isVipLocked?: boolean;
}
