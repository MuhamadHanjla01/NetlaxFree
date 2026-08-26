import React, { useState, useEffect } from 'react';
import type { BlogPost, StreamingService } from '../types/blog';
import { X, Sparkles, Check, Tv, Shield, Trash2, Terminal, Copy, Link, Crown, Zap } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: BlogPost) => void;
  onDelete?: (id: string) => void;
  editingPost?: BlogPost | null;
  defaultService?: string;
}

const SERVICES: Exclude<StreamingService, 'All Services'>[] = [
  'Netflix',
  'Prime Video',
  'Disney+ Hotstar',
  'JioStar',
  'Apple TV+',
  'HBO Max',
  'SonyLIV',
];

export const BlogEditorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingPost,
  defaultService,
}) => {
  const [title, setTitle] = useState('');
  const [service, setService] = useState<Exclude<StreamingService, 'All Services'>>('Netflix');
  const [cardFormat, setCardFormat] = useState<'links' | 'cookie'>('links');
  const [accountType, setAccountType] = useState<'Prime' | 'Free'>('Prime');

  // Diagnostics & Account Credentials
  const [accountEmail, setAccountEmail] = useState('jayasekar04@gmail.com');
  const [planTier, setPlanTier] = useState('BASIC');
  const [countryCode, setCountryCode] = useState('IN');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [nextBillingCycle, setNextBillingCycle] = useState('2026-09-10');
  const [memberSince, setMemberSince] = useState('August 2024');
  const [expiryDays, setExpiryDays] = useState<number | ''>('');

  // Direct Links
  const [pcLink, setPcLink] = useState('https://netflix.com/?nftoken=BgiQvuvcAxLCAQMOixN0dTiddNkrFtM4H/Du0JcTdpa7Z1z4X');
  const [mobileLink, setMobileLink] = useState('https://netflix.com/unsupported?nftoken=BgiQvuvcAxLCAQMOixN0dTiddNkrFtM4H/Du0J');
  const [tvLink, setTvLink] = useState('https://netflix.com/tv2?nftoken=BgiQvuvcAxLCAQMOixN0dTiddNkrFtM4H/Du0JcTdpa7Z1');

  // Cookie Section (Netscape Data)
  const [netscapeConfig, setNetscapeConfig] = useState(
    '# Netscape HTTP Cookie File\n# http://curl.haxx.se/rfc/cookie_spec.html\n.primevideo.com\tTRUE\t/\tFALSE\t1787494000\tat-main\tAtza|IwEB...'
  );

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setService(editingPost.service || 'Netflix');
      setCardFormat(editingPost.cardFormat || (editingPost.service === 'Prime Video' ? 'cookie' : 'links'));
      setAccountType(editingPost.accountType || 'Prime');
      setAccountEmail(editingPost.accountEmail || 'jayasekar04@gmail.com');
      setPlanTier(editingPost.planTier || (editingPost.service === 'Prime Video' ? 'PRIME 4K UHD' : 'BASIC'));
      setCountryCode(editingPost.countryCode || 'IN');
      setPaymentMethod(editingPost.paymentMethod || 'UPI');
      setNextBillingCycle(editingPost.nextBillingCycle || '2026-09-10');
      setMemberSince(editingPost.memberSince || 'August 2024');
      setPcLink(editingPost.pcLink || 'https://netflix.com/?nftoken=BgiQvuvcAxLCAQMOixN0dTiddNkrFtM4H/Du0JcTdpa7Z1z4X');
      setMobileLink(editingPost.mobileLink || 'https://netflix.com/unsupported?nftoken=BgiQvuvcAxLCAQMOixN0dTiddNkrFtM4H/Du0J');
      setTvLink(editingPost.tvLink || 'https://netflix.com/tv2?nftoken=BgiQvuvcAxLCAQMOixN0dTiddNkrFtM4H/Du0JcTdpa7Z1');
      setExpiryDays(editingPost.expiryDays || '');
      setNetscapeConfig(
        editingPost.netscapeConfig ||
        '# Netscape HTTP Cookie File\n# http://curl.haxx.se/rfc/cookie_spec.html\n.primevideo.com\tTRUE\t/\tFALSE\t1787494000\tat-main\tAtza|IwEB...'
      );
    } else {
      // Reset form according to platform
      const targetSrv = (defaultService && SERVICES.includes(defaultService as any)) ? (defaultService as any) : 'Netflix';
      setTitle('');
      setService(targetSrv);
      setCardFormat(targetSrv === 'Prime Video' ? 'cookie' : 'links');
      setAccountType('Prime');
      setAccountEmail('jayasekar04@gmail.com');
      setPlanTier(targetSrv === 'Prime Video' ? 'PRIME 4K UHD' : 'BASIC');
      setCountryCode('IN');
      setPaymentMethod('UPI');
      setNextBillingCycle('2026-09-10');
      setMemberSince('August 2024');
      setPcLink(`https://${targetSrv.toLowerCase().replace(/[^a-z0-0]/g, '')}.com/?nftoken=BgiQvuvcAxLCAQMOixN0dTiddNkrFtM4H`);
      setMobileLink(`https://mobile.${targetSrv.toLowerCase().replace(/[^a-z0-0]/g, '')}.com/auth`);
      setTvLink(`https://tv.${targetSrv.toLowerCase().replace(/[^a-z0-0]/g, '')}.com/code`);
      setExpiryDays('');
      setNetscapeConfig(
        targetSrv === 'Prime Video'
          ? '# Netscape HTTP Cookie File\n# http://curl.haxx.se/rfc/cookie_spec.html\n.primevideo.com\tTRUE\t/\tFALSE\t1787494000\tat-main\tAtza|IwEB...'
          : '# Netscape HTTP Cookie File\n# http://curl.haxx.se/rfc/cookie_spec.html\n.netflix.com\tTRUE\t/\tFALSE\t1787494000\tSecure\tValue'
      );
    }
  }, [editingPost, isOpen, defaultService]);

  // Body scroll lock is managed globally by App.tsx — no duplicate needed here

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const savedPost: BlogPost = {
      id: editingPost ? editingPost.id : `post-${Date.now()}`,
      title: title.trim(),
      subtitle: `${service} ${accountType} Account`,
      service,
      category: 'How to Use & Setup',
      author: 'Admin Editor',
      authorRole: 'Editor',
      date: editingPost ? editingPost.date : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: '2 min read',
      coverImage: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1200&q=80',
      excerpt: `Account details for ${accountEmail} (${planTier} tier).`,
      content: `Setup and authentication details for ${service} account.`,
      ctaButtons: [],
      tags: [service, accountType, 'Account', 'Setup'],
      isFeatured: editingPost ? editingPost.isFeatured : false,
      likesCount: editingPost ? editingPost.likesCount : 0,
      viewsCount: editingPost ? editingPost.viewsCount : 0,
      status: 'published',
      createdAt: editingPost ? editingPost.createdAt : new Date().toISOString(),
      accountEmail,
      planTier,
      countryCode,
      paymentMethod,
      nextBillingCycle,
      memberSince,
      pcLink,
      mobileLink,
      tvLink,
      netscapeConfig,
      cardFormat,
      accountType,
      expiryDays: expiryDays ? Number(expiryDays) : undefined,
    };

    onSave(savedPost);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container" style={{ maxWidth: 640 }}>

        {/* Header */}

        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles style={{ width: 18, height: 18, color: '#E50914' }} />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>
              {editingPost ? `Edit ${service} Card` : `Create New ${service} Card`}
            </h2>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Form Body */}
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="editor-form">

            {/* Account Title & Streaming Platform */}
            <div className="form-grid-2">
              <div className="form-group">
                <label>Account Title / Card Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Netflix / Prime Video 4K Account"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Tv style={{ width: 13, height: 13, color: '#E50914' }} />
                  <span>Streaming Platform *</span>
                </label>
                <select
                  value={service}
                  onChange={(e) => {
                    const newSrv = e.target.value as any;
                    setService(newSrv);
                    if (newSrv === 'Prime Video') {
                      setCardFormat('cookie');
                    }
                  }}
                  className="form-select"
                  style={{ borderColor: 'rgba(229,9,20,0.5)', fontWeight: 700 }}
                >
                  {SERVICES.map((srv) => (
                    <option key={srv} value={srv}>{srv}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ACCOUNT ACCESS TIER MENU: Prime vs Free */}
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: '#ffffff', marginBottom: 8, display: 'block' }}>
                ACCOUNT ACCESS TIER (FREE VS PRIME MENU) *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setAccountType('Prime')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: accountType === 'Prime' ? 'rgba(234, 179, 8, 0.2)' : '#040d12',
                    border: accountType === 'Prime' ? '1px solid #eab308' : '1px solid rgba(255,255,255,0.15)',
                    color: accountType === 'Prime' ? '#ffffff' : 'var(--text-tertiary)',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Crown style={{ width: 15, height: 15, color: accountType === 'Prime' ? '#eab308' : 'currentColor' }} />
                  <span>Prime Account (VIP Access)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('Free')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: accountType === 'Free' ? 'rgba(16, 185, 129, 0.2)' : '#040d12',
                    border: accountType === 'Free' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.15)',
                    color: accountType === 'Free' ? '#ffffff' : 'var(--text-tertiary)',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Zap style={{ width: 15, height: 15, color: accountType === 'Free' ? '#10b981' : 'currentColor' }} />
                  <span>Free Account (Public Access)</span>
                </button>
              </div>
            </div>

            {/* FORMAT MODE SELECTOR: Direct Links vs Cookie Format */}
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: '#ffffff', marginBottom: 8, display: 'block' }}>
                CARD AUTHENTICATION FORMAT MODE *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setCardFormat('links')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: cardFormat === 'links' ? 'rgba(239, 68, 68, 0.2)' : '#040d12',
                    border: cardFormat === 'links' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.15)',
                    color: cardFormat === 'links' ? '#ffffff' : 'var(--text-tertiary)',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Link style={{ width: 15, height: 15, color: cardFormat === 'links' ? '#ef4444' : 'currentColor' }} />
                  <span>Direct Links Format</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCardFormat('cookie')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: cardFormat === 'cookie' ? 'rgba(0, 168, 225, 0.2)' : '#040d12',
                    border: cardFormat === 'cookie' ? '1px solid #00A8E1' : '1px solid rgba(255,255,255,0.15)',
                    color: cardFormat === 'cookie' ? '#ffffff' : 'var(--text-tertiary)',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Terminal style={{ width: 15, height: 15, color: cardFormat === 'cookie' ? '#00A8E1' : 'currentColor' }} />
                  <span>Cookie Data Format</span>
                </button>
              </div>
            </div>

            {/* DIAGNOSTICS & CREDENTIALS SECTION */}
            <div style={{
              padding: 18,
              borderRadius: 14,
              background: '#040d12',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              marginBottom: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Shield style={{ width: 18, height: 18, color: '#10b981' }} />
                  <h3 style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', letterSpacing: '0.05em', margin: 0 }}>
                    {service.toUpperCase()} ACCOUNT DIAGNOSTICS & TIER
                  </h3>
                </div>
                <span style={{ fontSize: 10, fontWeight: 900, color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: 999 }}>
                  ALIVE
                </span>
              </div>

              <div className="form-grid-2">
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: 10, color: '#10b981', fontWeight: 800 }}>ACCOUNT EMAIL</label>
                  <input
                    type="email"
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                    placeholder="jayasekar04@gmail.com"
                    className="form-input"
                    style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981', fontWeight: 700, fontFamily: 'monospace' }}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: 10, color: '#ef4444', fontWeight: 800 }}>PLAN / TIER</label>
                  <input
                    type="text"
                    value={planTier}
                    onChange={(e) => setPlanTier(e.target.value)}
                    placeholder={accountType === 'Prime' ? 'PRIME 4K UHD' : 'FREE ACCESS'}
                    className="form-input"
                    style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444', fontWeight: 700, fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: 10, color: '#06b6d4', fontWeight: 800 }}>COUNTRY CODE</label>
                  <input
                    type="text"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    placeholder="IN"
                    className="form-input"
                    style={{ borderColor: 'rgba(6, 182, 212, 0.3)', color: '#06b6d4', fontWeight: 700, fontFamily: 'monospace' }}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: 10, color: '#f59e0b', fontWeight: 800 }}>PAYMENT METHOD</label>
                  <input
                    type="text"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    placeholder="UPI"
                    className="form-input"
                    style={{ borderColor: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b', fontWeight: 700, fontFamily: 'monospace' }}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: 10, color: '#eab308', fontWeight: 800 }}>NEXT BILLING CYCLE</label>
                  <input
                    type="text"
                    value={nextBillingCycle}
                    onChange={(e) => setNextBillingCycle(e.target.value)}
                    placeholder="2026-09-10"
                    className="form-input"
                    style={{ borderColor: 'rgba(234, 179, 8, 0.3)', color: '#eab308', fontWeight: 700, fontFamily: 'monospace' }}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: 10, color: '#ef4444', fontWeight: 800 }}>AUTO DELETE AFTER (DAYS)</label>
                  <input
                    type="number"
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 7"
                    className="form-input"
                    min="1"
                    style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444', fontWeight: 700, fontFamily: 'monospace' }}
                  />
                </div>
              </div>
            </div>

            {/* DYNAMIC CONTENT: COOKIE FORMAT VS DIRECT LINKS FORMAT */}
            {cardFormat === 'cookie' ? (
              /* COOKIE DATA FORMAT */
              <div style={{
                padding: 18,
                borderRadius: 14,
                background: '#040d12',
                border: '1px solid rgba(0, 168, 225, 0.4)',
                marginBottom: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#00A8E1', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Terminal style={{ width: 15, height: 15 }} />
                  <span>COOKIE SECTION (NETSCAPE HTTP COOKIE DATA)</span>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)' }}>
                    Paste Netscape Cookie File Content (Users can copy with 1-click)
                  </label>
                  <textarea
                    rows={6}
                    value={netscapeConfig}
                    onChange={(e) => setNetscapeConfig(e.target.value)}
                    placeholder="# Netscape HTTP Cookie File..."
                    className="form-input"
                    style={{ fontSize: 11, fontFamily: 'monospace', lineHeight: 1.5, borderColor: 'rgba(0, 168, 225, 0.3)' }}
                  />
                </div>

                {/* Copy Button Preview */}
                <div style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: 'rgba(0, 168, 225, 0.1)',
                  border: '1px dashed rgba(0, 168, 225, 0.4)',
                  color: '#00A8E1',
                  fontSize: 11,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}>
                  <Copy style={{ width: 14, height: 14 }} />
                  <span>COPY NETSCAPE COOKIE DATA BUTTON (ENABLED)</span>
                </div>
              </div>
            ) : (
              /* DIRECT AUTHENTICATION LINKAGES FORMAT */
              <div style={{
                padding: 18,
                borderRadius: 14,
                background: '#040d12',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                marginBottom: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#ffffff', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#ef4444' }}>&gt;_</span>
                  <span>DIRECT AUTHENTICATION LINKAGES</span>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: 10, fontWeight: 800, color: '#ef4444' }}>PC LINK TARGET URL</label>
                  <input
                    type="text"
                    value={pcLink}
                    onChange={(e) => setPcLink(e.target.value)}
                    placeholder="https://netflix.com/?nftoken=..."
                    className="form-input"
                    style={{ fontSize: 12, fontFamily: 'monospace' }}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: 10, fontWeight: 800, color: '#a855f7' }}>MOBILE LINK TARGET URL</label>
                  <input
                    type="text"
                    value={mobileLink}
                    onChange={(e) => setMobileLink(e.target.value)}
                    placeholder="https://netflix.com/unsupported?nftoken=..."
                    className="form-input"
                    style={{ fontSize: 12, fontFamily: 'monospace' }}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: 10, fontWeight: 800, color: '#06b6d4' }}>TV LINK TARGET URL</label>
                  <input
                    type="text"
                    value={tvLink}
                    onChange={(e) => setTvLink(e.target.value)}
                    placeholder="https://netflix.com/tv2?nftoken=..."
                    className="form-input"
                    style={{ fontSize: 12, fontFamily: 'monospace' }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="form-actions" style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {editingPost && onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this card permanently?')) {
                      onDelete(editingPost.id);
                      onClose();
                    }
                  }}
                  className="btn btn-md btn-ghost"
                  style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.1)', fontWeight: 800 }}
                >
                  <Trash2 style={{ width: 16, height: 16 }} />
                  <span>Delete Card</span>
                </button>
              ) : <div />}

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={onClose} className="btn btn-md btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="btn btn-md btn-red">
                  <Check style={{ width: 16, height: 16 }} />
                  <span>Save Card</span>
                </button>
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
