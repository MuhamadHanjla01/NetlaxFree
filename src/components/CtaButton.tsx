import React from 'react';
import { Play, ExternalLink, Info, Ticket, Download, Tv, Star, Heart } from 'lucide-react';
import type { CtaButton as CtaButtonType } from '../types/blog';

interface Props {
  button: CtaButtonType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const CtaButton: React.FC<Props> = ({ button, size = 'md', className = '', onClick }) => {
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 18 : 15;
  const iconStyle = { width: iconSize, height: iconSize };

  const getIcon = () => {
    switch (button.icon) {
      case 'play': return <Play style={iconStyle} fill="currentColor" />;
      case 'external': return <ExternalLink style={iconStyle} />;
      case 'info': return <Info style={iconStyle} />;
      case 'ticket': return <Ticket style={iconStyle} />;
      case 'download': return <Download style={iconStyle} />;
      case 'netflix': return <Tv style={iconStyle} />;
      case 'star': return <Star style={iconStyle} fill="currentColor" />;
      case 'heart': return <Heart style={iconStyle} fill="currentColor" />;
      default: return <ExternalLink style={iconStyle} />;
    }
  };

  const variantClass = `cta-btn-${button.variant || 'primary'}`;
  const sizeClass = `cta-size-${size}`;

  return (
    <a
      href={button.url || '#'}
      target={button.openInNewTab ? '_blank' : '_self'}
      rel={button.openInNewTab ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      className={`cta-btn-base ${variantClass} ${sizeClass} ${className}`}
      title={`Open: ${button.url}`}
    >
      {getIcon()}
      <span>{button.label}</span>
    </a>
  );
};
