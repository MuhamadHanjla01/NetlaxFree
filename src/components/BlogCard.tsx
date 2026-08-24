import React from 'react';
import type { BlogPost } from '../types/blog';
import { Mail, Crown, Zap, Globe, ArrowUpRight, Shield, Edit3, Trash2, Flame } from 'lucide-react';

interface Props {
  post: BlogPost;
  onReadArticle: (post: BlogPost) => void;
  isAdmin?: boolean;
  onEdit?: (post: BlogPost) => void;
  onDelete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
}

const SERVICE_COLORS: Record<string, string> = {
  'Netflix': '#E50914',
  'Prime Video': '#00A8E1',
  'Disney+ Hotstar': '#00D2FF',
  'JioStar': '#FF007F',
  'Apple TV+': '#E5E5E5',
  'HBO Max': '#9933FF',
  'SonyLIV': '#F99F1B',
};

export const BlogCard: React.FC<Props> = ({
  post,
  onReadArticle,
  isAdmin,
  onEdit,
  onDelete,
  onTogglePin,
}) => {
  const serviceColor = SERVICE_COLORS[post.service] || '#E50914';

  const accountEmail = post.accountEmail || 'jayasekar04@gmail.com';
  const countryCode = post.countryCode || 'IN';
  const planTier = post.planTier || 'BASIC';

  return (
    <div
      className="blog-card"
      style={{
        background: '#040d12',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Header inside Card */}
      <div
        style={{
          padding: '12px 16px',
          background: '#07151e',
          borderBottom: '1px solid rgba(16, 185, 129, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: serviceColor, boxShadow: `0 0 8px ${serviceColor}` }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em' }}>
            {post.service}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isAdmin && (
            <span style={{ fontSize: 10, fontWeight: 900, background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '2px 6px', borderRadius: 4 }}>
              ADMIN CMS
            </span>
          )}

          <span
            style={{
              fontSize: 10,
              fontWeight: 900,
              color: post.accountType === 'Free' ? '#10b981' : '#eab308',
              background: post.accountType === 'Free' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
              padding: '2px 8px',
              borderRadius: 4,
              border: post.accountType === 'Free' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {post.accountType === 'Free' ? <Zap style={{ width: 11, height: 11 }} /> : <Crown style={{ width: 11, height: 11 }} />}
            <span>{post.accountType === 'Free' ? 'FREE' : 'PRIME'}</span>
          </span>

          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: '#10b981',
              background: 'rgba(16, 185, 129, 0.12)',
              padding: '2px 8px',
              borderRadius: 4,
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            ALIVE
          </span>
        </div>
      </div>

      {/* Card Body displaying Account Email, Country Code & Plan/Tier */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <h3
          onClick={() => onReadArticle(post)}
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: '#ffffff',
            cursor: 'pointer',
            lineHeight: 1.4,
          }}
        >
          {post.title}
        </h3>

        {/* 3 Key Metrics Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          {/* ACCOUNT EMAIL */}
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              background: '#07151e',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 800, color: '#64748b' }}>
              <Mail style={{ width: 13, height: 13, color: '#10b981' }} />
              <span>ACCOUNT EMAIL</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981', fontFamily: 'monospace' }}>
              {accountEmail}
            </span>
          </div>

          {/* COUNTRY CODE */}
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              background: '#07151e',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 800, color: '#64748b' }}>
              <Globe style={{ width: 13, height: 13, color: '#06b6d4' }} />
              <span>COUNTRY CODE</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#06b6d4', fontFamily: 'monospace' }}>
              {countryCode}
            </span>
          </div>

          {/* PLAN / TIER */}
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              background: '#07151e',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 800, color: '#64748b' }}>
              <Crown style={{ width: 13, height: 13, color: '#ef4444' }} />
              <span>PLAN / TIER</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#ef4444', fontFamily: 'monospace' }}>
              {planTier}
            </span>
          </div>
        </div>

        {/* Read / Open Action Button */}
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <button
            onClick={() => onReadArticle(post)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            className="card-read-btn"
          >
            <Shield style={{ width: 14, height: 14, color: '#10b981' }} />
            <span>Open Analysis</span>
            <ArrowUpRight style={{ width: 14, height: 14 }} />
          </button>

          {/* Admin Quick Action Controls on Card */}
          {isAdmin && (
            <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
              {onTogglePin && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onTogglePin(post.id);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: post.isFeatured ? 'rgba(229, 9, 20, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                    color: post.isFeatured ? '#E50914' : 'var(--text-muted)',
                    border: post.isFeatured ? '1px solid #E50914' : '1px solid rgba(255, 255, 255, 0.15)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title={post.isFeatured ? 'Unpin Card' : 'Pin Card to Top'}
                >
                  <Flame style={{ width: 14, height: 14 }} />
                </button>
              )}

              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onEdit(post);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'rgba(0, 168, 225, 0.15)',
                    color: '#00A8E1',
                    border: '1px solid rgba(0, 168, 225, 0.3)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Edit Card Details"
                >
                  <Edit3 style={{ width: 14, height: 14 }} />
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDelete(post.id);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Delete Card"
                >
                  <Trash2 style={{ width: 14, height: 14 }} />
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
