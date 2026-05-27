import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { PostService } from '../services/api';

// Mock the API service layer
vi.mock('../services/api', () => {
  return {
    PostService: {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    },
    default: {
      create: vi.fn(() => ({
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        }
      }))
    }
  };
});

const mockPosts = [
  {
    _id: 'post-1',
    title: 'First Mock Post',
    description: 'This is the first mock post description.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    createdAt: '2026-05-27T10:00:00.000Z'
  },
  {
    _id: 'post-2',
    title: 'Second Mock Post',
    description: 'This is the second mock post description.',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    createdAt: '2026-05-27T11:00:00.000Z'
  }
];

describe('PostSphere MERN Client Application Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton loader initially and then renders posts list', async () => {
    PostService.getAll.mockResolvedValue(mockPosts);

    render(<App />);

    // Loader title should show up
    expect(screen.getByText(/Loading posts from MongoDB.../i)).toBeInTheDocument();
    
    // Skeleton cards should render initially
    const skeletons = screen.getAllByTestId('skeleton-card');
    expect(skeletons.length).toBeGreaterThan(0);

    // Wait for the mock API resolving state to apply
    await waitFor(() => {
      expect(screen.getByText('First Mock Post')).toBeInTheDocument();
      expect(screen.getByText('Second Mock Post')).toBeInTheDocument();
    });

    // Check header branding and buttons
    expect(screen.getByText('PostSphere')).toBeInTheDocument();
    expect(screen.getByText('Recent Posts (2)')).toBeInTheDocument();
  });

  it('renders an empty state screen if there are no posts in the database', async () => {
    PostService.getAll.mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No Posts Found')).toBeInTheDocument();
      expect(screen.getByText(/Share your thoughts/i)).toBeInTheDocument();
      expect(screen.getByText('Create First Post')).toBeInTheDocument();
    });
  });

  it('renders connection failed error boundary if API load fails', async () => {
    PostService.getAll.mockRejectedValue(new Error('Network error. Cannot reach database.'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Server Connection Failed')).toBeInTheDocument();
      expect(screen.getAllByText('Network error. Cannot reach database.').length).toBeGreaterThan(0);
      expect(screen.getByText('Retry Connection')).toBeInTheDocument();
    });
  });

  it('opens create modal, validates empty inputs, and uploads a new post successfully', async () => {
    PostService.getAll.mockResolvedValue([]);
    PostService.create.mockResolvedValue({
      _id: 'post-new',
      title: 'Testing New Post Title',
      description: 'Testing new post description content details.',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
      createdAt: new Date().toISOString()
    });

    const user = userEvent.setup();
    render(<App />);

    // Wait for empty state loading
    await waitFor(() => {
      expect(screen.getByText('No Posts Found')).toBeInTheDocument();
    });

    // Open creation modal
    const createBtn = screen.getByText('Create First Post');
    await user.click(createBtn);

    // Modal title should show
    expect(screen.getByText('Create New Post')).toBeInTheDocument();

    // Trigger validation by clicking publish directly without entering data
    const publishBtn = screen.getByText('Publish Post');
    await user.click(publishBtn);

    // Error messages should appear
    expect(screen.getByText('Post title is required.')).toBeInTheDocument();
    expect(screen.getByText('Post description is required.')).toBeInTheDocument();
    expect(screen.getByText('An image file is required to create a post.')).toBeInTheDocument();

    // Fill form elements
    const titleInput = screen.getByPlaceholderText('Enter an engaging title...');
    const descTextarea = screen.getByPlaceholderText('Write your post content here...');
    
    await user.type(titleInput, 'Testing New Post Title');
    await user.type(descTextarea, 'Testing new post description content details.');

    // Simulate file upload selecting
    const fileInput = screen.getByTestId('file-input');
    const fakeFile = new File(['mockContent'], 'test-image.png', { type: 'image/png' });
    
    await user.upload(fileInput, fakeFile);

    // Verify file select update states (clear button should be visible)
    const removeImgBtn = screen.getByTitle('Remove image');
    expect(removeImgBtn).toBeInTheDocument();

    // Submit form
    await user.click(screen.getByText('Publish Post'));

    // Modal should close and UI update instantly
    await waitFor(() => {
      expect(screen.queryByText('Create New Post')).not.toBeInTheDocument();
      expect(screen.getByText('Testing New Post Title')).toBeInTheDocument();
      expect(screen.getByText('Testing new post description content details.')).toBeInTheDocument();
    });
  });

  it('performs post edit updates and triggers PUT API calls', async () => {
    PostService.getAll.mockResolvedValue([mockPosts[0]]);
    PostService.update.mockResolvedValue({
      ...mockPosts[0],
      title: 'Updated Post Title Name',
      description: 'Updated Post description details.'
    });

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('First Mock Post')).toBeInTheDocument();
    });

    // Click edit button
    const editBtn = screen.getByLabelText('Edit post');
    await user.click(editBtn);

    // Check modal displays
    expect(screen.getByRole('heading', { name: 'Update Post' })).toBeInTheDocument();
    
    // Check form fields are filled
    const titleInput = screen.getByPlaceholderText('Enter an engaging title...');
    expect(titleInput.value).toBe('First Mock Post');

    // Make edits
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Post Title Name');

    const submitBtn = screen.getByRole('button', { name: 'Update Post' });
    await user.click(submitBtn);

    // Check UI updates
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Update Post' })).not.toBeInTheDocument();
      expect(screen.getByText('Updated Post Title Name')).toBeInTheDocument();
    });
  });

  it('triggers post delete operations and updates list optimistically', async () => {
    PostService.getAll.mockResolvedValue(mockPosts);
    PostService.delete.mockResolvedValue({ success: true });

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('First Mock Post')).toBeInTheDocument();
      expect(screen.getByText('Second Mock Post')).toBeInTheDocument();
    });

    // Select delete button for first post
    const deleteButtons = screen.getAllByLabelText('Delete post');
    
    // Click delete
    await user.click(deleteButtons[0]);

    // Check optimistic update instantly removes the card or shows progress
    expect(screen.queryByText('First Mock Post')).not.toBeInTheDocument();
    expect(screen.getByText('Second Mock Post')).toBeInTheDocument();
  });
});
