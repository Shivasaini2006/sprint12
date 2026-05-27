import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required.'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters.']
    },
    description: {
      type: String,
      required: [true, 'Post description is required.'],
      trim: true
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required. Please upload an image.']
    }
  },
  {
    timestamps: true // This will automatically manage 'createdAt' and 'updatedAt' fields
  }
);

// Fallback logic to check virtual / custom mapping if user explicitly requests 'createdAt'
// Our schema already provides createdAt automatically through timestamps: true.

const Post = mongoose.model('Post', postSchema);

export default Post;
