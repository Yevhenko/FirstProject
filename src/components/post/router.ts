import express from 'express';
import { createPost, deletePost, getAllPosts, getOnePost, updatePost } from './controller';
import { validateRequest } from '../../utils/requestValidation';
import { postSchema } from '../../utils/schemas';

export const post = express.Router();

post
  .post('/posts', validateRequest(postSchema), createPost)
  .get('/posts', getAllPosts)
  .get('/posts/:id', getOnePost)
  .delete('/posts/:id', deletePost)
  .patch('/posts/:id', validateRequest(postSchema), updatePost);
