import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Compass, AlertCircle, X } from 'lucide-react';
import { PostService } from './services/api';
import PostCard from './components/PostCard';
import PostForm from './components/PostForm';
import SkeletonLoader from './components/SkeletonLoader';
import Toast from './components/Toast';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submittingPost, setSubmittingPost] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);
  
  // Modal controllers
  const [showModal, setShowModal] = useState(false);
  const [currentEditPost, setCurrentEditPost] = useState(null);

  // Toast Notification controller
  const [toast, setToast] = useState(null);

  // Fetch all posts from backend
  const fetchPosts = async (showSilently = false) => {
    if (!showSilently) setLoading(true);
    setError('');
    try {
      const data = await PostService.getAll();
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError(err.message || 'Could not load posts. Please verify if the server is running.');
      showToast(err.message || 'Failed to fetch posts from server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCreateClick = () => {
    setCurrentEditPost(null);
    setShowModal(true);
  };

  const handleEditClick = (post) => {
    setCurrentEditPost(post);
    setShowModal(true);
  };

  const handleFormSuccess = (savedPost, actionType) => {
    setShowModal(false);
    
    if (actionType === 'created') {
      // Add new post to top of list
      setPosts((prev) => [savedPost, ...prev]);
      showToast('Your post has been published successfully!', 'success');
    } else if (actionType === 'updated') {
      // Update post in the list
      setPosts((prev) =>
        prev.map((item) => (item._id === savedPost._id ? savedPost : item))
      );
      showToast('Your post has been updated successfully!', 'success');
    }
  };

  const handleDeletePost = async (id) => {
    // Keep a copy of previous posts for optimistic rollback
    const previousPosts = [...posts];

    // Optimistic UI Update: immediately remove from UI
    setPosts((prev) => prev.filter((post) => post._id !== id));
    setDeletingPostId(id);
    showToast('Deleting post...', 'info');

    try {
      await PostService.delete(id);
      showToast('Post removed successfully!', 'success');
    } catch (err) {
      console.error('Delete request failed:', err);
      // Rollback to previous state if API call failed
      setPosts(previousPosts);
      showToast(`Delete failed: ${err.message}`, 'error');
    } finally {
      setDeletingPostId(null);
    }
  };

  return (
    <div className="app-container" id="app-root-viewport">
      {/* Dynamic Toast Alerts */}
      {toast && (
        <div className="toast-container" id="global-toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* Glassmorphic Navbar Header */}
      <header className="header" id="app-header">
        <div className="header-content">
          <div className="brand" id="brand-logo">
            <Compass size={28} style={{ color: 'var(--primary)' }} />
            <span>PostSphere</span>
          </div>
          <button
            onClick={handleCreateClick}
            className="btn btn-primary"
            id="btn-create-post"
            aria-label="Create new post"
          >
            <Plus size={18} />
            <span>Create Post</span>
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <main className="main-content" id="app-main-content">
        {error && (
          <div className="error-boundary-wrapper" id="error-boundary" role="alert">
            <AlertCircle size={48} style={{ color: 'var(--danger)' }} />
            <h2 className="error-boundary-title">Server Connection Failed</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
            <button
              onClick={() => fetchPosts()}
              className="btn btn-primary"
              style={{ background: 'var(--danger)', boxShadow: 'none' }}
              id="btn-retry-fetch"
            >
              <RefreshCw size={14} />
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {!error && loading && (
          <div id="posts-loading-placeholder">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
              Loading posts from MongoDB...
            </h2>
            <SkeletonLoader count={3} />
          </div>
        )}

        {!error && !loading && posts.length === 0 && (
          <div className="empty-state" id="posts-empty-state">
            <Compass size={64} className="empty-state-icon" />
            <h3 className="empty-state-title">No Posts Found</h3>
            <p className="empty-state-desc">
              Share your thoughts, experiences, or stories with the world. Click the button below to create your first post!
            </p>
            <button
              onClick={handleCreateClick}
              className="btn btn-primary"
              id="btn-empty-state-create"
            >
              <Plus size={16} />
              <span>Create First Post</span>
            </button>
          </div>
        )}

        {!error && !loading && posts.length > 0 && (
          <div id="posts-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }} id="feed-heading">
                Recent Posts ({posts.length})
              </h2>
              <button
                onClick={() => fetchPosts(true)}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                title="Refresh posts feed"
                id="btn-refresh-feed"
                aria-label="Refresh feed"
              >
                <RefreshCw size={14} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="posts-grid" id="posts-grid-container">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onEdit={handleEditClick}
                  onDelete={handleDeletePost}
                  isDeleting={deletingPostId === post._id}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Creation / Editing Modal Popover */}
      {showModal && (
        <div className="modal-overlay" id="form-modal-overlay">
          <div className="modal-content" id="form-modal-container">
            <button
              onClick={() => setShowModal(false)}
              className="modal-close"
              aria-label="Close dialog"
              id="btn-close-modal"
            >
              <X size={20} />
            </button>
            <PostForm
              editPost={currentEditPost}
              onSuccess={handleFormSuccess}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
