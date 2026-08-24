import React, { useState } from 'react';
import type { UserAccount } from '../types/blog';
import { X, User, Lock, Mail, Check, LogIn, UserPlus } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  registeredUsers: UserAccount[];
  onRegisterUser: (newUser: UserAccount) => void;
}

export const UserAuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  registeredUsers,
  onRegisterUser,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const accountTier: 'Free' | 'Prime' = 'Free';
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    // Find registered user or allow instant login
    const found = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (found) {
      if (found.isBanned) {
        setErrorMsg('🚫 Your account has been banned by the Administrator.');
        return;
      }
      if (found.password !== password) {
        setErrorMsg('Invalid password. Please try again.');
        return;
      }
      onLoginSuccess(found);
      onClose();
    } else {
      // Auto-create account for seamless user onboarding
      const newUser: UserAccount = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0] || 'User',
        email: email.trim(),
        password: password,
        accountTier: accountTier,
        createdAt: new Date().toISOString(),
      };
      
      fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      }).catch(() => {});

      onRegisterUser(newUser);
      onLoginSuccess(newUser);
      onClose();
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const existing = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existing) {
      if (existing.isBanned) {
        setErrorMsg('🚫 This email account is banned by the Administrator.');
        return;
      }
      setErrorMsg('An account with this email already exists. Please log in.');
      return;
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      password: password,
      accountTier: accountTier,
      createdAt: new Date().toISOString(),
    };

    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    }).catch(() => {});

    onRegisterUser(newUser);
    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container" style={{ maxWidth: 440, padding: 0, overflow: 'hidden' }}>
        
        {/* Modal Top Banner */}
        <div style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.25) 0%, rgba(4, 13, 18, 0.95) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#E50914',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(229, 9, 20, 0.5)',
            }}>
              <User style={{ width: 20, height: 20, color: '#ffffff' }} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', margin: 0 }}>
                {mode === 'login' ? 'User Portal Sign In' : 'Create User Account'}
              </h2>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '2px 0 0 0' }}>
                {mode === 'login' ? 'Access streaming accounts & cookies' : 'Join our streaming community'}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-sm btn-ghost" style={{ padding: 6 }}>
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: '#040d12',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: 6,
          gap: 6,
        }}>
          <button
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            style={{
              padding: '10px 0',
              borderRadius: 8,
              background: mode === 'login' ? 'rgba(229, 9, 20, 0.2)' : 'transparent',
              border: mode === 'login' ? '1px solid #E50914' : '1px solid transparent',
              color: mode === 'login' ? '#ffffff' : 'var(--text-tertiary)',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 0.2s ease',
            }}
          >
            <LogIn style={{ width: 14, height: 14 }} />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => { setMode('signup'); setErrorMsg(''); }}
            style={{
              padding: '10px 0',
              borderRadius: 8,
              background: mode === 'signup' ? 'rgba(229, 9, 20, 0.2)' : 'transparent',
              border: mode === 'signup' ? '1px solid #E50914' : '1px solid transparent',
              color: mode === 'signup' ? '#ffffff' : 'var(--text-tertiary)',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 0.2s ease',
            }}
          >
            <UserPlus style={{ width: 14, height: 14 }} />
            <span>Create Account</span>
          </button>
        </div>

        {/* Modal Form */}
        <div style={{ padding: 24 }}>
          {errorMsg && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 16,
            }}>
              {errorMsg}
            </div>
          )}

          {mode === 'login' ? (
            /* SIGN IN FORM */
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)' }}>
                  EMAIL ADDRESS *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: 12, top: 12, width: 16, height: 16, color: 'var(--text-tertiary)' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="form-input"
                    style={{ paddingLeft: 38 }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)' }}>
                  PASSWORD *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: 12, top: 12, width: 16, height: 16, color: 'var(--text-tertiary)' }} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-input"
                    style={{ paddingLeft: 38 }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-md btn-red"
                style={{ width: '100%', marginTop: 8, padding: 12, fontSize: 13, fontWeight: 800, justifyContent: 'center' }}
              >
                <LogIn style={{ width: 16, height: 16 }} />
                <span>Sign In to Account</span>
              </button>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)' }}>
                  FULL NAME *
                </label>
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: 12, top: 12, width: 16, height: 16, color: 'var(--text-tertiary)' }} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="form-input"
                    style={{ paddingLeft: 38 }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)' }}>
                  EMAIL ADDRESS *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: 12, top: 12, width: 16, height: 16, color: 'var(--text-tertiary)' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="form-input"
                    style={{ paddingLeft: 38 }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)' }}>
                  PASSWORD *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: 12, top: 12, width: 16, height: 16, color: 'var(--text-tertiary)' }} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-input"
                    style={{ paddingLeft: 38 }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-md btn-red"
                style={{ width: '100%', marginTop: 8, padding: 12, fontSize: 13, fontWeight: 800, justifyContent: 'center' }}
              >
                <Check style={{ width: 16, height: 16 }} />
                <span>Register & Start Streaming</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
