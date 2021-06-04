import express from 'express';
import { createPost, deletePost, getAllPosts, getOnePost, updatePost } from './controller';
import { validateRequest } from '../../utils/requestValidation';
import { createPostSchema, getQuerySchema, paramsSchema, updatePostSchema } from '../../utils/schemas';

export const post = express.Router();

post
  .post('/posts', validateRequest(createPostSchema), createPost)
  .get('/posts', validateRequest(getQuerySchema), getAllPosts)
  .get('/posts/:id', validateRequest(paramsSchema), getOnePost)
  .delete('/posts/:id', validateRequest(paramsSchema), deletePost)
  .patch('/posts/:id', validateRequest(updatePostSchema), updatePost);
