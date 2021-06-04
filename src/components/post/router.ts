import express from 'express';
import { validateRequest } from '@utils/requestValidation';
import { getQuerySchema, paramsSchema } from '@utils/schemas';
import { postSchemas } from '@components/post';
import { createPost, deletePost, getAllPosts, getOnePost, updatePost } from './controller';

export const post = express.Router();

post
  .post('/posts', validateRequest(postSchemas.createPostSchema), createPost)
  .get('/posts', validateRequest(getQuerySchema), getAllPosts)
  .get('/posts/:id', validateRequest(paramsSchema), getOnePost)
  .delete('/posts/:id', validateRequest(paramsSchema), deletePost)
  .patch('/posts/:id', validateRequest(postSchemas.updatePostSchema), updatePost);
