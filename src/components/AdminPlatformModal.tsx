import React, { useState } from 'react';
import type { SidebarPage } from '../types/blog';
import { X, Sparkles, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSavePlatform: (page: SidebarPage) => void;
}

const COLOR_PRESETS = [
  { name: 'Red Crimson', color: '#E50914' },
  { name: 'Electric Blue', color: '#00A8E1' },
  { name: 'Cyan Hotstar', color: '#00D2FF' },
  { name: 'Magenta Pink', color: '#FF007F' },
  { name: 'Pure White', color: '#E5E5E5' },
  { name: 'Royal Purple', color: '#9933FF' },
  { name: 'Sony Gold', color: '#F99F1B' },
  { name: 'Emerald Green', color: '#10B981' },
];

export const AdminPlatformModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSavePlatform,
}) => {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [color, setColor] = useState('#E50914');
  const [badge, setBadge] = useState('NEW');
  const [feat1, setFeat1] = useState('4K Ultra HD Streaming');
  const [feat2, setFeat2] = useState('Offline Downloads & Multi-audio');
  const [feat3, setFeat3] = useState('Direct Stream & Subscription Links');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPage: SidebarPage = {
      id: `platform-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim() || `${name.trim()} Streaming & Setup Guides`,
      color,
      badge: badge.trim() || undefined,
      icon: 'tv',
      popularFeatures: [feat1.trim(), feat2.trim(), feat3.trim()].filter(Boolean),
      isBuiltIn: false,
      createdAt: new Date().toISOString(),
    };

    onSavePlatform(newPage);
    setName('');
    setTagline('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container" style={{ maxWidth: 580 }}>
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles style={{ width: 18, height: 18, color: '#E50914' }} />
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>
              Add New Sidebar Button & Platform Page
            </h2>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Body Form */}
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="editor-form">
            
            {/* Name */}
            <div className="form-group">
              <label>Sidebar Button & Platform Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Paramount+, JioHotstar Special, Anime Hub, Live Sports"
                className="form-input"
              />
            </div>

            {/* Tagline */}
            <div className="form-group">
              <label>Tagline / Description</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. 4K UHD Live Cricket, HBO Originals & Exclusive Movies"
                className="form-input"
              />
            </div>

            {/* Badge & Color */}
            <div className="form-grid-2">
              <div className="form-group">
                <label>Badge Label (e.g. NEW, SPECIAL, 4K)</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="NEW"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Accent Color</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ width: 40, height: 38, border: 'none', background: 'none', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {color}
                  </span>
                </div>
              </div>
            </div>

            {/* Color Presets */}
            <div className="form-group">
              <label>Quick Color Presets</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.color}
                    type="button"
                    onClick={() => setColor(preset.color)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      background: `${preset.color}20`,
                      color: preset.color,
                      border: `1px solid ${preset.color}55`,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div className="form-group">
              <label>Platform Key Features (displayed on card)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  type="text"
                  value={feat1}
                  onChange={(e) => setFeat1(e.target.value)}
                  placeholder="Feature 1: 4K Ultra HD & HDR"
                  className="form-input"
                />
                <input
                  type="text"
                  value={feat2}
                  onChange={(e) => setFeat2(e.target.value)}
                  placeholder="Feature 2: Multi-camera angles & audio"
                  className="form-input"
                />
                <input
                  type="text"
                  value={feat3}
                  onChange={(e) => setFeat3(e.target.value)}
                  placeholder="Feature 3: Offline downloads"
                  className="form-input"
                />
              </div>
            </div>

            {/* Card Live Preview */}
            {name && (
              <div style={{
                padding: 16,
                borderRadius: 'var(--radius-md)',
                background: `linear-gradient(135deg, ${color}22 0%, var(--surface-3) 100%)`,
                border: `1px solid ${color}44`,
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Live Preview (Sidebar & Select Streaming Platform Section):
                </span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                    <strong style={{ fontSize: 15, color: '#fff' }}>{name}</strong>
                  </div>
                  {badge && (
                    <span style={{ fontSize: 10, fontWeight: 800, color, background: `${color}25`, padding: '2px 6px', borderRadius: 4 }}>
                      {badge}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>
                  {tagline || 'Streaming & Setup Guides'}
                </p>
              </div>
            )}

            {/* Submit Actions */}
            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn btn-md btn-ghost">
                Cancel
              </button>
              <button type="submit" className="btn btn-md btn-red">
                <Check style={{ width: 16, height: 16 }} />
                <span>Add to Sidebar & Home Section</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
