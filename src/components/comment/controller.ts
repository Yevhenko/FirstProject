import { Request, Response } from 'express';
import * as service from './service';

export const createComment = async (req: Request, res: Response): Promise<Response> => {
  const { body } = req;
  const { text } = body;

  const comment = await service.createCommentInDb(text);
  return res.json(comment);
};

export const getOneComment = async (req: Request, res: Response): Promise<Response> => {
  const { params } = req;

  const commentId = Number(params.id);
  const response = await service.getCommentFromDb(commentId);

  return res.json(response);
};

export const getAllComments = async (req: Request, res: Response): Promise<Response> => {
  const response = await service.getAllCommentsFromDb();

  return res.json(response);
};

export const updateComment = async (req: Request, res: Response): Promise<Response> => {
  const { params, body } = req;
  const { text } = body;

  const commentId = Number(params.id);
  const response = await service.updateCommentInDb(commentId, text);

  return res.json(response);
};

export const deleteComment = async (req: Request, res: Response): Promise<Response> => {
  const { params } = req;

  const commentId = Number(params.id);
  const response = await service.deleteComment(commentId);

  return res.json(response);
};
