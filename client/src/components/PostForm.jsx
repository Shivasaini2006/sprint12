import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Image, FileText, PlusCircle, Check } from 'lucide-react';
import { PostService } from '../services/api';

const PostForm = ({ editPost, onSuccess, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [apiError, setApiError] = useState('');
  
  const fileInputRef = useRef(null);

  // Prepopulate form if in edit mode
  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title || '');
      setDescription(editPost.description || '');
      setImagePreview(editPost.imageUrl || '');
      setImageFile(null); // Keep null unless user uploads a new file
    } else {
      setTitle('');
      setDescription('');
      setImagePreview('');
      setImageFile(null);
    }
    setErrors({});
    setApiError('');
    setProgress(0);
  }, [editPost]);

  // Clean up ObjectURL preview on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Validate the inputs
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Post title is required.';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters.';
    }

    if (!description.trim()) {
      newErrors.description = 'Post description is required.';
    }

    if (!editPost && !imageFile) {
      newErrors.image = 'An image file is required to create a post.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle file select and validate type/size
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, image: 'File is too large. Maximum size is 5MB.' }));
      return;
    }

    // Validate file type (image only)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF images are accepted.' }));
      return;
    }

    // Clear previous errors for file
    setErrors((prev) => {
      const rest = { ...prev };
      delete rest.image;
      return rest;
    });

    setImageFile(file);

    // Create object URL for preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleContainerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearImageSelection = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(editPost ? editPost.imageUrl : '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateForm()) return;

    setSubmitting(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      let savedPost;
      if (editPost) {
        // Run update API call
        savedPost = await PostService.update(editPost._id, formData, (percent) => {
          setProgress(percent);
        });
      } else {
        // Run create API call
        savedPost = await PostService.create(formData, (percent) => {
          setProgress(percent);
        });
      }

      onSuccess(savedPost, editPost ? 'updated' : 'created');
    } catch (err) {
      setApiError(err.message || 'Operation failed. Please try again.');
      setProgress(0);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} id="post-submission-form" data-testid="post-form">
      <h2 className="form-title" id="form-title-heading">
        {editPost ? 'Update Post' : 'Create New Post'}
      </h2>

      {apiError && (
        <div 
          className="form-group" 
          style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '6px', color: 'var(--danger)', fontSize: '0.9rem', marginBottom: '1.25rem' }}
          role="alert"
          id="form-api-error"
        >
          {apiError}
        </div>
      )}

      {/* Title Input */}
      <div className="form-group">
        <label className="form-label" htmlFor="title-input" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <FileText size={14} />
          <span>Title</span>
        </label>
        <input
          type="text"
          id="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter an engaging title..."
          className="form-input"
          disabled={submitting}
          style={errors.title ? { borderColor: 'var(--danger)' } : {}}
        />
        {errors.title && (
          <span className="error-message" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }} id="error-title">
            {errors.title}
          </span>
        )}
      </div>

      {/* Description Input */}
      <div className="form-group">
        <label className="form-label" htmlFor="description-input" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <FileText size={14} />
          <span>Description</span>
        </label>
        <textarea
          id="description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write your post content here..."
          className="form-textarea"
          disabled={submitting}
          style={errors.description ? { borderColor: 'var(--danger)' } : {}}
        />
        {errors.description && (
          <span className="error-message" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }} id="error-description">
            {errors.description}
          </span>
        )}
      </div>

      {/* Image Upload Input */}
      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Image size={14} />
          <span>Post Image</span>
        </label>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
          id="file-input"
          data-testid="file-input"
        />

        {imagePreview ? (
          <div className="upload-preview-wrapper" onClick={handleContainerClick}>
            <img src={imagePreview} alt="Preview" className="upload-preview" />
            <button
              type="button"
              onClick={clearImageSelection}
              className="upload-clear-btn"
              disabled={submitting}
              title="Remove image"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="upload-container" onClick={handleContainerClick} id="upload-zone" data-testid="upload-zone">
            <Upload size={28} className="upload-icon" />
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Click to select an image
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              JPEG, PNG, WEBP, or GIF (Max 5MB)
            </p>
          </div>
        )}

        {errors.image && (
          <span className="error-message" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }} id="error-image">
            {errors.image}
          </span>
        )}

        {/* Progress Bar */}
        {submitting && progress > 0 && (
          <div style={{ marginTop: '0.75rem' }} id="progress-wrapper">
            <div className="upload-progress-bar-wrapper">
              <div 
                className="upload-progress-bar" 
                style={{ width: `${progress}%` }}
                data-testid="upload-progress-bar"
              ></div>
            </div>
            <span className="upload-progress-text">
              Uploading image to Cloudinary: {progress}%
            </span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-secondary"
          style={{ flex: 1 }}
          disabled={submitting}
          id="btn-form-cancel"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ flex: 1 }}
          disabled={submitting}
          id="btn-form-submit"
        >
          {submitting ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="spinner spinner-sm" data-testid="submit-spinner"></span>
              <span>{editPost ? 'Updating...' : 'Creating...'}</span>
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {editPost ? <Check size={16} /> : <PlusCircle size={16} />}
              <span>{editPost ? 'Update Post' : 'Publish Post'}</span>
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
