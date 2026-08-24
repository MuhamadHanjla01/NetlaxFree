import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, X, KeyRound, AlertCircle, Clock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (enteredPin?: string) => void;
  currentPin: string;
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;

export const AdminLoginModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  currentPin,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Brute-force protection state
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const lockoutTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPinInput('');
      setErrorMsg('');
      setShowPin(false);
    }
  }, [isOpen]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutUntil && lockoutUntil > Date.now()) {
      const tick = () => {
        const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
        setLockoutRemaining(remaining);
        if (remaining <= 0) {
          setLockoutUntil(null);
          setLockoutRemaining(0);
          setFailedAttempts(0);
          setErrorMsg('');
          if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current);
        }
      };
      tick();
      lockoutTimerRef.current = setInterval(tick, 1000);
      return () => { if (lockoutTimerRef.current) clearInterval(lockoutTimerRef.current); };
    }
  }, [lockoutUntil]);

  if (!isOpen) return null;

  const isLockedOut = lockoutUntil !== null && lockoutUntil > Date.now();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLockedOut) return;

    if (pinInput.trim() === currentPin) {
      setErrorMsg('');
      setFailedAttempts(0);
      setLockoutUntil(null);
      onSuccess(pinInput.trim());
      onClose();
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_SECONDS * 1000;
        setLockoutUntil(until);
        setErrorMsg(`🔒 Too many failed attempts. Locked for ${LOCKOUT_SECONDS}s.`);
      } else {
        setErrorMsg(`Access Denied: Invalid PIN (${MAX_ATTEMPTS - newAttempts} attempts remaining)`);
      }

      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className={`modal-container ${isShaking ? 'animate-shake' : ''}`}
        style={{
          maxWidth: 440,
          background: '#040d12',
          border: '1px solid rgba(229, 9, 20, 0.4)',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(229, 9, 20, 0.2)',
          color: '#ffffff',
        }}
      >
        {/* Header */}
        <div
          className="modal-header"
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(229, 9, 20, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck style={{ width: 20, height: 20, color: '#E50914' }} />
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#ffffff' }}>
              Admin Panel Authentication
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-ghost" style={{ padding: 4 }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="modal-body" style={{ padding: 24 }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: isLockedOut ? 'rgba(239, 68, 68, 0.12)' : 'rgba(229, 9, 20, 0.12)',
                border: `1px solid ${isLockedOut ? 'rgba(239, 68, 68, 0.3)' : 'rgba(229, 9, 20, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                color: isLockedOut ? '#ef4444' : '#E50914',
                transition: 'all 0.3s ease',
              }}
            >
              {isLockedOut ? <Clock style={{ width: 26, height: 26 }} /> : <Lock style={{ width: 26, height: 26 }} />}
            </div>
            <h4 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>
              {isLockedOut ? 'Access Temporarily Locked' : 'Protected Admin CMS Area'}
            </h4>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              {isLockedOut
                ? `Too many failed attempts. Please wait ${lockoutRemaining}s before trying again.`
                : 'Only authorized administrators can manage platform cards, diagnostic links, and configuration tokens.'}
            </p>
          </div>

          {errorMsg && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                fontSize: 12,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16,
              }}
            >
              <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: '#94a3b8' }}>
              ENTER ADMIN SECURITY PIN / PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPin ? 'text' : 'password'}
                required
                autoFocus
                disabled={isLockedOut}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder={isLockedOut ? `Locked for ${lockoutRemaining}s...` : 'Enter secret PIN'}
                className="form-input"
                style={{
                  paddingRight: 40,
                  fontSize: 14,
                  fontWeight: 700,
                  borderColor: errorMsg ? '#ef4444' : undefined,
                  opacity: isLockedOut ? 0.5 : 1,
                  cursor: isLockedOut ? 'not-allowed' : undefined,
                }}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                {showPin ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
              </button>
            </div>
          </div>

          {/* Attempt counter indicator */}
          {failedAttempts > 0 && !isLockedOut && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              marginBottom: 12,
            }}>
              {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: i < failedAttempts ? '#ef4444' : 'rgba(255,255,255,0.15)',
                    transition: 'background 0.3s ease',
                  }}
                />
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={isLockedOut}
            className="btn btn-red"
            style={{
              width: '100%',
              padding: '12px 18px',
              fontSize: 13,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              borderRadius: 8,
              opacity: isLockedOut ? 0.4 : 1,
              cursor: isLockedOut ? 'not-allowed' : 'pointer',
            }}
          >
            <KeyRound style={{ width: 16, height: 16 }} />
            <span>{isLockedOut ? `LOCKED (${lockoutRemaining}s)` : 'AUTHENTICATE & ENTER ADMIN CMS'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
