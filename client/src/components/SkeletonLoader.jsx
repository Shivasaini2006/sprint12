import React from 'react';

/**
 * Skeleton Card Loader component that mimics the PostCard layout.
 */
const SkeletonCard = () => (
  <div className="skeleton-card" data-testid="skeleton-card">
    <div className="skeleton-image"></div>
    <div className="skeleton-body">
      <div className="skeleton-text title"></div>
      <div className="skeleton-text desc-1"></div>
      <div className="skeleton-text desc-2"></div>
      <div className="skeleton-text desc-3"></div>
      <div className="skeleton-footer">
        <div className="skeleton-btn"></div>
        <div className="skeleton-btn"></div>
      </div>
    </div>
  </div>
);

/**
 * Renders multiple SkeletonCards in a grid.
 */
const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="posts-grid" data-testid="skeleton-loader-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
