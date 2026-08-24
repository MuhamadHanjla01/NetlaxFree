import React from 'react';
import type { SidebarPage, UserAccount } from '../types/blog';
import { Tv, ArrowRight, Play, CheckCircle2, Edit3 } from 'lucide-react';

interface Props {
  sidebarPages: SidebarPage[];
  selectedService: string;
  onSelectService: (serviceName: string) => void;
  postCountsByService: Record<string, number>;
  isAdmin?: boolean;
  onOpenNewPlatformModal?: () => void;
  onEditPlatformRules?: (srv: SidebarPage) => void;
  currentUser?: UserAccount | null;
  onOpenAuthModal?: () => void;
}

export const ServiceHub: React.FC<Props> = ({
  sidebarPages,
  selectedService,
  onSelectService,
  postCountsByService,
  isAdmin,
  onEditPlatformRules,
  currentUser,
  onOpenAuthModal,
}) => {
  const handlePlatformClick = (srvName: string) => {
    if (!currentUser && !isAdmin) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }
    onSelectService(srvName === selectedService ? 'All Services' : srvName);
  };

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Section Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingBottom: 10,
        borderBottom: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
        gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Tv style={{ width: 20, height: 20, color: '#E50914' }} />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Services
          </h2>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            background: 'var(--surface-3)',
            color: 'var(--text-tertiary)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
          }}>
            {sidebarPages.length} Platforms
          </span>
        </div>
      </div>

      {/* Dynamic Services Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}>
        {sidebarPages.map((srv) => {
          const isSelected = selectedService === srv.name;
          const guideCount = postCountsByService[srv.name] || 0;
          const cardColor = srv.color || '#E50914';

          return (
            <div
              key={srv.id}
              style={{
                padding: 20,
                borderRadius: 'var(--radius-lg)',
                border: isSelected ? `2px solid ${cardColor}` : '1px solid var(--border-subtle)',
                background: `linear-gradient(135deg, ${cardColor}22 0%, rgba(17,17,19,0.95) 100%)`,
                transition: 'all var(--transition-base)',
                boxShadow: isSelected ? `0 8px 32px ${cardColor}33` : 'none',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              className="service-card"
            >
              <div>
                {/* Top Row: Name, Badge & Admin Edit Rules Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div
                    onClick={() => handlePlatformClick(srv.name)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                  >
                    <span style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: cardColor,
                      boxShadow: `0 0 10px ${cardColor}`,
                    }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                      {srv.name}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {srv.badge && (
                      <span style={{
                        fontSize: 10,
                        fontWeight: 900,
                        padding: '3px 8px',
                        borderRadius: 4,
                        background: isSelected ? cardColor : `${cardColor}22`,
                        color: isSelected ? '#fff' : cardColor,
                        border: `1px solid ${cardColor}44`,
                        letterSpacing: '0.05em',
                      }}>
                        {srv.badge}
                      </span>
                    )}

                    {/* Admin Edit How To Use Rules Button */}
                    {(isAdmin || onEditPlatformRules) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onEditPlatformRules) onEditPlatformRules(srv);
                        }}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 6,
                          background: 'rgba(229, 9, 20, 0.2)',
                          color: '#ffffff',
                          border: '1px solid rgba(229, 9, 20, 0.5)',
                          fontSize: 11,
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          transition: 'all 0.2s ease',
                        }}
                        title="Edit How To Use Rules & Links"
                      >
                        <Edit3 style={{ width: 12, height: 12, color: '#E50914' }} />
                        <span>Edit Rules</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Subtitle / Description */}
                <p
                  onClick={() => handlePlatformClick(srv.name)}
                  style={{
                    fontSize: 12,
                    color: 'var(--text-tertiary)',
                    marginBottom: 14,
                    lineHeight: 1.4,
                    minHeight: 34,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >
                  {srv.description || `${srv.name} Streaming & Setup Guides`}
                </p>

                {/* Highlights Feature Bullets */}
                <div
                  onClick={() => handlePlatformClick(srv.name)}
                  style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16, cursor: 'pointer' }}
                >
                  {(srv.highlights || ['4K Ultra HD Streaming', 'Direct Stream & Subscription Links']).slice(0, 3).map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
                      <CheckCircle2 style={{ width: 13, height: 13, color: cardColor, flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Counter */}
              <div
                onClick={() => handlePlatformClick(srv.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 12,
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: 12,
                  fontWeight: 700,
                  color: isSelected ? '#fff' : cardColor,
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Play style={{ width: 12, height: 12, fill: 'currentColor' }} />
                  <span>{guideCount} Guides & Buttons</span>
                </div>
                <ArrowRight style={{ width: 14, height: 14 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
