import React, { useEffect, useState } from 'react';
import type { UserAccount } from '../types/blog';
import { Search, ShieldAlert, X, Menu, LogOut, Crown, Zap, Clock } from 'lucide-react';

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  onOpenSidebar: () => void;
  onResetHome: () => void;
  currentUser: UserAccount | null;
  onOpenAuthModal?: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  isAdmin,
  onToggleAdmin,
  onOpenSidebar,
  onResetHome,
  currentUser,
  onLogout,
}) => {
  const isLoggedIn = currentUser !== null || isAdmin;

  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (currentUser?.accountTier !== 'Prime' || !currentUser.vipExpiryDate) {
      setTimeRemaining('');
      return;
    }

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const expiry = new Date(currentUser.vipExpiryDate!).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeRemaining('Expired');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [currentUser]);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand & Sidebar Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Hamburger Menu Toggle (Only visible when user is logged in or admin) */}
          {isLoggedIn && (
            <button
              onClick={onOpenSidebar}
              className="btn btn-sm btn-ghost"
              style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6 }}
              title="Open Sidebar Navigation"
            >
              <Menu style={{ width: 18, height: 18, color: '#E50914' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Sidebar</span>
            </button>
          )}

          <div className="navbar-brand" onClick={onResetHome}>
            <img src="/netflix-logo.svg" alt="NetlaxFree" style={{ height: 28 }} />
            <span className="navbar-badge">HUB</span>
            <div className="navbar-divider" />
            <span className="navbar-tagline">Multi-Streaming Platform</span>
          </div>
        </div>

        {/* Actions */}
        <div className="navbar-actions" style={{ gap: 10 }}>
          {/* Search (Only visible when user is logged in or admin) */}
          {isLoggedIn && (
            <div className="search-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Netflix, Prime, Hotstar, JioStar..."
                className="search-input"
              />
              {searchQuery && (
                <button onClick={() => onSearchChange('')} className="search-clear">
                  <X style={{ width: 14, height: 14 }} />
                </button>
              )}
            </div>
          )}

          {/* User Authentication & Profile Section */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 10px 4px 6px',
                borderRadius: 999,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}>
                <div style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: currentUser.accountTier === 'Prime' ? '#eab308' : '#10b981',
                  color: '#000',
                  fontSize: 12,
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#ffffff' }}>
                  {currentUser.name}
                </span>
                <span style={{
                  fontSize: 9,
                  fontWeight: 900,
                  color: currentUser.accountTier === 'Prime' ? '#eab308' : '#10b981',
                  background: currentUser.accountTier === 'Prime' ? 'rgba(234,179,8,0.2)' : 'rgba(16,185,129,0.2)',
                  padding: '1px 6px',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                }}>
                  {currentUser.accountTier === 'Prime' ? <Crown style={{ width: 10, height: 10 }} /> : <Zap style={{ width: 10, height: 10 }} />}
                  {currentUser.accountTier}
                </span>
                
                {currentUser.accountTier === 'Prime' && timeRemaining && (
                  <span style={{
                    fontSize: 9,
                    fontWeight: 900,
                    color: '#eab308',
                    background: 'rgba(234,179,8,0.1)',
                    padding: '1px 6px',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    border: '1px solid rgba(234,179,8,0.3)',
                  }}>
                    <Clock style={{ width: 10, height: 10 }} />
                    {timeRemaining}
                  </span>
                )}
              </div>

              <button
                onClick={onLogout}
                className="btn btn-sm btn-ghost"
                style={{ padding: '6px 10px', color: 'var(--text-tertiary)' }}
                title="Sign Out"
              >
                <LogOut style={{ width: 14, height: 14 }} />
              </button>
            </div>
          ) : null}

          {/* Admin Buttons - Only visible when Admin mode is active via /admin */}
          {isAdmin && (
            <button onClick={onToggleAdmin} className="btn btn-sm btn-ghost" title="Exit Admin">
              <ShieldAlert style={{ width: 14, height: 14, color: '#E50914' }} />
              <span>Exit Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
