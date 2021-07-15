import { createQueryBuilder, getRepository } from 'typeorm';
import { Comment } from '@components/comment/models/Comment';
import { Post } from '@components/post';
import { IComment } from './interfaces';

export const createCommentInDb = async (data: IComment): Promise<IComment> => {
  const comRepo = getRepository(Comment);
  const comment = await comRepo.create(data);

  return await comRepo.save(comment);
};

export const getCommentFromDb = async (id: number): Promise<Comment | undefined> => {
  return await createQueryBuilder()
    .select(['comment'])
    .from(Comment, 'comment')
    .where('comment.id = :id', { id })
    .getOne();
};

export const getAllCommentsFromDb = async (offset: number, limit: number): Promise<any> => {
  const comRepo = getRepository(Comment);
  const comments = await comRepo.createQueryBuilder().skip(offset).take(limit).getMany();

  return comments.map((c) => {
    return { id: c.id, text: c.text };
  });
};

export const updateCommentInDb = async (id: number, title?: string, text?: string): Promise<void | null> => {
  const comRepo = getRepository(Comment);
  const comment = await comRepo.findOne({ where: { id } });

  if (!comment) throw new Error('no comment');
  comRepo.merge(comment, { text });
  await comRepo.save(comment);
};

export const deleteCommentFromDb = async (id: number) => await getRepository(Comment).delete(id);

export const getUserIdOfTheComment = async (commentId: number): Promise<Error | number> => {
  const userId = await createQueryBuilder('comment')
    .select('comment.userId')
    .from(Comment, 'comment')
    .leftJoinAndSelect('comment.user', 'user')
    .where('comment.id = :id', { id: commentId })
    .execute();

  if (userId.length === 0) throw new Error('userId not found');

  return userId[0].userId;
};
