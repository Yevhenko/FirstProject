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
    body: { title, text },
    user,
  } = req;

  if (!title || !text) return res.status(404).send('data not found');

  if (!user) return res.status(404).send('no data');
  const post = await createPostInDb({ title, text, user });

  return res.json({ id: post?.id, title: post?.title, text: post?.text, userId: post?.user.id });
};

export const getOnePost = async (
  req: userInterface.ModifiedRequest,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const { params } = req;
  const postId = Number(params.id);

  const post = await getPostById(postId);

  return res.json(post);
};

export const updatePost = async (
  req: userInterface.ModifiedRequest,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const {
    body: { title, text },
    params,
  } = req;

  const postId = Number(params.id);
  const userId = await getUserIdOfThePost(postId);

  if (userId !== req.user?.id) return res.status(403).send('forbidden');
  const response = await updatePostInDb(postId, title, text);

  return res.json(response);
};

export const deletePost = async (
  req: userInterface.ModifiedRequest,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  const { params } = req;

  const postId = Number(params.id);
  const userId = await getUserIdOfThePost(postId);

  if (userId !== req.user?.id) return res.status(403).send('forbidden');
  const response = await deletePostFromDb(postId);

  return res.send(response);
};
