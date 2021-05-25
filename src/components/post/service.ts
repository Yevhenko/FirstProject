import { getRepository } from 'typeorm';
import { Post } from './models/Post';
import { IPost } from './interfaces';

export const createPostInDb = async (data: IPost): Promise<IPost | null> => {
  const post = getRepository(Post).create(data);

  console.log(post);

  return await getRepository(Post).save(post);
};

export const getPostById = async (id: number): Promise<Post> => {
  const post = await getRepository(Post).findOne({
    where: {
      id,
    },
  });

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

export const permissionToEditPost = async (postId: number, userId: number | undefined): Promise<boolean | null> => {
  const post = await getPostById(postId);
  if (post.user.id !== userId) return false;
  return true;
};

export const getPostByUserId = async (id: number): Promise<Post> => {
  const post = await getRepository(Post).findOne({
    where: {
      id,
    },
  });

  if (!post) throw new Error('post not found');

  return post;
};
