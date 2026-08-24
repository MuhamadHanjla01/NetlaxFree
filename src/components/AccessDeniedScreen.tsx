import React, { useState, useEffect } from 'react';
import { Home, RefreshCw, Globe, Terminal, ShieldAlert } from 'lucide-react';

interface Props {
  onRetreatToHome: () => void;
  onReconnect: () => void;
}

export const AccessDeniedScreen: React.FC<Props> = ({ onRetreatToHome, onReconnect }) => {
  const [userIp, setUserIp] = useState('127.0.0.1');

  useEffect(() => {
    // Attempt to fetch real IP if available, fallback to 127.0.0.1
    fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ip) setUserIp(data.ip);
      })
      .catch(() => {});
  }, []);

  return (
    <div
      style={{
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: '#040507',
        borderRadius: 20,
        margin: '20px 0',
        padding: '40px 20px',
        border: '1px solid rgba(229, 9, 20, 0.2)',
        boxShadow: '0 20px 80px rgba(0, 0, 0, 0.9), inset 0 0 100px rgba(229, 9, 20, 0.08)',
        fontFamily: "'Inter', monospace, sans-serif",
      }}
    >
      {/* Background Matrix/Security Log Scan Lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.07,
          pointerEvents: 'none',
          fontFamily: 'monospace',
          fontSize: 11,
          color: '#ef4444',
          lineHeight: 1.6,
          padding: 20,
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i}>
            [08:45:10] SIG_BLOCK: Unauthorized access attempt in node_0x{(i * 173).toString(16)}... BYPASS_ATTEMPT: {(i * 43) % 255}.{(i * 91) % 255}.{(i * 12) % 255}
          </div>
        ))}
      </div>

      {/* Radial Red Glow Background */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(229, 9, 20, 0.22) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Terminal Box */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 680,
          background: 'rgba(8, 6, 9, 0.95)',
          border: '1px solid rgba(239, 68, 68, 0.45)',
          borderRadius: 16,
          padding: '36px 32px',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.95), 0 0 40px rgba(229, 9, 20, 0.25)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Top Left Red Corner Marker */}
        <div
          style={{
            position: 'absolute',
            top: -2,
            left: -2,
            width: 18,
            height: 18,
            borderTop: '3px solid #E50914',
            borderLeft: '3px solid #E50914',
            borderTopLeftRadius: 6,
          }}
        />

        {/* Bottom Right Red Corner Marker */}
        <div
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: 18,
            height: 18,
            borderBottom: '3px solid #E50914',
            borderRight: '3px solid #E50914',
            borderBottomRightRadius: 6,
          }}
        />

        {/* Title: ACCESS DENIED */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 'clamp(32px, 6vw, 54px)',
              fontWeight: 900,
              letterSpacing: '0.1em',
              color: '#ff3344',
              margin: 0,
              textTransform: 'uppercase',
              textShadow: '0 0 20px rgba(229, 9, 20, 0.8), 2px 2px 0px #00d2ff, -2px -2px 0px #ff007f',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            ACCESS DENIED
          </h1>

          {/* Subtitle / Quote Box */}
          <div
            style={{
              marginTop: 18,
              padding: '10px 20px',
              borderTop: '1px solid rgba(239, 68, 68, 0.3)',
              borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'inline-block',
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: '#f87171',
                letterSpacing: '0.12em',
                fontFamily: 'monospace',
              }}
            >
              "OOPS, YOU ARE IN THE WRONG PATH."
            </span>
          </div>
        </div>

        {/* Information Grid: Connectivity Profile & System Log */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
            marginBottom: 28,
          }}
        >
          {/* Box 1: CONNECTIVITY PROFILE */}
          <div
            style={{
              background: 'rgba(15, 10, 14, 0.9)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 12,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 11,
                  fontWeight: 900,
                  color: '#94a3b8',
                  letterSpacing: '0.1em',
                  marginBottom: 16,
                }}
              >
                <Globe style={{ width: 14, height: 14, color: '#ef4444' }} />
                <span>CONNECTIVITY PROFILE</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, fontFamily: 'monospace' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>IP_ADDR:</span>
                  <span style={{ color: '#ffffff', fontWeight: 700 }}>{userIp}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>GEO_LOC:</span>
                  <span style={{ color: '#f87171', fontWeight: 700 }}>Hidden Node, Restricted Area</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>GATEWAY:</span>
                  <span style={{ color: '#ffffff', fontWeight: 700 }}>Encrypted Routing Protocol</span>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 18,
                padding: '8px 12px',
                borderRadius: 8,
                background: 'rgba(229, 9, 20, 0.12)',
                border: '1px solid rgba(229, 9, 20, 0.3)',
                color: '#ef4444',
                fontSize: 11,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                letterSpacing: '0.05em',
              }}
            >
              <ShieldAlert style={{ width: 13, height: 13 }} />
              <span>VPN / PROXY DETECTED</span>
            </div>
          </div>

          {/* Box 2: SYSTEM LOG */}
          <div
            style={{
              background: 'rgba(15, 10, 14, 0.9)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 12,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              fontFamily: 'monospace',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 11,
                  fontWeight: 900,
                  color: '#94a3b8',
                  letterSpacing: '0.1em',
                  marginBottom: 16,
                }}
              >
                <Terminal style={{ width: 14, height: 14, color: '#ef4444' }} />
                <span>SYSTEM LOG</span>
              </div>

              <div style={{ color: '#f87171', fontSize: 13, fontWeight: 700, lineHeight: 1.6 }}>
                &gt; Unauthorized curiosity detected.<span className="animate-pulse" style={{ color: '#ef4444' }}>❚</span>
              </div>
            </div>

            <div style={{ marginTop: 24, textAlign: 'right', fontSize: 9, color: '#475569', letterSpacing: '0.1em' }}>
              SEC_LAYER: 4 &nbsp;|&nbsp; ENC: RSA4096
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <button
            onClick={onRetreatToHome}
            style={{
              flex: 1,
              minWidth: 200,
              padding: '14px 20px',
              borderRadius: 10,
              background: '#E50914',
              color: '#ffffff',
              border: 'none',
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 6px 20px rgba(229, 9, 20, 0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            <Home style={{ width: 16, height: 16 }} />
            <span>RETREAT TO HOME</span>
          </button>

          <button
            onClick={onReconnect}
            style={{
              minWidth: 160,
              padding: '14px 20px',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s ease',
            }}
          >
            <RefreshCw style={{ width: 16, height: 16 }} />
            <span>RECONNECT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
