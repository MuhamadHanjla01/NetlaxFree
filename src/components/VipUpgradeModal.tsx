import { X, Crown, Send, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  telegramUsername?: string;
}

export const VipUpgradeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  telegramUsername = 'unkown010101010101010',
}) => {
  if (!isOpen) return null;

  // Format telegram link cleanly
  const cleanHandle = telegramUsername.replace('@', '').replace('https://t.me/', '');
  const telegramUrl = `https://t.me/${cleanHandle}`;

  return (
    <div className="modal-backdrop animate-fade-in" style={{ zIndex: 1100 }}>
      <div
        className="modal-container"
        style={{
          maxWidth: 480,
          padding: 0,
          overflow: 'hidden',
          borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(26, 20, 10, 0.98) 0%, rgba(15, 15, 20, 0.98) 100%)',
          border: '1px solid rgba(234, 179, 8, 0.5)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(234, 179, 8, 0.25)',
        }}
      >
        {/* Header Graphic Banner */}
        <div style={{
          padding: '28px 24px 20px 24px',
          background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(202, 138, 4, 0.05) 100%)',
          borderBottom: '1px solid rgba(234, 179, 8, 0.2)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="modal-close"
            style={{
              position: 'absolute',
              right: 16,
              top: 16,
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>

          {/* Crown Icon Emblem */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(234, 179, 8, 0.6)',
            marginBottom: 14,
          }}>
            <Crown style={{ width: 34, height: 34, color: '#000000' }} />
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
            Become a VIP Member
          </h2>
          <span style={{
            fontSize: 11,
            fontWeight: 800,
            color: '#eab308',
            background: 'rgba(234, 179, 8, 0.15)',
            padding: '3px 10px',
            borderRadius: 999,
            border: '1px solid rgba(234, 179, 8, 0.3)',
            marginTop: 6,
            letterSpacing: '0.05em',
          }}>
            UNLIMITED PREMIUM ACCESS
          </span>
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: 24 }}>
          {/* Info Card */}
          <div style={{
            padding: 16,
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: 20,
          }}>
            <p style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              lineHeight: 1.55,
              margin: 0,
              textAlign: 'center',
              fontWeight: 600,
            }}>
              To become a <strong style={{ color: '#eab308' }}>VIP Member</strong> and get instant access to 4K Ultra HD accounts, Netscape cookies, and priority servers, please contact the Administrator directly.
            </p>
          </div>

          {/* VIP Perks List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {[
              'Instant Netscape HTTP Cookie Data Copy',
              'Access All Premium Prime Streaming Accounts',
              'Exclusive 4K Ultra HD & Multi-Screen Support',
              '24/7 Priority Support & Server Updates',
            ].map((perk, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#ffffff', fontWeight: 700 }}>
                <CheckCircle2 style={{ width: 16, height: 16, color: '#eab308', flexShrink: 0 }} />
                <span>{perk}</span>
              </div>
            ))}
          </div>

          {/* Telegram Contact CTA Button */}
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="btn btn-lg"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '14px 20px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0088cc 0%, #006699 100%)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: 15,
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(0, 136, 204, 0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            <Send style={{ width: 18, height: 18 }} />
            <span>Message Now on Telegram (@{cleanHandle})</span>
          </a>

          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
              Clicking "Message Now" opens Telegram to chat with Admin directly.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
