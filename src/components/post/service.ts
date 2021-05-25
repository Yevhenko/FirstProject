import { createQueryBuilder, getRepository, SelectQueryBuilder } from 'typeorm';
import { Post } from './models/Post';
import { IPost } from './interfaces';

export const createPostInDb = async (data: IPost): Promise<IPost | null> => {
  const post = getRepository(Post).create(data);

  return await getRepository(Post).save(post);
};

export const getPostById = async (id: number): Promise<Post> => {
  const post = getRepository(Post)
    .createQueryBuilder('post')
    .where('post.id = :id', { id })
    .select(['post.id', 'post.title', 'post.textInPost', 'post.createdAt', 'post.updatedAt'])
    .execute();

  if (!post) throw new Error('post not found');

  return post;
};

export const getAllPostsFromDb = async (
  skip: number,
  perPage: number,
): Promise<{ id: number; textInPost: string; title: string }[]> => {
  const posts = await getRepository(Post).createQueryBuilder('post').skip(skip).take(perPage).getMany();

  return posts.map((p) => ({ id: p.id, title: p.title, textInPost: p.textInPost }));
};

export const updatePostInDb = async (id: number, title?: string, textInPost?: string): Promise<string | null> => {
  const post = await getRepository(Post).findOne({ where: { id } });

  if (!post) return null;
  getRepository(Post).merge(post, { title, textInPost });
  await getRepository(Post).save(post);

  return 'Post updated!';
};

export const deletePostFromDb = async (id: number): Promise<string> => {
  await getRepository(Post).delete(id);
  return 'Post has been deleted';
};

export const getUserIdOfThePost = async (
  id: number,
): Promise<{ userId: number; find(param: (e: { userId: number }) => number): any }> => {
  const userId = getRepository(Post)
    .createQueryBuilder('post')
    .leftJoinAndSelect('post.user', 'user')
    .where('post.id = :id', { id })
    .select(['post.userId'])
    .execute();

  if (!userId) throw new Error('post not found');

  return userId;
};
