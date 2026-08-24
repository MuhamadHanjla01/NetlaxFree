import { ShieldAlert, Plus, X, Lock, LayoutDashboard, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewPostModal: () => void;
  onOpenNewPlatformModal: () => void;
  onLogoutAdmin: () => void;
}

export const AdminSidebar: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenNewPostModal,
  onOpenNewPlatformModal,
  onLogoutAdmin,
}) => {
  return (
    <>
      {/* Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 140,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Admin Sidebar Navigation Panel */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          zIndex: 150,
          background: '#040d12',
          borderRight: '1px solid rgba(229, 9, 20, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform var(--transition-base)',
          boxShadow: '0 0 30px rgba(229, 9, 20, 0.15)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(229, 9, 20, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldAlert style={{ width: 20, height: 20, color: '#E50914' }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', letterSpacing: '0.05em' }}>
                ADMIN CMS
              </div>
              <div style={{ fontSize: 10, color: '#E50914', fontWeight: 800 }}>
                CONTROL PANEL
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-sm btn-ghost" style={{ padding: 4, color: '#94a3b8' }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          <div style={{ padding: '0 8px', fontSize: 11, fontWeight: 800, color: '#64748b', letterSpacing: '0.08em' }}>
            CMS MANAGEMENT
          </div>

          {/* Action Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button
              onClick={onClose}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(229, 9, 20, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(229, 9, 20, 0.4)',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              <LayoutDashboard style={{ width: 16, height: 16, color: '#E50914' }} />
              <span>Admin Dashboard</span>
            </button>

            <button
              onClick={() => {
                onOpenNewPostModal();
                onClose();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.04)',
                color: '#e2e8f0',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
              className="sidebar-item-btn"
            >
              <FileText style={{ width: 16, height: 16, color: '#10b981' }} />
              <span>Create New Guide / Card</span>
            </button>

            <button
              onClick={() => {
                onOpenNewPlatformModal();
                onClose();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.04)',
                color: '#e2e8f0',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
              className="sidebar-item-btn"
            >
              <Plus style={{ width: 16, height: 16, color: '#06b6d4' }} />
              <span>Add Platform / Sidebar Page</span>
            </button>
          </div>

          <div style={{ padding: '8px 8px 0', fontSize: 11, fontWeight: 800, color: '#64748b', letterSpacing: '0.08em' }}>
            SYSTEM SESSION
          </div>

          <button
            onClick={() => {
              onLogoutAdmin();
              onClose();
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <Lock style={{ width: 16, height: 16 }} />
            <span>Lock & Exit Admin CMS</span>
          </button>

        </div>

        {/* Footer info */}
        <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 11, color: '#64748b' }}>
          <span>Session Status: </span>
          <span style={{ color: '#10b981', fontWeight: 800 }}>AUTHENTICATED</span>
        </div>
      </aside>
    </>
  );
};
