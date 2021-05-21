import { NextFunction, Request, Response } from 'express';
import { createPostToDb, getAllPostsFromDb, getPostById, updatePostInDb } from '../service/post';
import { IUser } from '../../user/interface';

export const getAllPosts = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const {
    query: { offset, limit },
  } = req;

  const skip = Number(offset);
  const perPage = Number(limit);

  const response = await getAllPostsFromDb(skip, perPage);

  return res.json(response);
};

export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const {
    session: { body },
  } = req;

  const response = await createPostToDb(body);

  return res.json(response);
};

export const getOnePost = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const { params } = req;
  const postId = Number(params);

  const response = await getPostById(postId);

  return res.json(response);
};

export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const { body, params } = req;

  const postId = Number(params);
  const response = await updatePostInDb({ title, text });
};
