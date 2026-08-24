import React, { useState, useEffect } from 'react';
import type { SidebarPage } from '../types/blog';
import { X, Check, ShieldAlert, Shield } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  platform: SidebarPage | null;
  onSavePlatformRules: (updatedPlatform: SidebarPage) => void;
}

export const PlatformRulesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  platform,
  onSavePlatformRules,
}) => {
  const [name, setName] = useState('');
  const [badge, setBadge] = useState('');
  const [rules, setRules] = useState('');

  useEffect(() => {
    if (platform) {
      setName(platform.name || '');
      setBadge(platform.badge || '');
      setRules(
        platform.description ||
        `How To Use & Setup Rules for ${platform.name}:\n1. Open platform app or web portal.\n2. Follow standard setup & login steps.\n3. Do not modify account PIN or settings.`
      );
    }
  }, [platform]);

  if (!isOpen || !platform) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SidebarPage = {
      ...platform,
      name: name.trim() || platform.name,
      badge: badge.trim() || undefined,
      description: rules.trim(),
    };
    onSavePlatformRules(updated);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container" style={{ maxWidth: 580 }}>
        
        {/* Header */}
        <div className="modal-header" style={{ background: 'rgba(229, 9, 20, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldAlert style={{ width: 20, height: 20, color: '#E50914' }} />
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: 0 }}>
                Configure How To Use Rules — {platform.name}
              </h2>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                Set platform title, badge tag, and user setup instructions
              </span>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Form Body */}
        <div className="modal-body">
          <form onSubmit={handleSubmit} className="editor-form">
            
            {/* Platform Name & Badge */}
            <div className="form-grid-2">
              <div className="form-group">
                <label>Platform Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Badge Tag (e.g. POPULAR #1, NEW)</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="POPULAR #1"
                  className="form-input"
                />
              </div>
            </div>

            {/* How To Use Rules Textarea */}
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Shield style={{ width: 14, height: 14, color: '#E50914' }} />
                <span>How To Use & Setup Rules (Instructions for Users)</span>
              </label>
              <textarea
                rows={6}
                required
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                placeholder="Enter step-by-step setup rules..."
                className="form-input"
                style={{ lineHeight: 1.5, fontSize: 13 }}
              />
            </div>

            {/* Actions */}
            <div className="form-actions" style={{ marginTop: 12 }}>
              <button type="button" onClick={onClose} className="btn btn-md btn-ghost">
                Cancel
              </button>
              <button type="submit" className="btn btn-md btn-red">
                <Check style={{ width: 16, height: 16 }} />
                <span>Save How To Use Rules</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
