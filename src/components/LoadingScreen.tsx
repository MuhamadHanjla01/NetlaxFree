import { useEffect, useState } from 'react';

export const LoadingScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [phase, setPhase] = useState<'logo' | 'text' | 'fade'>('logo');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'), 1200);
    const t2 = setTimeout(() => setPhase('fade'), 2400);
    const t3 = setTimeout(() => onFinish(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  return (
    <div
      className="loading-screen"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        opacity: phase === 'fade' ? 0 : 1,
        transition: 'opacity 0.8s ease-out',
        pointerEvents: phase === 'fade' ? 'none' : 'auto',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(229,9,20,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'pulseGlow 2s ease-in-out infinite',
        }}
      />

      {/* Netflix N icon */}
      <div
        style={{
          opacity: phase === 'logo' || phase === 'text' || phase === 'fade' ? 1 : 0,
          transform: phase === 'logo' ? 'scale(0.8)' : 'scale(1)',
          transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
          marginBottom: '24px',
        }}
      >
        <svg width="80" height="80" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="12" fill="transparent"/>
          <g>
            <rect x="14" y="8" width="9" height="48" rx="1" fill="#E50914">
              <animate attributeName="height" from="0" to="48" dur="0.6s" fill="freeze"/>
            </rect>
            <polygon points="14,8 23,8 38,48 38,8" fill="#E50914" opacity="0.9">
              <animate attributeName="opacity" from="0" to="0.9" dur="0.4s" begin="0.3s" fill="freeze"/>
            </polygon>
            <rect x="38" y="8" width="9" height="48" rx="1" fill="#E50914">
              <animate attributeName="height" from="0" to="48" dur="0.6s" begin="0.15s" fill="freeze"/>
            </rect>
          </g>
        </svg>
      </div>

      {/* NetlaxFree Logo text */}
      <div
        style={{
          opacity: phase === 'text' || phase === 'fade' ? 1 : 0,
          transform: phase === 'text' || phase === 'fade' ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <img
          src="/netflix-logo.svg"
          alt="NetlaxFree"
          style={{ height: '42px', filter: 'drop-shadow(0 0 20px rgba(229,9,20,0.5))' }}
        />
      </div>

      {/* NETLAXFREE subtext */}
      <div
        style={{
          opacity: phase === 'text' || phase === 'fade' ? 1 : 0,
          transform: phase === 'text' || phase === 'fade' ? 'translateY(0)' : 'translateY(8px)',
          transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1) 0.15s',
          marginTop: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            width: '32px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(229,9,20,0.6))',
          }}
        />
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#a1a1aa',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Official Streaming Hub
        </span>
        <span
          style={{
            width: '32px',
            height: '1px',
            background: 'linear-gradient(90deg, rgba(229,9,20,0.6), transparent)',
          }}
        />
      </div>

      {/* Loading bar */}
      <div
        style={{
          position: 'absolute',
          bottom: '48px',
          width: '120px',
          height: '2px',
          background: '#27272a',
          borderRadius: '2px',
          overflow: 'hidden',
          opacity: phase === 'fade' ? 0 : 0.8,
          transition: 'opacity 0.4s',
        }}
      >
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #E50914, #ff6b6b)',
            borderRadius: '2px',
            animation: 'loadBar 2.4s ease-in-out forwards',
          }}
        />
      </div>
    </div>
  );
};
