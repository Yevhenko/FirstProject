import { Request, Response } from 'express';
import { getPostById } from '@components/post/service';
import * as service from './service';

export const createComment = async (req: Request, res: Response): Promise<Response> => {
  const {
    body: { text, postId },
    user,
  } = req;
  const post = await getPostById(postId);
  const comment = await service.createCommentInDb({ text, user, post });
  return res.json(comment);
};

export const getOneComment = async (req: Request, res: Response): Promise<Response> => {
  const { params } = req;

  const commentId = Number(params.id);
  const response = await service.getCommentFromDb(commentId);

  return res.json(response);
};

export const getAllComments = async (req: Request, res: Response): Promise<Response> => {
  const {
    query: { offset, limit },
  } = req;

  const response = await service.getAllCommentsFromDb(Number(offset), Number(limit));

  return res.json(response);
};

export const updateComment = async (req: Request, res: Response): Promise<Response> => {
  const { params, body } = req;
  const { text } = body;

  const commentId = Number(params.id);

  const userId = await service.getUserIdOfTheComment(commentId);

  if (userId !== req.user.id) return res.sendStatus(403);
  await service.updateCommentInDb(commentId, text);

  return res.sendStatus(200);
};

export const deleteComment = async (req: Request, res: Response): Promise<Response> => {
  const { params } = req;

  const commentId = Number(params.id);
  const userId = await service.getUserIdOfTheComment(commentId);

  if (userId !== req.user.id) return res.sendStatus(403);
  await service.deleteCommentFromDb(commentId);

  return res.sendStatus(200);
};
