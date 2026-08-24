import React, { useState } from 'react';
import type { BlogPost, SidebarPage, UserAccount } from '../types/blog';
import { TrafficChart } from './TrafficChart';
import { ServiceHub } from './ServiceHub';
import { PlatformRulesModal } from './PlatformRulesModal';
import { UserManagementTable } from './UserManagementTable';
import { KeyRound, Check, Users, Tv, TrendingUp, Layers, Send } from 'lucide-react';

interface Props {
  posts: BlogPost[];
  sidebarPages: SidebarPage[];
  onOpenNewPlatformModal?: () => void;
  onUpdatePlatform?: (updated: SidebarPage) => void;
  currentPin: string;
  onChangePin: (newPin: string) => void;
  registeredUsers: UserAccount[];
  onUpdateUser: (updatedUser: UserAccount) => void;
  onDeleteUser: (userId: string) => void;
  telegramUsername: string;
  onChangeTelegramUsername: (username: string) => void;
}

export const AdminDashboard: React.FC<Props> = ({
  posts,
  sidebarPages,
  onOpenNewPlatformModal,
  onUpdatePlatform,
  currentPin,
  onChangePin,
  registeredUsers,
  onUpdateUser,
  onDeleteUser,
  telegramUsername,
  onChangeTelegramUsername,
}) => {
  const [selectedService, setSelectedService] = useState<string>('All Services');
  const [editingPlatform, setEditingPlatform] = useState<SidebarPage | null>(null);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  // Security PIN edit state
  const [newPinInput, setNewPinInput] = useState('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState(false);

  // Telegram settings state
  const [telegramInput, setTelegramInput] = useState(telegramUsername);
  const [telegramSuccessMsg, setTelegramSuccessMsg] = useState(false);

  // Compute metrics
  const totalViews = posts.reduce((acc, p) => acc + p.viewsCount, 0);

  // Total Services
  const uniqueServiceNames = Array.from(new Set([
    ...sidebarPages.map(s => s.name),
    ...posts.map(p => p.service)
  ]));
  const totalServices = uniqueServiceNames.length;

  // Compute guide counts per service for ServiceHub
  const postCountsByService: Record<string, number> = {};
  posts.forEach((p) => {
    const srv = p.service || 'Netflix';
    postCountsByService[srv] = (postCountsByService[srv] || 0) + 1;
  });

  // Sort services by popularity
  const serviceStats = uniqueServiceNames.map(srvName => {
    const srvPosts = posts.filter(p => p.service === srvName);
    const count = srvPosts.length;
    const views = srvPosts.reduce((acc, p) => acc + p.viewsCount, 0);
    const percentage = totalViews > 0 ? Math.round((views / totalViews) * 100) : 0;

    return {
      name: srvName,
      views,
      count,
      percentage,
    };
  });

  const sortedServiceStats = serviceStats.sort((a, b) => b.views - a.views);

  const handleEditPlatformRules = (srv: SidebarPage) => {
    setEditingPlatform(srv);
    setIsRulesModalOpen(true);
  };

  const handleSavePlatformRules = (updated: SidebarPage) => {
    if (onUpdatePlatform) {
      onUpdatePlatform(updated);
    }
  };

  const handlePinUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPinInput.trim()) return;
    onChangePin(newPinInput.trim());
    setPinSuccessMsg(true);
    setNewPinInput('');
    setTimeout(() => setPinSuccessMsg(false), 3000);
  };

  const handleTelegramUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramInput.trim()) return;
    onChangeTelegramUsername(telegramInput.trim());
    setTelegramSuccessMsg(true);
    setTimeout(() => setTelegramSuccessMsg(false), 3000);
  };

  return (
    <div style={{ marginBottom: 40 }}>
      {/* Top Banner Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {/* Metric Card 1: Total Platform Guides */}
        <div
          style={{
            padding: 20,
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(229, 9, 20, 0.15)',
              color: '#E50914',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Layers style={{ width: 24, height: 24 }} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Active Guides
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', lineHeight: 1.2 }}>
              {posts.length}
            </div>
          </div>
        </div>

        {/* Metric Card 2: Registered & Active Users */}
        <div
          style={{
            padding: 20,
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Users style={{ width: 24, height: 24 }} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Registered Users
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', lineHeight: 1.2 }}>
              {registeredUsers.length}
            </div>
          </div>
        </div>

        {/* Metric Card 3: Total Service Platforms */}
        <div
          style={{
            padding: 20,
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Tv style={{ width: 24, height: 24 }} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Streaming Services
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', lineHeight: 1.2 }}>
              {totalServices}
            </div>
          </div>
        </div>

        {/* Metric Card 4: Total Reader Traffic */}
        <div
          style={{
            padding: 20,
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(234, 179, 8, 0.15)',
              color: '#eab308',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <TrendingUp style={{ width: 24, height: 24 }} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Guide Views
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', lineHeight: 1.2 }}>
              {totalViews.toLocaleString()}
            </div>
          </div>
        </div>

      </div>

      {/* 2. MOST USED SERVICES TRAFFIC RANKING CHART */}
      <TrafficChart stats={sortedServiceStats} totalViews={totalViews} />

      {/* 3. SELECT STREAMING PLATFORM SECTION WITH EDIT RULES BUTTON */}
      <ServiceHub
        sidebarPages={sidebarPages}
        selectedService={selectedService}
        onSelectService={(srv) => setSelectedService(srv)}
        postCountsByService={postCountsByService}
        isAdmin={true}
        onOpenNewPlatformModal={onOpenNewPlatformModal}
        onEditPlatformRules={handleEditPlatformRules}
      />

      {/* Modal to Edit How to Use Rules & Links */}
      <PlatformRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        platform={editingPlatform}
        onSavePlatformRules={handleSavePlatformRules}
      />

      {/* 4. REGISTERED USERS MANAGEMENT PANEL */}
      <UserManagementTable
        users={registeredUsers}
        onUpdateUser={onUpdateUser}
        onDeleteUser={onDeleteUser}
      />

      {/* 5. ADMIN SECURITY & TELEGRAM VIP SETTINGS PANEL */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Admin PIN Settings */}
        <div
          style={{
            padding: '24px 28px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <KeyRound style={{ width: 20, height: 20, color: '#E50914' }} />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>
              Admin Security PIN
            </h3>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: 0 }}>
            Update secret Admin PIN. Only users with this key can access Admin CMS.
          </p>

          {pinSuccessMsg && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#10b981',
              fontSize: 12,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <Check style={{ width: 16, height: 16 }} />
              <span>Admin PIN updated!</span>
            </div>
          )}

          <form onSubmit={handlePinUpdate} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
                CURRENT: <span style={{ color: '#E50914' }}>{currentPin}</span> | NEW PIN
              </label>
              <input
                type="text"
                required
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder="Enter new secret PIN"
                className="form-input"
                style={{ fontSize: 13, fontWeight: 700 }}
              />
            </div>

            <button type="submit" className="btn btn-red" style={{ padding: '10px 18px', fontWeight: 800 }}>
              Update PIN
            </button>
          </form>
        </div>

        {/* Admin Telegram VIP Contact Handle Settings */}
        <div
          style={{
            padding: '24px 28px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Send style={{ width: 20, height: 20, color: '#0088cc' }} />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>
              Telegram VIP Support Handle
            </h3>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: 0 }}>
            Telegram Username/ID for users clicking "Join VIP" to contact you directly.
          </p>

          {telegramSuccessMsg && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#10b981',
              fontSize: 12,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <Check style={{ width: 16, height: 16 }} />
              <span>Telegram username saved!</span>
            </div>
          )}

          <form onSubmit={handleTelegramUpdate} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>
                TELEGRAM USERNAME / LINK
              </label>
              <input
                type="text"
                required
                value={telegramInput}
                onChange={(e) => setTelegramInput(e.target.value)}
                placeholder="e.g. admin_vip_support"
                className="form-input"
                style={{ fontSize: 13, fontWeight: 700 }}
              />
            </div>

            <button type="submit" className="btn" style={{ background: '#0088cc', color: '#fff', padding: '10px 18px', fontWeight: 800 }}>
              Save Telegram
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};
