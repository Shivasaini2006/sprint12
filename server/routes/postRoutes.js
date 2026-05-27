import express from 'express';
import { getPosts, createPost, updatePost, deletePost } from '../controllers/postController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Route: /api/posts
router.route('/')
  .get(getPosts)
  .post(upload.single('image'), createPost);

// Route: /api/posts/:id
router.route('/:id')
  .put(upload.single('image'), updatePost)
  .delete(deletePost);

export default router;
