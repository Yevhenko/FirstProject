import { NextFunction, Response } from 'express';
import {
  createPostInDb,
  deletePostFromDb,
  getAllPostsFromDb,
  getPostById,
  getUserIdOfThePost,
  updatePostInDb,
} from './service';
import { userInterface } from '../user';
import session from 'express-session';

export const getAllPosts = async (
  req: userInterface.ModifiedRequest,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const {
    query: { offset, limit },
  } = req;

  const skip = Number(offset);
  const perPage = Number(limit);

  const response = await getAllPostsFromDb(skip, perPage);

  return res.json(response);
};

export const createPost = async (
  req: userInterface.ModifiedRequest,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const {
    body: { title, textInPost },
    user,
  } = req;

  if (!title || !textInPost) return res.status(404).send('data not found');

  if (!user) return res.status(404).send('no data');
  const response = await createPostInDb({ title, textInPost, user });

  return res.json(response);
};

export const getOnePost = async (
  req: userInterface.ModifiedRequest,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const { params } = req;
  const postId = Number(params.id);

  const response = await getPostById(postId);

  return res.json(response);
};

export const updatePost = async (
  req: userInterface.ModifiedRequest,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const {
    body: { title, textInPost },
    params,
  } = req;

  const postId = Number(params.id);
  const data = await getUserIdOfThePost(postId);
  const userId = data.find((e: { userId: number }) => e.userId).userId;

  console.log(userId);

  if (userId !== req.user?.id) return res.status(403).send('forbidden');
  const response = await updatePostInDb(postId, title, textInPost);

  return res.json(response);
};

export const deletePost = async (
  req: userInterface.ModifiedRequest,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const { params } = req;

  const postId = Number(params.id);
  const data = await getUserIdOfThePost(postId);
  const userId = data.find((e: { userId: number }) => e.userId).userId;

  if (userId !== req.user?.id) return res.status(403).send('forbidden');
  const response = await deletePostFromDb(postId);

  return res.send(response);
};
