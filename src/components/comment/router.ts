import express from 'express';
import { createComment, deleteComment, getAllComments, getOneComment, updateComment } from './controller';

export const comment = express.Router();

comment
  .post('/comments', createComment)
  .get('/comments', getAllComments)
  .get('/comments/:id', getOneComment)
  .delete('/comments/:id', deleteComment)
  .patch('/comments/:id', updateComment);
