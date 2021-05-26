import express from 'express';
import { createPost, deletePost, getAllPosts, getOnePost, updatePost } from './controller';

export const post = express.Router();

post
  .post('/posts', createPost)
  .get('/posts', getAllPosts)
  .get('/posts/:id', getOnePost)
  .delete('/posts/:id', deletePost)
  .patch('/posts/:id', updatePost);
