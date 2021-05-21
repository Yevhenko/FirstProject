import { getRepository } from 'typeorm';

import { Post } from '../models/Post';
import { IPost } from '../interface/interfaces';
import { env } from '../../../config';

export const createPostToDb = async (data: IPost): Promise<IPost> => {
  const post = getRepository(Post).create(data);

  const result = await getRepository(Post).save(post);

  return result;
};

export const getPostById = async (id?: number): Promise<IPost> => {
  const post = await getRepository(Post).findOne({
    where: {
      id,
    },
  });

  return post;
};

export const getAllPostsFromDb = async (skip: number, perPage: number): Promise<IPost[]> => {
  const posts = await getRepository(Post).createQueryBuilder('post').skip(skip).take(perPage).getMany();

  return posts.map((p) => ({ id: p.id, title: p.title }));
};

export const updatePostInDb = async (id: number, title?: string, text?: string): Promise<string | null> => {
  const post = await getRepository(Post).findOne({ where: { id } });

  if (!title || !text) return null;
  getRepository(Post).merge(post, { title, text });
  await getRepository(Post).save(post);

  return 'Post updated!';
};

export const deletePostFromDb = async (id: number): Promise<string> => {
  await getRepository(Post).delete(id);
  return 'Post has been deleted';
};
