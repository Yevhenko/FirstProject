import { getRepository } from 'typeorm';
import { Post } from './models/Post';
import { IPost } from './interfaces';

export const createPostInDb = async (data: IPost): Promise<IPost> => {
  const postRepo = getRepository(Post);
  const post = await postRepo.create(data);

  return await postRepo.save(post);
};

export const getPostById = async (id: number): Promise<Post> => {
  const postRepo = getRepository(Post);
  const post = await postRepo
    .createQueryBuilder('post')
    .where('post.id = :id', { id })
    .select(['post.id', 'post.title', 'post.text', 'post.userId', 'post.createdAt', 'post.updatedAt'])
    .execute();

  if (!post) throw new Error('post not found');

  return post;
};

export const getAllPostsFromDb = async (
  offset: number,
  limit: number,
): Promise<{ id: number; text: string; title: string }[]> => {
  const postRepo = await getRepository(Post);
  const posts = await postRepo.createQueryBuilder('post').skip(offset).take(limit).getMany();

  return posts;
};

export const updatePostInDb = async (id: number, title?: string, text?: string): Promise<void | null> => {
  const postRepo = getRepository(Post);
  const post = await postRepo.findOne({ where: { id } });

  if (!post) throw new Error('no post');
  postRepo.merge(post, { title, text });
  await postRepo.save(post);
};

export const deletePostFromDb = async (id: number) => await getRepository(Post).delete(id);

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
