import express from 'express';
import { createPost, deletePost, getAllPosts, getOnePost, updatePost } from './controller';
import { validateBody, validateParams, validateQuery } from '../../utils/requestValidation';
import { paramsSchema, postBodySchema, querySchema } from '../../utils/schemas';

export const post = express.Router();

post
  .post('/posts', validateBody(postBodySchema), createPost)
  .get('/posts', validateQuery(querySchema), getAllPosts)
  .get('/posts/:id', validateParams(paramsSchema), getOnePost)
  .delete('/posts/:id', validateParams(paramsSchema), deletePost)
  .patch('/posts/:id', validateParams(paramsSchema), validateBody(postBodySchema), updatePost);
