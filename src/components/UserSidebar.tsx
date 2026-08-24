import React from 'react';
import type { SidebarPage } from '../types/blog';
import { X, ChevronRight, Home } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sidebarPages: SidebarPage[];
  selectedService: string;
  onSelectService: (serviceName: string) => void;
}

export const UserSidebar: React.FC<Props> = ({
  isOpen,
  onClose,
  sidebarPages,
  selectedService,
  onSelectService,
}) => {
  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 140,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* User Sidebar Navigation Panel */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 270,
          zIndex: 150,
          background: 'var(--surface-1)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform var(--transition-base)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-0)',
          }}
        >
          <div
            onClick={() => {
              onSelectService('All Services');
              onClose();
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          >
            <img src="/netflix-logo.svg" alt="NetlaxFree" style={{ height: 22 }} />
            <span className="navbar-badge">NAVIGATE</span>
          </div>

          <button onClick={onClose} className="btn btn-sm btn-ghost" style={{ padding: 4 }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          
          {/* Main Home Button */}
          <div style={{ marginBottom: 16 }}>
            <button
              onClick={() => {
                onSelectService('All Services');
                onClose();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: selectedService === 'All Services' ? 'var(--nx-red)' : 'var(--surface-3)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Home style={{ width: 16, height: 16 }} />
                <span>All Platforms Home</span>
              </div>
              <ChevronRight style={{ width: 14, height: 14 }} />
            </button>
          </div>

          {/* STREAMING SERVICE PLATFORMS */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ padding: '0 8px 8px', fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              STREAMING PLATFORMS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {sidebarPages.map((srv) => {
                const isSelected = selectedService === srv.name;
                const dotColor = srv.color || '#E50914';

                return (
                  <button
                    key={srv.id}
                    onClick={() => {
                      onSelectService(srv.name);
                      onClose();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? `linear-gradient(135deg, ${dotColor}33 0%, var(--surface-3) 100%)` : 'transparent',
                      color: isSelected ? '#fff' : 'var(--text-tertiary)',
                      border: isSelected ? `1px solid ${dotColor}66` : '1px solid transparent',
                      fontSize: 13,
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                    className="sidebar-item-btn"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
                      <span style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: dotColor,
                        boxShadow: `0 0 8px ${dotColor}`,
                        flexShrink: 0,
                      }} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {srv.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </aside>
    </>
  );
};
