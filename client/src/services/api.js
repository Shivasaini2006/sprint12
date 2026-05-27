import axios from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a custom Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30-second timeout
});

/**
 * Handle API error parsing to return friendly messages.
 */
const parseError = (error) => {
  if (error.response) {
    // Server responded with non-2xx code
    return error.response.data?.message || 'Server returned an error. Please try again.';
  } else if (error.request) {
    // Request made but no response (server is down or connection failure)
    return 'Cannot reach the server. Please verify if the backend service is active.';
  } else {
    // Configuration / exception error
    return error.message || 'An unexpected error occurred.';
  }
};

/**
 * API Service wrapper endpoints
 */
export const PostService = {
  /**
   * Fetch all posts
   */
  getAll: async () => {
    try {
      const response = await apiClient.get('/posts');
      return response.data?.data?.posts || [];
    } catch (error) {
      throw new Error(parseError(error));
    }
  },

  /**
   * Create a new post
   * Requires FormData containing title, description, and image binary file.
   */
  create: async (formData, onProgress) => {
    try {
      const response = await apiClient.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // Hook up progress callback
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        }
      });
      return response.data?.data?.post;
    } catch (error) {
      throw new Error(parseError(error));
    }
  },

  /**
   * Update an existing post
   * Requires FormData. Image file is optional.
   */
  update: async (id, formData, onProgress) => {
    try {
      const response = await apiClient.put(`/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        }
      });
      return response.data?.data?.post;
    } catch (error) {
      throw new Error(parseError(error));
    }
  },

  /**
   * Delete a post
   */
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(parseError(error));
    }
  }
};

export default apiClient;
