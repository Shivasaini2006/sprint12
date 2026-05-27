import Post from '../models/Post.js';
import { uploadBufferToCloudinary } from '../utils/cloudinaryUploader.js';
import { ApiError } from '../middlewares/errorHandler.js';
import cloudinary from '../config/cloudinary.js';

/**
 * Helper to extract Cloudinary public ID from secure URL.
 * Example URL: https://res.cloudinary.com/demo/image/upload/v1570975253/posts/my_image_id.png
 * Public ID would be: posts/my_image_id (without extension)
 */
const extractPublicId = (url) => {
  try {
    const parts = url.split('/');
    const uploadsIndex = parts.indexOf('upload');
    if (uploadsIndex === -1) return null;
    
    // Everything after the version ('v12345678') is part of the public ID
    // Find version index (starts with 'v' followed by numbers)
    let versionIndex = uploadsIndex + 1;
    while (versionIndex < parts.length && !/^v\d+/.test(parts[versionIndex])) {
      versionIndex++;
    }
    
    // Slice from after the version up to the end
    const pathParts = parts.slice(versionIndex + 1);
    const filenameWithExtension = pathParts.join('/');
    const publicId = filenameWithExtension.split('.')[0];
    return publicId;
  } catch (error) {
    console.error('Failed to parse Cloudinary URL public_id:', error);
    return null;
  }
};

/**
 * @desc    Get all posts
 * @route   GET /api/posts
 * @access  Public
 */
export const getPosts = async (req, res, next) => {
  try {
    // Fetch all posts and sort by creation date (newest first)
    const posts = await Post.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: { posts }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Public
 */
export const createPost = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    // Validate textual inputs
    if (!title || !title.trim()) {
      return next(new ApiError(400, 'Title is required.'));
    }
    if (!description || !description.trim()) {
      return next(new ApiError(400, 'Description is required.'));
    }

    // Validate that a file has been uploaded
    if (!req.file) {
      return next(new ApiError(400, 'Image file is required.'));
    }

    let imageUrl = '';
    try {
      // Upload buffered binary directly to Cloudinary
      const cloudinaryResult = await uploadBufferToCloudinary(req.file.buffer, 'posts');
      imageUrl = cloudinaryResult.secure_url;
    } catch (uploadError) {
      console.error('Image upload failed during create:', uploadError);
      return next(new ApiError(500, `Image upload failed: ${uploadError.message}`));
    }

    // Save metadata + Cloudinary image link in MongoDB
    const post = await Post.create({
      title: title.trim(),
      description: description.trim(),
      imageUrl
    });

    res.status(201).json({
      status: 'success',
      message: 'Post created successfully!',
      data: { post }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing post
 * @route   PUT /api/posts/:id
 * @access  Public
 */
export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Find the current post first
    const post = await Post.findById(id);
    if (!post) {
      return next(new ApiError(404, `No post found with ID: ${id}`));
    }

    // Update textual properties if provided
    if (title !== undefined) {
      if (!title.trim()) return next(new ApiError(400, 'Title cannot be empty.'));
      post.title = title.trim();
    }
    if (description !== undefined) {
      if (!description.trim()) return next(new ApiError(400, 'Description cannot be empty.'));
      post.description = description.trim();
    }

    // If a new image file is provided, upload it and replace the old image URL
    if (req.file) {
      let newImageUrl = '';
      try {
        // Upload new image
        const cloudinaryResult = await uploadBufferToCloudinary(req.file.buffer, 'posts');
        newImageUrl = cloudinaryResult.secure_url;

        // Try to delete old image from Cloudinary to clean up storage (best practice)
        const oldPublicId = extractPublicId(post.imageUrl);
        if (oldPublicId) {
          cloudinary.uploader.destroy(oldPublicId).catch((err) => {
            console.warn('Failed to delete old image from Cloudinary (non-blocking):', err);
          });
        }

        post.imageUrl = newImageUrl;
      } catch (uploadError) {
        console.error('Image upload failed during update:', uploadError);
        return next(new ApiError(500, `Failed to upload new image: ${uploadError.message}`));
      }
    }

    // Save updated model back to MongoDB
    await post.save();

    res.status(200).json({
      status: 'success',
      message: 'Post updated successfully!',
      data: { post }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a post
 * @route   DELETE /api/posts/:id
 * @access  Public
 */
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return next(new ApiError(404, `No post found with ID: ${id}`));
    }

    // Try to delete the linked image from Cloudinary (non-blocking)
    const publicId = extractPublicId(post.imageUrl);
    if (publicId) {
      cloudinary.uploader.destroy(publicId).catch((err) => {
        console.warn('Failed to delete image from Cloudinary during post deletion (non-blocking):', err);
      });
    }

    // Delete post document from MongoDB
    await Post.findByIdAndDelete(id);

    res.status(200).json({
      status: 'success',
      message: 'Post deleted successfully!'
    });
  } catch (error) {
    next(error);
  }
};
