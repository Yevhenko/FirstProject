import { Response } from 'express';
import { ModifiedRequest } from '@constants/interfaces';
import * as service from './service';

export const getAllPosts = async (req: ModifiedRequest, res: Response): Promise<Response> => {
  const {
    query: { offset, limit },
  } = req;

  const posts = await service.getAllPostsFromDb(Number(offset), Number(limit));

  return res.json(posts.map((p) => ({ id: p.id, title: p.title, text: p.text })));
};

export const createPost = async (req: ModifiedRequest, res: Response): Promise<Response> => {
  const {
    body: { title, text },
    user,
  } = req;

  const post = await service.createPostInDb({ title, text, user });

  return res.json({ id: post?.id, title: post?.title, text: post?.text, userId: post?.user?.id });
};

export const getOnePost = async (req: ModifiedRequest, res: Response): Promise<Response> => {
  const { params } = req;
  const postId = Number(params.id);

  const post = await service.getPostById(postId);

  return res.json(post);
};

export const updatePost = async (req: ModifiedRequest, res: Response): Promise<Response> => {
  const {
    body: { title, text },
    params,
  } = req;

  const postId = Number(params.id);
  const userId = await service.getUserIdOfThePost(postId);

  if (userId !== req.user?.id) return res.status(403).send('forbidden');
  await service.updatePostInDb(postId, title, text);

  return res.status(200).send();
};

export const deletePost = async (req: ModifiedRequest, res: Response): Promise<Response> => {
  const { params } = req;

  const postId = Number(params.id);
  const userId = await service.getUserIdOfThePost(postId);

  if (userId !== req.user?.id) return res.status(403).send('forbidden');
  await service.deletePostFromDb(postId);

  return res.status(200).send();
};
