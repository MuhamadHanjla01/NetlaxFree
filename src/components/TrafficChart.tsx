import React, { useState } from 'react';
import { PieChart, Info } from 'lucide-react';

interface ServiceStat {
  name: string;
  views: number;
  count: number;
  percentage: number;
}

interface Props {
  stats: ServiceStat[];
  totalViews: number;
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

export const TrafficChart: React.FC<Props> = ({ stats, totalViews }) => {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  // SVG Donut Calculations
  let accumulatedAngle = 0;
  const donutRadius = 65;
  const donutCircumference = 2 * Math.PI * donutRadius;

  const donutSlices = stats.map((srv) => {
    const strokeDasharray = `${(srv.percentage / 100) * donutCircumference} ${donutCircumference}`;
    const strokeDashoffset = -((accumulatedAngle / 100) * donutCircumference);
    accumulatedAngle += srv.percentage;
    const color = SERVICE_COLORS[srv.name] || '#E50914';

    return {
      ...srv,
      strokeDasharray,
      strokeDashoffset,
      color,
    };
  });

  return (
    <div
      style={{
        padding: '24px 28px',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'rgba(229, 9, 20, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#E50914'
          }}>
            <PieChart style={{ width: 20, height: 20 }} />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Most Used Services Traffic Ranking Chart (Donut Share)
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>
              Real-time reader view share percentage across streaming platforms
            </p>
          </div>
        </div>
      </div>

      {/* DONUT SHARE CHART VIEW */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 28,
        alignItems: 'center',
      }}>
        {/* SVG Donut Graphic */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', padding: 10 }}>
          <svg width="240" height="240" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
            {donutSlices.map((slice) => (
              <circle
                key={slice.name}
                cx="80"
                cy="80"
                r={donutRadius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth="18"
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                onMouseEnter={() => setHoveredService(slice.name)}
                onMouseLeave={() => setHoveredService(null)}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: hoveredService && hoveredService !== slice.name ? 0.35 : 1,
                  filter: hoveredService === slice.name ? `drop-shadow(0 0 8px ${slice.color})` : 'none',
                }}
              />
            ))}
          </svg>

          {/* Donut Center Counter */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 900, color: '#ffffff' }}>
              {totalViews.toLocaleString()}
            </span>
            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              TOTAL VIEWS
            </span>
          </div>
        </div>

        {/* Legend Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stats.map((srv) => {
            const color = SERVICE_COLORS[srv.name] || '#E50914';
            const isHovered = hoveredService === srv.name;

            return (
              <div
                key={srv.name}
                onMouseEnter={() => setHoveredService(srv.name)}
                onMouseLeave={() => setHoveredService(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 14px',
                  borderRadius: 8,
                  background: isHovered ? `${color}22` : 'rgba(255, 255, 255, 0.02)',
                  border: isHovered ? `1px solid ${color}66` : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>{srv.name}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{srv.views.toLocaleString()} views</span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: `${color}22`,
                    color: color,
                    fontWeight: 900,
                    fontSize: 12,
                    border: `1px solid ${color}44`
                  }}>
                    {srv.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Footer Tip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        borderRadius: 8,
        background: 'rgba(255, 255, 255, 0.02)',
        fontSize: 11,
        color: 'var(--text-muted)',
      }}>
        <Info style={{ width: 14, height: 14, color: '#E50914', flexShrink: 0 }} />
        <span>Donut Chart automatically updates real-time platform view proportions.</span>
      </div>
    </div>
  );
};
