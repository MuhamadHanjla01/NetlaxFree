import React from 'react';
import type { BlogPost } from '../types/blog';
import { CtaButton } from './CtaButton';
import { Flame, Eye, Heart, Clock, ArrowRight } from 'lucide-react';

interface Props {
  post: BlogPost;
  onReadArticle: (post: BlogPost) => void;
}

export const HeroSection: React.FC<Props> = ({ post, onReadArticle }) => {
  return (
    <div className="hero">
      {/* Background */}
      <div className="hero-bg">
        <img src={post.coverImage} alt={post.title} />
        <div className="hero-overlay" />
      </div>

      {/* Content */}
      <div className="hero-content">
        {/* Badges */}
        <div className="hero-badges">
          <span className="badge-featured">
            <Flame style={{ width: 13, height: 13 }} />
            Featured Story
          </span>
          <span className="badge-category">{post.category}</span>
          <span className="badge-time">
            <Clock style={{ width: 13, height: 13 }} />
            {post.readTime}
          </span>
        </div>

        {/* Title */}
        <h1 className="hero-title">{post.title}</h1>

        {/* Excerpt */}
        <p className="hero-excerpt">{post.excerpt}</p>

        {/* Meta */}
        <div className="hero-meta">
          <div className="hero-author">
            {post.authorAvatar ? (
              <img src={post.authorAvatar} alt={post.author} className="author-avatar" />
            ) : (
              <div className="author-avatar-fallback">{post.author.charAt(0)}</div>
            )}
            <span style={{ fontWeight: 600, color: '#e4e4e7' }}>{post.author}</span>
            <span>• {post.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="hero-stat">
              <Eye style={{ width: 14, height: 14 }} /> {post.viewsCount.toLocaleString()}
            </span>
            <span className="hero-stat">
              <Heart style={{ width: 14, height: 14, color: '#E50914' }} /> {post.likesCount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="hero-actions">
          <button onClick={() => onReadArticle(post)} className="btn btn-lg btn-red">
            <span>Read Full Article</span>
            <ArrowRight style={{ width: 18, height: 18 }} />
          </button>
          {post.ctaButtons && post.ctaButtons.length > 0 && (
            post.ctaButtons.map((btn) => (
              <CtaButton key={btn.id} button={btn} size="md" />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
