import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { BlogPost, StreamingService, SidebarPage, UserAccount } from './types/blog';
import { DEFAULT_BLOGS } from './data/defaultBlogs';
import { DEFAULT_SIDEBAR_PAGES } from './data/defaultSidebarPages';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ServiceHub } from './components/ServiceHub';
import { BlogCard } from './components/BlogCard';
import { BlogDetailModal } from './components/BlogDetailModal';
import { AdminDashboard } from './components/AdminDashboard';
import { BlogEditorModal } from './components/BlogEditorModal';
import { AdminPlatformModal } from './components/AdminPlatformModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { UserAuthModal } from './components/UserAuthModal';
import { VipUpgradeModal } from './components/VipUpgradeModal';
import { AccessDeniedScreen } from './components/AccessDeniedScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { Tv, ArrowLeft, Shield, CheckCircle2, Plus, Crown, Zap, User, AlertTriangle, XCircle, Info } from 'lucide-react';

const LOCAL_STORAGE_KEY_BLOGS = 'netflix_blogs_app_data_v4';

const LOCAL_STORAGE_KEY_PAGES = 'netflix_sidebar_pages_v1';
const LOCAL_STORAGE_KEY_PIN = 'netflix_admin_pin_v1';
const LOCAL_STORAGE_KEY_USER = 'netflix_current_user_v1';
const LOCAL_STORAGE_KEY_REGISTERED_USERS = 'netflix_registered_users_v1';
const LOCAL_STORAGE_KEY_TELEGRAM = 'netflix_telegram_username_v1';
const LOCAL_STORAGE_KEY_ADMIN_DEVICE = 'netlax_authorized_admin_device_v1';

const DEFAULT_REGISTERED_USERS: UserAccount[] = [];

const findMatchingUser = (target: UserAccount | null, users: UserAccount[]): UserAccount | null => {
  if (!target) return null;
  const norm = (str: string) => (str || '').toLowerCase().replace(/[\s._-]+/g, '');
  const normEmailPrefix = (email: string) => (email || '').toLowerCase().split('@')[0].replace(/[\s._-]+/g, '');

  const targetNormName = norm(target.name);
  const targetNormEmail = target.email ? normEmailPrefix(target.email) : '';

  return (
    users.find((u) => {
      if (u.id === target.id) return true;
      if (u.email && target.email && u.email.toLowerCase() === target.email.toLowerCase()) return true;
      if (norm(u.name) === targetNormName) return true;
      if (u.email && targetNormEmail && normEmailPrefix(u.email) === targetNormEmail) return true;
      if (u.email && norm(u.name) === targetNormEmail) return true;
      if (target.email && normEmailPrefix(target.email) === norm(u.name)) return true;
      return false;
    }) || null
  );
};

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);

  const [authPin, setAuthPin] = useState(() => localStorage.getItem(LOCAL_STORAGE_KEY_PIN) || 'admin123');

  const [telegramUsername, setTelegramUsername] = useState<string>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TELEGRAM);
    if (!saved || saved === 'admin_vip_support' || saved.includes('admin_vip_support')) {
      return 'netlaxfreevipsupport';
    }
    return saved;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TELEGRAM, telegramUsername);
  }, [telegramUsername]);

  // User Auth State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_REGISTERED_USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { }
    return DEFAULT_REGISTERED_USERS;
  });

  // Admin Master PIN state (Default: admin123)
  const [adminPin, setAdminPin] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY_PIN) || 'admin123';
  });

  // Dynamic Sidebar Pages & Platforms Persistence
  const [sidebarPages, setSidebarPages] = useState<SidebarPage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('Failed to parse saved sidebar pages:', err);
    }
    return DEFAULT_SIDEBAR_PAGES;
  });

  // Blog Posts Persistence State
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_BLOGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('Failed to parse saved blogs:', err);
    }
    return DEFAULT_BLOGS;
  });

  const [selectedService, setSelectedService] = useState<StreamingService>('All Services');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Admin Mode State (Secured: No URL auto-bypass)
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminRouteAttempt, setIsAdminRouteAttempt] = useState<boolean>(false);

  const [selectedPostForDetail, setSelectedPostForDetail] = useState<BlogPost | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [accountTypeFilter, setAccountTypeFilter] = useState<'All' | 'Prime' | 'Free'>('All');

  // Toast Notification System (replaces all blocking alert() calls)
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'error' | 'warning' | 'info' }[]>([]);
  const toastIdRef = useRef(0);

  const showToast = useCallback((message: string, type: 'error' | 'warning' | 'info' = 'warning') => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  // Admin Session Timeout (30 minutes of inactivity)
  const adminActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isAdmin) return;
    adminActivityRef.current = Date.now();

    const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
    const resetTimer = () => { adminActivityRef.current = Date.now(); };

    const checkTimeout = setInterval(() => {
      if (Date.now() - adminActivityRef.current > TIMEOUT_MS) {
        setIsAdmin(false);
        setIsAdminRouteAttempt(false);
        if (window.location.pathname.endsWith('/admin') || window.location.hash.includes('admin')) {
          window.history.pushState({}, '', '/');
        }
        showToast('Admin session expired due to 30 minutes of inactivity.', 'info');
      }
    }, 60000); // Check every 60s

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    return () => {
      clearInterval(checkTimeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [isAdmin, showToast]);

  // Persist Current User and Registered Users list
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
    }
  }, [currentUser]);

  // Body scroll lock for Modals (improves performance & UI/UX perfection)
  useEffect(() => {
    const isAnyModalOpen =
      isPlatformModalOpen ||
      isAdminLoginOpen ||
      isAuthModalOpen ||
      isVipModalOpen ||
      isEditorOpen ||
      selectedPostForDetail !== null;

    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [
    isPlatformModalOpen,
    isAdminLoginOpen,
    isAuthModalOpen,
    isVipModalOpen,
    isEditorOpen,
    selectedPostForDetail,
  ]);

  // Computed active user synced 100% live with registeredUsers database
  const activeUser = useMemo(() => {
    if (!currentUser) return null;
    const match = findMatchingUser(currentUser, registeredUsers);
    if (match) {
      if (match.isBanned) return null;
      return match;
    }
    return currentUser;
  }, [currentUser, registeredUsers]);

  const handleSetCurrentUser = (user: UserAccount | null) => {
    setCurrentUser(user);
    if (user) {
      setRegisteredUsers((prev) => {
        const match = findMatchingUser(user, prev);
        if (match) {
          return prev.map((u) => (u.id === match.id ? { ...user, id: match.id } : u));
        } else {
          return [user, ...prev];
        }
      });
    }
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_REGISTERED_USERS, JSON.stringify(registeredUsers));
    try {
      const channel = new BroadcastChannel('antigravity_realtime_sync');
      channel.postMessage({ type: 'USERS_UPDATE', data: registeredUsers });
      channel.close();
    } catch (e) { }
  }, [registeredUsers]);

  // Keep currentUser synced in real time when Admin promotes, demotes, or bans user
  useEffect(() => {
    if (activeUser !== currentUser) {
      setCurrentUser(activeUser);
    }
  }, [activeUser, currentUser]);

  // Check and demote expired VIPs
  useEffect(() => {
    let usersUpdated = false;
    const now = new Date();
    const checkedUsers = registeredUsers.map((u) => {
      if (u.accountTier === 'Prime' && u.vipExpiryDate) {
        if (new Date(u.vipExpiryDate) <= now) {
          usersUpdated = true;
          return { ...u, accountTier: 'Free' as const, vipExpiryDate: undefined, isVipLocked: true };
        }
      }
      return u;
    });

    if (usersUpdated) {
      lastPushTimeRef.current = Date.now();
      setRegisteredUsers(checkedUsers);
    }
  }, [registeredUsers]);

  // Auto-delete expired cards — runs on an interval, NOT on every posts change
  // This prevents the bug where saving a card triggers immediate re-evaluation and deletion
  useEffect(() => {
    const checkExpiredCards = () => {
      // Don't run until initial server data has loaded
      if (!isInitialLoadCompletedRef.current) return;

      const now = Date.now();
      let hasExpired = false;

      setPosts((currentPosts) => {
        const filtered = currentPosts.filter(post => {
          if (post.createdAt) {
            const effectiveExpiryDays = post.expiryDays || 3;
            const createdMs = new Date(post.createdAt).getTime();
            // Safety: if createdAt is invalid or in the future, keep the card
            if (isNaN(createdMs) || createdMs > now) return true;
            const expiryMs = createdMs + (effectiveExpiryDays * 86_400_000); // days → ms
            if (now > expiryMs) {
              hasExpired = true;
              return false; // expired — remove
            }
          }
          return true; // keep
        });

        if (hasExpired) {
          lastPushTimeRef.current = Date.now();
          return filtered;
        }
        return currentPosts; // no change — same reference, no re-render
      });
    };

    // Check once after mount + initial load, then every 60 seconds
    const initialDelay = setTimeout(checkExpiredCards, 3000);
    const interval = setInterval(checkExpiredCards, 60_000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []); // empty deps — interval manages itself


  // Real-time BroadcastChannel & Storage Sync for 0ms cross-tab/window updates
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('antigravity_realtime_sync');
      channel.onmessage = (event) => {
        if (event.data?.type === 'POSTS_UPDATE' && Array.isArray(event.data.data)) {
          setPosts(event.data.data);
        }
        if (event.data?.type === 'PAGES_UPDATE' && Array.isArray(event.data.data)) {
          setSidebarPages(event.data.data);
        }
        if (event.data?.type === 'USERS_UPDATE' && Array.isArray(event.data.data)) {
          setRegisteredUsers(event.data.data);
        }
        if (event.data?.type === 'TELEGRAM_UPDATE' && typeof event.data.data === 'string') {
          setTelegramUsername(event.data.data);
        }
      };
    } catch (e) { }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY_BLOGS && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setPosts(parsed);
        } catch (err) { }
      }
      if (e.key === LOCAL_STORAGE_KEY_PAGES && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setSidebarPages(parsed);
        } catch (err) { }
      }
      if (e.key === LOCAL_STORAGE_KEY_REGISTERED_USERS && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setRegisteredUsers(parsed);
        } catch (err) { }
      }
      if (e.key === LOCAL_STORAGE_KEY_TELEGRAM && e.newValue) {
        setTelegramUsername(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (channel) channel.close();
    };
  }, []);

  // Cross-Browser Real-Time Data Sync via Server API (/api/sync)
  const lastPushTimeRef = useRef<number>(0);
  const isInitialLoadCompletedRef = useRef<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchServerData = async () => {
      try {
        const res = await fetch('/api/sync');
        if (res.ok) {
          const json = await res.json();
          if (json && isMounted && Date.now() - lastPushTimeRef.current > 2000) {
            if (Array.isArray(json.posts) && json.posts.length > 0) {
              setPosts((prev) => {
                const strPrev = JSON.stringify(prev);
                const strNew = JSON.stringify(json.posts);
                return strPrev === strNew ? prev : json.posts;
              });
            }
            if (Array.isArray(json.sidebarPages) && json.sidebarPages.length > 0) {
              setSidebarPages((prev) => {
                const strPrev = JSON.stringify(prev);
                const strNew = JSON.stringify(json.sidebarPages);
                return strPrev === strNew ? prev : json.sidebarPages;
              });
            }
            if (Array.isArray(json.registeredUsers) && json.registeredUsers.length > 0) {
              setRegisteredUsers((prev) => {
                const strPrev = JSON.stringify(prev);
                const strNew = JSON.stringify(json.registeredUsers);
                return strPrev === strNew ? prev : json.registeredUsers;
              });
            }
            if (json.adminPin && typeof json.adminPin === 'string') {
              setAdminPin((prev) => (prev === json.adminPin ? prev : json.adminPin));
            }
            if (json.telegramUsername && typeof json.telegramUsername === 'string') {
              setTelegramUsername((prev) => (prev === json.telegramUsername ? prev : json.telegramUsername));
            }
          }
        }
      } catch (err) { } finally {
        if (isMounted) isInitialLoadCompletedRef.current = true;
      }
    };

    fetchServerData();
    const interval = setInterval(fetchServerData, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Listen for /admin or #admin in URL bar
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      const isRouteMatch = path === '/admin' || path.endsWith('/admin') || hash === '#admin' || hash === '#/admin';
      
      const isSecretKeyPresent = search.includes('key=master') || search.includes('auth=admin') || search.includes('key=admin');
      const isDeviceAuthorized = localStorage.getItem(LOCAL_STORAGE_KEY_ADMIN_DEVICE) === 'true' || isSecretKeyPresent;

      if (isRouteMatch) {
        setIsAdminRouteAttempt(true);
        if (!isAdmin) {
          if (isDeviceAuthorized) {
            setIsAdminLoginOpen(true);
          } else {
            setIsAdminLoginOpen(false);
          }
        }
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, [isAdmin]);

  // Push updates to LocalStorage, BroadcastChannel, AND Server API on change
  useEffect(() => {
    if (!isInitialLoadCompletedRef.current) return;

    const timer = setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_PIN, adminPin);
        localStorage.setItem(LOCAL_STORAGE_KEY_BLOGS, JSON.stringify(posts));
        localStorage.setItem(LOCAL_STORAGE_KEY_PAGES, JSON.stringify(sidebarPages));
        localStorage.setItem(LOCAL_STORAGE_KEY_TELEGRAM, telegramUsername);

        // Broadcast to other tabs in same browser
        const channel = new BroadcastChannel('antigravity_realtime_sync');
        channel.postMessage({ type: 'POSTS_UPDATE', data: posts });
        channel.postMessage({ type: 'PAGES_UPDATE', data: sidebarPages });
        channel.postMessage({ type: 'TELEGRAM_UPDATE', data: telegramUsername });
        channel.close();

        // Push to backend server file for DIFFERENT browsers
        console.log('Pushing to server! Deps changed.', Date.now());
        lastPushTimeRef.current = Date.now();

        fetch('/api/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-pin': authPin
          },
          body: JSON.stringify({ posts, sidebarPages, adminPin, registeredUsers, telegramUsername }),
        }).then(res => {
          if (res.ok && authPin !== adminPin) {
            setAuthPin(adminPin);
          }
        }).catch(() => { });
      } catch (err) { }
    }, 10);

    return () => clearTimeout(timer);
  }, [posts, sidebarPages, adminPin, registeredUsers, telegramUsername, authPin]);

  const handleLoadingFinish = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Admin access request handler
  const handleAdminAccessRequest = () => {
    if (isAdmin) {
      // Exit admin mode & clean URL
      setIsAdmin(false);
      setIsAdminRouteAttempt(false);
      if (window.location.pathname.endsWith('/admin') || window.location.hash.includes('admin')) {
        window.history.pushState({}, '', '/');
      }
    } else {
      const isDeviceAuthorized = localStorage.getItem(LOCAL_STORAGE_KEY_ADMIN_DEVICE) === 'true';
      setIsAdminRouteAttempt(true);
      if (isDeviceAuthorized) {
        setIsAdminLoginOpen(true);
      } else {
        setIsAdminLoginOpen(false);
      }
    }
  };

  const handleAdminLoginSuccess = (enteredPin?: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ADMIN_DEVICE, 'true');
    setIsAdmin(true);
    setIsAdminRouteAttempt(true);
    setIsAdminLoginOpen(false);
    if (enteredPin) {
      setAuthPin(enteredPin);
    }
  };

  const handleRetreatToHome = () => {
    setIsAdmin(false);
    setIsAdminRouteAttempt(false);
    setIsAdminLoginOpen(false);
    if (window.location.pathname.endsWith('/admin') || window.location.hash.includes('admin')) {
      window.history.pushState({}, '', '/');
    }
  };

  const handleChangeAdminPin = (newPin: string) => {
    lastPushTimeRef.current = Date.now();
    setAdminPin(newPin);
    setAuthPin(newPin);
    localStorage.setItem(LOCAL_STORAGE_KEY_PIN, newPin);
  };

  const handleChangeTelegramUsername = (newUsername: string) => {
    isInitialLoadCompletedRef.current = true;
    lastPushTimeRef.current = Date.now();
    setTelegramUsername(newUsername);
    localStorage.setItem(LOCAL_STORAGE_KEY_TELEGRAM, newUsername);

    // Direct API POST call for 100% reliable instant Telegram handle update across serverless Vercel & local
    fetch('/api/sync', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-admin-pin': authPin
      },
      body: JSON.stringify({ posts, sidebarPages, adminPin, registeredUsers, telegramUsername: newUsername }),
    }).catch(() => {});
  };

  // Is on main home view (no service or search filter active)
  const isMainHomeView = selectedService === 'All Services' && !searchQuery;

  // Filter posts for Reader Feed — All cards visible to all users.
  // VIP lock is enforced when opening a card (handleOpenPost), not here.
  const filteredPosts = posts.filter((post) => {
    const matchesService = selectedService === 'All Services' || post.service === selectedService;
    const matchesAccountType =
      accountTypeFilter === 'All' ||
      (accountTypeFilter === 'Prime' && (post.accountType === 'Prime' || !post.accountType)) ||
      (accountTypeFilter === 'Free' && post.accountType === 'Free');
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.service && post.service.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesService && matchesAccountType && matchesSearch;
  });

  // Calculate post counts per platform for ServiceHub (all cards count, VIP lock is on open)
  const postCountsByService = posts.reduce((acc, post) => {
    const srv = post.service || 'Netflix';
    acc[srv] = (acc[srv] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Save or Update Post
  const handleSavePost = (savedPost: BlogPost) => {
    lastPushTimeRef.current = Date.now();
    setPosts((prev) => {
      const existsIndex = prev.findIndex((p) => p.id === savedPost.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = savedPost;
        return updated;
      }
      return [savedPost, ...prev];
    });
  };

  // Delete Post
  const handleDeletePost = (id: string) => {
    lastPushTimeRef.current = Date.now();
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  // Add Dynamic Platform / Sidebar Page
  const handleSavePlatform = (newPage: SidebarPage) => {
    lastPushTimeRef.current = Date.now();
    setSidebarPages((prev) => [...prev, newPage]);
    setSelectedService(newPage.name);
  };

  // Increment Like Count
  const handleLikePost = (id: string) => {
    lastPushTimeRef.current = Date.now();
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likesCount: p.likesCount + 1 } : p))
    );
  };



  const handleUpdateUser = (updatedUser: UserAccount) => {
    lastPushTimeRef.current = Date.now();
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    if (
      currentUser &&
      (currentUser.id === updatedUser.id ||
        currentUser.email.toLowerCase() === updatedUser.email.toLowerCase())
    ) {
      if (updatedUser.isBanned) {
        setCurrentUser(null);
        showToast('🚫 Your account has been banned by the Administrator.', 'error');
      } else {
        setCurrentUser(updatedUser);
      }
    }
  };

  const handleDeleteUser = (userId: string) => {
    lastPushTimeRef.current = Date.now();
    setRegisteredUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(null);
    }
  };

  const handleOpenNewPost = () => {
    setEditingPost(null);
    setIsEditorOpen(true);
  };

  const handleResetHome = () => {
    setSelectedService('All Services');
    setSearchQuery('');
  };

  const handleSelectService = (serviceName: string) => {
    if (serviceName === 'All Services') {
      setSelectedService(serviceName);
      return;
    }

    if (isAdmin) {
      setSelectedService(serviceName);
      return;
    }

    if (!activeUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (activeUser.accountTier === 'Prime') {
      setSelectedService(serviceName);
      return;
    }

    // Free tier logic
    const unlocked = activeUser.unlockedServices || [];
    if (unlocked.includes(serviceName)) {
      setSelectedService(serviceName);
    } else if (unlocked.length < 3) {
      // Unlock new service
      const updatedUser = { ...activeUser, unlockedServices: [...unlocked, serviceName] };
      handleUpdateUser(updatedUser);
      setSelectedService(serviceName);
    } else {
      // Reached limit
      setIsVipModalOpen(true);
      showToast('Free tier allows a maximum of 3 services. Please upgrade to VIP to unlock more.', 'warning');
    }
  };

  const handleOpenPost = (post: BlogPost) => {
    if (isAdmin) {
      setSelectedPostForDetail(post);
      return;
    }

    if (!activeUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (activeUser.accountTier === 'Prime') {
      setSelectedPostForDetail(post);
      return;
    }

    // Check if the card itself requires VIP
    if (post.accountType === 'Prime') {
      setIsVipModalOpen(true);
      showToast('You are not VIP. Please join VIP to access this card.', 'warning');
      return;
    }

    // Free tier logic
    const unlocked = activeUser.unlockedServices || [];
    if (unlocked.includes(post.service)) {
      setSelectedPostForDetail(post);
    } else if (unlocked.length < 3) {
      // Unlock new service
      const updatedUser = { ...activeUser, unlockedServices: [...unlocked, post.service] };
      handleUpdateUser(updatedUser);
      setSelectedPostForDetail(post);
    } else {
      // Reached limit
      setIsVipModalOpen(true);
      showToast('Free tier allows a maximum of 3 services. Please upgrade to VIP to unlock more.', 'warning');
    }
  };

  return (
    <>
      {/* Cinematic Loading Screen */}
      {isLoading && <LoadingScreen onFinish={handleLoadingFinish} />}

      <div
        className="app-root"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-base)',
        }}
      >
        {/* Navigation Bar */}
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isAdmin={isAdmin}
          onToggleAdmin={handleAdminAccessRequest}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onResetHome={handleResetHome}
          currentUser={activeUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={() => setCurrentUser(null)}
        />

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          sidebarPages={sidebarPages}
          selectedService={selectedService}
          onSelectService={handleSelectService}
          isAdmin={isAdmin}
          onToggleAdmin={handleAdminAccessRequest}
          onOpenNewPlatformModal={() => setIsPlatformModalOpen(true)}
        />

        {/* Main Container */}
        <main className="app-container">

          {/* Main View Flow: Admin Dashboard on 'All Services', Access Denied Screen on unauthorized admin attempt, or Service Page on selected platform */}
          {isAdmin && selectedService === 'All Services' ? (
            <AdminDashboard
              posts={posts}
              sidebarPages={sidebarPages}
              onOpenNewPlatformModal={() => setIsPlatformModalOpen(true)}
              onUpdatePlatform={(updated) => {
                setSidebarPages((prev) =>
                  prev.map((p) => (p.id === updated.id ? updated : p))
                );
              }}
              currentPin={adminPin}
              onChangePin={handleChangeAdminPin}
              registeredUsers={registeredUsers}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              telegramUsername={telegramUsername}
              onChangeTelegramUsername={handleChangeTelegramUsername}
            />
          ) : !isAdmin && isAdminRouteAttempt ? (
            <AccessDeniedScreen
              onRetreatToHome={handleRetreatToHome}
              onReconnect={() => {
                const isDeviceAuthorized = localStorage.getItem(LOCAL_STORAGE_KEY_ADMIN_DEVICE) === 'true';
                if (isDeviceAuthorized) {
                  setIsAdminLoginOpen(true);
                } else {
                  handleRetreatToHome();
                }
              }}
            />
          ) : (
            <div>

              {/* HOME VIEW: Show ONLY Streaming Platform Cards when on home */}
              {isMainHomeView ? (
                <>
                  {/* UNLIMITED USE PROMOTIONAL BANNER */}
                  {!activeUser ? (
                    <div style={{
                      padding: '36px 32px',
                      minHeight: 120,
                      borderRadius: 20,
                      background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.28) 0%, rgba(15, 15, 20, 0.98) 100%)',
                      border: '1px solid rgba(229, 9, 20, 0.45)',
                      marginBottom: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 20,
                      boxShadow: '0 12px 40px rgba(229, 9, 20, 0.25)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                        <div style={{
                          width: 56,
                          height: 56,
                          borderRadius: 14,
                          background: '#E50914',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 0 24px rgba(229, 9, 20, 0.65)',
                          flexShrink: 0,
                        }}>
                          <User style={{ width: 28, height: 28, color: '#ffffff' }} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
                            Login / Sign-Up for Free Unlimited Uses
                          </h3>
                          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: '6px 0 0 0', lineHeight: 1.4 }}>
                            Create a free account to unlock instantaneous cookie data, direct links, and setup guides across all platforms.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="btn btn-md btn-red"
                        style={{ fontWeight: 800, padding: '12px 24px', fontSize: 14, gap: 8, borderRadius: 10 }}
                      >
                        <User style={{ width: 18, height: 18 }} />
                        <span>Login / Sign-Up</span>
                      </button>
                    </div>
                  ) : activeUser.accountTier === 'Free' ? (
                    <div style={{
                      padding: '36px 32px',
                      minHeight: 120,
                      borderRadius: 20,
                      background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.28) 0%, rgba(15, 15, 20, 0.98) 100%)',
                      border: '1px solid rgba(234, 179, 8, 0.45)',
                      marginBottom: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 20,
                      boxShadow: '0 12px 40px rgba(234, 179, 8, 0.25)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                        <div style={{
                          width: 56,
                          height: 56,
                          borderRadius: 14,
                          background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 0 24px rgba(234, 179, 8, 0.65)',
                          flexShrink: 0,
                        }}>
                          <Crown style={{ width: 28, height: 28, color: '#000000' }} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
                            Upgrade to Unlimited VIP Access
                          </h3>
                          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: '6px 0 0 0', lineHeight: 1.4 }}>
                            Currently on <strong style={{ color: '#10b981' }}>Free Tier</strong>. Upgrade to VIP to access premium 4K UHD accounts and priority servers.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsVipModalOpen(true)}
                        className="btn btn-md"
                        style={{
                          background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                          color: '#000000',
                          fontWeight: 900,
                          padding: '12px 24px',
                          fontSize: 14,
                          border: 'none',
                          borderRadius: 10,
                          gap: 8,
                          boxShadow: '0 6px 20px rgba(234, 179, 8, 0.4)',
                        }}
                      >
                        <Crown style={{ width: 18, height: 18 }} />
                        <span>Join VIP</span>
                      </button>
                    </div>
                  ) : null}

                  <ServiceHub
                    sidebarPages={sidebarPages}
                    selectedService={selectedService}
                    onSelectService={handleSelectService}
                    postCountsByService={postCountsByService}
                    isAdmin={isAdmin}
                    onOpenNewPlatformModal={() => setIsPlatformModalOpen(true)}
                    currentUser={currentUser}
                    onOpenAuthModal={() => setIsAuthModalOpen(true)}
                  />
                </>
              ) : (
                /* DEDICATED PLATFORM PAGE: Show all cards & guides related to selected service */
                <div className="animate-fade-in">

                  {/* Top Bar Navigation */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                    paddingBottom: 14,
                    borderBottom: '1px solid var(--border-subtle)',
                    flexWrap: 'wrap',
                    gap: 12,
                  }}>
                    <button
                      onClick={handleResetHome}
                      className="btn btn-sm btn-ghost"
                    >
                      <ArrowLeft style={{ width: 14, height: 14 }} />
                      <span>Back to Streaming Platforms</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        Showing {filteredPosts.length} guides for {selectedService}
                      </span>

                      {/* Admin Add New Card Button on Dedicated Service Page */}
                      {isAdmin && (
                        <button
                          onClick={() => handleOpenNewPost()}
                          className="btn btn-sm btn-red"
                          style={{ fontWeight: 800 }}
                        >
                          <Plus style={{ width: 14, height: 14 }} />
                          <span>+ Add New Card for {selectedService}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Dedicated Service Banner with Real-time How-to-Use Rules & Links */}
                  {(() => {
                    const currentPlatform = sidebarPages.find((p) => p.name === selectedService);
                    const color = currentPlatform?.color || '#E50914';
                    const rulesText = currentPlatform?.description ||
                      `How To Use & Setup Rules for ${selectedService}:\n1. Click PC LINK, MOBILE LINK, or TV LINK below to launch app.\n2. Log in using credential email: jayasekar04@gmail.com\n3. Select your assigned screen profile according to BASIC tier.\n4. Do not alter security PIN or account settings.`;

                    const rulesList = rulesText.split('\n').filter((r) => r.trim().length > 0);

                    return (
                      <div style={{
                        padding: '24px 28px',
                        borderRadius: 'var(--radius-lg)',
                        background: `linear-gradient(135deg, ${color}22 0%, var(--surface-1) 100%)`,
                        border: `1px solid ${color}44`,
                        marginBottom: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 20,
                        boxShadow: `0 8px 32px ${color}20`,
                      }}>
                        {/* Header Row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              background: color,
                              boxShadow: `0 0 14px ${color}`,
                            }} />
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
                              {selectedService !== 'All Services' ? `${selectedService} Official Hub` : 'Search Results'}
                            </h1>
                          </div>

                          {currentPlatform?.badge && (
                            <span style={{
                              fontSize: 11,
                              fontWeight: 900,
                              padding: '4px 10px',
                              borderRadius: 6,
                              background: color,
                              color: '#ffffff',
                              letterSpacing: '0.05em',
                            }}>
                              {currentPlatform.badge}
                            </span>
                          )}
                        </div>

                        {/* Real-time How to Use Rules Box */}
                        <div style={{
                          padding: 18,
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(0,0,0,0.5)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 12,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: color, fontWeight: 800, fontSize: 14 }}>
                            <Shield style={{ width: 18, height: 18 }} />
                            <span>How To Use & Setup Rules (Real-time Updated)</span>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {rulesList.map((rule, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                                <CheckCircle2 style={{ width: 15, height: 15, color: color, flexShrink: 0, marginTop: 2 }} />
                                <span style={{ lineHeight: 1.4 }}>{rule}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    );
                  })()}

                  {/* ACCOUNT TIER FILTER MENU (All vs Prime vs Free) */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                    padding: '10px 16px',
                    borderRadius: 12,
                    background: '#040d12',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    flexWrap: 'wrap',
                    gap: 12,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 900, color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>
                        FILTER ACCESS TIER:
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => setAccountTypeFilter('All')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 8,
                          background: accountTypeFilter === 'All' ? 'rgba(229, 9, 20, 0.2)' : 'transparent',
                          border: accountTypeFilter === 'All' ? '1px solid #E50914' : '1px solid rgba(255,255,255,0.1)',
                          color: accountTypeFilter === 'All' ? '#ffffff' : 'var(--text-secondary)',
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <span>All Accounts</span>
                      </button>

                      <button
                        onClick={() => setAccountTypeFilter('Prime')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 8,
                          background: accountTypeFilter === 'Prime' ? 'rgba(234, 179, 8, 0.2)' : 'transparent',
                          border: accountTypeFilter === 'Prime' ? '1px solid #eab308' : '1px solid rgba(255,255,255,0.1)',
                          color: accountTypeFilter === 'Prime' ? '#eab308' : 'var(--text-secondary)',
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Crown style={{ width: 14, height: 14 }} />
                        <span>Prime Accounts</span>
                      </button>

                      <button
                        onClick={() => setAccountTypeFilter('Free')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 8,
                          background: accountTypeFilter === 'Free' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                          border: accountTypeFilter === 'Free' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                          color: accountTypeFilter === 'Free' ? '#10b981' : 'var(--text-secondary)',
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Zap style={{ width: 14, height: 14 }} />
                        <span>Free Accounts</span>
                      </button>
                    </div>
                  </div>

                  {/* Blog Cards Grid for the Selected Service */}
                  {filteredPosts.length > 0 ? (
                    <div className="blog-grid">
                      {filteredPosts.map((post) => (
                        <BlogCard
                          key={post.id}
                          post={post}
                          onReadArticle={(p) => handleOpenPost(p)}
                          isAdmin={isAdmin}
                          isLocked={!isAdmin && (!activeUser || activeUser.accountTier === 'Free') && post.accountType === 'Prime'}
                          onEdit={(p) => {
                            setEditingPost(p);
                            setIsEditorOpen(true);
                          }}
                          onDelete={(id) => {
                            lastPushTimeRef.current = Date.now();
                            setPosts((prev) => prev.filter((item) => item.id !== id));
                          }}
                          onTogglePin={(id) => {
                            lastPushTimeRef.current = Date.now();
                            setPosts((prev) =>
                              prev.map((item) => (item.id === id ? { ...item, isFeatured: !item.isFeatured } : item))
                            );
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <Tv style={{ width: 48, height: 48, color: '#52525b', margin: '0 auto' }} />
                      <h3>No guides found for {selectedService}</h3>
                      <p>
                        Click "+ Add New Card for {selectedService}" above to create the first card.
                      </p>
                      {isAdmin ? (
                        <button onClick={() => handleOpenNewPost()} className="btn btn-md btn-red">
                          + Add New Card for {selectedService}
                        </button>
                      ) : (
                        <button onClick={handleResetHome}>
                          Back to Platforms
                        </button>
                      )}
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </main>

        {/* Professional SaaS Footer */}
        {!isLoading && (
          <footer style={{
            padding: '32px 24px 24px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'linear-gradient(180deg, transparent 0%, rgba(4, 13, 18, 0.95) 100%)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Tv style={{ width: 18, height: 18, color: '#E50914' }} />
              <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: '-0.01em', color: '#ffffff' }}>
                Netlax<span style={{ color: '#E50914' }}>Free</span>
              </span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, maxWidth: 480 }}>
              Free & premium streaming accounts hub. Access Netscape cookies, direct login links, and step-by-step setup guides across all major platforms.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>© {new Date().getFullYear()} NetlaxFree</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)' }}>•</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>All Rights Reserved</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)' }}>•</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Shield style={{ width: 10, height: 10 }} /> SaaS Platform
              </span>
            </div>
          </footer>
        )}

        {/* Admin Password/PIN Security Login Modal */}
        <AdminLoginModal
          isOpen={isAdminLoginOpen}
          onClose={() => setIsAdminLoginOpen(false)}
          onSuccess={handleAdminLoginSuccess}
          currentPin={adminPin}
        />

        {/* User Authentication Modal (Sign In / Register) */}
        <UserAuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(user) => handleSetCurrentUser(user)}
          registeredUsers={registeredUsers}
          onRegisterUser={(newUser) => handleSetCurrentUser(newUser)}
        />

        {/* VIP Membership Contact Admin Modal */}
        <VipUpgradeModal
          isOpen={isVipModalOpen}
          onClose={() => setIsVipModalOpen(false)}
          telegramUsername={telegramUsername}
        />

        {/* Reader View Detail Modal */}
        {selectedPostForDetail && (
          <BlogDetailModal
            post={selectedPostForDetail}
            onClose={() => setSelectedPostForDetail(null)}
            onLikePost={handleLikePost}
            allPosts={posts}
            onSelectPost={(post) => handleOpenPost(post)}
          />
        )}

        {/* Admin Post Editor Modal */}
        <BlogEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSavePost}
          onDelete={handleDeletePost}
          editingPost={editingPost}
          defaultService={selectedService}
        />

        {/* Admin Dynamic Platform / Sidebar Page Creator Modal */}
        <AdminPlatformModal
          isOpen={isPlatformModalOpen}
          onClose={() => setIsPlatformModalOpen(false)}
          onSavePlatform={handleSavePlatform}
        />

      </div>
      {/* Toast Notification Container */}
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
        maxWidth: 380,
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-fade-in"
            style={{
              padding: '14px 18px',
              borderRadius: 12,
              background: toast.type === 'error'
                ? 'rgba(239, 68, 68, 0.95)'
                : toast.type === 'warning'
                  ? 'rgba(234, 179, 8, 0.95)'
                  : 'rgba(59, 130, 246, 0.95)',
              color: toast.type === 'warning' ? '#000000' : '#ffffff',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${toast.type === 'error' ? 'rgba(239,68,68,0.6)' : toast.type === 'warning' ? 'rgba(234,179,8,0.6)' : 'rgba(59,130,246,0.6)'}`,
              pointerEvents: 'auto',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            {toast.type === 'error' && <XCircle style={{ width: 18, height: 18, flexShrink: 0 }} />}
            {toast.type === 'warning' && <AlertTriangle style={{ width: 18, height: 18, flexShrink: 0 }} />}
            {toast.type === 'info' && <Info style={{ width: 18, height: 18, flexShrink: 0 }} />}
            <span style={{ lineHeight: 1.4 }}>{toast.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                padding: 2,
                marginLeft: 'auto',
                opacity: 0.7,
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
