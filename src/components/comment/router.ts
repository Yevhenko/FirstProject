import express from 'express';
import { validateRequest } from '@utils/requestValidation';
import { createCommentSchema, updateCommentSchema } from '@components/comment/schemas';
import { getQuerySchema, paramsSchema } from '@utils/schemas';
import { createComment, deleteComment, getAllComments, getOneComment, updateComment } from './controller';

export const comment = express.Router();

comment
  .post('/comments', validateRequest(createCommentSchema), createComment)
  .get('/comments', validateRequest(getQuerySchema), getAllComments)
  .get('/comments/:id', validateRequest(paramsSchema), getOneComment)
  .delete('/comments/:id', validateRequest(paramsSchema), deleteComment)
  .patch('/comments/:id', validateRequest(updateCommentSchema), updateComment);
