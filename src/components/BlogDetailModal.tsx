import React, { useEffect, useState } from 'react';
import type { BlogPost } from '../types/blog';
import {
  X,
  Share2,
  Bookmark,
  Check,
  ArrowLeft,
  Shield,
  CheckCircle,
  Mail,
  Crown,
  Globe,
  CreditCard,
  Calendar,
  HelpCircle,
  Phone,
  User,
  Copy,
  Terminal,
  ExternalLink,
} from 'lucide-react';

interface Props {
  post: BlogPost | null;
  onClose: () => void;
  onLikePost?: (id: string) => void;
  allPosts?: BlogPost[];
  onSelectPost?: (post: BlogPost) => void;
}

export const BlogDetailModal: React.FC<Props> = ({
  post,
  onClose,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!post) return null;

  // Values from post or fallback defaults matching the screenshot format
  const accountEmail = post.accountEmail || 'jayasekar04@gmail.com';
  const planTier = post.planTier || 'BASIC';
  const countryCode = post.countryCode || 'IN';
  const paymentMethod = post.paymentMethod || 'UPI';
  const nextBillingCycle = post.nextBillingCycle || '2026-09-10';
  const memberSince = post.memberSince || 'August 2024';
  const phoneConnection = post.phoneConnection || '-';
  const profileSubsystem = post.profileSubsystem || ['jayasekar04'];
  const pcLink = post.pcLink || 'https://netflix.com/?nftoken=BgiQvuvcAxLCAQMOixN0dTiddNkrFtM4H/Du0JcTdpa7Z1z4X';
  const mobileLink = post.mobileLink || 'https://netflix.com/unsupported?nftoken=BgiQvuvcAxLCAQMOixN0dTiddNkrFtM4H/Du0J';
  const tvLink = post.tvLink || 'https://netflix.com/tv2?nftoken=BgiQvuvcAxLCAQMOixN0dTiddNkrFtM4H/Du0JcTdpa7Z1';
  const netscapeConfig = post.netscapeConfig || '# Netscape HTTP Cookie File\n# http://curl.haxx.se/rfc/cookie_spec.html\n.netflix.com\tTRUE\t/\tFALSE\t1787494000\tSecure\tValue';

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="modal-container"
        style={{
          maxWidth: 780,
          background: '#040d12',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(16, 185, 129, 0.1)',
          color: '#e2e8f0',
          fontFamily: "'Fira Code', 'Cascadia Code', 'Segoe UI', monospace",
        }}
      >
        {/* Top Header Bar */}
        <div
          className="modal-header"
          style={{
            background: 'rgba(4, 13, 18, 0.95)',
            borderBottom: '1px solid rgba(16, 185, 129, 0.15)',
          }}
        >
          <button onClick={onClose} className="btn btn-sm btn-ghost" style={{ color: '#94a3b8' }}>
            <ArrowLeft style={{ width: 15, height: 15 }} />
            <span>Back</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`btn btn-sm ${isBookmarked ? 'btn-red' : 'btn-ghost'}`}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark'}
            >
              <Bookmark style={{ width: 14, height: 14 }} />
            </button>
            <button
              onClick={() => copyToClipboard(window.location.href, 'share')}
              className="btn btn-sm btn-ghost"
              style={{ color: '#94a3b8' }}
            >
              {copiedField === 'share' ? <Check style={{ width: 14, height: 14, color: '#10b981' }} /> : <Share2 style={{ width: 14, height: 14 }} />}
              <span>{copiedField === 'share' ? 'Copied!' : 'Share'}</span>
            </button>
            <button onClick={onClose} className="btn btn-sm btn-ghost" style={{ color: '#94a3b8' }}>
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>

        {/* Body Container matching Screenshot */}
        <div className="modal-body" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* 1. ANALYSIS REPORT HEADER */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                }}
              >
                <Shield style={{ width: 22, height: 22 }} />
              </div>

              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#ffffff', letterSpacing: '0.05em' }}>
                  ANALYSIS REPORT
                </h2>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.12em' }}>
                  DIAGNOSTICS RESULTS
                </span>
              </div>
            </div>

            {/* ALIVE Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 999,
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#10b981',
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.1em',
              }}
            >
              <CheckCircle style={{ width: 14, height: 14 }} />
              <span>ALIVE</span>
            </div>
          </div>

          {/* 2. DIAGNOSTICS INFO GRID */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 12,
              marginTop: 6,
            }}
          >
            {/* Account Email */}
            <div className="report-card">
              <div className="report-card-icon green">
                <Mail style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <span className="report-card-label">ACCOUNT EMAIL</span>
                <div className="report-card-value green">{accountEmail}</div>
              </div>
            </div>

            {/* Plan / Tier */}
            <div className="report-card">
              <div className="report-card-icon red">
                <Crown style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <span className="report-card-label">PLAN / TIER</span>
                <div className="report-card-value red">{planTier}</div>
              </div>
            </div>

            {/* Country Code */}
            <div className="report-card">
              <div className="report-card-icon cyan">
                <Globe style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <span className="report-card-label">COUNTRY CODE</span>
                <div className="report-card-value cyan">{countryCode}</div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="report-card">
              <div className="report-card-icon amber">
                <CreditCard style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <span className="report-card-label">PAYMENT METHOD</span>
                <div className="report-card-value amber">{paymentMethod}</div>
              </div>
            </div>

            {/* Next Billing Cycle */}
            <div className="report-card">
              <div className="report-card-icon yellow">
                <Calendar style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <span className="report-card-label">NEXT BILLING CYCLE</span>
                <div className="report-card-value yellow">{nextBillingCycle}</div>
              </div>
            </div>

            {/* Member Since */}
            <div className="report-card">
              <div className="report-card-icon purple">
                <HelpCircle style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <span className="report-card-label">MEMBER SINCE</span>
                <div className="report-card-value purple">{memberSince}</div>
              </div>
            </div>

            {/* Phone Connection */}
            <div className="report-card" style={{ gridColumn: '1 / -1' }}>
              <div className="report-card-icon pink">
                <Phone style={{ width: 18, height: 18 }} />
              </div>
              <div>
                <span className="report-card-label">PHONE CONNECTION</span>
                <div className="report-card-value pink">{phoneConnection}</div>
              </div>
            </div>
          </div>

          {/* 3. PROFILE SUB-SYSTEM BOX */}
          <div
            style={{
              padding: 18,
              borderRadius: 12,
              background: '#07151e',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: '#94a3b8' }}>
                <User style={{ width: 15, height: 15, color: '#10b981' }} />
                <span>PROFILE SUB-SYSTEM</span>
              </div>

              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  padding: '2px 8px',
                  borderRadius: 4,
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                {profileSubsystem.length} ACTIVE
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {profileSubsystem.map((profile, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    borderRadius: 8,
                    background: '#0d2232',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  <User style={{ width: 14, height: 14 }} />
                  <span>{profile}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. COOKIE SECTION OR DIRECT AUTHENTICATION LINKAGES */}
          {(post.cardFormat === 'cookie' || (post.service === 'Prime Video' && post.cardFormat !== 'links')) ? (
            /* COOKIE SECTION FORMAT */
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 900, letterSpacing: '0.08em', color: '#00A8E1' }}>
                <Terminal style={{ width: 16, height: 16 }} />
                <span>PRIME VIDEO COOKIE SECTION & NETSCAPE DATA</span>
              </div>

              {/* Cookie Box */}
              <div style={{
                padding: 14,
                borderRadius: 10,
                background: '#040d12',
                border: '1px solid rgba(0, 168, 225, 0.3)',
                fontFamily: 'monospace',
                fontSize: 12,
                color: '#38bdf8',
                maxHeight: 140,
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                lineHeight: 1.5,
              }}>
                {netscapeConfig}
              </div>

              {/* Copy Netscape Cookie Button */}
              <button
                onClick={() => copyToClipboard(netscapeConfig, 'netscape')}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: 10,
                  background: 'rgba(0, 168, 225, 0.12)',
                  border: '1px dashed rgba(0, 168, 225, 0.5)',
                  color: '#00A8E1',
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {copiedField === 'netscape' ? (
                  <>
                    <Check style={{ width: 16, height: 16, color: '#10b981' }} />
                    <span style={{ color: '#10b981' }}>NETSCAPE COOKIE DATA COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy style={{ width: 16, height: 16 }} />
                    <span>COPY NETSCAPE COOKIE DATA</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* NETFLIX DIRECT LINKAGES FORMAT */
            <>
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 900, letterSpacing: '0.08em', color: '#ffffff' }}>
                  <span style={{ color: '#ef4444' }}>&gt;_</span>
                  <span>DIRECT AUTHENTICATION LINKAGES</span>
                </div>

                {/* PC LINK */}
                <div className="linkage-row">
                  <button
                    onClick={() => window.open(pcLink, '_blank', 'noopener,noreferrer')}
                    className="linkage-tag pc"
                    title="Redirect to PC Link"
                    style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <span>PC LINK</span>
                    <ExternalLink style={{ width: 11, height: 11 }} />
                  </button>
                  <input type="text" readOnly value={pcLink} className="linkage-input" />
                  <button
                    onClick={() => window.open(pcLink, '_blank', 'noopener,noreferrer')}
                    className="linkage-copy-btn"
                    title="Redirect to PC Link"
                    style={{ color: '#ef4444' }}
                  >
                    <ExternalLink style={{ width: 14, height: 14 }} />
                  </button>
                  <button
                    onClick={() => copyToClipboard(pcLink, 'pcLink')}
                    className="linkage-copy-btn"
                    title="Copy PC Link"
                  >
                    {copiedField === 'pcLink' ? <Check style={{ width: 14, height: 14, color: '#10b981' }} /> : <Copy style={{ width: 14, height: 14 }} />}
                  </button>
                </div>

                {/* MOBILE LINK */}
                <div className="linkage-row">
                  <button
                    onClick={() => window.open(mobileLink, '_blank', 'noopener,noreferrer')}
                    className="linkage-tag mobile"
                    title="Redirect to Mobile Link"
                    style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <span>MOBILE</span>
                    <ExternalLink style={{ width: 11, height: 11 }} />
                  </button>
                  <input type="text" readOnly value={mobileLink} className="linkage-input" />
                  <button
                    onClick={() => window.open(mobileLink, '_blank', 'noopener,noreferrer')}
                    className="linkage-copy-btn"
                    title="Redirect to Mobile Link"
                    style={{ color: '#a855f7' }}
                  >
                    <ExternalLink style={{ width: 14, height: 14 }} />
                  </button>
                  <button
                    onClick={() => copyToClipboard(mobileLink, 'mobileLink')}
                    className="linkage-copy-btn"
                    title="Copy Mobile Link"
                  >
                    {copiedField === 'mobileLink' ? <Check style={{ width: 14, height: 14, color: '#10b981' }} /> : <Copy style={{ width: 14, height: 14 }} />}
                  </button>
                </div>

                {/* TV LINK */}
                <div className="linkage-row">
                  <button
                    onClick={() => window.open(tvLink, '_blank', 'noopener,noreferrer')}
                    className="linkage-tag tv"
                    title="Redirect to TV Link"
                    style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <span>TV LINK</span>
                    <ExternalLink style={{ width: 11, height: 11 }} />
                  </button>
                  <input type="text" readOnly value={tvLink} className="linkage-input" />
                  <button
                    onClick={() => window.open(tvLink, '_blank', 'noopener,noreferrer')}
                    className="linkage-copy-btn"
                    title="Redirect to TV Link"
                    style={{ color: '#06b6d4' }}
                  >
                    <ExternalLink style={{ width: 14, height: 14 }} />
                  </button>
                  <button
                    onClick={() => copyToClipboard(tvLink, 'tvLink')}
                    className="linkage-copy-btn"
                    title="Copy TV Link"
                  >
                    {copiedField === 'tvLink' ? <Check style={{ width: 14, height: 14, color: '#10b981' }} /> : <Copy style={{ width: 14, height: 14 }} />}
                  </button>
                </div>
              </div>

              {/* COPY NETSCAPE CONFIGURATION BUTTON */}
              <button
                onClick={() => copyToClipboard(netscapeConfig, 'netscape')}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: 10,
                  background: '#07151e',
                  border: '1px dashed rgba(16, 185, 129, 0.4)',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginTop: 8,
                }}
                className="netscape-btn"
              >
                {copiedField === 'netscape' ? (
                  <>
                    <Check style={{ width: 16, height: 16, color: '#10b981' }} />
                    <span style={{ color: '#10b981' }}>NETSCAPE CONFIGURATION COPIED!</span>
                  </>
                ) : (
                  <>
                    <Terminal style={{ width: 16, height: 16 }} />
                    <span>COPY NETSCAPE CONFIGURATION</span>
                  </>
                )}
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
