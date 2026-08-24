import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, X, KeyRound, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (enteredPin?: string) => void;
  currentPin: string;
}

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

  useEffect(() => {
    if (isOpen) {
      setPinInput('');
      setErrorMsg('');
      setShowPin(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === currentPin) {
      setErrorMsg('');
      onSuccess(pinInput.trim());
      onClose();
    } else {
      setErrorMsg('Access Denied: Invalid Security Key / PIN');
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
                background: 'rgba(229, 9, 20, 0.12)',
                border: '1px solid rgba(229, 9, 20, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                color: '#E50914',
              }}
            >
              <Lock style={{ width: 26, height: 26 }} />
            </div>
            <h4 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>
              Protected Admin CMS Area
            </h4>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              Only authorized administrators can manage platform cards, diagnostic links, and configuration tokens.
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
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter secret PIN"
                className="form-input"
                style={{
                  paddingRight: 40,
                  fontSize: 14,
                  fontWeight: 700,
                  borderColor: errorMsg ? '#ef4444' : undefined,
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

          <button
            type="submit"
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
            }}
          >
            <KeyRound style={{ width: 16, height: 16 }} />
            <span>AUTHENTICATE & ENTER ADMIN CMS</span>
          </button>
        </form>
      </div>
    </div>
  );
};
