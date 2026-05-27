import React, { useState } from 'react';
import { Edit2, Trash2, Calendar } from 'lucide-react';

// A beautiful abstract SVG placeholder to use as a fallback image if loading fails
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

/**
 * Component for displaying an individual Post.
 */
const PostCard = ({ post, onEdit, onDelete, isDeleting }) => {
  const [imageSrc, setImageSrc] = useState(post.imageUrl || PLACEHOLDER_IMAGE);

  // If the image fails to load (e.g. network issues or deleted asset), swap it to our high-quality placeholder.
  const handleImageError = () => {
    if (imageSrc !== PLACEHOLDER_IMAGE) {
      setImageSrc(PLACEHOLDER_IMAGE);
    }
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return 'Recent';
    }
  };

  return (
    <article className="post-card" id={`post-card-${post._id}`} data-testid="post-card">
      <div className="card-image-container">
        <img
          src={imageSrc}
          alt={post.title}
          className="card-image"
          onError={handleImageError}
          loading="lazy"
        />
      </div>

      <div className="card-body">
        <div className="card-date" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Calendar size={12} />
          <span>{formatDate(post.createdAt || post.updatedAt)}</span>
        </div>

        <h3 className="card-title">{post.title}</h3>
        <p className="card-desc">{post.description}</p>

        <div className="card-actions">
          <button
            onClick={() => onEdit(post)}
            className="btn btn-secondary"
            style={{ flex: 1 }}
            disabled={isDeleting}
            id={`btn-edit-${post._id}`}
            aria-label="Edit post"
          >
            <Edit2 size={14} />
            <span>Edit</span>
          </button>
          
          <button
            onClick={() => onDelete(post._id)}
            className="btn btn-danger"
            style={{ flex: 1 }}
            disabled={isDeleting}
            id={`btn-delete-${post._id}`}
            aria-label="Delete post"
          >
            {isDeleting ? (
              <span className="spinner spinner-sm" data-testid="deleting-spinner"></span>
            ) : (
              <>
                <Trash2 size={14} />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
