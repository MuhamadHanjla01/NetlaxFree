import React, { useState } from 'react';
import type { UserAccount } from '../types/blog';
import { User, Crown, Zap, ShieldAlert, Check, Search, Eye, EyeOff, Copy, Trash2, UserCheck, UserX, Lock, Unlock } from 'lucide-react';

interface Props {
  users: UserAccount[];
  onUpdateUser: (updatedUser: UserAccount) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserManagementTable: React.FC<Props> = ({
  users,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'All' | 'Prime' | 'Free' | 'Banned'>('All');
  const [showAllPasswords, setShowAllPasswords] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (expiryIso?: string) => {
    if (!expiryIso) return '';
    const diff = new Date(expiryIso).getTime() - currentTime;
    if (diff <= 0) return 'Expired';
    
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    return `${d}d ${h}h ${m}m left`;
  };

  const togglePasswordVisibility = (id: string) => {
    setRevealedPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (tierFilter === 'Prime') return u.accountTier === 'Prime' && !u.isBanned;
    if (tierFilter === 'Free') return u.accountTier === 'Free' && !u.isBanned;
    if (tierFilter === 'Banned') return u.isBanned;
    return true;
  });

  const primeCount = users.filter((u) => u.accountTier === 'Prime' && !u.isBanned).length;
  const freeCount = users.filter((u) => u.accountTier === 'Free' && !u.isBanned).length;
  const bannedCount = users.filter((u) => u.isBanned).length;

  return (
    <div style={{
      padding: 24,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-md)',
      marginBottom: 32,
    }}>
      {/* Header Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(229, 9, 20, 0.15)',
            border: '1px solid rgba(229, 9, 20, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <User style={{ width: 22, height: 22, color: '#E50914' }} />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', margin: 0 }}>
              Registered Users Management ({users.length})
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: '2px 0 0 0' }}>
              View user passwords, manage VIP/Free tier access, and enforce bans.
            </p>
          </div>
        </div>

        {/* Global Password Reveal Toggle */}
        <button
          onClick={() => setShowAllPasswords(!showAllPasswords)}
          className="btn btn-sm btn-ghost"
          style={{
            border: '1px solid var(--border-subtle)',
            fontSize: 12,
            fontWeight: 800,
            gap: 6,
            background: showAllPasswords ? 'rgba(229, 9, 20, 0.15)' : 'var(--surface-2)',
            color: showAllPasswords ? '#E50914' : 'var(--text-secondary)',
          }}
        >
          {showAllPasswords ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
          <span>{showAllPasswords ? 'Mask Passwords' : 'Reveal Passwords'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 20,
        flexWrap: 'wrap',
      }}>
        {/* Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setTierFilter('All')}
            className={`btn btn-xs ${tierFilter === 'All' ? 'btn-red' : 'btn-ghost'}`}
            style={{ fontWeight: 800, fontSize: 11 }}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setTierFilter('Prime')}
            className={`btn btn-xs ${tierFilter === 'Prime' ? 'btn-red' : 'btn-ghost'}`}
            style={{ fontWeight: 800, fontSize: 11, color: tierFilter === 'Prime' ? '#000' : '#eab308', background: tierFilter === 'Prime' ? '#eab308' : 'rgba(234, 179, 8, 0.15)' }}
          >
            <Crown style={{ width: 12, height: 12 }} />
            <span>VIP / Prime ({primeCount})</span>
          </button>
          <button
            onClick={() => setTierFilter('Free')}
            className={`btn btn-xs ${tierFilter === 'Free' ? 'btn-red' : 'btn-ghost'}`}
            style={{ fontWeight: 800, fontSize: 11, color: tierFilter === 'Free' ? '#fff' : '#10b981', background: tierFilter === 'Free' ? '#10b981' : 'rgba(16, 185, 129, 0.15)' }}
          >
            <Zap style={{ width: 12, height: 12 }} />
            <span>Free Tier ({freeCount})</span>
          </button>
          <button
            onClick={() => setTierFilter('Banned')}
            className={`btn btn-xs ${tierFilter === 'Banned' ? 'btn-red' : 'btn-ghost'}`}
            style={{ fontWeight: 800, fontSize: 11, color: tierFilter === 'Banned' ? '#fff' : '#ef4444', background: tierFilter === 'Banned' ? '#ef4444' : 'rgba(239, 68, 68, 0.15)' }}
          >
            <ShieldAlert style={{ width: 12, height: 12 }} />
            <span>Banned ({bannedCount})</span>
          </button>
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', minWidth: 240, flex: 1, maxWidth: 320 }}>
          <Search style={{ width: 14, height: 14, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name or email..."
            className="form-input"
            style={{ paddingLeft: 34, fontSize: 12 }}
          />
        </div>
      </div>

      {/* Users Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{
              borderBottom: '1px solid var(--border-subtle)',
              textAlign: 'left',
              color: 'var(--text-tertiary)',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.05em',
            }}>
              <th style={{ padding: '12px 14px' }}>USER PROFILE</th>
              <th style={{ padding: '12px 14px' }}>EMAIL ADDRESS</th>
              <th style={{ padding: '12px 14px' }}>PASSWORD</th>
              <th style={{ padding: '12px 14px' }}>ACCESS TIER</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>ADMIN ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => {
                const isPasswordRevealed = showAllPasswords || revealedPasswords[u.id];
                const displayPassword = u.password || 'password123';

                return (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: u.isBanned ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
                    }}
                  >
                    {/* User Profile */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          background: u.isBanned ? '#ef4444' : u.accountTier === 'Prime' ? '#eab308' : '#3b82f6',
                          color: u.accountTier === 'Prime' ? '#000' : '#fff',
                          fontWeight: 900,
                          fontSize: 13,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: u.isBanned ? '#ef4444' : '#ffffff' }}>
                            {u.name} {u.isBanned && <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 900 }}>(BANNED)</span>}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                            Joined: {u.createdAt ? u.createdAt.split('T')[0] : 'Today'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: '14px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {u.email}
                    </td>

                    {/* Password */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          fontFamily: 'monospace',
                          fontSize: 13,
                          fontWeight: 800,
                          padding: '4px 8px',
                          borderRadius: 6,
                          background: 'var(--surface-3)',
                          border: '1px solid var(--border-subtle)',
                          color: isPasswordRevealed ? '#10b981' : 'var(--text-tertiary)',
                          minWidth: 100,
                        }}>
                          {isPasswordRevealed ? displayPassword : '••••••••••••'}
                        </span>

                        {/* Individual Eye Toggle */}
                        <button
                          onClick={() => togglePasswordVisibility(u.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 4 }}
                          title={isPasswordRevealed ? "Hide Password" : "Reveal Password"}
                        >
                          {isPasswordRevealed ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
                        </button>

                        {/* Copy Password */}
                        <button
                          onClick={() => copyToClipboard(displayPassword, u.id)}
                          style={{ background: 'none', border: 'none', color: copiedId === u.id ? '#10b981' : 'var(--text-tertiary)', cursor: 'pointer', padding: 4 }}
                          title="Copy Password"
                        >
                          {copiedId === u.id ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
                        </button>
                      </div>
                    </td>

                    {/* Tier Badge */}
                    <td style={{ padding: '14px' }}>
                      {u.isBanned ? (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 900,
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                        }}>
                          🚫 BANNED
                        </span>
                      ) : u.isVipLocked ? (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 900,
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: 'rgba(156, 163, 175, 0.15)',
                          color: '#9ca3af',
                          border: '1px solid rgba(156, 163, 175, 0.4)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}>
                          <Lock style={{ width: 11, height: 11 }} /> VIP LOCKED
                        </span>
                      ) : u.accountTier === 'Prime' ? (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 900,
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: 'rgba(234, 179, 8, 0.15)',
                          color: '#eab308',
                          border: '1px solid rgba(234, 179, 8, 0.4)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}>
                          <Crown style={{ width: 11, height: 11 }} /> VIP PRIME
                        </span>
                      ) : (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 900,
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}>
                          <Zap style={{ width: 11, height: 11 }} /> FREE TIER
                        </span>
                      )}
                      
                      {u.accountTier === 'Prime' && u.vipExpiryDate && !u.isBanned && !u.isVipLocked && (
                        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4, fontWeight: 700 }}>
                          {formatCountdown(u.vipExpiryDate)}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                        {/* Promote / Demote Button */}
                        {u.isVipLocked ? (
                          <button
                            onClick={() => onUpdateUser({ ...u, isVipLocked: false })}
                            className="btn btn-xs"
                            style={{
                              background: 'rgba(156, 163, 175, 0.15)',
                              color: '#d1d5db',
                              border: '1px solid rgba(156, 163, 175, 0.4)',
                              fontWeight: 800,
                              fontSize: 11,
                              padding: '4px 8px',
                              gap: 4,
                            }}
                            title="Unlock VIP status"
                          >
                            <Unlock style={{ width: 12, height: 12 }} />
                            <span>Unlock</span>
                          </button>
                        ) : u.accountTier === 'Free' ? (
                          <button
                            onClick={() => {
                              const expiryDate = new Date();
                              expiryDate.setDate(expiryDate.getDate() + 30);
                              onUpdateUser({ ...u, accountTier: 'Prime', vipExpiryDate: expiryDate.toISOString(), isVipLocked: false });
                            }}
                            className="btn btn-xs"
                            style={{
                              background: 'rgba(234, 179, 8, 0.15)',
                              color: '#eab308',
                              border: '1px solid rgba(234, 179, 8, 0.4)',
                              fontWeight: 800,
                              fontSize: 11,
                              padding: '4px 8px',
                              gap: 4,
                            }}
                            title="Promote User to VIP Prime"
                          >
                            <Crown style={{ width: 12, height: 12 }} />
                            <span>Promote</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onUpdateUser({ ...u, accountTier: 'Free', vipExpiryDate: undefined, isVipLocked: false })}
                            className="btn btn-xs"
                            style={{
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#10b981',
                              border: '1px solid rgba(16, 185, 129, 0.4)',
                              fontWeight: 800,
                              fontSize: 11,
                              padding: '4px 8px',
                              gap: 4,
                            }}
                            title="Demote User to Free Tier"
                          >
                            <Zap style={{ width: 12, height: 12 }} />
                            <span>Demote</span>
                          </button>
                        )}

                        {/* Ban / Unban Button */}
                        {u.isBanned ? (
                          <button
                            onClick={() => onUpdateUser({ ...u, isBanned: false })}
                            className="btn btn-xs"
                            style={{
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#10b981',
                              border: '1px solid rgba(16, 185, 129, 0.5)',
                              fontWeight: 800,
                              fontSize: 11,
                              padding: '4px 8px',
                              gap: 4,
                            }}
                            title="Unban User"
                          >
                            <UserCheck style={{ width: 12, height: 12 }} />
                            <span>Unban</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to BAN ${u.name} (${u.email})?`)) {
                                onUpdateUser({ ...u, isBanned: true });
                              }
                            }}
                            className="btn btn-xs"
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              fontWeight: 800,
                              fontSize: 11,
                              padding: '4px 8px',
                              gap: 4,
                            }}
                            title="Ban User Account"
                          >
                            <UserX style={{ width: 12, height: 12 }} />
                            <span>Ban</span>
                          </button>
                        )}

                        {/* Delete User */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete user account ${u.name}?`)) {
                              onDeleteUser(u.id);
                            }
                          }}
                          className="btn btn-xs btn-ghost"
                          style={{ color: '#ef4444', padding: '4px 6px' }}
                          title="Delete User"
                        >
                          <Trash2 style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)', fontSize: 13 }}>
                  No registered users match your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
