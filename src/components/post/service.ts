import { getRepository } from 'typeorm';
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
    .select(['post.id', 'post.title', 'post.textInPost', 'post.userId', 'post.createdAt', 'post.updatedAt'])
    .execute();

  if (!post) throw new Error('post not found');

  return post;
};

export const getAllPostsFromDb = async (
  skip: number,
  perPage: number,
): Promise<{ id: number; text: string; title: string }[]> => {
  const posts = await getRepository(Post).createQueryBuilder('post').skip(skip).take(perPage).getMany();

  return posts.map((p) => ({ id: p.id, title: p.title, text: p.text }));
};

export const updatePostInDb = async (id: number, title?: string, text?: string): Promise<string | null> => {
  const post = await getRepository(Post).findOne({ where: { id } });

  if (!post) return null;
  getRepository(Post).merge(post, { title, text });
  await getRepository(Post).save(post);

  return 'Post updated!';
};

export const deletePostFromDb = async (id: number): Promise<string> => {
  await getRepository(Post).delete(id);
  return 'Post has been deleted';
};

export const getUserIdOfThePost = async (postId: number): Promise<Error | number> => {
  const userId = await getRepository(Post)
    .createQueryBuilder('post')
    .leftJoinAndSelect('post.user', 'user')
    .where('post.id = :id', { id: postId })
    .select('post.userId')
    .execute();

  if (userId.length === 0) throw new Error('userId not found');

  return userId[0].userId;
};
